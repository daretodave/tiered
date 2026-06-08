import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Consolidated from the former sibling `src/lib/supabase/server.test.ts`
// (§5a). Every prior case is retained verbatim; new edge coverage is
// appended below for the previously-untested helpers (castVote error
// + no-row + object-shape, postComment, flagComment, listThreadComments
// happy/degrade paths, getProfileActivity, claimAnonSession). No source
// change. The mock is extended with an optional chainable query-builder
// (`H.state.fromFn`) used only by the new query-path describes; when it
// is null the prior `{ upsert }` shape is returned unchanged, so the
// retained cases behave identically.

const H = vi.hoisted(() => {
  const upsertMock = vi.fn()
  const rpcMock = vi.fn()
  const state: { fromFn: ((table: string) => unknown) | null } = { fromFn: null }
  return { upsertMock, rpcMock, state }
})
// Back-compat aliases so the retained cases read exactly as before.
const upsertMock = H.upsertMock
const rpcMock = H.rpcMock

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (t: string) =>
      H.state.fromFn ? H.state.fromFn(t) : { upsert: H.upsertMock },
    rpc: H.rpcMock,
  }),
}))

// Chainable + thenable query-builder stub. Terminal `.limit()` returns
// the builder itself (the source code awaits the chain directly);
// `.maybeSingle()`/`.single()` resolve the result. `rec` optionally
// records the last `.limit()` arg + the call trail for assertions.
type QBResult = { data: unknown; error: unknown }
function makeQB(result: QBResult, rec?: { limit?: number; calls: unknown[][] }) {
  const qb: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'in', 'order', 'insert', 'upsert']) {
    qb[m] = (...a: unknown[]) => {
      rec?.calls.push([m, ...a])
      if (m === 'upsert') return H.upsertMock(...a)
      return qb
    }
  }
  qb['limit'] = (n: number) => {
    if (rec) rec.limit = n
    return qb
  }
  qb['maybeSingle'] = () => Promise.resolve(result)
  qb['single'] = () => Promise.resolve(result)
  qb['then'] = (
    res: (v: QBResult) => unknown,
    rej: (e: unknown) => unknown,
  ) => Promise.resolve(result).then(res, rej)
  return qb
}
// Queue results FIFO across multiple `client.from(...)` calls inside one
// helper invocation (listThreadComments hits comments→[comments]→users;
// claimAnonSession hits sessions→[sessions]).
function queueFrom(results: QBResult[], rec?: { limit?: number; calls: unknown[][] }) {
  const q = [...results]
  H.state.fromFn = () => makeQB(q.shift() ?? { data: null, error: null }, rec)
}

// Awaits a promise that must reject; returns the rejection typed as
// the pg-augmented Error so `.code`/`.hint` are accessible without
// widening to the resolved value type.
async function caught(
  p: Promise<unknown>,
): Promise<Error & { code?: string; hint?: string }> {
  try {
    await p
  } catch (e) {
    return e as Error & { code?: string; hint?: string }
  }
  throw new Error('expected promise to reject')
}

const HANDLE_DUP = {
  code: '23505',
  message: 'duplicate key value violates unique constraint "users_handle_key"',
}

const savedUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const savedKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

describe('upsertUser handle-collision disambiguation', () => {
  beforeEach(() => {
    upsertMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  // Strict-null-safe accessor for the nth upsert payload's handle.
  const handleArg = (i: number): string => {
    const arg = upsertMock.mock.calls[i]?.[0] as { handle?: unknown } | undefined
    if (!arg || typeof arg.handle !== 'string') {
      throw new Error(`expected an upsert call #${i} with a string handle`)
    }
    return arg.handle
  }

  it('writes once with the base handle when there is no collision', async () => {
    upsertMock.mockResolvedValueOnce({ error: null })
    const { upsertUser } = await import('../server')
    await upsertUser({ sub: 'auth0|alice', handle: 'dave' })
    expect(upsertMock).toHaveBeenCalledTimes(1)
    expect(handleArg(0)).toBe('dave')
  })

  it('retries with a deterministic sub-scoped handle on a users_handle_key 23505', async () => {
    upsertMock
      .mockResolvedValueOnce({ error: HANDLE_DUP })
      .mockResolvedValueOnce({ error: null })
    const { upsertUser } = await import('../server')
    await upsertUser({ sub: 'auth0|bob', handle: 'dave' })
    expect(upsertMock).toHaveBeenCalledTimes(2)
    const retried = handleArg(1)
    expect(retried).toMatch(/^dave-[a-z0-9]{1,6}$/)

    // Stable per sub: a second resolve for the same sub disambiguates
    // to the exact same handle (idempotent re-login).
    upsertMock.mockReset()
    upsertMock
      .mockResolvedValueOnce({ error: HANDLE_DUP })
      .mockResolvedValueOnce({ error: null })
    vi.resetModules()
    const again = await import('../server')
    await again.upsertUser({ sub: 'auth0|bob', handle: 'dave' })
    expect(handleArg(1)).toBe(retried)
  })

  it('propagates non-collision errors without retrying', async () => {
    upsertMock.mockResolvedValueOnce({ error: { code: '42501', message: 'rls denied' } })
    const { upsertUser } = await import('../server')
    await expect(upsertUser({ sub: 'auth0|x', handle: 'dave' })).rejects.toThrow(/rls denied/)
    expect(upsertMock).toHaveBeenCalledTimes(1)
  })

  // --- new edge coverage ---

  it('does NOT retry a 23505 that is not a users_handle_key violation', async () => {
    // code is the collision code but the constraint is something else
    // (e.g. a future unique index): the message regex must gate the
    // retry, so this propagates after a single write.
    upsertMock.mockResolvedValueOnce({
      error: { code: '23505', message: 'duplicate key value violates unique constraint "users_pkey"' },
    })
    const { upsertUser } = await import('../server')
    await expect(upsertUser({ sub: 'auth0|y', handle: 'dave' })).rejects.toThrow(
      /upsertUser: duplicate key/,
    )
    expect(upsertMock).toHaveBeenCalledTimes(1)
  })

  it('throws (no infinite retry) when the disambiguated handle ALSO collides', async () => {
    // The retry is single-shot: if the sub-scoped handle still hits
    // users_handle_key the error surfaces rather than looping.
    upsertMock
      .mockResolvedValueOnce({ error: HANDLE_DUP })
      .mockResolvedValueOnce({ error: HANDLE_DUP })
    const { upsertUser } = await import('../server')
    await expect(upsertUser({ sub: 'auth0|z', handle: 'dave' })).rejects.toThrow(
      /upsertUser: duplicate key/,
    )
    expect(upsertMock).toHaveBeenCalledTimes(2)
  })

  it('derives a distinct deterministic suffix per sub on collision', async () => {
    upsertMock
      .mockResolvedValueOnce({ error: HANDLE_DUP })
      .mockResolvedValueOnce({ error: null })
    const a = await import('../server')
    await a.upsertUser({ sub: 'auth0|sub-one', handle: 'dave' })
    const handleOne = handleArg(1)

    upsertMock.mockReset()
    upsertMock
      .mockResolvedValueOnce({ error: HANDLE_DUP })
      .mockResolvedValueOnce({ error: null })
    vi.resetModules()
    const b = await import('../server')
    await b.upsertUser({ sub: 'auth0|sub-two', handle: 'dave' })
    const handleTwo = handleArg(1)

    expect(handleOne).toMatch(/^dave-[a-z0-9]{1,6}$/)
    expect(handleTwo).toMatch(/^dave-[a-z0-9]{1,6}$/)
    expect(handleOne).not.toBe(handleTwo)
  })

  it('forwards email + displayName (and null defaults) into the upsert payload', async () => {
    upsertMock.mockResolvedValueOnce({ error: null })
    const { upsertUser } = await import('../server')
    await upsertUser({
      sub: 'auth0|withmeta',
      handle: 'meta',
      email: 'm@example.com',
      displayName: 'Meta Person',
    })
    const payload = upsertMock.mock.calls[0]?.[0] as Record<string, unknown>
    expect(payload['auth0_sub']).toBe('auth0|withmeta')
    expect(payload['email']).toBe('m@example.com')
    expect(payload['display_name']).toBe('Meta Person')

    upsertMock.mockReset()
    upsertMock.mockResolvedValueOnce({ error: null })
    vi.resetModules()
    const again = await import('../server')
    await again.upsertUser({ sub: 'auth0|nometa', handle: 'plain' })
    const bare = upsertMock.mock.calls[0]?.[0] as Record<string, unknown>
    expect(bare['email']).toBeNull()
    expect(bare['display_name']).toBeNull()
  })
})

describe('readVote', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('calls read_vote with the resolved session + target and coerces the row', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ value: 1, count: 0.3, raw_count: 4, voter_count: 7 }],
      error: null,
    })
    const { readVote } = await import('../server')
    const r = await readVote({
      sessionId: 'sess-1',
      targetType: 'season',
      targetId: 'survivor:20',
    })
    expect(rpcMock).toHaveBeenCalledWith('read_vote', {
      p_session_id: 'sess-1',
      p_target_type: 'season',
      p_target_id: 'survivor:20',
    })
    // `count` is the weighted internal; `rawCount` is the
    // unweighted integer net (#64); `voterCount` is the
    // distinct-voter count surfaced as the pill number
    // (critique pass-34 #361).
    expect(r).toEqual({ value: 1, count: 0.3, rawCount: 4, voterCount: 7 })
  })

  it('passes a null session through (anon visitor, aggregate still readable)', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { value: 0, count: 5, raw_count: 12, voter_count: 18 },
      error: null,
    })
    const { readVote } = await import('../server')
    const r = await readVote({
      sessionId: null,
      targetType: 'season',
      targetId: 'survivor:1',
    })
    expect(rpcMock).toHaveBeenCalledWith('read_vote', {
      p_session_id: null,
      p_target_type: 'season',
      p_target_id: 'survivor:1',
    })
    expect(r).toEqual({ value: 0, count: 5, rawCount: 12, voterCount: 18 })
  })

  it('defaults to value 0 / count 0 when no row comes back', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null })
    const { readVote } = await import('../server')
    expect(
      await readVote({ sessionId: 's', targetType: 'season', targetId: 't' }),
    ).toEqual({ value: 0, count: 0, rawCount: 0, voterCount: 0 })
  })

  it('throws (carrying the pg code) on an RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'boom', code: '22023', hint: null },
    })
    const { readVote } = await import('../server')
    await expect(
      readVote({ sessionId: 's', targetType: 'season', targetId: 't' }),
    ).rejects.toThrow(/boom/)
  })

  // --- new edge coverage ---

  it('attaches code and normalizes a null hint to undefined on RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'denied', code: '42501', hint: null },
    })
    const { readVote } = await import('../server')
    const err = await caught(
      readVote({ sessionId: 's', targetType: 'season', targetId: 't' }),
    )
    expect(err.message).toBe('denied')
    expect(err.code).toBe('42501')
    expect(err.hint).toBeUndefined()
  })

  it('coerces a missing raw_count and voter_count to 0 (|| 0 fallback)', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ value: -1, count: -0.5 }],
      error: null,
    })
    const { readVote } = await import('../server')
    expect(
      await readVote({ sessionId: 's', targetType: 'comment', targetId: 'c1' }),
    ).toEqual({ value: -1, count: -0.5, rawCount: 0, voterCount: 0 })
  })
})

describe('castVote', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('maps the integer raw_count + voter_count alongside the weighted count (#64 + pass-34 #361)', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          value: 1,
          weight: 0.25,
          count: 0.45,
          raw_count: 3,
          voter_count: 9,
          persisted: true,
        },
      ],
      error: null,
    })
    const { castVote } = await import('../server')
    const r = await castVote({
      sessionId: 'sess-1',
      targetType: 'season',
      targetId: 'survivor:20',
      value: 1,
    })
    expect(r).toEqual({
      value: 1,
      weight: 0.25,
      count: 0.45,
      rawCount: 3,
      voterCount: 9,
      persisted: true,
    })
  })

  // --- new edge coverage ---

  it('forwards the cast_vote RPC args verbatim', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ value: 0, weight: 1, count: 0, raw_count: 0, persisted: true }],
      error: null,
    })
    const { castVote } = await import('../server')
    await castVote({
      sessionId: 'sess-9',
      targetType: 'comment',
      targetId: 'cmt-1',
      value: 0,
    })
    expect(rpcMock).toHaveBeenCalledWith('cast_vote', {
      p_session_id: 'sess-9',
      p_target_type: 'comment',
      p_target_id: 'cmt-1',
      p_value: 0,
    })
  })

  it('accepts a single object data shape (not just an array)', async () => {
    rpcMock.mockResolvedValueOnce({
      data: {
        value: '-1',
        weight: '0.5',
        count: '-0.5',
        raw_count: '2',
        voter_count: '6',
        persisted: 1,
      },
      error: null,
    })
    const { castVote } = await import('../server')
    expect(
      await castVote({
        sessionId: 's',
        targetType: 'season',
        targetId: 't',
        value: -1,
      }),
    ).toEqual({
      value: -1,
      weight: 0.5,
      count: -0.5,
      rawCount: 2,
      voterCount: 6,
      persisted: true,
    })
  })

  it('falls raw_count back to 0 when absent or non-numeric', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ value: 1, weight: 0.25, count: 0.4, persisted: false }],
      error: null,
    })
    const { castVote } = await import('../server')
    const r = await castVote({
      sessionId: 's',
      targetType: 'season',
      targetId: 't',
      value: 1,
    })
    expect(r.rawCount).toBe(0)
    expect(r.persisted).toBe(false)
  })

  it('throws cast_vote: no row returned on an empty array', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    const { castVote } = await import('../server')
    await expect(
      castVote({ sessionId: 's', targetType: 'season', targetId: 't', value: 1 }),
    ).rejects.toThrow(/cast_vote: no row returned/)
  })

  it('throws and carries pg code + hint on an RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'rate limited', code: 'P0001', hint: 'slow down' },
    })
    const { castVote } = await import('../server')
    const err = await caught(
      castVote({ sessionId: 's', targetType: 'season', targetId: 't', value: 1 }),
    )
    expect(err.message).toBe('rate limited')
    expect(err.code).toBe('P0001')
    expect(err.hint).toBe('slow down')
  })
})

describe('postComment', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  const args = {
    sessionId: 'sess-1',
    targetType: 'season' as const,
    targetId: 'survivor:20',
    parentId: null,
    body: 'great season',
    verdict: 'allow' as const,
    categories: ['none'],
    confidence: 0.9,
    reason: 'clean',
    redactedPhrase: null,
  }

  it('forwards every arg to post_comment and shapes the row', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ id: 42, status: 'published', count: 7 }],
      error: null,
    })
    const { postComment } = await import('../server')
    const r = await postComment(args)
    expect(rpcMock).toHaveBeenCalledWith('post_comment', {
      p_session_id: 'sess-1',
      p_target_type: 'season',
      p_target_id: 'survivor:20',
      p_parent_id: null,
      p_body: 'great season',
      p_verdict: 'allow',
      p_categories: ['none'],
      p_confidence: 0.9,
      p_ai_reason: 'clean',
      p_redacted_phrase: null,
    })
    // id is coerced to string; count to number.
    expect(r).toEqual({ id: '42', status: 'published', count: 7 })
  })

  it('accepts a single object data shape', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { id: 'c-9', status: 'pending', count: '0' },
      error: null,
    })
    const { postComment } = await import('../server')
    expect(await postComment(args)).toEqual({
      id: 'c-9',
      status: 'pending',
      count: 0,
    })
  })

  it('throws post_comment: no row returned when nothing comes back', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null })
    const { postComment } = await import('../server')
    await expect(postComment(args)).rejects.toThrow(/post_comment: no row returned/)
  })

  it('throws and carries code + hint on an RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'hold tripped', code: 'P0002', hint: null },
    })
    const { postComment } = await import('../server')
    const err = await caught(postComment(args))
    expect(err.message).toBe('hold tripped')
    expect(err.code).toBe('P0002')
    expect(err.hint).toBeUndefined()
  })
})

describe('flagComment', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('forwards args and coerces flag_count + auto_hidden', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ flag_count: '3', auto_hidden: true }],
      error: null,
    })
    const { flagComment } = await import('../server')
    const r = await flagComment({
      sessionId: 'sess-1',
      commentId: 'cmt-7',
      reason: 'spoiler',
    })
    expect(rpcMock).toHaveBeenCalledWith('flag_comment', {
      p_session_id: 'sess-1',
      p_comment_id: 'cmt-7',
      p_reason: 'spoiler',
    })
    expect(r).toEqual({ flagCount: 3, autoHidden: true })
  })

  it('accepts a single object data shape and falsy auto_hidden', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { flag_count: 1, auto_hidden: 0 },
      error: null,
    })
    const { flagComment } = await import('../server')
    expect(
      await flagComment({ sessionId: 's', commentId: 'c', reason: 'x' }),
    ).toEqual({ flagCount: 1, autoHidden: false })
  })

  it('throws flag_comment: no row returned when nothing comes back', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    const { flagComment } = await import('../server')
    await expect(
      flagComment({ sessionId: 's', commentId: 'c', reason: 'x' }),
    ).rejects.toThrow(/flag_comment: no row returned/)
  })

  it('throws and carries code + hint on an RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'dup flag', code: '23505', hint: 'already flagged' },
    })
    const { flagComment } = await import('../server')
    const err = await caught(
      flagComment({ sessionId: 's', commentId: 'c', reason: 'x' }),
    )
    expect(err.message).toBe('dup flag')
    expect(err.code).toBe('23505')
    expect(err.hint).toBe('already flagged')
  })
})

describe('serviceRoleClient', () => {
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
    vi.resetModules()
  })

  it('returns a client when env is populated', async () => {
    if (!savedUrl || !savedKey) return
    vi.resetModules()
    const mod = await import('../server')
    const c = mod.serviceRoleClient()
    expect(c).toBeDefined()
    expect(mod.serviceRoleClient()).toBe(c)
  })

  it('throws on missing URL', async () => {
    delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    vi.resetModules()
    const mod = await import('../server')
    expect(() => mod.serviceRoleClient()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/i)
  })

  it('throws on missing service role key', async () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    delete process.env['SUPABASE_SERVICE_ROLE_KEY']
    vi.resetModules()
    const mod = await import('../server')
    expect(() => mod.serviceRoleClient()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/i)
  })

  // --- new edge coverage ---

  it('prefers SUPABASE_URL over NEXT_PUBLIC_SUPABASE_URL when both are set', async () => {
    process.env['SUPABASE_URL'] = 'https://override.supabase.co'
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://inlined.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'k'
    vi.resetModules()
    const mod = await import('../server')
    // The override path must not throw — both are valid, server-only
    // SUPABASE_URL wins so the e2e harness can repoint without rebuild.
    expect(() => mod.serviceRoleClient()).not.toThrow()
    delete process.env['SUPABASE_URL']
  })

  it('falls back to NEXT_PUBLIC_SUPABASE_URL when SUPABASE_URL is unset', async () => {
    delete process.env['SUPABASE_URL']
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://public.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'k'
    vi.resetModules()
    const mod = await import('../server')
    expect(() => mod.serviceRoleClient()).not.toThrow()
  })
})

describe('listThreadComments graceful degradation', () => {
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('returns empty lists when the service-role client is unavailable (always-working)', async () => {
    delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    delete process.env['SUPABASE_SERVICE_ROLE_KEY']
    vi.resetModules()
    const mod = await import('../server')
    const out = await mod.listThreadComments({
      targetType: 'season',
      targetId: 'survivor:20',
      sub: null,
    })
    expect(out).toEqual({ published: [], ownPending: [] })
  })
})

// --- new: listThreadComments query paths (chainable mock) ---
describe('listThreadComments query paths', () => {
  beforeEach(() => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    H.state.fromFn = null
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('returns empty when the published query errors', async () => {
    queueFrom([{ data: null, error: { message: 'down' } }])
    const mod = await import('../server')
    expect(
      await mod.listThreadComments({
        targetType: 'season',
        targetId: 'survivor:1',
        sub: null,
      }),
    ).toEqual({ published: [], ownPending: [] })
  })

  it('resolves author handles, normalizes embedded sessions, and renders anon as null', async () => {
    const published = {
      data: [
        {
          id: 1,
          body: 'first',
          created_at: '2026-05-01T00:00:00Z',
          status: 'published',
          sessions: { auth0_sub: 'auth0|dave' },
        },
        {
          id: 2,
          body: 'array-embed',
          created_at: '2026-05-02T00:00:00Z',
          status: 'published',
          sessions: [{ auth0_sub: 'auth0|sam' }],
        },
        {
          id: 3,
          body: 'anon',
          created_at: '2026-05-03T00:00:00Z',
          status: 'published',
          sessions: null,
        },
      ],
      error: null,
    }
    const users = {
      data: [
        { auth0_sub: 'auth0|dave', handle: 'dave' },
        { auth0_sub: 'auth0|sam', handle: 'sam' },
      ],
      error: null,
    }
    queueFrom([published, users])
    const mod = await import('../server')
    const out = await mod.listThreadComments({
      targetType: 'season',
      targetId: 'survivor:20',
      sub: null,
    })
    expect(out.ownPending).toEqual([])
    expect(out.published.map((c) => [c.id, c.author])).toEqual([
      ['1', 'dave'],
      ['2', 'sam'],
      ['3', null],
    ])
  })

  it('fetches the viewer own-pending rows when a sub is supplied', async () => {
    const published = { data: [], error: null }
    const ownPending = {
      data: [
        {
          id: 9,
          body: 'held',
          created_at: '2026-05-04T00:00:00Z',
          status: 'pending',
          sessions: { auth0_sub: 'auth0|me' },
        },
      ],
      error: null,
    }
    const users = {
      data: [{ auth0_sub: 'auth0|me', handle: 'me' }],
      error: null,
    }
    queueFrom([published, ownPending, users])
    const mod = await import('../server')
    const out = await mod.listThreadComments({
      targetType: 'season',
      targetId: 'survivor:20',
      sub: 'auth0|me',
    })
    expect(out.published).toEqual([])
    expect(out.ownPending).toEqual([
      {
        id: '9',
        body: 'held',
        author: 'me',
        created_at: '2026-05-04T00:00:00Z',
        status: 'pending',
      },
    ])
  })

  it('clamps the limit into [1, 200]', async () => {
    const rec: { limit?: number; calls: unknown[][] } = { calls: [] }
    H.state.fromFn = () => makeQB({ data: [], error: null }, rec)
    const mod = await import('../server')
    await mod.listThreadComments({
      targetType: 'season',
      targetId: 't',
      sub: null,
      limit: 9999,
    })
    expect(rec.limit).toBe(200)

    rec.calls.length = 0
    rec.limit = undefined
    await mod.listThreadComments({
      targetType: 'season',
      targetId: 't',
      sub: null,
      limit: 0,
    })
    expect(rec.limit).toBe(1)
  })
})

// --- new: getProfileActivity ---
describe('getProfileActivity', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    H.state.fromFn = null
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('returns null for a blank handle without touching the RPC', async () => {
    const mod = await import('../server')
    expect(await mod.getProfileActivity({ handle: '   ' })).toBeNull()
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('returns null when the RPC yields no identity row', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    const mod = await import('../server')
    expect(await mod.getProfileActivity({ handle: 'ghost' })).toBeNull()
  })

  it('returns null when the row has no auth0_sub', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ auth0_sub: null, handle: 'ghost' }],
      error: null,
    })
    const mod = await import('../server')
    expect(await mod.getProfileActivity({ handle: 'ghost' })).toBeNull()
  })

  it('throws (carrying code) on an RPC error', async () => {
    rpcMock.mockResolvedValueOnce({
      error: { message: 'rpc boom', code: '22023' },
    })
    const mod = await import('../server')
    const err = await caught(mod.getProfileActivity({ handle: 'x' }))
    expect(err.message).toBe('rpc boom')
    expect(err.code).toBe('22023')
  })

  it('coerces counts and maps recent published comments', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          auth0_sub: 'auth0|me',
          handle: 'me',
          display_name: 'Me',
          created_at: '2026-01-01T00:00:00Z',
          published_comment_count: '12',
          voted_season_count: 5,
          voted_show_count: '2',
        },
      ],
      error: null,
    })
    queueFrom([
      {
        data: [
          {
            id: 7,
            body: 'a take',
            created_at: '2026-05-01T00:00:00Z',
            target_type: 'season',
            target_id: 'survivor:1',
          },
        ],
        error: null,
      },
    ])
    const mod = await import('../server')
    const out = await mod.getProfileActivity({ handle: 'me' })
    expect(out).toEqual({
      handle: 'me',
      displayName: 'Me',
      createdAt: '2026-01-01T00:00:00Z',
      publishedCommentCount: 12,
      votedSeasonCount: 5,
      votedShowCount: 2,
      recentComments: [
        {
          id: '7',
          body: 'a take',
          created_at: '2026-05-01T00:00:00Z',
          target_type: 'season',
          target_id: 'survivor:1',
        },
      ],
    })
  })

  it('degrades recentComments to [] when the comments query errors (identity still returns)', async () => {
    rpcMock.mockResolvedValueOnce({
      data: {
        auth0_sub: 'auth0|me',
        handle: 'me',
        display_name: null,
        created_at: '2026-01-01T00:00:00Z',
        published_comment_count: 0,
        voted_season_count: 0,
        voted_show_count: 0,
      },
      error: null,
    })
    queueFrom([{ data: null, error: { message: 'comments down' } }])
    const mod = await import('../server')
    const out = await mod.getProfileActivity({ handle: 'me' })
    expect(out?.handle).toBe('me')
    expect(out?.displayName).toBeNull()
    expect(out?.recentComments).toEqual([])
  })

  it('clamps recentLimit into [1, 30]', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          auth0_sub: 'auth0|me',
          handle: 'me',
          display_name: null,
          created_at: '2026-01-01T00:00:00Z',
          published_comment_count: 0,
          voted_season_count: 0,
          voted_show_count: 0,
        },
      ],
      error: null,
    })
    const rec: { limit?: number; calls: unknown[][] } = { calls: [] }
    H.state.fromFn = () => makeQB({ data: [], error: null }, rec)
    const mod = await import('../server')
    await mod.getProfileActivity({ handle: 'me', recentLimit: 999 })
    expect(rec.limit).toBe(30)
  })
})

// --- new: claimAnonSession ---
describe('claimAnonSession', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    H.state.fromFn = null
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('claims an anon row via the RPC and returns its session id', async () => {
    rpcMock.mockResolvedValueOnce({ data: [{ id: 'sess-claimed' }], error: null })
    const mod = await import('../server')
    expect(
      await mod.claimAnonSession({ anonId: 'anon-1', sub: 'auth0|me' }),
    ).toEqual({ sessionId: 'sess-claimed' })
    expect(rpcMock).toHaveBeenCalledWith('claim_anon_session', {
      p_anon_id: 'anon-1',
      p_sub: 'auth0|me',
    })
  })

  it('throws when the claim RPC errors', async () => {
    rpcMock.mockResolvedValueOnce({ error: { message: 'claim failed' } })
    const mod = await import('../server')
    await expect(
      mod.claimAnonSession({ anonId: 'anon-1', sub: 'auth0|me' }),
    ).rejects.toThrow(/claim_anon_session: claim failed/)
  })

  it('falls through to the lookup when the RPC returns no row', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    queueFrom([{ data: { id: 'sess-existing' }, error: null }])
    const mod = await import('../server')
    expect(
      await mod.claimAnonSession({ anonId: 'anon-1', sub: 'auth0|me' }),
    ).toEqual({ sessionId: 'sess-existing' })
  })

  it('with no anonId, returns an existing authed session', async () => {
    queueFrom([{ data: { id: 'sess-found' }, error: null }])
    const mod = await import('../server')
    expect(
      await mod.claimAnonSession({ anonId: null, sub: 'auth0|me' }),
    ).toEqual({ sessionId: 'sess-found' })
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('with no anonId and no existing session, inserts a fresh one', async () => {
    queueFrom([
      { data: null, error: null }, // lookup → no row
      { data: { id: 'sess-new' }, error: null }, // insert → new id
    ])
    const mod = await import('../server')
    expect(
      await mod.claimAnonSession({ anonId: null, sub: 'auth0|fresh' }),
    ).toEqual({ sessionId: 'sess-new' })
  })

  it('throws on a lookup error', async () => {
    queueFrom([{ data: null, error: { message: 'lookup boom' } }])
    const mod = await import('../server')
    await expect(
      mod.claimAnonSession({ anonId: null, sub: 'auth0|me' }),
    ).rejects.toThrow(/claimAnonSession lookup: lookup boom/)
  })

  it('throws on an insert error', async () => {
    queueFrom([
      { data: null, error: null }, // lookup → no row
      { data: null, error: { message: 'insert boom' } }, // insert → fail
    ])
    const mod = await import('../server')
    await expect(
      mod.claimAnonSession({ anonId: null, sub: 'auth0|me' }),
    ).rejects.toThrow(/claimAnonSession insert: insert boom/)
  })
})

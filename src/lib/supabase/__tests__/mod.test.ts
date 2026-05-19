import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Consolidated from the former sibling `src/lib/supabase/mod.test.ts`
// (§5a — the test must sit on the colocated `__tests__/` path the next
// loop tick's discovery scans). Every prior case is retained verbatim
// in `describe('mod module surface')` against the exact prior
// assertions; new edge coverage is appended for the previously
// network-untested `getModQueue` (queue mapping, flag aggregation, the
// flagged-not-in-queue third query, the flag-then-recency sort, the
// 50-cap, all three error branches) and `modAction` (RPC arg contract,
// array-vs-object row, code/hint propagation, no-row throw). No source
// change. The mock is a hoisted `@supabase/supabase-js` boundary stub —
// the correct and only strategy for a wrapper over the lazily-cached
// service-role client (`serviceRoleClient` memoizes in module scope, so
// every new-result test re-imports under `vi.resetModules()`). The
// prior surface cases never invoke the helpers, so the stub is inert
// for them and they behave identically.

type QBResult = { data: unknown; error: unknown }

const H = vi.hoisted(() => {
  const rpcMock = vi.fn()
  // FIFO queue of results, one per `client.from(...)` chain in a single
  // helper invocation (getModQueue: comments → flags → [comments]).
  const state: { queue: QBResult[]; calls: unknown[][] } = {
    queue: [],
    calls: [],
  }
  return { rpcMock, state }
})

// Chainable + thenable query-builder stub. Every chain method records
// its call and returns the builder; the builder itself is awaitable
// (the source awaits the chain directly, no terminal `.single()`), so
// `.limit()`, `.gte()`, and `.in()` are all valid await points.
function makeQB(result: QBResult) {
  const qb: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'in', 'order', 'limit', 'gte']) {
    qb[m] = (...a: unknown[]) => {
      H.state.calls.push([m, ...a])
      return qb
    }
  }
  qb['then'] = (
    res: (v: QBResult) => unknown,
    rej: (e: unknown) => unknown,
  ) => Promise.resolve(result).then(res, rej)
  return qb
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (_t: string) =>
      makeQB(H.state.queue.shift() ?? { data: null, error: null }),
    rpc: H.rpcMock,
  }),
}))

const savedUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const savedKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

function restore() {
  if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
  else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
  if (savedKey !== undefined)
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
  else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  vi.resetModules()
}

// --- Retained verbatim from the former sibling test --------------------

describe('mod module surface', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(restore)

  it('exports getModQueue and modAction', async () => {
    const mod = await import('../mod')
    expect(typeof mod.getModQueue).toBe('function')
    expect(typeof mod.modAction).toBe('function')
  })

  it('ModQueueItem and ModActionResult types compile', async () => {
    const mod = await import('../mod')
    // If the module imported without error, the types resolved.
    expect(mod).toBeDefined()
  })
})

// --- New edge coverage -------------------------------------------------

async function loadMod() {
  vi.resetModules()
  process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'service-role-key'
  H.state.queue = []
  H.state.calls = []
  H.rpcMock.mockReset()
  return import('../mod')
}

function comment(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'c1',
    parent_id: null,
    session_id: 's1',
    target_type: 'season',
    target_id: 'survivor-20',
    body: 'a comment',
    status: 'pending',
    created_at: '2026-05-10T00:00:00.000Z',
    ...over,
  }
}

async function caught(p: Promise<unknown>): Promise<Error> {
  try {
    await p
  } catch (e) {
    return e as Error
  }
  throw new Error('expected promise to reject')
}

describe('getModQueue', () => {
  afterEach(restore)

  it('returns [] when no pending/hidden rows and no flags', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [], error: null }, // comments queue
      { data: [], error: null }, // flags
    ]
    expect(await mod.getModQueue()).toEqual([])
  })

  it('handles null data on both base queries as empty', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: null, error: null },
      { data: null, error: null },
    ]
    expect(await mod.getModQueue()).toEqual([])
  })

  it('maps snake_case rows to the ModQueueItem shape with flagCount 0', async () => {
    const mod = await loadMod()
    H.state.queue = [
      {
        data: [
          comment({
            id: 'c1',
            parent_id: 'p1',
            target_type: 'comment',
            target_id: 't1',
            body: 'hello',
            status: 'hidden',
            created_at: '2026-05-12T00:00:00.000Z',
          }),
        ],
        error: null,
      },
      { data: [], error: null },
    ]
    const out = await mod.getModQueue()
    expect(out).toEqual([
      {
        id: 'c1',
        parentId: 'p1',
        targetType: 'comment',
        targetId: 't1',
        body: 'hello',
        status: 'hidden',
        createdAt: '2026-05-12T00:00:00.000Z',
        flagCount: 0,
      },
    ])
    // session_id is intentionally not surfaced on ModQueueItem.
    expect(out[0]).not.toHaveProperty('session_id')
  })

  it('aggregates duplicate flag rows into a per-comment count on a queued row', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [comment({ id: 'c1' })], error: null },
      {
        data: [
          { comment_id: 'c1' },
          { comment_id: 'c1' },
          { comment_id: 'c1' },
        ],
        error: null,
      },
    ]
    const out = await mod.getModQueue()
    expect(out).toHaveLength(1)
    expect(out[0]?.flagCount).toBe(3)
  })

  it('pulls a published-but-flagged comment that is not already in the queue', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [comment({ id: 'c1', status: 'pending' })], error: null }, // queue
      { data: [{ comment_id: 'c9' }, { comment_id: 'c9' }], error: null }, // flags
      {
        data: [comment({ id: 'c9', status: 'published' })],
        error: null,
      }, // flagged extras
    ]
    const out = await mod.getModQueue()
    const byId = Object.fromEntries(out.map((r) => [r.id, r]))
    expect(Object.keys(byId).sort()).toEqual(['c1', 'c9'])
    expect(byId['c9']?.status).toBe('published')
    expect(byId['c9']?.flagCount).toBe(2)
    expect(byId['c1']?.flagCount).toBe(0)
    // The third `from('comments')` query was issued with `.in('id', ['c9'])`.
    const inIdCall = H.state.calls.find(
      (c) => c[0] === 'in' && c[1] === 'id',
    )
    expect(inIdCall).toEqual(['in', 'id', ['c9']])
  })

  it('does NOT issue the third query when every flagged comment is already queued', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [comment({ id: 'c1' })], error: null },
      { data: [{ comment_id: 'c1' }], error: null },
      { data: [comment({ id: 'should-not-be-read' })], error: null },
    ]
    const out = await mod.getModQueue()
    expect(out.map((r) => r.id)).toEqual(['c1'])
    expect(H.state.calls.some((c) => c[0] === 'in' && c[1] === 'id')).toBe(
      false,
    )
  })

  it('sorts by flagCount desc, then created_at desc, and caps at 50', async () => {
    const mod = await loadMod()
    const rows = Array.from({ length: 60 }, (_, i) =>
      comment({
        id: `c${i}`,
        created_at: new Date(2026, 0, 1, 0, 0, i).toISOString(),
      }),
    )
    H.state.queue = [
      { data: rows, error: null },
      // c5 gets 2 flags, c7 gets 1 — both must lead the (flag-0) tail.
      {
        data: [
          { comment_id: 'c5' },
          { comment_id: 'c5' },
          { comment_id: 'c7' },
        ],
        error: null,
      },
    ]
    const out = await mod.getModQueue()
    expect(out).toHaveLength(50)
    expect(out[0]?.id).toBe('c5')
    expect(out[0]?.flagCount).toBe(2)
    expect(out[1]?.id).toBe('c7')
    expect(out[1]?.flagCount).toBe(1)
    // Remaining flag-0 rows are newest-first by created_at.
    expect(out[2]?.id).toBe('c59')
    expect(out[3]?.id).toBe('c58')
  })

  it('throws "getModQueue: <msg>" when the queue query errors', async () => {
    const mod = await loadMod()
    H.state.queue = [{ data: null, error: { message: 'boom' } }]
    const e = await caught(mod.getModQueue())
    expect(e.message).toBe('getModQueue: boom')
  })

  it('throws "getModQueue flags: <msg>" when the flags query errors', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [comment()], error: null },
      { data: null, error: { message: 'flag-fail' } },
    ]
    const e = await caught(mod.getModQueue())
    expect(e.message).toBe('getModQueue flags: flag-fail')
  })

  it('throws "getModQueue flagged: <msg>" when the extra query errors', async () => {
    const mod = await loadMod()
    H.state.queue = [
      { data: [comment({ id: 'c1' })], error: null },
      { data: [{ comment_id: 'c9' }], error: null },
      { data: null, error: { message: 'extra-fail' } },
    ]
    const e = await caught(mod.getModQueue())
    expect(e.message).toBe('getModQueue flagged: extra-fail')
  })
})

describe('modAction', () => {
  afterEach(restore)

  it('forwards the documented RPC arg contract and maps the result', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({
      data: { new_status: 'hidden', action_id: '42' },
      error: null,
    })
    const res = await mod.modAction({
      sessionId: 's1',
      commentId: 'c1',
      action: 'hide',
      note: 'spoiler',
    })
    expect(H.rpcMock).toHaveBeenCalledWith('mod_action', {
      p_session_id: 's1',
      p_comment_id: 'c1',
      p_action: 'hide',
      p_note: 'spoiler',
    })
    expect(res).toEqual({ newStatus: 'hidden', actionId: 42 })
  })

  it('accepts an array-shaped RPC payload (takes the first row)', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({
      data: [{ new_status: 'removed', action_id: 7 }],
      error: null,
    })
    const res = await mod.modAction({
      sessionId: 's1',
      commentId: 'c1',
      action: 'remove',
      note: null,
    })
    expect(res).toEqual({ newStatus: 'removed', actionId: 7 })
  })

  it('propagates the pg error message + code + hint', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({
      data: null,
      error: { message: 'denied', code: '42501', hint: 'grant mod role' },
    })
    const e = (await caught(
      mod.modAction({
        sessionId: 's1',
        commentId: 'c1',
        action: 'approve',
        note: null,
      }),
    )) as Error & { code?: string; hint?: string }
    expect(e.message).toBe('denied')
    expect(e.code).toBe('42501')
    expect(e.hint).toBe('grant mod role')
  })

  it('coerces a null pg hint to undefined', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({
      data: null,
      error: { message: 'x', code: 'P0001', hint: null },
    })
    const e = (await caught(
      mod.modAction({
        sessionId: 's1',
        commentId: 'c1',
        action: 'dismiss_flag',
        note: null,
      }),
    )) as Error & { code?: string; hint?: string }
    expect(e.code).toBe('P0001')
    expect(e.hint).toBeUndefined()
  })

  it('throws "mod_action: no row returned" when the RPC yields no row', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({ data: null, error: null })
    const e = await caught(
      mod.modAction({
        sessionId: 's1',
        commentId: 'c1',
        action: 'unhide',
        note: null,
      }),
    )
    expect(e.message).toBe('mod_action: no row returned')
  })

  it('treats an empty array payload as no row', async () => {
    const mod = await loadMod()
    H.rpcMock.mockResolvedValue({ data: [], error: null })
    const e = await caught(
      mod.modAction({
        sessionId: 's1',
        commentId: 'c1',
        action: 'approve',
        note: null,
      }),
    )
    expect(e.message).toBe('mod_action: no row returned')
  })
})

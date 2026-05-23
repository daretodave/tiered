import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ANON_COOKIE_NAME } from '@/lib/anonSession'

// /api/flag is the public-facing comment-flag endpoint a signed-in
// member calls to flag a spoiler/abusive comment. It is the
// user-facing path that controls the sliding-window auto-hide
// threshold (5 flags / 1h on the same comment) enforced by the
// flag_comment() RPC. apps/e2e/tests/comment-backend.spec.ts walks
// the route once in the happy authed flow, but the route's full
// branch tree — body validation (Zod), the auth gate (anon → 401,
// session-without-sub → 401, getSession throw → 500), the
// anon-cookie pass-through + claimAnonSession (so prior anon flag
// activity is re-attributed), the snake_case success body shape
// (`{ok, flag_count, auto_hidden}`, deliberately differing from
// flagComment's camelCase return shape — load-bearing for the
// client), the RPC error mapping (42501 → 401, 22023 → 400, else
// → 500), and the multi-source handleFromSession derivation are
// dark to a happy-path walk. The Auth0 + Supabase boundaries are
// mocked; anonSession stays real so the cookie regex + UUID
// validation run for genuine — that pins the route's actual
// contract.
const {
  getSessionMock,
  flagCommentMock,
  claimAnonSessionMock,
  upsertUserMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  flagCommentMock: vi.fn(),
  claimAnonSessionMock: vi.fn(),
  upsertUserMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('@/lib/supabase/server', () => ({
  flagComment: flagCommentMock,
  claimAnonSession: claimAnonSessionMock,
  upsertUser: upsertUserMock,
}))

import { POST, dynamic, runtime } from '../route'

const VALID_ANON_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
const VALID_COMMENT_ID = 'cccccccc-dddd-4eee-8fff-000000000001'
const VALID_BODY = {
  commentId: VALID_COMMENT_ID,
  reason: 'spoils the finale',
}
const AUTHED_SUB = 'auth0|abc123'

function postRequest(
  opts: { body?: unknown; raw?: string; cookie?: string } = {},
): Request {
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  const body =
    opts.raw !== undefined ? opts.raw : JSON.stringify(opts.body ?? VALID_BODY)
  return new Request('http://localhost/api/flag', {
    method: 'POST',
    headers,
    body,
  })
}

const anonCookie = `${ANON_COOKIE_NAME}=${VALID_ANON_ID}`
const authedSession = (user: Record<string, unknown> = { sub: AUTHED_SUB }) => ({
  user,
})

beforeEach(() => {
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue(
    authedSession({ sub: AUTHED_SUB, nickname: 'Tester' }),
  )
  flagCommentMock.mockReset()
  flagCommentMock.mockResolvedValue({ flagCount: 1, autoHidden: false })
  claimAnonSessionMock.mockReset()
  claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-session-id' })
  upsertUserMock.mockReset()
  upsertUserMock.mockResolvedValue(undefined)
})

describe('POST /api/flag — body validation', () => {
  it('flags a comment for a well-formed body and returns the success shape', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      flag_count: 1,
      auto_hidden: false,
    })
    expect(flagCommentMock).toHaveBeenCalledWith({
      sessionId: 'claimed-session-id',
      commentId: VALID_COMMENT_ID,
      reason: 'spoils the finale',
    })
  })

  it('rejects a non-UUID commentId with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, commentId: 'not-a-uuid' } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'invalid_body',
    })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })

  it('rejects a missing commentId with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { reason: 'spoils' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects an empty reason with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { ...VALID_BODY, reason: '' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a reason longer than 200 chars with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, reason: 'x'.repeat(201) } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('accepts a reason at the 200-char boundary', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, reason: 'x'.repeat(200) } }),
    )
    expect(res.status).toBe(200)
    expect(flagCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'x'.repeat(200) }),
    )
  })

  it('rejects a non-JSON body with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ raw: 'not json at all', cookie: anonCookie }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })

  it('validates the body before resolving a session', async () => {
    // Anon caller with a malformed body must 400, not 401 — the
    // parse gate runs before the auth gate.
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ body: { reason: 'too thin' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(getSessionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/flag — auth gate', () => {
  it('rejects an anon caller with 401 auth_required', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'auth_required',
    })
    expect(flagCommentMock).not.toHaveBeenCalled()
    expect(upsertUserMock).not.toHaveBeenCalled()
    expect(claimAnonSessionMock).not.toHaveBeenCalled()
  })

  it('rejects a session that carries no sub with 401 auth_required', async () => {
    // A session shape with user but no sub means Auth0 returned a
    // half-baked session; treat it as anon.
    getSessionMock.mockResolvedValue(authedSession({ nickname: 'Tester' }))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({ error: 'auth_required' })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })

  it('upserts the users row and claims the anon session for an authed caller', async () => {
    getSessionMock.mockResolvedValue(
      authedSession({
        sub: AUTHED_SUB,
        nickname: 'Tester',
        email: 'tester@example.com',
        name: 'T. Ester',
      }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith({
      sub: AUTHED_SUB,
      handle: 'tester',
      email: 'tester@example.com',
      displayName: 'T. Ester',
    })
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: VALID_ANON_ID,
      sub: AUTHED_SUB,
    })
  })

  it('claims with anonId=null when the cookie is absent', async () => {
    await POST(postRequest())
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: null,
      sub: AUTHED_SUB,
    })
  })

  it('claims with anonId=null when the cookie is not a valid UUID', async () => {
    await POST(postRequest({ cookie: `${ANON_COOKIE_NAME}=not-a-uuid` }))
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: null,
      sub: AUTHED_SUB,
    })
  })

  it('flags as the claimed session id, not the raw anon id', async () => {
    claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-xyz' })
    await POST(postRequest({ cookie: anonCookie }))
    expect(flagCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'claimed-xyz' }),
    )
  })

  it('maps a getSession failure to 500 auth_resolve_failed', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'auth_resolve_failed',
    })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })

  it('maps an upsertUser failure to 500 auth_resolve_failed (the same try/catch)', async () => {
    upsertUserMock.mockRejectedValue(new Error('users upsert wedged'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      error: 'auth_resolve_failed',
    })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })

  it('maps a claimAnonSession failure to 500 auth_resolve_failed', async () => {
    claimAnonSessionMock.mockRejectedValue(new Error('claim wedged'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      error: 'auth_resolve_failed',
    })
    expect(flagCommentMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/flag — handle derivation', () => {
  it('derives handle from a nickname (lowercased, leading @ stripped)', async () => {
    getSessionMock.mockResolvedValue(
      authedSession({ sub: AUTHED_SUB, nickname: '@Tester' }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'tester' }),
    )
  })

  it('falls back to email-localpart (lowercased) when nickname is absent', async () => {
    getSessionMock.mockResolvedValue(
      authedSession({ sub: AUTHED_SUB, email: 'Dave@example.com' }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'dave', email: 'Dave@example.com' }),
    )
  })

  it('falls back to a sanitized sub when nickname and email are absent', async () => {
    getSessionMock.mockResolvedValue(authedSession({ sub: AUTHED_SUB }))
    await POST(postRequest({ cookie: anonCookie }))
    // sub 'auth0|abc123' → sanitized 'auth0-abc123' lowercased
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'auth0-abc123' }),
    )
  })
})

describe('POST /api/flag — response shape (snake_case)', () => {
  it('echoes flag_count + auto_hidden with snake_case keys, not flagCount/autoHidden', async () => {
    flagCommentMock.mockResolvedValue({ flagCount: 4, autoHidden: false })
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    const body = (await res.json()) as Record<string, unknown>
    expect(body).toEqual({ ok: true, flag_count: 4, auto_hidden: false })
    // Defense-in-depth: the route MUST NOT leak the helper's
    // camelCase return shape — the client reads snake_case.
    expect(body).not.toHaveProperty('flagCount')
    expect(body).not.toHaveProperty('autoHidden')
  })

  it('passes through auto_hidden=true when the RPC trips the auto-hide threshold', async () => {
    flagCommentMock.mockResolvedValue({ flagCount: 5, autoHidden: true })
    const res = await POST(postRequest({ cookie: anonCookie }))
    await expect(res.json()).resolves.toEqual({
      ok: true,
      flag_count: 5,
      auto_hidden: true,
    })
  })

  it('calls flagComment exactly once per valid request', async () => {
    await POST(postRequest({ cookie: anonCookie }))
    expect(flagCommentMock).toHaveBeenCalledTimes(1)
  })
})

describe('POST /api/flag — RPC error mapping', () => {
  it('maps a 42501 RLS denial to 401 auth_required', async () => {
    flagCommentMock.mockRejectedValue(
      Object.assign(new Error('rls denied'), { code: '42501' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'auth_required',
    })
  })

  it('maps a 22023 invalid-argument to 400 invalid_input', async () => {
    flagCommentMock.mockRejectedValue(
      Object.assign(new Error('bad commentId'), { code: '22023' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'invalid_input',
    })
  })

  it('maps any other RPC throw to 500 rpc_failed', async () => {
    flagCommentMock.mockRejectedValue(new Error('connection reset'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'rpc_failed',
    })
  })
})

describe('/api/flag — route contract', () => {
  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the flag route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

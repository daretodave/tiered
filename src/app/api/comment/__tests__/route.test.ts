import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ANON_COOKIE_NAME } from '@/lib/anonSession'

// /api/comment is the comment write path — every season page's
// CommentInput posts here, and the route is the ONLY path through
// which the OpenAI moderation pre-filter (moderateComment) runs
// before user copy hits the database. Spoiler discipline is P0
// (CLAUDE.md "Five hard rules" + agents.md §7), so the
// verdict-pass-through contract is load-bearing. The hermetic e2e
// suite walks the happy path + spoiler-blocked + flag flow, but the
// route's full branch tree — body validation (Zod), the auth gate
// (this route is auth-required, unlike /api/vote), the
// verdict-pass-through contract, the verdict echo in the success
// body, the RPC error mapping (42501 → 401, 23505 → 429, 22023 →
// 400, else → 500), the multi-source handleFromSession derivation,
// and the auth-resolve failure path — are all dark to a happy-path
// walk. The Auth0 + Supabase + preFilter boundaries are mocked;
// anonSession stays real so the cookie regex + UUID validation run
// for genuine — that pins the route's actual contract.
const {
  getSessionMock,
  postCommentMock,
  claimAnonSessionMock,
  upsertUserMock,
  moderateCommentMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  postCommentMock: vi.fn(),
  claimAnonSessionMock: vi.fn(),
  upsertUserMock: vi.fn(),
  moderateCommentMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('@/lib/supabase/server', () => ({
  postComment: postCommentMock,
  claimAnonSession: claimAnonSessionMock,
  upsertUser: upsertUserMock,
}))

vi.mock('@/lib/openai/preFilter', () => ({
  moderateComment: moderateCommentMock,
}))

import { POST, dynamic, runtime } from '../route'

const VALID_ANON_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
const VALID_BODY = {
  targetType: 'season',
  targetId: 'survivor-20',
  body: 'great cast, great location, format change worked.',
}
const AUTHED_SUB = 'auth0|abc123'

function postRequest(
  opts: { body?: unknown; raw?: string; cookie?: string } = {},
): Request {
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  const body = opts.raw !== undefined ? opts.raw : JSON.stringify(opts.body ?? VALID_BODY)
  return new Request('http://localhost/api/comment', { method: 'POST', headers, body })
}

const anonCookie = `${ANON_COOKIE_NAME}=${VALID_ANON_ID}`
const authedSession = (user: Record<string, unknown> = { sub: AUTHED_SUB }) => ({ user })

const ALLOW_VERDICT = {
  verdict: 'allow' as const,
  categories: [] as string[],
  confidence: 0.04,
  reason: 'on-topic format observation',
  redacted_phrase: null as string | null,
}

const BLOCK_VERDICT = {
  verdict: 'block' as const,
  categories: ['spoiler_winner', 'spoiler_finale'],
  confidence: 0.97,
  reason: 'reveals season winner',
  redacted_phrase: 'X wins',
}

beforeEach(() => {
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue(authedSession({ sub: AUTHED_SUB, nickname: 'Tester' }))
  postCommentMock.mockReset()
  postCommentMock.mockResolvedValue({
    id: '00000000-0000-4000-8000-000000000001',
    status: 'published',
    count: 1,
  })
  claimAnonSessionMock.mockReset()
  claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-session-id' })
  upsertUserMock.mockReset()
  upsertUserMock.mockResolvedValue(undefined)
  moderateCommentMock.mockReset()
  moderateCommentMock.mockResolvedValue(ALLOW_VERDICT)
})

describe('POST /api/comment — body validation', () => {
  it('posts a comment for a well-formed body and returns the success shape', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      id: '00000000-0000-4000-8000-000000000001',
      status: 'published',
      count: 1,
      verdict: 'allow',
    })
    expect(postCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: 'claimed-session-id',
        targetType: 'season',
        targetId: 'survivor-20',
        parentId: null,
        body: VALID_BODY.body,
      }),
    )
  })

  it('rejects an unknown targetType with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, targetType: 'episode' } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_body' })
    expect(postCommentMock).not.toHaveBeenCalled()
  })

  it('rejects an empty targetId with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { ...VALID_BODY, targetId: '' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a targetId longer than 128 chars with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, targetId: 'x'.repeat(129) } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects an empty body with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { ...VALID_BODY, body: '' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a body longer than 4000 chars with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, body: 'a'.repeat(4001) } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('accepts a null parentId and passes it through', async () => {
    await POST(postRequest({ body: { ...VALID_BODY, parentId: null } }))
    expect(postCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({ parentId: null }),
    )
  })

  it('accepts a UUID parentId and passes it through', async () => {
    const PARENT = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e'
    await POST(postRequest({ body: { ...VALID_BODY, parentId: PARENT } }))
    expect(postCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({ parentId: PARENT }),
    )
  })

  it('rejects a non-UUID parentId with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, parentId: 'not-a-uuid' } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(postCommentMock).not.toHaveBeenCalled()
  })

  it('rejects a non-JSON body with 400 invalid_body', async () => {
    const res = await POST(postRequest({ raw: 'not json at all', cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(postCommentMock).not.toHaveBeenCalled()
  })

  it('validates the body before resolving a session', async () => {
    // Anon caller with a malformed body must 400, not 401 — the
    // parse gate runs before the auth gate.
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ body: { body: 'too thin' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(getSessionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/comment — auth gate', () => {
  it('rejects an anon caller with 401 auth_required', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'auth_required' })
    expect(postCommentMock).not.toHaveBeenCalled()
    expect(moderateCommentMock).not.toHaveBeenCalled()
  })

  it('rejects a session that carries no sub with 401 auth_required', async () => {
    // A session shape with user but no sub means Auth0 returned a
    // half-baked session; treat it as anon.
    getSessionMock.mockResolvedValue(authedSession({ nickname: 'Tester' }))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({ error: 'auth_required' })
    expect(postCommentMock).not.toHaveBeenCalled()
  })

  it('upserts the users row and claims the anon session for an authed caller', async () => {
    getSessionMock.mockResolvedValue(
      authedSession({ sub: AUTHED_SUB, nickname: 'Tester', email: 'tester@example.com', name: 'T. Ester' }),
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

  it('posts as the claimed session id, not the raw anon id', async () => {
    claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-xyz' })
    await POST(postRequest({ cookie: anonCookie }))
    expect(postCommentMock).toHaveBeenCalledWith(
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
    expect(postCommentMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/comment — handle derivation', () => {
  it('derives handle from a nickname (lowercased, leading @ stripped)', async () => {
    getSessionMock.mockResolvedValue(authedSession({ sub: AUTHED_SUB, nickname: '@Tester' }))
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

describe('POST /api/comment — verdict pass-through (spoiler discipline)', () => {
  it('calls moderateComment with the parsed body, exactly once', async () => {
    await POST(postRequest({ cookie: anonCookie }))
    expect(moderateCommentMock).toHaveBeenCalledTimes(1)
    expect(moderateCommentMock).toHaveBeenCalledWith(VALID_BODY.body)
  })

  it('passes every verdict field through to postComment verbatim', async () => {
    moderateCommentMock.mockResolvedValue(BLOCK_VERDICT)
    await POST(postRequest({ cookie: anonCookie }))
    expect(postCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        verdict: 'block',
        categories: ['spoiler_winner', 'spoiler_finale'],
        confidence: 0.97,
        reason: 'reveals season winner',
        redactedPhrase: 'X wins',
      }),
    )
  })

  it('passes a null redacted_phrase through as null', async () => {
    await POST(postRequest({ cookie: anonCookie }))
    expect(postCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({ redactedPhrase: null }),
    )
  })

  it('echoes the moderation verdict in the success body so the client can show the held-for-review affordance', async () => {
    moderateCommentMock.mockResolvedValue(BLOCK_VERDICT)
    postCommentMock.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000002',
      status: 'pending',
      count: 0,
    })
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      id: '00000000-0000-4000-8000-000000000002',
      status: 'pending',
      count: 0,
      verdict: 'block',
    })
  })
})

describe('POST /api/comment — RPC error mapping', () => {
  it('maps a 42501 RLS denial to 401 auth_required', async () => {
    postCommentMock.mockRejectedValue(Object.assign(new Error('rls denied'), { code: '42501' }))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'auth_required' })
  })

  it('maps a 23505 unique-violation to 429 rate_limited', async () => {
    postCommentMock.mockRejectedValue(
      Object.assign(new Error('comment rate limit exceeded'), { code: '23505' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(429)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'rate_limited' })
  })

  it('maps a 22023 invalid-argument to 400 invalid_input', async () => {
    postCommentMock.mockRejectedValue(
      Object.assign(new Error('bad target'), { code: '22023' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_input' })
  })

  it('maps any other RPC throw to 500 rpc_failed', async () => {
    postCommentMock.mockRejectedValue(new Error('connection reset'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'rpc_failed' })
  })
})

describe('/api/comment — route contract', () => {
  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the comment route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

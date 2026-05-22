import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ANON_COOKIE_NAME } from '@/lib/anonSession'

// /api/vote is the core interaction surface — every season page's
// VotePair writes through POST and reads back through GET. The
// hermetic e2e suite walks the happy path (anon vote -> sign-in ->
// claim), but the route's error mapping (brigade 429, invalid_input
// 400, rpc_failed 500), its Zod body/query rejection (400), and the
// issue-#64 leak guard (the success body reports the unweighted
// rawCount, never the weighted ranking aggregate) are all dark to a
// happy-path walk. The Auth0 + Supabase boundaries are mocked;
// anonSession stays real so the cookie regex + UUID validation run
// for genuine — that pins the route's actual contract.
const {
  getSessionMock,
  castVoteMock,
  readVoteMock,
  claimAnonSessionMock,
  upsertUserMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  castVoteMock: vi.fn(),
  readVoteMock: vi.fn(),
  claimAnonSessionMock: vi.fn(),
  upsertUserMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('@/lib/supabase/server', () => ({
  castVote: castVoteMock,
  readVote: readVoteMock,
  claimAnonSession: claimAnonSessionMock,
  upsertUser: upsertUserMock,
}))

import { GET, POST, dynamic, runtime } from '../route'

// Hex-shaped UUID — isValidAnonId only checks the 8-4-4-4-12 layout.
const VALID_ANON_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
const VALID_BODY = { targetType: 'season', targetId: 'survivor-20', value: 1 }

function postRequest(
  opts: { body?: unknown; raw?: string; cookie?: string } = {},
): Request {
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  const body = opts.raw !== undefined ? opts.raw : JSON.stringify(opts.body ?? VALID_BODY)
  return new Request('http://localhost/api/vote', { method: 'POST', headers, body })
}

function getRequest(
  opts: { targetType?: string; targetId?: string; cookie?: string } = {},
): Request {
  const params = new URLSearchParams()
  if (opts.targetType !== undefined) params.set('targetType', opts.targetType)
  if (opts.targetId !== undefined) params.set('targetId', opts.targetId)
  const qs = params.toString()
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  return new Request(`http://localhost/api/vote${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers,
  })
}

const anonCookie = `${ANON_COOKIE_NAME}=${VALID_ANON_ID}`

beforeEach(() => {
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue(null) // anon caller by default
  castVoteMock.mockReset()
  // weight 1, weighted aggregate `count` 9.5, unweighted net `rawCount` 4 —
  // three distinct values so the #64 leak guard test is unambiguous.
  castVoteMock.mockResolvedValue({
    value: 1,
    weight: 1,
    count: 9.5,
    rawCount: 4,
    persisted: true,
  })
  readVoteMock.mockReset()
  readVoteMock.mockResolvedValue({ value: -1, count: 8.5, rawCount: 2 })
  claimAnonSessionMock.mockReset()
  claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-session-id' })
  upsertUserMock.mockReset()
  upsertUserMock.mockResolvedValue(undefined)
})

describe('POST /api/vote — body validation', () => {
  it('casts a vote for a well-formed body and returns the success shape', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      value: 1,
      weight: 1,
      count: 4,
      persisted: true,
    })
    expect(castVoteMock).toHaveBeenCalledWith({
      sessionId: VALID_ANON_ID,
      targetType: 'season',
      targetId: 'survivor-20',
      value: 1,
    })
  })

  it('rejects an unknown targetType with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, targetType: 'episode' }, cookie: anonCookie }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_body' })
    expect(castVoteMock).not.toHaveBeenCalled()
  })

  it('rejects a value outside the -1/0/1 union with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, value: 2 }, cookie: anonCookie }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(castVoteMock).not.toHaveBeenCalled()
  })

  it('rejects an empty targetId with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, targetId: '' }, cookie: anonCookie }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a non-JSON body with 400 invalid_body', async () => {
    const res = await POST(postRequest({ raw: 'not json at all', cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(castVoteMock).not.toHaveBeenCalled()
  })

  it('validates the body before resolving a session', async () => {
    // A malformed body must 400 even with no cookie — the parse
    // gate runs first, so no_session is never reached.
    const res = await POST(postRequest({ body: { value: 1 } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })
})

describe('POST /api/vote — session resolution', () => {
  it('votes as the anon session id when a valid anon cookie is present', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    expect(castVoteMock).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: VALID_ANON_ID }),
    )
  })

  it('rejects with 400 no_session when the anon cookie is absent', async () => {
    const res = await POST(postRequest())
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'no_session' })
    expect(castVoteMock).not.toHaveBeenCalled()
  })

  it('rejects with 400 no_session when the anon cookie is not a valid UUID', async () => {
    const res = await POST(postRequest({ cookie: `${ANON_COOKIE_NAME}=not-a-uuid` }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'no_session' })
    expect(castVoteMock).not.toHaveBeenCalled()
  })

  it('upserts the users row and claims the anon session for an authed caller', async () => {
    getSessionMock.mockResolvedValue({ user: { sub: 'auth0|abc123', nickname: 'Tester' } })
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith({
      sub: 'auth0|abc123',
      handle: 'tester',
      email: null,
      displayName: null,
    })
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: VALID_ANON_ID,
      sub: 'auth0|abc123',
    })
  })

  it("votes as the claimed session id for an authed caller, not the raw anon id", async () => {
    getSessionMock.mockResolvedValue({ user: { sub: 'auth0|abc123', nickname: 'Tester' } })
    claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-xyz' })
    await POST(postRequest({ cookie: anonCookie }))
    expect(castVoteMock).toHaveBeenCalledWith(
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
    expect(castVoteMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/vote — RPC error mapping', () => {
  it('maps a 23505 unique-violation to 429 rate_limited', async () => {
    castVoteMock.mockRejectedValue(Object.assign(new Error('dup'), { code: '23505' }))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(429)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'rate_limited' })
  })

  it('maps a brigade-hint error to 429 rate_limited', async () => {
    castVoteMock.mockRejectedValue(
      Object.assign(new Error('limit'), { hint: 'brigade limit exceeded' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(429)
    await expect(res.json()).resolves.toMatchObject({ error: 'rate_limited' })
  })

  it('maps a 22023 invalid-argument to 400 invalid_input', async () => {
    castVoteMock.mockRejectedValue(
      Object.assign(new Error('bad target'), { code: '22023' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_input' })
  })

  it('maps any other RPC throw to 500 rpc_failed', async () => {
    castVoteMock.mockRejectedValue(new Error('connection reset'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'rpc_failed' })
  })
})

describe('POST /api/vote — issue #64 leak guard', () => {
  it('reports the unweighted rawCount, never the weighted ranking aggregate', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    const body = await res.json()
    // castVote returned rawCount 4 (clean net) and count 9.5
    // (weighted aggregate). The client must only ever see 4.
    expect(body.count).toBe(4)
    expect(JSON.stringify(body)).not.toContain('9.5')
  })
})

describe('GET /api/vote — query validation', () => {
  it('reads the vote for a well-formed query and returns the success shape', async () => {
    const res = await GET(
      getRequest({ targetType: 'season', targetId: 'survivor-20', cookie: anonCookie }),
    )
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true, value: -1, count: 2 })
    expect(readVoteMock).toHaveBeenCalledWith({
      sessionId: VALID_ANON_ID,
      targetType: 'season',
      targetId: 'survivor-20',
    })
  })

  it('rejects with 400 invalid_query when targetType is missing', async () => {
    const res = await GET(getRequest({ targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_query' })
    expect(readVoteMock).not.toHaveBeenCalled()
  })

  it('rejects with 400 invalid_query when targetId is missing', async () => {
    const res = await GET(getRequest({ targetType: 'season' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_query' })
  })

  it('rejects with 400 invalid_query when targetType is outside the enum', async () => {
    const res = await GET(getRequest({ targetType: 'episode', targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_query' })
  })
})

describe('GET /api/vote — session resolution', () => {
  it('reads with a null session id for an anon visitor with no cookie', async () => {
    // A cookieless GET is legitimate — the aggregate is still
    // readable; only POST rejects a missing session.
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(200)
    expect(readVoteMock).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: null }),
    )
  })

  it('reads as the anon session id when a valid cookie is present', async () => {
    await GET(
      getRequest({ targetType: 'season', targetId: 'survivor-20', cookie: anonCookie }),
    )
    expect(readVoteMock).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: VALID_ANON_ID }),
    )
  })

  it('maps a getSession failure to 500 auth_resolve_failed', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ error: 'auth_resolve_failed' })
    expect(readVoteMock).not.toHaveBeenCalled()
  })
})

describe('GET /api/vote — RPC error mapping + leak guard', () => {
  it('maps a 22023 invalid-argument to 400 invalid_input', async () => {
    readVoteMock.mockRejectedValue(
      Object.assign(new Error('bad target'), { code: '22023' }),
    )
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_input' })
  })

  it('maps any other RPC throw to 500 rpc_failed', async () => {
    readVoteMock.mockRejectedValue(new Error('connection reset'))
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ error: 'rpc_failed' })
  })

  it('reports the unweighted rawCount, never the weighted aggregate', async () => {
    const res = await GET(
      getRequest({ targetType: 'season', targetId: 'survivor-20', cookie: anonCookie }),
    )
    const body = await res.json()
    // readVote returned rawCount 2 and the weighted aggregate 8.5.
    expect(body.count).toBe(2)
    expect(JSON.stringify(body)).not.toContain('8.5')
  })
})

describe('/api/vote — route contract', () => {
  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the vote route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

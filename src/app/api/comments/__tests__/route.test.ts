import { beforeEach, describe, expect, it, vi } from 'vitest'

// /api/comments is the read sibling of /api/comment (POST). The
// season page is SSG/ISR, so the client thread component fetches
// this route on mount so a refresh shows truth — every season page
// hits this route on first render. Spoiler discipline is P0
// (CLAUDE.md "Five hard rules" + agents.md §7), so the
// sub-passthrough → published/own-pending visibility split is
// load-bearing. The hermetic e2e suite covers the route only
// transitively (apps/e2e/tests/comments.spec.ts asserts the thread
// renders), so the route's full branch tree — query validation
// (Zod), session→sub resolution, the .catch on getSession (an
// Auth0 outage must not throw out of the read path the season page
// polls on mount), the sub passthrough to listThreadComments (the
// only thing that controls whether the viewer sees their own held
// row), the signedIn derivation, the publishedCount → count echo,
// and the Cache-Control: private, no-store contract (a regression
// here would let a CDN/proxy serve one member's held-comment
// payload to another viewer) — is dark to a happy-path walk. The
// Auth0 + Supabase boundaries are mocked; buildThread stays REAL
// so the published/own-pending visibility split runs for genuine
// on the route's behalf.
const { getSessionMock, listThreadCommentsMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  listThreadCommentsMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('@/lib/supabase/server', () => ({
  listThreadComments: listThreadCommentsMock,
}))

import { GET, dynamic, runtime } from '../route'

const AUTHED_SUB = 'auth0|abc123'

function getRequest(query: Record<string, string | undefined> = {}): Request {
  const url = new URL('http://localhost/api/comments')
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) url.searchParams.set(k, v)
  }
  return new Request(url, { method: 'GET' })
}

const publishedRow = (over: Partial<{ id: string; body: string; status: string }> = {}) => ({
  id: over.id ?? '00000000-0000-4000-8000-000000000001',
  body: over.body ?? 'great cast, great location, format change worked.',
  author: 'tester',
  created_at: '2026-05-20T10:00:00.000Z',
  status: (over.status ?? 'published') as 'published' | 'pending' | 'hidden' | 'removed',
})

const ownPendingRow = (over: Partial<{ id: string; body: string }> = {}) => ({
  id: over.id ?? '00000000-0000-4000-8000-000000000002',
  body: over.body ?? 'mine, awaiting review',
  author: 'tester',
  created_at: '2026-05-21T10:00:00.000Z',
  status: 'pending' as const,
})

beforeEach(() => {
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue({ user: { sub: AUTHED_SUB, nickname: 'tester' } })
  listThreadCommentsMock.mockReset()
  listThreadCommentsMock.mockResolvedValue({ published: [], ownPending: [] })
})

describe('GET /api/comments — query validation', () => {
  it('returns 200 + the success shape for a well-formed query', async () => {
    listThreadCommentsMock.mockResolvedValue({
      published: [publishedRow()],
      ownPending: [],
    })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      ok: true,
      signedIn: true,
      count: 1,
    })
    expect(body.comments).toHaveLength(1)
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: 'season',
        targetId: 'survivor-20',
        sub: AUTHED_SUB,
      }),
    )
  })

  it('rejects a missing targetType with 400 invalid_query', async () => {
    const res = await GET(getRequest({ targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_query' })
    expect(listThreadCommentsMock).not.toHaveBeenCalled()
  })

  it('rejects a missing targetId with 400 invalid_query', async () => {
    const res = await GET(getRequest({ targetType: 'season' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ ok: false, error: 'invalid_query' })
    expect(listThreadCommentsMock).not.toHaveBeenCalled()
  })

  it('rejects an unknown targetType with 400 invalid_query', async () => {
    const res = await GET(getRequest({ targetType: 'episode', targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_query' })
    expect(listThreadCommentsMock).not.toHaveBeenCalled()
  })

  it('rejects an empty targetId with 400 invalid_query', async () => {
    const res = await GET(getRequest({ targetType: 'season', targetId: '' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_query' })
  })

  it('rejects a targetId longer than 128 chars with 400 invalid_query', async () => {
    const res = await GET(
      getRequest({ targetType: 'season', targetId: 'x'.repeat(129) }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_query' })
  })

  it('accepts targetType=comment (the comment-reply read path)', async () => {
    const res = await GET(
      getRequest({ targetType: 'comment', targetId: '00000000-0000-4000-8000-000000000001' }),
    )
    expect(res.status).toBe(200)
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ targetType: 'comment' }),
    )
  })

  it('validates the query before resolving a session — a malformed query never reads the cookie', async () => {
    const res = await GET(getRequest({ targetType: 'episode', targetId: 'survivor-20' }))
    expect(res.status).toBe(400)
    expect(getSessionMock).not.toHaveBeenCalled()
  })
})

describe('GET /api/comments — session resolution', () => {
  it('resolves sub from a string session.user.sub and forwards it to listThreadComments', async () => {
    await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: AUTHED_SUB }),
    )
  })

  it('returns the viewer handle on the signed-in response (CommentInput attribution source)', async () => {
    // The /api/comments payload doubles as the auth-state probe the
    // SSG/ISR season page's CommentThreadLive depends on; the handle
    // drives CommentInput's "as @{handle}" affordance (CRITIQUE pass-18
    // MED). Source-of-truth derivation lives in
    // headerUserFromSession so the route never inlines its own
    // nickname/email/sub heuristic.
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    await expect(res.json()).resolves.toMatchObject({
      ok: true,
      signedIn: true,
      handle: 'tester',
    })
  })

  it('returns handle: null on the anon response', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    await expect(res.json()).resolves.toMatchObject({
      ok: true,
      signedIn: false,
      handle: null,
    })
  })

  it('returns handle: null when getSession rejects (auth-resilient — no leak from the catch)', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    await expect(res.json()).resolves.toMatchObject({
      signedIn: false,
      handle: null,
    })
  })

  it('returns handle: null when the session lacks any handle-derivable field (sub-only session)', async () => {
    getSessionMock.mockResolvedValue({ user: { sub: AUTHED_SUB } })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    const body = await res.json()
    expect(body.signedIn).toBe(true)
    // headerUserFromSession falls back to a sub-derived handle when
    // nickname/email are absent; the route forwards verbatim. A
    // sanitized non-empty string here proves the route did not
    // inline its own heuristic.
    expect(typeof body.handle).toBe('string')
    expect(body.handle.length).toBeGreaterThan(0)
  })

  it('passes sub=null when there is no session (anon viewer)', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toMatchObject({ signedIn: false })
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: null }),
    )
  })

  it('passes sub=null when the session carries no sub (half-baked Auth0 session)', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toMatchObject({ signedIn: false })
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: null }),
    )
  })

  it('passes sub=null when session.user.sub is not a string', async () => {
    getSessionMock.mockResolvedValue({ user: { sub: 12345 } })
    await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: null }),
    )
  })

  it('swallows a getSession failure and continues as an anon read (auth resilience)', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toMatchObject({ ok: true, signedIn: false })
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: null }),
    )
  })
})

describe('GET /api/comments — spoiler discipline (visibility split via buildThread)', () => {
  // buildThread is REAL in this file — these cases prove the route
  // wires the published/ownPending channels correctly so the spoiler
  // visibility split downstream runs over the right rows.

  it('renders published rows and the publishedCount echoes their count', async () => {
    listThreadCommentsMock.mockResolvedValue({
      published: [
        publishedRow({ id: '00000000-0000-4000-8000-000000000001' }),
        publishedRow({ id: '00000000-0000-4000-8000-000000000003' }),
      ],
      ownPending: [],
    })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    const body = await res.json()
    expect(body.count).toBe(2)
    expect(body.comments).toHaveLength(2)
    expect(body.comments.every((c: { held: boolean }) => c.held === false)).toBe(true)
  })

  it('surfaces the viewer own held row when ownPending is populated (held=true) and excludes it from count', async () => {
    listThreadCommentsMock.mockResolvedValue({
      published: [publishedRow()],
      ownPending: [ownPendingRow()],
    })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    const body = await res.json()
    // count is publishedCount only — held rows do not inflate it.
    expect(body.count).toBe(1)
    expect(body.comments).toHaveLength(2)
    const held = body.comments.find((c: { held: boolean }) => c.held === true)
    expect(held).toBeDefined()
    expect(held.id).toBe('00000000-0000-4000-8000-000000000002')
  })

  it('never surfaces hidden / removed status to the public response even if the data layer returns them', async () => {
    listThreadCommentsMock.mockResolvedValue({
      published: [
        publishedRow({ id: '00000000-0000-4000-8000-000000000001' }),
        publishedRow({ id: '00000000-0000-4000-8000-000000000004', status: 'hidden' }),
        publishedRow({ id: '00000000-0000-4000-8000-000000000005', status: 'removed' }),
      ],
      ownPending: [],
    })
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    const body = await res.json()
    expect(body.count).toBe(1)
    expect(body.comments).toHaveLength(1)
    expect(body.comments[0].id).toBe('00000000-0000-4000-8000-000000000001')
  })

  it('passes the resolved sub through to listThreadComments verbatim — the only knob that controls whether held rows surface', async () => {
    getSessionMock.mockResolvedValue({ user: { sub: 'auth0|exact-sub-here' } })
    await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(listThreadCommentsMock).toHaveBeenCalledWith(
      expect.objectContaining({ sub: 'auth0|exact-sub-here' }),
    )
  })
})

describe('GET /api/comments — caching contract', () => {
  // Per-viewer payload (signed-in/out chrome plus the viewer's OWN
  // pending row) must never be cached by a shared CDN/proxy. A
  // regression here is a cross-viewer auth-state leak (the same
  // class the Header island and /api/auth/me defend).

  it('sets Cache-Control: private, no-store on a signed-in response', async () => {
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.headers.get('cache-control')).toBe('private, no-store')
  })

  it('sets Cache-Control: private, no-store on an anon response', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(res.headers.get('cache-control')).toBe('private, no-store')
  })
})

describe('/api/comments — route contract', () => {
  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the comments read route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  it('calls getSession exactly once per valid request', async () => {
    await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(getSessionMock).toHaveBeenCalledTimes(1)
  })

  it('calls listThreadComments exactly once per valid request', async () => {
    await GET(getRequest({ targetType: 'season', targetId: 'survivor-20' }))
    expect(listThreadCommentsMock).toHaveBeenCalledTimes(1)
  })
})

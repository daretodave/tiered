import { beforeEach, describe, expect, it, vi } from 'vitest'

// GET /api/auth/me is the per-viewer auth-state probe the header
// island fetches on mount to correct statically-rendered chrome.
// The Auth0 boundary is mocked; the session->user mapping runs for
// real via the (separately-tested) headerUser helper, so the
// route's actual contract — JSON shape, the load-bearing
// `.catch(() => null)` resilience, and the `private, no-store`
// cache header that keeps one viewer's auth state off the CDN — is
// what gets pinned.
const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

import { GET, dynamic } from '../route'

beforeEach(() => {
  getSessionMock.mockReset()
})

describe('GET /api/auth/me — session → response mapping', () => {
  it('maps a nickname session to a signed-in payload', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    const res = await GET()
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      signedIn: true,
      user: { handle: 'tester', displayLabel: '@tester', profileHref: '/u/tester' },
    })
  })

  it('falls back to the email local-part when no nickname is present', async () => {
    getSessionMock.mockResolvedValue({ user: { email: 'Asha@example.com' } })
    const res = await GET()
    await expect(res.json()).resolves.toEqual({
      ok: true,
      signedIn: true,
      user: { handle: 'asha', displayLabel: '@asha', profileHref: '/u/asha' },
    })
  })

  it('returns signedIn:false with user:null when the session is null', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await GET()
    await expect(res.json()).resolves.toEqual({ ok: true, signedIn: false, user: null })
  })

  it('returns signedIn:false when the session carries no user', async () => {
    getSessionMock.mockResolvedValue({})
    const res = await GET()
    await expect(res.json()).resolves.toEqual({ ok: true, signedIn: false, user: null })
  })
})

describe('GET /api/auth/me — auth resilience', () => {
  it('swallows a getSession rejection and resolves signed-out', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    // The .catch(() => null) is load-bearing: an Auth0 outage must
    // not throw out of the probe the header polls on every route.
    const res = await GET()
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true, signedIn: false, user: null })
  })
})

describe('GET /api/auth/me — caching contract', () => {
  it('marks a signed-in response private, no-store', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    const res = await GET()
    // Per-viewer payload — a shared CDN cache here would serve one
    // member's auth state to another. This header is the guard.
    expect(res.headers.get('cache-control')).toBe('private, no-store')
  })

  it('marks a signed-out response private, no-store', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await GET()
    expect(res.headers.get('cache-control')).toBe('private, no-store')
  })
})

describe('GET /api/auth/me — render contract', () => {
  it('resolves the Auth0 session exactly once per request', async () => {
    getSessionMock.mockResolvedValue(null)
    await GET()
    expect(getSessionMock).toHaveBeenCalledTimes(1)
  })

  it('is declared force-dynamic so the probe never bakes at build', async () => {
    // A static bake would freeze one viewer's state into the route
    // and serve it to everyone — the same leak the cache header guards.
    expect(dynamic).toBe('force-dynamic')
  })
})

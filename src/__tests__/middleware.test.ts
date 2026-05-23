import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

import { ANON_COOKIE_MAX_AGE_SEC, ANON_COOKIE_NAME, isValidAnonId } from '@/lib/anonSession'

// src/middleware.ts is Next.js Edge middleware — runs on every
// page, every API route, and every auth route (per config.matcher).
// It composes three behaviors none of which the hermetic e2e suite
// can pin from the outside: (1) the phase-29 /search → / 308
// retirement, (2) Auth0 middleware mount + auth-route passthrough
// without anon-cookie stamping, and (3) anon-cookie issuance with
// the security-relevant attribute set (httpOnly, sameSite=lax,
// secure-in-prod, path=/, maxAge=400d). The Auth0 boundary is
// mocked; anonSession stays real so the UUID validation + cookie
// name constant run for genuine.
const { middlewareMock } = vi.hoisted(() => ({
  middlewareMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { middleware: middlewareMock },
}))

import { middleware, config } from '../middleware'

const VALID_ANON_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'

function makeRequest(path: string, opts: { cookie?: string; search?: string } = {}): NextRequest {
  const url = `http://localhost${path}${opts.search ?? ''}`
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  return new NextRequest(url, { headers })
}

function readAnonSetCookie(res: NextResponse): { value: string; attrs: string } | null {
  const raw = res.headers.get('set-cookie')
  if (!raw) return null
  // NextResponse only stamps the one anon cookie under test; the
  // header is a single Set-Cookie line `name=value; Attr1; Attr2; …`.
  const match = raw.match(new RegExp(`${ANON_COOKIE_NAME}=([^;]+);(.*)$`))
  if (!match) return null
  return { value: match[1]!, attrs: match[2]! }
}

beforeEach(() => {
  middlewareMock.mockReset()
  // Default: Auth0 SDK passes the request through unchanged.
  middlewareMock.mockImplementation(async () => NextResponse.next())
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('middleware — phase-29 /search retirement', () => {
  it('redirects GET /search to / with a 308', async () => {
    const res = await middleware(makeRequest('/search'))
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('drops the query string on the /search redirect (url.search="" is load-bearing)', async () => {
    // A retired path that forwarded the query would leak stale
    // ?q=… into the home route; the cleared search is the contract.
    const res = await middleware(makeRequest('/search', { search: '?q=heroes' }))
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('skips Auth0 entirely on /search so the SDK never sees the retired path', async () => {
    await middleware(makeRequest('/search'))
    expect(middlewareMock).not.toHaveBeenCalled()
  })

  it('does NOT redirect /searcher (substring) — only the exact /search path is retired', async () => {
    const res = await middleware(makeRequest('/searcher'))
    expect(res.status).not.toBe(308)
    expect(middlewareMock).toHaveBeenCalledOnce()
  })

  it('does NOT redirect a nested /foo/search — only the exact top-level /search path is retired', async () => {
    const res = await middleware(makeRequest('/foo/search'))
    expect(res.status).not.toBe(308)
    expect(middlewareMock).toHaveBeenCalledOnce()
  })
})

describe('middleware — Auth0 SDK composition', () => {
  it('awaits auth0.middleware(request) exactly once per non-/search request', async () => {
    await middleware(makeRequest('/shows/survivor'))
    expect(middlewareMock).toHaveBeenCalledOnce()
    expect(middlewareMock).toHaveBeenCalledWith(expect.any(NextRequest))
  })

  it('returns the auth0Response object as the base (so SDK-side headers survive)', async () => {
    // A regression that constructed a fresh NextResponse instead of
    // mutating the SDK's response would drop any redirect/headers
    // Auth0 set during token refresh.
    const auth0Res = NextResponse.next()
    auth0Res.headers.set('x-auth0-marker', 'present')
    middlewareMock.mockResolvedValueOnce(auth0Res)
    const res = await middleware(makeRequest('/shows/survivor', { cookie: `${ANON_COOKIE_NAME}=${VALID_ANON_ID}` }))
    expect(res).toBe(auth0Res)
    expect(res.headers.get('x-auth0-marker')).toBe('present')
  })
})

describe('middleware — /auth/ passthrough (no anon cookie during SDK handshake)', () => {
  it('does NOT stamp an anon cookie on /auth/login (SDK is mid-handshake)', async () => {
    const res = await middleware(makeRequest('/auth/login'))
    expect(readAnonSetCookie(res)).toBeNull()
  })

  it('does NOT stamp an anon cookie on /auth/callback', async () => {
    const res = await middleware(makeRequest('/auth/callback'))
    expect(readAnonSetCookie(res)).toBeNull()
  })

  it('does NOT stamp an anon cookie on /auth/logout', async () => {
    const res = await middleware(makeRequest('/auth/logout'))
    expect(readAnonSetCookie(res)).toBeNull()
  })

  it('returns the auth0Response unchanged on /auth/* (passthrough is strict)', async () => {
    const auth0Res = NextResponse.redirect(new URL('http://localhost/auth/callback'))
    middlewareMock.mockResolvedValueOnce(auth0Res)
    const res = await middleware(makeRequest('/auth/login'))
    expect(res).toBe(auth0Res)
  })

  it('DOES stamp an anon cookie on /authentic (substring — does not start with /auth/)', async () => {
    // The startsWith('/auth/') gate uses the trailing slash; any
    // non-slash path starting with "auth" must flow into the cookie
    // path. A regression to startsWith('/auth') would skip cookie
    // issuance on /authentic, /author/*, /auth-status, etc.
    const res = await middleware(makeRequest('/authentic'))
    expect(readAnonSetCookie(res)).not.toBeNull()
  })
})

describe('middleware — anon cookie short-circuit when a valid id is present', () => {
  it('does NOT mint a new cookie when the request carries a valid tiered_anon_id', async () => {
    const res = await middleware(
      makeRequest('/shows/survivor', { cookie: `${ANON_COOKIE_NAME}=${VALID_ANON_ID}` }),
    )
    expect(readAnonSetCookie(res)).toBeNull()
  })

  it('does NOT mint a new cookie when the existing cookie is a mixed-case UUID (isValidAnonId is case-insensitive)', async () => {
    const upper = VALID_ANON_ID.toUpperCase()
    const res = await middleware(
      makeRequest('/shows/survivor', { cookie: `${ANON_COOKIE_NAME}=${upper}` }),
    )
    expect(readAnonSetCookie(res)).toBeNull()
  })
})

describe('middleware — anon cookie issuance (mint on absent / invalid)', () => {
  it('mints a fresh tiered_anon_id when no cookie is present', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted).not.toBeNull()
    expect(isValidAnonId(minted!.value)).toBe(true)
  })

  it('mints a fresh tiered_anon_id when the existing cookie is non-UUID (overwrite)', async () => {
    const res = await middleware(
      makeRequest('/shows/survivor', { cookie: `${ANON_COOKIE_NAME}=not-a-uuid` }),
    )
    const minted = readAnonSetCookie(res)
    expect(minted).not.toBeNull()
    expect(isValidAnonId(minted!.value)).toBe(true)
    expect(minted!.value).not.toBe('not-a-uuid')
  })

  it('mints a fresh tiered_anon_id when the existing cookie is empty', async () => {
    const res = await middleware(
      makeRequest('/shows/survivor', { cookie: `${ANON_COOKIE_NAME}=` }),
    )
    const minted = readAnonSetCookie(res)
    expect(minted).not.toBeNull()
    expect(isValidAnonId(minted!.value)).toBe(true)
  })

  it('mints a fresh id when only an unrelated cookie is present', async () => {
    const res = await middleware(
      makeRequest('/shows/survivor', { cookie: 'theme=dark; other=xyz' }),
    )
    const minted = readAnonSetCookie(res)
    expect(minted).not.toBeNull()
    expect(isValidAnonId(minted!.value)).toBe(true)
  })

  it('mints distinct ids across requests (the cookie is per-visitor, not a constant)', async () => {
    const a = readAnonSetCookie(await middleware(makeRequest('/shows/survivor')))
    const b = readAnonSetCookie(await middleware(makeRequest('/shows/survivor')))
    expect(a).not.toBeNull()
    expect(b).not.toBeNull()
    expect(a!.value).not.toBe(b!.value)
  })
})

describe('middleware — anon cookie security attributes', () => {
  it('stamps HttpOnly so JS cannot read the cookie (XSS containment)', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).toMatch(/HttpOnly/i)
  })

  it('stamps SameSite=Lax so cross-site form posts cannot ride the cookie', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).toMatch(/SameSite=Lax/i)
  })

  it('stamps Path=/ so the cookie scopes to the whole product', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).toMatch(/Path=\//)
  })

  it('stamps Max-Age = ANON_COOKIE_MAX_AGE_SEC (the Chrome 400-day clamp)', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).toMatch(new RegExp(`Max-Age=${ANON_COOKIE_MAX_AGE_SEC}`))
    // Belt-and-braces against the constant drifting silently.
    expect(ANON_COOKIE_MAX_AGE_SEC).toBe(400 * 24 * 60 * 60)
  })

  it('stamps the cookie under ANON_COOKIE_NAME (not a hardcoded literal that could drift)', async () => {
    const res = await middleware(makeRequest('/shows/survivor'))
    const raw = res.headers.get('set-cookie')
    expect(raw).toMatch(new RegExp(`^${ANON_COOKIE_NAME}=`))
  })
})

describe('middleware — Secure attribute is NODE_ENV-conditional', () => {
  it('stamps Secure in production (NODE_ENV=production)', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).toMatch(/Secure/i)
  })

  it('omits Secure when NODE_ENV is not production (so local http dev works)', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).not.toMatch(/Secure/i)
  })

  it('omits Secure in the test env too (NODE_ENV=test)', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    const res = await middleware(makeRequest('/shows/survivor'))
    const minted = readAnonSetCookie(res)
    expect(minted!.attrs).not.toMatch(/Secure/i)
  })
})

describe('middleware — config.matcher static-asset exclusions', () => {
  it('exports a matcher array with exactly one pattern', () => {
    expect(Array.isArray(config.matcher)).toBe(true)
    expect(config.matcher).toHaveLength(1)
  })

  it('excludes Next internals so middleware does not run on the build pipeline', () => {
    const pattern = config.matcher[0]!
    // The two `_next/*` carve-outs are the load-bearing performance
    // contract — a regression would run Auth0 + anon-cookie logic on
    // every JS chunk + image in the page bundle.
    expect(pattern).toContain('_next/static')
    expect(pattern).toContain('_next/image')
  })

  it('excludes the standard static-asset extensions a browser fetches outside the SPA shell', () => {
    const pattern = config.matcher[0]!
    expect(pattern).toContain('favicon\\.ico')
    expect(pattern).toContain('.svg')
    expect(pattern).toContain('.png')
    expect(pattern).toContain('.ico')
    expect(pattern).toContain('.json')
    expect(pattern).toContain('.txt')
  })

  it('the pattern is a valid regex (Next.js compiles it; a syntax error would 500 the whole site)', () => {
    const pattern = config.matcher[0]!
    expect(() => new RegExp(pattern)).not.toThrow()
  })
})

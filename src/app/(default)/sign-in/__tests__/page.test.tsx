import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// /sign-in is the magic-link entry point — the only auth-flow page in
// the product. The five contracts the route carries are dark to a
// hermetic e2e walk: the walk needs an anon session, hits /sign-in,
// asserts the form is reachable — it cannot pin the signed-in
// redirect branch (the e2e is anonymous), the `noIndex: true` SEO
// directive (Metadata is serialized into <head> tags but the walk
// doesn't grep for them), nor the encodeURIComponent discipline on
// the loginHref query string (the walk hits the bare /sign-in URL,
// not /sign-in?return=... with special chars).
//
// The auth boundary (`auth0.getSession`) + the navigation boundary
// (`next/navigation.redirect`) are mocked via vi.hoisted + vi.mock so
// each branch is driven deterministically. `@/lib/seo.buildMetadata`
// is left **real** so a regression in canonicalUrl's trailing-slash
// discipline or in siteConfig.baseUrl surfaces here, not just in the
// helper's own test. `redirect` is mocked as a thrower because that
// matches the runtime behavior — Next emits a NEXT_REDIRECT error
// that never returns to the caller, so the route's render branch is
// unreachable when redirect fires.
//
// next/link is left real; it renders as an <a> in @testing-library's
// jsdom env (the same path the production page hits).

const { getSessionMock, redirectMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  redirectMock: vi.fn((_url: string): never => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

import SignInPage, { dynamic, generateMetadata } from '../page'

const lastRedirectTarget = () =>
  redirectMock.mock.calls[redirectMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getSessionMock.mockReset()
  redirectMock.mockClear()
})

// --------------------------------------------------------------------
// Segment-config exports
// --------------------------------------------------------------------

describe('/sign-in segment config', () => {
  it("exports dynamic = 'force-dynamic' — the route reads per-viewer auth state, baking it static would serve one viewer's session to everyone", () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

// --------------------------------------------------------------------
// generateMetadata — title + canonical + noIndex
// --------------------------------------------------------------------

describe('/sign-in generateMetadata', () => {
  it("title is exactly 'Sign in'", () => {
    expect(generateMetadata().title).toBe('Sign in')
  })

  it('description names the magic-link mechanism by email', () => {
    const description = String(generateMetadata().description)
    expect(description).toMatch(/magic link/i)
    expect(description).toMatch(/email/i)
  })

  it('canonical URL points at /sign-in absolute against siteConfig.baseUrl', () => {
    // The metadata flows through real buildMetadata + canonicalUrl, so
    // a regression in either layer (a trailing slash on baseUrl, a
    // double-slash in canonicalUrl) would surface here.
    expect(generateMetadata().alternates?.canonical).toBe('https://tiered.tv/sign-in')
  })

  it('emits robots: { index: false, follow: false } — pins the noIndex discipline', () => {
    // noIndex is load-bearing: sign-in pages have zero search value;
    // indexing them dilutes the home's PageRank and produces noisy
    // SERP entries. A regression dropping noIndex would let Googlebot
    // index the sign-in flow — the SEO equivalent of indexing /api/.
    expect(generateMetadata().robots).toEqual({ index: false, follow: false })
  })
})

// --------------------------------------------------------------------
// Signed-in redirect branch
// --------------------------------------------------------------------

describe('SignInPage — signed-in redirect', () => {
  it('redirects to the return query value when present and the session carries a user', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    await expect(
      SignInPage({ searchParams: Promise.resolve({ return: '/shows/survivor' }) }),
    ).rejects.toThrow('NEXT_REDIRECT')
    expect(lastRedirectTarget()).toBe('/shows/survivor')
  })

  it("defaults the redirect target to '/' when no return query is present", async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    await expect(
      SignInPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow('NEXT_REDIRECT')
    expect(lastRedirectTarget()).toBe('/')
  })

  it("defaults to '/' when searchParams itself is undefined — the route signature allows the prop to be absent", async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    await expect(SignInPage({})).rejects.toThrow('NEXT_REDIRECT')
    expect(lastRedirectTarget()).toBe('/')
  })

  it('passes the returnTo value verbatim to redirect — NOT the loginHref (would loop the magic-link flow)', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    await expect(
      SignInPage({ searchParams: Promise.resolve({ return: '/u/asha' }) }),
    ).rejects.toThrow('NEXT_REDIRECT')
    const target = lastRedirectTarget()
    expect(target).toBe('/u/asha')
    expect(target).not.toMatch(/\/auth\/login/)
    expect(target).not.toMatch(/returnTo=/)
  })

  it('calls redirect exactly once on the signed-in path — no double-redirect', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    try {
      await SignInPage({ searchParams: Promise.resolve({ return: '/' }) })
    } catch {}
    expect(redirectMock).toHaveBeenCalledTimes(1)
  })
})

// --------------------------------------------------------------------
// Signed-in vs signed-out branch detection
// --------------------------------------------------------------------

describe('SignInPage — session-shape branch detection', () => {
  it('does NOT redirect when getSession returns null — anon viewers see the form', async () => {
    getSessionMock.mockResolvedValue(null)
    await SignInPage({ searchParams: Promise.resolve({}) })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('does NOT redirect when the session has no user — defensive against an Auth0 session-stub shape', async () => {
    // session?.user is the gate. An empty session object must NOT
    // redirect — only a session.user does. A regression to a truthy
    // check on the session itself would redirect on every cold load,
    // breaking the sign-in flow for new viewers.
    getSessionMock.mockResolvedValue({})
    await SignInPage({ searchParams: Promise.resolve({}) })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('resolves getSession exactly once per request — no auth fan-out', async () => {
    getSessionMock.mockResolvedValue(null)
    await SignInPage({ searchParams: Promise.resolve({}) })
    expect(getSessionMock).toHaveBeenCalledTimes(1)
  })
})

// --------------------------------------------------------------------
// Signed-out rendering — loginHref construction + URL encoding
// --------------------------------------------------------------------

describe('SignInPage — signed-out rendering, loginHref construction', () => {
  it("defaults the loginHref returnTo to '%2F' when no return query is present", async () => {
    getSessionMock.mockResolvedValue(null)
    const tree = await SignInPage({ searchParams: Promise.resolve({}) })
    render(tree)
    const link = screen.getByTestId('sign-in-continue')
    expect(link.getAttribute('href')).toBe('/auth/login?returnTo=%2F')
  })

  it("defaults the loginHref returnTo to '%2F' when searchParams itself is undefined", async () => {
    getSessionMock.mockResolvedValue(null)
    const tree = await SignInPage({})
    render(tree)
    expect(screen.getByTestId('sign-in-continue').getAttribute('href')).toBe(
      '/auth/login?returnTo=%2F',
    )
  })

  it('threads a simple return path through encodeURIComponent — /shows/survivor → %2Fshows%2Fsurvivor', async () => {
    getSessionMock.mockResolvedValue(null)
    const tree = await SignInPage({
      searchParams: Promise.resolve({ return: '/shows/survivor' }),
    })
    render(tree)
    expect(screen.getByTestId('sign-in-continue').getAttribute('href')).toBe(
      '/auth/login?returnTo=%2Fshows%2Fsurvivor',
    )
  })

  it('encodes special chars in the return value — & ? = % all survive intact through the query string', async () => {
    // The encodeURIComponent is load-bearing here. A regression to raw
    // interpolation `?returnTo=${returnTo}` would corrupt the
    // query string on any returnTo containing `&`, `?`, `=`, or `%`:
    // `/shows/survivor?view=community` would arrive at Auth0 as two
    // query params (returnTo=/shows/survivor + view=community), and
    // the view= slice would be lost on the round-trip.
    getSessionMock.mockResolvedValue(null)
    const tree = await SignInPage({
      searchParams: Promise.resolve({ return: '/shows/survivor?view=community&t=1' }),
    })
    render(tree)
    const href = screen.getByTestId('sign-in-continue').getAttribute('href') ?? ''
    expect(href).toBe(
      '/auth/login?returnTo=%2Fshows%2Fsurvivor%3Fview%3Dcommunity%26t%3D1',
    )
    // The decoded form round-trips back to the original return value —
    // belt-and-braces against a regression that swapped to a different
    // encoding (e.g. encodeURI instead of encodeURIComponent, which
    // leaves `?` `&` `=` un-encoded).
    const queryIndex = href.indexOf('returnTo=')
    expect(decodeURIComponent(href.slice(queryIndex + 'returnTo='.length))).toBe(
      '/shows/survivor?view=community&t=1',
    )
  })

  it('encodes unicode in the return value — a non-ASCII slug would corrupt the query without encodeURIComponent', async () => {
    getSessionMock.mockResolvedValue(null)
    const tree = await SignInPage({
      searchParams: Promise.resolve({ return: '/themes/Société' }),
    })
    render(tree)
    const href = screen.getByTestId('sign-in-continue').getAttribute('href') ?? ''
    // Société → Soci%C3%A9t%C3%A9 under UTF-8 + percent encoding.
    expect(href).toBe('/auth/login?returnTo=%2Fthemes%2FSoci%C3%A9t%C3%A9')
  })
})

// --------------------------------------------------------------------
// Signed-out rendering — form + Link contract
// --------------------------------------------------------------------

describe('SignInPage — form + Link contract', () => {
  it('renders the section, form, and Continue link with stable testids', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await SignInPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('sign-in-page')).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-continue')).toBeInTheDocument()
  })

  it("form action mirrors the loginHref — GET form submission must land at the same target the Continue link points at", async () => {
    getSessionMock.mockResolvedValue(null)
    render(
      await SignInPage({
        searchParams: Promise.resolve({ return: '/shows/survivor' }),
      }),
    )
    const form = screen.getByTestId('sign-in-form') as HTMLFormElement
    const link = screen.getByTestId('sign-in-continue')
    // Both must point at the encoded loginHref. The form's action
    // attribute serializes to an absolute URL when the form is
    // mounted, so we compare on the relative path + query rather
    // than the raw attribute.
    const linkHref = link.getAttribute('href') ?? ''
    expect(linkHref).toBe('/auth/login?returnTo=%2Fshows%2Fsurvivor')
    expect(form.getAttribute('action')).toBe(linkHref)
  })

  it('form method is GET — magic-link entry posts the returnTo via query string, not body', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await SignInPage({ searchParams: Promise.resolve({}) }))
    const form = screen.getByTestId('sign-in-form')
    expect(form.getAttribute('method')).toBe('get')
  })

  it("form carries aria-label 'Sign in with email' — a11y label for screen readers", async () => {
    getSessionMock.mockResolvedValue(null)
    render(await SignInPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('sign-in-form').getAttribute('aria-label')).toBe(
      'Sign in with email',
    )
  })

  it("renders an h1 'Sign in' — the page's single top-level heading", async () => {
    getSessionMock.mockResolvedValue(null)
    render(await SignInPage({ searchParams: Promise.resolve({}) }))
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Sign in')
  })

  it("Continue link text reads 'Continue with email' — the CTA copy", async () => {
    getSessionMock.mockResolvedValue(null)
    render(await SignInPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByTestId('sign-in-continue')).toHaveTextContent(
      'Continue with email',
    )
  })
})

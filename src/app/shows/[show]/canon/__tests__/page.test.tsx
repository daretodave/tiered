import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows/[show]/canon is the phase-33 redirect-only route — the
// standalone Editor's Canon page was consolidated into the show
// page (canon is the default ranking view there), so this route
// 308s every legacy link to /shows/<slug>. The 308 (not 302) is
// load-bearing: it preserves the SEO authority the old canon URL
// accumulated for two phases before consolidation, and it makes
// browsers cache the redirect so a returning reader hits the new
// URL directly.
//
// The route's own contracts — generateStaticParams returning one
// row per loaded show, permanentRedirect targeting /shows/<slug>
// exactly (no ?view=canon query, no trailing slash), the single
// permanentRedirect call — are dark to an e2e walk (e2e walks
// that the redirect lands; it cannot pin that the redirect uses
// 308 vs 302 nor that a future regression didn't quietly append
// ?view= or a trailing slash). The walk would still pass on a
// downgrade from permanentRedirect → redirect; SEO authority would
// silently bleed off the legacy URL family.
//
// `@/content` (getAllShows) + `next/navigation` (permanentRedirect)
// are mocked so the test drives every branch deterministically
// and captures the exact redirect target. permanentRedirect is
// mocked as a thrower that matches the runtime behavior — a
// NEXT_REDIRECT error never returns to the caller, so the route's
// `never` return contract is honored.

const { getAllShowsMock, permanentRedirectMock } = vi.hoisted(() => ({
  getAllShowsMock: vi.fn(),
  permanentRedirectMock: vi.fn((_url: string): never => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

vi.mock('@/content', () => ({
  getAllShows: getAllShowsMock,
}))
vi.mock('next/navigation', () => ({
  permanentRedirect: permanentRedirectMock,
}))

import CanonRedirect, { generateStaticParams } from '../page'

const survivor = { slug: 'survivor' }
const topChef = { slug: 'top-chef' }
const dragRace = { slug: 'rupauls-drag-race' }

const lastTarget = () =>
  permanentRedirectMock.mock.calls[permanentRedirectMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getAllShowsMock.mockReset()
  permanentRedirectMock.mockClear()
  getAllShowsMock.mockReturnValue([survivor, topChef, dragRace])
})

describe('generateStaticParams — SSG coverage of legacy URL family', () => {
  it('returns one params row per loaded show — every show has a redirect entry', () => {
    expect(generateStaticParams()).toEqual([
      { show: 'survivor' },
      { show: 'top-chef' },
      { show: 'rupauls-drag-race' },
    ])
  })

  it('uses the show slug under the `show` key — matches the [show] dynamic-segment name', () => {
    // Next.js maps generateStaticParams entries onto the route's
    // bracket-segment names verbatim. The route is `/shows/[show]/canon`,
    // so each entry must shape `{ show: '<slug>' }` — a regression to
    // `{ slug: ... }` would render zero static params and the route
    // would fall through to on-demand, defeating SSG.
    const params = generateStaticParams()
    expect(params.map((p) => Object.keys(p))).toEqual([['show'], ['show'], ['show']])
    expect(params.map((p) => p.show)).toEqual(['survivor', 'top-chef', 'rupauls-drag-race'])
  })

  it('emits an empty array when no shows are loaded — defensive against a content-layer reset', () => {
    getAllShowsMock.mockReturnValue([])
    expect(generateStaticParams()).toEqual([])
  })

  it('calls getAllShows exactly once per generation — no loader fan-out', () => {
    generateStaticParams()
    expect(getAllShowsMock).toHaveBeenCalledTimes(1)
  })
})

describe('CanonRedirect — target URL', () => {
  it('redirects to /shows/<slug> — the consolidated show page (canon is the default pane)', () => {
    expect(() => CanonRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).toBe('/shows/survivor')
  })

  it('passes the URL slug verbatim — no transformation, no kebab-from-name', () => {
    expect(() => CanonRedirect({ params: { show: 'top-chef' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).toBe('/shows/top-chef')
  })

  it('preserves multi-token slugs intact — e.g. rupauls-drag-race', () => {
    expect(() => CanonRedirect({ params: { show: 'rupauls-drag-race' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).toBe('/shows/rupauls-drag-race')
  })

  it('does NOT append ?view=canon — canon is the default pane; an explicit query would mark every legacy URL as non-canonical in analytics', () => {
    expect(() => CanonRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).not.toMatch(/\?/)
  })

  it('does NOT append a trailing slash — the locked show URL contract is /shows/<slug>, not /shows/<slug>/', () => {
    expect(() => CanonRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).not.toMatch(/\/$/)
  })

  it('targets a sibling of the legacy URL — never /shows/<slug>/canon (would be a self-loop) and never community (the wrong pane)', () => {
    expect(() => CanonRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    const target = lastTarget()
    expect(target).not.toMatch(/\/canon$/)
    expect(target).not.toMatch(/\/community/)
    expect(target).not.toMatch(/view=community/)
  })
})

describe('CanonRedirect — redirect mechanism', () => {
  it('uses permanentRedirect (308), not redirect (302) — preserves canon-page SEO authority that accrued before the phase-33 consolidation', () => {
    // The behavioral difference between permanentRedirect and
    // redirect is invisible to a Playwright follow-redirect walk
    // (both land on the same page), but search engines treat them
    // very differently: 308 transfers PageRank to the new URL, 302
    // does not. A regression to redirect() would silently drain
    // months of accumulated authority off /shows/<slug>/canon.
    expect(() => CanonRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(permanentRedirectMock).toHaveBeenCalledTimes(1)
  })

  it('calls permanentRedirect exactly once per request — no double-redirect, no fan-out', () => {
    try {
      CanonRedirect({ params: { show: 'survivor' } })
    } catch {}
    expect(permanentRedirectMock).toHaveBeenCalledTimes(1)
  })
})

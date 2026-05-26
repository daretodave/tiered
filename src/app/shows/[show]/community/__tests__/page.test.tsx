import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows/[show]/community is the phase-33 redirect-only route — the
// standalone Community Rank page was consolidated into the show
// page, so this route 308s every legacy link to
// /shows/<slug>?view=community. It is the second half of the
// phase-33 redirect pair (canon is the first; tests at
// src/app/shows/[show]/canon/__tests__/page.test.tsx, #180).
//
// The route's three behaviors are dark to a hermetic e2e walk: a
// Playwright follow-redirect walk lands on the destination page
// either way, but it cannot pin (a) that permanentRedirect (308)
// wasn't downgraded to redirect (302) — search engines treat the
// difference very differently for PageRank transfer, (b) that the
// target carries the `?view=community` query verbatim — a
// regression dropping it would land every legacy community URL on
// the consolidated page's *canon* pane (the default), and (c) that
// generateStaticParams emits one entry per loaded show with the
// `[show]` bracket-segment-shaped key — a regression to `{ slug }`
// would render zero static params and defeat SSG for the legacy
// /community URL family.
//
// The contract here is the inverse of canon's: canon redirects to
// the bare /shows/<slug> (canon is the default pane, so no query is
// needed), but community MUST include `?view=community` to land on
// the right pane.
//
// `@/content` (getAllShows) + `next/navigation` (permanentRedirect)
// are mocked so the test drives every branch deterministically and
// captures the exact redirect target. permanentRedirect is mocked
// as a thrower that matches the runtime behavior — a NEXT_REDIRECT
// error never returns to the caller, so the route's `never` return
// contract is honored; the mock is typed `(_url: string): never` so
// vitest infers the captured-call shape correctly (a bare
// `vi.fn(() => { throw })` infers `[][]` and breaks `lastTarget()`'s
// tuple indexing).

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

import CommunityRedirect, { generateStaticParams } from '../page'

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
    // bracket-segment names verbatim. The route is `/shows/[show]/community`,
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

describe('CommunityRedirect — target URL', () => {
  it('redirects to /shows/<slug>?view=community — the consolidated show page on the community pane', () => {
    expect(() => CommunityRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).toBe('/shows/survivor?view=community')
  })

  it('passes the URL slug verbatim — no transformation, no kebab-from-name', () => {
    expect(() => CommunityRedirect({ params: { show: 'top-chef' } })).toThrow('NEXT_REDIRECT')
    expect(lastTarget()).toBe('/shows/top-chef?view=community')
  })

  it('preserves multi-token slugs intact — e.g. rupauls-drag-race', () => {
    expect(() => CommunityRedirect({ params: { show: 'rupauls-drag-race' } })).toThrow(
      'NEXT_REDIRECT',
    )
    expect(lastTarget()).toBe('/shows/rupauls-drag-race?view=community')
  })

  it('MUST append ?view=community — inverse of the canon redirect; without it the legacy community URL would land on the consolidated page\'s default canon pane', () => {
    expect(() => CommunityRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    const target = lastTarget()
    expect(target).toMatch(/\?view=community$/)
    // Belt-and-braces: the literal query string is exactly `?view=community`,
    // not `?view=Community`, not `?pane=community`, not `&view=community`.
    expect(target).toContain('?view=community')
    expect(target).not.toMatch(/\?view=canon/)
  })

  it('does NOT append a trailing slash before the query — the locked show URL contract is /shows/<slug>, not /shows/<slug>/', () => {
    expect(() => CommunityRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    // No `/?` in the target — would mean a trailing slash before the
    // query string, violating the canonical URL shape.
    expect(lastTarget()).not.toMatch(/\/\?/)
  })

  it('targets a sibling of the legacy URL — never /shows/<slug>/community (would be a self-loop) and never the bare /shows/<slug> (the canon pane, the wrong default)', () => {
    expect(() => CommunityRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    const target = lastTarget()
    // Not a self-loop back onto /community.
    expect(target).not.toMatch(/\/community(\?|$)/)
    // Not the bare show page — the consolidated default is canon, so a
    // bare target would land legacy community URLs on the wrong pane.
    expect(target).not.toBe('/shows/survivor')
    // Not the canon pane explicitly either.
    expect(target).not.toMatch(/view=canon/)
  })
})

describe('CommunityRedirect — redirect mechanism', () => {
  it('uses permanentRedirect (308), not redirect (302) — preserves community-page SEO authority that accrued before the phase-33 consolidation', () => {
    // The behavioral difference between permanentRedirect and
    // redirect is invisible to a Playwright follow-redirect walk
    // (both land on the same page), but search engines treat them
    // very differently: 308 transfers PageRank to the new URL, 302
    // does not. A regression to redirect() would silently drain
    // accumulated authority off /shows/<slug>/community.
    expect(() => CommunityRedirect({ params: { show: 'survivor' } })).toThrow('NEXT_REDIRECT')
    expect(permanentRedirectMock).toHaveBeenCalledTimes(1)
  })

  it('calls permanentRedirect exactly once per request — no double-redirect, no fan-out', () => {
    try {
      CommunityRedirect({ params: { show: 'survivor' } })
    } catch {}
    expect(permanentRedirectMock).toHaveBeenCalledTimes(1)
  })
})

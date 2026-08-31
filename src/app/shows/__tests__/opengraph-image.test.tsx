import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows/opengraph-image is the social-share card for the catalog
// index — a primary top-nav destination that, until critique
// pass-118, silently fell back to the generic sitewide OG image
// (the same one the homepage uses). Confirmed via source read: no
// opengraph-image.tsx existed under src/app/(default)/shows/ even
// though per-show, per-season, and per-theme dynamic routes already
// had one. This route follows the same shape as
// src/app/themes/[theme]/opengraph-image.tsx — static eyebrow +
// title, a computed blurb, no palette (the index isn't tied to one
// show's paint) — handed to the shared buildOgImage template
// (separately tested in src/lib/og/__tests__/template.test.tsx).
//
// Unlike the per-show/per-season/per-theme routes, /shows carries no
// dynamic URL param and never 404s — it derives its blurb from every
// show's tier via groupShowsByTier/showsForTier, mirroring exactly
// what page.tsx's own generateMetadata does for the SEO description.
// @/content and @/lib/og/template are mocked so the test drives the
// tier-population logic deterministically and captures what the
// route passes to buildOgImage.

const { getAllShowsMock, buildOgImageMock } = vi.hoisted(() => ({
  getAllShowsMock: vi.fn(),
  buildOgImageMock: vi.fn(),
}))

vi.mock('@/content', () => ({
  getAllShows: getAllShowsMock,
}))
vi.mock('@/lib/og/template', () => ({
  buildOgImage: buildOgImageMock,
}))

import OpenGraphImage, {
  alt,
  contentType,
  runtime,
  size,
} from '../opengraph-image'

const show = (slug: string, tier: 'S' | 'A' | 'B') => ({
  slug,
  tier,
})

const lastCall = () =>
  buildOgImageMock.mock.calls[buildOgImageMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getAllShowsMock.mockReset()
  buildOgImageMock.mockReset()
  getAllShowsMock.mockReturnValue([
    show('survivor', 'S'),
    show('big-brother', 'A'),
    show('the-circle', 'B'),
  ])
  buildOgImageMock.mockReturnValue({ __ogImage: true })
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "nodejs" — reads from the content layer (file-system loaders), same as the show/season/theme OG routes', () => {
    expect(runtime).toBe('nodejs')
  })

  it('exports size = { width: 1200, height: 630 } — the OpenGraph 1.91:1 ratio Twitter + Facebook expect', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
  })

  it('exports contentType = "image/png" — readers cache by content-type', () => {
    expect(contentType).toBe('image/png')
  })

  it('exports alt with the brand promise — the literal string crawlers + screen readers surface', () => {
    expect(alt).toBe('tiered.tv — the seasons, ranked. no spoilers.')
  })
})

describe('OpenGraphImage — content-layer resolution', () => {
  it('calls getAllShows exactly once per request — no loader fan-out', () => {
    OpenGraphImage()
    expect(getAllShowsMock).toHaveBeenCalledTimes(1)
  })

  it('invokes buildOgImage exactly once per request — no fan-out, no double-render', () => {
    OpenGraphImage()
    expect(buildOgImageMock).toHaveBeenCalledTimes(1)
  })

  it('returns the value buildOgImage produces — the route is a pure composer', () => {
    const sentinel = { __captured: true }
    buildOgImageMock.mockReturnValue(sentinel)
    const result = OpenGraphImage()
    expect(result).toBe(sentinel)
  })
})

describe('OpenGraphImage — eyebrow, title, blurb', () => {
  it('uses the static eyebrow "tiered.tv · Shows"', () => {
    OpenGraphImage()
    expect(lastCall()?.eyebrow).toBe('tiered.tv · Shows')
  })

  it('uses the static title "All shows"', () => {
    OpenGraphImage()
    expect(lastCall()?.title).toBe('All shows')
  })

  it('derives the blurb from only the populated tiers, mirroring generateMetadata\'s SEO description', () => {
    OpenGraphImage()
    expect(lastCall()?.blurb).toBe(
      'tiered.tv ranks reality-TV canons by how settled each one feels. S tier is format-defining, A tier has the deep canon, B tier is in review.',
    )
  })

  it('omits an empty tier\'s fragment from the blurb — never claims a tier has content it does not', () => {
    getAllShowsMock.mockReturnValue([show('survivor', 'S'), show('the-circle', 'B')])
    OpenGraphImage()
    expect(lastCall()?.blurb).toBe(
      'tiered.tv ranks reality-TV canons by how settled each one feels. S tier is format-defining, B tier is in review.',
    )
  })

  it('does not pass a palette key — the catalog index carries no single show\'s paint', () => {
    OpenGraphImage()
    expect(lastCall()).not.toHaveProperty('palette')
  })

  it('passes exactly { eyebrow, title, blurb } to buildOgImage — no extra keys, none missing', () => {
    OpenGraphImage()
    expect(Object.keys(lastCall() ?? {}).sort()).toEqual([
      'blurb',
      'eyebrow',
      'title',
    ])
  })
})

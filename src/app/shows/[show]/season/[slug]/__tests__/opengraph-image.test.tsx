import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows/[show]/season/[slug]/opengraph-image is the per-season
// social-share card every link to /shows/<show>/season/<slug> hits
// from Slack, iMessage, Twitter, etc. The route handler composes
// the card's eyebrow + title + blurb + palette from the show +
// season + canon content, then hands the result to the shared
// `buildOgImage` template (separately tested in
// `src/lib/og/__tests__/template.test.tsx`). This test pins the
// route's own contracts: the two notFound branches (unknown show,
// unknown season), the `padRank` helper, the canon-rank lookup +
// fallback chain (canonFile entry → season.canonical_position →
// null), the eyebrow conditional (canon-ranked vs raw season
// number), the blurb fallback chain (lede → tag → composed
// default), the palette pass-through, and the Next-required
// segment-config exports (runtime / alt / size / contentType).
//
// `@/content` and `@/lib/og/template` are mocked so the test
// drives every branch deterministically and captures what the
// route passes to `buildOgImage`. `next/navigation`'s `notFound`
// is mocked to a thrower that satisfies the route's `never`
// contract while letting us assert the 404 paths.

const {
  getShowMock,
  getSeasonBySlugMock,
  getCanonMock,
  buildOgImageMock,
  notFoundMock,
} = vi.hoisted(() => ({
  getShowMock: vi.fn(),
  getSeasonBySlugMock: vi.fn(),
  getCanonMock: vi.fn(),
  buildOgImageMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/content', () => ({
  getShow: getShowMock,
  getSeasonBySlug: getSeasonBySlugMock,
  getCanon: getCanonMock,
}))
vi.mock('@/lib/og/template', () => ({
  buildOgImage: buildOgImageMock,
}))
vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}))

import OpenGraphImage, {
  alt,
  contentType,
  runtime,
  size,
} from '../opengraph-image'

const survivor = {
  slug: 'survivor',
  name: 'Survivor',
  palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
}

const heroesVsVillains = {
  number: 20,
  title: 'Heroes vs. Villains',
  canonical_position: 1,
  lede: 'The all-stars season the format spent twenty years earning.',
  tag: 'all-stars',
}

const params = (show: string, slug: string) =>
  Promise.resolve({ show, slug })

const lastCall = () =>
  buildOgImageMock.mock.calls[buildOgImageMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getShowMock.mockReset()
  getSeasonBySlugMock.mockReset()
  getCanonMock.mockReset()
  buildOgImageMock.mockReset()
  notFoundMock.mockClear()
  getShowMock.mockReturnValue(survivor)
  getSeasonBySlugMock.mockReturnValue(heroesVsVillains)
  getCanonMock.mockReturnValue(null)
  buildOgImageMock.mockReturnValue({ __ogImage: true })
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "nodejs" — satori needs the node runtime, not edge', () => {
    // The root /opengraph-image uses runtime = 'edge', but the
    // per-season variant reads from the content layer (file-system
    // loaders) so it must declare nodejs explicitly. A regression
    // to 'edge' would 500 every season OG card at build time.
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

describe('OpenGraphImage — notFound branches', () => {
  it('calls notFound() when getShow returns undefined', async () => {
    getShowMock.mockReturnValue(undefined)
    await expect(
      OpenGraphImage({ params: params('made-up', 'whatever') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('calls notFound() when getSeasonBySlug returns undefined', async () => {
    getSeasonBySlugMock.mockReturnValue(undefined)
    await expect(
      OpenGraphImage({ params: params('survivor', 'made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('never invokes buildOgImage on either 404 path — no half-rendered card on the wire', async () => {
    getShowMock.mockReturnValue(undefined)
    await OpenGraphImage({ params: params('made-up', 'whatever') }).catch(
      () => {},
    )
    getShowMock.mockReturnValue(survivor)
    getSeasonBySlugMock.mockReturnValue(undefined)
    await OpenGraphImage({ params: params('survivor', 'made-up') }).catch(
      () => {},
    )
    expect(buildOgImageMock).not.toHaveBeenCalled()
  })

  it('does not call notFound() when both show and season resolve', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

describe('OpenGraphImage — content-layer resolution', () => {
  it('passes the show slug to getShow — not the season slug', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(getShowMock).toHaveBeenCalledWith('survivor')
  })

  it('passes both the show slug and season slug to getSeasonBySlug — in (show, season) order', async () => {
    // A regression swapping the args would 404 every season OG card
    // because no show slug doubles as a season slug.
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(getSeasonBySlugMock).toHaveBeenCalledWith(
      'survivor',
      'heroes-vs-villains',
    )
  })

  it('looks up the canon by the show slug — not the season slug', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(getCanonMock).toHaveBeenCalledWith('survivor')
  })
})

describe('OpenGraphImage — canon-rank lookup and fallback chain', () => {
  it('uses the canon entry rank when canonFile.entries has a matching season', async () => {
    getCanonMock.mockReturnValue({
      entries: [
        { rank: 1, season: 20 },
        { rank: 2, season: 16 },
      ],
    })
    getSeasonBySlugMock.mockReturnValue({
      ...heroesVsVillains,
      canonical_position: 99, // canon-file rank wins over this
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toBe(
      "Shows / Survivor · Editor's Canon #01",
    )
  })

  it('falls back to season.canonical_position when canonFile is null', async () => {
    getCanonMock.mockReturnValue(null)
    getSeasonBySlugMock.mockReturnValue({
      ...heroesVsVillains,
      canonical_position: 3,
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toBe(
      "Shows / Survivor · Editor's Canon #03",
    )
  })

  it('falls back to season.canonical_position when canonFile exists but has no matching entry', async () => {
    getCanonMock.mockReturnValue({
      entries: [
        { rank: 1, season: 16 },
        { rank: 2, season: 7 },
      ],
    })
    getSeasonBySlugMock.mockReturnValue({
      ...heroesVsVillains,
      canonical_position: 5,
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toBe(
      "Shows / Survivor · Editor's Canon #05",
    )
  })

  it('uses the raw season-number eyebrow when no canon rank can be derived', async () => {
    getCanonMock.mockReturnValue(null)
    getSeasonBySlugMock.mockReturnValue({
      number: 7,
      title: 'Pearl Islands',
    })
    await OpenGraphImage({ params: params('survivor', 'pearl-islands') })
    expect(lastCall()?.eyebrow).toBe('Shows / Survivor · Season 7')
  })

  it('matches the canon entry by season.number — not by season.title or slug', async () => {
    // A regression matching on the wrong field would label every
    // season "#01" because canon entries always include the
    // top-ranked season in the array.
    getCanonMock.mockReturnValue({
      entries: [
        { rank: 1, season: 16 },
        { rank: 2, season: 20 },
      ],
    })
    getSeasonBySlugMock.mockReturnValue({
      number: 20,
      title: 'Heroes vs. Villains',
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toBe(
      "Shows / Survivor · Editor's Canon #02",
    )
  })
})

describe('OpenGraphImage — padRank zero-pad', () => {
  it('pads a single-digit rank with a leading zero — #1 → #01', async () => {
    getCanonMock.mockReturnValue({ entries: [{ rank: 1, season: 20 }] })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toContain('#01')
  })

  it('does not pad a two-digit rank — #12 stays #12', async () => {
    getCanonMock.mockReturnValue({ entries: [{ rank: 12, season: 20 }] })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toContain('#12')
    expect(lastCall()?.eyebrow).not.toContain('#012')
  })

  it('preserves three-digit ranks verbatim — defensive against very long canons', async () => {
    getCanonMock.mockReturnValue({ entries: [{ rank: 100, season: 20 }] })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.eyebrow).toContain('#100')
  })
})

describe('OpenGraphImage — blurb fallback chain', () => {
  it('prefers season.lede when present', async () => {
    getSeasonBySlugMock.mockReturnValue({
      ...heroesVsVillains,
      lede: 'A specific editorial lede.',
      tag: 'all-stars',
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.blurb).toBe('A specific editorial lede.')
  })

  it('falls back to season.tag when lede is absent', async () => {
    getSeasonBySlugMock.mockReturnValue({
      number: 20,
      title: 'Heroes vs. Villains',
      tag: 'all-stars',
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.blurb).toBe('all-stars')
  })

  it('falls back to a composed "<show.name>, season <number>." when neither lede nor tag is set', async () => {
    getSeasonBySlugMock.mockReturnValue({
      number: 7,
      title: 'Pearl Islands',
    })
    await OpenGraphImage({ params: params('survivor', 'pearl-islands') })
    expect(lastCall()?.blurb).toBe('Survivor, season 7.')
  })

  it('uses show.name (not the URL slug) in the composed fallback — kebab slugs would read wrong as copy', async () => {
    getShowMock.mockReturnValue({
      slug: 'top-chef',
      name: 'Top Chef',
      palette: { paper: '#fff', ink: '#000', primary: '#999' },
    })
    getSeasonBySlugMock.mockReturnValue({ number: 1, title: 'San Francisco' })
    await OpenGraphImage({ params: params('top-chef', 'san-francisco') })
    expect(lastCall()?.blurb).toBe('Top Chef, season 1.')
  })

  it('keeps tag verbatim — no rephrasing or capitalization', async () => {
    getSeasonBySlugMock.mockReturnValue({
      number: 10,
      title: 'Some Title',
      tag: 'second chances',
    })
    await OpenGraphImage({ params: params('survivor', 'cambodia') })
    expect(lastCall()?.blurb).toBe('second chances')
  })
})

describe('OpenGraphImage — title and palette pass-through', () => {
  it('passes season.title verbatim as the title — not display_title (display_title carries HTML markup that satori cannot render)', async () => {
    getSeasonBySlugMock.mockReturnValue({
      ...heroesVsVillains,
      title: 'Heroes vs. Villains',
      display_title: 'Heroes <em>vs.</em> Villains',
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.title).toBe('Heroes vs. Villains')
  })

  it('passes the show palette through unchanged — paper, ink, primary all in the same shape', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(lastCall()?.palette).toEqual({
      paper: '#0E2A2A',
      ink: '#EFE2BD',
      primary: '#D55E36',
    })
  })

  it('does not pollute the palette object with extra keys from show.palette siblings', async () => {
    getShowMock.mockReturnValue({
      ...survivor,
      // A real show frontmatter object carries many more fields than
      // the OG template needs. The route must extract only paper/ink/
      // primary, not pass the whole show.palette by reference.
    })
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    const palette = lastCall()?.palette
    expect(Object.keys(palette ?? {}).sort()).toEqual([
      'ink',
      'paper',
      'primary',
    ])
  })
})

describe('OpenGraphImage — happy path invariants', () => {
  it('invokes buildOgImage exactly once per request — no fan-out, no double-render', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(buildOgImageMock).toHaveBeenCalledTimes(1)
  })

  it('returns the value buildOgImage produces — the route is a pure composer', async () => {
    const sentinel = { __captured: true }
    buildOgImageMock.mockReturnValue(sentinel)
    const result = await OpenGraphImage({
      params: params('survivor', 'heroes-vs-villains'),
    })
    expect(result).toBe(sentinel)
  })

  it('passes exactly { eyebrow, title, blurb, palette } to buildOgImage — no extra keys, none missing', async () => {
    await OpenGraphImage({ params: params('survivor', 'heroes-vs-villains') })
    expect(Object.keys(lastCall() ?? {}).sort()).toEqual([
      'blurb',
      'eyebrow',
      'palette',
      'title',
    ])
  })
})

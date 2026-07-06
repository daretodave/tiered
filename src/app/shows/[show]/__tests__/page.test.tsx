import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Show } from '@/content'

// /shows/[show] is the canonical, highest-traffic page in the
// product (design law names it "the canonical production show
// page"). Its two pure exports carry contracts the hermetic e2e
// walk cannot pin from the outside:
//
//   generateStaticParams() — SSG coverage of the entire show URL
//     family; a regression that returned the wrong key shape
//     (`{ slug }` instead of `{ show }`) would render zero static
//     params and silently drop every show to on-demand.
//
//   generateMetadata({ params }) — the title/canonical/RSS-discovery
//     contract every crawler and share link surfaces, the noIndex
//     discipline on an unknown show, and the `descriptionFor` SEO
//     budget logic: prefer the curator's `card_tagline`, fall back
//     to `tagline`, and clip a long tagline at the last word
//     boundary inside 159 chars + ellipsis so the meta description
//     never overshoots Google's ~155-char clip. The walk reads
//     rendered pages, not the Metadata object, so none of this is
//     covered.
//
// `@/content` (getShow + getAllShows) is mocked via vi.hoisted +
// vi.mock so each case drives the route deterministically;
// `@/lib/seo` runs real (it is pure — builds the Metadata object
// and canonical URLs with no I/O), so the assertions pin the
// actual production string shapes.

const { getShowMock, getAllShowsMock } = vi.hoisted(() => ({
  getShowMock: vi.fn(),
  getAllShowsMock: vi.fn(),
}))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getShow: getShowMock,
    getAllShows: getAllShowsMock,
  }
})

import { generateMetadata, generateStaticParams } from '../page'

function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
    seasons: 47,
    status: 'airing',
    blurb: '47 seasons. One torch at a time.',
    tagline:
      '47 seasons of strangers on a beach. We have ranked every one.',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

beforeEach(() => {
  getShowMock.mockReset()
  getAllShowsMock.mockReset()
})

describe('generateStaticParams — SSG coverage of the show URL family', () => {
  it('returns one params row per loaded show', () => {
    getAllShowsMock.mockReturnValue([
      makeShow({ slug: 'survivor' }),
      makeShow({ slug: 'top-chef' }),
      makeShow({ slug: 'rupauls-drag-race' }),
    ])
    expect(generateStaticParams()).toEqual([
      { show: 'survivor' },
      { show: 'top-chef' },
      { show: 'rupauls-drag-race' },
    ])
  })

  it('keys each entry under `show` — matches the [show] dynamic segment', () => {
    // Next.js maps generateStaticParams entries onto the route's
    // bracket-segment names verbatim. A regression to `{ slug }`
    // would render zero static params and defeat SSG for every show.
    getAllShowsMock.mockReturnValue([makeShow({ slug: 'survivor' })])
    const params = generateStaticParams()
    expect(params.map((p) => Object.keys(p))).toEqual([['show']])
    expect(params.map((p) => p.show)).toEqual(['survivor'])
  })

  it('emits an empty array when no shows load — defensive against a content reset', () => {
    getAllShowsMock.mockReturnValue([])
    expect(generateStaticParams()).toEqual([])
  })

  it('calls getAllShows exactly once — no loader fan-out', () => {
    getAllShowsMock.mockReturnValue([makeShow()])
    generateStaticParams()
    expect(getAllShowsMock).toHaveBeenCalledTimes(1)
  })
})

describe('generateMetadata — known show', () => {
  it('titles the page with the canon, no-spoilers framing', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Survivor', slug: 'survivor' }))
    expect(generateMetadata({ params: { show: 'survivor' } }).title).toBe(
      'Survivor — the canon, no spoilers',
    )
  })

  it('points the canonical OpenGraph URL at /shows/<slug>', () => {
    getShowMock.mockReturnValue(makeShow({ slug: 'top-chef' }))
    const meta = generateMetadata({ params: { show: 'top-chef' } })
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/shows/top-chef')
  })

  it('does not mark a real show noIndex', () => {
    getShowMock.mockReturnValue(makeShow())
    expect(generateMetadata({ params: { show: 'survivor' } }).robots).toBeUndefined()
  })

  it('attaches the global feed AND the per-show RSS feed for discovery', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Top Chef', slug: 'top-chef' }))
    const types = generateMetadata({ params: { show: 'top-chef' } }).alternates
      ?.types as Record<string, Array<{ url: string; title: string }>>
    const feeds = types['application/rss+xml']
    expect(feeds).toEqual([
      { url: '/feed.xml', title: 'tiered.tv — all updates' },
      { url: 'https://tiered.tv/feed/top-chef.xml', title: 'Top Chef — tiered.tv' },
    ])
  })

  // CRITIQUE pass 69 MED: buildMetadata falls back to the site-wide
  // default OG image whenever `image` is omitted, permanently shadowing
  // this route's own opengraph-image.tsx. Pin the explicit per-show image.
  it('points OpenGraph + Twitter images at the show opengraph-image route, not the site default', () => {
    getShowMock.mockReturnValue(makeShow({ slug: 'top-chef' }))
    const meta = generateMetadata({ params: { show: 'top-chef' } })
    expect(meta.openGraph?.images).toEqual([
      { url: 'https://tiered.tv/shows/top-chef/opengraph-image' },
    ])
    expect(meta.twitter?.images).toEqual(['https://tiered.tv/shows/top-chef/opengraph-image'])
  })
})

describe('generateMetadata — unknown show', () => {
  it('returns the "Show not found" title noIndexed so a stale link cannot index', () => {
    getShowMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { show: 'ghost' } })
    expect(meta.title).toBe('Show not found')
    expect(meta.robots).toEqual({ index: false, follow: false })
  })

  it('still points canonical at the requested path so the 404 is canonicalized cleanly', () => {
    getShowMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { show: 'ghost' } })
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/shows/ghost')
  })
})

describe('generateMetadata — description (SEO budget via descriptionFor)', () => {
  it('prefers the curator card_tagline over the full tagline', () => {
    getShowMock.mockReturnValue(
      makeShow({
        card_tagline: 'The format that invented itself in episode one.',
        tagline: 'A much longer editorial sentence that we do not want as the meta.',
      }),
    )
    expect(generateMetadata({ params: { show: 'survivor' } }).description).toBe(
      'The format that invented itself in episode one.',
    )
  })

  it('trims surrounding whitespace off the chosen card_tagline', () => {
    getShowMock.mockReturnValue(
      makeShow({ card_tagline: '  Trimmed lede.  ' }),
    )
    expect(generateMetadata({ params: { show: 'survivor' } }).description).toBe(
      'Trimmed lede.',
    )
  })

  it('falls back to the tagline when card_tagline is whitespace-only', () => {
    // `'   '.trim()` is falsy, so the card branch must not fire —
    // a regression that returned the blank card would ship an empty
    // meta description.
    getShowMock.mockReturnValue(
      makeShow({ card_tagline: '   ', tagline: 'The real fallback tagline.' }),
    )
    expect(generateMetadata({ params: { show: 'survivor' } }).description).toBe(
      'The real fallback tagline.',
    )
  })

  it('returns a short tagline verbatim (<=160 chars, no card_tagline)', () => {
    const tagline = 'Forty-seven seasons of strangers on a beach, ranked.'
    getShowMock.mockReturnValue(makeShow({ card_tagline: undefined, tagline }))
    expect(generateMetadata({ params: { show: 'survivor' } }).description).toBe(tagline)
  })

  it('clips a long tagline at the last word boundary inside 159 chars + ellipsis', () => {
    // 200-char tagline (within the schema's 280 cap, over the 160
    // budget). The clip slices the first 159 chars, cuts back to the
    // last space, strips trailing punctuation, and appends an ellipsis
    // — so the snippet is whole words and never mid-word.
    const tagline =
      'Survivor is the reality format that every other competition show has been chasing for a quarter century, and across its long run it keeps reinventing exactly what the genre can be on television'
    getShowMock.mockReturnValue(makeShow({ card_tagline: undefined, tagline }))
    const description = String(
      generateMetadata({ params: { show: 'survivor' } }).description,
    )
    expect(description.endsWith('…')).toBe(true)
    expect(description.length).toBeLessThanOrEqual(160)
    // No mid-word cut: the char before the ellipsis is a word char,
    // and the source tagline starts with the clipped prefix.
    expect(tagline.startsWith(description.slice(0, -1))).toBe(true)
  })

  it('strips a trailing comma before the ellipsis so the clip reads clean', () => {
    // Engineer the cut to land right after a comma: a 140-char
    // no-space head, then ", ", then a 60-char no-space tail. The
    // slice(0,159) window's last space sits immediately after the
    // comma, so the cut yields "<head>," and the regex /[\s,;:—-]+$/
    // must strip the comma before the ellipsis is appended.
    const head = 'a'.repeat(140)
    const tagline = `${head}, ${'b'.repeat(60)}`
    getShowMock.mockReturnValue(makeShow({ card_tagline: undefined, tagline }))
    const description = String(
      generateMetadata({ params: { show: 'survivor' } }).description,
    )
    expect(description).toBe(`${head}…`)
    expect(description).not.toContain(',…')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Theme } from '@/content'

// /themes/[theme] is the themed-list detail page family (design
// law's "Best Premieres" reference; phase 19h, taken cross-canon in
// phase 41). Its two pure exports carry contracts the hermetic e2e
// walk cannot pin from the outside — the walk renders the page DOM
// for one real theme as a single viewer, never the SSG param set or
// the Metadata object:
//
//   generateStaticParams() — SSG coverage of the entire themed-list
//     URL family; a regression to the wrong key shape (`{ slug }`
//     instead of `{ theme }`) would render zero static params and
//     silently drop every list to on-demand.
//
//   generateMetadata({ params }) — the title/canonical/RSS-discovery
//     contract every crawler and share link surfaces, plus two
//     branches the rendered DOM never reveals: (1) the canonical URL
//     is built from the RESOLVED `theme.slug`, so a back-compat alias
//     form de-dupes to one indexable URL; (2) the noIndex discipline
//     on an unknown slug (generic "Theme" title, empty description,
//     robots index:false) so a stale link can never index a thin
//     fallback.
//
// The default ThemePage component (full render — hero, entry stack,
// adjacent lists, ItemList JSON-LD) is exercised by the e2e
// canonical-urls + page-reads walk; this suite scopes to the pure
// exports, mirroring the sibling `/shows/[show]` + `/shows/[show]/
// season/[slug]` page tests.
//
// `@/content` (getAllThemes + getTheme) is mocked via vi.hoisted +
// vi.mock so each case drives the route deterministically;
// `@/lib/seo` runs real (pure — builds the Metadata object +
// canonical URLs with no I/O), so assertions pin the actual
// production string shapes.

const { getAllThemesMock, getThemeMock } = vi.hoisted(() => ({
  getAllThemesMock: vi.fn(),
  getThemeMock: vi.fn(),
}))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getAllThemes: getAllThemesMock,
    getTheme: getThemeMock,
  }
})

import { generateMetadata, generateStaticParams } from '../page'

function makeTheme(overrides: Partial<Theme> = {}): Theme {
  return {
    slug: 'best-premieres',
    title: 'Best premieres',
    description: 'The season-one runs that announced a format and never let go.',
    tagline: 'Some shows arrive <b>fully formed</b>.',
    category: 'craft',
    sentiment: 'hold',
    status: 'stable',
    curator: 'tiered.tv Editors',
    last_revised: '2026-05-01',
    featured: true,
    related: [],
    entries: [
      {
        show: 'survivor',
        season: 1,
        rank: 1,
        title: 'Borneo',
        blurb: 'The one that invented the genre in real time.',
      },
    ],
    body_md: '',
    ...overrides,
  }
}

beforeEach(() => {
  getAllThemesMock.mockReset()
  getThemeMock.mockReset()
})

describe('generateStaticParams — SSG coverage of the themed-list URL family', () => {
  it('returns one params row per loaded theme', () => {
    getAllThemesMock.mockReturnValue([
      makeTheme({ slug: 'best-premieres' }),
      makeTheme({ slug: 'best-finales' }),
      makeTheme({ slug: 'best-villain-editing' }),
    ])
    expect(generateStaticParams()).toEqual([
      { theme: 'best-premieres' },
      { theme: 'best-finales' },
      { theme: 'best-villain-editing' },
    ])
  })

  it('keys each entry under `theme` — matches the [theme] dynamic segment', () => {
    // Next.js maps generateStaticParams entries onto the route's
    // bracket-segment names verbatim. A regression to `{ slug }`
    // would render zero static params and defeat SSG for every list.
    getAllThemesMock.mockReturnValue([makeTheme({ slug: 'best-premieres' })])
    const params = generateStaticParams()
    expect(params.map((p) => Object.keys(p))).toEqual([['theme']])
    expect(params.map((p) => p.theme)).toEqual(['best-premieres'])
  })

  it('emits an empty array when no themes load — defensive against a content reset', () => {
    getAllThemesMock.mockReturnValue([])
    expect(generateStaticParams()).toEqual([])
  })

  it('calls getAllThemes exactly once — no loader fan-out', () => {
    getAllThemesMock.mockReturnValue([makeTheme()])
    generateStaticParams()
    expect(getAllThemesMock).toHaveBeenCalledTimes(1)
  })
})

describe('generateMetadata — known theme', () => {
  it('titles the page with the theme title verbatim', () => {
    getThemeMock.mockReturnValue(makeTheme({ title: 'Best finales' }))
    expect(
      generateMetadata({ params: { theme: 'best-finales' } }).title,
    ).toBe('Best finales')
  })

  it('points the canonical OpenGraph URL at /themes/<slug>', () => {
    getThemeMock.mockReturnValue(makeTheme({ slug: 'best-finales' }))
    const meta = generateMetadata({ params: { theme: 'best-finales' } })
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/themes/best-finales')
  })

  it('canonicalizes against the RESOLVED theme.slug, not the requested params.theme', () => {
    // A back-compat / alias form (params.theme differs from the
    // theme's real slug) must de-dupe to the one indexable canonical
    // URL.
    getThemeMock.mockReturnValue(makeTheme({ slug: 'best-premieres' }))
    const meta = generateMetadata({ params: { theme: 'premieres-alias' } })
    expect(meta.alternates?.canonical).toBe(
      'https://tiered.tv/themes/best-premieres',
    )
  })

  it('passes the theme description through verbatim', () => {
    const description = 'The season-one runs that announced a format and never let go.'
    getThemeMock.mockReturnValue(makeTheme({ description }))
    expect(
      generateMetadata({ params: { theme: 'best-premieres' } }).description,
    ).toBe(description)
  })

  it('does not mark a real theme noIndex', () => {
    getThemeMock.mockReturnValue(makeTheme())
    expect(
      generateMetadata({ params: { theme: 'best-premieres' } }).robots,
    ).toBeUndefined()
  })

  it('attaches the global feed for RSS discovery (no per-list feed)', () => {
    getThemeMock.mockReturnValue(makeTheme({ slug: 'best-finales' }))
    const types = generateMetadata({ params: { theme: 'best-finales' } })
      .alternates?.types as Record<string, Array<{ url: string; title: string }>>
    expect(types['application/rss+xml']).toEqual([
      { url: '/feed.xml', title: 'tiered.tv — all updates' },
    ])
  })
})

describe('generateMetadata — unknown theme', () => {
  it('returns the generic "Theme" title noIndexed with an empty description', () => {
    getThemeMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { theme: 'ghost-list' } })
    expect(meta.title).toBe('Theme')
    expect(meta.description).toBe('')
    expect(meta.robots).toEqual({ index: false, follow: false })
  })

  it('canonicalizes against the requested path so the 404 is canonicalized cleanly', () => {
    getThemeMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { theme: 'ghost-list' } })
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/themes/ghost-list')
  })
})

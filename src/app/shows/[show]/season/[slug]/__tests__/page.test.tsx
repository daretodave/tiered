import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Season, Show } from '@/content'

// /shows/[show]/season/[slug] is the most editorially dense page
// family in the product (design law's canonical "Heroes vs.
// Villains" season reference). Its two pure exports carry contracts
// the hermetic e2e walk cannot pin from the outside — the walk only
// ever renders the e2e show's real seasons as a single viewer:
//
//   generateStaticParams() — SSG coverage of the ENTIRE season URL
//     family: a nested show × season loop emitting `{ show, slug }`.
//     A regression to the wrong key shape (e.g. `{ slug }` alone, or
//     `{ show, season }`) would render zero static params and
//     silently drop every season to on-demand; a regression that
//     flattened the loop would drop whole shows' seasons.
//
//   generateMetadata({ params }) — the title/canonical/RSS-discovery
//     contract every crawler and share link surfaces, plus three
//     branches the rendered DOM never reveals: (1) the canonical URL
//     is built from the RESOLVED `season.slug`, not `params.slug`, so
//     an alias/back-compat form de-dupes to one indexable URL; (2)
//     noIndex discipline on an unknown show vs. an unknown season
//     (two distinct fallbacks); (3) the `descriptionFor` SEO budget —
//     prefer the curator's `lede`, fall back to the "Vote and
//     discuss…" template, and clip a long lede at the last word
//     boundary inside 159 chars + ellipsis so the meta description
//     never overshoots Google's ~155-char clip.
//
// The default SeasonPage component (notFound / 308 digit→slug
// redirect / alias redirect / full render) is exercised by the e2e
// redirect fixtures + page-reads walk; this suite scopes to the pure
// exports, mirroring the sibling `/shows/[show]` page test.
//
// `@/content` is mocked via vi.hoisted + vi.mock so each case drives
// the route deterministically; `@/lib/seo` runs real (pure — builds
// the Metadata object + canonical URLs with no I/O), so assertions
// pin the actual production string shapes.

const { getShowMock, getSeasonBySlugMock, getAllShowsMock, getAllSeasonsMock } =
  vi.hoisted(() => ({
    getShowMock: vi.fn(),
    getSeasonBySlugMock: vi.fn(),
    getAllShowsMock: vi.fn(),
    getAllSeasonsMock: vi.fn(),
  }))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getShow: getShowMock,
    getSeasonBySlug: getSeasonBySlugMock,
    getAllShows: getAllShowsMock,
    getAllSeasons: getAllSeasonsMock,
  }
})

import { isValidElement } from 'react'
import { render, screen } from '@testing-library/react'
import {
  ADJACENT_SECTION_H2,
  buildSections,
  generateMetadata,
  generateStaticParams,
  seasonHeroBylineFor,
  takeH2For,
  whereItSitsCopy,
} from '../page'

function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
    seasons: 47,
    status: 'airing',
    blurb: '47 seasons. One torch at a time.',
    tagline: '47 seasons of strangers on a beach. We have ranked every one.',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

function makeSeason(overrides: Partial<Season> = {}): Season {
  return {
    show: 'survivor',
    number: 20,
    slug: 'heroes-vs-villains',
    title: 'Heroes vs. Villains',
    blurb_md:
      'The all-star return that the whole format had been building toward, twenty veterans split into two tribes by the way the audience already saw them.',
    format_changes: [],
    ...overrides,
  }
}

beforeEach(() => {
  getShowMock.mockReset()
  getSeasonBySlugMock.mockReset()
  getAllShowsMock.mockReset()
  getAllSeasonsMock.mockReset()
})

describe('generateStaticParams — SSG coverage of the season URL family', () => {
  it('returns one params row per season, nested across every show', () => {
    getAllShowsMock.mockReturnValue([
      makeShow({ slug: 'survivor' }),
      makeShow({ slug: 'top-chef' }),
    ])
    getAllSeasonsMock.mockImplementation((slug: string) => {
      if (slug === 'survivor')
        return [
          makeSeason({ number: 20, slug: 'heroes-vs-villains' }),
          makeSeason({ number: 1, slug: 'borneo' }),
        ]
      if (slug === 'top-chef')
        return [makeSeason({ show: 'top-chef', number: 1, slug: 'san-francisco' })]
      return []
    })
    expect(generateStaticParams()).toEqual([
      { show: 'survivor', slug: 'heroes-vs-villains' },
      { show: 'survivor', slug: 'borneo' },
      { show: 'top-chef', slug: 'san-francisco' },
    ])
  })

  it('keys each entry under exactly `show` + `slug` — matches the [show]/[slug] segments', () => {
    // Next.js maps generateStaticParams entries onto the route's
    // bracket-segment names verbatim. A regression to `{ slug }` or a
    // `season`-keyed entry would render zero static params and defeat
    // SSG for the whole family.
    getAllShowsMock.mockReturnValue([makeShow({ slug: 'survivor' })])
    getAllSeasonsMock.mockReturnValue([
      makeSeason({ number: 20, slug: 'heroes-vs-villains' }),
    ])
    const params = generateStaticParams()
    expect(params.map((p) => Object.keys(p))).toEqual([['show', 'slug']])
  })

  it('emits an empty array when no shows load — defensive against a content reset', () => {
    getAllShowsMock.mockReturnValue([])
    expect(generateStaticParams()).toEqual([])
    expect(getAllSeasonsMock).not.toHaveBeenCalled()
  })

  it('skips a show with zero seasons but still covers its siblings', () => {
    getAllShowsMock.mockReturnValue([
      makeShow({ slug: 'unseeded' }),
      makeShow({ slug: 'survivor' }),
    ])
    getAllSeasonsMock.mockImplementation((slug: string) =>
      slug === 'survivor'
        ? [makeSeason({ number: 1, slug: 'borneo' })]
        : [],
    )
    expect(generateStaticParams()).toEqual([{ show: 'survivor', slug: 'borneo' }])
  })
})

describe('generateMetadata — known show + season', () => {
  it('titles the page with the "<Show> S<N> — <Title>" framing', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Survivor', slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(
      makeSeason({ number: 20, slug: 'heroes-vs-villains', title: 'Heroes vs. Villains' }),
    )
    expect(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .title,
    ).toBe('Survivor S20 — Heroes vs. Villains')
  })

  it('canonicalizes against the RESOLVED season.slug, not the requested params.slug', () => {
    // A back-compat / alias form (params.slug differs from the season's
    // real slug) must de-dupe to the one indexable canonical URL.
    getShowMock.mockReturnValue(makeShow({ slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(
      makeSeason({ number: 20, slug: 'heroes-vs-villains' }),
    )
    const meta = generateMetadata({
      params: { show: 'survivor', slug: 'survivor-20' },
    })
    expect(meta.alternates?.canonical).toBe(
      'https://tiered.tv/shows/survivor/season/heroes-vs-villains',
    )
  })

  it('does not mark a real season noIndex', () => {
    getShowMock.mockReturnValue(makeShow())
    getSeasonBySlugMock.mockReturnValue(makeSeason())
    expect(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .robots,
    ).toBeUndefined()
  })

  it('attaches the global feed AND the per-show RSS feed for discovery', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Top Chef', slug: 'top-chef' }))
    getSeasonBySlugMock.mockReturnValue(
      makeSeason({ show: 'top-chef', number: 1, slug: 'san-francisco' }),
    )
    const types = generateMetadata({
      params: { show: 'top-chef', slug: 'san-francisco' },
    }).alternates?.types as Record<string, Array<{ url: string; title: string }>>
    expect(types['application/rss+xml']).toEqual([
      { url: '/feed.xml', title: 'tiered.tv — all updates' },
      { url: 'https://tiered.tv/feed/top-chef.xml', title: 'Top Chef — tiered.tv' },
    ])
  })
})

describe('generateMetadata — unknown show', () => {
  it('returns the generic "Season" title noIndexed so a stale link cannot index', () => {
    getShowMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { show: 'ghost', slug: 'whatever' } })
    expect(meta.title).toBe('Season')
    expect(meta.robots).toEqual({ index: false, follow: false })
    expect(meta.description).toBe('')
  })

  it('canonicalizes against the requested path and never consults the season loader', () => {
    getShowMock.mockReturnValue(undefined)
    const meta = generateMetadata({ params: { show: 'ghost', slug: 'whatever' } })
    expect(meta.alternates?.canonical).toBe(
      'https://tiered.tv/shows/ghost/season/whatever',
    )
    expect(getSeasonBySlugMock).not.toHaveBeenCalled()
  })
})

describe('generateMetadata — known show, unknown season', () => {
  it('returns a show-scoped "<Show> season" title, noIndexed, at the requested path', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Survivor', slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(undefined)
    const meta = generateMetadata({
      params: { show: 'survivor', slug: 'ghost-season' },
    })
    expect(meta.title).toBe('Survivor season')
    expect(meta.robots).toEqual({ index: false, follow: false })
    expect(meta.alternates?.canonical).toBe(
      'https://tiered.tv/shows/survivor/season/ghost-season',
    )
  })
})

describe('generateMetadata — description (SEO budget via descriptionFor)', () => {
  it('prefers the curator lede verbatim when it fits the budget (<=160)', () => {
    const lede = 'The all-star return the whole format had been building toward.'
    getShowMock.mockReturnValue(makeShow({ slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(makeSeason({ lede }))
    expect(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .description,
    ).toBe(lede)
  })

  it('falls back to the "Vote and discuss…" template when no lede is authored', () => {
    getShowMock.mockReturnValue(makeShow({ name: 'Survivor', slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(
      makeSeason({ number: 20, title: 'Heroes vs. Villains', lede: undefined }),
    )
    expect(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .description,
    ).toBe('Vote and discuss Survivor season 20: Heroes vs. Villains.')
  })

  it('clips a long lede at the last word boundary inside 159 chars + ellipsis', () => {
    // 192-char lede (within the schema's 280 cap, over the 160 budget).
    // The clip slices the first 159 chars, cuts back to the last space,
    // strips trailing punctuation, and appends an ellipsis — whole
    // words only, never mid-word.
    const lede =
      'The all-star return the whole format had been building toward, twenty veterans split into two tribes purely by the way the audience already saw them coming into this particular beach season'
    getShowMock.mockReturnValue(makeShow({ slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(makeSeason({ lede }))
    const description = String(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .description,
    )
    expect(description.endsWith('…')).toBe(true)
    expect(description.length).toBeLessThanOrEqual(160)
    expect(lede.startsWith(description.slice(0, -1))).toBe(true)
  })

  it('strips a trailing comma before the ellipsis so the clip reads clean', () => {
    // Engineer the cut to land right after a comma: a 140-char no-space
    // head, then ", ", then a 60-char no-space tail. The slice(0,159)
    // window's last space sits immediately after the comma, so the cut
    // yields "<head>," and the regex /[\s,;:—-]+$/ strips the comma
    // before the ellipsis is appended.
    const head = 'a'.repeat(140)
    const lede = `${head}, ${'b'.repeat(60)}`
    getShowMock.mockReturnValue(makeShow({ slug: 'survivor' }))
    getSeasonBySlugMock.mockReturnValue(makeSeason({ lede }))
    const description = String(
      generateMetadata({ params: { show: 'survivor', slug: 'heroes-vs-villains' } })
        .description,
    )
    expect(description).toBe(`${head}…`)
    expect(description).not.toContain(',…')
  })
})

describe('whereItSitsCopy — Section 03 "WHERE IT SITS IN THE CANON" body', () => {
  // critique-pass-20 LOW: the legacy "neighbors below frame what we
  // ranked above and below it" line overloads "below" (the on-page
  // adjacent strip vs. canon position), forcing a first-time reader
  // to disambiguate before parsing. The replacement loses the
  // positional reference and reads cleanly against either neighbor.
  it('renders the ranked-slot framing without the "neighbors below" overload', () => {
    const show = makeShow({ name: 'Survivor', slug: 'survivor' })
    expect(whereItSitsCopy(show, 2, 50)).toBe(
      "Slot #02 of 50 in the Survivor Editor's Canon. The seasons on either side show what I ranked it against.",
    )
  })

  it('zero-pads single-digit canon ranks to keep the rank column monospaced-stable', () => {
    const show = makeShow({ name: 'Top Chef', slug: 'top-chef' })
    expect(whereItSitsCopy(show, 9, 17)).toContain('Slot #09 of 17')
  })

  it('never re-introduces the legacy "neighbors below" copy across any branch', () => {
    // Negative pin: the critique fix removed the overloaded phrasing
    // from the only branch that carried it. Future edits that
    // re-introduce it (or a near-synonym carrying the same overload)
    // would resurface the finding.
    const show = makeShow({ name: 'Survivor', slug: 'survivor' })
    for (const copy of [
      whereItSitsCopy(show, 1, 50),
      whereItSitsCopy(show, 2, 50),
      whereItSitsCopy(show, 50, 50),
      whereItSitsCopy(show, null, 0),
      whereItSitsCopy(show, 1, 1),
    ]) {
      expect(copy).not.toContain('neighbors below')
      expect(copy).not.toContain('above and below')
    }
  })

  it('falls back to a draft-in-progress sentence when no canon rank is assigned', () => {
    const show = makeShow({ name: 'Bachelor', slug: 'bachelor' })
    expect(whereItSitsCopy(show, null, 0)).toBe(
      "Canon position not assigned yet — the editors' draft is still in progress for Bachelor. Check back as the canon fills in.",
    )
  })

  it('falls back to a sole-entry sentence when the canon has exactly one entry', () => {
    const show = makeShow({ name: 'Top Chef', slug: 'top-chef' })
    expect(whereItSitsCopy(show, 1, 1)).toBe(
      "Sole entry in the Top Chef Editor's Canon so far. Adjacent picks land as the canon grows.",
    )
  })
})

describe('seasonHeroBylineFor — within-module double-attribution gate (issue #339)', () => {
  // critique-pass-38 MED: the SeasonHero byline "Canon entry by the
  // tiered.tv editor" and the RankScale headLabel "Editor's Canon"
  // stacked the same attribution in the hero module on canon-ranked
  // seasons. The fix drops the byline when canonRank is present
  // (RankScale + slot card carry attribution implicitly) and keeps
  // it when canonRank is null (RankScale renders the "not yet ranked"
  // state, so the byline is the only attribution surface).
  it('returns null when the season is canon-ranked — RankScale carries the attribution', () => {
    expect(seasonHeroBylineFor(2)).toBeNull()
    expect(seasonHeroBylineFor(50)).toBeNull()
    expect(seasonHeroBylineFor(1)).toBeNull()
  })

  it('returns the byline ReactNode naming "the tiered.tv editor" when canonRank is null', () => {
    const node = seasonHeroBylineFor(null)
    expect(node).not.toBeNull()
    expect(isValidElement(node)).toBe(true)
    render(<div data-testid="probe">{node}</div>)
    const probe = screen.getByTestId('probe')
    expect(probe).toHaveTextContent('Canon entry by the tiered.tv editor')
    expect(probe.querySelector('.who')).toHaveTextContent('the tiered.tv editor')
  })

  it('never re-introduces a verbatim "Editor\'s Canon" eyebrow in the byline output', () => {
    // Negative pin: the defect was two adjacent eyebrows both claiming
    // "Editor's Canon" in the module head. A future authoring pass that
    // renamed the byline to "Editor's Canon entry by..." or similar
    // would resurface the double-attribution. Belt-and-braces against
    // a re-introduction that re-stacks the attribution.
    for (const canonRank of [null, 1, 25, 50]) {
      const node = seasonHeroBylineFor(canonRank)
      if (node == null) continue
      const { unmount } = render(<div data-testid="probe">{node}</div>)
      const probe = screen.getByTestId('probe')
      expect(probe.textContent ?? '').not.toMatch(/editor'?s canon/i)
      unmount()
    }
  })
})

describe('takeH2For — Section 01 ("The take") H2 (issue #393)', () => {
  // critique-pass-47 MED: the default H2 rendered the season title
  // verbatim with a trailing period (`{season.title}.`), which on HvV
  // read as a literal restate of the page H1 above. Sections 02–06
  // carry editorial fragments; Section 01 was the only one that
  // degenerated into a title-restate. `take_h2` is the optional
  // frontmatter override; absent value preserves the legacy default
  // during the lax→strict catalog drain (see
  // `scripts/content-check.ts` § collectSeasonSectionSubheadIssues).
  it('returns the `take_h2` override verbatim when authored', () => {
    const season = makeSeason({ take_h2: 'The all-star ceiling.' })
    expect(takeH2For(season)).toBe('The all-star ceiling.')
  })

  it('falls back to `${season.title}.` when no override is authored (catalog drain default)', () => {
    const season = makeSeason({ title: 'Borneo', take_h2: undefined })
    expect(takeH2For(season)).toBe('Borneo.')
  })

  it('the fallback IS the defect class the invariant catches (title verbatim restate)', () => {
    // Bidirectional pin: the default branch returns the exact
    // verbatim restate that the content-check
    // `collectSeasonSectionSubheadIssues` invariant flags. A future
    // edit that changed the fallback to something distinct would
    // need to update the invariant in lockstep (or it would still
    // flag every drained season as a regression). This case
    // documents the coupling.
    const season = makeSeason({ title: 'Heroes vs. Villains', take_h2: undefined })
    expect(takeH2For(season)).toBe('Heroes vs. Villains.')
  })
})

describe('buildSections — TOC + inline eyebrow ordinal derivation (critique-pass-56/68)', () => {
  // Every single-season show in the catalog (Jersey Shore, Selling
  // Sunset, and the original Alone finding) hit the same defect: the
  // TOC array and the inline article eyebrows each hardcoded '01'..
  // '06', so an absent optional section left a gap in the visible
  // ordinal sequence ("01 / 02 / 03 / 05 / 06", no 04) instead of the
  // remaining sections renumbering to stay consecutive.
  it('numbers all six sections 01-06 consecutively when every optional section is present', () => {
    const sections = buildSections({
      shapeHasCopy: true,
      watchVisible: true,
      adjacentVisible: true,
      appearsInCount: 3,
    })
    expect(sections.map((s) => s.num)).toEqual(['01', '02', '03', '04', '05', '06'])
  })

  it('renumbers with no gap when the optional "What to watch for" section is absent', () => {
    // Reproduces the exact reported defect shape: watch_list absent
    // should NOT leave a "01 / 02 / 03 / 05 / 06" gap at 04.
    const sections = buildSections({
      shapeHasCopy: true,
      watchVisible: false,
      adjacentVisible: true,
      appearsInCount: 3,
    })
    expect(sections.map((s) => s.id)).toEqual([
      's-take',
      's-shape',
      's-where',
      's-related',
      's-appears',
    ])
    expect(sections.map((s) => s.num)).toEqual(['01', '02', '03', '04', '05'])
  })

  it('renumbers consecutively for a freshly-scaffolded single-season show (only 4 of 6 sections present)', () => {
    // Matches the Jersey Shore / Selling Sunset season-1 shape: no
    // watch_list, no adjacent season yet, but a themed-list cross-ref
    // already exists.
    const sections = buildSections({
      shapeHasCopy: true,
      watchVisible: false,
      adjacentVisible: false,
      appearsInCount: 1,
    })
    expect(sections.map((s) => s.num)).toEqual(['01', '02', '03', '04'])
  })

  it('never emits a duplicate or skipped ordinal across any visibility combination', () => {
    const bools = [true, false]
    for (const shapeHasCopy of bools) {
      for (const watchVisible of bools) {
        for (const adjacentVisible of bools) {
          for (const appearsInCount of [0, 2]) {
            const sections = buildSections({
              shapeHasCopy,
              watchVisible,
              adjacentVisible,
              appearsInCount,
            })
            const nums = sections.map((s) => s.num)
            const expected = nums.map((_, i) => String(i + 1).padStart(2, '0'))
            expect(nums).toEqual(expected)
          }
        }
      }
    }
  })
})

describe('ADJACENT_SECTION_H2 — Section 05 "Adjacent in the canon" subhead', () => {
  // critique-pass-29 LOW: the legacy "Read next." subhead framed both
  // adjacent cards (a canon-above neighbor and a canon-below one) as
  // the reader's forward path. For a reader on canon slot #02, slot
  // #01 is read-previous, not read-next. "Either direction." reads
  // honestly against either pair the section can render.
  it('renders the bidirectional "Either direction." literal', () => {
    expect(ADJACENT_SECTION_H2).toBe('Either direction.')
  })

  it('never re-introduces the legacy unidirectional "Read next." subhead', () => {
    // Negative regression pin: a future authoring pass that flips
    // back to a forward-only subhead would resurface the
    // misframing the critique-pass-29 finding flagged on the HvV
    // page (canon-above neighbor framed as "read next").
    expect(ADJACENT_SECTION_H2 as string).not.toBe('Read next.')
    expect(ADJACENT_SECTION_H2.toLowerCase()).not.toMatch(/\bnext\b/)
  })
})

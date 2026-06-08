import { describe, expect, it } from 'vitest'
import type { Show, Theme } from '@/content'
import {
  filterModeText,
  formatListMeta,
  formatListMetaLine,
  formatRevisedAgo,
  formatRevisedRelative,
  formatRevisedYear,
  formatThemeStatus,
  GROUP_HEAD_LABELS,
  plural,
} from '../themes-format'

describe('formatRevisedYear', () => {
  it('returns the year from an ISO date', () => {
    expect(formatRevisedYear('2026-05-01')).toBe('2026')
    expect(formatRevisedYear('2023-01-15')).toBe('2023')
  })

  it('returns empty for empty input', () => {
    expect(formatRevisedYear('')).toBe('')
  })
})

describe('formatRevisedAgo', () => {
  const today = new Date('2026-05-13T00:00:00Z')

  it('returns "this week" within 7 days', () => {
    expect(formatRevisedAgo('2026-05-10', today)).toBe('this week')
    expect(formatRevisedAgo('2026-05-13', today)).toBe('this week')
  })

  it('returns "this month" within 31 days', () => {
    expect(formatRevisedAgo('2026-04-20', today)).toBe('this month')
  })

  it('returns "this year" beyond 31 days', () => {
    expect(formatRevisedAgo('2026-01-01', today)).toBe('this year')
    expect(formatRevisedAgo('2024-08-01', today)).toBe('this year')
  })
})

describe('formatRevisedRelative', () => {
  it('renders calendar "Month YYYY" for any in-range date', () => {
    expect(formatRevisedRelative('2026-05-10')).toBe('May 2026')
    expect(formatRevisedRelative('2026-05-13')).toBe('May 2026')
    expect(formatRevisedRelative('2026-04-20')).toBe('April 2026')
    expect(formatRevisedRelative('2026-01-01')).toBe('January 2026')
    expect(formatRevisedRelative('2024-08-15')).toBe('August 2024')
  })

  it('never renders relative-time tokens (would silently rot on a static site)', () => {
    const stamp = formatRevisedRelative('2026-05-13')
    expect(stamp).not.toMatch(/this week|this month|this year|today|yesterday/i)
  })

  it('matches the shared canon helper output for the same ISO input', () => {
    // Same Month YYYY shape as the home CANON REVISED / show-page
    // CANON REVISED / /shows SHOWS REVISED stat (sibling on /themes:
    // LISTS REVISED) — single source of truth at
    // @/lib/canon/last-revised.
    expect(formatRevisedRelative('2026-05-10')).toMatch(/^[A-Z][a-z]+ \d{4}$/)
  })

  it('returns "" for empty input (graceful drop)', () => {
    expect(formatRevisedRelative('')).toBe('')
  })

  it('returns "" for an unparseable ISO string', () => {
    expect(formatRevisedRelative('not-a-date')).toBe('')
  })
})

describe('formatThemeStatus', () => {
  const today = new Date('2026-05-13T00:00:00Z')

  it('growing → "growing"', () => {
    expect(formatThemeStatus('growing', '2026-05-01', today)).toBe('growing')
  })

  it('stable → "stable list"', () => {
    expect(formatThemeStatus('stable', '2026-05-01', today)).toBe('stable list')
  })

  it('updated → "updated {ago-label}"', () => {
    expect(formatThemeStatus('updated', '2026-05-10', today)).toBe(
      'updated this week',
    )
    expect(formatThemeStatus('updated', '2026-04-20', today)).toBe(
      'updated this month',
    )
    expect(formatThemeStatus('updated', '2024-08-01', today)).toBe(
      'updated this year',
    )
  })

  it('started → "started {YYYY}"', () => {
    expect(formatThemeStatus('started', '2023-08-15', today)).toBe(
      'started 2023',
    )
  })
})

describe('filterModeText', () => {
  it('formats "all" mode qualified by index scope', () => {
    expect(
      filterModeText('all', { all: 12, tone: 4, structure: 0, craft: 3, era: 2, single: 3 }),
    ).toBe('showing · all 12 in the index')
  })

  it('"all" mode includes the `in the index` qualifier — chips name the navigable grid scope', () => {
    // Pass-25 first asked for the qualifier when the chip total was a
    // strict subset of the lede's catalog total. Pass-40 #353 dropped
    // the featured-out filter so chip.all === stats.total today, but
    // the qualifier still earns its keep — it distinguishes the
    // grid's full-catalog scope from the rail's editorial spotlight
    // subset, and the bidirectional drift guard below pins the shape.
    expect(
      filterModeText('all', { all: 12, tone: 3, structure: 1, craft: 4, era: 2, single: 2 }),
    ).toMatch(/in the index/i)
  })

  it('never regresses to the bare-quantifier shape that shadows the lede', () => {
    // Negative pin per critique pass-25 closure pattern: the literal must
    // not match `showing · all N lists` (the prior shape) under ANY count.
    for (const n of [0, 1, 9, 12, 100]) {
      const text = filterModeText('all', {
        all: n,
        tone: 0,
        structure: 0,
        craft: 0,
        era: 0,
        single: 0,
      })
      expect(text).not.toMatch(/^showing · all \d+ lists$/)
    }
  })

  it('formats a single category mode', () => {
    expect(
      filterModeText('tone', { all: 12, tone: 4, structure: 0, craft: 3, era: 2, single: 3 }),
    ).toBe('showing · 4 tone lists')
    expect(
      filterModeText('single', { all: 12, tone: 4, structure: 0, craft: 3, era: 2, single: 3 }),
    ).toBe('showing · 3 single-show lists')
  })
})

describe('GROUP_HEAD_LABELS', () => {
  it('uses "Single-show tiers" — not "By single"', () => {
    expect(GROUP_HEAD_LABELS.single).toBe('Single-show tiers')
  })

  it('exposes "By structure" — split from "By tone" at critique pass-31', () => {
    // The `tone` group head used to carry structural cuts (reunion
    // specials, post-merge, returnees, firsts), which made the index
    // toggles dishonest. The label now reads honestly; the cross-show
    // floor still applies (see scripts/content-check.ts CROSS_SHOW_CATEGORIES).
    expect(GROUP_HEAD_LABELS.structure).toBe('By structure')
  })

  it('orders heads tone -> structure -> craft -> era -> single', () => {
    // Order pin: editorial reading order across the /themes overview
    // index. Lockstep with FILTER_KEYS in themes-format.ts and
    // ORDERED_CATEGORIES in components/lists/ListsAllSection.tsx.
    expect(Object.keys(GROUP_HEAD_LABELS)).toEqual([
      'tone',
      'structure',
      'craft',
      'era',
      'single',
    ])
  })
})

describe('plural', () => {
  it('returns singular at 1', () => {
    expect(plural(1, 'entry', 'entries')).toBe('entry')
  })

  it('returns plural at !=1', () => {
    expect(plural(0, 'entry', 'entries')).toBe('entries')
    expect(plural(2, 'entry', 'entries')).toBe('entries')
  })
})

// Critique pass-40 #355 closure: the four catalogue list-meta surfaces
// (home `<HomeListRow>`, /themes featured-rail `<FeaturedCard>`,
// /themes index `<ListRow>`, /themes/[theme] `<ListDetailHero>`) now
// share `formatListMeta` / `formatListMetaLine` as the single source
// of truth for the accounting voice. Sibling colocated tests on each
// component pin the rendered output; these unit tests pin the helper
// directly across the 1-show / multi-show / 1-entry / multi-entry
// corners. The `shows` parameter is optional — by the
// `getShowsForTheme` invariant the resolved-Show[] length matches
// `countShows(theme)`, so either path yields the same number.
function themeForMeta(entries: Array<{ show: string; season: number }>): Theme {
  return {
    slug: 'demo',
    title: 'Demo',
    description: 'Demo description.',
    tagline: 'Demo tagline.',
    category: 'craft',
    sentiment: 'warm-up',
    status: 'stable',
    curator: 'tiered.tv editor',
    last_revised: '2026-05-01',
    featured: false,
    related: [],
    entries: entries.map((e, ix) => ({
      show: e.show,
      season: e.season,
      rank: ix + 1,
      title: `t${ix + 1}`,
      blurb: `b${ix + 1}`,
    })),
    body_md: '',
  } as Theme
}

function showForMeta(slug: string): Show {
  return {
    slug,
    name: slug,
    palette: { paper: '#000', ink: '#fff', primary: '#888' },
    seasons: 1,
    status: 'airing',
    blurb: 'b',
    tagline: 't',
    tier: 'B',
    network: 'N',
    est_year: 2000,
    genre_tag: 'g',
    featured: false,
  } as Show
}

describe('formatListMeta (pass-40 #355)', () => {
  it('returns shows.length when shows is provided', () => {
    const theme = themeForMeta([
      { show: 'a', season: 1 },
      { show: 'b', season: 1 },
    ])
    expect(
      formatListMeta(theme, [showForMeta('a'), showForMeta('b')]),
    ).toEqual({ showCount: 2, entryCount: 2 })
  })

  it('falls back to countShows(theme) when shows is omitted (home surface)', () => {
    const theme = themeForMeta([
      { show: 'a', season: 1 },
      { show: 'b', season: 1 },
      { show: 'a', season: 2 },
    ])
    expect(formatListMeta(theme)).toEqual({ showCount: 2, entryCount: 3 })
  })

  it('returns showCount=0 / entryCount=0 for an empty theme', () => {
    const theme = themeForMeta([])
    expect(formatListMeta(theme)).toEqual({ showCount: 0, entryCount: 0 })
    expect(formatListMeta(theme, [])).toEqual({ showCount: 0, entryCount: 0 })
  })
})

describe('formatListMetaLine (pass-40 #355)', () => {
  const theme = (n: number, e: number): Theme =>
    themeForMeta(
      Array.from({ length: e }, (_, ix) => ({
        show: `show-${ix % n}`,
        season: ix + 1,
      })),
    )
  const shows = (n: number) =>
    Array.from({ length: n }, (_, ix) => showForMeta(`show-${ix}`))

  it('renders the canonical `{N} shows · {M} entries` shape for multi-show / multi-entry', () => {
    expect(formatListMetaLine(theme(3, 7), shows(3))).toBe('3 shows · 7 entries')
  })

  it('renders singular noun at 1 show / 1 entry', () => {
    expect(formatListMetaLine(theme(1, 1), shows(1))).toBe('1 show · 1 entry')
  })

  it('renders singular `1 show · 5 entries` for a single-show multi-entry theme', () => {
    expect(formatListMetaLine(theme(1, 5), shows(1))).toBe('1 show · 5 entries')
  })

  it('renders `4 shows · 1 entry` for a single-entry multi-show theme', () => {
    // edge corner: one entry across many shows is data-shape impossible
    // (entries map 1:1 to seasons), but the helper handles it gracefully.
    const t = themeForMeta([{ show: 'a', season: 1 }])
    expect(formatListMetaLine(t, [showForMeta('a'), showForMeta('b'), showForMeta('c'), showForMeta('d')])).toBe(
      '4 shows · 1 entry',
    )
  })

  it('matches the shared invariant regex used by the four colocated component tests', () => {
    const re = /^\d+ shows? · \d+ entr(?:y|ies)$/i
    expect(formatListMetaLine(theme(1, 1), shows(1))).toMatch(re)
    expect(formatListMetaLine(theme(3, 7), shows(3))).toMatch(re)
    expect(formatListMetaLine(theme(1, 5), shows(1))).toMatch(re)
  })

  it('falls back to countShows when shows is omitted (home surface path)', () => {
    expect(formatListMetaLine(theme(3, 7))).toBe('3 shows · 7 entries')
  })
})

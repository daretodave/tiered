import { describe, expect, it } from 'vitest'
import {
  filterModeText,
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

  it('"all" mode includes the `in the index` qualifier (chip != catalog total)', () => {
    // The hero lede reads from `stats.total` (catalog total); the chip's
    // `counts.all` is the NON-featured index-grid scope. Qualifying keeps
    // `ALL` from silently shadowing the lede — critique pass-25.
    expect(
      filterModeText('all', { all: 9, tone: 3, structure: 0, craft: 3, era: 2, single: 1 }),
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

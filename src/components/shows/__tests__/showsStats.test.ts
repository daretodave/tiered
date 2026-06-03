import { describe, expect, it, vi } from 'vitest'
import type { Show } from '@/content'
import { computeShowsStats } from '../showsStats'

function show(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    seasons: 47,
    status: 'airing',
    blurb: 'b',
    tagline: 't',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

describe('computeShowsStats', () => {
  it('counts shows + sums seasons across the roster', () => {
    const stats = computeShowsStats(
      [
        show({ slug: 'a', seasons: 47 }),
        show({ slug: 'b', seasons: 36 }),
        show({ slug: 'c', seasons: 5 }),
      ],
      () => ({ last_revised: '2026-05-01' }),
    )
    expect(stats.showCount).toBe(3)
    expect(stats.totalSeasons).toBe(88)
  })

  it('returns zeros for an empty roster', () => {
    const stats = computeShowsStats([], () => null)
    expect(stats.showCount).toBe(0)
    expect(stats.totalSeasons).toBe(0)
    expect(stats.lastRevision).toBeNull()
  })

  // Critique pass-27 HIGH (#288): the /shows hero stamp must be
  // sourced from canon frontmatter, not from build-time `new Date()`.
  // Mirrors the pass-24 #269 home/show closure one surface up.
  describe('lastRevision derived from max canon.last_revised', () => {
    it('formats the latest canon ISO across the roster as "Month YYYY"', () => {
      const stats = computeShowsStats(
        [show({ slug: 'a' }), show({ slug: 'b' }), show({ slug: 'c' })],
        (slug) => {
          if (slug === 'a') return { last_revised: '2026-03-01' }
          if (slug === 'b') return { last_revised: '2026-05-15' }
          if (slug === 'c') return { last_revised: '2026-04-20' }
          return null
        },
      )
      expect(stats.lastRevision).toBe('May 2026')
    })

    it('reads each show\'s own canon — not a hard-coded slug', () => {
      const lookup = vi.fn((slug: string) =>
        slug === 'amazing-race' ? { last_revised: '2026-04-01' } : null,
      )
      const stats = computeShowsStats(
        [show({ slug: 'amazing-race', name: 'The Amazing Race' })],
        lookup,
      )
      expect(lookup).toHaveBeenCalledWith('amazing-race')
      expect(stats.lastRevision).toBe('April 2026')
    })

    it('returns null when no canon in the catalog carries last_revised', () => {
      const stats = computeShowsStats(
        [show({ slug: 'a' }), show({ slug: 'b' })],
        () => ({}),
      )
      expect(stats.lastRevision).toBeNull()
    })

    it('returns null when no show has a canon at all', () => {
      const stats = computeShowsStats(
        [show({ slug: 'a' }), show({ slug: 'b' })],
        () => null,
      )
      expect(stats.lastRevision).toBeNull()
    })

    it('skips shows missing last_revised and reads the rest', () => {
      const stats = computeShowsStats(
        [show({ slug: 'a' }), show({ slug: 'b' }), show({ slug: 'c' })],
        (slug) => {
          if (slug === 'a') return null
          if (slug === 'b') return { last_revised: '2026-05-19' }
          if (slug === 'c') return {}
          return null
        },
      )
      expect(stats.lastRevision).toBe('May 2026')
    })

    // The prior path called `formatRevision(new Date())` and a
    // June-built /shows stamped "June 2026" regardless of canon
    // revisions — same drift the home pass-24 #269 fix closed on its
    // surface. Pin: when the canons claim May 2026, /shows must read
    // May 2026 even if the test clock sits in June. Mirrors the home
    // page's regression guard at `src/app/(default)/__tests__/page.test.tsx`.
    it('does not derive lastRevision from build-time `new Date()`', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-01T00:00:00Z'))
      try {
        const stats = computeShowsStats(
          [show({ slug: 'a' })],
          () => ({ last_revised: '2026-05-21' }),
        )
        expect(stats.lastRevision).toBe('May 2026')
        expect(stats.lastRevision).not.toBe('June 2026')
      } finally {
        vi.useRealTimers()
      }
    })
  })
})

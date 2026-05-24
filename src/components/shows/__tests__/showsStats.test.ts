import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import { computeShowsStats, formatRevision } from '../showsStats'

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

describe('formatRevision', () => {
  it('renders the editorial "Month YYYY" form', () => {
    expect(formatRevision(new Date(Date.UTC(2026, 3, 15)))).toBe('April 2026')
    expect(formatRevision(new Date(Date.UTC(2026, 11, 1)))).toBe('December 2026')
    expect(formatRevision(new Date(Date.UTC(2030, 0, 1)))).toBe('January 2030')
  })
})

describe('computeShowsStats', () => {
  it('counts shows + sums seasons + stamps the revision', () => {
    const today = new Date(Date.UTC(2026, 4, 15))
    const stats = computeShowsStats(
      [
        show({ slug: 'a', seasons: 47 }),
        show({ slug: 'b', seasons: 36 }),
        show({ slug: 'c', seasons: 5 }),
      ],
      today,
    )
    expect(stats.showCount).toBe(3)
    expect(stats.totalSeasons).toBe(88)
    expect(stats.lastRevision).toBe('May 2026')
  })

  it('returns zeros for an empty roster', () => {
    const stats = computeShowsStats([], new Date(Date.UTC(2026, 0, 1)))
    expect(stats.showCount).toBe(0)
    expect(stats.totalSeasons).toBe(0)
  })
})

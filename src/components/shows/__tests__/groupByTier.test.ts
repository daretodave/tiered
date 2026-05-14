import { describe, expect, it } from 'vitest'
import type { Show, ShowTier } from '@/content'
import { groupShowsByTier } from '../groupByTier'

function show(slug: string, tier: ShowTier, seasons: number): Show {
  return {
    slug,
    name: slug,
    palette: { primary: '#000000', ink: '#ffffff', paper: '#111111' },
    seasons,
    status: 'airing',
    blurb: 'b',
    tagline: 't',
    tier,
    network: 'X',
    est_year: 2000,
    genre_tag: 'g',
    featured: false,
  }
}

describe('groupShowsByTier', () => {
  it('buckets shows into S / A / B', () => {
    const out = groupShowsByTier([
      show('a', 'A', 1),
      show('b', 'B', 2),
      show('c', 'S', 3),
      show('d', 'A', 4),
    ])
    expect(out.S.map((s) => s.slug)).toEqual(['c'])
    expect(out.A.map((s) => s.slug)).toEqual(['d', 'a'])
    expect(out.B.map((s) => s.slug)).toEqual(['b'])
  })

  it('sorts each tier by seasons desc, slug asc on ties', () => {
    const out = groupShowsByTier([
      show('big-brother', 'A', 26),
      show('amazing-race', 'A', 36),
      show('top-chef', 'A', 21),
      show('bachelor', 'A', 26),
    ])
    expect(out.A.map((s) => s.slug)).toEqual([
      'amazing-race',
      'bachelor',
      'big-brother',
      'top-chef',
    ])
  })

  it('returns empty arrays for tiers with no shows', () => {
    const out = groupShowsByTier([])
    expect(out.S).toEqual([])
    expect(out.A).toEqual([])
    expect(out.B).toEqual([])
  })
})

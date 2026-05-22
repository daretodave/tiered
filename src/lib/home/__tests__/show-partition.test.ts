import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import {
  HOME_FEATURED_TILES,
  partitionHomeShows,
} from '../show-partition'

// The partition only ever slices the array — it reads no Show fields —
// so a minimal slug-only cast is an honest fixture here.
const show = (slug: string): Show => ({ slug }) as unknown as Show

const catalog = (n: number): Show[] =>
  Array.from({ length: n }, (_, i) => show(`show-${i}`))

describe('partitionHomeShows', () => {
  it('puts the first HOME_FEATURED_TILES shows in featured', () => {
    const { featured } = partitionHomeShows(catalog(13))
    expect(featured).toHaveLength(HOME_FEATURED_TILES)
    expect(featured.map((s) => s.slug)).toEqual([
      'show-0',
      'show-1',
      'show-2',
    ])
  })

  it('puts every non-featured show in compact — no fixed cap', () => {
    const { compact } = partitionHomeShows(catalog(13))
    expect(compact).toHaveLength(13 - HOME_FEATURED_TILES)
    expect(compact[0]?.slug).toBe('show-3')
    expect(compact.at(-1)?.slug).toBe('show-12')
  })

  it('strands no show — featured + compact covers the whole catalog', () => {
    const shows = catalog(13)
    const { featured, compact } = partitionHomeShows(shows)
    expect(featured.length + compact.length).toBe(shows.length)
    expect([...featured, ...compact].map((s) => s.slug)).toEqual(
      shows.map((s) => s.slug),
    )
  })

  it('leaves compact empty when the catalog is exactly the featured count', () => {
    const { featured, compact } = partitionHomeShows(
      catalog(HOME_FEATURED_TILES),
    )
    expect(featured).toHaveLength(HOME_FEATURED_TILES)
    expect(compact).toHaveLength(0)
  })

  it('handles a catalog smaller than the featured count', () => {
    const { featured, compact } = partitionHomeShows(catalog(2))
    expect(featured).toHaveLength(2)
    expect(compact).toHaveLength(0)
  })

  it('does not mutate the input array', () => {
    const shows = catalog(13)
    const snapshot = shows.map((s) => s.slug)
    partitionHomeShows(shows)
    expect(shows.map((s) => s.slug)).toEqual(snapshot)
  })
})

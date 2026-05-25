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

  // critique pass 10 #174 — the FEATURED hero (`getFeaturedShow()`)
  // was being repainted inside the compact tail because the partition
  // sliced the full alpha-sorted catalog. The optional `excludeSlug`
  // arg drops that slug from the pool so featured + compact union to
  // a unique set, no overlap.
  describe('excludeSlug', () => {
    it('omits the excluded slug from both featured and compact', () => {
      // Excluding 'show-5' (a compact-tail slug) drops it from the
      // compact grid; featured remains [0, 1, 2].
      const shows = catalog(13)
      const { featured, compact } = partitionHomeShows(shows, 'show-5')
      const all = [...featured, ...compact].map((s) => s.slug)
      expect(all).not.toContain('show-5')
      expect(all).toHaveLength(12)
    })

    it('shifts compact forward when the excluded slug was in featured', () => {
      // Excluding 'show-1' (the second featured slug) pulls 'show-3'
      // into the featured-tiles position so the 3-up grid stays full.
      const shows = catalog(13)
      const { featured, compact } = partitionHomeShows(shows, 'show-1')
      expect(featured.map((s) => s.slug)).toEqual([
        'show-0',
        'show-2',
        'show-3',
      ])
      expect(compact.map((s) => s.slug)).not.toContain('show-1')
      expect(featured).toHaveLength(HOME_FEATURED_TILES)
      expect(compact).toHaveLength(13 - 1 - HOME_FEATURED_TILES)
    })

    it('treats an unknown excludeSlug as a no-op', () => {
      const shows = catalog(13)
      const baseline = partitionHomeShows(shows)
      const filtered = partitionHomeShows(shows, 'show-does-not-exist')
      expect(filtered.featured.map((s) => s.slug)).toEqual(
        baseline.featured.map((s) => s.slug),
      )
      expect(filtered.compact.map((s) => s.slug)).toEqual(
        baseline.compact.map((s) => s.slug),
      )
    })

    it('keeps the partition behavior when excludeSlug is undefined', () => {
      const shows = catalog(13)
      const baseline = partitionHomeShows(shows)
      const same = partitionHomeShows(shows, undefined)
      expect(same.featured.map((s) => s.slug)).toEqual(
        baseline.featured.map((s) => s.slug),
      )
      expect(same.compact.map((s) => s.slug)).toEqual(
        baseline.compact.map((s) => s.slug),
      )
    })

    it('does not mutate the input array when excludeSlug is supplied', () => {
      const shows = catalog(13)
      const snapshot = shows.map((s) => s.slug)
      partitionHomeShows(shows, 'show-5')
      expect(shows.map((s) => s.slug)).toEqual(snapshot)
    })

    it('handles a catalog smaller than featured count with exclusion', () => {
      // 2 shows, exclude one → 1 left, all goes to featured, compact empty.
      const { featured, compact } = partitionHomeShows(
        catalog(2),
        'show-0',
      )
      expect(featured.map((s) => s.slug)).toEqual(['show-1'])
      expect(compact).toHaveLength(0)
    })
  })
})

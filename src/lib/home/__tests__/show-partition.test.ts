import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Show, ShowTier } from '@/content'
import {
  __resetContentCache,
  getAllShows,
  getFeaturedShow,
  setContentRoot,
} from '@/content'
import {
  HOME_FEATURED_TILES,
  partitionHomeShows,
} from '../show-partition'

// The partition reads `slug` (for ordering + exclusion) and `tier`
// (for the S → A → B sort introduced by critique pass 30 #300), so
// fixtures must surface both. Default tier 'A' keeps the legacy
// slug-only test bodies stable: ties within tier resolve by
// `slug.localeCompare`, so `show-0..show-N` keeps its prior order.
const show = (slug: string, tier: ShowTier = 'A'): Show =>
  ({ slug, tier }) as unknown as Show

// Zero-pad to two digits so lexicographic slug sort (introduced by
// the tier-first ordering, with slug as in-tier tiebreaker) matches
// numeric order — i.e. `show-02` still precedes `show-10` after the
// partition's internal sort. Without the pad, `show-10` would sort
// before `show-2` and the assertions below would read backward.
const catalog = (n: number): Show[] =>
  Array.from({ length: n }, (_, i) =>
    show(`show-${String(i).padStart(2, '0')}`),
  )

describe('partitionHomeShows', () => {
  it('puts the first HOME_FEATURED_TILES shows in featured', () => {
    const { featured } = partitionHomeShows(catalog(13))
    expect(featured).toHaveLength(HOME_FEATURED_TILES)
    expect(featured.map((s) => s.slug)).toEqual([
      'show-00',
      'show-01',
      'show-02',
    ])
  })

  it('puts every non-featured show in compact — no fixed cap', () => {
    const { compact } = partitionHomeShows(catalog(13))
    expect(compact).toHaveLength(13 - HOME_FEATURED_TILES)
    expect(compact[0]?.slug).toBe('show-03')
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
      // Excluding 'show-05' (a compact-tail slug) drops it from the
      // compact grid; featured remains [00, 01, 02].
      const shows = catalog(13)
      const { featured, compact } = partitionHomeShows(shows, 'show-05')
      const all = [...featured, ...compact].map((s) => s.slug)
      expect(all).not.toContain('show-05')
      expect(all).toHaveLength(12)
    })

    it('shifts compact forward when the excluded slug was in featured', () => {
      // Excluding 'show-01' (the second featured slug) pulls 'show-03'
      // into the featured-tiles position so the 3-up grid stays full.
      const shows = catalog(13)
      const { featured, compact } = partitionHomeShows(shows, 'show-01')
      expect(featured.map((s) => s.slug)).toEqual([
        'show-00',
        'show-02',
        'show-03',
      ])
      expect(compact.map((s) => s.slug)).not.toContain('show-01')
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
      partitionHomeShows(shows, 'show-05')
      expect(shows.map((s) => s.slug)).toEqual(snapshot)
    })

    it('handles a catalog smaller than featured count with exclusion', () => {
      // 2 shows, exclude one → 1 left, all goes to featured, compact empty.
      const { featured, compact } = partitionHomeShows(
        catalog(2),
        'show-00',
      )
      expect(featured.map((s) => s.slug)).toEqual(['show-01'])
      expect(compact).toHaveLength(0)
    })
  })

  // critique pass 30 #300 — the spotlight cut led with the
  // alphabetical-first three shows because callers pass an
  // alpha-sorted catalog (`getAllShows()` slug.localeCompare). The
  // partition now sorts by `TIER_ORDER` rank first (S → A → B) with
  // slug as tiebreaker, mirroring the pass-29 footer fix at
  // `src/components/chrome/footer/FooterTiersCol.tsx` (54a4170). Two
  // bidirectional pins: a positive case against today's real roster
  // (so a tier-order regression trips on the canonical catalog the
  // home page actually renders), and a synthetic negative pin where
  // the highest-tier show is alphabetically last (so a future
  // refactor that drops the tier sort and reverts to bare alpha
  // surfaces here, not in production critique).
  describe('tier-first sort (critique pass 30 #300)', () => {
    const FIXTURE_ROOT = path.resolve(__dirname, '../../../../content')

    beforeAll(() => {
      setContentRoot(FIXTURE_ROOT)
      __resetContentCache()
    })

    afterAll(() => {
      setContentRoot(null)
      __resetContentCache()
    })

    it("today's roster: spotlight cut leads with the next S-tier flagship over A-tier alpha-first", () => {
      // Today's catalog has two S-tier shows — Survivor + RuPaul's
      // Drag Race — and the home hero excludes the featured show
      // (Survivor). The remaining S-tier slug must lead the
      // spotlight, not the alphabetical-first A-tier show
      // (`amazing-race`).
      const featuredHero = getFeaturedShow()
      const allShows = getAllShows()
      const { featured } = partitionHomeShows(allShows, featuredHero?.slug)
      expect(featured[0]?.slug).toBe('dragrace')
      // The slot the alpha-only partition would have given to
      // `amazing-race` must instead carry the S-tier slug.
      expect(featured[0]?.slug).not.toBe('amazing-race')
      // S-tier strictly precedes A-tier in the cut.
      const featuredTiers = featured.map((s) => s.tier)
      expect(featuredTiers[0]).toBe('S')
    })

    it('synthetic catalog: highest-tier show leads even when alphabetically last', () => {
      // Drift guard: a refactor that drops the tier sort and reverts
      // to bare `slice(0, 3)` on slug-sorted input would put the
      // alpha-first show in the spotlight and demote the S-tier show
      // — the exact regression class this pin guards.
      const shows: Show[] = [
        show('alpha-first-a', 'A'),
        show('beta-second-b', 'B'),
        show('gamma-third-a', 'A'),
        show('zeta-last-s', 'S'),
      ]
      const { featured, compact } = partitionHomeShows(shows)
      expect(featured.map((s) => s.slug)).toEqual([
        'zeta-last-s',
        'alpha-first-a',
        'gamma-third-a',
      ])
      expect(compact.map((s) => s.slug)).toEqual(['beta-second-b'])
    })

    it('sorts B-tier strictly after A-tier even when its slug sorts first', () => {
      // `aardvark-b` would lead a pure-alpha sort; tier-first sort
      // pushes it behind every A-tier show.
      const shows: Show[] = [
        show('aardvark-b', 'B'),
        show('omega-a', 'A'),
        show('zulu-a', 'A'),
      ]
      const { featured } = partitionHomeShows(shows)
      expect(featured.map((s) => s.slug)).toEqual([
        'omega-a',
        'zulu-a',
        'aardvark-b',
      ])
    })

    it('does not mutate the input array when sorting by tier', () => {
      // Defense-in-depth: the new sort uses `[...filtered].sort(...)`
      // so callers passing a pre-sorted `getAllShows()` slice keep
      // their array intact.
      const shows: Show[] = [
        show('charlie', 'B'),
        show('alpha', 'S'),
        show('bravo', 'A'),
      ]
      const snapshot = shows.map((s) => s.slug)
      partitionHomeShows(shows)
      expect(shows.map((s) => s.slug)).toEqual(snapshot)
    })
  })
})

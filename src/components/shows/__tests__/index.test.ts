import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as ShowsHeroModule from '../ShowsHero'
import * as TierGlyphModule from '../TierGlyph'
import * as TierHeadModule from '../TierHead'
import * as TierSectionModule from '../TierSection'
import * as ShowsTileModule from '../ShowsTile'
import * as ShowsStatusPillModule from '../ShowsStatusPill'
import * as HowTiersMoveModule from '../HowTiersMove'
import * as tierMetaModule from '../tierMeta'
import * as showsStatsModule from '../showsStats'
import * as groupByTierModule from '../groupByTier'
import * as canonProgressModule from '../canonProgress'
import * as tierMetaDescriptionModule from '../tierMetaDescription'

import type {
  ShowsTileVariant,
  TierMeta,
  ShowsStats,
  GroupedShows,
} from '../index'

const EXPECTED_RUNTIME_KEYS = [
  'CANON_TARGET',
  'HowTiersMove',
  'ShowsHero',
  'ShowsStatusPill',
  'ShowsTile',
  'TIER_ORDER',
  'TierGlyph',
  'TierHead',
  'TierSection',
  'buildShowsMetaDescription',
  'canonProgress',
  'computeShowsStats',
  'groupShowsByTier',
  'showsForTier',
  'tierMeta',
] as const

const FUNCTION_KEYS = [
  'HowTiersMove',
  'ShowsHero',
  'ShowsStatusPill',
  'ShowsTile',
  'TierGlyph',
  'TierHead',
  'TierSection',
  'buildShowsMetaDescription',
  'canonProgress',
  'computeShowsStats',
  'groupShowsByTier',
  'showsForTier',
  'tierMeta',
] as const

describe('@/components/shows barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every component verbatim (===, not a wrapped reference)', () => {
      expect(barrel.ShowsHero).toBe(ShowsHeroModule.ShowsHero)
      expect(barrel.TierGlyph).toBe(TierGlyphModule.TierGlyph)
      expect(barrel.TierHead).toBe(TierHeadModule.TierHead)
      expect(barrel.TierSection).toBe(TierSectionModule.TierSection)
      expect(barrel.ShowsTile).toBe(ShowsTileModule.ShowsTile)
      expect(barrel.ShowsStatusPill).toBe(ShowsStatusPillModule.ShowsStatusPill)
      expect(barrel.HowTiersMove).toBe(HowTiersMoveModule.HowTiersMove)
    })

    it('forwards tierMeta + TIER_ORDER verbatim from ./tierMeta', () => {
      expect(barrel.tierMeta).toBe(tierMetaModule.tierMeta)
      expect(barrel.TIER_ORDER).toBe(tierMetaModule.TIER_ORDER)
    })

    it('forwards computeShowsStats verbatim from ./showsStats', () => {
      expect(barrel.computeShowsStats).toBe(showsStatsModule.computeShowsStats)
    })

    it('forwards groupShowsByTier + showsForTier verbatim from ./groupByTier', () => {
      expect(barrel.groupShowsByTier).toBe(groupByTierModule.groupShowsByTier)
      expect(barrel.showsForTier).toBe(groupByTierModule.showsForTier)
    })

    it('forwards canonProgress + CANON_TARGET verbatim from ./canonProgress', () => {
      expect(barrel.canonProgress).toBe(canonProgressModule.canonProgress)
      expect(barrel.CANON_TARGET).toBe(canonProgressModule.CANON_TARGET)
    })

    it('forwards buildShowsMetaDescription verbatim from ./tierMetaDescription', () => {
      expect(barrel.buildShowsMetaDescription).toBe(
        tierMetaDescriptionModule.buildShowsMetaDescription,
      )
    })
  })

  describe('public-surface key snapshot', () => {
    it('exposes exactly the documented 15 runtime keys, nothing more, nothing less', () => {
      const keys = Object.keys(barrel).sort()
      expect(keys).toEqual([...EXPECTED_RUNTIME_KEYS].sort())
    })

    it('every documented runtime key resolves to a defined value (no undefined holes)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(barrel[key as keyof typeof barrel]).toBeDefined()
      }
    })

    it('every function-shaped export is in fact a function (catches accidental value/type swap)', () => {
      for (const key of FUNCTION_KEYS) {
        expect(typeof barrel[key as keyof typeof barrel]).toBe('function')
      }
    })

    it('TIER_ORDER is a readonly tuple of the 3 tier letters in S→A→B order', () => {
      // Value-shape lock: the array is not promoted to a function or
      // mutated to a different order. The tierMeta colocated test pins
      // the exact content; here we lock that the barrel forwards it as
      // an array (not, e.g., a getter or a frozen object) with the
      // expected length + value.
      expect(Array.isArray(barrel.TIER_ORDER)).toBe(true)
      expect(barrel.TIER_ORDER).toHaveLength(3)
      expect(barrel.TIER_ORDER).toEqual(['S', 'A', 'B'])
    })

    it('CANON_TARGET is a number primitive (catches accidental value-vs-type swap)', () => {
      expect(typeof barrel.CANON_TARGET).toBe('number')
      expect(barrel.CANON_TARGET).toBe(3)
    })

    it('the barrel exports nothing besides the 15 documented symbols (no helpers, no constants, no types-promoted-to-runtime)', () => {
      const documented = new Set<string>(EXPECTED_RUNTIME_KEYS)
      const extras = Object.keys(barrel).filter((k) => !documented.has(k))
      expect(extras).toEqual([])
    })
  })

  describe('type re-exports compile through the barrel', () => {
    // The top-of-file `import type { ... } from '../index'` block is the
    // load-bearing assertion: if any of the 4 type names ever drops off
    // the barrel (or is renamed at source without barrel update), typecheck
    // fails before this suite even runs. The runtime checks below pin one
    // value of the enum-like `ShowsTileVariant` through the barrel as a
    // belt-and-braces guarantee that the names round-trip cleanly.
    it('accepts each type name in a type-only position via the barrel', () => {
      const variant: ShowsTileVariant = 'regular'
      expect(variant).toBe('regular')

      // Force the structural type names into the test scope so a future
      // accidental removal of any of them from the barrel surfaces here
      // (in addition to the import-block typecheck). The values are
      // immaterial — the test fails at compile time if any of these names
      // disappears from `../index`.
      type RuntimeShapes = {
        tierMeta?: TierMeta
        showsStats?: ShowsStats
        grouped?: GroupedShows
      }
      const sample: RuntimeShapes = {}
      expect(sample).toEqual({})
    })
  })
})

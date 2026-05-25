import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as AdjacentSeasonsModule from '../AdjacentSeasons'
import * as AppearsInListModule from '../AppearsInList'
import * as CommentInputModule from '../CommentInput'
import * as CommentInputStubModule from '../CommentInputStub'
import * as CommentItemModule from '../CommentItem'
import * as CommentThreadModule from '../CommentThread'
import * as CommentThreadLiveModule from '../CommentThreadLive'
import * as FilterBarModule from '../FilterBar'
import * as RankScaleModule from '../RankScale'
import * as RankShiftPillModule from '../RankShiftPill'
import * as RankTagModule from '../RankTag'
import * as SeasonCardModule from '../SeasonCard'
import * as SeasonEpStripModule from '../SeasonEpStrip'
import * as SeasonGridModule from '../SeasonGrid'
import * as SeasonHeroModule from '../SeasonHero'
import * as SeasonInfoCardModule from '../SeasonInfoCard'
import * as SeasonStatsStripModule from '../SeasonStatsStrip'
import * as SeasonTOCModule from '../SeasonTOC'
import * as SeasonTOCMobileModule from '../SeasonTOCMobile'
import * as ShieldBadgeModule from '../ShieldBadge'
import * as ShiftCardModule from '../ShiftCard'
import * as ShiftsRowModule from '../ShiftsRow'
import * as ShowHeroModule from '../ShowHero'
import * as TopNavTintedModule from '../TopNavTinted'
import * as VotePairModule from '../VotePair'
import * as VoteRowHeadModule from '../VoteRowHead'
import * as WatchListModule from '../WatchList'

import type {
  AdjacentSide,
  AppearsInRow,
  RankSentiment,
  SeasonCardShift,
  SeasonStat,
  ShowHeroStat,
  TOCSection,
} from '../index'

const EXPECTED_RUNTIME_KEYS = [
  'AdjacentSeasons',
  'AppearsInList',
  'CommentInput',
  'CommentInputStub',
  'CommentItem',
  'CommentThread',
  'CommentThreadLive',
  'FilterBar',
  'RankScale',
  'RankShiftPill',
  'RankTag',
  'SeasonCard',
  'SeasonEpStrip',
  'SeasonGrid',
  'SeasonHero',
  'SeasonInfoCard',
  'SeasonStatsStrip',
  'SeasonTOC',
  'SeasonTOCMobile',
  'ShieldBadge',
  'ShiftCard',
  'ShiftsRow',
  'ShowHero',
  'TopNavTinted',
  'VotePair',
  'VoteRowHead',
  'WatchList',
  'rankFillPercent',
] as const

describe('@/components/composition barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every component verbatim (===, not a wrapped reference)', () => {
      expect(barrel.AdjacentSeasons).toBe(AdjacentSeasonsModule.AdjacentSeasons)
      expect(barrel.AppearsInList).toBe(AppearsInListModule.AppearsInList)
      expect(barrel.CommentInput).toBe(CommentInputModule.CommentInput)
      expect(barrel.CommentInputStub).toBe(CommentInputStubModule.CommentInputStub)
      expect(barrel.CommentItem).toBe(CommentItemModule.CommentItem)
      expect(barrel.CommentThread).toBe(CommentThreadModule.CommentThread)
      expect(barrel.CommentThreadLive).toBe(CommentThreadLiveModule.CommentThreadLive)
      expect(barrel.FilterBar).toBe(FilterBarModule.FilterBar)
      expect(barrel.RankScale).toBe(RankScaleModule.RankScale)
      expect(barrel.RankShiftPill).toBe(RankShiftPillModule.RankShiftPill)
      expect(barrel.RankTag).toBe(RankTagModule.RankTag)
      expect(barrel.SeasonCard).toBe(SeasonCardModule.SeasonCard)
      expect(barrel.SeasonEpStrip).toBe(SeasonEpStripModule.SeasonEpStrip)
      expect(barrel.SeasonGrid).toBe(SeasonGridModule.SeasonGrid)
      expect(barrel.SeasonHero).toBe(SeasonHeroModule.SeasonHero)
      expect(barrel.SeasonInfoCard).toBe(SeasonInfoCardModule.SeasonInfoCard)
      expect(barrel.SeasonStatsStrip).toBe(SeasonStatsStripModule.SeasonStatsStrip)
      expect(barrel.SeasonTOC).toBe(SeasonTOCModule.SeasonTOC)
      expect(barrel.SeasonTOCMobile).toBe(SeasonTOCMobileModule.SeasonTOCMobile)
      expect(barrel.ShieldBadge).toBe(ShieldBadgeModule.ShieldBadge)
      expect(barrel.ShiftCard).toBe(ShiftCardModule.ShiftCard)
      expect(barrel.ShiftsRow).toBe(ShiftsRowModule.ShiftsRow)
      expect(barrel.ShowHero).toBe(ShowHeroModule.ShowHero)
      expect(barrel.TopNavTinted).toBe(TopNavTintedModule.TopNavTinted)
      expect(barrel.VotePair).toBe(VotePairModule.VotePair)
      expect(barrel.VoteRowHead).toBe(VoteRowHeadModule.VoteRowHead)
      expect(barrel.WatchList).toBe(WatchListModule.WatchList)
    })

    it('forwards rankFillPercent verbatim from ./RankScale (the only non-component runtime export)', () => {
      expect(barrel.rankFillPercent).toBe(RankScaleModule.rankFillPercent)
    })
  })

  describe('public-surface key snapshot', () => {
    it('exposes exactly the documented 28 runtime keys, nothing more, nothing less', () => {
      const keys = Object.keys(barrel).sort()
      expect(keys).toEqual([...EXPECTED_RUNTIME_KEYS].sort())
    })

    it('every documented runtime key resolves to a defined value (no undefined holes)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(barrel[key as keyof typeof barrel]).toBeDefined()
      }
    })

    it('every runtime export is in fact a function (catches accidental value/type swap)', () => {
      for (const key of EXPECTED_RUNTIME_KEYS) {
        expect(typeof barrel[key as keyof typeof barrel]).toBe('function')
      }
    })
  })

  describe('private-helper non-leak from source modules', () => {
    it('does not expose SeasonHero internal helpers (decodeTitleEntities, parseDisplayTitle)', () => {
      const leaked: string[] = []
      const privateHelpers = ['decodeTitleEntities', 'parseDisplayTitle'] as const
      for (const helper of privateHelpers) {
        if (helper in barrel) leaked.push(helper)
      }
      expect(leaked).toEqual([])
    })

    it('confirms SeasonHero internal helpers DO exist at source (so the non-leak check above is meaningful)', () => {
      expect(SeasonHeroModule.decodeTitleEntities).toBeDefined()
      expect(SeasonHeroModule.parseDisplayTitle).toBeDefined()
    })

    it('does not expose FilterBar internal FilterKey type (asserted via the runtime keys snapshot — FilterKey is type-only and would not show on Object.keys, but a future hoist to a runtime const would)', () => {
      expect(Object.keys(barrel)).not.toContain('FilterKey')
    })
  })

  describe('type re-exports compile through the barrel', () => {
    // The top-of-file `import type { ... } from '../index'` block is the
    // load-bearing assertion: if any of the 7 type names ever drops off
    // the barrel (or is renamed at source without barrel update), typecheck
    // fails before this suite even runs. The runtime checks below pin a
    // single value of each enum-like type through the barrel as a
    // belt-and-braces guarantee that the names round-trip cleanly.
    it('accepts each type name in a type-only position via the barrel', () => {
      const sentiment: RankSentiment = 'hold'
      expect(sentiment).toBe('hold')

      // Force the structural type names into the test scope so a future
      // accidental removal of any of them from the barrel surfaces here
      // (in addition to the import-block typecheck). The values are
      // immaterial — the test fails at compile time if any of these names
      // disappears from `../index`.
      type RuntimeShapes = {
        adjacentSide?: AdjacentSide
        appearsInRow?: AppearsInRow
        seasonCardShift?: SeasonCardShift
        seasonStat?: SeasonStat
        showHeroStat?: ShowHeroStat
        tocSection?: TOCSection
      }
      const sample: RuntimeShapes = {}
      expect(sample).toEqual({})
    })
  })
})

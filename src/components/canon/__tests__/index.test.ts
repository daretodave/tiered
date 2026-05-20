import { describe, expect, it } from 'vitest'

import * as barrel from '../index'
import * as CanonCompactEntriesModule from '../CanonCompactEntries'
import * as CanonEraToolbarModule from '../CanonEraToolbar'
import * as CanonHeroEntriesModule from '../CanonHeroEntries'
import * as CanonMethodologyModule from '../CanonMethodology'
import * as CanonMidEntriesModule from '../CanonMidEntries'
import * as CanonTabSwitchModule from '../CanonTabSwitch'
import * as CanonTailEntriesModule from '../CanonTailEntries'
import * as CanonTierBandModule from '../CanonTierBand'
import * as CommunityLiveStripModule from '../CommunityLiveStrip'
import * as CommunityMoversModule from '../CommunityMovers'
import * as CommunityRankListModule from '../CommunityRankList'
import * as CommunityWeeklyQuestionCardModule from '../CommunityWeeklyQuestionCard'
import * as ShowRankingModule from '../ShowRanking'

const EXPECTED_RUNTIME_KEYS = [
  'CanonCompactEntries',
  'CanonEraToolbar',
  'CanonHeroEntries',
  'CanonMethodology',
  'CanonMidEntries',
  'CanonTabSwitch',
  'CanonTailEntries',
  'CanonTierBand',
  'CommunityLiveStrip',
  'CommunityMovers',
  'CommunityRankList',
  'CommunityWeeklyQuestionCard',
  'ShowRanking',
] as const

describe('@/components/canon barrel — runtime re-exports', () => {
  describe('identity equality with source modules', () => {
    it('forwards every component verbatim (===, not a wrapped reference)', () => {
      expect(barrel.CanonCompactEntries).toBe(CanonCompactEntriesModule.CanonCompactEntries)
      expect(barrel.CanonEraToolbar).toBe(CanonEraToolbarModule.CanonEraToolbar)
      expect(barrel.CanonHeroEntries).toBe(CanonHeroEntriesModule.CanonHeroEntries)
      expect(barrel.CanonMethodology).toBe(CanonMethodologyModule.CanonMethodology)
      expect(barrel.CanonMidEntries).toBe(CanonMidEntriesModule.CanonMidEntries)
      expect(barrel.CanonTabSwitch).toBe(CanonTabSwitchModule.CanonTabSwitch)
      expect(barrel.CanonTailEntries).toBe(CanonTailEntriesModule.CanonTailEntries)
      expect(barrel.CanonTierBand).toBe(CanonTierBandModule.CanonTierBand)
      expect(barrel.CommunityLiveStrip).toBe(CommunityLiveStripModule.CommunityLiveStrip)
      expect(barrel.CommunityMovers).toBe(CommunityMoversModule.CommunityMovers)
      expect(barrel.CommunityRankList).toBe(CommunityRankListModule.CommunityRankList)
      expect(barrel.CommunityWeeklyQuestionCard).toBe(
        CommunityWeeklyQuestionCardModule.CommunityWeeklyQuestionCard,
      )
      expect(barrel.ShowRanking).toBe(ShowRankingModule.ShowRanking)
    })
  })

  describe('public-surface key snapshot', () => {
    it('exposes exactly the documented 13 runtime keys, nothing more, nothing less', () => {
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

    it('the barrel exports nothing besides the 13 documented components (no constants, no types-promoted-to-runtime, no helpers)', () => {
      const documented = new Set<string>(EXPECTED_RUNTIME_KEYS)
      const extras = Object.keys(barrel).filter((k) => !documented.has(k))
      expect(extras).toEqual([])
    })
  })
})

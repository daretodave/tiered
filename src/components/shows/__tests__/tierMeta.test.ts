import { describe, expect, it } from 'vitest'
import type { ShowTier } from '@/content'
import { tierMeta, TIER_ORDER, type TierMeta } from '../tierMeta'

describe('tierMeta', () => {
  describe('record shapes (exact editorial copy)', () => {
    it('S tier carries the format-defining record', () => {
      expect(tierMeta('S')).toEqual({
        tier: 'S',
        tag: 'Format-defining',
        name: 'The shows that invented or perfected their genre.',
      })
    })

    it('A tier carries the deep-canon record', () => {
      expect(tierMeta('A')).toEqual({
        tier: 'A',
        tag: 'Deep canon',
        name: 'The shows with enough seasons and craft to defend a real ranking.',
      })
    })

    it('B tier carries the under-review record', () => {
      expect(tierMeta('B')).toEqual({
        tier: 'B',
        tag: 'Recent additions · under review',
        name: 'The canon is in progress. Every season reviewed before it lands.',
      })
    })

    it('every record echoes the tier letter it was looked up by', () => {
      for (const tier of ['S', 'A', 'B'] as const) {
        expect(tierMeta(tier).tier).toBe(tier)
      }
    })
  })

  describe('dispatcher contract', () => {
    it('is a function', () => {
      expect(typeof tierMeta).toBe('function')
    })

    it('returns the same singleton on repeated calls for the same tier', () => {
      // The implementation uses module-level constants and an
      // if/else-if/else dispatch. A future switch-refactor that
      // dropped reference identity (e.g. by constructing a fresh
      // object per call) would still satisfy deep equality but
      // could surprise callers that compare by reference.
      for (const tier of ['S', 'A', 'B'] as const) {
        expect(tierMeta(tier)).toBe(tierMeta(tier))
      }
    })

    it('returns distinct records for distinct tiers (no cross-aliasing)', () => {
      expect(tierMeta('S')).not.toBe(tierMeta('A'))
      expect(tierMeta('A')).not.toBe(tierMeta('B'))
      expect(tierMeta('S')).not.toBe(tierMeta('B'))
    })

    it('result.tag values are unique across the three tiers', () => {
      const tags = new Set(
        (['S', 'A', 'B'] as const).map((t) => tierMeta(t).tag),
      )
      expect(tags.size).toBe(3)
    })

    it('result.name values are unique across the three tiers', () => {
      const names = new Set(
        (['S', 'A', 'B'] as const).map((t) => tierMeta(t).name),
      )
      expect(names.size).toBe(3)
    })

    it('return type satisfies the TierMeta contract', () => {
      const meta: TierMeta = tierMeta('S')
      expect(meta).toHaveProperty('tier')
      expect(meta).toHaveProperty('tag')
      expect(meta).toHaveProperty('name')
      expect(typeof meta.tier).toBe('string')
      expect(typeof meta.tag).toBe('string')
      expect(typeof meta.name).toBe('string')
    })
  })

  describe('TIER_ORDER', () => {
    it('is exactly [S, A, B] in that order', () => {
      // Locked via whole-array equality so a reorder (B-first
      // experiment) or a drop (e.g. A removed in a refactor)
      // fails loudly. The /shows page renders sections by
      // mapping over this tuple — every visitor sees its order.
      expect(TIER_ORDER).toEqual(['S', 'A', 'B'])
    })

    it('is an array of length 3', () => {
      expect(Array.isArray(TIER_ORDER)).toBe(true)
      expect(TIER_ORDER).toHaveLength(3)
    })

    it('contains no duplicates', () => {
      expect(new Set(TIER_ORDER).size).toBe(TIER_ORDER.length)
    })

    it('every entry resolves through tierMeta() to a record echoing the same tier', () => {
      for (const tier of TIER_ORDER) {
        const t: ShowTier = tier
        expect(tierMeta(t).tier).toBe(tier)
      }
    })
  })
})

import { describe, expect, it } from 'vitest'
import type { ShowTier } from '@/content'
import { tierMeta, TIER_ORDER, type TierMeta } from '../tierMeta'
import { tierLedeSentences } from '../tierLede'

describe('tierMeta', () => {
  describe('record shapes (exact editorial copy)', () => {
    it('S tier carries the format-defining record', () => {
      expect(tierMeta('S')).toEqual({
        tier: 'S',
        tag: 'Format-defining',
        name: 'The shows where the format invented or perfected itself.',
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
        tag: 'Canon still forming',
        name: 'The canon is in progress. Every season reviewed before it lands.',
      })
    })

    // critique-pass-75 #484: the tag used to read "Recent additions
    // · under review," misdescribing tier as recency rather than
    // editorial canon-confidence — a long-running B-tier show (e.g.
    // Dancing with the Stars, 21 years / 34 seasons) directly
    // contradicted the word "recent" in the same band. Drift guard.
    it('B tier tag does not claim recency', () => {
      expect(tierMeta('B').tag).not.toMatch(/recent/i)
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

  // critique-pass-35: the /shows hero lede + the S-group eyebrow tag
  // (`FORMAT-DEFINING`) + the S-group name subtitle must all commit
  // to the same word — `format` — so a reader scanning the chrome
  // doesn't reconcile two vocabularies for the same idea in adjacent
  // reading positions. A prior pass had the subtitle drift to `genre`
  // while the hero + eyebrow stayed on `format`; this block guards
  // that the three surfaces stay aligned. The A-tier sibling positive
  // pins its own framing so a future edit can't sneak `format` /
  // `genre` into the A-tier name either, conflating the two tiers'
  // distinct claims.
  describe('S/A tier vocabulary alignment', () => {
    it('S-tier eyebrow tag commits to format, not genre', () => {
      expect(tierMeta('S').tag).toMatch(/format/i)
      expect(tierMeta('S').tag).not.toMatch(/genre/i)
    })

    it('S-tier name subtitle commits to format, not genre', () => {
      expect(tierMeta('S').name).toMatch(/format/i)
      expect(tierMeta('S').name).not.toMatch(/genre/i)
    })

    it('S-tier hero lede sentence commits to format, not genre', () => {
      const [ledeS] = tierLedeSentences(['S'])
      expect(ledeS).toMatch(/format/i)
      expect(ledeS).not.toMatch(/genre/i)
    })

    it('A-tier name stays on the deep-canon framing — no format/genre conflation', () => {
      expect(tierMeta('A').name).toMatch(/seasons|craft|defend a real ranking/i)
      expect(tierMeta('A').name).not.toMatch(/format|genre/i)
    })

    it('A-tier hero lede sentence stays on the deep-canon framing — no format/genre conflation', () => {
      const [ledeA] = tierLedeSentences(['A'])
      expect(ledeA).toMatch(/deep canon|years to defend/i)
      expect(ledeA).not.toMatch(/format|genre/i)
    })
  })

  // critique-pass-46 #389: the /shows S-tier band subhead used to
  // read `The shows that invented or perfected their format.` —
  // shows-as-agent. Survivor's S-tile card_tagline immediately
  // adjacent in the band at the time (`The format that invented
  // itself in episode one, and is still finding new ways to ask
  // who you really are.`) framed the format as the agent. Same
  // band, two sentences pulling opposite directions on who-
  // invented-what. The rotation flipped the subhead to format-
  // as-agent (`The shows where the format invented or perfected
  // itself.`), preserving the pass-35 #332 vocabulary commit
  // (`format`, not `genre`). Bidirectional pin guards both the
  // post-rotation literal AND the rejected pre-rotation literal.
  // (Pass-47 #394 later rewrote Survivor's card_tagline so the
  // home cover sub and the show-page hero diverge at the 5-word
  // floor; the pin stays load-bearing as a /shows tier-band voice
  // regression guard independent of any one show's tile copy.)
  describe('S-tier band subhead subject agreement (critique pass-46 #389)', () => {
    it('S-tier name subhead frames the format as the agent', () => {
      expect(tierMeta('S').name).toMatch(
        /where the format invented or perfected itself/i,
      )
    })

    it('S-tier name subhead does NOT carry the rejected shows-as-agent literal', () => {
      // Drift guard: the pre-rotation literal framed SHOWS as the
      // inventor (`invented or perfected their format`), pulling
      // against Survivor's card_tagline's format-as-agent frame.
      // A future refactor that regresses to either shows-as-agent
      // shape (`their format` / `their genre`) trips at unit time.
      expect(tierMeta('S').name).not.toMatch(
        /invented or perfected their format/i,
      )
      expect(tierMeta('S').name).not.toMatch(/their format|their genre/i)
    })
  })
})

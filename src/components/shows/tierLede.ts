import type { ShowTier } from '@/content'
import { TIER_ORDER } from './tierMeta'

// One sentence per tier explaining what a show's membership in that
// tier means. The /shows hero lede renders only the sentences for
// tiers that actually hold a show — and the page body now mirrors
// that contract: empty tier bands are hidden entirely on /shows
// (critique-pass-50 #412 reversed critique-pass-14 #202; the
// <HowTiersMove> legend explains the tier system on its own without
// needing an empty band to refer to). Today no show sits in B, so
// the B sentence is withheld and the B section is absent.
const TIER_LEDE_SENTENCE: Record<ShowTier, string> = {
  S: 'The S tier invented or perfected its format.',
  A: 'The A tier has the deep canon and the years to defend it.',
  B: 'The B tier I’m still working through — every season reviewed before it lands.',
}

export function tierLedeSentences(
  populatedTiers: Iterable<ShowTier>,
): string[] {
  const present = new Set(populatedTiers)
  return TIER_ORDER.filter((tier) => present.has(tier)).map(
    (tier) => TIER_LEDE_SENTENCE[tier],
  )
}

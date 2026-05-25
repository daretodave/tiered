import type { ShowTier } from '@/content'
import { TIER_ORDER } from './tierMeta'

// One descriptor fragment per tier for the /shows SEO description.
// The full sentence is composed at runtime from only the tiers that
// actually carry shows, mirroring TierSection's render gate. A
// description that names B tier when no show sits in B overclaims
// to every crawler + share-link snippet — the SEO copy must track
// the page's rendered content.
const TIER_DESCRIPTION_FRAGMENT: Record<ShowTier, string> = {
  S: 'S tier is format-defining',
  A: 'A tier has the deep canon',
  B: 'B tier is in review',
}

const OPENER = 'Reality-TV canons, sorted by how settled the ranking is.'

export function buildShowsMetaDescription(
  populatedTiers: Iterable<ShowTier>,
): string {
  const present = new Set(populatedTiers)
  const fragments = TIER_ORDER.filter((tier) => present.has(tier)).map(
    (tier) => TIER_DESCRIPTION_FRAGMENT[tier],
  )
  if (fragments.length === 0) return OPENER
  return `${OPENER} ${fragments.join(', ')}.`
}

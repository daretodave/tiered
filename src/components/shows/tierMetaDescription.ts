import type { ShowTier } from '@/content'
import { TIER_ORDER } from './tierMeta'

// One descriptor fragment per tier for the /shows SEO description.
// The full sentence is composed at runtime from only the tiers that
// actually carry shows. Empty tiers still render a placeholder band
// on /shows (critique-pass-14 #202) so the editorial ladder honors
// its legend, but the SEO snippet must not claim a tier has content
// when it does not — that overclaims to every crawler + share-link.
const TIER_DESCRIPTION_FRAGMENT: Record<ShowTier, string> = {
  S: 'S tier is format-defining',
  A: 'A tier has the deep canon',
  B: 'B tier is in review',
}

// critique pass 149: this used to open with the exact same clause as
// ShowsHero's on-page lede ("Reality-TV canons, sorted by how settled
// the ranking feels") — a verbatim duplicate between the meta
// description and the H1/lede a crawler sees on the same page. Reworded
// to cover the same ground (reality-TV canons, sorted by how settled
// the read feels) without repeating the hero's exact wording.
const OPENER = 'tiered.tv ranks reality-TV canons by how settled each one feels.'

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

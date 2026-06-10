import type { ShowTier } from '@/content'

export type TierMeta = {
  tier: ShowTier
  tag: string
  name: string
}

const S: TierMeta = {
  tier: 'S',
  tag: 'Format-defining',
  // critique-pass-46 #389: rotated subhead from shows-as-agent
  // (`The shows that invented or perfected their format.`) to
  // format-as-agent so the band subhead agrees with Survivor's
  // card_tagline (`The format that invented itself in episode
  // one...`) on who-invented-what. The pass-35 #332 vocabulary
  // pin (commit to `format`, not `genre`) still holds — the
  // rotation keeps `format` and avoids `genre`.
  name: 'The shows where the format invented or perfected itself.',
}

const A: TierMeta = {
  tier: 'A',
  tag: 'Deep canon',
  name: 'The shows with enough seasons and craft to defend a real ranking.',
}

const B: TierMeta = {
  tier: 'B',
  tag: 'Recent additions · under review',
  name: 'The canon is in progress. Every season reviewed before it lands.',
}

export function tierMeta(tier: ShowTier): TierMeta {
  if (tier === 'S') return S
  if (tier === 'A') return A
  return B
}

export const TIER_ORDER: readonly ShowTier[] = ['S', 'A', 'B'] as const

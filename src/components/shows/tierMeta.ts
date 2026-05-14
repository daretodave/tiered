import type { ShowTier } from '@/content'

export type TierMeta = {
  tier: ShowTier
  tag: string
  name: string
}

const S: TierMeta = {
  tier: 'S',
  tag: 'Format-defining',
  name: 'The shows that invented or perfected their genre.',
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

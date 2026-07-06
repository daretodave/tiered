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
  // critique-pass-75 #484: the old tag ("Recent additions · under
  // review") framed tier as a function of when a show was added,
  // but `tier` is editorial confidence in the canon order, not
  // recency — and the band renders long-running shows (e.g.
  // Dancing with the Stars, 21 years / 34 seasons) directly under
  // it. "Canon still forming" matches the recency-agnostic `name`
  // framing below instead.
  tag: 'Canon still forming',
  name: 'The canon is in progress. Every season reviewed before it lands.',
}

export function tierMeta(tier: ShowTier): TierMeta {
  if (tier === 'S') return S
  if (tier === 'A') return A
  return B
}

export const TIER_ORDER: readonly ShowTier[] = ['S', 'A', 'B'] as const

import type { Show, ShowTier } from '@/content'

export type GroupedShows = {
  S: Show[]
  A: Show[]
  B: Show[]
}

// Sort heaviest shows first within a tier so the wider tiles read as
// the tier's anchor. Stable on slug for ties.
function bySeasonsDesc(a: Show, b: Show): number {
  if (b.seasons !== a.seasons) return b.seasons - a.seasons
  return a.slug.localeCompare(b.slug)
}

export function groupShowsByTier(shows: readonly Show[]): GroupedShows {
  const out: GroupedShows = { S: [], A: [], B: [] }
  for (const show of shows) {
    out[show.tier].push(show)
  }
  out.S.sort(bySeasonsDesc)
  out.A.sort(bySeasonsDesc)
  out.B.sort(bySeasonsDesc)
  return out
}

export function showsForTier(grouped: GroupedShows, tier: ShowTier): Show[] {
  if (tier === 'S') return grouped.S
  if (tier === 'A') return grouped.A
  return grouped.B
}

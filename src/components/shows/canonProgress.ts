import { getCanon } from '@/content'

// The B-tier "in progress · N / T" pill. T matches the season-floor
// the canon-mode promotion uses (see phase 26 brief). N is the number
// of canon entries currently shipped for the show.
export const CANON_TARGET = 3

export function canonProgress(slug: string, target = CANON_TARGET): {
  shipped: number
  target: number
} {
  const canon = getCanon(slug)
  const shipped = canon?.entries.length ?? 0
  return { shipped, target }
}

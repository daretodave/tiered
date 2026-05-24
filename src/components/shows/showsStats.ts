import type { Show } from '@/content'
import { formatCanonRevisedLabel } from '@/lib/canon/last-revised'

export type ShowsStats = {
  showCount: number
  totalSeasons: number
  lastRevision: string
}

// Reuses the canon-revised formatter so `/shows`, `/`, and per-show
// pages all stamp the recency in the same editorial "Month YYYY" form
// (critique pass 7 caught the MM / YY shape reading as machine output).
export function formatRevision(today: Date): string {
  return formatCanonRevisedLabel(today)
}

export function computeShowsStats(
  shows: readonly Show[],
  today: Date = new Date(),
): ShowsStats {
  const showCount = shows.length
  let totalSeasons = 0
  for (const s of shows) totalSeasons += s.seasons
  return {
    showCount,
    totalSeasons,
    lastRevision: formatRevision(today),
  }
}

import type { Show } from '@/content'

export type ShowsStats = {
  showCount: number
  totalSeasons: number
  lastRevision: string
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

export function formatRevision(today: Date): string {
  const month = today.getUTCMonth() + 1
  const year = today.getUTCFullYear() % 100
  return `${pad2(month)} / ${pad2(year)}`
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

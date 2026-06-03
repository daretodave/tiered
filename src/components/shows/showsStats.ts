import { type Show, getCanon } from '@/content'
import { canonRevisedLabelFromIso } from '@/lib/canon/last-revised'

export type ShowsStats = {
  showCount: number
  totalSeasons: number
  // `null` when no canon in the catalog carries a `last_revised` —
  // ShowsHero hides the stat cell rather than stamping a fake date.
  lastRevision: string | null
}

// Critique pass-27 HIGH (#288): the /shows hero `Last revision` stat
// is sourced from the max `canon.last_revised` ISO across the catalog,
// not from build-time `new Date()`. Mirrors the pass-24 #269 home/show
// fix one surface up — every canon-revised label in the product
// (home, show, /shows, themes) now derives from the same canon
// frontmatter, so the 1st-of-the-month build clock no longer drifts
// the catalog stat past surfaces whose canon hasn't moved. ISO 8601
// `YYYY-MM-DD` strings sort lexicographically the same way they sort
// chronologically, so the max-by-string is the latest revision date.
export function computeShowsStats(
  shows: readonly Show[],
  canonLookup: (slug: string) => { last_revised?: string } | null = getCanon,
): ShowsStats {
  let totalSeasons = 0
  let latestIso: string | null = null
  for (const s of shows) {
    totalSeasons += s.seasons
    const iso = canonLookup(s.slug)?.last_revised
    if (iso && (latestIso === null || iso > latestIso)) latestIso = iso
  }
  return {
    showCount: shows.length,
    totalSeasons,
    lastRevision: canonRevisedLabelFromIso(latestIso ?? undefined),
  }
}

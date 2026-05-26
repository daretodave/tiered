import { canonicalUrls } from './canonical-urls'

// 31a: digit-form season URLs that the season page 308s to its
// canonical slug form (`/shows/<show>/season/<n>` →
// `/shows/<show>/season/<slug>`). One row per show — the smoke
// walker hits each and asserts the redirect status + Location.
//
// We pick one season per show (the lowest-number aired season) so
// the assertion catches the redirect contract without exploding
// fixture size.
//
// The show-prefixed numeric form (`/season/<show>-<n>`) is
// included on the same row (CRITIQUE pass 1, issue #102 —
// readers and external links plausibly construct it from the
// show slug + season number; before this it 404'd). Skipped when
// `<show>-<n>` collides with a real canonical slug (e.g.
// `survivor-46` — the season at number 46 *is* `survivor-46`,
// so there's nothing to redirect).

export type SeasonRedirect = {
  show: string
  fromPath: string
  toPath: string
}

function buildSeasonRedirects(): SeasonRedirect[] {
  const firstByShow = new Map<string, SeasonRedirect>()
  for (const row of canonicalUrls) {
    if (row.pattern !== '/shows/[show]/season/[slug]') continue
    if (!row.show || !row.seasonSlug || row.season == null) continue
    if (firstByShow.has(row.show)) continue
    firstByShow.set(row.show, {
      show: row.show,
      fromPath: `/shows/${row.show}/season/${row.season}`,
      toPath: `/shows/${row.show}/season/${row.seasonSlug}`,
    })
  }
  const digitForm = [...firstByShow.values()].sort((a, b) =>
    a.show.localeCompare(b.show),
  )
  const prefixed: SeasonRedirect[] = []
  for (const r of digitForm) {
    const candidate = `${r.show}-${r.fromPath.split('/').pop()}`
    if (candidate === r.toPath.split('/').pop()) continue
    prefixed.push({
      show: r.show,
      fromPath: `/shows/${r.show}/season/${candidate}`,
      toPath: r.toPath,
    })
  }
  return [...digitForm, ...prefixed]
}

// Legacy season-slug aliases that 308 to their canonical slug
// (e.g. Survivor S20: `heroes-villains` → `heroes-vs-villains`,
// bringing the file in line with the other 4 vs.-named Survivor
// seasons; #185). Inlined from src/lib/season/slug-aliases.ts —
// e2e package intentionally has no @/ alias into src/.
const SEASON_SLUG_ALIASES: Record<string, Record<string, string>> = {
  survivor: { 'heroes-villains': 'heroes-vs-villains' },
}

function buildSlugAliasRedirects(): SeasonRedirect[] {
  const out: SeasonRedirect[] = []
  for (const [show, aliases] of Object.entries(SEASON_SLUG_ALIASES)) {
    for (const [fromSlug, toSlug] of Object.entries(aliases)) {
      out.push({
        show,
        fromPath: `/shows/${show}/season/${fromSlug}`,
        toPath: `/shows/${show}/season/${toSlug}`,
      })
    }
  }
  return out
}

export const seasonRedirects: SeasonRedirect[] = [
  ...buildSeasonRedirects(),
  ...buildSlugAliasRedirects(),
]

// Phase 33: the standalone /canon + /community routes 308 into the
// consolidated show page. One pair of rows per show — the smoke /
// redirect walker asserts the 308 + Location so external links and
// stale bookmarks never 404.
export type RankingRedirect = {
  show: string
  fromPath: string
  toPath: string
}

function buildRankingRedirects(): RankingRedirect[] {
  const shows = new Set<string>()
  for (const row of canonicalUrls) {
    if (row.pattern === '/shows/[show]' && row.show) shows.add(row.show)
  }
  const out: RankingRedirect[] = []
  for (const show of [...shows].sort((a, b) => a.localeCompare(b))) {
    out.push({
      show,
      fromPath: `/shows/${show}/canon`,
      toPath: `/shows/${show}`,
    })
    out.push({
      show,
      fromPath: `/shows/${show}/community`,
      toPath: `/shows/${show}?view=community`,
    })
  }
  return out
}

export const rankingRedirects: RankingRedirect[] = buildRankingRedirects()

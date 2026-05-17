import { canonicalUrls, type CanonicalUrl } from './canonical-urls'

// sample-urls is the content-volume-INDEPENDENT face of the smoke
// walker. A page template does not get more correct because it was
// rendered 2,700 times instead of 30 — so the per-commit gate proves
// every URL *archetype* in a browser, while the exhaustive "every URL
// is wired / nothing 404s" guarantee lives in the millisecond
// route↔content parity test (src/lib/routes.test.ts), not a crawl.
//
// This list stays flat whether content/ holds 13 shows or 513. The
// full catalog crawl is still one env var away: set E2E_FULL=1 (see
// urlsForRun) and the smoke specs walk every canonical URL again —
// that is the nightly / pre-deploy posture, not the hot path.

const isContentRow = (u: CanonicalUrl) =>
  u.pattern === '/shows/[show]' ||
  u.pattern === '/shows/[show]/season/[slug]' ||
  u.pattern === '/themes/[theme]'

// Every non-content URL (the locked static contract: / /shows /themes
// /about /terms /privacy /sign-in /mod, plus /u/[handle] when seeded).
// Small, fixed, never grows — always fully covered.
const staticUrls = canonicalUrls.filter((u) => !isContentRow(u))

const showRows = canonicalUrls
  .filter((u) => u.pattern === '/shows/[show]')
  .sort((a, b) => (a.show ?? '').localeCompare(b.show ?? ''))

function seasonsOf(show: string): CanonicalUrl[] {
  return canonicalUrls
    .filter((u) => u.pattern === '/shows/[show]/season/[slug]' && u.show === show)
    .sort((a, b) => (a.season ?? 0) - (b.season ?? 0))
}

// Pick min by a key with a deterministic alphabetical tiebreak so the
// sample is stable run-to-run regardless of filesystem order.
function pick(rows: CanonicalUrl[], score: (u: CanonicalUrl) => number): CanonicalUrl | null {
  return (
    rows
      .slice()
      .sort((a, b) => score(a) - score(b) || (a.show ?? '').localeCompare(b.show ?? ''))[0] ?? null
  )
}

const mostSeasons = pick(showRows, (u) => -(u.seasonsCount ?? 0))
const fewestSeasons = pick(
  showRows.filter((u) => (u.seasonsCount ?? 0) > 0),
  (u) => u.seasonsCount ?? 0,
)
const midShow = showRows[Math.floor(showRows.length / 2)] ?? null

// Distinct archetype shows: deepest catalog (many-season layout +
// editorial depth), shallowest (graceful collapse), and a middle one
// for plain template variety.
const archetypeShows = [...new Set([mostSeasons, fewestSeasons, midShow].filter(Boolean))] as CanonicalUrl[]

const sampledSeasons: CanonicalUrl[] = []
for (const showRow of archetypeShows) {
  const seasons = seasonsOf(showRow.show ?? '')
  if (seasons.length === 0) continue
  const idx = [0, Math.floor(seasons.length / 2), seasons.length - 1]
  // A multi-token / entity slug (e.g. heroes-villains, winners-at-war)
  // exercises display_title / ampersand rendering — always include one
  // if the deepest show has it.
  const entity = seasons.find((s) => ((s.seasonSlug ?? '').match(/-/g)?.length ?? 0) >= 2)
  const chosen = new Set<number>(idx)
  const picks = [...chosen].map((i) => seasons[i]).filter(Boolean) as CanonicalUrl[]
  if (entity && !picks.includes(entity)) picks.push(entity)
  sampledSeasons.push(...picks)
}

const themeRows = canonicalUrls
  .filter((u) => u.pattern === '/themes/[theme]')
  .sort((a, b) => (a.theme ?? '').localeCompare(b.theme ?? ''))
const sampledThemes = [themeRows[0], themeRows[themeRows.length - 1]].filter(
  (t, i, arr) => t && arr.indexOf(t) === i,
) as CanonicalUrl[]

export const sampleUrls: CanonicalUrl[] = [
  ...staticUrls,
  ...archetypeShows,
  ...sampledSeasons,
  ...sampledThemes,
]

// The single switch the smoke specs use. Default = archetype sample
// (fast, flat). E2E_FULL=1 = exhaustive catalog crawl (nightly /
// pre-deploy / on demand). Nothing is deleted; coverage is reachable.
export function urlsForRun(): CanonicalUrl[] {
  return process.env['E2E_FULL'] === '1' ? canonicalUrls : sampleUrls
}

// The Pantheon launch-show list referenced by `plan/bearings.md`
// "Content velocity & editorial cadence" Rule 1. Source of truth
// in code lives here so the `pnpm content:quota` check computes
// `missing` identically to a human reading bearings.
//
// Ordering matches the bearings enumeration — Survivor first,
// then the US footprint cluster (Amazing Race, Big Brother,
// Bachelor / Bachelorette, Top Chef, Drag Race, Traitors), then
// the international + competition cluster (Love Island US/UK,
// Bake Off, Project Runway, The Challenge).
//
// Bearings prose calls this "12 shows" but the enumerated list
// is 13. The enumerated list is authoritative — `LAUNCH_SHOWS`
// matches the build plan's per-phase show breakdown across
// phases 5, 20, 21, 22.
export const LAUNCH_SHOWS = Object.freeze([
  { slug: 'survivor', name: 'Survivor' },
  { slug: 'amazing-race', name: 'The Amazing Race' },
  { slug: 'big-brother', name: 'Big Brother' },
  { slug: 'bachelor', name: 'The Bachelor' },
  { slug: 'bachelorette', name: 'The Bachelorette' },
  { slug: 'top-chef', name: 'Top Chef' },
  { slug: 'dragrace', name: "RuPaul's Drag Race" },
  { slug: 'traitors', name: 'The Traitors' },
  { slug: 'love-island-us', name: 'Love Island US' },
  { slug: 'love-island-uk', name: 'Love Island UK' },
  { slug: 'bake-off', name: 'The Great British Bake Off' },
  { slug: 'project-runway', name: 'Project Runway' },
  { slug: 'the-challenge', name: 'The Challenge' },
])

export function missingShows(coveredSlugs) {
  const covered = new Set(coveredSlugs)
  return LAUNCH_SHOWS.filter((s) => !covered.has(s.slug))
}

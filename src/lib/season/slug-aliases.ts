// Legacy season-slug aliases. When a season file's filename is
// renamed to match the canonical convention, the old slug stays
// reachable as a 308 to the new one — external links and
// bookmarks survive. Consumed by
// `src/app/shows/[show]/season/[slug]/page.tsx` (runtime redirect)
// and mirrored in
// `apps/e2e/src/fixtures/redirect-fixtures.ts` (e2e 308 contract).
//
// One entry per renamed season, keyed by show slug. The first
// entry (Survivor S20: `heroes-villains` → `heroes-vs-villains`)
// brings the file in line with the other 4 vs.-named Survivor
// seasons (`27-blood-vs-water`, `33-millennials-vs-gen-x`,
// `35-heroes-vs-healers-vs-hustlers`, `37-david-vs-goliath`)
// and closes critique-pass-11 #185.
export const SEASON_SLUG_ALIASES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  survivor: { 'heroes-villains': 'heroes-vs-villains' },
}

export function resolveSeasonSlugAlias(
  show: string,
  slug: string,
): string | null {
  return SEASON_SLUG_ALIASES[show]?.[slug] ?? null
}

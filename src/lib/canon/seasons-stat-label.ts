// The /shows/[show] hero stat eyebrow. The number is always the
// aired-season count (show.seasons); the LABEL is derived from canon
// coverage so the brag can never over-claim. When every aired season
// carries a canon slot the page can honestly say "seasons ranked" —
// matching the /shows index total's catalog-aggregate `Seasons
// ranked` slot. While a canon is mid-drain (fewer entries than aired
// seasons) the honest claim is "seasons aired". /critique pass 15
// caught the home → index → show-page sequence reading RANKED,
// RANKED, AIRED on fully-drained shows; deriving the label removes
// the under-claim without letting a partially-ranked show lie.
//
// Note (pass-44 #379): the home featured tile rotated its own label
// from `Seasons ranked` to `Seasons in canon` to carry per-show
// scope on the home → /shows click path. The show-page hero label
// returned here intentionally stays in the catalog-aggregate
// `Seasons ranked` family — the per-show count rendered in the
// show-page hero is the same fact /shows hero's catalog total is
// summed from, and pass-44 #379 scoped the rotation to the home
// featured tile only.

export function seasonsStatLabel(
  seasonsAired: number,
  canonEntryCount: number,
): string {
  const everyAiredSeasonRanked =
    canonEntryCount > 0 && canonEntryCount >= seasonsAired
  return everyAiredSeasonRanked ? 'seasons ranked' : 'seasons aired'
}

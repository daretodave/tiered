// The /shows/[show] hero stat eyebrow. The number is always the
// aired-season count (show.seasons); the LABEL is derived from canon
// coverage so the brag can never over-claim. When every aired season
// carries a canon slot the page can honestly say "seasons ranked" —
// matching the home featured stamp and the /shows index total, which
// both read "Seasons ranked" on the same data. While a canon is
// mid-drain (fewer entries than aired seasons) the honest claim is
// "seasons aired". /critique pass 15 caught the home → index →
// show-page sequence reading RANKED, RANKED, AIRED on fully-drained
// shows; deriving the label removes the under-claim without letting a
// partially-ranked show lie.

export function seasonsStatLabel(
  seasonsAired: number,
  canonEntryCount: number,
): string {
  const everyAiredSeasonRanked =
    canonEntryCount > 0 && canonEntryCount >= seasonsAired
  return everyAiredSeasonRanked ? 'seasons ranked' : 'seasons aired'
}

// The /shows/[show] hero stat eyebrow. The number is always the
// aired-season count (show.seasons); the LABEL is derived from canon
// coverage so the brag can never over-claim. When every aired season
// carries a canon slot the page can honestly say "seasons in canon" —
// the per-show editorial scope this surface owns. While a canon is
// mid-drain (fewer entries than aired seasons) the honest claim is
// "seasons aired". /critique pass 15 caught the home → index →
// show-page sequence reading RANKED, RANKED, AIRED on fully-drained
// shows; deriving the label removes the under-claim without letting
// a partially-ranked show lie.
//
// Rotation history: pass-44 #379 rotated the home featured tile from
// `Seasons ranked` to `Seasons in canon` to carry per-show scope on
// home → /shows. Pass-45 #380 extended the rotation to this helper
// so per-show hero surfaces align with the home featured tile — same
// fact, same scope, same label across the home → /shows/[show] click
// path. The /shows catalog hero is unchanged and keeps its catalog-
// aggregate `Seasons ranked` slot.

export function seasonsStatLabel(
  seasonsAired: number,
  canonEntryCount: number,
): string {
  const everyAiredSeasonRanked =
    canonEntryCount > 0 && canonEntryCount >= seasonsAired
  return everyAiredSeasonRanked ? 'seasons in canon' : 'seasons aired'
}

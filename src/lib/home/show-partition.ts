// The home page surfaces the whole show catalog in two grids: a 3-up
// featured row and a compact "the rest of the canon" grid below it.
// /critique pass 2 caught the home headline ("N shows tracked") drift
// away from what the page rendered — the compact grid was capped at a
// fixed 6 tiles, so once the catalog outgrew 9 shows the headline
// over-counted and the surplus shows were stranded off the home page
// entirely. The partition below has no cap: `compact` takes every
// non-featured show, so featured.length + compact.length always
// equals the catalog size minus the optionally-excluded slug.
//
// /critique pass 10 (#174) caught the dual-render: the FEATURED hero
// at the top of the page (`getFeaturedShow()`) and the compact tail
// both paint the same show — Survivor renders as "CURRENTLY FEATURED"
// and again 10 tiles down in the "rest of the index" grid. The fix is
// the optional `excludeSlug` arg below: callers pass the featured slug
// so the partition omits it from both grids and the union is unique.
//
// /critique pass 30 (#300) caught the spotlight cut: callers pass an
// alpha-sorted catalog (`getAllShows()` already `slug.localeCompare`s)
// so a bare `.slice(0, 3)` led with the alphabetical-first three
// shows — `The Amazing Race / The Bachelor / The Bachelorette` — and
// demoted the next S-tier flagship (RuPaul's Drag Race, once Survivor
// is excluded as the hero) to the compact tail at the exact moment a
// first-time visitor is forming their tier hierarchy. Mirror of the
// pass-29 footer fix at `src/components/chrome/footer/FooterTiersCol.tsx`
// (54a4170): sort by `TIER_ORDER` rank first (S→0 / A→1 / B→2), with
// `slug.localeCompare` as the in-tier tiebreaker, then slice. Future
// tier graduations flow through automatically.

import type { Show } from '@/content'
import { TIER_ORDER } from '@/components/shows/tierMeta'

export const HOME_FEATURED_TILES = 3

export type HomeShowPartition = {
  featured: Show[]
  compact: Show[]
}

export function partitionHomeShows(
  shows: Show[],
  excludeSlug?: string,
): HomeShowPartition {
  const filtered = excludeSlug
    ? shows.filter((s) => s.slug !== excludeSlug)
    : shows
  const pool = [...filtered].sort((a, b) => {
    const tierDelta = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
    return tierDelta !== 0 ? tierDelta : a.slug.localeCompare(b.slug)
  })
  return {
    featured: pool.slice(0, HOME_FEATURED_TILES),
    compact: pool.slice(HOME_FEATURED_TILES),
  }
}

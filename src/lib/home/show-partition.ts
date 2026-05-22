// The home page surfaces the whole show catalog in two grids: a 3-up
// featured row and a compact "the rest of the canon" grid below it.
// /critique pass 2 caught the home headline ("N shows tracked") drift
// away from what the page rendered — the compact grid was capped at a
// fixed 6 tiles, so once the catalog outgrew 9 shows the headline
// over-counted and the surplus shows were stranded off the home page
// entirely. The partition below has no cap: `compact` takes every
// non-featured show, so featured.length + compact.length always
// equals the catalog size and the headline stays honest.

import type { Show } from '@/content'

export const HOME_FEATURED_TILES = 3

export type HomeShowPartition = {
  featured: Show[]
  compact: Show[]
}

export function partitionHomeShows(shows: Show[]): HomeShowPartition {
  return {
    featured: shows.slice(0, HOME_FEATURED_TILES),
    compact: shows.slice(HOME_FEATURED_TILES),
  }
}

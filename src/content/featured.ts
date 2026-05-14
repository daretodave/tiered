import { getAllShows } from './loaders'
import type { Show } from './schemas'

// The home hero anchors on one show — the "currently featured" cover.
// Source of truth: `featured: true` on the show's frontmatter.
// Exactly one show should carry the flag; if more than one does, the
// first one in slug order wins. If none do, the first show overall
// is used so the home page still renders during early-content gaps.
export function getFeaturedShow(): Show | null {
  const shows = getAllShows()
  if (shows.length === 0) return null
  const flagged = shows.filter((s) => s.featured)
  if (flagged.length > 0) return flagged[0] ?? null
  return shows[0] ?? null
}

export function getFeaturedShowSlug(): string | null {
  return getFeaturedShow()?.slug ?? null
}

import { getAllThemes } from '@/content'
import type { Theme } from '@/content'

// Returns every themed list that has at least one entry pointing
// at the given show. Used by <FeaturedThemes> to render the
// "appears in" cross-links on a show page.

export function themesContainingShow(show: string): Theme[] {
  return getAllThemes().filter((theme) =>
    theme.entries.some((entry) => entry.show === show),
  )
}

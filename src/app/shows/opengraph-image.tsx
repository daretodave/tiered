import { getAllShows } from '@/content'
import {
  TIER_ORDER,
  buildShowsMetaDescription,
  groupShowsByTier,
  showsForTier,
} from '@/components/shows'
import { buildOgImage } from '@/lib/og/template'

export const runtime = 'nodejs'
export const alt = 'tiered.tv — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  const grouped = groupShowsByTier(getAllShows())
  const populatedTiers = TIER_ORDER.filter(
    (tier) => showsForTier(grouped, tier).length > 0,
  )
  return buildOgImage({
    eyebrow: 'tiered.tv · Shows',
    title: 'All shows',
    blurb: buildShowsMetaDescription(populatedTiers),
  })
}

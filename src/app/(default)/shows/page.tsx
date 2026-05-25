import type { Metadata } from 'next'
import { getAllShows } from '@/content'
import {
  HowTiersMove,
  ShowsHero,
  TierSection,
  TIER_ORDER,
  buildShowsMetaDescription,
  computeShowsStats,
  groupShowsByTier,
  showsForTier,
} from '@/components/shows'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  const grouped = groupShowsByTier(getAllShows())
  const populatedTiers = TIER_ORDER.filter(
    (tier) => showsForTier(grouped, tier).length > 0,
  )
  return buildMetadata({
    title: 'All shows',
    description: buildShowsMetaDescription(populatedTiers),
    path: '/shows',
  })
}

export default function ShowsIndexPage() {
  const shows = getAllShows()
  const stats = computeShowsStats(shows)
  const grouped = groupShowsByTier(shows)
  const populatedTiers = TIER_ORDER.filter(
    (tier) => showsForTier(grouped, tier).length > 0,
  )
  const ld = buildJsonLd({
    type: 'CollectionPage',
    name: 'Shows — tiered.tv',
    description:
      'Every show tiered.tv covers, grouped by editorial confidence in the canon.',
    path: '/shows',
  })

  return (
    <div className="shows-tiered" data-testid="shows-tiered">
      <script {...jsonLdScriptProps({ id: 'ld-shows-index', data: ld })} />
      {shows.length === 0 ? (
        <section className="shows-empty">
          <h1 className="shows-hero-title">No shows yet.</h1>
          <p className="shows-hero-lede">
            Shows will appear here as the loop ships them.
          </p>
        </section>
      ) : (
        <>
          <ShowsHero stats={stats} tiers={populatedTiers} />
          {TIER_ORDER.map((tier) => (
            <TierSection
              key={tier}
              tier={tier}
              shows={showsForTier(grouped, tier)}
            />
          ))}
          <HowTiersMove />
        </>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import { getAllShows } from '@/content'
import {
  HowTiersMove,
  ShowsHero,
  TierSection,
  TIER_ORDER,
  computeShowsStats,
  groupShowsByTier,
  showsForTier,
} from '@/components/shows'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'All shows',
    description:
      'Reality-TV canons, sorted by how settled the ranking is. S tier is format-defining, A tier has the deep canon, B tier is in review.',
    path: '/shows',
  })
}

export default function ShowsIndexPage() {
  const shows = getAllShows()
  const stats = computeShowsStats(shows)
  const grouped = groupShowsByTier(shows)
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
          <ShowsHero stats={stats} />
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

import type { Show, Theme } from '@/content'
import { canonRevisedLabelFromIso } from '@/lib/canon/last-revised'
import { FeaturedCard } from './FeaturedCard'

type ListsFeaturedRowProps = {
  featured: Theme[]
  showsByTheme: Record<string, Show[]>
  today?: Date
}

// Latest `last_revised` ISO across rendered featured themes — the
// curator's source-of-truth date for the strip's monthly cadence
// claim. Mirrors the pass-24 #269 closure pattern: derive labels
// from authored ISO data, never build-time `new Date()`, so static
// builds across day/month boundaries can't disagree with themselves.
function latestFeaturedRevised(featured: Theme[]): string | undefined {
  let latest: string | undefined
  for (const t of featured) {
    if (!latest || t.last_revised > latest) latest = t.last_revised
  }
  return latest
}

export function ListsFeaturedRow({
  featured,
  showsByTheme,
  today,
}: ListsFeaturedRowProps) {
  if (featured.length === 0) return null

  const stamp = canonRevisedLabelFromIso(latestFeaturedRevised(featured))
  const subhead = stamp
    ? `Editor-selected · Featured for ${stamp}`
    : 'Editor-selected · refreshed monthly'

  return (
    <section
      className="lists-featured-section"
      data-testid="lists-featured-section"
    >
      <div className="lists-section-head">
        <h2>Featured this month.</h2>
        <span className="lists-section-meta">{subhead}</span>
      </div>
      <div className="lists-featured-row" data-testid="lists-featured-row">
        {featured.map((theme, i) => (
          <FeaturedCard
            key={theme.slug}
            theme={theme}
            shows={showsByTheme[theme.slug] ?? []}
            big={i === 0}
            today={today}
          />
        ))}
      </div>
    </section>
  )
}

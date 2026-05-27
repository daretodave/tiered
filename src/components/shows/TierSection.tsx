import type { Show, ShowTier } from '@/content'
import { TierHead } from './TierHead'
import { ShowsTile, type ShowsTileVariant } from './ShowsTile'
import { canonProgress } from './canonProgress'

type TierSectionProps = {
  tier: ShowTier
  shows: readonly Show[]
}

function gridCols(tier: ShowTier): string {
  if (tier === 'B') return 'shows-grid cols-3'
  return 'shows-grid cols-2'
}

function tileVariant(tier: ShowTier): ShowsTileVariant {
  if (tier === 'S') return 'tall'
  if (tier === 'B') return 'small'
  return 'regular'
}

export function TierSection({ tier, shows }: TierSectionProps) {
  const variant = tileVariant(tier)
  const showStatus = tier === 'B'

  return (
    <section data-testid="tier-section" data-tier={tier}>
      <TierHead tier={tier} count={shows.length} />
      {shows.length === 0 ? (
        <div
          className="tier-empty"
          data-testid="tier-empty"
          data-empty="true"
        >
          Nothing here yet.
        </div>
      ) : (
        <div className={gridCols(tier)} data-testid="shows-grid">
          {shows.map((show) => (
            <ShowsTile
              key={show.slug}
              show={show}
              variant={variant}
              status={showStatus ? canonProgress(show.slug) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  )
}

import type { ShowTier } from '@/content'
import type { ShowsStats } from './showsStats'
import { tierLedeSentences } from './tierLede'

type ShowsHeroProps = {
  stats: ShowsStats
  tiers: readonly ShowTier[]
}

export function ShowsHero({ stats, tiers }: ShowsHeroProps) {
  const ledeSentences = tierLedeSentences(tiers)
  return (
    <header className="shows-hero" data-testid="shows-hero">
      <div className="shows-hero-headline">
        <div className="shows-hero-eyebrow">tiered.tv / Shows</div>
        <h1 className="shows-hero-title">
          All shows.<br />
          <em>Tiered.</em>
        </h1>
      </div>
      <div className="shows-hero-side">
        <p
          className="shows-hero-lede"
          data-testid="shows-hero-lede"
          data-tier-coverage={tiers.join('')}
        >
          Reality-TV canons, sorted not by personal taste but by{' '}
          <b>how settled the ranking is.</b> {ledeSentences.join(' ')}
        </p>
        <div className="shows-hero-stats" data-testid="shows-hero-stats">
          <div className="shows-stat" data-testid="shows-stat-shows">
            <div className="shows-stat-val">{stats.showCount}</div>
            <div className="shows-stat-key">Shows tracked</div>
          </div>
          <div className="shows-stat" data-testid="shows-stat-seasons">
            <div className="shows-stat-val">{stats.totalSeasons}</div>
            <div className="shows-stat-key">Seasons ranked</div>
          </div>
          {stats.lastRevision != null ? (
            <div className="shows-stat" data-testid="shows-stat-revised">
              <div
                className="shows-stat-val"
                data-testid="shows-hero-canon-revised"
              >
                {stats.lastRevision}
              </div>
              <div className="shows-stat-key">Index revised</div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

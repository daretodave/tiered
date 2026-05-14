import type { ShowsStats } from './showsStats'

type ShowsHeroProps = {
  stats: ShowsStats
}

export function ShowsHero({ stats }: ShowsHeroProps) {
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
        <p className="shows-hero-lede">
          Reality-TV canons, sorted not by personal taste but by{' '}
          <b>how settled the ranking is.</b> The S tier invented or perfected
          its format. The A tier has the deep canon and the years to defend
          it. The B tier we&rsquo;re still working through &mdash; every
          season reviewed before it lands.
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
          <div className="shows-stat" data-testid="shows-stat-revised">
            <div className="shows-stat-val">{stats.lastRevision}</div>
            <div className="shows-stat-key">Last revision</div>
          </div>
        </div>
      </div>
    </header>
  )
}

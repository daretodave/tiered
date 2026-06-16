import type { ReactNode } from 'react'

export type ShowHeroStat = {
  value: string | number
  key: string
}

type ShowHeroProps = {
  // Left cover
  title: string
  blurb: string
  // Right meta column
  crumb: ReactNode
  stats?: ShowHeroStat[]
  tagline?: string
  shield?: ReactNode
}

// Phase 19c: two-column hero ported from
// design/tiered.tv · Survivor.html §HERO. Left cover holds the
// breadcrumb + big wordmark + serif italic sub; right meta column
// holds the stats strip, the tagline, and the shield. Crumb moved
// to the cover (above H1) by critique pass-49 fix (issue #426) so
// reading order is crumb → H1 → blurb → stats — uninterrupted hero.

export function ShowHero({
  title,
  blurb,
  crumb,
  stats,
  tagline,
  shield,
}: ShowHeroProps) {
  return (
    <section className="show-hero" data-testid="show-hero" aria-label="show hero">
      <div className="show-hero-cover" data-testid="show-hero-cover">
        <div className="show-hero-crumb">{crumb}</div>
        <h1 className="wordmark">{title}</h1>
        <p className="show-hero-sub">{blurb}</p>
      </div>
      <div className="show-hero-meta">
        {stats && stats.length > 0 ? (
          <div className="show-hero-stats" data-testid="show-hero-stats">
            {stats.map((s) => (
              <div className="stat" key={s.key}>
                <span className="stat-val">{s.value}</span>
                <span className="stat-key">{s.key}</span>
              </div>
            ))}
          </div>
        ) : null}
        {tagline ? (
          <p className="show-hero-line" data-testid="show-hero-tagline">
            {tagline}
          </p>
        ) : null}
        {shield}
      </div>
    </section>
  )
}

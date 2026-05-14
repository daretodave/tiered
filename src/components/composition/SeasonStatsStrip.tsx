// Phase 30: 6-tile stats grid below the season hero. Ported from
// design/tiered.tv · Heroes vs. Villains.html § .stats > .stats-inner.
// A tile collapses when both its value and caption are absent. The
// entire strip hides when fewer than 3 tiles remain populated, so
// non-showcase seasons without much public-record data fall through
// cleanly until phase 26 fills them in.

export type SeasonStat = {
  key: string
  value?: string
  caption?: string
}

type SeasonStatsStripProps = {
  stats: readonly SeasonStat[]
  minVisible?: number
}

export function SeasonStatsStrip({
  stats,
  minVisible = 3,
}: SeasonStatsStripProps) {
  const populated = stats.filter(
    (s) => (s.value && s.value.length > 0) || (s.caption && s.caption.length > 0),
  )
  if (populated.length < minVisible) return null
  return (
    <section
      className="stats"
      data-testid="stats-strip"
      aria-label="Season facts"
    >
      <div className="stats-inner">
        {populated.map((s) => (
          <div className="stat" key={s.key} data-testid="stat-tile">
            <div className="stat-key">{s.key}</div>
            {s.value ? <div className="stat-val">{s.value}</div> : null}
            {s.caption ? <div className="stat-cap">{s.caption}</div> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

// Phase 30: episode-rhythm bar. Ported from
// design/tiered.tv · Heroes vs. Villains.html § .ep-strip. One small
// cell per aired episode, color-mapped to the editor's heat reading
// (cold = subtle, med = primary @ 55%, hot = primary). Returns null
// when heat is absent so the section collapses cleanly on seasons
// the phase-26 drain hasn't reached yet.

type Heat = 'cold' | 'med' | 'hot'

type SeasonEpStripProps = {
  heat: readonly Heat[] | undefined
  caption?: string
}

export function SeasonEpStrip({ heat, caption }: SeasonEpStripProps) {
  if (!heat || heat.length === 0) return null
  return (
    <section
      className="ep-strip"
      data-testid="ep-strip"
      aria-label="Episode rhythm — editor heat per episode"
    >
      <div className="ep-key">Episode heat</div>
      <div
        className="ep-bars"
        role="img"
        aria-label={`Heat per episode, ${heat.length} episodes`}
        data-testid="ep-bars"
        style={{ gridTemplateColumns: `repeat(${heat.length}, 1fr)` }}
      >
        {heat.map((h, i) => (
          <div
            key={i}
            className={`ep-bar ${h}`}
            data-testid="ep-bar"
            data-heat={h}
            title={`Ep ${i + 1}`}
          />
        ))}
      </div>
      {caption ? (
        <div className="ep-foot" data-testid="ep-foot">
          {caption}
        </div>
      ) : null}
    </section>
  )
}

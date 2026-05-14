// Phase 30: pure renderer for the canon scale-track inside SeasonInfoCard.
// Mirrors design/tiered.tv · Heroes vs. Villains.html § .scale-* — a thin
// rule with a primary-colored fill, the rank as a 38px mono number, and
// three marks (#01 / ↑ here / #N) underneath. Fill percentage matches the
// design's `width:14.9%` style for rank=7/47: fill = rank / total.

type RankScaleProps = {
  rank: number
  total: number
  headLabel?: string
  meta?: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function rankFillPercent(rank: number, total: number): number {
  if (!Number.isFinite(rank) || !Number.isFinite(total) || total <= 0) return 0
  const clamped = Math.max(1, Math.min(rank, total))
  return (clamped / total) * 100
}

export function RankScale({
  rank,
  total,
  headLabel = "Editor's Canon",
  meta,
}: RankScaleProps) {
  const pct = rankFillPercent(rank, total)
  const metaText = meta ?? `${total} ${total === 1 ? 'season' : 'seasons'}`
  const lowerThird = rank > total * (2 / 3)
  return (
    <div data-testid="rank-scale">
      <div className="info-row-head">
        <span>{headLabel}</span>
        <span className="meta">{metaText}</span>
      </div>
      <div className="scale-line">
        <span className="scale-rank" data-testid="rank-scale-rank">
          #{pad2(rank)}
        </span>
        <span className="scale-of">of {total}</span>
      </div>
      <div className="scale-track">
        <div
          className="scale-fill"
          data-testid="rank-scale-fill"
          style={{ width: `${pct.toFixed(2)}%` }}
        />
      </div>
      <div className="scale-marks">
        <span>#01</span>
        <span className="here" data-testid="rank-scale-here">
          {lowerThird ? '↓ here' : '↑ here'}
        </span>
        <span>#{pad2(total)}</span>
      </div>
    </div>
  )
}

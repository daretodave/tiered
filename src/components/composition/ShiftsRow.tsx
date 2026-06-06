// Phase 37: section of design/tiered.tv · Survivor.html §SHIFTS.
// The real shifts row reads the live community-rank delta signal
// (phase 35). The surface is omitted entirely while the cross-target
// vote threshold has not cleared — an empty "What changed this
// week." box plus its rule is dead space, so we render nothing.
// Once the cross-target threshold IS clear but no per-season mover
// meets the volume floor (critique-pass-37 HIGH #334), the consumer
// passes `emptyMessage` and the surface renders the heading + a
// single editorial caption instead of cards — preserves the
// surface's promise (live community signal) without publishing
// arithmetic noise as confident ordinal verdicts.

type ShiftsRowProps = {
  // When the shifts pipeline lights up, this slot accepts the
  // rendered shift cards (one per recent rank change).
  cards?: React.ReactNode
  // Editorial caption rendered in place of cards when the live
  // signal is in but every mover is below MOVER_VOTE_FLOOR.
  emptyMessage?: string
}

export function ShiftsRow({ cards, emptyMessage }: ShiftsRowProps) {
  if (!cards && !emptyMessage) return null
  return (
    <section
      className="show-shifts"
      data-testid="shifts-row"
      aria-labelledby="shifts-heading"
    >
      <div className="section-head">
        <h2 id="shifts-heading">What changed this week.</h2>
        <span className="sec-meta">Community rank · Updated Thursday</span>
      </div>
      {cards ? (
        <div className="shifts-row" data-testid="shifts-cards">
          {cards}
        </div>
      ) : (
        <p className="shifts-empty" data-testid="shifts-empty">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}

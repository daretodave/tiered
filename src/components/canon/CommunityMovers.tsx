import type { CommunityMover } from '@/lib/community/live'
import { RankShiftPill } from '@/components/composition/RankShiftPill'

type CommunityMoversProps = {
  movers: CommunityMover[]
}

function padRank(rank: number): string {
  return String(rank).padStart(2, '0')
}

// Phase 35: derived entirely from the snapshot delta (live rank vs.
// the baseline >= 7d snapshot). No editorial copy is invented — a
// mover card shows only what the data says: the pill, the season,
// and the was/now ranks. When nothing has a baseline delta the
// section keeps its honest empty state.
export function CommunityMovers({ movers }: CommunityMoversProps) {
  return (
    <section className="cp-movers" data-testid="community-movers">
      <div className="cp-movers-head">
        <h2>What moved this week.</h2>
        <span className="meta">Top changes · sentiment-tagged</span>
      </div>
      {movers.length === 0 ? (
        <div
          className="cp-movers-empty"
          data-testid="community-movers-empty"
          data-empty="true"
        >
          Movers populate once weekly recomputes start producing deltas. Until
          then, the community rank mirrors the canon and nothing has moved.
        </div>
      ) : (
        <div className="cp-movers-grid" data-testid="community-movers-grid">
          {movers.map((m) => (
            <div
              className="cp-mv-card"
              key={m.season.number}
              data-testid="community-mover"
            >
              <div className="cp-mv-top">
                <RankShiftPill delta={m.delta} sentiment={m.sentiment} />
                <span className="cp-mv-tag">{m.tag}</span>
              </div>
              <div className="cp-mv-title">{m.season.title}</div>
              <div className="cp-mv-ranks">
                <span>
                  was <b>#{padRank(m.prevRank)}</b>
                </span>
                <span>
                  now <b>#{padRank(m.rank)}</b>
                </span>
                <span>Season {m.season.number}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

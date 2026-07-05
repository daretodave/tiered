import type { CommunityRankSource } from '@/lib/community/rank'
import type { CommunityRankRow } from '@/lib/community/ranking'
import { MOVER_VOTE_FLOOR, trendSentiment } from '@/lib/community/live'
import { RankShiftPill } from '@/components/composition/RankShiftPill'

type CommunityRankListProps = {
  entries: CommunityRankRow[]
  showSlug: string
  source: CommunityRankSource
}

function padRank(rank: number): string {
  return String(rank).padStart(2, '0')
}

// A row carries decisive vote data only when at least one weighted
// vote produced an approval share. Below that we render the honest
// em-dash placeholders (always-working rule — the canon-mirror order
// still shows, just without invented counters).
function hasVoteData(entry: CommunityRankRow): boolean {
  return entry.voteCount > 0 && entry.approval != null
}

export function CommunityRankList({
  entries,
  showSlug,
  source,
}: CommunityRankListProps) {
  const live = source === 'votes'
  return (
    <div
      className="cp-community-list"
      data-testid="community-rank-list"
      data-source={source}
    >
      <div className="cp-community-list-head">
        <h2>The full ranking.</h2>
        <span className="meta">
          {live
            ? 'Updated Thursdays · approval %'
            : 'No community votes yet — list mirrors the editor canon.'}
        </span>
      </div>
      <div className="cp-cl-cols" data-testid="community-rank-cols">
        <span>Rank</span>
        <span>Season</span>
        <span className="col-bar">Approval</span>
        <span className="col-pct col-r">%</span>
        <span className="col-trend col-r">7d</span>
        <span className="col-r">Votes</span>
      </div>
      <div className="cp-cl-rows" data-testid="community-rank-rows">
        {entries.map((entry) => {
          const voted = hasVoteData(entry)
          const pct =
            entry.approval == null ? null : Math.round(entry.approval * 100)
          return (
            <a
              key={entry.season.number}
              className="cp-cl-row"
              href={`/shows/${showSlug}/season/${entry.season.slug}`}
              data-testid="community-rank-row"
              data-rank={entry.rank}
            >
              <div className="cp-clr-rank">{padRank(entry.rank)}</div>
              <div className="cp-clr-title">
                {entry.season.title}
                <span className="sub">{entry.tag}</span>
              </div>
              <div
                className="cp-clr-bar"
                data-empty={voted && pct != null ? 'false' : 'true'}
              >
                <div className="cp-clr-bar-track">
                  {voted && pct != null ? (
                    <div
                      className="cp-clr-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  ) : null}
                </div>
              </div>
              {voted && pct != null ? (
                <div className="cp-clr-pct">{pct}%</div>
              ) : (
                <div className="cp-clr-pct cp-cl-cell--empty" aria-hidden="true">
                  —
                </div>
              )}
              {entry.trend != null &&
              entry.trend !== 0 &&
              entry.voteCount >= MOVER_VOTE_FLOOR ? (
                <RankShiftPill
                  className="cp-clr-trend-pill"
                  delta={entry.trend}
                  sentiment={trendSentiment(entry.trend)}
                />
              ) : (
                <div
                  className="cp-clr-trend cp-cl-cell--empty"
                  aria-hidden="true"
                >
                  —
                </div>
              )}
              {voted ? (
                <div className="cp-clr-votes">
                  {entry.voteCount.toLocaleString()}
                </div>
              ) : (
                <div
                  className="cp-clr-votes cp-cl-cell--empty"
                  aria-hidden="true"
                >
                  —
                </div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

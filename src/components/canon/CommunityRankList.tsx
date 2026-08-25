import { sourceBannerCopy, type CommunityRankSource } from '@/lib/community/rank'
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
      id="community-rank-list"
      className="cp-community-list"
      data-testid="community-rank-list"
      data-source={source}
    >
      <div className="cp-community-list-head">
        <h2>The full ranking.</h2>
        <span className="meta">
          {live ? 'Updated Thursdays · approval %' : sourceBannerCopy(source)}
        </span>
      </div>
      <div className="cp-cl-cols" data-testid="community-rank-cols">
        <span>Rank</span>
        <span>Season</span>
        <span className="col-bar">
          Approval
          {!live ? <span className="col-bar-note"> (canon order)</span> : null}
        </span>
        <span className="col-pct col-r">
          <span className="col-pct-mobile-label">Appr. </span>%
        </span>
        <span
          className="col-trend col-r"
          title="Populates after the first weekly update — until then every row shows an em-dash, not a stalled counter."
          aria-label="7 day trend. Populates after the first weekly update — until then every row shows an em-dash, not a stalled counter."
        >
          7d
        </span>
        <span className="col-r">Votes</span>
      </div>
      <div className="cp-cl-rows" data-testid="community-rank-rows">
        {entries.map((entry) => {
          const voted = hasVoteData(entry)
          // A season with zero decisive votes has a defined approval
          // (0%) and vote count (0) — the same honest-zero convention
          // VotePair uses ("0 votes so far"). Only the trend column has
          // no zero-vote analog (no baseline delta is computable), so
          // it alone keeps the em-dash placeholder (critique pass-117/118).
          const pct =
            entry.approval == null ? 0 : Math.round(entry.approval * 100)
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
              <div className="cp-clr-bar" data-empty={voted ? 'false' : 'true'}>
                <div className="cp-clr-bar-track">
                  {voted ? (
                    <div
                      className="cp-clr-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  ) : null}
                </div>
              </div>
              <div
                className={
                  voted ? 'cp-clr-pct' : 'cp-clr-pct cp-cl-cell--empty'
                }
              >
                {pct}%
              </div>
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
              <div
                className={
                  voted ? 'cp-clr-votes' : 'cp-clr-votes cp-cl-cell--empty'
                }
              >
                {entry.voteCount.toLocaleString()}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

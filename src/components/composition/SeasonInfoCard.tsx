import type { ReactNode } from 'react'
import { RankScale } from './RankScale'

// Phase 30: sticky four-row info card that rides the hero's right rail.
// Ported from design/tiered.tv · Heroes vs. Villains.html § .info-card.
// Rows that have no data (e.g., community rank when voting hasn't
// landed yet) collapse so the card stays honest on non-showcase
// seasons.

type SeasonInfoCardProps = {
  // Editor's canon scale row
  canonRank: number | null
  canonTotal: number
  canonMeta?: string
  // Community row
  communityRank?: number | null
  communityCount?: number | null
  communityShift?: string | null
  communityCaption?: string | null
  // Vote row
  voteQuestion: string
  voteHelp?: string
  voteSlot: ReactNode
  // Replaces the static "Your vote / change within 72h" head with
  // a viewer-state-aware version (anon / no-vote / voted). Season
  // pages pass <VoteRowHead>; non-season call sites omit it and
  // keep the static fallback. Closes #177.
  voteRowHead?: ReactNode
  // Shield row
  shieldLines?: readonly string[]
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function fmtCount(n: number): string {
  return n.toLocaleString()
}

export function SeasonInfoCard({
  canonRank,
  canonTotal,
  canonMeta,
  communityRank,
  communityCount,
  communityShift,
  communityCaption,
  voteQuestion,
  voteHelp = 'one vote per reader. community rank recomputes weekly.',
  voteSlot,
  voteRowHead,
  shieldLines = [
    'No spoilers — reviewed by an editor',
    'Watch order — start here, no prerequisites',
  ],
}: SeasonInfoCardProps) {
  const showCommunity =
    typeof communityRank === 'number' || typeof communityCount === 'number'
  return (
    <aside
      className="info-card"
      data-testid="info-card"
      aria-label="Rank and vote"
    >
      {canonRank != null ? (
        <div className="info-row" data-testid="info-row-canon">
          <RankScale rank={canonRank} total={canonTotal} meta={canonMeta} />
        </div>
      ) : (
        <div className="info-row" data-testid="info-row-canon">
          <div className="info-row-head">
            <span>Editor's Canon</span>
            <span className="meta">{canonTotal} seasons</span>
          </div>
          <div className="scale-line">
            <span className="scale-rank" data-testid="rank-scale-rank">
              —
            </span>
            <span className="scale-of">not yet ranked</span>
          </div>
        </div>
      )}

      {showCommunity ? (
        <div className="info-row" data-testid="info-row-community">
          <div className="info-row-head">
            <span>Community rank</span>
            <span className="meta">
              {typeof communityCount === 'number'
                ? `${fmtCount(communityCount)} ${communityCount === 1 ? 'vote' : 'votes'}`
                : ''}
            </span>
          </div>
          <div className="community-line">
            <span className="community-num">
              {typeof communityRank === 'number' ? `#${pad2(communityRank)}` : '—'}
            </span>
            {communityShift ? (
              <span className="community-pill" data-testid="community-shift">
                {communityShift}
              </span>
            ) : null}
          </div>
          {communityCaption ? (
            <div className="community-cap">{communityCaption}</div>
          ) : null}
        </div>
      ) : null}

      <div className="info-row" data-testid="info-row-vote">
        {voteRowHead ?? (
          <div className="info-row-head">
            <span>Your vote</span>
            <span className="meta">change within 72h</span>
          </div>
        )}
        <p className="vote-q">{voteQuestion}</p>
        {voteSlot}
        <div className="vote-help">{voteHelp}</div>
      </div>

      <div className="info-row" data-testid="info-row-shield">
        <div className="shield-stack">
          {shieldLines.map((line, i) => (
            <div
              key={i}
              className={`line${i === 1 ? ' warm' : ''}`}
              data-testid="shield-line"
            >
              <span className="dot" aria-hidden="true">
                ●
              </span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

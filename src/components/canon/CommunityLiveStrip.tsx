import type { CommunityRankSource } from '@/lib/community/rank'
import { NEXT_RECOMPUTE_LABEL, formatLastRecompute } from '@/lib/community/live'

type CommunityLiveStripProps = {
  source: CommunityRankSource
  lastRecomputeAt: string | null
  votersThisWeek: number
  version: number | null
}

// Phase 35: every value here is Supabase-derived (the snapshot
// timestamp + id, the trailing-7d distinct voter count). Below the
// vote threshold the strip stays honest — "votes pending" rather
// than an invented number. The raw snapshot-row id (`version`) is
// carried as `data-version` for tests only, never shown as copy —
// it's a DB row id, not a meaningful week/vote-cycle count.
//
// CRITIQUE pass 139 MED, widened at pass 142: a "voters, last 7
// days · 0" reading sits directly above a table whose rows already
// carry nonzero historical vote totals — without a clause
// distinguishing "no new votes this week" from "the totals below
// are stale," a returning reader can't tell the two apart. The
// ambiguity only exists once `lastRecomputeAt` is non-null (a real
// timestamp reads as "live"); `formatLastRecompute(null)`'s "votes
// pending" is already honest on its own and needs no extra clause.
// Pass 139 gated this on `source === 'votes'`, but `lastRecomputeAt`
// is sourced independently from the most recent `rank_snapshots`
// row and can be non-null even once a show has dropped to
// canon-mirroring status — so the clause fires on the
// timestamp+zero combination, not the source label.
export function CommunityLiveStrip({
  source,
  lastRecomputeAt,
  votersThisWeek,
  version,
}: CommunityLiveStripProps) {
  const status =
    source === 'canon'
      ? 'mirroring the canon'
      : source === 'seasons'
        ? 'air order'
        : 'live votes'
  return (
    <div
      className="cp-live-strip"
      data-testid="community-live-strip"
      data-source={source}
      data-version={version ?? undefined}
    >
      <div className="cp-live-left">
        <span>
          <span className="cp-live-dot" />
          last update · <b>{formatLastRecompute(lastRecomputeAt)}</b>
        </span>
        <span>
          next update · <b>{NEXT_RECOMPUTE_LABEL}</b>
        </span>
        <span>
          voters, last 7 days · <b>{votersThisWeek.toLocaleString()}</b>
          {votersThisWeek === 0 && lastRecomputeAt != null
            ? ' (no new votes since last update)'
            : null}
        </span>
        <span>
          status · <b>{status}</b>
        </span>
      </div>
      <div className="cp-live-right">
        <b>open</b> to anyone
      </div>
    </div>
  )
}

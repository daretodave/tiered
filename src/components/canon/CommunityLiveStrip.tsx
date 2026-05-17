import type { CommunityRankSource } from '@/lib/community/rank'
import {
  NEXT_RECOMPUTE_LABEL,
  formatLastRecompute,
  formatVersion,
} from '@/lib/community/live'

type CommunityLiveStripProps = {
  source: CommunityRankSource
  lastRecomputeAt: string | null
  votersThisWeek: number
  version: number | null
}

// Phase 35: every value here is Supabase-derived (the snapshot
// timestamp + id, the trailing-7d distinct voter count). Below the
// vote threshold the strip stays honest — "votes pending" / "pending"
// rather than an invented number.
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
    >
      <div className="cp-live-left">
        <span>
          <span className="cp-live-dot" />
          live
        </span>
        <span>
          last recompute · <b>{formatLastRecompute(lastRecomputeAt)}</b>
        </span>
        <span>
          next recompute · <b>{NEXT_RECOMPUTE_LABEL}</b>
        </span>
        <span>
          voters this week · <b>{votersThisWeek.toLocaleString()}</b>
        </span>
        <span>
          status · <b>{status}</b>
        </span>
      </div>
      <div className="cp-live-right">
        <b>{formatVersion(version)}</b> · <b>open</b> to anyone
      </div>
    </div>
  )
}

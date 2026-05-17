import type { CanonFile, Season, Show } from '@/content'
import { serviceRoleClient } from '@/lib/supabase/server'
import {
  type CommunityRankSource,
  computeCommunityRank,
} from './rank'

// Phase 35 — the read half of the vote system.
//
// `computeCommunityRank` (rank.ts) is the always-working
// canon-mirror: pure, sync, no DB. This module adds the live
// vote-derived ranking on top. Below the vote threshold the
// canon-mirror still serves verbatim (always-working rule); the
// `source` discriminator is what the live-strip / intro copy
// keys off, and `'votes'` is finally reachable.
//
// Every counter here is Supabase-derived. The DB boundary is a
// thin wrapper (`getCommunityRanking`); all the ordering / trend
// math lives in the pure `buildLiveRanking` below so it is unit
// tested without a database.

// A show flips from canon-mirror to live order once it clears
// this many distinct voters. Below it the canon order is
// authoritative (a handful of votes shouldn't reorder editorial
// judgement) but per-season counters still surface.
export const VOTE_THRESHOLD = 5

export type VoteAggregateRow = {
  seasonNumber: number
  score: number
  approval: number | null
  voteCount: number
  rank: number
}

export type SnapshotRow = {
  seasonNumber: number
  rank: number
}

export type CommunityRankRow = {
  rank: number
  season: Season
  tag: string
  score: number
  // 0..1 weighted share of keep/raise votes, or null when no
  // decisive votes exist for the season yet.
  approval: number | null
  voteCount: number
  // Rank delta vs. the baseline snapshot (>= 7 days old).
  // Positive = climbed, negative = fell, null = no baseline /
  // not present in the baseline.
  trend: number | null
}

export type LiveCommunityRanking = {
  entries: CommunityRankRow[]
  source: CommunityRankSource
  votersThisWeek: number
  lastRecomputeAt: string | null
  // Snapshot id of the baseline used for trend; null when no
  // qualifying snapshot exists.
  version: number | null
}

function tagForSeason(season: Season, show: Show): string {
  if (season.premiere_date) {
    return new Date(season.premiere_date).getUTCFullYear().toString()
  }
  return `Season ${season.number} · ${show.name}`
}

// Pure: given the raw vote aggregate, the canon-mirror order, and
// the baseline snapshot, produce the live ranking. No DB, no clock
// beyond what's passed in.
export function buildLiveRanking(args: {
  show: Show
  seasons: Season[]
  canon: CanonFile | null
  rows: VoteAggregateRow[]
  votersThisWeek: number
  baseline: SnapshotRow[]
  lastRecomputeAt: string | null
  version: number | null
}): LiveCommunityRanking {
  const { show, seasons, canon, rows, votersThisWeek, baseline } = args

  const mirror = computeCommunityRank(show, seasons, canon)
  const seasonByNumber = new Map<number, Season>()
  for (const s of seasons) seasonByNumber.set(s.number, s)

  const aggBySeason = new Map<number, VoteAggregateRow>()
  for (const r of rows) aggBySeason.set(r.seasonNumber, r)

  const baselineRankBySeason = new Map<number, number>()
  for (const b of baseline) baselineRankBySeason.set(b.seasonNumber, b.rank)

  const distinctVoters = new Set<number>()
  for (const r of rows) if (r.voteCount > 0) distinctVoters.add(r.seasonNumber)
  // votersThisWeek is the authoritative cross-target distinct count;
  // the per-season fallback only matters when the trailing-7d query
  // is unavailable. Threshold reads the stronger signal.
  const overThreshold = votersThisWeek >= VOTE_THRESHOLD

  const decorate = (
    season: Season,
    rank: number,
  ): CommunityRankRow => {
    const agg = aggBySeason.get(season.number)
    const baseRank = baselineRankBySeason.get(season.number)
    return {
      rank,
      season,
      tag: tagForSeason(season, show),
      score: agg ? agg.score : 0,
      approval: agg ? agg.approval : null,
      voteCount: agg ? agg.voteCount : 0,
      // baseline rank minus current rank: a smaller number is a
      // better slot, so falling rank-number = climbed = positive.
      trend: baseRank == null ? null : baseRank - rank,
    }
  }

  if (!overThreshold || rows.length === 0) {
    // Canon-mirror order, but still annotate with whatever vote
    // data exists so the per-row counters are honest.
    return {
      entries: mirror.entries.map((e) => decorate(e.season, e.rank)),
      source: mirror.source,
      votersThisWeek,
      lastRecomputeAt: args.lastRecomputeAt,
      version: args.version,
    }
  }

  // Live order: RPC rank first, then any season with no votes yet
  // appended in canon-mirror order (always-working — every season
  // renders even pre-vote).
  const ordered = [...rows].sort((a, b) => a.rank - b.rank)
  const placed = new Set<number>()
  const entries: CommunityRankRow[] = []
  for (const r of ordered) {
    const season = seasonByNumber.get(r.seasonNumber)
    if (!season || placed.has(r.seasonNumber)) continue
    placed.add(r.seasonNumber)
    entries.push(decorate(season, entries.length + 1))
  }
  for (const e of mirror.entries) {
    if (placed.has(e.season.number)) continue
    placed.add(e.season.number)
    entries.push(decorate(e.season, entries.length + 1))
  }

  return {
    entries,
    source: 'votes',
    votersThisWeek,
    lastRecomputeAt: args.lastRecomputeAt,
    version: args.version,
  }
}

// DB boundary. Reads the live aggregate (compute_weighted_rank),
// the trailing-7d distinct-voter count, and the baseline snapshot
// (>= 7 days old) for trend, then delegates to the pure builder.
// Any Supabase failure degrades to the canon-mirror — the page
// must always render.
export async function getCommunityRanking(
  show: Show,
  seasons: Season[],
  canon: CanonFile | null,
): Promise<LiveCommunityRanking> {
  try {
    const client = serviceRoleClient()

    const { data: rankData, error: rankErr } = await client.rpc(
      'compute_weighted_rank',
      { p_show: show.slug },
    )
    if (rankErr) throw new Error(rankErr.message)

    const rows: VoteAggregateRow[] = (rankData ?? []).map(
      (r: Record<string, unknown>) => ({
        seasonNumber: Number(r['season_number']),
        score: Number(r['score']),
        approval: r['approval'] == null ? null : Number(r['approval']),
        voteCount: Number(r['vote_count']),
        rank: Number(r['rank']),
      }),
    )

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: voterData } = await client
      .from('votes')
      .select('session_id, target_id, value, created_at')
      .eq('target_type', 'season')
      .like('target_id', `${show.slug}:%`)
      .gt('created_at', weekAgo)
      .neq('value', 0)
    const voters = new Set<string>()
    for (const v of voterData ?? []) {
      const tid = String((v as Record<string, unknown>)['target_id'] ?? '')
      const parts = tid.split(':')
      // canonical two-segment form only
      if (parts.length === 2 && /^\d+$/.test(parts[1] ?? '')) {
        voters.add(String((v as Record<string, unknown>)['session_id']))
      }
    }

    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString()
    const { data: snapData } = await client
      .from('rank_snapshots')
      .select('id, season_number, rank, snapshot_at')
      .eq('show', show.slug)
      .lte('snapshot_at', sevenDaysAgo)
      .order('snapshot_at', { ascending: false })
      .limit(200)

    let baseline: SnapshotRow[] = []
    let version: number | null = null
    if (snapData && snapData.length > 0) {
      const newestAt = String(
        (snapData[0] as Record<string, unknown>)['snapshot_at'],
      )
      baseline = snapData
        .filter(
          (s) =>
            String((s as Record<string, unknown>)['snapshot_at']) === newestAt,
        )
        .map((s) => ({
          seasonNumber: Number((s as Record<string, unknown>)['season_number']),
          rank: Number((s as Record<string, unknown>)['rank']),
        }))
      version = Number((snapData[0] as Record<string, unknown>)['id'])
    }

    const { data: latestSnap } = await client
      .from('rank_snapshots')
      .select('snapshot_at')
      .eq('show', show.slug)
      .order('snapshot_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const lastRecomputeAt = latestSnap
      ? String((latestSnap as Record<string, unknown>)['snapshot_at'])
      : null

    return buildLiveRanking({
      show,
      seasons,
      canon,
      rows,
      votersThisWeek: voters.size,
      baseline,
      lastRecomputeAt,
      version,
    })
  } catch {
    // Always-working: any DB failure falls back to the pure
    // canon-mirror with empty counters.
    const mirror = computeCommunityRank(show, seasons, canon)
    return {
      entries: mirror.entries.map((e) => ({
        rank: e.rank,
        season: e.season,
        tag: e.tag,
        score: 0,
        approval: null,
        voteCount: 0,
        trend: null,
      })),
      source: mirror.source,
      votersThisWeek: 0,
      lastRecomputeAt: null,
      version: null,
    }
  }
}

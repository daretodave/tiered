import type { Season } from '@/content'
import type { RankSentiment } from '@/components/composition/RankShiftPill'
import type { CommunityRankRow } from './ranking'

// Phase 35 stage 3 — presentation helpers for the live community
// surfaces. Pure, no DB, no React. Every counter the live-strip /
// movers / RankShiftPill renders flows through these so the math is
// unit-tested without a database.

// trend is the snapshot delta: baseline rank minus current rank, so
// a positive number means the season climbed (better slot).
export function trendSentiment(trend: number | null): RankSentiment {
  if (trend == null || trend === 0) return 'hold'
  return trend > 0 ? 'warm-up' : 'warm-down'
}

export type CommunityMover = {
  season: Season
  tag: string
  rank: number
  prevRank: number
  delta: number
  sentiment: RankSentiment
  // The season's trailing-7d vote count. Surfaced on the shift card
  // (critique-pass-27 MED) so a 36-spot swing on 12 votes reads
  // distinctly from a 5-spot swing on 487 votes — the magnitude is
  // honest if grounded in volume. Optional only to keep the older
  // test fixtures (which predate the field) compiling; pickMovers
  // always populates it from CommunityRankRow.voteCount.
  voteCount?: number
}

// Low-N noise floor for the mover ticker. Pass-37 HIGH (#334) found
// pickMovers surfacing 5- to 36-spot swings each driven by one or
// two ballots on /shows/survivor — arithmetic artifacts of a thin
// pool, not signal. A peer doesn't publish a 36-spot weekly slide
// on one accounted vote and call it "Plain. Restless. Honest." The
// floor is volume, not direction: ≥ 5 distinct voters before a
// season can appear in the COMMUNITY RANK · UPDATED THURSDAY rail.
// Tunable; the initial value matches the threshold the critique
// row named. Replaces the pass-33 `voteCount > 0` floor — that
// floor caught the recompute-artifact case but admitted single-
// ballot movers as confident ordinal verdicts.
export const MOVER_VOTE_FLOOR = 5

// The biggest absolute movers since the baseline snapshot, climbers
// and fallers alike, strongest move first; ties broken by current
// (better) rank. Holds and seasons absent from the baseline are
// excluded — they did not move. Sub-floor rows are also excluded
// (critique-pass-37 HIGH #334, supersedes pass-33 HIGH #316): a
// 5- to 36-spot weekly swing on 1–2 ballots is an arithmetic
// artifact of a thin vote pool, not a community-driven shift; the
// floor lives at the picker (where the canon-vs-community decision
// is made), not in the consumer.
export function pickMovers(
  entries: CommunityRankRow[],
  limit = 4,
): CommunityMover[] {
  const moved = entries.filter(
    (e) =>
      e.trend != null &&
      e.trend !== 0 &&
      e.voteCount >= MOVER_VOTE_FLOOR,
  )
  moved.sort((a, b) => {
    const da = Math.abs(a.trend as number)
    const db = Math.abs(b.trend as number)
    if (db !== da) return db - da
    return a.rank - b.rank
  })
  return moved.slice(0, limit).map((e) => {
    const delta = e.trend as number
    return {
      season: e.season,
      tag: e.tag,
      rank: e.rank,
      // trend = prevRank - rank  =>  prevRank = rank + trend
      prevRank: e.rank + delta,
      delta,
      sentiment: trendSentiment(delta),
      voteCount: e.voteCount,
    }
  })
}

// The recompute cadence is weekly (Thursday 9pm ET, v1 contract), so
// a move measured against the >= 7d baseline snapshot is, by
// construction, "this week's" change. This label is the contract,
// not a computed countdown — the same honesty posture as
// NEXT_RECOMPUTE_LABEL below.
export const SHIFT_TIME_LABEL = 'this week'

// The shift-card note. Strictly data-derived from the snapshot delta
// — no invented editorial copy (same posture as CommunityMovers).
// pickMovers only ever yields nonzero-delta movers, so there is no
// "held" branch here. When the mover carries a trailing-7d voteCount
// (critique-pass-27 MED), append it after the cadence beat so a
// 36-spot swing on 12 votes reads distinctly from a 5-spot swing on
// 487 votes — the magnitude is honest if grounded in volume.
export function moverNote(mover: CommunityMover): string {
  const n = Math.abs(mover.delta)
  const spots = n === 1 ? 'one spot' : `${n} spots`
  const verb = mover.delta > 0 ? 'Climbed' : 'Slid'
  if (mover.voteCount == null) {
    return `${verb} ${spots} since the last weekly update.`
  }
  const v = mover.voteCount
  const votes = v === 1 ? '1 vote' : `${v} votes`
  return `${verb} ${spots} since the last weekly update · ${votes}`
}

// "2h 14m ago" relative label for the last recompute timestamp.
// Null timestamp = no snapshot has ever been written.
export function formatLastRecompute(
  iso: string | null,
  now: Date = new Date(),
): string {
  if (!iso) return 'votes pending'
  const then = new Date(iso)
  const ms = now.getTime() - then.getTime()
  if (Number.isNaN(ms) || ms < 0) return 'just now'
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  if (hrs < 24) return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return days === 1 ? '1d ago' : `${days}d ago`
}

// The recompute cadence is the v1 contract (Thursday 9pm ET, Vercel
// Cron). The next-recompute label is the cadence, not a computed
// countdown — "fresh within the cadence" per the phase brief.
// RECOMPUTE_DAY is the single source for both the live-strip's
// next-recompute label and the weekly-question close affordance, so
// the cadence is stated in exactly one place.
export const RECOMPUTE_DAY = 'Thursday'
export const NEXT_RECOMPUTE_LABEL = `${RECOMPUTE_DAY} 9pm ET`

// The weekly-question card's meta line. The tally is the trailing-7d
// distinct voter count (the same authoritative number the live-strip
// shows) — the votes that feed the next recompute. Below the vote
// threshold (no voters this week) there is no fabricated count, just
// the honest close affordance — same posture as CommunityLiveStrip's
// "votes pending". Mirrors the design's "3,214 voted · closes
// Thursday".
export function weeklyQuestionMeta(votersThisWeek: number): string {
  const closes = `closes ${RECOMPUTE_DAY}`
  if (votersThisWeek <= 0) return `votes pending · ${closes}`
  return `${votersThisWeek.toLocaleString()} voted · ${closes}`
}

// The Tier-S canon he-aside community mini-pill cross-references the
// live community ranking (phase 35 stage 3). When real votes are in
// (`source === 'votes'`) and the season is in the live ranking, the
// pill reflects the live rank + snapshot trend. Below the threshold
// the static `community_rank_hint` frontmatter is the always-working
// fallback (returns null when absent → the pill is omitted). The
// return shape matches CommunityRankHint so the renderer is unchanged.
export type CommunitySignal = {
  rank: number
  delta: number
  sentiment: 'up' | 'down' | 'hold'
}

export function communitySignalForSeason(
  seasonNumber: number,
  entries: CommunityRankRow[],
  source: 'votes' | 'canon' | 'seasons',
  fallback: CommunitySignal | null | undefined,
): CommunitySignal | null {
  if (source === 'votes') {
    const row = entries.find((e) => e.season.number === seasonNumber)
    if (row) {
      const delta = row.trend ?? 0
      return {
        rank: row.rank,
        delta,
        sentiment: delta > 0 ? 'up' : delta < 0 ? 'down' : 'hold',
      }
    }
  }
  return fallback ?? null
}

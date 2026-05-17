import { NextResponse } from 'next/server'
import { getAllSeasons, getCanon, getShow } from '@/content'
import { getCommunityRanking } from '@/lib/community/ranking'

// Phase 35 — the contracted aggregate. Sits in the locked URL
// contract (bearings.md / spec.md): "GET /api/ranking/[show] —
// cached aggregate, served via ISR". Building it is contract
// fulfilment, not a change.
//
// Solution-shape decision (data admin, per the phase brief's
// "be bold" mandate): the route is DYNAMIC, not ISR-cached.
// compute_weighted_rank is a cheap indexed SUM over
// votes_target_idx — not a hot recompute — and the load-bearing
// acceptance criterion is "vote -> refresh shows the true
// persisted net" (closing the user-reported "refresh always
// shows 0" bug, which IS a staleness bug). A 15-minute ISR
// window reintroduces exactly that staleness. The "cached
// aggregate" layer the contract describes is delivered by the
// snapshot history (rank_snapshots) the weekly recompute
// materializes for trend/movers; the live read stays fresh. ISR
// at the *page* layer (segment revalidate / client fetch) is
// Stage 3's call.

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ show: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { show: slug } = await ctx.params
  const show = getShow(slug)
  if (!show) {
    return NextResponse.json({ ok: false, error: 'unknown_show' }, { status: 404 })
  }

  const seasons = getAllSeasons(show.slug)
  const canon = getCanon(show.slug)
  const ranking = await getCommunityRanking(show, seasons, canon)

  return NextResponse.json({
    ok: true,
    show: show.slug,
    source: ranking.source,
    votersThisWeek: ranking.votersThisWeek,
    lastRecomputeAt: ranking.lastRecomputeAt,
    version: ranking.version,
    generatedAt: new Date().toISOString(),
    entries: ranking.entries.map((e) => ({
      rank: e.rank,
      seasonNumber: e.season.number,
      seasonSlug: e.season.slug,
      title: e.season.title,
      tag: e.tag,
      score: e.score,
      approval: e.approval,
      voteCount: e.voteCount,
      trend: e.trend,
    })),
  })
}

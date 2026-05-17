import { NextResponse } from 'next/server'
import { serviceRoleClient } from '@/lib/supabase/server'

// Phase 35 — scheduled recompute entry point.
//
// The design says community rankings are "Recomputed every
// Thursday 9pm ET". pg_cron is intentionally not used (not
// reliably present on the hermetic local Supabase the e2e gate
// boots). Instead a Vercel Cron (see vercel.json) hits this route
// on a weekly schedule; it calls the recompute_rankings() RPC
// (SECURITY DEFINER, service-role) which snapshots the current
// ranking into rank_snapshots. Trend / movers / RankShiftPill all
// derive from comparing the live aggregate to those snapshots.
//
// Guard: when CRON_SECRET is set (production — Vercel injects it
// as `Authorization: Bearer <CRON_SECRET>` on cron invocations),
// the bearer must match. When it is unset (local dev + hermetic
// e2e) the route is open so the harness can seed a snapshot
// in-band. Optional `?show=<slug>` scopes the recompute.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(request: Request): boolean {
  const secret = process.env['CRON_SECRET']
  if (!secret) return true
  const header = request.headers.get('authorization') ?? ''
  return header === `Bearer ${secret}`
}

async function recompute(request: Request): Promise<Response> {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const showParam = url.searchParams.get('show')

  try {
    const client = serviceRoleClient()
    const { data, error } = await client.rpc('recompute_rankings', {
      p_show: showParam && showParam.length > 0 ? showParam : null,
    })
    if (error) throw new Error(error.message)
    return NextResponse.json({
      ok: true,
      rowsWritten: Number(data ?? 0),
      show: showParam ?? null,
      recomputedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'recompute_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}

// Vercel Cron invokes the path with GET.
export async function GET(request: Request) {
  return recompute(request)
}

// Manual / e2e trigger.
export async function POST(request: Request) {
  return recompute(request)
}

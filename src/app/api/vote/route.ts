import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth0 } from '@/lib/auth0'
import { ANON_COOKIE_NAME, isValidAnonId } from '@/lib/anonSession'
import { castVote, claimAnonSession, upsertUser } from '@/lib/supabase/server'

// Phase 11 — votes are durable. The route enforces:
//  - body shape via Zod
//  - resolves the session id from cookies + Auth0 session
//  - upserts users row for authed callers; claims anon session
//    so guest votes follow the user
//  - delegates the write + weight + brigade limit to cast_vote()
//    RPC (service-role; SECURITY DEFINER)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  targetType: z.enum(['season', 'comment']),
  targetId: z.string().min(1).max(128),
  value: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
})

function handleFromSession(user: Record<string, unknown> | null | undefined): string {
  if (!user) return 'anon'
  const nickname = typeof user['nickname'] === 'string' ? user['nickname'] : null
  if (nickname) return nickname.replace(/^@+/, '').toLowerCase()
  const email = typeof user['email'] === 'string' ? user['email'] : null
  if (email) return (email.split('@')[0] ?? 'user').toLowerCase()
  const sub = typeof user['sub'] === 'string' ? user['sub'] : null
  if (sub) return sub.replace(/[^a-z0-9-]/gi, '-').slice(0, 32).toLowerCase()
  return 'user'
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof bodySchema>
  try {
    const raw = await request.json()
    parsed = bodySchema.parse(raw)
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'invalid_body', detail: err instanceof Error ? err.message : 'parse error' },
      { status: 400 },
    )
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  const anonCookieMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${ANON_COOKIE_NAME}=([^;]+)`),
  )
  const anonId = anonCookieMatch ? decodeURIComponent(anonCookieMatch[1] ?? '') : null
  const validAnonId = isValidAnonId(anonId) ? anonId : null

  let sessionId: string | null = null

  try {
    const session = await auth0.getSession()
    const user = session?.user as Record<string, unknown> | undefined
    const sub = typeof user?.['sub'] === 'string' ? (user['sub'] as string) : null

    if (sub) {
      const handle = handleFromSession(user)
      const email = typeof user?.['email'] === 'string' ? (user['email'] as string) : null
      const displayName =
        typeof user?.['name'] === 'string' ? (user['name'] as string) : null
      await upsertUser({ sub, handle, email, displayName })
      const claimed = await claimAnonSession({ anonId: validAnonId, sub })
      sessionId = claimed.sessionId
    } else if (validAnonId) {
      sessionId = validAnonId
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'auth_resolve_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'no_session', detail: 'missing tiered_anon_id cookie' },
      { status: 400 },
    )
  }

  try {
    const result = await castVote({
      sessionId,
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      value: parsed.value,
    })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const e = err as { code?: string; hint?: string; message?: string }
    if (e.code === '23505' || e.hint?.includes('brigade')) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited', detail: 'brigade limit exceeded for this session' },
        { status: 429 },
      )
    }
    if (e.code === '22023') {
      return NextResponse.json(
        { ok: false, error: 'invalid_input', detail: e.message ?? 'rejected by RPC' },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { ok: false, error: 'rpc_failed', detail: e.message ?? 'unknown' },
      { status: 500 },
    )
  }
}

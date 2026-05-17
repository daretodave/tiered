import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth0 } from '@/lib/auth0'
import { buildThread } from '@/lib/comments/thread'
import { listThreadComments } from '@/lib/supabase/server'

// Phase 36 — the comment read sibling of POST /api/comment.
//
// The season page is SSG/ISR, so it can't read the thread at build
// time (same root cause as the votes/community read gap). The
// client thread component fetches this on mount so a refresh shows
// truth.
//
// Visibility (spoiler/mod P0): published → everyone; the viewer's
// OWN pending → that viewer only, surfaced as "held for review";
// hidden/removed/blocked → nobody on the public page (mod queue
// only). The split is enforced in lib/comments/thread.ts and the
// service-role query in lib/supabase/server.ts; this route only
// resolves the viewer and shapes the response.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const querySchema = z.object({
  targetType: z.enum(['season', 'comment']),
  targetId: z.string().min(1).max(128),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  let q: z.infer<typeof querySchema>
  try {
    q = querySchema.parse({
      targetType: url.searchParams.get('targetType'),
      targetId: url.searchParams.get('targetId'),
    })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_query',
        detail: err instanceof Error ? err.message : 'parse error',
      },
      { status: 400 },
    )
  }

  let sub: string | null = null
  try {
    const session = await auth0.getSession()
    const user = session?.user as Record<string, unknown> | undefined
    sub = typeof user?.['sub'] === 'string' ? (user['sub'] as string) : null
  } catch {
    sub = null
  }

  const rows = await listThreadComments({
    targetType: q.targetType,
    targetId: q.targetId,
    sub,
  })
  const { comments, publishedCount } = buildThread({
    published: rows.published,
    ownPending: rows.ownPending,
  })

  return NextResponse.json(
    { ok: true, signedIn: Boolean(sub), count: publishedCount, comments },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}

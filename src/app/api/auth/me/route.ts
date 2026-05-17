import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { headerUserFromSession } from '@/components/chrome/headerUser'

// Lightweight auth-state probe. The header is rendered into SSG/ISR
// pages (home, show, season) where there is no request at build time,
// so server-side getSession() can't reflect the viewer. The header
// auth island fetches this on mount to correct the static output.
//
// Never cached — the response is per-viewer and must not be shared
// across the CDN. `force-dynamic` keeps Next from trying to
// statically evaluate the route.
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth0.getSession().catch(() => null)
  const user = headerUserFromSession(
    session?.user as Record<string, unknown> | undefined,
  )
  return NextResponse.json(
    { ok: true, signedIn: Boolean(user), user },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}

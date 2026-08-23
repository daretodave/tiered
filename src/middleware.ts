import { NextResponse, type NextRequest } from 'next/server'
import { auth0 } from '@/lib/auth0'
import {
  ANON_COOKIE_MAX_AGE_SEC,
  ANON_COOKIE_NAME,
  generateAnonId,
  isValidAnonId,
} from '@/lib/anonSession'

// Middleware composes two behaviors:
//  1. Auth0 SDK middleware — mounts /auth/login, /auth/logout,
//     /auth/callback, /auth/profile, /auth/access-token. Reads
//     the __session cookie and refreshes the access token if
//     needed. Returns a response that either redirects (auth
//     route) or passes through (everything else).
//  2. Anon-guest cookie issuance — for any pass-through response,
//     if the request lacks a valid `tiered_anon_id` cookie, mint
//     one and set it on the response. HttpOnly + SameSite=Lax.
//
// The Supabase `sessions` row is NOT created here — the middleware
// only stamps the cookie. Lazy row creation happens at first vote /
// first comment, when we have an RPC + service-role context to
// insert without RLS friction (see migration 20260513000001_sessions).

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Phase 29 — /search retired in favor of the cmd+K overlay.
  // Permanent redirect so external links land somewhere sensible.
  if (request.nextUrl.pathname === '/search') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url, 308)
  }

  // CRITIQUE pass-112 — the theme's own title/description/body read
  // "ten seasons" after the 2026-08-10 Below Deck Med S11 extend, but
  // the slug (and therefore the canonical URL) still said "nine" — a
  // self-contradiction visible in the address bar. Renamed the theme
  // file; this permanent redirect keeps the old URL live for anyone
  // who bookmarked or linked it.
  if (
    request.nextUrl.pathname ===
    '/themes/the-command-held-for-nine-seasons-then-didnt'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/themes/the-command-held-for-ten-seasons-then-didnt'
    url.search = ''
    return NextResponse.redirect(url, 308)
  }

  // 2026-08-23 cloud march — `same-castle-different-clock-every-winter`
  // (authored 2026-08-22) and `new-house-rules-every-time-the-castle-
  // reopens` (authored 2026-07-23, a month earlier) turned out to rank
  // the same four Traitors UK series on the same four underlying facts
  // (~100% entry overlap, well past the Rule 3 excellence gate's >40%
  // threshold) — the newer list's authoring pass mistakenly found zero
  // prior `traitors-uk` appearances. Retired the newer duplicate; this
  // permanent redirect sends its URL to the older, surviving list.
  if (
    request.nextUrl.pathname ===
    '/themes/same-castle-different-clock-every-winter'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/themes/new-house-rules-every-time-the-castle-reopens'
    url.search = ''
    return NextResponse.redirect(url, 308)
  }

  const auth0Response = await auth0.middleware(request)

  // Auth-route paths return a redirect / 200 directly — don't stamp
  // an anon cookie on those (the SDK is mid-handshake).
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return auth0Response
  }

  const existing = request.cookies.get(ANON_COOKIE_NAME)?.value
  if (isValidAnonId(existing)) {
    return auth0Response
  }

  const id = generateAnonId()
  auth0Response.cookies.set({
    name: ANON_COOKIE_NAME,
    value: id,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    maxAge: ANON_COOKIE_MAX_AGE_SEC,
  })
  return auth0Response
}

export const config = {
  // Skip Next internals + static assets. Everything else (pages,
  // API routes, auth routes) flows through.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.svg$|.*\\.png$|.*\\.ico$|.*\\.json$|.*\\.txt$).*)',
  ],
}

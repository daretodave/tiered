'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SearchTrigger } from '@/components/search/SearchTrigger'
import { BrandMark } from './BrandMark'
import type { HeaderUser } from './headerUser'

type HeaderViewProps = {
  tinted?: boolean
  user?: HeaderUser | null
}

/**
 * HeaderView — the chrome lockup.
 *
 * Phase 36: the header is rendered into SSG/ISR pages (home, show,
 * season) where server-side getSession() sees no request at build
 * time, so `user` arrives null on those routes even for a signed-in
 * viewer. On mount the auth island fetches `GET /api/auth/me` and
 * corrects the static output — the "Sign in" pill flips to the
 * account chrome client-side without a full dynamic re-render.
 * `user` is still passed for best-effort SSR on dynamic routes and
 * as the pre-hydration value.
 */
export function HeaderView({ tinted = false, user = null }: HeaderViewProps) {
  const [authUser, setAuthUser] = useState<HeaderUser | null>(user)

  useEffect(() => {
    if (typeof fetch !== 'function') return
    let cancelled = false
    fetch('/api/auth/me', { headers: { accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { ok?: boolean; user?: HeaderUser | null } | null) => {
        if (cancelled || !json || json.ok !== true) return
        setAuthUser(json.user ?? null)
      })
      .catch(() => {
        /* Keep the SSR value — best effort, no error affordance. */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const rootClass = tinted ? 'site-header tinted' : 'site-header'
  return (
    <header
      data-testid="site-header"
      data-tinted={tinted ? 'true' : undefined}
      data-signed-in={authUser ? 'true' : 'false'}
      className={rootClass}
    >
      <Link
        href="/"
        className="site-header-brand"
        aria-label="tiered.tv home"
        data-testid="site-header-brand"
      >
        <BrandMark size={22} />
        <span>tiered.tv</span>
      </Link>
      <nav aria-label="Primary" className="site-header-links">
        <Link href="/shows" prefetch={false}>
          Shows
        </Link>
        <Link href="/themes" prefetch={false}>
          Lists
        </Link>
        <Link href="/about" prefetch={false}>
          About
        </Link>
      </nav>
      <div className="site-header-right">
        <SearchTrigger />
        {authUser ? (
          <>
            <Link
              className="site-header-user"
              href={authUser.profileHref}
              prefetch={false}
              data-testid="site-header-user-link"
            >
              {authUser.displayLabel}
            </Link>
            <Link
              className="site-header-signin"
              href="/auth/logout?returnTo=/"
              prefetch={false}
              data-testid="site-header-signout-link"
            >
              Sign out
            </Link>
          </>
        ) : (
          <Link
            className="site-header-signin"
            href="/sign-in"
            prefetch={false}
            data-testid="site-header-signin-link"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}

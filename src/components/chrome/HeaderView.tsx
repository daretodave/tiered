'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { SearchTrigger } from '@/components/search/SearchTrigger'
import { canonicalUrl } from '@/lib/seo'
import { BrandMark } from './BrandMark'
import type { HeaderUser } from './headerUser'

/**
 * Auth0's logout route forwards `returnTo` verbatim as
 * `post_logout_redirect_uri`. A relative value (`/`) reaches Auth0
 * URL-encoded (`%2F`) and is always rejected — the allow-list only
 * matches absolute URLs. Send the absolute canonical origin instead
 * (see #56; the matching Allowed Logout URLs entry is a dashboard
 * task noted on the issue).
 */
const SIGN_OUT_HREF = `/auth/logout?returnTo=${encodeURIComponent(
  canonicalUrl('/'),
)}`

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
 *
 * Critique pass-23 #MED: on the authed branch the desktop chrome
 * keeps the inline `@handle / Sign out` pair (large touch targets,
 * clear hierarchy); mobile (≤720px) collapses the pair behind a
 * tap-to-reveal account menu so a mis-tap next to the handle can't
 * accidentally sign the user out. Both variants live in the DOM and
 * swap via CSS media queries (see chrome.css `.site-header-user-*`).
 */
export function HeaderView({ tinted = false, user = null }: HeaderViewProps) {
  const [authUser, setAuthUser] = useState<HeaderUser | null>(user)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

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

  useEffect(() => {
    if (!menuOpen) return
    function onDocPointer(e: MouseEvent | TouchEvent) {
      const target = e.target as Node | null
      if (!target) return
      if (menuRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDocPointer)
    document.addEventListener('touchstart', onDocPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocPointer)
      document.removeEventListener('touchstart', onDocPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

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
          <div className="site-header-account">
            <Link
              className="site-header-user site-header-user-desktop"
              href={authUser.profileHref}
              prefetch={false}
              data-testid="site-header-user-link"
            >
              {authUser.displayLabel}
            </Link>
            <Link
              className="site-header-signin site-header-signout-desktop"
              href={SIGN_OUT_HREF}
              prefetch={false}
              data-testid="site-header-signout-link"
            >
              Sign out
            </Link>
            <button
              type="button"
              className="site-header-user site-header-user-trigger"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={`Account menu for ${authUser.displayLabel}`}
              ref={triggerRef}
              onClick={() => setMenuOpen((v) => !v)}
              data-testid="site-header-user-trigger"
            >
              {authUser.displayLabel}
            </button>
            {menuOpen ? (
              <div
                id={menuId}
                ref={menuRef}
                role="menu"
                className="site-header-user-menu"
                data-testid="site-header-user-menu"
              >
                <Link
                  role="menuitem"
                  className="site-header-user-menu-item"
                  href={authUser.profileHref}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  data-testid="site-header-user-menu-record"
                >
                  Your record
                </Link>
                <Link
                  role="menuitem"
                  className="site-header-user-menu-item"
                  href={SIGN_OUT_HREF}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  data-testid="site-header-user-menu-signout"
                >
                  Sign out
                </Link>
              </div>
            ) : null}
          </div>
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

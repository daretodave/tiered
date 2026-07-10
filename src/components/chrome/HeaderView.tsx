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
 * Critique pass-45 #MED (supersedes pass-23): on the authed branch,
 * BOTH viewports collapse `@handle` + `Sign out` behind a single
 * tap-to-reveal account menu — desktop no longer foregrounds
 * `Sign out` as a flat top-bar action. The chevron-disclosure
 * pattern carries both breakpoints; future menu peers
 * (`My profile`, settings) slot in without re-architecting the
 * header. CSS lives in chrome.css under `.site-header-user-*`.
 *
 * Critique pass-84 #MED: a null `user` prop is ambiguous — it means
 * either "genuinely signed out" or "static/ISR route, real answer
 * not known yet." Painting the confident "Sign in" CTA immediately
 * for both cases flickers the wrong affordance for returning members
 * on the site's highest-traffic page. `hydrated` tracks whether the
 * client has actually confirmed the answer (true from the start when
 * `user` arrives truthy, since that can only come from a real
 * session); while it's false, render a neutral, non-interactive
 * skeleton instead of either CTA.
 */
export function HeaderView({ tinted = false, user = null }: HeaderViewProps) {
  const [authUser, setAuthUser] = useState<HeaderUser | null>(user)
  const [hydrated, setHydrated] = useState(Boolean(user))
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (typeof fetch !== 'function') {
      setHydrated(true)
      return
    }
    let cancelled = false
    fetch('/api/auth/me', { headers: { accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { ok?: boolean; user?: HeaderUser | null } | null) => {
        if (cancelled) return
        if (json && json.ok === true) setAuthUser(json.user ?? null)
        setHydrated(true)
      })
      .catch(() => {
        /* Keep the SSR value — best effort, no error affordance. */
        if (!cancelled) setHydrated(true)
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
              data-profile-href={authUser.profileHref}
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
        ) : hydrated ? (
          <Link
            className="site-header-signin"
            href="/sign-in"
            prefetch={false}
            data-testid="site-header-signin-link"
          >
            Sign in
          </Link>
        ) : (
          <span
            className="site-header-signin site-header-signin-pending"
            aria-hidden="true"
            data-testid="site-header-signin-pending"
          >
            Sign in
          </span>
        )}
      </div>
    </header>
  )
}

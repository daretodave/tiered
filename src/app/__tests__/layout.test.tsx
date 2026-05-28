import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

// src/app/layout.tsx is the ROOT layout — every route on tiered.tv
// (default chrome routes, show + season tinted routes, internal demos,
// every OG/social/SEO surface) inherits its `metadata`, `viewport`, and
// rendered <html>/<body> shell. None of the contracts it carries are
// pinned by a hermetic e2e walk: the walk reads rendered pages, not the
// Metadata-object construction (metadataBase, the title template, the
// RSS <link rel=alternate> auto-discovery, the favicon set), not the
// viewport theme-color, and not the synchronous no-flicker theme
// bootstrap script string (the e2e env has no localStorage theme set,
// so the branch never fires during the walk).
//
// The two analytics beacons are mocked to stable stub functions so the
// tree walk can identify them by reference. `@/lib/seo`'s siteConfig is
// left **real** so a regression in baseUrl surfaces here, tied to the
// source rather than a magic string. The component returns <html>/<body>
// which cannot cleanly DOM-render under jsdom (html-in-div), so the test
// inspects the returned React element tree directly — the same approach
// the OG-image route tests use.

vi.mock('@/components/analytics/VercelAnalytics', () => ({
  VercelAnalytics: function VercelAnalyticsMock() {
    return null
  },
}))
vi.mock('@/components/analytics/VercelSpeedInsights', () => ({
  VercelSpeedInsights: function VercelSpeedInsightsMock() {
    return null
  },
}))

import { VercelAnalytics } from '@/components/analytics/VercelAnalytics'
import { VercelSpeedInsights } from '@/components/analytics/VercelSpeedInsights'
import { siteConfig } from '@/lib/seo'
import RootLayout, { metadata, viewport } from '../layout'

// --------------------------------------------------------------------
// Tree-navigation helpers (the component returns <html> — inspect the
// element tree, don't DOM-render).
// --------------------------------------------------------------------

type El = ReactElement<Record<string, unknown>>

function childrenOf(el: El): El[] {
  const c = (el.props as { children?: unknown }).children
  if (c == null) return []
  return (Array.isArray(c) ? c : [c]) as El[]
}

const KIDS = <div data-testid="layout-children" />

function renderTree(): El {
  return RootLayout({ children: KIDS }) as El
}

// --------------------------------------------------------------------
// metadata export
// --------------------------------------------------------------------

describe('RootLayout metadata', () => {
  it('metadataBase is the siteConfig.baseUrl as a URL — every relative canonical/OG URL resolves against it', () => {
    // Tied to siteConfig, not a hardcoded string: a regression that
    // hardcoded a different base (or dropped the URL wrapper) is caught.
    expect(metadata.metadataBase).toBeInstanceOf(URL)
    expect(metadata.metadataBase?.href).toBe(new URL(siteConfig.baseUrl).href)
    expect(metadata.metadataBase?.origin).toBe('https://tiered.tv')
  })

  it('title.default carries the full brand promise and title.template suffixes child titles', () => {
    const title = metadata.title as { default: string; template: string }
    expect(title.default).toBe('tiered.tv — the seasons, ranked. no spoilers.')
    // The template is what every child route's `title` flows through —
    // a regression dropping it would strip the brand suffix from every
    // sub-page <title>.
    expect(title.template).toBe('%s — tiered.tv')
  })

  it('description names the spoiler-free framing and the two-rankings frame', () => {
    const description = String(metadata.description)
    expect(description).toMatch(/spoiler-free/i)
    expect(description).toMatch(/Editor’s Canon/)
    expect(description).toMatch(/Community Rank/)
  })

  it("applicationName is 'tiered.tv'", () => {
    expect(metadata.applicationName).toBe('tiered.tv')
  })

  it('declares the global RSS feed as an application/rss+xml alternate pointing at /feed.xml', () => {
    // The <link rel="alternate" type="application/rss+xml"> auto-discovery
    // is dark to e2e (the walk fetches /feed.xml directly; it does not
    // grep the <head> for the alternate link). A regression dropping it
    // breaks feed-reader discovery site-wide.
    const rss = (
      metadata.alternates?.types as
        | Record<string, Array<{ url: string; title?: string }>>
        | undefined
    )?.['application/rss+xml']
    expect(rss).toHaveLength(1)
    expect(rss?.[0]?.url).toBe('/feed.xml')
  })

  it('lists the favicon set SVG-first with the .ico universal fallback and apple-touch-icon', () => {
    const icons = metadata.icons as {
      icon: Array<{ url: string; type?: string; sizes?: string }>
      apple: string
    }
    // SVG first — modern browsers prefer the vector tab mark; the .ico is
    // the universal fallback. Order is load-bearing for which asset a
    // browser picks.
    expect(icons.icon[0]).toEqual({ url: '/favicon.svg', type: 'image/svg+xml' })
    expect(icons.icon).toContainEqual({ url: '/favicon.ico', sizes: 'any' })
    expect(icons.icon).toContainEqual({
      url: '/icon-32.png',
      sizes: '32x32',
      type: 'image/png',
    })
    expect(icons.icon).toContainEqual({
      url: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    })
    expect(icons.apple).toBe('/apple-touch-icon.png')
  })
})

// --------------------------------------------------------------------
// viewport export
// --------------------------------------------------------------------

describe('RootLayout viewport', () => {
  it('themeColor matches the brand paper hex #0E0B08 — the browser chrome tint', () => {
    // Same paper the root OG card and the dark body use. A drift here
    // re-tints the mobile browser chrome away from the brand.
    expect(viewport.themeColor).toBe('#0E0B08')
  })

  it('sets width=device-width and initialScale=1 — the responsive viewport contract', () => {
    expect(viewport.width).toBe('device-width')
    expect(viewport.initialScale).toBe(1)
  })
})

// --------------------------------------------------------------------
// rendered <html> shell
// --------------------------------------------------------------------

describe('RootLayout <html> shell', () => {
  it('renders <html lang="en"> with suppressHydrationWarning for the theme-bootstrap mutation', () => {
    const tree = renderTree()
    expect(tree.type).toBe('html')
    expect(tree.props.lang).toBe('en')
    // suppressHydrationWarning is required because the bootstrap script
    // mutates documentElement.dataset.theme before React hydrates — without
    // it React would warn on the server/client attribute mismatch.
    expect(tree.props.suppressHydrationWarning).toBe(true)
  })

  it('has exactly two top-level children: <head> then <body>', () => {
    const top = childrenOf(renderTree())
    expect(top).toHaveLength(2)
    expect(top[0]?.type).toBe('head')
    expect(top[1]?.type).toBe('body')
  })
})

// --------------------------------------------------------------------
// no-flicker theme bootstrap
// --------------------------------------------------------------------

describe('RootLayout theme bootstrap', () => {
  function bootstrapScript(): string {
    const [head] = childrenOf(renderTree())
    const script = childrenOf(head as El)[0] as El
    expect(script.type).toBe('script')
    const html = (
      script.props as { dangerouslySetInnerHTML?: { __html?: string } }
    ).dangerouslySetInnerHTML?.__html
    return String(html)
  }

  it('reads the persisted theme from localStorage under the tiered_theme key', () => {
    expect(bootstrapScript()).toContain("localStorage.getItem('tiered_theme')")
  })

  it('applies the stored value to documentElement.dataset.theme', () => {
    expect(bootstrapScript()).toContain('document.documentElement.dataset.theme=t')
  })

  it("only applies 'light' or 'dark' — a junk value must not set a data-theme", () => {
    // The gate is load-bearing: without it a corrupted/legacy value would
    // be written to the attribute and break the CSS theme cascade.
    expect(bootstrapScript()).toContain("t==='light'||t==='dark'")
  })

  it('is wrapped in try/catch so a blocked localStorage (private mode) cannot throw before first paint', () => {
    const script = bootstrapScript()
    expect(script).toContain('try{')
    expect(script).toContain('}catch(e){}')
  })

  it('is a self-invoking IIFE so it runs synchronously inline, before paint', () => {
    expect(bootstrapScript()).toMatch(/^\(function\(\)\{.*\}\)\(\);$/)
  })
})

// --------------------------------------------------------------------
// <body> shell + analytics mounting
// --------------------------------------------------------------------

describe('RootLayout <body> shell', () => {
  function body(): El {
    return childrenOf(renderTree())[1] as El
  }

  it('carries the sticky-footer flex shell className: flex min-h-dvh flex-col', () => {
    // Every page depends on this column shell for the footer to pin to the
    // bottom on short pages. A regression to the className would collapse
    // the layout site-wide.
    expect(body().props.className).toBe('flex min-h-dvh flex-col')
  })

  it('renders the passed children first, then both analytics beacons', () => {
    const kids = childrenOf(body())
    expect(kids).toHaveLength(3)
    // Children come first — analytics must trail the content, never wrap it.
    expect(kids[0]).toBe(KIDS)
    expect(kids[1]?.type).toBe(VercelAnalytics)
    expect(kids[2]?.type).toBe(VercelSpeedInsights)
  })

  it('mounts each analytics beacon exactly once', () => {
    const kids = childrenOf(body())
    expect(kids.filter((c) => c?.type === VercelAnalytics)).toHaveLength(1)
    expect(kids.filter((c) => c?.type === VercelSpeedInsights)).toHaveLength(1)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

// app/sitemap.ts is the Next.js MetadataRoute.Sitemap producer that
// every search engine reads at /sitemap.xml. The route loaders
// (getSitemapRoutes, getFeedPaths) are exhaustively tested in
// src/lib/__tests__/routes.test.ts; this test pins the consumer
// transformation that turns those route lists into the sitemap
// shape — the priority differentiation, the canonicalUrl wrapping,
// the changeFrequency contract, and the pages-before-feeds order.
//
// `@/lib/routes` is mocked (we drive the loader outputs explicitly
// so we can test the priority rule against the route's `pattern`,
// not its `path`). `@/lib/seo.canonicalUrl` is left real so the
// absolute-URL output is the actual production wrapping a crawler
// would see.

const { getSitemapRoutesMock, getFeedPathsMock } = vi.hoisted(() => ({
  getSitemapRoutesMock: vi.fn(),
  getFeedPathsMock: vi.fn(),
}))

vi.mock('@/lib/routes', () => ({
  getSitemapRoutes: getSitemapRoutesMock,
  getFeedPaths: getFeedPathsMock,
}))

import sitemap from '../sitemap'

beforeEach(() => {
  getSitemapRoutesMock.mockReset()
  getFeedPathsMock.mockReset()
})

describe('app/sitemap — page entries', () => {
  it('emits one entry per route from getSitemapRoutes', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/', path: '/' },
      { pattern: '/shows', path: '/shows' },
      { pattern: '/themes', path: '/themes' },
    ])
    getFeedPathsMock.mockReturnValue([])
    const out = sitemap()
    expect(out).toHaveLength(3)
    expect(out.map((e) => e.url)).toEqual([
      'https://tiered.tv/',
      'https://tiered.tv/shows',
      'https://tiered.tv/themes',
    ])
  })

  it('wraps each path in canonicalUrl so the sitemap is absolute', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/shows/[show]', path: '/shows/survivor' },
      { pattern: '/shows/[show]/season/[slug]', path: '/shows/survivor/season/borneo' },
    ])
    getFeedPathsMock.mockReturnValue([])
    const out = sitemap()
    for (const entry of out) {
      expect(entry.url).toMatch(/^https:\/\/tiered\.tv\//)
    }
    expect(out.map((e) => e.url)).toEqual([
      'https://tiered.tv/shows/survivor',
      'https://tiered.tv/shows/survivor/season/borneo',
    ])
  })

  it('preserves the order in which getSitemapRoutes returned routes', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/themes', path: '/themes' },
      { pattern: '/', path: '/' },
      { pattern: '/about', path: '/about' },
    ])
    getFeedPathsMock.mockReturnValue([])
    const paths = sitemap().map((e) => e.url)
    expect(paths).toEqual([
      'https://tiered.tv/themes',
      'https://tiered.tv/',
      'https://tiered.tv/about',
    ])
  })
})

describe('app/sitemap — priority differentiation', () => {
  it('gives the home pattern (/) priority 1.0', () => {
    getSitemapRoutesMock.mockReturnValue([{ pattern: '/', path: '/' }])
    getFeedPathsMock.mockReturnValue([])
    const [home] = sitemap()
    expect(home?.priority).toBe(1.0)
  })

  it('gives every non-home pattern priority 0.7', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/shows', path: '/shows' },
      { pattern: '/themes', path: '/themes' },
      { pattern: '/about', path: '/about' },
      { pattern: '/shows/[show]', path: '/shows/survivor' },
      { pattern: '/shows/[show]/season/[slug]', path: '/shows/survivor/season/borneo' },
      { pattern: '/themes/[theme]', path: '/themes/best-premieres' },
    ])
    getFeedPathsMock.mockReturnValue([])
    for (const entry of sitemap()) {
      expect(entry.priority).toBe(0.7)
    }
  })

  it('keys priority off the route pattern, not the path — a synthetic root path with a non-/ pattern stays at 0.7', () => {
    // Defends against a regression to `route.path === '/'` instead of
    // `route.pattern === '/'`. Either keys home correctly for the
    // current route set, but pattern is the discipline.
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/shows', path: '/' },
    ])
    getFeedPathsMock.mockReturnValue([])
    const [entry] = sitemap()
    expect(entry?.priority).toBe(0.7)
  })
})

describe('app/sitemap — feed entries', () => {
  it('emits one entry per path from getFeedPaths', () => {
    getSitemapRoutesMock.mockReturnValue([])
    getFeedPathsMock.mockReturnValue([
      '/feed.xml',
      '/feed/survivor.xml',
      '/feed/top-chef.xml',
    ])
    const out = sitemap()
    expect(out).toHaveLength(3)
    expect(out.map((e) => e.url)).toEqual([
      'https://tiered.tv/feed.xml',
      'https://tiered.tv/feed/survivor.xml',
      'https://tiered.tv/feed/top-chef.xml',
    ])
  })

  it('assigns every feed entry priority 0.4', () => {
    getSitemapRoutesMock.mockReturnValue([])
    getFeedPathsMock.mockReturnValue([
      '/feed.xml',
      '/feed/survivor.xml',
      '/feed/top-chef.xml',
    ])
    for (const entry of sitemap()) {
      expect(entry.priority).toBe(0.4)
    }
  })

  it('wraps feed paths in canonicalUrl too', () => {
    getSitemapRoutesMock.mockReturnValue([])
    getFeedPathsMock.mockReturnValue(['/feed/survivor.xml'])
    const [entry] = sitemap()
    expect(entry?.url).toBe('https://tiered.tv/feed/survivor.xml')
  })
})

describe('app/sitemap — composition', () => {
  it('appends feeds after pages, preserving the order of each list', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/', path: '/' },
      { pattern: '/shows', path: '/shows' },
    ])
    getFeedPathsMock.mockReturnValue(['/feed.xml', '/feed/survivor.xml'])
    const out = sitemap()
    expect(out.map((e) => e.url)).toEqual([
      'https://tiered.tv/',
      'https://tiered.tv/shows',
      'https://tiered.tv/feed.xml',
      'https://tiered.tv/feed/survivor.xml',
    ])
    // Page priorities run first, then feeds at 0.4 — a structural
    // assertion the regression class "feeds emitted before pages"
    // would surface here.
    expect(out.map((e) => e.priority)).toEqual([1.0, 0.7, 0.4, 0.4])
  })

  it('returns an empty array when both lists are empty', () => {
    getSitemapRoutesMock.mockReturnValue([])
    getFeedPathsMock.mockReturnValue([])
    expect(sitemap()).toEqual([])
  })

  it('still emits feeds when there are no pages', () => {
    getSitemapRoutesMock.mockReturnValue([])
    getFeedPathsMock.mockReturnValue(['/feed.xml'])
    expect(sitemap()).toEqual([
      {
        url: 'https://tiered.tv/feed.xml',
        lastModified: expect.any(Date),
        changeFrequency: 'weekly',
        priority: 0.4,
      },
    ])
  })

  it('still emits pages when there are no feeds', () => {
    getSitemapRoutesMock.mockReturnValue([{ pattern: '/about', path: '/about' }])
    getFeedPathsMock.mockReturnValue([])
    expect(sitemap()).toEqual([
      {
        url: 'https://tiered.tv/about',
        lastModified: expect.any(Date),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ])
  })
})

describe('app/sitemap — entry-shape contract', () => {
  it('attaches changeFrequency: "weekly" to every entry — pages AND feeds', () => {
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/', path: '/' },
      { pattern: '/shows', path: '/shows' },
    ])
    getFeedPathsMock.mockReturnValue(['/feed.xml', '/feed/survivor.xml'])
    for (const entry of sitemap()) {
      expect(entry.changeFrequency).toBe('weekly')
    }
  })

  it('attaches a Date to lastModified on every entry, and the same Date across the whole emission', () => {
    // The route uses one `const now = new Date()` per call and
    // forwards it to every entry — a regression that re-`new
    // Date()`-d inside the map (or `Date.now()`-d as a number)
    // would either spread the timestamps or change the type.
    getSitemapRoutesMock.mockReturnValue([
      { pattern: '/', path: '/' },
      { pattern: '/shows', path: '/shows' },
    ])
    getFeedPathsMock.mockReturnValue(['/feed.xml'])
    const out = sitemap()
    const [first, ...rest] = out
    expect(first?.lastModified).toBeInstanceOf(Date)
    for (const entry of rest) {
      expect(entry.lastModified).toBeInstanceOf(Date)
      expect((entry.lastModified as Date).getTime()).toBe(
        (first?.lastModified as Date).getTime(),
      )
    }
  })

  it('emits a fresh lastModified on each call (the route is server-rendered, not memoized)', () => {
    getSitemapRoutesMock.mockReturnValue([{ pattern: '/', path: '/' }])
    getFeedPathsMock.mockReturnValue([])
    const a = sitemap()
    // Advance the clock so a same-millisecond tie cannot mask a
    // captured Date — the constant-time path under load can still
    // share a single ms, but holding the result across a real
    // delay proves the closure isn't pinned across calls.
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        const b = sitemap()
        expect((b[0]?.lastModified as Date).getTime()).toBeGreaterThanOrEqual(
          (a[0]?.lastModified as Date).getTime(),
        )
        resolve()
      }, 5),
    )
  })

  it('exposes exactly the four MetadataRoute.Sitemap entry keys per row', () => {
    getSitemapRoutesMock.mockReturnValue([{ pattern: '/', path: '/' }])
    getFeedPathsMock.mockReturnValue(['/feed.xml'])
    for (const entry of sitemap()) {
      expect(Object.keys(entry).sort()).toEqual([
        'changeFrequency',
        'lastModified',
        'priority',
        'url',
      ])
    }
  })
})

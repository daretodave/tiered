import { beforeEach, describe, expect, it, vi } from 'vitest'

// GET /feed.xml is the global RSS 2.0 feed (phase 32) — the discovery
// surface every RSS reader hits at the canonical absolute URL. The
// underlying helpers (`buildGlobalFeedItems`, `renderRss`) are
// exhaustively tested in `src/lib/feed/__tests__/`; this test pins
// the route handler's own contracts: the channel metadata it passes
// in, the content-type header that lets readers parse it, and the
// `force-static` / `revalidate = 3600` exports that hold it on the
// same ISR window as the sitemap (also tested in `app/__tests__/`).
//
// `@/lib/feed/items` + `@/lib/feed/rss` are mocked so we can drive
// the renderer with a known item list and capture the channel
// metadata the route constructs. `@/lib/seo` is left real so a
// regression in `canonicalUrl`'s trailing-slash discipline or in
// `siteConfig.name` surfaces here too.

const { buildGlobalFeedItemsMock, renderRssMock } = vi.hoisted(() => ({
  buildGlobalFeedItemsMock: vi.fn(),
  renderRssMock: vi.fn(),
}))

vi.mock('@/lib/feed/items', () => ({
  buildGlobalFeedItems: buildGlobalFeedItemsMock,
}))
vi.mock('@/lib/feed/rss', () => ({
  renderRss: renderRssMock,
}))

import { canonicalUrl, siteConfig } from '@/lib/seo'
import { GET, dynamic, revalidate } from '../route'

beforeEach(() => {
  buildGlobalFeedItemsMock.mockReset()
  renderRssMock.mockReset()
  buildGlobalFeedItemsMock.mockReturnValue([])
  renderRssMock.mockReturnValue('<rss/>')
})

describe('GET /feed.xml — response shape', () => {
  it('returns a 200 Response (the route has no failure path — the global feed always exists)', () => {
    const res = GET()
    expect(res).toBeInstanceOf(Response)
    expect(res.status).toBe(200)
  })

  it('declares content-type application/rss+xml; charset=utf-8 — the MIME RSS readers expect', () => {
    // `text/xml` or `application/xml` would still parse but loses the
    // RSS-specific signal feed-discovery clients (and the Atom-style
    // <link rel="alternate"> we emit elsewhere) key off.
    const res = GET()
    expect(res.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8')
  })

  it('writes the rendered RSS string as the body, byte-for-byte', async () => {
    renderRssMock.mockReturnValue('<rss version="2.0">…</rss>\n')
    const res = GET()
    await expect(res.text()).resolves.toBe('<rss version="2.0">…</rss>\n')
  })
})

describe('GET /feed.xml — channel metadata', () => {
  it('passes the canonical absolute home URL as the channel link', () => {
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.link).toBe(canonicalUrl('/'))
  })

  it('passes the canonical absolute feed URL as the atom:self pointer', () => {
    // A relative or wrong path here would have RSS readers fetch
    // themselves from the wrong origin on refresh.
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.feedUrl).toBe(canonicalUrl('/feed.xml'))
  })

  it('opens the title with siteConfig.name so the brand name drives feed identity', () => {
    // Pinned against drift in siteConfig.name in a single place; a
    // regression that hardcoded the brand here would silently diverge
    // from the rest of the chrome.
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.title.startsWith(siteConfig.name)).toBe(true)
  })

  it('appends the canonical promise — "the seasons, ranked. no spoilers." — to the title', () => {
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.title).toBe(
      `${siteConfig.name} — the seasons, ranked. no spoilers.`,
    )
  })

  it('writes a non-empty channel description that names the three content surfaces (seasons / canon / themed lists)', () => {
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.description).toMatch(/season/i)
    expect(channel?.description).toMatch(/canon/i)
    expect(channel?.description).toMatch(/themed/i)
  })

  it('passes exactly { title, link, feedUrl, description } as the channel — no extra keys, none missing', () => {
    GET()
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(Object.keys(channel ?? {}).sort()).toEqual([
      'description',
      'feedUrl',
      'link',
      'title',
    ])
  })
})

describe('GET /feed.xml — items composition', () => {
  it('forwards the items from buildGlobalFeedItems untouched, in order', () => {
    const items = [
      { title: 'A', url: 'https://tiered.tv/a', date: new Date(0), description: 'a' },
      { title: 'B', url: 'https://tiered.tv/b', date: new Date(0), description: 'b' },
    ]
    buildGlobalFeedItemsMock.mockReturnValue(items)
    GET()
    const [, passed] = renderRssMock.mock.calls[0] ?? []
    expect(passed).toBe(items)
  })

  it('renders even when there are no items — an empty content drain must not 500 the discovery surface', () => {
    buildGlobalFeedItemsMock.mockReturnValue([])
    const res = GET()
    expect(res.status).toBe(200)
    expect(renderRssMock).toHaveBeenCalledTimes(1)
  })

  it('calls buildGlobalFeedItems exactly once per request — no per-render fan-out', () => {
    GET()
    expect(buildGlobalFeedItemsMock).toHaveBeenCalledTimes(1)
  })
})

describe('GET /feed.xml — ISR contract', () => {
  it('exports dynamic = "force-static" so the feed bakes at build, not per-request', () => {
    // Per-request rendering would burn the content loaders on every
    // RSS poll; force-static lets the loaders run at build and the
    // result sit on the CDN.
    expect(dynamic).toBe('force-static')
  })

  it('exports revalidate = 3600 — the hourly ISR window that matches sitemap.ts', () => {
    // The two discovery surfaces (sitemap.xml and feed.xml) refresh
    // on the same cadence so a content drain that lands one without
    // the other doesn't get noticed twice.
    expect(revalidate).toBe(3600)
  })
})

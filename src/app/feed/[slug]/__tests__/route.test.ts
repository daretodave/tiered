import { beforeEach, describe, expect, it, vi } from 'vitest'

// GET /feed/[slug] is the per-show RSS 2.0 feed (phase 32) — the
// discovery surface every RSS reader hits at /feed/<show>.xml. The
// underlying helpers (`getAllShows`, `getShow`, `buildShowFeedItems`,
// `renderRss`) are exhaustively tested in `src/content/__tests__/`
// + `src/lib/feed/__tests__/`; this test pins the route handler's
// own contracts: the .xml-suffix discipline, the two 404 branches
// (non-.xml slug and unknown show), generateStaticParams's per-show
// enumeration, the channel-metadata construction, the content-type
// header, and the `force-static` / `revalidate = 3600` exports.
//
// `@/content` + `@/lib/feed/items` + `@/lib/feed/rss` are mocked so
// the test drives every branch deterministically and captures what
// the route passes to the renderer. `@/lib/seo` is left real so a
// regression in `canonicalUrl`'s trailing-slash discipline or in
// `siteConfig.baseUrl` surfaces here too.

const {
  getAllShowsMock,
  getShowMock,
  buildShowFeedItemsMock,
  renderRssMock,
} = vi.hoisted(() => ({
  getAllShowsMock: vi.fn(),
  getShowMock: vi.fn(),
  buildShowFeedItemsMock: vi.fn(),
  renderRssMock: vi.fn(),
}))

vi.mock('@/content', () => ({
  getAllShows: getAllShowsMock,
  getShow: getShowMock,
}))
vi.mock('@/lib/feed/items', () => ({
  buildShowFeedItems: buildShowFeedItemsMock,
}))
vi.mock('@/lib/feed/rss', () => ({
  renderRss: renderRssMock,
}))

import { canonicalUrl } from '@/lib/seo'
import { GET, dynamic, generateStaticParams, revalidate } from '../route'

const survivor = {
  slug: 'survivor',
  name: 'Survivor',
  est_year: 2000,
}

const reqStub = new Request('https://tiered.tv/feed/survivor.xml')

beforeEach(() => {
  getAllShowsMock.mockReset()
  getShowMock.mockReset()
  buildShowFeedItemsMock.mockReset()
  renderRssMock.mockReset()
  getAllShowsMock.mockReturnValue([survivor])
  getShowMock.mockReturnValue(survivor)
  buildShowFeedItemsMock.mockReturnValue([])
  renderRssMock.mockReturnValue('<rss/>')
})

describe('generateStaticParams — per-show SSG enumeration', () => {
  it('emits one entry per show in getAllShows()', () => {
    getAllShowsMock.mockReturnValue([
      survivor,
      { slug: 'top-chef', name: 'Top Chef', est_year: 2006 },
      { slug: 'amazing-race', name: 'The Amazing Race', est_year: 2001 },
    ])
    expect(generateStaticParams()).toHaveLength(3)
  })

  it('appends .xml to every show slug — the URL contract /feed/<show>.xml', () => {
    // A regression returning { slug: show.slug } (no .xml) would
    // emit /feed/<show> static pages and break the discovery URL
    // contract; readers wouldn't even find the feed.
    getAllShowsMock.mockReturnValue([
      survivor,
      { slug: 'top-chef', name: 'Top Chef', est_year: 2006 },
    ])
    expect(generateStaticParams()).toEqual([
      { slug: 'survivor.xml' },
      { slug: 'top-chef.xml' },
    ])
  })

  it('preserves getAllShows() order — feed enumeration is deterministic across builds', () => {
    const shows = [
      { slug: 'b', name: 'B', est_year: 2000 },
      { slug: 'a', name: 'A', est_year: 2000 },
      { slug: 'c', name: 'C', est_year: 2000 },
    ]
    getAllShowsMock.mockReturnValue(shows)
    expect(generateStaticParams().map((p) => p.slug)).toEqual([
      'b.xml',
      'a.xml',
      'c.xml',
    ])
  })

  it('round-trips an empty catalog as [] — no feeds enumerated when no shows exist', () => {
    getAllShowsMock.mockReturnValue([])
    expect(generateStaticParams()).toEqual([])
  })
})

describe('GET /feed/[slug] — 404 branches', () => {
  it('returns 404 when the slug does not end in .xml', async () => {
    // A regression to `startsWith` or no check would emit RSS for
    // the wrong path shape (e.g. /feed/survivor with no suffix).
    const res = GET(reqStub, { params: { slug: 'survivor' } })
    expect(res.status).toBe(404)
    await expect(res.text()).resolves.toBe('feed not found')
  })

  it('returns 404 when the show is unknown (getShow → undefined)', async () => {
    getShowMock.mockReturnValue(undefined)
    const res = GET(reqStub, { params: { slug: 'made-up.xml' } })
    expect(res.status).toBe(404)
    await expect(res.text()).resolves.toBe('feed not found')
  })

  it('returns 404 when buildShowFeedItems returns null (the helper signals unknown show too)', async () => {
    buildShowFeedItemsMock.mockReturnValue(null)
    const res = GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(res.status).toBe(404)
    await expect(res.text()).resolves.toBe('feed not found')
  })

  it('uses text/plain on the 404 body — RSS readers would log a parse error against application/rss+xml empty', () => {
    const res = GET(reqStub, { params: { slug: 'survivor' } })
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8')
  })

  it('never calls renderRss on any 404 path', () => {
    GET(reqStub, { params: { slug: 'survivor' } })
    getShowMock.mockReturnValue(undefined)
    GET(reqStub, { params: { slug: 'made-up.xml' } })
    getShowMock.mockReturnValue(survivor)
    buildShowFeedItemsMock.mockReturnValue(null)
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(renderRssMock).not.toHaveBeenCalled()
  })

  it('strips the .xml suffix before passing the slug to getShow', () => {
    // A regression that passed the raw `survivor.xml` to getShow
    // would 404 every show because no show slug includes the suffix.
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(getShowMock).toHaveBeenCalledWith('survivor')
  })
})

describe('GET /feed/[slug] — 200 response shape', () => {
  it('returns a 200 Response when the show resolves', () => {
    const res = GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(res).toBeInstanceOf(Response)
    expect(res.status).toBe(200)
  })

  it('declares content-type application/rss+xml; charset=utf-8 — the MIME RSS readers expect', () => {
    // `text/xml` / `application/xml` would still parse but loses the
    // RSS-specific signal feed-discovery clients key off.
    const res = GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(res.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8')
  })

  it('writes the rendered RSS string as the body, byte-for-byte', async () => {
    renderRssMock.mockReturnValue('<rss version="2.0">…</rss>\n')
    const res = GET(reqStub, { params: { slug: 'survivor.xml' } })
    await expect(res.text()).resolves.toBe('<rss version="2.0">…</rss>\n')
  })
})

describe('GET /feed/[slug] — channel metadata', () => {
  it('uses the show name in the title with the per-show brand promise', () => {
    // Pinned against drift in the title shape; readers' UIs surface
    // this verbatim in their subscription list.
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.title).toBe('Survivor — every season ranked, no spoilers')
  })

  it('points channel link at the show home — the human page the feed describes', () => {
    // `link` is "the human page the feed describes" per FeedChannel
    // — the show home, NOT the feed URL (that is `feedUrl`).
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.link).toBe(canonicalUrl('/shows/survivor'))
  })

  it('points feedUrl at the canonical absolute feed URL — the atom:self pointer', () => {
    // A relative or wrong path would have RSS readers refresh from
    // the wrong origin.
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.feedUrl).toBe(canonicalUrl('/feed/survivor.xml'))
  })

  it('names the show by name in the description', () => {
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.description).toMatch(/Survivor/)
  })

  it('names the two content surfaces (season pages + canon revisions) in the description', () => {
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.description).toMatch(/season/i)
    expect(channel?.description).toMatch(/canon/i)
  })

  it('passes exactly { title, link, feedUrl, description } as the channel — no extra keys, none missing', () => {
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(Object.keys(channel ?? {}).sort()).toEqual([
      'description',
      'feedUrl',
      'link',
      'title',
    ])
  })

  it('derives channel metadata from the show that getShow returns — not from the URL slug', () => {
    // If the slug→show resolution lets the show name diverge from
    // the URL (case-folding, alias resolution), the channel must
    // reflect the resolved show. Pins that the route reads from
    // `show.slug` / `show.name`, not the raw URL params.
    getShowMock.mockReturnValue({
      slug: 'top-chef',
      name: 'Top Chef',
      est_year: 2006,
    })
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [channel] = renderRssMock.mock.calls[0] ?? []
    expect(channel?.title).toBe('Top Chef — every season ranked, no spoilers')
    expect(channel?.link).toBe(canonicalUrl('/shows/top-chef'))
    expect(channel?.feedUrl).toBe(canonicalUrl('/feed/top-chef.xml'))
  })
})

describe('GET /feed/[slug] — items composition', () => {
  it('forwards the items from buildShowFeedItems untouched, in order', () => {
    const items = [
      { title: 'A', url: 'https://tiered.tv/a', date: new Date(0), description: 'a' },
      { title: 'B', url: 'https://tiered.tv/b', date: new Date(0), description: 'b' },
    ]
    buildShowFeedItemsMock.mockReturnValue(items)
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    const [, passed] = renderRssMock.mock.calls[0] ?? []
    expect(passed).toBe(items)
  })

  it('renders with an empty items array — a show with no published seasons must still emit a valid feed', () => {
    buildShowFeedItemsMock.mockReturnValue([])
    const res = GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(res.status).toBe(200)
    expect(renderRssMock).toHaveBeenCalledTimes(1)
  })

  it('calls buildShowFeedItems with the bare show slug (no .xml suffix)', () => {
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(buildShowFeedItemsMock).toHaveBeenCalledWith('survivor')
  })

  it('calls buildShowFeedItems exactly once per request — no per-render fan-out', () => {
    GET(reqStub, { params: { slug: 'survivor.xml' } })
    expect(buildShowFeedItemsMock).toHaveBeenCalledTimes(1)
  })
})

describe('GET /feed/[slug] — ISR contract', () => {
  it('exports dynamic = "force-static" so the feed bakes at build, not per-request', () => {
    // Per-request rendering would burn the content loaders on every
    // RSS poll; force-static lets the loaders run at build and the
    // result sit on the CDN.
    expect(dynamic).toBe('force-static')
  })

  it('exports revalidate = 3600 — the hourly ISR window that matches sitemap.ts and feed.xml', () => {
    // The three discovery surfaces (sitemap.xml, feed.xml, the
    // per-show feeds) refresh on the same cadence so a content drain
    // that lands one without the others does not get noticed twice.
    expect(revalidate).toBe(3600)
  })
})

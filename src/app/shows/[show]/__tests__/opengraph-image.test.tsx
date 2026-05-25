import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows/[show]/opengraph-image is the per-show social-share card
// every link to /shows/<show> hits from Slack, iMessage, Twitter,
// Facebook, etc. The route handler resolves the show by slug, then
// hands a static eyebrow + the show's name + blurb + palette to the
// shared `buildOgImage` template (separately tested in
// `src/lib/og/__tests__/template.test.tsx`). This test pins the
// route's own contracts: the single notFound branch (unknown show),
// the static eyebrow string, the title + blurb pass-through, the
// palette extraction (paper/ink/primary only, no sibling pollution),
// and the Next-required segment-config exports.
//
// `@/content` and `@/lib/og/template` are mocked so the test drives
// every branch deterministically and captures what the route passes
// to `buildOgImage`. `next/navigation`'s `notFound` is mocked to a
// thrower that satisfies the route's `never` contract while letting
// us assert the 404 path.

const { getShowMock, buildOgImageMock, notFoundMock } = vi.hoisted(() => ({
  getShowMock: vi.fn(),
  buildOgImageMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/content', () => ({
  getShow: getShowMock,
}))
vi.mock('@/lib/og/template', () => ({
  buildOgImage: buildOgImageMock,
}))
vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}))

import OpenGraphImage, {
  alt,
  contentType,
  runtime,
  size,
} from '../opengraph-image'

const survivor = {
  slug: 'survivor',
  name: 'Survivor',
  blurb: '47 seasons. One torch at a time.',
  palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
}

const params = (show: string) => Promise.resolve({ show })

const lastCall = () =>
  buildOgImageMock.mock.calls[buildOgImageMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getShowMock.mockReset()
  buildOgImageMock.mockReset()
  notFoundMock.mockClear()
  getShowMock.mockReturnValue(survivor)
  buildOgImageMock.mockReturnValue({ __ogImage: true })
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "nodejs" — satori needs the node runtime, not edge', () => {
    // The root /opengraph-image uses runtime = 'edge', but the
    // per-show variant reads from the content layer (file-system
    // loaders) so it must declare nodejs explicitly. A regression
    // to 'edge' would 500 every show OG card at build time.
    expect(runtime).toBe('nodejs')
  })

  it('exports size = { width: 1200, height: 630 } — the OpenGraph 1.91:1 ratio Twitter + Facebook expect', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
  })

  it('exports contentType = "image/png" — readers cache by content-type', () => {
    expect(contentType).toBe('image/png')
  })

  it('exports alt with the brand promise — the literal string crawlers + screen readers surface', () => {
    expect(alt).toBe('tiered.tv — the seasons, ranked. no spoilers.')
  })
})

describe('OpenGraphImage — notFound branch', () => {
  it('calls notFound() when getShow returns null', async () => {
    getShowMock.mockReturnValue(null)
    await expect(
      OpenGraphImage({ params: params('made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('calls notFound() when getShow returns undefined — defensive against loader signature drift', async () => {
    getShowMock.mockReturnValue(undefined)
    await expect(
      OpenGraphImage({ params: params('made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('never invokes buildOgImage on the 404 path — no half-rendered card on the wire', async () => {
    getShowMock.mockReturnValue(null)
    await OpenGraphImage({ params: params('made-up') }).catch(() => {})
    expect(buildOgImageMock).not.toHaveBeenCalled()
  })

  it('does not call notFound() when the show resolves', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

describe('OpenGraphImage — content-layer resolution', () => {
  it('passes the URL show slug to getShow verbatim — no transformation', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(getShowMock).toHaveBeenCalledWith('survivor')
  })

  it('calls getShow exactly once per request — no loader fan-out', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(getShowMock).toHaveBeenCalledTimes(1)
  })
})

describe('OpenGraphImage — eyebrow, title, blurb pass-through', () => {
  it('uses the static eyebrow "tiered.tv · Show" — the literal copy every show card surfaces', async () => {
    // The eyebrow is intentionally static (not derived from the
    // show, not localized) — every show share card reads the same
    // wayfinder. A regression to a derived string would let one
    // show's eyebrow drift while the others stayed canonical.
    await OpenGraphImage({ params: params('survivor') })
    expect(lastCall()?.eyebrow).toBe('tiered.tv · Show')
  })

  it('passes show.name verbatim as the title — not show.slug', async () => {
    // The slug is kebab-case (e.g. "top-chef") and reads wrong as
    // headline copy. The OG title must be the show's human name.
    getShowMock.mockReturnValue({
      slug: 'top-chef',
      name: 'Top Chef',
      blurb: 'Twenty seasons of knife skills.',
      palette: { paper: '#0E0B08', ink: '#F2EADB', primary: '#E8B65A' },
    })
    await OpenGraphImage({ params: params('top-chef') })
    expect(lastCall()?.title).toBe('Top Chef')
  })

  it('passes show.blurb verbatim as the blurb — the short hero subtitle from frontmatter', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(lastCall()?.blurb).toBe('47 seasons. One torch at a time.')
  })

  it('does not synthesize a fallback blurb — passes blurb through even if the show defines a very short one', async () => {
    getShowMock.mockReturnValue({
      slug: 'survivor',
      name: 'Survivor',
      blurb: 'One.',
      palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
    })
    await OpenGraphImage({ params: params('survivor') })
    expect(lastCall()?.blurb).toBe('One.')
  })
})

describe('OpenGraphImage — palette pass-through', () => {
  it('passes the show palette through unchanged — paper, ink, primary all in the same shape', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(lastCall()?.palette).toEqual({
      paper: '#0E2A2A',
      ink: '#EFE2BD',
      primary: '#D55E36',
    })
  })

  it('extracts only paper/ink/primary — does not pollute with sibling keys from show.palette', async () => {
    // A real Show frontmatter object's palette is a plain object,
    // but the route must build a fresh {paper, ink, primary} so
    // future palette siblings (e.g. an accent color) don't leak
    // into the OG factory by reference.
    getShowMock.mockReturnValue({
      ...survivor,
      palette: {
        paper: '#0E2A2A',
        ink: '#EFE2BD',
        primary: '#D55E36',
        // hypothetical future siblings — must not appear on the
        // palette object the route hands to buildOgImage.
        accent: '#ff0000',
        muted: '#777777',
      } as unknown as typeof survivor.palette,
    })
    await OpenGraphImage({ params: params('survivor') })
    const palette = lastCall()?.palette
    expect(Object.keys(palette ?? {}).sort()).toEqual([
      'ink',
      'paper',
      'primary',
    ])
  })

  it('passes the correct palette per show — does not cache a previous show\'s palette', async () => {
    // Two back-to-back renders with different shows. Each must
    // receive its own palette, not a leak from the prior call.
    await OpenGraphImage({ params: params('survivor') })
    const survivorPalette = lastCall()?.palette
    getShowMock.mockReturnValue({
      slug: 'top-chef',
      name: 'Top Chef',
      blurb: 'Twenty seasons of knife skills.',
      palette: { paper: '#FFFFFF', ink: '#111111', primary: '#999999' },
    })
    await OpenGraphImage({ params: params('top-chef') })
    const topChefPalette = lastCall()?.palette
    expect(survivorPalette).toEqual({
      paper: '#0E2A2A',
      ink: '#EFE2BD',
      primary: '#D55E36',
    })
    expect(topChefPalette).toEqual({
      paper: '#FFFFFF',
      ink: '#111111',
      primary: '#999999',
    })
  })
})

describe('OpenGraphImage — happy path invariants', () => {
  it('invokes buildOgImage exactly once per request — no fan-out, no double-render', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(buildOgImageMock).toHaveBeenCalledTimes(1)
  })

  it('returns the value buildOgImage produces — the route is a pure composer', async () => {
    const sentinel = { __captured: true }
    buildOgImageMock.mockReturnValue(sentinel)
    const result = await OpenGraphImage({ params: params('survivor') })
    expect(result).toBe(sentinel)
  })

  it('passes exactly { eyebrow, title, blurb, palette } to buildOgImage — no extra keys, none missing', async () => {
    await OpenGraphImage({ params: params('survivor') })
    expect(Object.keys(lastCall() ?? {}).sort()).toEqual([
      'blurb',
      'eyebrow',
      'palette',
      'title',
    ])
  })
})

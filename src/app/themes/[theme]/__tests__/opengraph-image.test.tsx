import { beforeEach, describe, expect, it, vi } from 'vitest'

// /themes/[theme]/opengraph-image is the per-themed-list social-share
// card every link to /themes/<theme> hits from Slack, iMessage,
// Twitter, Facebook, etc. The route handler resolves the theme by
// slug, then hands a static eyebrow + the theme's title + description
// to the shared `buildOgImage` template (separately tested in
// `src/lib/og/__tests__/template.test.tsx`). This test pins the
// route's own contracts: the single notFound branch (unknown theme),
// the static eyebrow string, the title + blurb pass-through (no
// palette — themed lists ship ceremonial gold, not per-show paint),
// and the Next-required segment-config exports.
//
// `@/content` and `@/lib/og/template` are mocked so the test drives
// every branch deterministically and captures what the route passes
// to `buildOgImage`. `next/navigation`'s `notFound` is mocked to a
// thrower that satisfies the route's `never` contract while letting
// us assert the 404 path.

const { getThemeMock, buildOgImageMock, notFoundMock } = vi.hoisted(() => ({
  getThemeMock: vi.fn(),
  buildOgImageMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/content', () => ({
  getTheme: getThemeMock,
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

const bestPremieres = {
  slug: 'best-premieres',
  title: 'Best Premieres',
  description:
    'The episodes that knew exactly what kind of show they were going to be.',
}

const params = (theme: string) => Promise.resolve({ theme })

const lastCall = () =>
  buildOgImageMock.mock.calls[buildOgImageMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getThemeMock.mockReset()
  buildOgImageMock.mockReset()
  notFoundMock.mockClear()
  getThemeMock.mockReturnValue(bestPremieres)
  buildOgImageMock.mockReturnValue({ __ogImage: true })
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "nodejs" — satori needs the node runtime, not edge', () => {
    // The root /opengraph-image uses runtime = 'edge', but the
    // per-themed-list variant reads from the content layer
    // (file-system loaders) so it must declare nodejs explicitly. A
    // regression to 'edge' would 500 every list OG card at build time.
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
  it('calls notFound() when getTheme returns null', async () => {
    getThemeMock.mockReturnValue(null)
    await expect(
      OpenGraphImage({ params: params('made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('calls notFound() when getTheme returns undefined — defensive against loader signature drift', async () => {
    getThemeMock.mockReturnValue(undefined)
    await expect(
      OpenGraphImage({ params: params('made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('never invokes buildOgImage on the 404 path — no half-rendered card on the wire', async () => {
    getThemeMock.mockReturnValue(null)
    await OpenGraphImage({ params: params('made-up') }).catch(() => {})
    expect(buildOgImageMock).not.toHaveBeenCalled()
  })

  it('does not call notFound() when the theme resolves', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

describe('OpenGraphImage — content-layer resolution', () => {
  it('passes the URL theme slug to getTheme verbatim — no transformation', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(getThemeMock).toHaveBeenCalledWith('best-premieres')
  })

  it('calls getTheme exactly once per request — no loader fan-out', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(getThemeMock).toHaveBeenCalledTimes(1)
  })
})

describe('OpenGraphImage — eyebrow, title, blurb pass-through', () => {
  it('uses the static eyebrow "tiered.tv · Themed list" — the literal copy every list card surfaces', async () => {
    // The eyebrow is intentionally static (not derived from the
    // theme, not localized) — every themed-list share card reads the
    // same wayfinder. A regression to a derived string would let one
    // list's eyebrow drift while the others stayed canonical.
    await OpenGraphImage({ params: params('best-premieres') })
    expect(lastCall()?.eyebrow).toBe('tiered.tv · Themed list')
  })

  it('passes theme.title verbatim as the title — not theme.slug', async () => {
    // The slug is kebab-case (e.g. "best-premieres") and reads wrong
    // as headline copy. The OG title must be the list's human title.
    getThemeMock.mockReturnValue({
      slug: 'best-finales',
      title: 'Best Finales',
      description: 'The endings that earned their last torch.',
    })
    await OpenGraphImage({ params: params('best-finales') })
    expect(lastCall()?.title).toBe('Best Finales')
  })

  it('passes theme.description verbatim as the blurb — the curator-authored editorial subtitle', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(lastCall()?.blurb).toBe(
      'The episodes that knew exactly what kind of show they were going to be.',
    )
  })

  it('does not synthesize a fallback blurb — passes description through even when very short', async () => {
    getThemeMock.mockReturnValue({
      slug: 'best-premieres',
      title: 'Best Premieres',
      description: 'One.',
    })
    await OpenGraphImage({ params: params('best-premieres') })
    expect(lastCall()?.blurb).toBe('One.')
  })
})

describe('OpenGraphImage — happy path invariants', () => {
  it('invokes buildOgImage exactly once per request — no fan-out, no double-render', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(buildOgImageMock).toHaveBeenCalledTimes(1)
  })

  it('returns the value buildOgImage produces — the route is a pure composer', async () => {
    const sentinel = { __captured: true }
    buildOgImageMock.mockReturnValue(sentinel)
    const result = await OpenGraphImage({ params: params('best-premieres') })
    expect(result).toBe(sentinel)
  })

  it('passes exactly { eyebrow, title, blurb } to buildOgImage — no extra keys, none missing (themed lists ship no palette, unlike per-show cards)', async () => {
    await OpenGraphImage({ params: params('best-premieres') })
    expect(Object.keys(lastCall() ?? {}).sort()).toEqual([
      'blurb',
      'eyebrow',
      'title',
    ])
  })

  it('does not pass a palette key — themed lists carry no per-show paint, the OG factory must receive { eyebrow, title, blurb } only', async () => {
    // Per-show OG cards extract {paper, ink, primary} from show.palette;
    // themed-list cards intentionally do not, because the canonical
    // /themes design ships in ceremonial gold rather than per-list
    // palette. A regression that started spreading palette through
    // would let an unrelated theme field pollute the OG factory.
    await OpenGraphImage({ params: params('best-premieres') })
    expect(lastCall()).not.toHaveProperty('palette')
  })
})

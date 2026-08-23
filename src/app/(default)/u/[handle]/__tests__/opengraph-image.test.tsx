import { beforeEach, describe, expect, it, vi } from 'vitest'

// /u/[handle]/opengraph-image is the per-profile social-share card
// every link to /u/<handle> hits from Slack, iMessage, Twitter, etc.
// Before this route existed, sharing a member's profile fell back to
// the sitewide default OG (identical to the homepage's card) — the
// only page family walked by CRITIQUE pass-89 without a bespoke
// per-route image, unlike /shows/[show], /themes/[theme], and
// /shows/[show]/season/[slug]. This route resolves the profile via
// the same `getProfileActivity` RPC the page itself reads, then
// hands a static eyebrow + handle/display-name + a participation-
// count blurb to the shared `buildOgImage` template (separately
// tested at `src/lib/og/__tests__/template.test.tsx`). This test
// pins: the notFound branch (unknown handle), the display-name vs.
// handle fallback, the populated vs. empty-record blurb branches,
// the participation-count singular/plural phrasing, and the
// Next-required segment-config exports.
//
// `@/lib/supabase/server` and `@/lib/og/template` are mocked so the
// test drives every branch deterministically. `publicDisplayName`
// and `isPopulatedProfile` are the real `@/lib/profile/context`
// implementations (pure functions, already covered by their own
// unit tests) — mocking them here would just re-assert their own
// tests instead of this route's composition. `next/navigation`'s
// `notFound` is mocked to a thrower that satisfies the route's
// `never` contract while letting us assert the 404 path.

const { getProfileActivityMock, buildOgImageMock, notFoundMock } = vi.hoisted(
  () => ({
    getProfileActivityMock: vi.fn(),
    buildOgImageMock: vi.fn(),
    notFoundMock: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND')
    }),
  }),
)

vi.mock('@/lib/supabase/server', () => ({
  getProfileActivity: getProfileActivityMock,
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
  dynamic,
  runtime,
  size,
} from '../opengraph-image'

const populatedActivity = {
  handle: 'e2e',
  displayName: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  publishedCommentCount: 3,
  votedSeasonCount: 12,
  votedShowCount: 4,
  recentComments: [],
}

const params = (handle: string) => Promise.resolve({ handle })

const lastCall = () =>
  buildOgImageMock.mock.calls[buildOgImageMock.mock.calls.length - 1]?.[0]

beforeEach(() => {
  getProfileActivityMock.mockReset()
  buildOgImageMock.mockReset()
  notFoundMock.mockClear()
  getProfileActivityMock.mockResolvedValue(populatedActivity)
  buildOgImageMock.mockReturnValue({ __ogImage: true })
})

describe('segment-config exports — Next.js static analysis contract', () => {
  it('exports runtime = "nodejs" — the route hits Supabase via the server client, not edge-safe by convention with its content-layer siblings', () => {
    expect(runtime).toBe('nodejs')
  })

  it('exports dynamic = "force-dynamic" — without generateStaticParams this dynamic-segment route is otherwise static-eligible, and would permanently cache whichever response (including a stale notFound 404) the first request produced; mirrors the sibling page.tsx guard (critique pass-136)', () => {
    expect(dynamic).toBe('force-dynamic')
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
  it('calls notFound() when getProfileActivity returns null (unknown handle)', async () => {
    getProfileActivityMock.mockResolvedValue(null)
    await expect(
      OpenGraphImage({ params: params('made-up') }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('never invokes buildOgImage on the 404 path — no half-rendered card on the wire', async () => {
    getProfileActivityMock.mockResolvedValue(null)
    await OpenGraphImage({ params: params('made-up') }).catch(() => {})
    expect(buildOgImageMock).not.toHaveBeenCalled()
  })

  it('does not call notFound() when the profile resolves', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

describe('OpenGraphImage — profile resolution', () => {
  it('passes the URL handle to getProfileActivity verbatim — no transformation', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(getProfileActivityMock).toHaveBeenCalledWith({ handle: 'e2e' })
  })

  it('calls getProfileActivity exactly once per request — no RPC fan-out', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(getProfileActivityMock).toHaveBeenCalledTimes(1)
  })
})

describe('OpenGraphImage — eyebrow + title', () => {
  it('uses the static eyebrow "tiered.tv · Member" — the literal copy every profile card surfaces', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.eyebrow).toBe('tiered.tv · Member')
  })

  it('falls back to "@handle" as the title when no public display name is set', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.title).toBe('@e2e')
  })

  it('prefers a public display name as the title when set', async () => {
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      displayName: 'Riley',
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.title).toBe('Riley')
  })

  it('falls back to "@handle" when the stored display name is not public (contains "@")', async () => {
    // publicDisplayName() treats any value containing "@" as an
    // unpublished Auth0 default (e.g. a raw email), same guard the
    // page itself relies on.
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      displayName: 'someone@example.com',
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.title).toBe('@e2e')
  })
})

describe('OpenGraphImage — blurb branches', () => {
  it('renders a participation-count blurb for a populated profile', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.blurb).toBe('12 seasons voted · 3 comments · 4 shows')
  })

  it('singularizes each count correctly at exactly 1', async () => {
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      votedSeasonCount: 1,
      publishedCommentCount: 1,
      votedShowCount: 1,
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.blurb).toBe('1 season voted · 1 comment · 1 show')
  })

  it('renders the empty-record blurb when the profile has no votes or published comments', async () => {
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      publishedCommentCount: 0,
      votedSeasonCount: 0,
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.blurb).toBe(
      'A reader on tiered.tv. Nothing on the public record yet.',
    )
  })

  it('treats a profile with only comments (no votes) as populated', async () => {
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      publishedCommentCount: 1,
      votedSeasonCount: 0,
      votedShowCount: 0,
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.blurb).toBe('0 seasons voted · 1 comment · 0 shows')
  })

  it('treats a profile with only votes (no published comments) as populated', async () => {
    getProfileActivityMock.mockResolvedValue({
      ...populatedActivity,
      publishedCommentCount: 0,
      votedSeasonCount: 5,
    })
    await OpenGraphImage({ params: params('e2e') })
    expect(lastCall()?.blurb).toBe('5 seasons voted · 0 comments · 4 shows')
  })
})

describe('OpenGraphImage — happy path invariants', () => {
  it('invokes buildOgImage exactly once per request — no fan-out, no double-render', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(buildOgImageMock).toHaveBeenCalledTimes(1)
  })

  it('returns the value buildOgImage produces — the route is a pure composer', async () => {
    const sentinel = { __captured: true }
    buildOgImageMock.mockReturnValue(sentinel)
    const result = await OpenGraphImage({ params: params('e2e') })
    expect(result).toBe(sentinel)
  })

  it('passes exactly { eyebrow, title, blurb } to buildOgImage — no palette (profiles are not show-tinted)', async () => {
    await OpenGraphImage({ params: params('e2e') })
    expect(Object.keys(lastCall() ?? {}).sort()).toEqual([
      'blurb',
      'eyebrow',
      'title',
    ])
  })
})

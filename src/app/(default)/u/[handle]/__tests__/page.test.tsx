import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// /u/[handle] is the public reader profile (phase 38). It resolves a
// handle → users row via the profile_activity Supabase RPC, renders a
// spoiler-safe activity surface, and carries three contracts that a
// hermetic e2e walk cannot pin from the outside:
//   (1) the notFound() branch fires ONLY on a genuinely-unknown handle
//       — a real member who isn't the signed-in viewer must still
//       render for any visitor (the phase-38 "404 only on unknown"
//       rule); e2e only ever walks the e2e user's own populated page.
//   (2) the noIndex discipline — empty profiles stay out of the index
//       (no thin-content pages) while populated ones are indexable; the
//       walk reads rendered pages, not the Metadata object.
//   (3) self-view detection — the signed-in viewer's derived handle is
//       matched against the profile handle to gate the empty-state CTA
//       (and only then is getFeaturedShow()/getCanon() reached); e2e
//       sees one viewer, not the cross-viewer branch.
// Plus the PII guard (publicDisplayName drops email-shaped names before
// they reach the byline + JSON-LD) and the JSON-LD-only-when-populated
// rule.
//
// The content loaders (@/content), the auth boundary (auth0.getSession),
// and the Supabase boundary (getProfileActivity) are mocked so each
// branch is driven deterministically and the never-call-for-non-self
// guard is observable by call count. The four profile view components
// are stubbed so the page's prop-wiring is inspectable by reference.
// Left REAL: the pure shaping helpers (@/lib/profile/context), the SEO
// builder (@/lib/seo — so a canonicalUrl / noIndex regression surfaces
// here, not just in the helper's own test), formatWhen, and
// headerUserFromSession (so self-view runs through the actual
// session → handle derivation).

const {
  getProfileActivityMock,
  getSessionMock,
  getShowMock,
  getSeasonMock,
  getCanonMock,
  getFeaturedShowMock,
  notFoundMock,
  ProfileHeaderMock,
  ProfileStatsMock,
  ProfileCommentsMock,
  ProfileEmptyMock,
} = vi.hoisted(() => ({
  getProfileActivityMock: vi.fn(),
  getSessionMock: vi.fn(),
  getShowMock: vi.fn(),
  getSeasonMock: vi.fn(),
  getCanonMock: vi.fn(),
  getFeaturedShowMock: vi.fn(),
  notFoundMock: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  ProfileHeaderMock: vi.fn(
    (p: {
      handle: string
      displayName: string | null
      memberSince: string
      isSelfView: boolean
    }) => (
      <div
        data-testid="profile-header"
        data-handle={p.handle}
        data-display={p.displayName ?? '__null__'}
        data-self-view={String(p.isSelfView)}
      />
    ),
  ),
  ProfileStatsMock: vi.fn(() => <div data-testid="profile-stats" />),
  ProfileCommentsMock: vi.fn(
    (_p: {
      comments: Array<{
        id: string
        excerpt: string
        when: string
        context: { label: string; href: string } | null
      }>
    }) => <div data-testid="profile-comments" />,
  ),
  ProfileEmptyMock: vi.fn(
    (p: { selfView?: { showName: string; showHref: string } }) => (
      <div
        data-testid="profile-empty"
        data-self-view={p.selfView ? 'true' : 'false'}
        data-cta-href={p.selfView?.showHref ?? ''}
      />
    ),
  ),
}))

vi.mock('@/lib/supabase/server', () => ({
  getProfileActivity: getProfileActivityMock,
}))
vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))
vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}))
vi.mock('@/content', () => ({
  getShow: getShowMock,
  getSeason: getSeasonMock,
  getCanon: getCanonMock,
  getFeaturedShow: getFeaturedShowMock,
}))
vi.mock('@/components/profile', () => ({
  ProfileHeader: ProfileHeaderMock,
  ProfileStats: ProfileStatsMock,
  ProfileComments: ProfileCommentsMock,
  ProfileEmpty: ProfileEmptyMock,
}))

import UserProfilePage, { dynamic, generateMetadata } from '../page'

// --------------------------------------------------------------------
// Fixtures
// --------------------------------------------------------------------

type RawComment = {
  id: string
  body: string
  created_at: string
  target_type: 'season' | 'comment'
  target_id: string
}

type Activity = {
  handle: string
  displayName: string | null
  createdAt: string
  publishedCommentCount: number
  votedSeasonCount: number
  votedShowCount: number
  recentComments: RawComment[]
}

const baseActivity = (over: Partial<Activity> = {}): Activity => ({
  handle: 'reader',
  displayName: 'A Reader',
  createdAt: '2026-05-01T00:00:00.000Z',
  publishedCommentCount: 0,
  votedSeasonCount: 0,
  votedShowCount: 0,
  recentComments: [],
  ...over,
})

const populatedActivity = (over: Partial<Activity> = {}): Activity =>
  baseActivity({ publishedCommentCount: 3, votedSeasonCount: 2, ...over })

beforeEach(() => {
  getProfileActivityMock.mockReset()
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue(null)
  getShowMock.mockReset()
  getSeasonMock.mockReset()
  getCanonMock.mockReset()
  getFeaturedShowMock.mockReset()
  notFoundMock.mockClear()
  ProfileHeaderMock.mockClear()
  ProfileStatsMock.mockClear()
  ProfileCommentsMock.mockClear()
  ProfileEmptyMock.mockClear()
})

// --------------------------------------------------------------------
// Segment config
// --------------------------------------------------------------------

describe('/u/[handle] segment config', () => {
  it("exports dynamic = 'force-dynamic' — the page reads per-viewer auth state for self-view detection; static/ISR would serve one viewer's CTA to everyone", () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

// --------------------------------------------------------------------
// generateMetadata — title + canonical + the noIndex discipline
// --------------------------------------------------------------------

describe('/u/[handle] generateMetadata', () => {
  it('unknown handle → noIndex + "not found" description + the handle echoed in the title', async () => {
    getProfileActivityMock.mockResolvedValue(null)
    const meta = await generateMetadata({ params: { handle: 'ghost' } })
    expect(meta.title).toBe('@ghost')
    expect(String(meta.description)).toMatch(/not found/i)
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/u/ghost')
    expect(meta.robots).toEqual({ index: false, follow: false })
  })

  it('empty profile → noIndex (no thin-content page in the index) + "nothing on the public record" description', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'newbie' }))
    const meta = await generateMetadata({ params: { handle: 'newbie' } })
    expect(meta.title).toBe('@newbie')
    expect(String(meta.description)).toMatch(/nothing on the public record/i)
    expect(meta.robots).toEqual({ index: false, follow: false })
  })

  it('populated profile → indexable (robots undefined) + a description naming votes + comments', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'regular' }),
    )
    const meta = await generateMetadata({ params: { handle: 'regular' } })
    expect(meta.title).toBe('@regular')
    expect(meta.robots).toBeUndefined()
    expect(String(meta.description)).toMatch(/votes/i)
    expect(String(meta.description)).toMatch(/comments/i)
  })

  it('canonical uses the RESOLVED profile handle, not the raw URL param', async () => {
    // RPC normalizes the handle; the canonical must follow the row,
    // not whatever casing/whitespace the URL carried.
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'canonform' }),
    )
    const meta = await generateMetadata({ params: { handle: 'CanonForm' } })
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/u/canonform')
  })
})

// --------------------------------------------------------------------
// notFound — fires ONLY on a genuinely-unknown handle
// --------------------------------------------------------------------

describe('UserProfilePage — notFound branch', () => {
  it('unknown handle (activity null) → notFound() called; auth + content loaders never reached', async () => {
    getProfileActivityMock.mockResolvedValue(null)
    // notFound is a thrower in production; if it were a no-op the page
    // would continue into the auth + render path and crash on null.
    await expect(
      UserProfilePage({ params: { handle: 'ghost' } }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
    expect(getSessionMock).not.toHaveBeenCalled()
    expect(getFeaturedShowMock).not.toHaveBeenCalled()
  })

  it('a populated profile never calls notFound()', async () => {
    getProfileActivityMock.mockResolvedValue(populatedActivity({ handle: 'real' }))
    render(await UserProfilePage({ params: { handle: 'real' } }))
    expect(notFoundMock).not.toHaveBeenCalled()
  })

  it('a real member who is NOT the signed-in viewer still renders (anon session, no notFound)', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'someone-else' }),
    )
    getSessionMock.mockResolvedValue(null)
    render(await UserProfilePage({ params: { handle: 'someone-else' } }))
    expect(screen.getByTestId('user-profile')).toHaveAttribute(
      'data-handle',
      'someone-else',
    )
  })

  it('drains the profile_activity RPC exactly once per render', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'once' }))
    await UserProfilePage({ params: { handle: 'once' } })
    expect(getProfileActivityMock).toHaveBeenCalledTimes(1)
    expect(getProfileActivityMock).toHaveBeenCalledWith({ handle: 'once' })
  })

  it('a thrown auth0 session resolves to anon (no crash) — getSession failure is caught', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'resilient' }))
    getSessionMock.mockRejectedValue(new Error('auth0 down'))
    render(await UserProfilePage({ params: { handle: 'resilient' } }))
    // anon → not self-view → empty state with no CTA
    expect(screen.getByTestId('profile-empty')).toHaveAttribute(
      'data-self-view',
      'false',
    )
  })
})

// --------------------------------------------------------------------
// Populated vs empty rendering + JSON-LD
// --------------------------------------------------------------------

describe('UserProfilePage — populated vs empty rendering', () => {
  it('populated → stats + comments rendered, empty-state absent, ProfilePage JSON-LD present', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'active' }),
    )
    const { container } = render(
      await UserProfilePage({ params: { handle: 'active' } }),
    )
    expect(screen.getByTestId('profile-stats')).toBeInTheDocument()
    expect(screen.getByTestId('profile-comments')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-empty')).not.toBeInTheDocument()
    expect(screen.getByTestId('user-profile')).toHaveAttribute(
      'data-populated',
      'true',
    )
    const ld = container.querySelector('#ld-profile')
    expect(ld).not.toBeNull()
    expect(ld?.getAttribute('type')).toBe('application/ld+json')
    expect(ld?.textContent ?? '').toContain('"@type":"ProfilePage"')
  })

  it('empty → empty-state rendered, stats/comments absent, NO JSON-LD (a thin page emits no structured data)', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'blank' }))
    const { container } = render(
      await UserProfilePage({ params: { handle: 'blank' } }),
    )
    expect(screen.getByTestId('profile-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-stats')).not.toBeInTheDocument()
    expect(screen.queryByTestId('profile-comments')).not.toBeInTheDocument()
    expect(screen.getByTestId('user-profile')).toHaveAttribute(
      'data-populated',
      'false',
    )
    expect(container.querySelector('#ld-profile')).toBeNull()
  })

  it('a vote-only member (zero comments, one voted season) is populated — votes alone clear the index threshold', async () => {
    getProfileActivityMock.mockResolvedValue(
      baseActivity({ handle: 'voter', publishedCommentCount: 0, votedSeasonCount: 1 }),
    )
    render(await UserProfilePage({ params: { handle: 'voter' } }))
    expect(screen.getByTestId('profile-stats')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-empty')).not.toBeInTheDocument()
  })
})

// --------------------------------------------------------------------
// PII guard — email-shaped display names never reach the byline
// --------------------------------------------------------------------

describe('UserProfilePage — display-name PII guard (publicDisplayName wired)', () => {
  it('an email-shaped display_name is dropped to null before it reaches ProfileHeader', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'piiuser', displayName: 'reader@example.com' }),
    )
    render(await UserProfilePage({ params: { handle: 'piiuser' } }))
    expect(ProfileHeaderMock.mock.calls[0]?.[0]?.displayName).toBeNull()
  })

  it('a genuine human display name passes through to ProfileHeader intact', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'realname', displayName: 'Dana Q' }),
    )
    render(await UserProfilePage({ params: { handle: 'realname' } }))
    expect(ProfileHeaderMock.mock.calls[0]?.[0]?.displayName).toBe('Dana Q')
  })
})

// --------------------------------------------------------------------
// Self-view detection + empty-state CTA
// --------------------------------------------------------------------

describe('UserProfilePage — self-view detection', () => {
  it('signed-in viewer whose handle matches → isSelfView true on ProfileHeader', async () => {
    getProfileActivityMock.mockResolvedValue(populatedActivity({ handle: 'e2e' }))
    getSessionMock.mockResolvedValue({ user: { nickname: 'e2e' } })
    render(await UserProfilePage({ params: { handle: 'e2e' } }))
    expect(ProfileHeaderMock.mock.calls[0]?.[0]?.isSelfView).toBe(true)
  })

  it('a different signed-in viewer → isSelfView false and getFeaturedShow is NEVER reached', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'e2e' }),
    )
    getSessionMock.mockResolvedValue({ user: { nickname: 'someone-else' } })
    render(await UserProfilePage({ params: { handle: 'e2e' } }))
    expect(ProfileHeaderMock.mock.calls[0]?.[0]?.isSelfView).toBe(false)
    expect(getFeaturedShowMock).not.toHaveBeenCalled()
  })

  it('self-view + EMPTY profile → ProfileEmpty gets a CTA pointing at the featured show top-canon season', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'e2e' }))
    getSessionMock.mockResolvedValue({ user: { nickname: 'e2e' } })
    getFeaturedShowMock.mockReturnValue({ slug: 'survivor', name: 'Survivor' })
    getCanonMock.mockReturnValue({
      entries: [
        { rank: 2, season: 41 },
        { rank: 1, season: 20 },
      ],
    })
    getSeasonMock.mockReturnValue({ slug: 'heroes-vs-villains' })
    render(await UserProfilePage({ params: { handle: 'e2e' } }))
    const empty = screen.getByTestId('profile-empty')
    expect(empty).toHaveAttribute('data-self-view', 'true')
    expect(empty).toHaveAttribute(
      'data-cta-href',
      '/shows/survivor/season/heroes-vs-villains',
    )
  })

  it('self-view + empty + no resolvable canon season → CTA falls back to the show home', async () => {
    getProfileActivityMock.mockResolvedValue(baseActivity({ handle: 'e2e' }))
    getSessionMock.mockResolvedValue({ user: { nickname: 'e2e' } })
    getFeaturedShowMock.mockReturnValue({ slug: 'survivor', name: 'Survivor' })
    getCanonMock.mockReturnValue(null)
    render(await UserProfilePage({ params: { handle: 'e2e' } }))
    expect(screen.getByTestId('profile-empty')).toHaveAttribute(
      'data-cta-href',
      '/shows/survivor',
    )
  })

  it('self-view + POPULATED profile → no empty-state CTA work (getFeaturedShow not reached)', async () => {
    getProfileActivityMock.mockResolvedValue(populatedActivity({ handle: 'e2e' }))
    getSessionMock.mockResolvedValue({ user: { nickname: 'e2e' } })
    render(await UserProfilePage({ params: { handle: 'e2e' } }))
    expect(getFeaturedShowMock).not.toHaveBeenCalled()
  })
})

// --------------------------------------------------------------------
// Comment context resolution — season targets get clean slug hrefs
// --------------------------------------------------------------------

describe('UserProfilePage — comment context resolution', () => {
  const seasonComment: RawComment = {
    id: 'c1',
    body: 'A great season of television.',
    created_at: '2026-05-10T00:00:00.000Z',
    target_type: 'season',
    target_id: 'survivor:20',
  }
  const replyComment: RawComment = {
    id: 'c2',
    body: 'Agreed with the above.',
    created_at: '2026-05-11T00:00:00.000Z',
    target_type: 'comment',
    target_id: 'some-uuid',
  }

  it('a season comment resolves a label + slug-canonical href via getShow/getSeason', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'commenter', recentComments: [seasonComment] }),
    )
    getShowMock.mockReturnValue({ slug: 'survivor', name: 'Survivor' })
    getSeasonMock.mockReturnValue({ slug: 'heroes-vs-villains' })
    render(await UserProfilePage({ params: { handle: 'commenter' } }))
    const comments = ProfileCommentsMock.mock.calls[0]?.[0]?.comments
    expect(comments).toHaveLength(1)
    expect(comments?.[0]?.id).toBe('c1')
    expect(comments?.[0]?.context).toEqual({
      label: 'Survivor · Season 20',
      href: '/shows/survivor/season/heroes-vs-villains',
    })
  })

  it('a reply (target_type comment) carries null context — no season to point at', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'replier', recentComments: [replyComment] }),
    )
    render(await UserProfilePage({ params: { handle: 'replier' } }))
    const comments = ProfileCommentsMock.mock.calls[0]?.[0]?.comments
    expect(comments).toHaveLength(1)
    expect(comments?.[0]?.context).toBeNull()
    // a reply must not trigger a content-loader lookup
    expect(getShowMock).not.toHaveBeenCalled()
  })

  it('a season comment whose season is not in the catalog → null context (no broken href)', async () => {
    getProfileActivityMock.mockResolvedValue(
      populatedActivity({ handle: 'orphan', recentComments: [seasonComment] }),
    )
    getShowMock.mockReturnValue({ slug: 'survivor', name: 'Survivor' })
    getSeasonMock.mockReturnValue(null)
    render(await UserProfilePage({ params: { handle: 'orphan' } }))
    const comments = ProfileCommentsMock.mock.calls[0]?.[0]?.comments
    expect(comments).toHaveLength(1)
    expect(comments?.[0]?.context).toBeNull()
  })
})

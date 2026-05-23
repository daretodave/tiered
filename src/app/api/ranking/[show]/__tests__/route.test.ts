import { beforeEach, describe, expect, it, vi } from 'vitest'

// GET /api/ranking/[show] is the contracted public read aggregate
// (locked URL contract — bearings.md / spec.md: "cached aggregate,
// served via ISR"). The show page polls it on mount so the live
// community ranking shape — order, approval, voteCount, trend — is
// always fresh, closing the three vote bugs phase 35 resolved. The
// hermetic e2e suite (apps/e2e/tests/ranking-api.spec.ts) walks the
// route, but it can only exercise the happy path against the live
// canon-mirror fallback — the route's own contracts are dark to it:
// the entry-shape projection (which drops the internal Season object,
// a defense-in-depth guard against leaking editorial frontmatter to
// every public poll), the top-level envelope keys, the 404
// unknown-show branch, the loader pass-through, and the force-dynamic
// contract. The content + community-ranking boundaries are mocked so
// the route's own behavior is what gets pinned.
const { getShowMock, getAllSeasonsMock, getCanonMock, getCommunityRankingMock } =
  vi.hoisted(() => ({
    getShowMock: vi.fn(),
    getAllSeasonsMock: vi.fn(),
    getCanonMock: vi.fn(),
    getCommunityRankingMock: vi.fn(),
  }))

vi.mock('@/content', () => ({
  getShow: getShowMock,
  getAllSeasons: getAllSeasonsMock,
  getCanon: getCanonMock,
}))

vi.mock('@/lib/community/ranking', () => ({
  getCommunityRanking: getCommunityRankingMock,
}))

import { GET, dynamic } from '../route'

function rankingRequest(): Request {
  return new Request('http://localhost/api/ranking/survivor', { method: 'GET' })
}

function ctx(slug: string): { params: Promise<{ show: string }> } {
  return { params: Promise.resolve({ show: slug }) }
}

const SHOW = {
  slug: 'survivor',
  name: 'Survivor',
  palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
}

// A minimal Season-shaped object — the route never inspects season
// fields beyond `number`, `slug`, and `title`, but the test fixture
// includes load-bearing-LOOKING internal fields (body_md, lede, pull,
// canonical_position) so the entry-projection defense-in-depth case
// can prove the route DOES NOT leak them to the public response.
const SEASON = {
  show: 'survivor',
  number: 20,
  slug: 'heroes-vs-villains',
  title: 'Heroes vs. Villains',
  body_md: 'INTERNAL EDITORIAL DRAFT — must never leak',
  lede: 'INTERNAL LEDE — must never leak',
  pull: 'INTERNAL PULL QUOTE — must never leak',
  canonical_position: 1,
  format_changes: [],
}

const CANON = { entries: [{ season: 20, rank: 1 }] }

function rankingEntry(over: Partial<{ rank: number; tag: string }> = {}) {
  return {
    rank: over.rank ?? 1,
    season: SEASON,
    tag: over.tag ?? '2010',
    score: 4.2,
    approval: 0.74,
    voteCount: 31,
    trend: 2,
  }
}

beforeEach(() => {
  getShowMock.mockReset()
  getShowMock.mockReturnValue(SHOW)
  getAllSeasonsMock.mockReset()
  getAllSeasonsMock.mockReturnValue([SEASON])
  getCanonMock.mockReset()
  getCanonMock.mockReturnValue(CANON)
  getCommunityRankingMock.mockReset()
  getCommunityRankingMock.mockResolvedValue({
    entries: [rankingEntry()],
    source: 'canon',
    votersThisWeek: 0,
    lastRecomputeAt: null,
    version: null,
  })
})

describe('GET /api/ranking/[show] — happy path + envelope', () => {
  it('returns 200 with the full response envelope on a known show', async () => {
    const res = await GET(rankingRequest(), ctx('survivor'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      ok: true,
      show: 'survivor',
      source: 'canon',
      votersThisWeek: 0,
      lastRecomputeAt: null,
      version: null,
    })
    expect(typeof body.generatedAt).toBe('string')
    expect(Array.isArray(body.entries)).toBe(true)
    expect(body.entries).toHaveLength(1)
  })

  it('echoes show slug from the resolved Show, not the raw URL param', async () => {
    // The route reports `show: show.slug` (post-lookup), so a
    // future routing layer that does any slug normalization stays
    // honest in the response.
    const aliased = { ...SHOW, slug: 'survivor' }
    getShowMock.mockReturnValue(aliased)
    const res = await GET(rankingRequest(), ctx('Survivor'))
    const body = await res.json()
    expect(body.show).toBe('survivor')
  })

  it('emits generatedAt as a round-trippable ISO string', async () => {
    const res = await GET(rankingRequest(), ctx('survivor'))
    const body = await res.json()
    expect(new Date(body.generatedAt).toISOString()).toBe(body.generatedAt)
  })

  it('flows source / votersThisWeek / lastRecomputeAt / version through verbatim', async () => {
    getCommunityRankingMock.mockResolvedValue({
      entries: [rankingEntry()],
      source: 'votes',
      votersThisWeek: 47,
      lastRecomputeAt: '2026-05-20T03:00:00.000Z',
      version: 9001,
    })
    const res = await GET(rankingRequest(), ctx('survivor'))
    const body = await res.json()
    expect(body.source).toBe('votes')
    expect(body.votersThisWeek).toBe(47)
    expect(body.lastRecomputeAt).toBe('2026-05-20T03:00:00.000Z')
    expect(body.version).toBe(9001)
  })
})

describe('GET /api/ranking/[show] — entry projection (no internal-leak guard)', () => {
  // The route projects each CommunityRankRow into a *public* shape
  // that drops the full Season object. A regression that spread
  // `...e.season` or returned the row verbatim would leak internal
  // frontmatter — body_md, lede, pull, canonical_position, every
  // editorial draft field — to every show-page poll.

  it('exposes only the public entry keys (rank, seasonNumber, seasonSlug, title, tag, score, approval, voteCount, trend)', async () => {
    const res = await GET(rankingRequest(), ctx('survivor'))
    const body = await res.json()
    const entry = body.entries[0]
    expect(Object.keys(entry).sort()).toEqual(
      [
        'approval',
        'rank',
        'score',
        'seasonNumber',
        'seasonSlug',
        'tag',
        'title',
        'trend',
        'voteCount',
      ].sort(),
    )
  })

  it('drops the internal Season object so editorial draft fields cannot leak', async () => {
    const res = await GET(rankingRequest(), ctx('survivor'))
    const body = await res.json()
    const entry = body.entries[0]
    expect(entry.season).toBeUndefined()
    // Defense-in-depth: even if a future projection spreads more
    // fields, the load-bearing-looking internal fields from the
    // fixture must not appear anywhere in the serialized response.
    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('INTERNAL EDITORIAL DRAFT')
    expect(serialized).not.toContain('INTERNAL LEDE')
    expect(serialized).not.toContain('INTERNAL PULL QUOTE')
  })

  it('derives seasonNumber + seasonSlug + title from the inner Season — not from any top-level row field', async () => {
    getCommunityRankingMock.mockResolvedValue({
      entries: [
        {
          rank: 5,
          season: {
            ...SEASON,
            number: 41,
            slug: 'new-era-i',
            title: 'New Era I',
          },
          tag: '2021',
          score: 1.1,
          approval: 0.5,
          voteCount: 8,
          trend: null,
        },
      ],
      source: 'votes',
      votersThisWeek: 0,
      lastRecomputeAt: null,
      version: null,
    })
    const res = await GET(rankingRequest(), ctx('survivor'))
    const body = await res.json()
    expect(body.entries[0].seasonNumber).toBe(41)
    expect(body.entries[0].seasonSlug).toBe('new-era-i')
    expect(body.entries[0].title).toBe('New Era I')
  })

  it('flows numeric + nullable fields through verbatim (score, approval, voteCount, trend) including nulls', async () => {
    getCommunityRankingMock.mockResolvedValue({
      entries: [
        {
          rank: 12,
          season: SEASON,
          tag: '2024',
          score: 0,
          approval: null,
          voteCount: 0,
          trend: null,
        },
      ],
      source: 'canon',
      votersThisWeek: 0,
      lastRecomputeAt: null,
      version: null,
    })
    const res = await GET(rankingRequest(), ctx('survivor'))
    const entry = (await res.json()).entries[0]
    expect(entry.rank).toBe(12)
    expect(entry.tag).toBe('2024')
    expect(entry.score).toBe(0)
    expect(entry.approval).toBeNull()
    expect(entry.voteCount).toBe(0)
    expect(entry.trend).toBeNull()
  })
})

describe('GET /api/ranking/[show] — unknown-show 404 branch', () => {
  // The validation gate runs before the DB read. A regression that
  // dropped the guard or moved it after getCommunityRanking would
  // either 500 against the canon-mirror's empty-fixture path or
  // serve an empty 200 — both worse than an honest 404.

  it('returns 404 unknown_show when getShow resolves null', async () => {
    getShowMock.mockReturnValue(null)
    const res = await GET(rankingRequest(), ctx('does-not-exist'))
    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: 'unknown_show',
    })
  })

  it('never reaches getCommunityRanking on an unknown show', async () => {
    getShowMock.mockReturnValue(null)
    await GET(rankingRequest(), ctx('does-not-exist'))
    expect(getCommunityRankingMock).not.toHaveBeenCalled()
    // Bonus: the loaders that would key off a bad slug also stay
    // un-reached when the gate fires correctly.
    expect(getAllSeasonsMock).not.toHaveBeenCalled()
    expect(getCanonMock).not.toHaveBeenCalled()
  })
})

describe('GET /api/ranking/[show] — loader pass-through', () => {
  // A regression that passed the URL param string instead of the
  // resolved Show would invalidate the canon-mirror fallback's
  // tag derivation (it keys on show.name, not show.slug); a
  // regression that swapped getAllSeasons / getCanon arguments
  // would silently surface the wrong show's data.

  it('calls getCommunityRanking with (resolved Show, seasons, canon) verbatim', async () => {
    const customSeasons = [{ ...SEASON, number: 1, slug: 'borneo' }]
    const customCanon = { entries: [{ season: 1, rank: 1 }] }
    getAllSeasonsMock.mockReturnValue(customSeasons)
    getCanonMock.mockReturnValue(customCanon)
    await GET(rankingRequest(), ctx('survivor'))
    expect(getCommunityRankingMock).toHaveBeenCalledWith(
      SHOW,
      customSeasons,
      customCanon,
    )
  })

  it('keys getAllSeasons + getCanon off the resolved show slug, not the URL param', async () => {
    // If the route ever started accepting URL-encoded casing or
    // aliasing, the loaders must see the canonical slug post-lookup.
    await GET(rankingRequest(), ctx('Survivor'))
    expect(getAllSeasonsMock).toHaveBeenCalledWith(SHOW.slug)
    expect(getCanonMock).toHaveBeenCalledWith(SHOW.slug)
  })

  it('forwards a null canon to getCommunityRanking when getCanon returns null', async () => {
    // The canon-mirror fallback accepts a null canon — every show
    // before a canon ships hits this branch.
    getCanonMock.mockReturnValue(null)
    await GET(rankingRequest(), ctx('survivor'))
    expect(getCommunityRankingMock).toHaveBeenCalledWith(
      SHOW,
      [SEASON],
      null,
    )
  })

  it('calls getCommunityRanking exactly once per valid request', async () => {
    await GET(rankingRequest(), ctx('survivor'))
    expect(getCommunityRankingMock).toHaveBeenCalledTimes(1)
  })
})

describe('GET /api/ranking/[show] — route contract', () => {
  it('declares force-dynamic so the ranking aggregate never bakes at build', () => {
    // Static-bake would freeze one show's ranking into the route
    // and serve stale data on every poll — exactly the staleness
    // bug the design rejected ISR caching to avoid (the route
    // header explains the call). The dynamic flag is the guard.
    expect(dynamic).toBe('force-dynamic')
  })

  it('awaits the async ctx.params (Next.js 15 routing contract)', async () => {
    // The handler signature is `(_req, ctx)` with `ctx.params` a
    // Promise. A regression that read `ctx.params.show` directly
    // would surface "Promise<{ show: string }>" as the slug,
    // 404-ing every request silently against a now-broken getShow
    // lookup. This case proves the await runs.
    let resolved = false
    const lateCtx: { params: Promise<{ show: string }> } = {
      params: new Promise((resolve) => {
        resolved = true
        resolve({ show: 'survivor' })
      }),
    }
    await GET(rankingRequest(), lateCtx)
    expect(resolved).toBe(true)
    expect(getShowMock).toHaveBeenCalledWith('survivor')
  })
})

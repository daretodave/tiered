import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the content loader boundary so the scorer is driven off
// hand-built docs rather than the on-disk content tree (cf. the
// established vi.mock pattern in src/content/__tests__/featured.test.ts).

vi.mock('@/content', () => ({
  getAllShows: vi.fn(),
  getAllSeasons: vi.fn(),
  getAllThemes: vi.fn(),
}))

import type { Season, Show, Theme } from '@/content'
import { getAllSeasons, getAllShows, getAllThemes } from '@/content'
import { groupByType, search, tokenize } from '../search'

const mockedShows = getAllShows as ReturnType<typeof vi.fn>
const mockedSeasons = getAllSeasons as ReturnType<typeof vi.fn>
const mockedThemes = getAllThemes as ReturnType<typeof vi.fn>

function show(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    tagline: 'Strangers on a beach play a social game.',
    blurb: 'One torch at a time.',
    ...overrides,
  } as unknown as Show
}

function season(overrides: Partial<Season> = {}): Season {
  return {
    show: 'survivor',
    number: 20,
    slug: 'heroes-vs-villains',
    title: 'Heroes vs. Villains',
    format_changes: [],
    blurb_md: 'A returnee season.',
    ...overrides,
  } as unknown as Season
}

function theme(overrides: Partial<Theme> = {}): Theme {
  return {
    slug: 'best-premieres',
    title: 'Best Premieres',
    description: 'Seasons that opened strong.',
    entries: [],
    ...overrides,
  } as unknown as Theme
}

beforeEach(() => {
  mockedShows.mockReset()
  mockedSeasons.mockReset()
  mockedThemes.mockReset()
  mockedShows.mockReturnValue([])
  mockedSeasons.mockReturnValue([])
  mockedThemes.mockReturnValue([])
})

describe('tokenize', () => {
  it('lowercases, splits on non-word runs, and drops 1-char tokens', () => {
    expect(tokenize('Heroes  vs.  Villains-20')).toEqual([
      'heroes',
      'vs',
      'villains',
      '20',
    ])
  })

  it('strips stop words', () => {
    expect(tokenize('the best of a season in the show')).toEqual([
      'best',
      'season',
      'show',
    ])
  })

  it('returns [] for empty / punctuation-only / single chars', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('  --- !! ')).toEqual([])
    expect(tokenize('a I x')).toEqual([])
  })
})

describe('search — query guard', () => {
  it('returns [] when the query tokenizes to nothing', () => {
    mockedShows.mockReturnValue([show()])
    expect(search('')).toEqual([])
    expect(search('the a of')).toEqual([])
    expect(mockedShows).not.toHaveBeenCalled()
  })
})

describe('search — show scoring', () => {
  it('matches name and slug at title weight; misses score nothing', () => {
    mockedShows.mockReturnValue([
      show({ slug: 'survivor', name: 'Survivor' }),
      show({ slug: 'top-chef', name: 'Top Chef' }),
    ])
    const hits = search('survivor')
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({
      type: 'show',
      slug: 'survivor',
      href: '/shows/survivor',
    })
    // name + slug both tokenize to "survivor" → 2 title-weight hits.
    expect(hits[0]!.score).toBe(20)
  })

  it('weights a title hit above a blurb-only hit', () => {
    mockedShows.mockReturnValue([
      show({ slug: 'a-show', name: 'Alpha', blurb: 'no match here' }),
      show({ slug: 'b-show', name: 'Beta', blurb: 'a torchlight tale' }),
    ])
    const titleHit = search('alpha')
    const blurbHit = search('torchlight')
    expect(titleHit[0]!.score).toBe(10)
    expect(blurbHit[0]!.score).toBe(2)
  })
})

describe('search — season scoring', () => {
  it('scores optional location/host and format_changes branches', () => {
    mockedShows.mockReturnValue([show()])
    mockedSeasons.mockReturnValue([
      season({
        title: 'The Australian Outback',
        location: 'Queensland',
        host: 'Jeff',
        format_changes: ['hidden idol introduced'],
        blurb_md: 'second season',
      }),
    ])
    const locHit = search('queensland')
    expect(locHit[0]).toMatchObject({
      type: 'season',
      href: '/shows/survivor/season/heroes-vs-villains',
    })
    expect(locHit[0]!.score).toBe(3) // META_WEIGHT
    expect(search('idol')[0]!.score).toBe(1) // BODY_WEIGHT from format_changes
  })

  it('matches the synthetic "<show> season <n>" meta field', () => {
    mockedShows.mockReturnValue([show()])
    mockedSeasons.mockReturnValue([season({ number: 20 })])
    const hits = search('survivor season 20')
    const seasonHit = hits.find((h) => h.type === 'season')
    expect(seasonHit).toBeDefined()
  })
})

describe('search — theme scoring', () => {
  it('scores theme title, description, and per-entry blurb/show', () => {
    mockedThemes.mockReturnValue([
      theme({
        title: 'Best Premieres',
        description: 'opened strong',
        entries: [
          {
            show: 'survivor',
            season: 20,
            rank: 1,
            title: 'HvV',
            blurb: 'a blistering opener',
          } as Theme['entries'][number],
        ],
      }),
    ])
    const t = search('premieres')
    expect(t[0]).toMatchObject({ type: 'theme', href: '/themes/best-premieres' })
    // "premieres" hits both the title and the slug ("best-premieres"),
    // each at TITLE_WEIGHT 10.
    expect(t[0]!.score).toBe(20)
    expect(search('blistering')[0]!.score).toBe(2) // entry blurb → BLURB_WEIGHT
  })
})

describe('search — ordering, limit, snippet', () => {
  it('orders by score desc, then type rank, then title', () => {
    // Slugs deliberately omit "opener" so every doc scores exactly
    // one TITLE_WEIGHT (10) hit — an exact tie that exercises the
    // type-rank then title tie-break ladder.
    mockedShows.mockReturnValue([
      show({ slug: 'zeta', name: 'Zeta Opener' }),
      show({ slug: 'alpha', name: 'Alpha Opener' }),
    ])
    mockedSeasons.mockReturnValue([])
    mockedThemes.mockReturnValue([
      theme({ slug: 'picks-list', title: 'Opener Picks', description: 'x' }),
    ])
    const hits = search('opener')
    expect(hits.map((h) => h.score)).toEqual([10, 10, 10])
    expect(hits.map((h) => h.type)).toEqual(['show', 'show', 'theme'])
    expect(hits[0]!.title).toBe('Alpha Opener')
    expect(hits[1]!.title).toBe('Zeta Opener')
  })

  it('honours the default limit of 20 and an explicit override', () => {
    mockedShows.mockReturnValue(
      Array.from({ length: 25 }, (_, i) =>
        show({ slug: `s${i}`, name: `Match show ${i}` }),
      ),
    )
    expect(search('match')).toHaveLength(20)
    expect(search('match', { limit: 3 })).toHaveLength(3)
  })

  it('builds an ellipsised window around the matched token', () => {
    const long = `${'x '.repeat(50)}needle ${'y '.repeat(50)}`.trim()
    mockedShows.mockReturnValue([
      show({ name: 'Plain', slug: 'plain', blurb: long }),
    ])
    const hit = search('needle')[0]!
    expect(hit.snippet).toContain('needle')
    expect(hit.snippet.startsWith('…')).toBe(true)
    expect(hit.snippet.endsWith('…')).toBe(true)
    expect(hit.snippet.length).toBeLessThan(long.length)
  })
})

describe('groupByType', () => {
  it('partitions hits into shows / seasons / themes', () => {
    mockedShows.mockReturnValue([show({ name: 'Match', slug: 'match' })])
    mockedSeasons.mockReturnValue([season({ title: 'Match season' })])
    mockedThemes.mockReturnValue([
      theme({ title: 'Match list', slug: 'match-list' }),
    ])
    const grouped = groupByType(search('match'))
    expect(grouped.shows).toHaveLength(1)
    expect(grouped.seasons).toHaveLength(1)
    expect(grouped.themes).toHaveLength(1)
    expect(grouped.shows[0]!.type).toBe('show')
  })
})

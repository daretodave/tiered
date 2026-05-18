import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the loader boundary so we can drive getFeaturedShow's three
// branches without spinning up a content tree (cf. the established
// vi.mock pattern in FeaturedThemes.test.tsx).

vi.mock('../loaders', () => ({
  getAllShows: vi.fn(),
}))

import type { Show } from '../schemas'
import { getFeaturedShow, getFeaturedShowSlug } from '../featured'
import { getAllShows } from '../loaders'

const mockedGetAllShows = getAllShows as ReturnType<typeof vi.fn>

function show(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    seasons: 47,
    status: 'airing',
    blurb: 'b',
    tagline: '47 seasons of strangers on a beach.',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: false,
    ...overrides,
  }
}

describe('getFeaturedShow', () => {
  beforeEach(() => {
    mockedGetAllShows.mockReset()
  })
  afterEach(() => {
    mockedGetAllShows.mockReset()
  })

  it('returns null when there are no shows', () => {
    mockedGetAllShows.mockReturnValue([])
    expect(getFeaturedShow()).toBeNull()
  })

  it('returns the show carrying featured: true', () => {
    const a = show({ slug: 'amazing-race', name: 'The Amazing Race', featured: false })
    const b = show({ slug: 'survivor', name: 'Survivor', featured: true })
    mockedGetAllShows.mockReturnValue([a, b])
    expect(getFeaturedShow()).toBe(b)
  })

  it('when more than one show is flagged, the first in array order wins', () => {
    const first = show({ slug: 'amazing-race', name: 'The Amazing Race', featured: true })
    const second = show({ slug: 'survivor', name: 'Survivor', featured: true })
    mockedGetAllShows.mockReturnValue([first, second])
    expect(getFeaturedShow()).toBe(first)
  })

  it('falls back to the first show overall when none are flagged', () => {
    const first = show({ slug: 'amazing-race', name: 'The Amazing Race', featured: false })
    const second = show({ slug: 'survivor', name: 'Survivor', featured: false })
    mockedGetAllShows.mockReturnValue([first, second])
    expect(getFeaturedShow()).toBe(first)
  })
})

describe('getFeaturedShowSlug', () => {
  beforeEach(() => {
    mockedGetAllShows.mockReset()
  })
  afterEach(() => {
    mockedGetAllShows.mockReset()
  })

  it('returns null when there are no shows', () => {
    mockedGetAllShows.mockReturnValue([])
    expect(getFeaturedShowSlug()).toBeNull()
  })

  it('returns the slug of the flagged show', () => {
    mockedGetAllShows.mockReturnValue([
      show({ slug: 'amazing-race', featured: false }),
      show({ slug: 'survivor', featured: true }),
    ])
    expect(getFeaturedShowSlug()).toBe('survivor')
  })

  it('returns the first show slug under the no-flag fallback', () => {
    mockedGetAllShows.mockReturnValue([
      show({ slug: 'amazing-race', featured: false }),
      show({ slug: 'survivor', featured: false }),
    ])
    expect(getFeaturedShowSlug()).toBe('amazing-race')
  })
})

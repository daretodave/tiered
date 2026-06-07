import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// /shows is the tier-list overview — generateMetadata's description
// is the snippet every crawler, share link, and rich result surfaces
// for the URL. Pass-11 /critique (#181) found the previously-shipped
// static copy "S tier is format-defining, A tier has the deep canon,
// B tier is in review" overclaimed against the rendered page: the
// catalog carries zero `tier: B` shows so TierSection drops the B
// rail, but the SEO snippet still named it.
//
// The fix derives the description from `getAllShows()` + the same
// "tier has members > 0" filter the page uses to gate TierSection,
// so the snippet can never name a tier that has no rail on the page.
// This test pins that derivation — for each catalog shape that
// generateMetadata might be called against, the description must
// name exactly the tiers that actually carry shows.
//
// `@/content` (getAllShows) is mocked via vi.hoisted + vi.mock so
// each case drives the helper deterministically. Bypassing the live
// content loader keeps the test hermetic — a future content drain
// that lands a B-tier show should NOT silently flip this test green;
// it should ship as a new case.

type FixtureShow = {
  slug: string
  tier: 'S' | 'A' | 'B'
  seasons: number
  // Minimum fields the runtime page render needs beyond tier/seasons.
  // Cast as `unknown` when threading into `getAllShows()` for the
  // render path — generateMetadata only needs slug/tier/seasons.
  name?: string
  palette?: { primary: string; ink: string; paper: string }
  status?: 'airing' | 'ended' | 'hiatus'
  blurb?: string
  tagline?: string
  network?: string
  est_year?: number
  genre_tag?: string
  featured?: boolean
}

const { getAllShowsMock, getCanonMock } = vi.hoisted(() => ({
  getAllShowsMock: vi.fn<() => FixtureShow[]>(),
  getCanonMock: vi.fn<(slug: string) => { last_revised?: string } | null>(),
}))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getAllShows: getAllShowsMock,
    getCanon: getCanonMock,
  }
})

import { generateMetadata, default as ShowsIndexPage } from '../page'

function fullShow(overrides: Partial<FixtureShow> = {}): FixtureShow {
  return {
    slug: 'survivor',
    tier: 'S',
    seasons: 47,
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    status: 'airing',
    blurb: 'b',
    tagline: 't',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

const survivor: FixtureShow = { slug: 'survivor', tier: 'S', seasons: 47 }
const amazingRace: FixtureShow = { slug: 'amazing-race', tier: 'A', seasons: 36 }
const newcomer: FixtureShow = { slug: 'newcomer', tier: 'B', seasons: 3 }

beforeEach(() => {
  getAllShowsMock.mockReset()
  getCanonMock.mockReset()
  getCanonMock.mockReturnValue(null)
})

describe('/shows generateMetadata — title + canonical', () => {
  it('document title is "All shows"', () => {
    getAllShowsMock.mockReturnValue([survivor])
    expect(generateMetadata().title).toBe('All shows')
  })

  it('canonical OpenGraph URL points at /shows', () => {
    getAllShowsMock.mockReturnValue([survivor])
    const meta = generateMetadata()
    expect(meta.alternates?.canonical).toMatch(/\/shows$/)
  })
})

describe('/shows generateMetadata — description derived from populated tiers', () => {
  it('opens with the standing "Reality-TV canons" sentence on every catalog shape', () => {
    for (const shape of [
      [survivor],
      [survivor, amazingRace],
      [survivor, amazingRace, newcomer],
    ]) {
      getAllShowsMock.mockReturnValue(shape)
      const meta = generateMetadata()
      expect(meta.description).toMatch(
        /^Reality-TV canons, sorted by how settled the ranking is\./,
      )
    }
  })

  it('names S only when only S tier has members', () => {
    getAllShowsMock.mockReturnValue([survivor])
    const description = String(generateMetadata().description)
    expect(description).toContain('S tier is format-defining')
    expect(description).not.toContain('A tier')
    expect(description).not.toContain('B tier')
  })

  it('names S + A when the catalog matches today (zero B tier) — no overclaim', () => {
    getAllShowsMock.mockReturnValue([survivor, amazingRace])
    expect(generateMetadata().description).toBe(
      'Reality-TV canons, sorted by how settled the ranking is. S tier is format-defining, A tier has the deep canon.',
    )
  })

  it('names every tier when every tier has members', () => {
    getAllShowsMock.mockReturnValue([survivor, amazingRace, newcomer])
    expect(generateMetadata().description).toBe(
      'Reality-TV canons, sorted by how settled the ranking is. S tier is format-defining, A tier has the deep canon, B tier is in review.',
    )
  })

  it('drops S cleanly when only A and B have members — no orphaned "S tier" mention', () => {
    getAllShowsMock.mockReturnValue([amazingRace, newcomer])
    const description = String(generateMetadata().description)
    expect(description).toContain('A tier')
    expect(description).toContain('B tier')
    expect(description).not.toContain('S tier')
  })

  it('never names a tier with zero members — the invariant the /critique #181 fix locks in', () => {
    const cases: Array<{
      shape: FixtureShow[]
      tiers: Array<'S' | 'A' | 'B'>
    }> = [
      { shape: [survivor], tiers: ['S'] },
      { shape: [amazingRace], tiers: ['A'] },
      { shape: [newcomer], tiers: ['B'] },
      { shape: [survivor, amazingRace], tiers: ['S', 'A'] },
      { shape: [survivor, newcomer], tiers: ['S', 'B'] },
      { shape: [amazingRace, newcomer], tiers: ['A', 'B'] },
      { shape: [survivor, amazingRace, newcomer], tiers: ['S', 'A', 'B'] },
    ]
    const ALL_TIERS: Array<'S' | 'A' | 'B'> = ['S', 'A', 'B']
    for (const { shape, tiers } of cases) {
      getAllShowsMock.mockReturnValue(shape)
      const description = String(generateMetadata().description)
      const absent = ALL_TIERS.filter((t) => !tiers.includes(t))
      for (const tier of absent) {
        expect(description).not.toContain(`${tier} tier`)
      }
    }
  })

  it('emits only the opener when the catalog is empty — no tier overclaim, no crash', () => {
    getAllShowsMock.mockReturnValue([])
    expect(generateMetadata().description).toBe(
      'Reality-TV canons, sorted by how settled the ranking is.',
    )
  })
})

// Critique pass-27 HIGH (#288): the /shows hero `SHOWS REVISED` stat
// must source its month from the max canon `last_revised` ISO across
// the catalog — same path the show page reads — not from build-time
// `new Date()`. Mirrors the home pass-24 #269 closure one surface up.
// (Label renamed `Last revision` → `Index revised` at pass-35 #336, then
// `Index revised` → `Shows revised` at pass-39 #347 to differentiate
// the per-corpus freshness from the sibling /themes `Lists revised`.
// The data-source contract this block pins is unchanged.)
describe('/shows hero Shows revised sourced from catalog canons', () => {
  it('renders the latest canon revision month across the roster', () => {
    getAllShowsMock.mockReturnValue([
      fullShow({ slug: 'a' }),
      fullShow({ slug: 'b' }),
      fullShow({ slug: 'c' }),
    ])
    getCanonMock.mockImplementation((slug) => {
      if (slug === 'a') return { last_revised: '2026-03-01' }
      if (slug === 'b') return { last_revised: '2026-05-19' }
      if (slug === 'c') return { last_revised: '2026-04-15' }
      return null
    })
    const { getByTestId } = render(ShowsIndexPage())
    expect(getByTestId('shows-hero-canon-revised').textContent).toBe('May 2026')
  })

  it('hides the stat cell entirely when no canon carries last_revised', () => {
    getAllShowsMock.mockReturnValue([fullShow({ slug: 'a' })])
    getCanonMock.mockReturnValue(null)
    const { queryByTestId } = render(ShowsIndexPage())
    expect(queryByTestId('shows-stat-revised')).toBeNull()
    expect(queryByTestId('shows-hero-canon-revised')).toBeNull()
  })

  it('does not derive the hero stat from build-time `new Date()`', () => {
    // Same drift class as home #269 — a June-built page must not stamp
    // June when the catalog's canons claim May. Pin: `vi.useFakeTimers()`
    // pinned to a non-canon month, assert the canon month is rendered.
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T00:00:00Z'))
    try {
      getAllShowsMock.mockReturnValue([fullShow({ slug: 'a' })])
      getCanonMock.mockReturnValue({ last_revised: '2026-05-21' })
      const { getByTestId } = render(ShowsIndexPage())
      const stamp = getByTestId('shows-hero-canon-revised').textContent
      expect(stamp).toBe('May 2026')
      expect(stamp).not.toBe('June 2026')
    } finally {
      vi.useRealTimers()
    }
  })
})

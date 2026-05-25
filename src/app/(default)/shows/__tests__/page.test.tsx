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
}

const { getAllShowsMock } = vi.hoisted(() => ({
  getAllShowsMock: vi.fn<() => FixtureShow[]>(),
}))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getAllShows: getAllShowsMock,
  }
})

import { generateMetadata } from '../page'

const survivor: FixtureShow = { slug: 'survivor', tier: 'S', seasons: 47 }
const amazingRace: FixtureShow = { slug: 'amazing-race', tier: 'A', seasons: 36 }
const newcomer: FixtureShow = { slug: 'newcomer', tier: 'B', seasons: 3 }

beforeEach(() => {
  getAllShowsMock.mockReset()
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

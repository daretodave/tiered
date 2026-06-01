import { render } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('/ (home) page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })

  it('emits a self-referential canonical for the home page', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/')
  })

  it('pins the title absolute so the root template does not double-suffix', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.title).toEqual({
      absolute: 'tiered.tv — the seasons, ranked. no spoilers.',
    })
  })

  it('keeps the RSS feed discovery link when overriding alternates', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    const rss = meta.alternates?.types?.['application/rss+xml']
    expect(Array.isArray(rss)).toBe(true)
    expect(rss).toContainEqual({
      url: '/feed.xml',
      title: 'tiered.tv — all updates',
    })
  })
})

// --------------------------------------------------------------------
// critique pass-24 #269: home canon-revised label source-of-truth
// --------------------------------------------------------------------
//
// Before this fix the home derived its `Canon revised` label from
// build-time `new Date()` while the show page read the canon's
// `last_revised` frontmatter — they disagreed on the 1st of every
// month. The contract is now: the home reads the same canon source
// the show page reads, so a reader clicking through home → show
// always sees the same month.
//
// The describe block below pins that contract by mocking the
// content loaders + capturing the props HomeHero receives, then
// asserting the `canonRevisedLabel` prop tracks `getCanon(featured.slug)
// .last_revised` (not the clock).

const {
  getAllShowsMock,
  getAllThemesMock,
  getCanonMock,
  getFeaturedShowMock,
  getThemeStatsMock,
  HomeHeroMock,
  HomeShowGridMock,
  HomeMoreShowsMock,
  HomeDualCalloutMock,
  HomeListsStackMock,
  HomeListRowMock,
  ShowTileMock,
} = vi.hoisted(() => ({
  getAllShowsMock: vi.fn(),
  getAllThemesMock: vi.fn(),
  getCanonMock: vi.fn(),
  getFeaturedShowMock: vi.fn(),
  getThemeStatsMock: vi.fn(),
  HomeHeroMock: vi.fn(() => null),
  HomeShowGridMock: vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="home-show-grid-mock">{children}</div>
  )),
  HomeMoreShowsMock: vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="home-more-shows-mock">{children}</div>
  )),
  HomeDualCalloutMock: vi.fn(() => null),
  HomeListsStackMock: vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="home-lists-stack-mock">{children}</div>
  )),
  HomeListRowMock: vi.fn(() => null),
  ShowTileMock: vi.fn(() => null),
}))

vi.mock('@/content', async () => {
  const actual = await vi.importActual<typeof import('@/content')>('@/content')
  return {
    ...actual,
    getAllShows: getAllShowsMock,
    getAllThemes: getAllThemesMock,
    getCanon: getCanonMock,
    getFeaturedShow: getFeaturedShowMock,
    getThemeStats: getThemeStatsMock,
  }
})

vi.mock('@/components/home/HomeHero', () => ({ HomeHero: HomeHeroMock }))
vi.mock('@/components/home/HomeShowGrid', () => ({
  HomeShowGrid: HomeShowGridMock,
}))
vi.mock('@/components/home/HomeMoreShows', () => ({
  HomeMoreShows: HomeMoreShowsMock,
}))
vi.mock('@/components/home/HomeDualCallout', () => ({
  HomeDualCallout: HomeDualCalloutMock,
}))
vi.mock('@/components/home/HomeListsStack', () => ({
  HomeListsStack: HomeListsStackMock,
}))
vi.mock('@/components/home/HomeListRow', () => ({
  HomeListRow: HomeListRowMock,
}))
vi.mock('@/components/home/ShowTile', () => ({ ShowTile: ShowTileMock }))

import type { Show } from '@/content'

// Type-erased peek at the last props HomeHero was rendered with —
// vi.fn's auto-inferred `calls` tuple sits as `[][]` under strict
// tsc which makes positional access ambiguous, so this helper does
// the unknown-conversion once and the call sites stay readable.
function lastHomeHeroProps(): Record<string, unknown> {
  const calls = (HomeHeroMock as unknown as {
    mock: { calls: ReadonlyArray<ReadonlyArray<unknown>> }
  }).mock.calls
  const first = calls[0]
  if (!first || first.length === 0) {
    throw new Error('HomeHero was not rendered')
  }
  return first[0] as Record<string, unknown>
}

function fixtureShow(over: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    seasons: 50,
    status: 'airing',
    blurb: 'one torch at a time.',
    tagline: 'seasons of strangers on a beach. ranked.',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...over,
  }
}

beforeEach(() => {
  getAllShowsMock.mockReset()
  getAllThemesMock.mockReset()
  getCanonMock.mockReset()
  getFeaturedShowMock.mockReset()
  getThemeStatsMock.mockReset()
  HomeHeroMock.mockClear()

  getAllShowsMock.mockReturnValue([fixtureShow()])
  getAllThemesMock.mockReturnValue([])
  getThemeStatsMock.mockReturnValue({ showsCovered: 1, featuredCount: 0 })
})

describe('home canon-revised label sourced from featured show canon', () => {
  it('formats the featured show canon `last_revised` to "Month YYYY"', async () => {
    getFeaturedShowMock.mockReturnValue(fixtureShow())
    getCanonMock.mockReturnValue({
      show: 'survivor',
      last_revised: '2026-05-15',
      entries: [],
    })

    const mod = await import('../page')
    render(mod.default())

    expect(HomeHeroMock).toHaveBeenCalledTimes(1)
    const props = lastHomeHeroProps() as {
      canonRevisedLabel: string | null
      featured: Show
    }
    expect(props.canonRevisedLabel).toBe('May 2026')
    expect(props.featured.slug).toBe('survivor')
  })

  it('reads the canon for the featured show, not a hard-coded slug', async () => {
    // Regression pin: if a future refactor accidentally reads
    // `getCanon('survivor')` directly instead of
    // `getCanon(featured.slug)`, swapping the featured show would
    // mis-source the label.
    getFeaturedShowMock.mockReturnValue(
      fixtureShow({ slug: 'amazing-race', name: 'The Amazing Race' }),
    )
    getCanonMock.mockReturnValue({
      show: 'amazing-race',
      last_revised: '2026-04-01',
      entries: [],
    })

    const mod = await import('../page')
    render(mod.default())

    expect(getCanonMock).toHaveBeenCalledWith('amazing-race')
    const props = lastHomeHeroProps() as {
      canonRevisedLabel: string | null
    }
    expect(props.canonRevisedLabel).toBe('April 2026')
  })

  it('passes null when the canon has no last_revised (stat hides downstream)', async () => {
    getFeaturedShowMock.mockReturnValue(fixtureShow())
    getCanonMock.mockReturnValue({
      show: 'survivor',
      entries: [],
    })

    const mod = await import('../page')
    render(mod.default())

    const props = lastHomeHeroProps() as {
      canonRevisedLabel: string | null
    }
    expect(props.canonRevisedLabel).toBeNull()
  })

  it('passes null when the featured show has no canon at all', async () => {
    getFeaturedShowMock.mockReturnValue(fixtureShow())
    getCanonMock.mockReturnValue(null)

    const mod = await import('../page')
    render(mod.default())

    const props = lastHomeHeroProps() as {
      canonRevisedLabel: string | null
    }
    expect(props.canonRevisedLabel).toBeNull()
  })

  it('does not derive the label from build-time `new Date()`', async () => {
    // The prior path called `getCanonRevisedLabel(new Date())` and a
    // June-built page stamped "June 2026" regardless of canon
    // revisions. Pin: when the canon claims May 2026, the home must
    // also read May 2026 — even if the test clock sits in June.
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T00:00:00Z'))
    try {
      getFeaturedShowMock.mockReturnValue(fixtureShow())
      getCanonMock.mockReturnValue({
        show: 'survivor',
        last_revised: '2026-05-21',
        entries: [],
      })

      const mod = await import('../page')
      render(mod.default())

      const props = lastHomeHeroProps() as {
        canonRevisedLabel: string | null
      }
      expect(props.canonRevisedLabel).toBe('May 2026')
      expect(props.canonRevisedLabel).not.toBe('June 2026')
    } finally {
      vi.useRealTimers()
    }
  })
})

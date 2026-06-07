import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShowRanking } from '../ShowRanking'
import type { CanonFile, Season, Show } from '@/content'
import type { LiveCommunityRanking } from '@/lib/community/ranking'

function liveRanking(
  seasons: Season[],
  source: LiveCommunityRanking['source'] = 'canon',
): LiveCommunityRanking {
  return {
    entries: seasons.map((s, i) => ({
      rank: i + 1,
      season: s,
      tag: '2010',
      score: 0,
      approval: null,
      voteCount: 0,
      trend: null,
    })),
    source,
    votersThisWeek: 0,
    lastRecomputeAt: null,
    version: null,
  }
}

const SHOW: Show = {
  slug: 'survivor',
  name: 'Survivor',
  palette: { paper: '#0E2A2A', ink: '#EFE2BD', primary: '#D55E36' },
  seasons: 47,
  status: 'airing',
  blurb: 'blurb',
  tagline: 'tagline',
  tier: 'S',
  network: 'CBS',
  est_year: 2000,
  genre_tag: 'Reality competition',
  featured: true,
} as unknown as Show

function season(number: number, title: string): Season {
  return {
    show: 'survivor',
    number,
    slug: `season-${number}`,
    title,
    body_md: 'body',
  } as unknown as Season
}

function canon(): CanonFile {
  return {
    show: 'survivor',
    editor: 'M. Reyes',
    last_revised: '2026-04-01',
    entries: [
      {
        rank: 1,
        season: 20,
        title: 'Heroes vs. Villains',
        rationale: 'rationale body',
        tag: 'tagline',
      },
      { rank: 6, season: 1, title: 'Borneo', rationale: 'rationale body' },
    ],
  } as unknown as CanonFile
}

describe('<ShowRanking>', () => {
  it('initial view = canon seeds data-view + SSRs both panes', () => {
    const seasons = [season(20, 'Heroes vs. Villains'), season(1, 'Borneo')]
    render(
      <ShowRanking
        show={SHOW}
        seasons={seasons}
        canon={canon()}
        initialView="canon"
        community={liveRanking(seasons)}
      />,
    )
    expect(screen.getByTestId('show-ranking')).toHaveAttribute(
      'data-view',
      'canon',
    )
    // Both panes are in the DOM regardless of active view (SEO-safe;
    // CSS toggles visibility off the root data-view).
    expect(screen.getByTestId('canon-view-pane')).toBeInTheDocument()
    expect(screen.getByTestId('community-view-pane')).toBeInTheDocument()
    expect(screen.getByTestId('canon-methodology')).toBeInTheDocument()
    expect(screen.getAllByTestId('canon-tier').length).toBeGreaterThan(0)
  })

  it('?view=community seeds data-view=community', () => {
    const seasons = [season(20, 'Heroes vs. Villains'), season(1, 'Borneo')]
    render(
      <ShowRanking
        show={SHOW}
        seasons={seasons}
        canon={canon()}
        initialView="community"
        community={liveRanking(seasons)}
      />,
    )
    expect(screen.getByTestId('show-ranking')).toHaveAttribute(
      'data-view',
      'community',
    )
    expect(screen.getByTestId('community-live-strip')).toBeInTheDocument()
    expect(screen.getByTestId('community-rank-list')).toBeInTheDocument()
  })

  it('ranking-intro carries both the canon and community ledes', () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[season(20, 'Heroes vs. Villains')]}
        canon={canon()}
        initialView="canon"
        community={liveRanking([season(20, 'Heroes vs. Villains')])}
      />,
    )
    const intro = screen.getByTestId('ranking-intro')
    expect(intro).toHaveTextContent('The canon, top to bottom.')
    expect(intro).toHaveTextContent('What readers are voting on.')
  })

  // Pin per pass-31 #305 fix: the canon-pane lede attribution must
  // read singular ("an editor who has rewatched") to match /about's
  // "Built and operated by one person" admission. Bidirectional —
  // positive on the singular phrasing AND negative against the prior
  // plural "editors who have rewatched" / "we argue / we ship" first-
  // person plural so a regression trips at unit time.
  it('ranking-intro canon meta attributes the ranking to a singular editor (pass-31 #305)', () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[season(20, 'Heroes vs. Villains')]}
        canon={canon()}
        initialView="canon"
        community={liveRanking([season(20, 'Heroes vs. Villains')])}
      />,
    )
    const intro = screen.getByTestId('ranking-intro')
    const text = intro.textContent ?? ''
    expect(text).toMatch(/written by an editor who has rewatched/)
    expect(text).not.toMatch(/editors who have rewatched/i)
    expect(text).not.toMatch(/we argue with the community/i)
    expect(text).not.toMatch(/but we ship one number/i)
  })

  // Pin per critique pass-39 #345 fix: the canon-pane lede must
  // explicitly name the editor's column as the singular ranking
  // the prose commits to, since the next sibling DOM element
  // renders two clearly-labeled tab triggers (Editor's Canon
  // CURATED / Community LIVE). The prior "One ranking ... this
  // is one number." framing produced a prose-vs-UI shape
  // mismatch at first paint. Bidirectional — positive on the
  // editor's-column naming AND negative against the bare "One
  // ranking" standalone sentence + the "this is one number" coda
  // so a future authoring pass cannot regress to the
  // contradictory shape without tripping the unit gate.
  it("ranking-intro canon meta names the editor's column explicitly (pass-39 #345)", () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[season(20, 'Heroes vs. Villains')]}
        canon={canon()}
        initialView="canon"
        community={liveRanking([season(20, 'Heroes vs. Villains')])}
      />,
    )
    const intro = screen.getByTestId('ranking-intro')
    const text = intro.textContent ?? ''
    expect(text).toMatch(/editor'?s (ranking|column|canon)/i)
    expect(text).not.toMatch(/^[^.]*\bone ranking\b[^.]*\./i)
    expect(text).not.toMatch(/this is one number/i)
  })

  it('ranking-intro community meta names the cadence in editorial voice, not engineering (regression guard for #256)', () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[season(20, 'Heroes vs. Villains')]}
        canon={canon()}
        initialView="canon"
        community={liveRanking([season(20, 'Heroes vs. Villains')])}
      />,
    )
    const intro = screen.getByTestId('ranking-intro')
    expect(intro).toHaveTextContent(/Updated every Thursday at 9pm ET/)
    expect(intro).not.toHaveTextContent(/Recomputed/i)
  })

  it('ranking-intro community meta bridges the binary top-10 question to the ordinal rank (pass-26 #283)', () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[season(20, 'Heroes vs. Villains')]}
        canon={canon()}
        initialView="community"
        community={liveRanking(
          [season(20, 'Heroes vs. Villains')],
          'votes',
        )}
      />,
    )
    const intro = screen.getByTestId('ranking-intro')
    const text = intro.textContent ?? ''
    // Positive bridge pin per critique pass-26 #283: the community intro
    // must name the binary top-10 question AND name how the share of "in"
    // votes orders every season 1..N below — the bridge between the
    // site-wide yes/no ballot framing and the ordinal-rank list below.
    expect(text).toMatch(/top 10/i)
    expect(text).toMatch(/(in[- ]?votes|share of|orders|1\.\.N)/i)
    // Negative drift pin: any future authoring pass that drops the
    // ordinal-bridge clause and leaves the bare "top 10" question
    // without a follow-on share/orders sentence trips this guard.
    if (/top 10/i.test(text)) {
      expect(text).toMatch(/(share|orders|1\.\.N|in[- ]?votes)/i)
    }
  })

  it('renders the empty state when canon is null', () => {
    render(
      <ShowRanking
        show={SHOW}
        seasons={[]}
        canon={null}
        initialView="canon"
        community={liveRanking([], 'seasons')}
      />,
    )
    expect(screen.getByTestId('canon-empty')).toBeInTheDocument()
  })

  it('tab click flips data-view in place without navigating', () => {
    const pathBefore = window.location.pathname
    const seasons = [season(20, 'Heroes vs. Villains'), season(1, 'Borneo')]
    render(
      <ShowRanking
        show={SHOW}
        seasons={seasons}
        canon={canon()}
        initialView="canon"
        community={liveRanking(seasons)}
      />,
    )
    fireEvent.click(screen.getByTestId('canon-tab-community'))
    expect(screen.getByTestId('show-ranking')).toHaveAttribute(
      'data-view',
      'community',
    )
    expect(window.location.pathname).toBe(pathBefore)
    expect(new URLSearchParams(window.location.search).get('view')).toBe(
      'community',
    )

    fireEvent.click(screen.getByTestId('canon-tab-canon'))
    expect(screen.getByTestId('show-ranking')).toHaveAttribute(
      'data-view',
      'canon',
    )
    expect(window.location.pathname).toBe(pathBefore)
    expect(new URLSearchParams(window.location.search).get('view')).toBeNull()
  })
})

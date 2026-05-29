import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanonHeroEntries } from '../CanonHeroEntries'
import type { CanonEntry, Season } from '@/content'

function entry(overrides: Partial<CanonEntry> & { rank: number; season: number; title: string }): CanonEntry {
  return {
    rationale:
      'eighty to one hundred and twenty words of rationale; the renderer treats this as a string and does not enforce length here, but production schemas do.',
    ...overrides,
  }
}

function season(number: number, title: string): Season {
  return {
    show: 'survivor',
    number,
    slug: `season-${number}`,
    title,
    body_md: 'body',
  } as unknown as Season
}

// Mirrors the production fallback resolver (ShowRanking) for the
// no-live-votes path: the static frontmatter hint, or null.
const hintSignal = (e: CanonEntry) => e.community_rank_hint ?? null

describe('<CanonHeroEntries>', () => {
  it('renders one row per entry with title and rank padded', () => {
    const entries = [
      entry({ rank: 1, season: 1, title: 'Borneo', tag: 'genre, invented mid-air' }),
      entry({ rank: 2, season: 20, title: 'Heroes vs. Villains' }),
    ]
    const seasons = new Map<number, Season>([
      [1, season(1, 'Borneo')],
      [20, season(20, 'Heroes vs. Villains')],
    ])
    render(
      <CanonHeroEntries
        entries={entries}
        seasonHref={(e) => `/shows/survivor/season/${seasons.get(e.season)?.slug ?? e.season}`}
        seasonOf={(e) => seasons.get(e.season)}
        eraOf={() => undefined}
        communitySignal={hintSignal}
      />,
    )
    const rows = screen.getAllByTestId('canon-hero-entry')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveAttribute('data-rank', '1')
    expect(rows[0]?.querySelector('.cp-he-rank')?.textContent).toBe('01')
    expect(screen.getByText('Borneo')).toBeInTheDocument()
    expect(screen.getByText('Heroes vs. Villains')).toBeInTheDocument()
  })

  it('stacks the zero-padded season tag under the rank numeral', () => {
    const entries = [entry({ rank: 1, season: 20, title: 'Heroes vs. Villains' })]
    render(
      <CanonHeroEntries
        entries={entries}
        seasonHref={() => '/x'}
        seasonOf={() => undefined}
        eraOf={() => undefined}
        communitySignal={hintSignal}
      />,
    )
    const tag = screen.getByTestId('canon-hero-season-tag')
    expect(tag).toHaveTextContent('S20')
    const stack = tag.closest('.cp-he-rank-stack')
    expect(stack).not.toBeNull()
    expect(stack?.querySelector('.cp-he-rank')?.textContent).toBe('01')
  })

  it('collapses absent slot_argument / community signal', () => {
    const entries = [
      entry({ rank: 1, season: 1, title: 'Borneo' }),
    ]
    render(
      <CanonHeroEntries
        entries={entries}
        seasonHref={() => '/x'}
        seasonOf={() => undefined}
        eraOf={() => undefined}
        communitySignal={hintSignal}
      />,
    )
    expect(screen.queryByTestId('canon-hero-mini-community')).toBeNull()
    expect(screen.queryByTestId('canon-hero-mini-slot')).toBeNull()
    expect(screen.queryByText(/tag/i)).toBeNull()
  })

  it('renders community + slot mini-cards from the static hint fallback', () => {
    const entries = [
      entry({
        rank: 1,
        season: 1,
        title: 'Borneo',
        slot_argument: 'genre defined here',
        community_rank_hint: { rank: 2, delta: 1, sentiment: 'up' },
      }),
    ]
    render(
      <CanonHeroEntries
        entries={entries}
        seasonHref={() => '/x'}
        seasonOf={() => undefined}
        eraOf={() => undefined}
        communitySignal={hintSignal}
      />,
    )
    expect(screen.getByTestId('canon-hero-mini-community')).toBeInTheDocument()
    expect(screen.getByTestId('canon-hero-mini-slot')).toBeInTheDocument()
    expect(screen.getByText('#02')).toBeInTheDocument()
  })

  it('the community mini-pill reflects the live signal, overriding the static hint', () => {
    const entries = [
      entry({
        rank: 1,
        season: 1,
        title: 'Borneo',
        // Static hint says #02 ↑1; the live resolver says #05 ↓3.
        community_rank_hint: { rank: 2, delta: 1, sentiment: 'up' },
      }),
    ]
    render(
      <CanonHeroEntries
        entries={entries}
        seasonHref={() => '/x'}
        seasonOf={() => undefined}
        eraOf={() => undefined}
        communitySignal={() => ({ rank: 5, delta: 3, sentiment: 'down' })}
      />,
    )
    const mini = screen.getByTestId('canon-hero-mini-community')
    expect(mini).toHaveTextContent('#05')
    expect(mini.querySelector('.cp-mini-trend')?.className).toContain('down')
    expect(mini.querySelector('.cp-mini-trend')?.textContent).toBe('↓ 3')
    expect(screen.queryByText('#02')).toBeNull()
  })

  it('glosses the compact trend marker for hover + screen readers so the glyph is not color-only', () => {
    function trendMarker(signal: { rank: number; delta: number; sentiment: 'up' | 'down' | 'hold' }) {
      const entries = [entry({ rank: 1, season: 1, title: 'Borneo' })]
      const { unmount } = render(
        <CanonHeroEntries
          entries={entries}
          seasonHref={() => '/x'}
          seasonOf={() => undefined}
          eraOf={() => undefined}
          communitySignal={() => signal}
        />,
      )
      const marker = screen.getByTestId('canon-hero-mini-community').querySelector('.cp-mini-trend')
      const result = { title: marker?.getAttribute('title'), aria: marker?.getAttribute('aria-label') }
      unmount()
      return result
    }

    // climb: visible "↑ 3" glyph glosses to plain language; color is no
    // longer the sole carrier of the climb/slide distinction.
    const up = trendMarker({ rank: 2, delta: 3, sentiment: 'up' })
    expect(up.title).toBe('Climbing 3 spots in the community ranking')
    expect(up.aria).toBe('Climbing 3 spots in the community ranking')

    // slide
    const down = trendMarker({ rank: 9, delta: 2, sentiment: 'down' })
    expect(down.title).toBe('Sliding 2 spots in the community ranking')
    expect(down.aria).toBe('Sliding 2 spots in the community ranking')

    // hold: the cryptic ◆ glyph gets a readable expansion
    const hold = trendMarker({ rank: 4, delta: 0, sentiment: 'hold' })
    expect(hold.title).toBe('Holding steady in the community ranking')
    expect(hold.aria).toBe('Holding steady in the community ranking')

    // singular spot uses the singular noun so the gloss reads naturally
    const oneUp = trendMarker({ rank: 1, delta: 1, sentiment: 'up' })
    expect(oneUp.title).toBe('Climbing 1 spot in the community ranking')
  })
})

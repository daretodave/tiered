import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CanonEntry } from '@/content'
import { CanonTailEntries } from '../CanonTailEntries'

// The helper omits `tag` and `community_rank_hint` by default — both
// are optional on CanonEntry and the no-suffix branches need them
// absent. Tests that exercise those branches pass them via overrides.
function entry(overrides: Partial<CanonEntry> = {}): CanonEntry {
  return {
    rank: 31,
    season: 31,
    title: 'Season 31',
    rationale: 'rationale body',
    ...overrides,
  }
}

describe('<CanonTailEntries> — container', () => {
  it('renders a cp-tail-table div carrying the canon-tail-entries testid', () => {
    render(
      <CanonTailEntries
        entries={[entry()]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const table = screen.getByTestId('canon-tail-entries')
    expect(table.tagName).toBe('DIV')
    expect(table).toHaveClass('cp-tail-table')
  })

  it('mounts the container with zero rows for an empty entries array', () => {
    render(
      <CanonTailEntries
        entries={[]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(screen.getByTestId('canon-tail-entries')).toBeInTheDocument()
    expect(screen.queryAllByTestId('canon-tail-row')).toHaveLength(0)
  })
})

describe('<CanonTailEntries> — rows', () => {
  it('renders one anchor row per entry, in feed order', () => {
    render(
      <CanonTailEntries
        entries={[entry({ rank: 31 }), entry({ rank: 32 }), entry({ rank: 33 })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const rows = screen.getAllByTestId('canon-tail-row')
    expect(rows).toHaveLength(3)
    for (const row of rows) expect(row.tagName).toBe('A')
    expect(rows.map((r) => r.getAttribute('data-rank'))).toEqual([
      '31',
      '32',
      '33',
    ])
  })

  it('each row carries the cp-tail-row class', () => {
    render(
      <CanonTailEntries
        entries={[entry()]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(screen.getByTestId('canon-tail-row')).toHaveClass('cp-tail-row')
  })

  it('sets href from seasonHref per entry', () => {
    render(
      <CanonTailEntries
        entries={[entry({ season: 31 }), entry({ rank: 32, season: 32 })]}
        seasonHref={(e) => `/shows/survivor/season/s${e.season}`}
        eraOf={() => undefined}
      />,
    )
    const rows = screen.getAllByTestId('canon-tail-row')
    expect(rows[0]).toHaveAttribute('href', '/shows/survivor/season/s31')
    expect(rows[1]).toHaveAttribute('href', '/shows/survivor/season/s32')
  })

  it('sets data-era from eraOf, collapsing undefined to an empty string', () => {
    render(
      <CanonTailEntries
        entries={[entry({ rank: 31 }), entry({ rank: 32 })]}
        seasonHref={() => '/x'}
        eraOf={(e) => (e.rank === 31 ? 'new-era' : undefined)}
      />,
    )
    const rows = screen.getAllByTestId('canon-tail-row')
    expect(rows[0]).toHaveAttribute('data-era', 'new-era')
    // eraOf → undefined must render data-era="" — never the literal "undefined".
    expect(rows[1]).toHaveAttribute('data-era', '')
  })
})

describe('<CanonTailEntries> — cells', () => {
  it('renders the four cell divs in rank/title/tag/num order', () => {
    render(
      <CanonTailEntries
        entries={[entry()]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const row = screen.getByTestId('canon-tail-row')
    const cellClasses = Array.from(row.querySelectorAll(':scope > div')).map(
      (d) => d.className,
    )
    expect(cellClasses).toEqual([
      'cp-tr-rank',
      'cp-tr-title',
      'cp-tr-tag',
      'cp-tr-num',
    ])
  })

  it('zero-pads a single-digit rank in the rank cell', () => {
    render(
      <CanonTailEntries
        entries={[entry({ rank: 5 })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-rank'),
    ).toHaveTextContent('05')
  })

  it('does not truncate a rank wider than two digits', () => {
    render(
      <CanonTailEntries
        entries={[entry({ rank: 100 })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-rank'),
    ).toHaveTextContent('100')
  })

  it('renders the title verbatim in the title cell', () => {
    render(
      <CanonTailEntries
        entries={[entry({ title: 'Heroes vs. Villains' })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-title'),
    ).toHaveTextContent('Heroes vs. Villains')
  })

  it('renders the tag in the tag cell when present', () => {
    render(
      <CanonTailEntries
        entries={[entry({ tag: 'Rough patch' })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-tag'),
    ).toHaveTextContent('Rough patch')
  })

  it('leaves the tag cell empty (never "undefined") when tag is absent', () => {
    render(
      <CanonTailEntries
        entries={[entry()]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const cell = screen
      .getByTestId('canon-tail-row')
      .querySelector('.cp-tr-tag')
    expect(cell?.textContent).toBe('')
  })
})

describe('<CanonTailEntries> — community hint', () => {
  it('zero-pads the season number in the num cell', () => {
    render(
      <CanonTailEntries
        entries={[entry({ season: 7 })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-num'),
    ).toHaveTextContent('S07')
  })

  it('appends the padded community rank to the num cell when a hint is present', () => {
    render(
      <CanonTailEntries
        entries={[
          entry({
            season: 31,
            community_rank_hint: { rank: 28, delta: -3, sentiment: 'down' },
          }),
        ]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-num'),
    ).toHaveTextContent('S31 · Community #28')
  })

  it('zero-pads a single-digit community hint rank', () => {
    render(
      <CanonTailEntries
        entries={[
          entry({
            season: 32,
            community_rank_hint: { rank: 4, delta: 1, sentiment: 'up' },
          }),
        ]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(
      screen.getByTestId('canon-tail-row').querySelector('.cp-tr-num'),
    ).toHaveTextContent('S32 · Community #04')
  })

  it('renders a bare S## with no Community suffix when the hint is absent', () => {
    render(
      <CanonTailEntries
        entries={[entry({ season: 33 })]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const num = screen
      .getByTestId('canon-tail-row')
      .querySelector('.cp-tr-num')
    expect(num).toHaveTextContent('S33')
    expect(num?.textContent).not.toContain('Community')
  })
})

describe('<CanonTailEntries> — callbacks', () => {
  it('invokes seasonHref and eraOf once per entry with the entry object', () => {
    const seasonHref = vi.fn((e: CanonEntry) => `/s/${e.rank}`)
    const eraOf = vi.fn(() => 'era-x')
    const entries = [entry({ rank: 31 }), entry({ rank: 32 })]
    render(
      <CanonTailEntries
        entries={entries}
        seasonHref={seasonHref}
        eraOf={eraOf}
      />,
    )
    expect(seasonHref).toHaveBeenCalledTimes(2)
    expect(eraOf).toHaveBeenCalledTimes(2)
    expect(seasonHref).toHaveBeenCalledWith(entries[0])
    expect(seasonHref).toHaveBeenCalledWith(entries[1])
    expect(eraOf).toHaveBeenCalledWith(entries[0])
    expect(eraOf).toHaveBeenCalledWith(entries[1])
  })
})

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanonCompactEntries } from '../CanonCompactEntries'
import type { CanonEntry } from '@/content'

function e(rank: number): CanonEntry {
  return {
    rank,
    season: rank,
    title: `Season ${rank}`,
    rationale: 'rationale body',
    tag: 'optional tag',
  }
}

describe('<CanonCompactEntries>', () => {
  it('renders compact rows', () => {
    render(
      <CanonCompactEntries
        entries={[e(16), e(17)]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    expect(screen.getAllByTestId('canon-compact-entry')).toHaveLength(2)
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('surfaces the community hint beside the season when present', () => {
    render(
      <CanonCompactEntries
        entries={[
          { ...e(16), community_rank_hint: { rank: 16, delta: 0, sentiment: 'hold' } },
        ]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const row = screen.getByTestId('canon-compact-entry')
    expect(row.querySelector('.cp-ce-meta')).toHaveTextContent('S16 · Community #16')
  })

  it('degrades to bare S## when no community hint', () => {
    render(
      <CanonCompactEntries
        entries={[e(17)]}
        seasonHref={() => '/x'}
        eraOf={() => undefined}
      />,
    )
    const meta = screen.getByTestId('canon-compact-entry').querySelector('.cp-ce-meta')
    expect(meta).toHaveTextContent('S17')
    expect(meta?.textContent).not.toContain('Community')
  })
})

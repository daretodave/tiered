import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityRankList } from '../CommunityRankList'
import type { CommunityRankRow } from '@/lib/community/ranking'
import type { Season } from '@/content'

function season(number: number, title: string): Season {
  return {
    show: 'survivor',
    number,
    slug: `season-${number}`,
    title,
    body_md: 'body',
  } as unknown as Season
}

function row(
  rank: number,
  n: number,
  title: string,
  over: Partial<CommunityRankRow> = {},
): CommunityRankRow {
  return {
    rank,
    season: season(n, title),
    tag: '2010',
    score: 0,
    approval: null,
    voteCount: 0,
    trend: null,
    ...over,
  }
}

describe('<CommunityRankList>', () => {
  it('renders header + rows', () => {
    const entries = [row(1, 20, 'Heroes vs. Villains'), row(2, 1, 'Borneo')]
    render(
      <CommunityRankList entries={entries} showSlug="survivor" source="canon" />,
    )
    expect(screen.getByTestId('community-rank-list')).toHaveAttribute(
      'data-source',
      'canon',
    )
    expect(screen.getByTestId('community-rank-cols')).toBeInTheDocument()
    expect(screen.getAllByTestId('community-rank-row')).toHaveLength(2)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Heroes vs. Villains')).toBeInTheDocument()
  })

  it('hides approval/pct/trend/votes cells when no vote data', () => {
    const entries = [row(1, 20, 'Heroes vs. Villains')]
    const { container } = render(
      <CommunityRankList entries={entries} showSlug="survivor" source="canon" />,
    )
    expect(container.querySelector('.cp-clr-bar-fill')).toBeNull()
    const placeholders = container.querySelectorAll('.cp-cl-cell--empty')
    expect(placeholders.length).toBeGreaterThanOrEqual(3)
  })

  it('renders real approval %, votes and a RankShiftPill off the trend', () => {
    const entries = [
      row(1, 20, 'Heroes vs. Villains', {
        approval: 0.934,
        voteCount: 12104,
        trend: 3,
      }),
    ]
    const { container } = render(
      <CommunityRankList entries={entries} showSlug="survivor" source="votes" />,
    )
    expect(screen.getByTestId('community-rank-list')).toHaveAttribute(
      'data-source',
      'votes',
    )
    // approval rounds to a whole-percent and drives the bar width
    expect(screen.getByText('93%')).toBeInTheDocument()
    const fill = container.querySelector(
      '.cp-clr-bar-fill',
    ) as HTMLElement | null
    expect(fill?.style.width).toBe('93%')
    expect(screen.getByText('12,104')).toBeInTheDocument()
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill).toHaveAttribute('data-delta', '3')
    expect(pill).toHaveAttribute('data-sentiment', 'warm-up')
  })

  it('shows an em-dash trend cell when a voted row has no baseline delta', () => {
    const entries = [
      row(1, 20, 'Heroes vs. Villains', {
        approval: 0.9,
        voteCount: 50,
        trend: null,
      }),
    ]
    const { container } = render(
      <CommunityRankList entries={entries} showSlug="survivor" source="votes" />,
    )
    expect(screen.queryByTestId('rank-shift-pill')).toBeNull()
    expect(container.querySelector('.cp-clr-trend.cp-cl-cell--empty')).not.toBeNull()
  })

  it('live-source meta names the cadence in editorial voice, not engineering (regression guard for #256)', () => {
    const entries = [
      row(1, 20, 'Heroes vs. Villains', {
        approval: 0.9,
        voteCount: 50,
        trend: 2,
      }),
    ]
    render(
      <CommunityRankList entries={entries} showSlug="survivor" source="votes" />,
    )
    const list = screen.getByTestId('community-rank-list')
    expect(list).toHaveTextContent(/Updated Thursdays · approval %/)
    expect(list).not.toHaveTextContent(/recompute/i)
  })
})

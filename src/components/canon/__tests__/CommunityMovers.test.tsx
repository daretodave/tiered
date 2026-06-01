import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityMovers } from '../CommunityMovers'
import type { CommunityMover } from '@/lib/community/live'
import type { Season } from '@/content'

function season(number: number, title: string): Season {
  return {
    show: 'survivor',
    number,
    slug: `season-${number}`,
    title,
    body_md: 'b',
  } as unknown as Season
}

describe('<CommunityMovers>', () => {
  it('keeps the honest empty state when nothing moved', () => {
    render(<CommunityMovers movers={[]} />)
    expect(screen.getByTestId('community-movers-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('community-movers-grid')).toBeNull()
  })

  it('empty-state copy names weekly updates in editorial voice, not engineering (regression guard for #256)', () => {
    render(<CommunityMovers movers={[]} />)
    const empty = screen.getByTestId('community-movers-empty')
    expect(empty).toHaveTextContent(/weekly updates/)
    expect(empty).not.toHaveTextContent(/recompute/i)
  })

  it('eyebrow names the section plainly, never promises a sentiment chip the cards do not deliver (regression guard for #265)', () => {
    const { container } = render(<CommunityMovers movers={[]} />)
    const eyebrow = container.querySelector('.cp-movers-head .meta')
    expect(eyebrow).not.toBeNull()
    expect(eyebrow).toHaveTextContent(/^Top changes$/)
    expect(eyebrow?.textContent ?? '').not.toMatch(/sentiment/i)
    expect(eyebrow?.textContent ?? '').not.toMatch(/·/)
  })

  it('renders a card per mover with the pill + was/now ranks', () => {
    const movers: CommunityMover[] = [
      {
        season: season(37, 'David vs. Goliath'),
        tag: '2018',
        rank: 10,
        prevRank: 15,
        delta: 5,
        sentiment: 'warm-up',
      },
    ]
    render(<CommunityMovers movers={movers} />)
    expect(screen.queryByTestId('community-movers-empty')).toBeNull()
    expect(screen.getAllByTestId('community-mover')).toHaveLength(1)
    expect(screen.getByText('David vs. Goliath')).toBeInTheDocument()
    expect(screen.getByText('#15')).toBeInTheDocument()
    expect(screen.getByText('#10')).toBeInTheDocument()
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill).toHaveAttribute('data-delta', '5')
    expect(pill).toHaveAttribute('data-sentiment', 'warm-up')
  })
})

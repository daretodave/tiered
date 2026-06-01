import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProfileStats } from '../ProfileStats'

describe('<ProfileStats>', () => {
  it('renders the three participation cells with pluralized labels', () => {
    render(
      <ProfileStats
        publishedCommentCount={1}
        votedSeasonCount={7}
        votedShowCount={3}
      />,
    )
    const comments = screen.getByTestId('profile-stat-comments')
    expect(comments.textContent).toContain('1')
    expect(comments.textContent).toContain('comment')
    expect(comments.textContent).not.toContain('comments')

    const seasons = screen.getByTestId('profile-stat-seasons')
    expect(seasons.textContent).toContain('7')
    expect(seasons.textContent).toContain('seasons voted')

    const shows = screen.getByTestId('profile-stat-shows')
    expect(shows.textContent).toContain('3')
    expect(shows.textContent).toContain('shows followed')
  })

  // Critique pass-22: lead the stat row with SEASONS VOTED so the
  // participation hierarchy on the member's own record page matches
  // tiered.tv's voting-first brand mechanic — and harmonises with the
  // adjacent empty-state line ("Vote on a season and it will land
  // here. / Start with Survivor →"). Pinned bidirectionally so a
  // regression back to comments-first fails at unit time.
  it('orders cells voting-first: seasons → comments → shows', () => {
    render(
      <ProfileStats
        publishedCommentCount={4}
        votedSeasonCount={9}
        votedShowCount={2}
      />,
    )
    const row = screen.getByTestId('profile-stats')
    const cellOrder = Array.from(row.children).map((child) =>
      child.getAttribute('data-testid'),
    )
    expect(cellOrder).toEqual([
      'profile-stat-seasons',
      'profile-stat-comments',
      'profile-stat-shows',
    ])
  })

  it('renders zeros cleanly for an empty profile', () => {
    render(
      <ProfileStats
        publishedCommentCount={0}
        votedSeasonCount={0}
        votedShowCount={0}
      />,
    )
    expect(screen.getByTestId('profile-stat-comments').textContent).toContain(
      '0',
    )
  })
})

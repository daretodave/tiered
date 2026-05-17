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

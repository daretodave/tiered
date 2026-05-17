import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProfileComments } from '../ProfileComments'
import type { ProfileCommentView } from '../types'

const withContext: ProfileCommentView = {
  id: 'c1',
  excerpt: 'The location work is a quiet argument for the format.',
  when: '2d ago',
  context: { label: 'Survivor · Season 20', href: '/shows/survivor/season/heroes-villains' },
}

const noContext: ProfileCommentView = {
  id: 'c2',
  excerpt: 'Agreed with the point above.',
  when: '1w ago',
  context: null,
}

describe('<ProfileComments>', () => {
  it('renders the empty state when there are no comments', () => {
    render(<ProfileComments comments={[]} />)
    expect(screen.getByTestId('profile-no-comments')).toBeTruthy()
  })

  it('links a season-context comment to the clean slug URL', () => {
    render(<ProfileComments comments={[withContext]} />)
    const ctx = screen.getByTestId('profile-comment-context')
    expect(ctx.getAttribute('href')).toBe(
      '/shows/survivor/season/heroes-villains',
    )
    expect(ctx.textContent).toBe('Survivor · Season 20')
    expect(screen.getByTestId('profile-comment-when').textContent).toBe(
      '2d ago',
    )
  })

  it('renders a plain context label when the target is unresolvable', () => {
    render(<ProfileComments comments={[noContext]} />)
    expect(screen.queryByTestId('profile-comment-context')).toBeNull()
    expect(
      screen.getByTestId('profile-comment-context-plain').textContent,
    ).toBe('In a discussion')
  })
})

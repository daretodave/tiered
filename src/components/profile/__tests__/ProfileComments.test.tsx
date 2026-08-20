import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProfileComments } from '../ProfileComments'
import type { ProfileCommentView } from '../types'

const withContext: ProfileCommentView = {
  id: 'c1',
  excerpt: 'The location work is a quiet argument for the format.',
  when: '2d ago',
  context: { label: 'Survivor · Season 20', href: '/shows/survivor/season/heroes-vs-villains' },
  held: false,
}

const noContext: ProfileCommentView = {
  id: 'c2',
  excerpt: 'Agreed with the point above.',
  when: '1w ago',
  context: null,
  held: false,
}

const held: ProfileCommentView = {
  id: 'c3',
  excerpt: 'Just posted this, waiting on review.',
  when: 'just now',
  context: null,
  held: true,
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
      '/shows/survivor/season/heroes-vs-villains',
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

  it('renders a held-for-review badge on the viewer own pending comment', () => {
    render(<ProfileComments comments={[held]} />)
    expect(screen.getByTestId('profile-comment-held-badge').textContent).toBe(
      'held for review',
    )
    expect(
      screen.getByTestId('profile-comment').getAttribute('data-held'),
    ).toBe('true')
  })

  it('does not render a held badge on a published comment', () => {
    render(<ProfileComments comments={[withContext]} />)
    expect(screen.queryByTestId('profile-comment-held-badge')).toBeNull()
    expect(
      screen.getByTestId('profile-comment').getAttribute('data-held'),
    ).toBeNull()
  })
})

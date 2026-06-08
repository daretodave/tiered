import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommentInputStub } from '../CommentInputStub'

describe('<CommentInputStub>', () => {
  it('renders the sign-in prompt linking to /sign-in by default', () => {
    render(<CommentInputStub />)
    const link = screen.getByTestId('comment-stub-link')
    expect(link).toHaveAttribute('href', '/sign-in')
    expect(link.textContent).toContain('Sign in to comment')
    expect(link.textContent).toContain('No plot')
  })

  it('honors a custom signInHref', () => {
    render(<CommentInputStub signInHref="/sign-in?return=/x" />)
    expect(screen.getByTestId('comment-stub-link')).toHaveAttribute(
      'href',
      '/sign-in?return=/x',
    )
  })

  describe('arrow placement (critique pass-39, issue #354)', () => {
    it('puts the arrow ligature on the action span, not the tagline span', () => {
      const { container } = render(<CommentInputStub />)
      const actionSpan = container.querySelector(
        '[data-testid="comment-stub-link"] > span:not(.comment-stub-mono)',
      )
      expect(actionSpan).not.toBeNull()
      expect(actionSpan?.textContent ?? '').toMatch(/Sign in to comment\.\s*→\s*$/)
    })

    it('keeps the tagline span free of the arrow ligature', () => {
      const { container } = render(<CommentInputStub />)
      const taglineSpan = container.querySelector(
        '[data-testid="comment-stub-link"] .comment-stub-mono',
      )
      expect(taglineSpan).not.toBeNull()
      expect(taglineSpan?.textContent ?? '').not.toMatch(/→/)
      expect(taglineSpan?.textContent ?? '').toMatch(/No plot, no winners, no twists/)
    })
  })
})

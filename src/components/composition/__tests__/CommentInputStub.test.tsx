import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommentInputStub } from '../CommentInputStub'

describe('<CommentInputStub>', () => {
  it('renders the sign-in prompt linking to /sign-in by default', () => {
    render(<CommentInputStub />)
    const link = screen.getByTestId('comment-stub-link')
    expect(link).toHaveAttribute('href', '/sign-in')
    expect(link.textContent).toContain('Sign in to comment')
    expect(link.textContent).toContain('Posting rule:')
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
      expect(taglineSpan?.textContent ?? '').toMatch(
        /Posting rule: no plot, no winners, no twists\./,
      )
    })
  })

  describe('rule-label prefix (critique pass-50, issue #415)', () => {
    // The bare `No plot, no winners, no twists` literal parsed
    // ambiguously next to the empty-state `No comments yet.`
    // line below it on the same anon-state thread footer — a
    // first-time reader drifted to "there are no comments
    // because no plot, no winners, no twists are being
    // discussed yet." Prefix the rule with `Posting rule:` so
    // it parses as a labeled rule, not a paraphrase of the
    // empty-state. Bidirectional pin: positive on the new
    // prefix + end punctuation; negative against any regression
    // to the bare-rule shape.
    it('opens the rule line with a `Posting rule:` label', () => {
      const { container } = render(<CommentInputStub />)
      const taglineSpan = container.querySelector(
        '[data-testid="comment-stub-link"] .comment-stub-mono',
      )
      expect(taglineSpan?.textContent ?? '').toMatch(/^Posting rule:\s/)
    })

    it('ends the rule line with a period so it reads as a complete sentence', () => {
      const { container } = render(<CommentInputStub />)
      const taglineSpan = container.querySelector(
        '[data-testid="comment-stub-link"] .comment-stub-mono',
      )
      expect(taglineSpan?.textContent ?? '').toMatch(/no twists\.$/)
    })

    it('does not regress to the bare `No plot, no winners, no twists` literal', () => {
      const { container } = render(<CommentInputStub />)
      const taglineSpan = container.querySelector(
        '[data-testid="comment-stub-link"] .comment-stub-mono',
      )
      expect(taglineSpan?.textContent ?? '').not.toMatch(
        /^No plot, no winners, no twists\s*$/,
      )
    })
  })
})

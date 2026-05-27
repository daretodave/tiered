import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommentThread } from '../CommentThread'

describe('<CommentThread>', () => {
  it('renders the thread head, omits the meta eyebrow at count=0, and shows input + empty-state copy', () => {
    render(
      <CommentThread
        count={0}
        input={<div data-testid="input-slot">stub-input</div>}
      />,
    )
    expect(screen.getByTestId('comment-thread')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-count')).toBeNull()
    expect(screen.getByTestId('input-slot')).toBeInTheDocument()
    expect(screen.getByTestId('comment-thread-empty').textContent).toBe(
      'No comments yet. Weigh in on the season itself.',
    )
  })

  it('empty-state copy avoids the soft-spoiler-shape "the result" phrasing', () => {
    render(
      <CommentThread
        count={0}
        input={<div data-testid="input-slot">stub-input</div>}
      />,
    )
    const empty = screen.getByTestId('comment-thread-empty').textContent ?? ''
    expect(empty).not.toMatch(/\bthe result\b/i)
    expect(empty).not.toMatch(/\bthe winner\b/i)
    expect(empty).not.toMatch(/\bthe twist\b/i)
    expect(empty).not.toMatch(/\bthe elimination\b/i)
  })

  it('renders the count and children when count > 0', () => {
    render(
      <CommentThread count={42} input={<div />}>
        <ul data-testid="thread-list">
          <li>x</li>
        </ul>
      </CommentThread>,
    )
    expect(screen.getByTestId('comment-count').textContent).toContain('42 comments')
    expect(screen.getByTestId('thread-list')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
  })

  it('renders children with no empty state and no meta eyebrow when count=0 but a held row exists', () => {
    render(
      <CommentThread count={0} input={<div />}>
        <ul data-testid="held-only">
          <li>held</li>
        </ul>
      </CommentThread>,
    )
    expect(screen.queryByTestId('comment-count')).toBeNull()
    expect(screen.getByTestId('held-only')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
  })

  it('singularizes "1 comment" when count === 1', () => {
    render(
      <CommentThread count={1} input={<div />}>
        <span data-testid="lone-comment">solo</span>
      </CommentThread>,
    )
    expect(screen.getByTestId('comment-count').textContent).toContain('1 comment')
    expect(screen.getByTestId('comment-count').textContent).not.toContain('comments')
  })

  it('hideEmpty suppresses the empty-state at count=0 even without children, and meta eyebrow stays absent', () => {
    render(
      <CommentThread
        count={0}
        hideEmpty
        input={<div data-testid="input-slot">composer</div>}
      />,
    )
    expect(screen.getByTestId('input-slot')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
    expect(screen.queryByTestId('comment-count')).toBeNull()
  })

  it('hideEmpty=false (default) keeps prior empty-state behavior at count=0', () => {
    render(<CommentThread count={0} input={<div />} hideEmpty={false} />)
    expect(screen.getByTestId('comment-thread-empty')).toBeInTheDocument()
  })

  it('hideEmpty does not suppress real thread children when present', () => {
    render(
      <CommentThread count={3} hideEmpty input={<div />}>
        <ul data-testid="thread-list">
          <li>x</li>
        </ul>
      </CommentThread>,
    )
    expect(screen.getByTestId('thread-list')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
    expect(screen.getByTestId('comment-count').textContent).toContain('3 comments')
  })
})

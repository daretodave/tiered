import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CommentItem } from '../CommentItem'
import type { ThreadComment } from '@/lib/comments/thread'

const NOW = Date.parse('2026-05-17T12:00:00.000Z')

function c(over: Partial<ThreadComment> = {}): ThreadComment {
  return {
    id: over.id ?? 'c1',
    body: over.body ?? 'A grounded thought about the season.',
    author: over.author ?? 'asha',
    createdAt: over.createdAt ?? '2026-05-17T11:50:00.000Z',
    score: over.score ?? 0,
    held: over.held ?? false,
    collapsed: over.collapsed ?? false,
  }
}

describe('<CommentItem>', () => {
  it('renders author, relative time, and body for a normal comment', () => {
    render(<CommentItem comment={c()} now={NOW} />)
    expect(screen.getByText('asha')).toBeInTheDocument()
    expect(screen.getByText('10m ago')).toBeInTheDocument()
    expect(screen.getByTestId('comment-body')).toHaveTextContent(
      'grounded thought',
    )
    expect(screen.queryByTestId('comment-held-badge')).toBeNull()
  })

  it('shows the held-for-review badge for the author own pending row', () => {
    render(<CommentItem comment={c({ held: true })} now={NOW} />)
    const badge = screen.getByTestId('comment-held-badge')
    expect(badge).toHaveTextContent(/held for review/i)
    expect(screen.getByTestId('comment-item')).toHaveAttribute(
      'data-held',
      'true',
    )
  })

  it('tucks a collapsed comment behind a reveal that expands on click', () => {
    render(<CommentItem comment={c({ collapsed: true })} now={NOW} />)
    expect(screen.queryByTestId('comment-body')).toBeNull()
    fireEvent.click(screen.getByTestId('comment-reveal'))
    expect(screen.getByTestId('comment-body')).toBeInTheDocument()
  })
})

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
      'No comments yet. Be the first to weigh in.',
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

  it('empty-state copy avoids the arch "itself" qualifier (critique pass-23 regression pin)', () => {
    render(
      <CommentThread
        count={0}
        input={<div data-testid="input-slot">stub-input</div>}
      />,
    )
    const empty = screen.getByTestId('comment-thread-empty').textContent ?? ''
    expect(empty).not.toMatch(/itself/i)
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

  // CRITIQUE pass-36 #335 (issue #360): the signed-in input
  // already invites the viewer to comment — stacking the standalone
  // empty-state line on top reads as two voices not talking to each
  // other. Gate the empty-state on viewer auth: authed viewers
  // drop the line (input carries the invitation); anon viewers
  // keep it (the input swaps to a sign-in stub and the line still
  // does work).
  describe('viewer-can-post gating on the standalone empty-state', () => {
    it('drops the empty-state line for a signed-in viewer with no comments (input owns the invitation)', () => {
      render(
        <CommentThread
          count={0}
          input={<div data-testid="input-slot">live-input</div>}
          viewerCanPost
        />,
      )
      expect(screen.getByTestId('input-slot')).toBeInTheDocument()
      expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
    })

    it('keeps the empty-state line for an anon viewer with no comments (input is a sign-in stub)', () => {
      render(
        <CommentThread
          count={0}
          input={<div data-testid="signin-stub">sign-in</div>}
          viewerCanPost={false}
        />,
      )
      expect(screen.getByTestId('signin-stub')).toBeInTheDocument()
      expect(screen.getByTestId('comment-thread-empty').textContent).toBe(
        'No comments yet. Be the first to weigh in.',
      )
    })

    it('omits the line whether or not viewerCanPost when a body exists (non-empty thread)', () => {
      render(
        <CommentThread
          count={1}
          input={<div />}
          viewerCanPost
        >
          <span data-testid="lone">already here</span>
        </CommentThread>,
      )
      expect(screen.getByTestId('lone')).toBeInTheDocument()
      expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
    })

    it('defaults viewerCanPost to false so SSR / pre-hydrate keeps the empty-state for anon-shaped first paint', () => {
      // The mount /api/comments fetch resolves signedIn after first
      // paint; until then, defaulting to false keeps the line
      // visible. Once the fetch resolves and viewerCanPost flips
      // true, the line drops on the next render. The SSR-default-
      // to-anon-shape is the honest first paint for both viewer
      // classes — the anon viewer never sees the line vanish and
      // the authed viewer sees a one-time line-drop on hydrate.
      render(
        <CommentThread
          count={0}
          input={<div data-testid="input-slot">stub</div>}
        />,
      )
      expect(screen.getByTestId('comment-thread-empty').textContent).toBe(
        'No comments yet. Be the first to weigh in.',
      )
    })
  })
})

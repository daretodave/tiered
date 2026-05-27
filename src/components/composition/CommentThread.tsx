import type { ReactNode } from 'react'

type CommentThreadProps = {
  count?: number
  input: ReactNode
  hideEmpty?: boolean
  children?: ReactNode
}

/**
 * CommentThread — the season-page aside.
 *
 * When `children` are provided, renders them as the thread body and
 * the published `count` in the meta strip. When there are no
 * `children` (no published comments and nothing held for the
 * viewer), renders an honest empty-state line that invites the
 * first comment without referencing internal phase numbers or
 * implementation status. `count` is the public published count, so
 * a held-only thread still reads "Be the first" in the meta strip
 * while showing the author's held row below.
 *
 * `hideEmpty` suppresses the empty-state line when the caller's
 * `input` slot already carries the "weigh in, no spoilers" nudge —
 * the signed-in composer placeholder doubles the message otherwise.
 * Reserve the empty-state for the signed-out render where the
 * composer is replaced by a sign-in stub.
 */
export function CommentThread({
  count = 0,
  input,
  hideEmpty = false,
  children,
}: CommentThreadProps) {
  const hasComments = count > 0
  const hasBody = children != null
  const showEmpty = !hasBody && !hideEmpty
  return (
    <div data-testid="comment-thread" className="comment-thread">
      <div className="aside-head">
        <h3>The thread</h3>
        <span className="aside-meta" data-testid="comment-count">
          {hasComments
            ? `${count} ${count === 1 ? 'comment' : 'comments'}`
            : 'Be the first'}
        </span>
      </div>
      {input}
      {hasBody ? children : null}
      {showEmpty ? (
        <p
          className="comment-body"
          data-testid="comment-thread-empty"
          style={{ marginTop: 24, opacity: 0.7 }}
        >
          No comments yet. Weigh in on the season itself.
        </p>
      ) : null}
    </div>
  )
}

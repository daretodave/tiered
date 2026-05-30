import type { ReactNode } from 'react'

type CommentThreadProps = {
  count?: number
  input: ReactNode
  children?: ReactNode
}

/**
 * CommentThread — the season-page aside.
 *
 * When `children` are provided, renders them as the thread body and
 * the published `count` in the meta strip. When there are no
 * `children` (no published comments and nothing held for the
 * viewer), renders an honest empty-state line that invites the
 * first comment. `count` is the public published count, so the meta
 * strip ("42 comments" / "1 comment") only renders when the thread
 * has live published activity. The empty-state line renders for
 * both anon and authed zero-comment viewers — the composer
 * placeholder is a prompt to act, not a confirmation of surface
 * state, so the two messages do different jobs and should both
 * render.
 */
export function CommentThread({
  count = 0,
  input,
  children,
}: CommentThreadProps) {
  const hasComments = count > 0
  const hasBody = children != null
  const showEmpty = !hasBody
  return (
    <div data-testid="comment-thread" className="comment-thread">
      <div className="aside-head">
        <h3>The thread</h3>
        {hasComments ? (
          <span className="aside-meta" data-testid="comment-count">
            {`${count} ${count === 1 ? 'comment' : 'comments'}`}
          </span>
        ) : null}
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

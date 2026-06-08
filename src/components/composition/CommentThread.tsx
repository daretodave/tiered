import type { ReactNode } from 'react'

type CommentThreadProps = {
  count?: number
  input: ReactNode
  children?: ReactNode
  // CRITIQUE pass-36 #335 (issue #360): the signed-in input
  // already invites the viewer to comment, so the standalone
  // empty-state line ("No comments yet. Be the first to weigh
  // in.") reads as a second voice talking past the invitation
  // just rendered above it. Gate the line on viewer auth-state
  // — keep it for anon viewers (where the input swaps to a
  // sign-in stub and the line still does work), drop it for
  // signed-in viewers (where the input affordance carries the
  // invitation). `CommentThreadLive` propagates this from its
  // `/api/comments` read of `signedIn`; defaults to false so
  // pre-hydration / SSR keeps the line until the read resolves.
  viewerCanPost?: boolean
}

/**
 * CommentThread — the season-page aside.
 *
 * When `children` are provided, renders them as the thread body and
 * the published `count` in the meta strip. When there are no
 * `children` (no published comments and nothing held for the
 * viewer), renders an honest empty-state line that invites the
 * first comment IF the viewer can't post — for a signed-in viewer
 * the input affordance above already carries the invitation, so
 * stacking the empty-state on top would echo it (pass-36 #335).
 * `count` is the public published count, so the meta strip ("42
 * comments" / "1 comment") only renders when the thread has live
 * published activity.
 */
export function CommentThread({
  count = 0,
  input,
  children,
  viewerCanPost = false,
}: CommentThreadProps) {
  const hasComments = count > 0
  const hasBody = children != null
  const showEmpty = !hasBody && !viewerCanPost
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
          No comments yet. Be the first to weigh in.
        </p>
      ) : null}
    </div>
  )
}

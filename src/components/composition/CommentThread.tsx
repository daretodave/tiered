import type { ReactNode } from 'react'

type CommentThreadProps = {
  count?: number
  input: ReactNode
  children?: ReactNode
  // CRITIQUE pass-36 #335 (issue #360) + pass-42 #362: the
  // empty-state line is gated on viewer auth-state. Anon viewers
  // see only the state-signal half ("No comments yet."); the
  // "Be the first to weigh in." CTA was dropped at pass-42 close
  // because anon visitors can't actually weigh in without first
  // signing in — the sign-in stub above is the only real CTA.
  // Authed viewers see neither half because the input affordance
  // above already carries the invitation (pass-36 closure).
  // `CommentThreadLive` propagates this from its `/api/comments`
  // read of `signedIn`; defaults to false so pre-hydration / SSR
  // keeps the anon-shape line until the read resolves.
  viewerCanPost?: boolean
}

/**
 * CommentThread — the season-page aside.
 *
 * When `children` are provided, renders them as the thread body and
 * the published `count` in the meta strip. When there are no
 * `children` (no published comments and nothing held for the
 * viewer), renders an honest empty-state line for the anon viewer
 * only — the line is a pure state signal ("No comments yet.") with
 * no posting CTA, because anon visitors can't post without first
 * signing in via the stub above (pass-42 #362). Authed viewers
 * drop the line entirely; the input affordance above carries the
 * invitation (pass-36 #335). `count` is the public published count,
 * so the meta strip ("42 comments" / "1 comment") only renders when
 * the thread has live published activity.
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
          No comments yet.
        </p>
      ) : null}
    </div>
  )
}

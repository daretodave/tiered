'use client'

import { useState } from 'react'
import { formatWhen, type ThreadComment } from '@/lib/comments/thread'

type CommentItemProps = {
  comment: ThreadComment
  now?: number
}

/**
 * One row in the season-page thread. Matches the `.comment-item`
 * rhythm already defined in screens.css (phase 30 reserved it).
 *
 * Two non-default states:
 *  - `held`: the viewer's own pending comment. Surfaced honestly as
 *    held for review (phase-12 new-account / AI-flag posture) — not
 *    as failure, not hidden. Only ever rendered to its own author
 *    (enforced server-side; this is presentation only).
 *  - `collapsed`: a low-scored comment (≤ −2). Body is tucked
 *    behind a reveal so the thread stays readable without
 *    destroying the record.
 */
export function CommentItem({ comment, now }: CommentItemProps) {
  const [revealed, setRevealed] = useState(false)
  const showBody = !comment.collapsed || revealed
  return (
    <li
      className="comment-item"
      data-testid="comment-item"
      data-held={comment.held ? 'true' : undefined}
      data-collapsed={comment.collapsed ? 'true' : undefined}
    >
      <div className="comment-meta">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-when">{formatWhen(comment.createdAt, now)}</span>
        {comment.held ? (
          <span className="comment-held" data-testid="comment-held-badge">
            held for review
          </span>
        ) : null}
      </div>
      {showBody ? (
        <p className="comment-body" data-testid="comment-body">
          {comment.body}
        </p>
      ) : (
        <button
          type="button"
          className="comment-reveal"
          onClick={() => setRevealed(true)}
          data-testid="comment-reveal"
        >
          Low-rated comment — show anyway
        </button>
      )}
    </li>
  )
}

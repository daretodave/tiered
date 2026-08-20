import Link from 'next/link'
import type { ProfileCommentView } from './types'

type ProfileCommentsProps = {
  comments: ProfileCommentView[]
}

// Recent published comments, plus — on a self-view only — the
// viewer's own held-for-review comment(s) (`held: true`), pinned on
// top by the caller. A stranger's profile never carries a held row;
// pending/hidden/removed comments are never fetched for any other
// viewer. The body was spoiler-gated at write time (phase 12); the
// context link points at a public season page and never surfaces a
// rank or outcome.
export function ProfileComments({ comments }: ProfileCommentsProps) {
  if (comments.length === 0) {
    return (
      <p className="text-ink-2" data-testid="profile-no-comments">
        No published comments yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-5" data-testid="profile-comments">
      {comments.map((c) => (
        <li
          key={c.id}
          className="flex flex-col gap-1.5 border-b border-line-soft pb-5 last:border-b-0"
          data-testid="profile-comment"
          data-held={c.held ? 'true' : undefined}
        >
          {c.held ? (
            <span className="comment-held" data-testid="profile-comment-held-badge">
              held for review
            </span>
          ) : null}
          <p className="text-ink-1" data-testid="profile-comment-excerpt">
            {c.excerpt}
          </p>
          <p className="text-xs text-ink-3">
            {c.context ? (
              <>
                <Link
                  href={c.context.href}
                  prefetch={false}
                  className="text-ink-2 underline-offset-2 hover:underline"
                  data-testid="profile-comment-context"
                >
                  {c.context.label}
                </Link>
                {' · '}
              </>
            ) : (
              <>
                <span data-testid="profile-comment-context-plain">
                  In a discussion
                </span>
                {' · '}
              </>
            )}
            <span data-testid="profile-comment-when">{c.when}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

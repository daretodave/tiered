'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ThreadComment } from '@/lib/comments/thread'
import { CommentInput } from './CommentInput'
import { CommentInputStub } from './CommentInputStub'
import { CommentItem } from './CommentItem'
import { CommentThread } from './CommentThread'

type CommentThreadLiveProps = {
  targetType: 'season' | 'comment'
  targetId: string
  signInHref: string
  // Critique pass-84 HIGH: on non-cached routes the page already
  // has the server-resolved auth state (the sibling Header read it
  // first in the same response) — seed the composer swap from it so
  // a signed-in viewer never sees the sign-in stub, instead of
  // defaulting to anon and waiting on the /api/comments round-trip.
  initialSignedIn?: boolean
  initialHandle?: string | null
}

type FetchState = {
  loaded: boolean
  signedIn: boolean
  handle: string | null
  count: number
  comments: ThreadComment[]
}

/**
 * CommentThreadLive — the client read path for the season thread
 * (phase 36). Mirrors the VotePair read-back pattern: the thread
 * body always needs a client fetch (it's not in the initial page
 * payload), so it's resolved client-side from `GET /api/comments`.
 * The season route is actually dynamically rendered per-request
 * (the shared Header's session read forces it), so `initialSignedIn`
 * / `initialHandle` let the page seed the composer swap from the
 * auth state it already resolved server-side — critique pass-84
 * HIGH found the anon-default here otherwise flashed the sign-in
 * stub at a signed-in viewer for the SSR paint.
 *
 * On mount it fetches the thread; the response also tells us
 * whether the viewer is signed in, so the input swaps to the real
 * CommentInput (vs the sign-in stub) even on a statically rendered
 * page. After a successful post it refetches so the author's row
 * appears immediately — published in the list, or pinned on top as
 * "held for review" when the phase-12 hold applies.
 */
export function CommentThreadLive({
  targetType,
  targetId,
  signInHref,
  initialSignedIn,
  initialHandle,
}: CommentThreadLiveProps) {
  const [state, setState] = useState<FetchState>({
    loaded: false,
    signedIn: initialSignedIn ?? false,
    handle: initialHandle ?? null,
    count: 0,
    comments: [],
  })

  const load = useCallback(() => {
    if (typeof fetch !== 'function') return undefined
    let cancelled = false
    const params = new URLSearchParams({ targetType, targetId })
    fetch(`/api/comments?${params.toString()}`, {
      headers: { accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json:
            | {
                ok?: boolean
                signedIn?: boolean
                handle?: string | null
                count?: number
                comments?: ThreadComment[]
              }
            | null,
        ) => {
          if (cancelled || !json || json.ok !== true) return
          setState({
            loaded: true,
            signedIn: Boolean(json.signedIn),
            handle: typeof json.handle === 'string' && json.handle.length > 0 ? json.handle : null,
            count: Number(json.count) || 0,
            comments: Array.isArray(json.comments) ? json.comments : [],
          })
        },
      )
      .catch(() => {
        /* Keep the empty state — always-working, no error toast. */
      })
    return () => {
      cancelled = true
    }
  }, [targetType, targetId])

  useEffect(() => load(), [load])

  const onPosted = useCallback(() => {
    // The row is committed by the time POST resolves; refetch picks
    // it up (published into the list, or held-for-review on top).
    load()
  }, [load])

  const input = state.signedIn ? (
    <CommentInput
      targetType={targetType}
      targetId={targetId}
      handle={state.handle}
      onPosted={onPosted}
    />
  ) : (
    <CommentInputStub signInHref={signInHref} />
  )

  const hasBody = state.comments.length > 0

  return (
    <CommentThread
      count={state.count}
      input={input}
      viewerCanPost={state.signedIn}
    >
      {hasBody ? (
        <ul className="comment-list" data-testid="comment-list">
          {state.comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      ) : undefined}
    </CommentThread>
  )
}

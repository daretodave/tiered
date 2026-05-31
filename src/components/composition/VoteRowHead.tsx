'use client'

import { useEffect, useState } from 'react'

// VoteRowHead — the three-state eyebrow above the vote pair on
// season pages. Closes #177: the prior static "Your vote / change
// within 72h" copy assumed a signed-in-with-vote context that is
// wrong for the other two viewer states (anon, signed-in-no-vote).
//
// Mirrors VotePair's `/api/vote` GET on mount to read the same
// `{ signedIn, value }` the buttons use, then renders one of:
//   anon                 → "Cast a vote · sign in to weigh in"
//   signed-in-no-vote    → "Your vote · cast vote"
//   signed-in-with-vote  → "Your vote · change within 72h"
//
// The no-vote meta is "cast vote" (not "cast yours" or "cast yours
// this week"): the prior "cast yours" possessive-elision fragment
// was the only clever-fragment CTA on the entire authed walk and
// broke plan/bearings's "plain sentences over clever ones" cue
// (critique pass-22); the plain imperative matches the surrounding
// site-wide register. No "this week" qualifier — the vote is a
// one-time per-reader act; only the rank recompute is weekly, so
// a "this week" qualifier would read as a time-windowed ballot it
// isn't (critique pass-15).
//
// The SSR fallback is the anon copy — most viewers of a static
// season page are unauthenticated, and the same useState default
// keeps the initial client render structurally identical to SSR
// (no hydration mismatch).

type VoteRowHeadProps = {
  targetType: 'season' | 'comment'
  targetId: string
}

type VoteHeadState = 'anon' | 'signed-in-no-vote' | 'signed-in-with-vote'

const COPY: Record<VoteHeadState, { title: string; meta: string }> = {
  anon: { title: 'Cast a vote', meta: 'sign in to weigh in' },
  'signed-in-no-vote': { title: 'Your vote', meta: 'cast vote' },
  'signed-in-with-vote': { title: 'Your vote', meta: 'change within 72h' },
}

export function VoteRowHead({ targetType, targetId }: VoteRowHeadProps) {
  const [state, setState] = useState<VoteHeadState>('anon')

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ targetType, targetId })
    fetch(`/api/vote?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json:
            | { ok?: boolean; signedIn?: unknown; value?: unknown }
            | null,
        ) => {
          if (cancelled || !json || json.ok !== true) return
          const signedIn = json.signedIn === true
          const value = json.value
          if (!signedIn) {
            setState('anon')
            return
          }
          if (value === 1 || value === -1) {
            setState('signed-in-with-vote')
          } else {
            setState('signed-in-no-vote')
          }
        },
      )
      .catch(() => {
        /* keep anon default — surface no error UI for an eyebrow */
      })
    return () => {
      cancelled = true
    }
  }, [targetType, targetId])

  const { title, meta } = COPY[state]
  return (
    <div
      className="info-row-head"
      data-testid="vote-row-head"
      data-vote-head-state={state}
    >
      <span>{title}</span>
      <span className="meta">{meta}</span>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

// VoteRowHead — the three-state eyebrow above the vote pair on
// season pages. Closes #177: the prior static "Your vote / change
// within 72h" copy assumed a signed-in-with-vote context that is
// wrong for the other two viewer states (anon, signed-in-no-vote).
//
// Mirrors VotePair's `/api/vote` GET on mount to read the same
// `{ signedIn, value }` the buttons use, then renders one of:
//   anon                 → "Cast a vote · counts more once you sign in"
//   signed-in-no-vote    → "Your vote · cast vote"
//   signed-in-with-vote  → "Your vote · change within 72h"
//
// Critique pass-89 MED: the prior anon meta ("sign in to weigh
// in") implied an anonymous vote wouldn't count at all unless the
// reader signed in first. That's wrong on both sides — `about.md`
// states anon votes count at 0.1x (not zero), and VotePair's POST
// handler is unconditional on `signedIn`. The rewritten copy keeps
// the sign-in nudge without the false "doesn't count yet" claim.
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
//
// Critique pass-84 HIGH: on non-cached routes the server already
// knows signed-in state (the sibling `Header` resolved it two
// hundred lines earlier in the same response) — seed the initial
// state from that instead of throwing it away for a client
// round-trip. `initialSignedIn` is the only thing the page can
// know synchronously (not the vote value, which still needs the
// `/api/vote` read-back), so a signed-in viewer starts on
// "cast vote" and reconciles to "change within 72h" on mount if
// they'd already voted — both are signed-in copy, so there's no
// wrong-state flash, just a same-state refinement.

type VoteRowHeadProps = {
  targetType: 'season' | 'comment'
  targetId: string
  initialSignedIn?: boolean
}

type VoteHeadState = 'anon' | 'signed-in-no-vote' | 'signed-in-with-vote'

const COPY: Record<VoteHeadState, { title: string; meta: string }> = {
  anon: { title: 'Cast a vote', meta: 'counts more once you sign in' },
  'signed-in-no-vote': { title: 'Your vote', meta: 'cast vote' },
  'signed-in-with-vote': { title: 'Your vote', meta: 'change within 72h' },
}

export function VoteRowHead({ targetType, targetId, initialSignedIn }: VoteRowHeadProps) {
  const [state, setState] = useState<VoteHeadState>(
    initialSignedIn ? 'signed-in-no-vote' : 'anon',
  )

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

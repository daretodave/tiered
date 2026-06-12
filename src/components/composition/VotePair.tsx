'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import {
  initialState,
  nextValue,
  reduce,
  type VotePairState,
  type VoteValue,
} from '@/lib/votePair'

function asVoteValue(n: unknown): VoteValue {
  return n === 1 ? 1 : n === -1 ? -1 : 0
}

// Critique pass-34 MED: the rendered integer is the distinct
// voter count on the target (`COUNT(*) FILTER (value <> 0)` over
// `votes` for the target — the same source the ShiftCard's
// `vote_count` reads from `compute_weighted_rank`). A voter
// count is never negative; the prior `signedCountText` helper
// that prefixed positives with `+` is gone with the rename.
function formatVoterCount(count: number): string {
  const n = Math.max(0, Math.round(count))
  return n.toLocaleString()
}

type VotePairProps = {
  initialCount?: number
  targetType: 'season' | 'comment'
  targetId: string
  label?: string
  labelSingular?: string
}

type Action =
  | { type: 'click'; direction: 'up' | 'down'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'hydrate'; value: VoteValue; count: number }
  | { type: 'reconcile'; value: VoteValue; count: number }

function reducer(state: VotePairState, action: Action): VotePairState {
  return reduce(state, action)
}

/**
 * VotePair — design port of `design/compositions/interactions.jsx`.
 *
 * Pill-shaped container with three cells: down button, count, up button.
 * Clicking flashes the button background in the matching sentiment color
 * for the lock window, and the count slides 8px in the vote's direction
 * (up vote = count slides up). `prefers-reduced-motion` collapses the
 * slide to an opacity fade per `design/tokens.json` motion.reduced.
 *
 * Phase 35 stage 3 wires the read-back path. On mount it GETs
 * `/api/vote` to seed the viewer's existing vote + the true net
 * (so a refresh stops showing the static 0). A click POSTs the
 * *resolved* value (a re-click sends 0 — a retract — not the raw
 * direction) and reconciles the count to the server's aggregate
 * on response. The optimistic flash still runs immediately;
 * network failures fall back to optimistic-only without a toast
 * (a proper error affordance is still on the backlog).
 */
export function VotePair({
  initialCount = 0,
  targetType,
  targetId,
  label = 'votes so far',
  labelSingular = 'vote so far',
}: VotePairProps) {
  const [state, dispatch] = useReducer(reducer, { initialCount }, initialState)
  const reduced = useRef(false)
  // Until the mount read-back resolves (or the viewer acts), the
  // number is a placeholder, not the true net. `hydrated` gates a
  // one-time opacity fade so it doesn't pop 0 -> <X> (issue #64).
  const [hydrated, setHydrated] = useState(false)
  // Signed-in members get the disambiguating state pill above the
  // buttons (#160 / critique pass-6); anons see only the buttons,
  // matching the existing CommentInputStub / CommentInput swap
  // pattern. `signedIn` is sourced from /api/vote so a single
  // round-trip seeds both the vote read-back and the pill — no
  // /api/auth/me piggyback needed.
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  }, [])

  useEffect(() => {
    if (state.phase !== 'locked' || state.lockedUntil == null) return
    const delay = Math.max(0, state.lockedUntil - Date.now())
    const t = window.setTimeout(() => dispatch({ type: 'tick', now: Date.now() }), delay)
    return () => window.clearTimeout(t)
  }, [state])

  // Mount read-back: seed the viewer's current vote + the true
  // net from the server. The reducer's `hydrate` is a no-op once
  // the viewer has clicked, so a fast vote that races this fetch
  // is never clobbered by the (now stale) snapshot.
  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ targetType, targetId })
    fetch(`/api/vote?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json:
            | { ok?: boolean; value?: unknown; count?: unknown; signedIn?: unknown }
            | null,
        ) => {
          if (cancelled || !json || json.ok !== true) return
          dispatch({
            type: 'hydrate',
            value: asVoteValue(json.value),
            count: Number(json.count) || 0,
          })
          setHydrated(true)
          setSignedIn(json.signedIn === true)
        },
      )
      .catch(() => {
        /* Optimistic-only fallback — keep the static initialCount. */
      })
    return () => {
      cancelled = true
    }
  }, [targetType, targetId])

  const onClick = (direction: 'up' | 'down') => () => {
    const now = Date.now()
    // POST the value the click *resolves* to, not the button
    // direction — a re-click is a retract (0), and sending the
    // raw direction was the root of the "re-up drops the net" bug.
    const sent = nextValue(state.value, direction)
    dispatch({ type: 'click', direction, now })
    // The viewer acted — the optimistic number is now authoritative
    // even if the mount fetch hasn't landed; show it, don't fade.
    setHydrated(true)
    fetch('/api/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ targetType, targetId, value: sent }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { ok?: boolean; value?: unknown; count?: unknown } | null) => {
        if (!json || json.ok !== true) return
        dispatch({
          type: 'reconcile',
          value: asVoteValue(json.value),
          count: Number(json.count) || 0,
        })
      })
      .catch(() => {
        /* Optimistic-only path — the flash already ran. */
      })
  }

  const disabled = state.phase === 'locked'
  const votedUp = state.value === 1
  const votedDown = state.value === -1
  const votedDir = votedUp ? 'up' : votedDown ? 'down' : 'none'
  // Bump derives from flash so the count slides UP for an up-vote and
  // DOWN for a down-vote. -8px translation in the slide direction.
  const bump = state.flash === 'up' ? 1 : state.flash === 'down' ? -1 : 0
  const flashUpClass = state.flash === 'up' ? ' flash' : ''
  const flashDownClass = state.flash === 'down' ? ' flash' : ''

  const numStyle = reduced.current
    ? { transform: 'none', opacity: state.flash ? 0.6 : 1 }
    : { transform: `translateY(${bump * -8}px)` }

  // Pluralize-aware visible label so the unit agrees with the
  // displayed count. The aria-labels describe the action (vote
  // direction), not the result, so they stay on the plural form
  // — the displayed count is already announced by the count cell.
  //
  // Critique pass-49 MED: the label is `vote(s) so far` — the
  // prior pass-34 `community vote(s)` framing surfaced as a
  // staccato `1 / COMMUNITY VOTE` on the bare-integer + singular-
  // noun pair, ambiguous between the tally read (one reader
  // voted) and a counter widget value. The "so far" suffix names
  // the count as a tally with implicit time-context, dropping
  // the redundant `community` prefix (the surrounding voteHelp +
  // voteQuestion already carry the community framing). The
  // integer the reader sees is still the distinct voter count
  // on the target, not the signed net — the pass-34 retarget
  // from "net votes" stays; only the wording around it moves.
  const displayLabel = Math.round(state.count) === 1 ? labelSingular : label

  // State pill copy (#160): surfaces for every signed-in member
  // and *describes the current state* of their vote (haven't
  // voted yet / voted higher / voted lower). Anon viewers never
  // see the pill — the affordance is viewer-identity bearing.
  //
  // Pass-27 reopens pass-12 #189's earlier scope. #189 dropped
  // the no-vote pill on the theory that <VoteRowHead>'s "cast
  // vote" head meta already owned the channel — but pass-27
  // observed a signed-in non-voter on the season page reading
  // "YOUR VOTE / CAST VOTE / Does this belong in the community
  // top 10? / +1 / COMMUNITY · NET VOTE" still couldn't tell at
  // a glance whether the +1 was the community net or their own
  // already-cast vote. The "cast vote" meta is an *action* nudge;
  // the symmetry of "you voted higher / you voted lower" wants
  // a *state* declaration on the third side — "you haven't voted
  // yet" finishes the triad descriptively, not duplicatively.
  // VoteRowHead's "cast vote" stays the action affordance; the
  // cap declares state. Together they no longer leave the +1
  // ambiguous.
  const stateCaption = votedUp
    ? 'you voted higher'
    : votedDown
      ? 'you voted lower'
      : "you haven't voted yet"
  const showStateCap = signedIn

  return (
    <div
      className="vote-pair-stack"
      data-testid="vote-pair-stack"
      data-signed-in={signedIn ? 'true' : 'false'}
    >
    {showStateCap ? (
      <div
        className="vote-state-cap"
        data-testid="vote-state-cap"
        data-vote-state={votedDir}
      >
        {stateCaption}
      </div>
    ) : null}
    <div
      className="vote-pair"
      data-testid="vote-pair"
      data-vote-value={state.value}
      data-voted={votedDir}
      data-hydrated={hydrated ? 'true' : 'false'}
      aria-label={`Vote on ${label}`}
    >
      <button
        type="button"
        className={`vote-btn vote-down${flashDownClass}${votedDown ? ' voted' : ''}`}
        onClick={onClick('down')}
        disabled={disabled}
        aria-pressed={votedDown}
        aria-label={
          votedDown ? `Remove your down vote on ${label}` : `Vote down ${label}`
        }
        title={votedDown ? 'You voted this down — click to undo' : undefined}
        data-testid="vote-down"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M5 12 L12 19 L19 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="19"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className={`vote-count${state.flash ? ' moving' : ''}`}>
        <span
          className={`vote-num${reduced.current ? ' reduced' : ''}`}
          data-testid="vote-count"
          style={numStyle}
        >
          {formatVoterCount(state.count)}
        </span>
        <span className="vote-label">{displayLabel}</span>
      </div>
      <button
        type="button"
        className={`vote-btn vote-up${flashUpClass}${votedUp ? ' voted' : ''}`}
        onClick={onClick('up')}
        disabled={disabled}
        aria-pressed={votedUp}
        aria-label={
          votedUp ? `Remove your up vote on ${label}` : `Vote up ${label}`
        }
        title={votedUp ? 'You voted this up — click to undo' : undefined}
        data-testid="vote-up"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M5 12 L12 5 L19 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="19"
            x2="12"
            y2="5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
    </div>
  )
}

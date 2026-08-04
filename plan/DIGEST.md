# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-04

## Headline

**A clean 26 hours for the night shift itself — no starvation loss
(08-03 and today's tick both got through) — but e2e-full's
duration-ceiling breach just posted its 14th and 15th consecutive
red nights (08-02, 08-03), and its completion rate keeps eroding:
tonight's run reached 9,399 of 10,485 tests (89.6%) before the
75-minute wall, down from 92.7% completion when candidate #34 was
first filed on 07-21 against a 10,012-test catalog.** Every
completed check still passes — this is capacity, not quality,
exactly as diagnosed two weeks ago — but #34 (shard the crawl)
remains unpromoted 14 days after filing, and every day it stays
unpromoted is a guaranteed-red night with zero new information.
Underneath both fixed points: 40 commits since last digest, 20
content ships (all Rule 3 themed-list extends) paired 1:1 with
matching audit logs, all `march` runs in the window green, deploy
ready at HEAD.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| 2026-08-03 12:36 → 2026-08-04 11:17 (40 `march` runs sampled) | 40 | All `success` — no crashes, no cancellations |
| Commits since last digest (4c7ece58) | 40 | 20 `content:` ships, 20 matching `audit:` progress logs (1:1 pairing — Rule 3 drain cadence) |
| `night` (digest) | 2 runs since last digest | 08-03 got through, today (08-04, this tick) getting through — no starvation loss this window |
| `e2e-full` breadth crawl | 2 nights (08-02, 08-03) | Both `failure` — duration-ceiling breach, not a test regression (candidate #34, unpromoted, now 14 days) |
| `pnpm deploy:check` at HEAD (`ec6b27b2`) | — | `ready` |

## The saga

Rule 2 (season-fill drain) stays stalled short of gap-zero: the
CADENCE gap table still reads **46 gap-slots across 45 shows**,
unchanged since 08-02's sweep, and every remaining row is starred
(confirmed-but-unaired or still-airing) — nothing actionable today.
That correctly falls through to **Rule 3 (themed lists)**, which
carried all 20 of this window's content commits: extends across
`the-doubters-had-to-walk-it-back`, `best-non-winning-runs`,
`the-twist-is-the-format`, `a-second-life-built-into-the-format`,
`best-reunion-specials`, `when-the-chairs-turned-over`,
`the-franchise-started-borrowing-from-itself`,
`never-needed-a-villain`, `best-location-reveals`,
`closing-statement`, `running-on-muscle-memory`,
`best-comeback-seasons`, `not-knowing-was-the-point`,
`best-newbie-casts`, `when-the-basket-became-a-bracket`,
`same-crown-new-price-tag`, `the-city-already-had-a-show`,
`the-open-call-built-the-format`, `the-format-learned-to-travel`,
`the-advantage-was-never-free`. Every extend paired with its own
Rule-3 audit progress log (89th through 110th passes) — steady,
sustained velocity, zero zero-ship passes this window.

Next weekly season sweep due ~2026-08-09 (last ran 08-02); Rule 1
(new-show add) stays LOCKED until the gap table reads a literal
zero.

## Queues now

- `plan/AUDIT.md`: 8 Pending rows. 2 HIGH (the-voice factual
  corruption; night-shift starvation — quieter this window but
  still unfixed at the root), 2 MED (e2e-full timeout — see
  Headline; the standing Rule 2 drain row, currently starved of
  actionable work), 4 LOW.
- `plan/CRITIQUE.md`: last pass 104, 2026-07-25 — **10 days stale**,
  52 Pending rows sitting unworked. Nothing in this window's pulse
  explains the gap (shipping-mode gate is lifted, so critique's
  normal rate-limited cadence should be firing); worth a look if
  it's still stale at tomorrow's digest.
- `plan/PHASE_CANDIDATES.md`: last pass 59, 2026-07-28 (7 days
  stale). 3 unpromoted candidates carrying real weight: #34 (shard
  e2e-full, 14 days unpromoted), #35 (decouple night.yml
  concurrency, still relevant despite two clean nights — the race
  is unfixed, not resolved), #36 (the-voice remediation, mirrors
  the HIGH AUDIT row).
- `triage:needs-user`: 4 open issues, all stale infra-crash reports
  from June/July (#586, #565, #399, #398) — no new ones this
  window.
- `triage:loop-queued`: 1 open issue (#636, the e2e-full mirror —
  same finding as the AUDIT/candidate #34 pair, no new signal).

## Needs you

Three fixes are fully scoped and sitting idle, all blocked on the
same cause: the cloud loop's `ACTIONS_PAT` lacks the `workflows`
OAuth scope needed to edit `.github/workflows/*.yml`, so none of
them can ship without a local `/oversight` session.

1. **Candidate #34** — shard the e2e-full crawl. 14 days unpromoted,
   15 consecutive red nights, completion rate actively eroding
   (92.7% → 89.6% since filing). Highest-leverage of the three: it
   turns a guaranteed-red night back into signal.
2. **Candidate #35** — decouple `night.yml`'s concurrency group
   from `march`. Two clean nights in a row (08-03, 08-04) is
   encouraging but not evidence the race is fixed — it's the same
   unfixed starvation condition that cost a full week of dark
   digests on 07-21 through 07-26.
3. **Candidate #36** — the-voice factual-corruption remediation. A
   currently-LIVE false "the show has ended" claim in production;
   scoped as a 7-step multi-file fix, explicitly flagged as too
   large and too risky for an unreviewed autonomous tick.

Also worth a glance: `plan/CRITIQUE.md`'s 10-day-stale last pass
against 52 Pending rows — not urgent, but if it's still stale
tomorrow it's worth asking why critique's cadence gate isn't
firing.

## Today's intent

Rule 2 stays locked (gap table starred-out); today's drain targets
are whatever Rule 3 themed-list concepts clear the excellence gate
next — the last 20 extends show no sign of slowing. Top non-content
finding to watch: whether e2e-full's completion percentage keeps
eroding past tonight's 89.6% — if it drops meaningfully further,
that's a sharper argument for promoting candidate #34 than the raw
red-night-streak count already is.

## Tuning proposals

None filed this tick. All three live proposals from prior digests
(#34, #35, #36) remain accurately scoped and already carry the
freshest evidence available (this tick's e2e-full read, two clean
night-shift runs); no new tuning signal emerged from this window's
pulse that isn't already captured in an existing candidate.

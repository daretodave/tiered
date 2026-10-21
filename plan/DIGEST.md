# DIGEST — 2026-10-21

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Mostly clean day — 5 of 6 march ticks shipped, one crashed on the
recurring "prompt too long" class; critique pass 189 landed fresh and
already fixed two of its own prior HIGH findings same-day.** The loop
spent the window on Rule 3 themed-list review (one real factual
contradiction caught and fixed) and two content-gap-redirect fixes
for critique HIGHs filed yesterday (bachelor/grant-ellis, below-deck/
phuket restatement defects), then pass 189 ran fresh tonight and
immediately found a *new* restatement defect in the very file
fa5bb4ef just fixed (canon.md, not the season file the fix touched).
One march tick (14:40 UTC) crashed with `Prompt is too long` —
candidate #29's named failure class, recurring 11 days after its last
occurrence, auto-filed to issue #565. `e2e-full` also went red
overnight (80.5% complete, zero test failures, the standard
duration-ceiling breach — candidate #34, now 92 days unpromoted).
Deploy is green at HEAD (`2435b6a0`).

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-20 15:20 | night | digest: 2026-10-20 |
| 10-20 17:30–18:21 | march | success — content: critique redirect, below-deck/phuket restatement fix |
| 10-20 20:52–21:47 | march | success — content: critique redirect, bachelor/grant-ellis restatement fix |
| 10-20 23:44–23:58 | march | success — critique: pass 189, 4 findings (1 high, 2 med, 1 low) |
| 10-21 01:17 | e2e-full | **failure** — 75-min duration-ceiling breach, 8,643/10,743 (80.5%), zero test failures (candidate #34) |
| 10-21 04:22–05:14 | march | success — content: Rule 3 research, zero-ship (no candidate cleared) |
| 10-21 09:38–10:25 | march | success — content: Rule 3 review batch, 4 lists reviewed, 1 factual contradiction fixed |
| 10-21 14:40–15:45 | march | **failure** — SDK crash, "Prompt is too long" (candidate #29), auto-filed to issue #565 |
| 10-21 15:xx | night | this tick (digest) |

5 of 6 scheduled march windows produced a commit; the one failure was
a context-overflow crash, not a code or content defect.

## The saga

**Season-fill (Rule 2) / sweep:** CADENCE gap table holds at
**35 shows / 37 gap-slots**, all starred confirmed-but-unaired —
unchanged since the 2026-10-19 sweep (next due 2026-10-26). Today's
04:22 tick reconfirmed zero actionable targets. Show-add stays
LOCKED.

**Rule 3 (themed-list extend/review):** one review batch shipped
(4 of 11 overdue lists refreshed against the 90-day floor):
`the-itinerary-was-the-format`, `sorted-before-they-landed`,
`the-founding-seven-slowly-rebuilt`, `no-season-sends-a-queen-home-
the-same-way-twice`. Found a genuine internal contradiction in the
first — rank 8 (ANTM S12, São Paulo) claimed "the only cycle that
ever sets foot in South America," directly contradicted by the same
list's own rank 14 (S20, Rio + São Paulo) — rewrote rank 8 to a
"first cycle" framing. The other three checked out clean. 7 more
lists remain over the 90-day floor for the next review tick. Earlier
same-day tick found zero actionable single-show-list candidates
(every show already has one).

**Critique:** pass 189 ran fresh (23:56 UTC, commit `2014bc9c`) — now
**under a day stale**, a big improvement on yesterday's 7-day gap.
Filed 4 findings (1 HIGH, 2 MED, 1 LOW), including a HIGH that lands
on the exact page two content-gap-redirect ticks just fixed
(`/shows/bachelor/season/grant-ellis`) — this time in `canon.md`
rather than the season file, meaning the fa5bb4ef fix's scope didn't
reach every near-verbatim restatement site on the page. Pending
findings: **64** (1 HIGH, 39 MED, 24 LOW), spanning passes 144–189.

**Velocity vs. the three bearings rules:** steady — Rule 2 fully
starved (as it's been for weeks), Rule 3 found real work (one
genuine content bug caught), critique kept its normal cadence and is
now fresh rather than stale. The one lost cycle was the 14:40 crash,
not a dispatch-precedence problem.

## Queues now

- **CADENCE gap table:** 37 shows/slots, unchanged since 2026-10-14;
  next sweep due 2026-10-26.
- **plan/CRITIQUE.md:** last pass 189 (commit `2014bc9c`,
  2026-10-20T23:56Z) — **fresh**, under a day stale. 64 pending
  findings (1 HIGH, 39 MED, 24 LOW) — see "Needs you" for the HIGH.
- **plan/PHASE_CANDIDATES.md:** last full `/expand` pass 74 (commit
  `6d1d104e`, 2026-10-04) — now **17 days stale**. Two candidates got
  fresh reinforcement this tick instead (see "Tuning proposals"):
  #29 (ledger file-size wall / SDK crash class) and #34 (e2e-full
  duration ceiling), both still the file's longest-unpromoted items.
- **Open `triage:needs-user`:** 9 (unchanged). **`triage:loop-
  queued`:** 5 (unchanged). **Open unlabeled issues:** not re-checked
  this tick beyond the march pulse (no new issues surfaced in the
  window).
- **Ledger file sizes** (candidate #29): `plan/AUDIT.md` 1.30MB
  (still fails a plain `Read`, uncondensed since the 10-04 wall was
  first hit), `plan/LISTS.md` 1.29MB, `plan/CRITIQUE.md` 876KB
  (holding near the 10-20 condensed size), `plan/PHASE_CANDIDATES.md`
  466KB.

## Needs you

- **1 open HIGH `plan/CRITIQUE.md` finding, filed tonight:**
  pass-189 found `content/shows/bachelor/canon.md`'s Season 29
  rationale paragraph still restates the "second Black Bachelor /
  fastest turnaround" fact pair that today's earlier fa5bb4ef fix
  explicitly scoped out of — the fix only touched the season file,
  not canon.md. Pre-scoped suggested fix already in the row. Good
  candidate for the next `/iterate` tick.
- **Candidate #29 (ledger file-size wall / SDK "prompt too long"
  crash)** — recurred again today (run 39618924091, 14:40 UTC),
  11 days after its last occurrence, auto-filed to issue #565. The
  10-20 proof-of-fix (condensing CRITIQUE.md's orphaned-resolved
  rows shrank it 2.3MB → 890KB) hasn't been extended to `plan/
  AUDIT.md` (1.3MB, still uncondensed, still fails a plain `Read`)
  — the next obvious candidate for the identical treatment.
- **Candidate #34 (shard e2e-full)** — breached again overnight
  (80.5% complete, zero test failures), 92 days unpromoted, still
  the file's single longest-standing cloud-blocked item. Alternating
  green/red with no trend either direction for a month now.
- 9 open `triage:needs-user` / 5 `triage:loop-queued` issues,
  unreviewed for several weeks — still waiting on a `/triage` sweep.
- Deploy is green at HEAD (`2435b6a0`) — no action needed there.

## Today's intent

Top content target: the fresh HIGH critique finding on `canon.md`
(bachelor/grant-ellis) is pre-scoped and ready for `/iterate` the
next time Rule 2/3 go non-actionable. Top non-content finding:
candidate #29's crash class just recurred for the second time this
month (10-10, now 10-21) — the proven-cheap fix (condense `plan/
AUDIT.md` the way `plan/CRITIQUE.md` was condensed 10-20) is sitting
unapplied while the file that needs it most stays the one most likely
to trigger the next crash.

## Tuning proposals

Two reinforcements filed directly into `plan/PHASE_CANDIDATES.md`
this tick (not promoted — `/oversight` only):

1. **Candidate #29** — today's SDK crash (run 39618924091, "Prompt is
   too long," auto-filed to issue #565) is a second dated production
   occurrence bracketing the 10-20 proof-of-fix evidence: the fix
   works when applied (CRITIQUE.md), the crash keeps recurring when
   it isn't (AUDIT.md still uncondensed). Worth promoting now that
   both sides of the argument have fresh same-month data points.
2. **Candidate #34** — e2e-full breached again overnight (run
   39526452277, 80.5% complete), continuing the alternating green/red
   pattern with no trend either direction across the last ~40 nights
   tracked. No new evidence beyond confirming the pattern holds; still
   the file's longest-unpromoted item at 92 days.

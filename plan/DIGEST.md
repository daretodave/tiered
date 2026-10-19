# DIGEST — 2026-10-19

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**The loop was dark for roughly four days.** Starting 2026-10-15
11:15 UTC, every `march` tick failed with the same cause — "You're
out of extra usage · resets 8am (UTC)" — a Claude Code subscription
usage-cap exhaustion, not a code regression. 26 consecutive `march`
failures and 2 consecutive `night`/digest failures followed (this is
the first digest since 2026-10-14; 2026-10-17 and 2026-10-18's night
runs both hit the same cap). Only 2 commits landed in that entire
window, both in the few hours *before* the cap hit. The cap reset
this morning and the very next scheduled tick (11:14:57Z) succeeded
cleanly, shipping a routine season sweep (0 new, gap holds at 37).
Deploy is green at HEAD (`c7b9118c`). `e2e-full` stayed red both
nights — same long-standing single-worker duration-ceiling story
(candidate #34), not a new issue.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-14 19:35 | march | success — content: fix within-entry echo, two themed lists |
| 10-15 05:45 | march | success — content: Rule 3 fresh-season extends, three themed lists |
| 10-15 11:15 → 10-19 05:19 | march | **26 consecutive failures** — "out of extra usage," cap exhaustion, zero code involved |
| 10-17 13:49 | night | failed — same cap exhaustion; no digest shipped |
| 10-18 14:04 | night | failed — same cap exhaustion; no digest shipped |
| 10-18 00:39 / 10-19 00:49 | e2e-full | failed both nights — known single-worker wall (candidate #34), ~76-82% complete at the 75-min cutoff, zero test failures |
| 10-19 11:14:57 | march | **success** — first tick after the 8am UTC reset; shipped season sweep (gap 37, unchanged) |
| 10-19 17:03 | night | this tick (digest) |

2 of ~29 scheduled march windows in the period produced a commit;
the gap is entirely usage-cap, not a shipping problem — the two
ticks that *did* run before the cap hit shipped clean, and the one
tick after the reset also shipped clean.

## The saga

**Season-fill (Rule 2) / sweep:** the 2026-10-19 sweep (15th full
pass) reconfirmed all 35 starred CADENCE rows across the 68-show
catalog — gap holds at **37 shows / slots**, unchanged from the
2026-10-14 table correction. No drain capacity was available during
the outage window to make progress beyond the sweep itself.

**Rule 3 (themed-list extend):** three fresh-season extends shipped
in the narrow pre-cap window (10-15 05:45 tick) plus an echo fix to
two existing lists (10-14 19:35 tick) — both land before the digest
gap opens.

**Velocity vs. the three bearings rules:** effectively paused for 4
days by an external constraint (subscription usage), not a queue or
gate problem. The one post-reset tick correctly fell through to the
standing Rule-2 sweep cadence rather than forcing a pick.

## Queues now

- **CADENCE gap table:** 37 shows/slots, unchanged since 2026-10-14;
  next sweep not due until next week.
- **plan/CRITIQUE.md:** last pass 188 (commit 80a52e1c, 2026-10-13)
  — stale 6 days purely from the outage; several `[needs-user-call]`
  rows still pending oversight (oldest: pass-37 `/u/[handle]`
  stat-chip question, pass-77/121 `/shows` B-tier filter-taxonomy
  question, pass-96 season/theme dynamic-cache mystery).
- **plan/PHASE_CANDIDATES.md:** last pass 74 (commit 6d1d104e,
  2026-10-04) — also stale purely from the outage. Candidate #34
  (shard e2e-full) remains the longest-unpromoted cloud-blocked item.
- **Open `triage:needs-user`:** 9 (oldest #399, 2026-06-11, likely
  stale per prior digest note). **`triage:loop-queued`:** 5. **Open
  unlabeled issues:** 0.
- **Ledger file sizes** (candidate #29's own signal, re-measured this
  tick): `plan/CRITIQUE.md` 2.3MB, `plan/AUDIT.md` 1.3MB,
  `plan/LISTS.md` 1.3MB, `plan/PHASE_CANDIDATES.md` 468KB — flat vs.
  the 2026-10-04 measurement, but see Tuning proposals below for new
  production evidence this is no longer theoretical.

## Needs you

- **The usage-cap outage itself.** No code or gate was at fault, but
  4 days of silence with 26 identically-failing CI runs is exactly
  the kind of thing a human notices before the loop does. Worth
  deciding whether the march cadence should back off automatically
  after repeated identical cap failures (see Tuning proposals) or
  whether this is a one-off to shrug off. Filed as a HIGH row in
  `plan/AUDIT.md` this tick, `[needs-user-call]` — same cloud-scope
  limitation as candidate #34 (no workflow-file write access from
  `ACTIONS_PAT`).
- **Candidate #34 (shard e2e-full)** remains the standing highest-
  leverage `/oversight` action blocking a green nightly breadth run
  — unchanged story, now compounded by the outage's own 2 extra red
  nights.
- **9 open `triage:needs-user` / 5 `triage:loop-queued` issues**,
  unreviewed since before the outage — worth a `/triage` sweep once
  the loop has run a few clean ticks to re-establish cadence.
- Deploy is green at HEAD (`c7b9118c`) — no action needed there.

## Today's intent

Let the loop re-establish normal cadence for a few ticks before
treating the quiet window as anything beyond what it was. Top
non-content finding: the usage-cap outage write-up above and its
`plan/AUDIT.md` row are the thing most worth a human's attention
right now — not because anything broke, but because 4 days of silent
identical failures is worth knowing about before it happens again.

## Tuning proposals

Two filed as `plan/PHASE_CANDIDATES.md`-bound signals this tick
(not promoted — `/oversight` only):

1. **New: march cadence has no backoff on identical cap-exhaustion
   failures.** 26 consecutive ticks over 4 days each independently
   discovered the same "out of extra usage" state and burned a full
   CI run finding out again. A cheap guard (e.g. skip the tick if
   the prior tick's failure log contains the same "out of extra
   usage" string and the reset time hasn't passed) would turn 26
   wasted runs into 1. Low urgency — self-healed at the cap reset —
   but free to fix and currently invisible without this digest.
2. **Reinforcing #29 (append-only ledger file-size wall) with fresh
   production evidence.** Previously a theoretical risk flagged at
   2026-10-04 file-size measurements; this window's march-failure
   logs showed "Prompt is too long" as the literal SDK error on
   multiple distinct dates before the cap outage even started
   (2026-10-09 run 38006815107, 2026-10-13 runs 38482214109 /
   38447328001, 2026-10-14 run 38662419536) — all four reading one
   or more of the now-1-2MB ledger files. This is no longer a future
   risk; it is an active, recurring cause of lost ticks independent
   of the usage-cap story above. Worth bumping #29's priority at the
   next `/oversight` pass.

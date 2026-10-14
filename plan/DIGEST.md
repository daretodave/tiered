# DIGEST — 2026-10-14

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A quiet, productive day on the content saga — the-voice's `take_h2`
backlog fully drained and a CADENCE table-drift bug caught and fixed
same-day — but the nightly breadth crawl just set an unwelcome record:
**four consecutive red `e2e-full` nights**, surpassing yesterday's
three-night streak. Zero test failures each night; it's the same
75-minute single-worker wall, 85 days unpromoted on the shard fix
(candidate #34). Deploy is green at HEAD.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-13 18:30 | march | failed — known issue #565 org-access crash class (8th+ recurrence since 07-12), no new root cause |
| 10-13 23:06 | march | failed — same issue #565 crash class; stranded the `loop:content` mirror issue #823 (Amazing Race S39) open mid-ship |
| 10-14 02:09 | march | success — content: `take_h2` backfill, the-voice seasons 1-10 |
| 10-14 08:00 | march | success — content: season backfill, love-is-blind S11 (Boston); CADENCE gap row removed, show fully drained |
| 10-14 14:01 | march | success — content: `take_h2` backfill, the-voice seasons 11-21; caught + fixed a CADENCE table-drift bug (love-is-blind/traitors rows not physically applied as narrated) |
| nightly | e2e-full | **failed** (4th consecutive) — 8,855/10,735 complete (82.5%) at the 75-min wall, zero test failures |
| nightly | night (prior) | success (2026-10-13 digest shipped clean) |

3 of 5 march ticks shipped; the 2 failures share one known root cause
(issue #565), not new regressions.

## The saga

**Season-fill (Rule 2):** love-is-blind fully drained (10/11 → 11/11,
gap row removed) — Season 11 (Boston) filed pre-season/format-only per
spoiler discipline, canon rebased (Houston/Minneapolis/Charlotte/
Dallas/Denver each shifted one rank). Gap table now reads **35 shows /
37 gap-slots** (was 36/40 three nights ago at the 10-11 sweep) — net
progress despite a same-day drift-bug correction (a narrated "row
removed" from the 10-14 first tick hadn't physically landed; fixed in
the second tick along with a missing `traitors` row insertion).

**content-check backlog:** the-voice's `take_h2` gap (season-page
Section 01 H2 verbatim-restating-H1 defect, issue #393) is now fully
backfilled for seasons 1-21 across today's two ticks. Warning count:
29 → 18, and **all 18 remaining sit inside the frozen the-voice S22-29
factual-corruption range** (issue #762, `triage:needs-user` — correctly
left untouched pending the dedicated fix that issue calls for, not a
missed drain).

**Velocity vs. the three bearings rules:** Rule 2 (season-fill) is
live and draining — 1 full show cleared today. Rule 3 (themed-list
extend) didn't fire this window; Rule 2 had actionable picks both
ticks so no fallback was needed. No new show added (Rule 1 — correctly
locked, gap table non-zero).

## Queues now

- **CADENCE gap table:** 35 shows / 37 gap-slots (smallest-gap-first:
  amazing-race, rhonj, the-voice, the-challenge, bachelor,
  american-idol, rhoc all sit at 1 missing season — next sweep due
  2026-10-18).
- **content:check:** 18 warnings, 100% inside the frozen the-voice
  S22-29 range (issue #762).
- **plan/CRITIQUE.md:** last pass 188 (commit 80a52e1c) — several
  `[needs-user-call]` rows still pending oversight judgment (oldest:
  pass-37 `/u/[handle]` stat-chip scaffold question, pass-77/pass-121
  `/shows` B-tier filter-taxonomy question).
- **plan/PHASE_CANDIDATES.md:** 33 pending candidates. Candidate #34
  (shard the e2e-full crawl) is the standing longest-unpromoted item —
  now **85 days** unpromoted, score 6.6.
- **Open `triage:needs-user` issues:** 9 (oldest: #399, 2026-06-11 —
  13 authed e2e specs red on main, since superseded by many green
  runs; likely stale and worth a closing pass). **`triage:loop-queued`:**
  5.

## Needs you

- **Candidate #34 (shard e2e-full across parallel workers)** — 85
  days unpromoted, now directly responsible for a 4-night red streak
  with zero actual test regressions each night. The cloud loop cannot
  fix this itself (`ACTIONS_PAT` lacks the `workflows` OAuth scope to
  edit `.github/workflows/e2e-full.yml`). This is the single highest-
  leverage `/oversight` action available right now.
- **Issue #823** (`loop:content` mirror, "Amazing Race S39") is stuck
  open — the 10-13 23:06 tick crashed mid-ship before closing it. No
  data corruption (the season file was never written), but it'll sit
  open until a future Rule 2 tick picks amazing-race off the gap table
  (currently the joint-smallest gap, 38/39) and closes it naturally.
  Flagging in case it looks stale before then.
- **9 open `triage:needs-user` / 5 `triage:loop-queued` issues**, some
  dating back to June. Worth a `/triage` sweep pass to confirm which
  are still live vs. closeable-as-stale (e.g. #399's "13 authed e2e
  specs red" predates ~130 subsequent green `e2e-full` runs).
- Deploy is green at HEAD (083d884) — no action needed there.

## Today's intent

Next Rule 2 pick should be whichever 1*-gap show's premiere date has
most recently crossed into the present per the 2026-10-11 sweep notes
(amazing-race S39 and rhonj are both joint-smallest and worth a fresh
date check first). Top non-content finding: get candidate #34 in
front of `/oversight` — it's the oldest unpromoted candidate in the
file and the only thing standing between the loop and a green nightly
breadth run.

## Tuning proposals

None new this tick. Candidate #34 already carries the standing
recommendation (reinforced at passes 57/59/72) — the digest's job is
to keep the evidence current, not re-file it; see `plan/AUDIT.md`'s
e2e-full breadth row for the day-by-day record and the 2026-10-14
update appended this tick.

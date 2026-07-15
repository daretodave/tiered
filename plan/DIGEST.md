# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-15

## Headline

Another **all-content 26 hours**: 19 season-backfill commits, **140
seasons filed in ~22 hours** (860 → 1,000 catalog-wide), **5 shows
fully drained to zero** (southern-charm, vanderpump-rules,
married-at-first-sight-australia, ink-master,
so-you-think-you-can-dance), and the CADENCE gap table fell from
**325 → 71** across 32 remaining rows — 61 of those 71 points are
now confirmed-but-unaired `1*`/`2*` deferrals, leaving **chopped's
38 real, actionable seasons as the only genuine backlog left in
the entire catalog**. That is superb velocity. The cost: **every
single tick in the window dispatched to content** — zero
`/critique`, `/iterate`, `/expand`, `/ship-a-phase`, or `/ship-data`
runs since 2026-07-12. Meanwhile the nightly `E2E_FULL=1` breadth
crawl has now gone red **three nights running** (07-13, 07-14,
07-15) on a real, worsening bug — mobile horizontal overflow on
season pages — that grew from **1 affected URL to 2** on last
night's run, and issue #568/AUDIT's MED row (score 5.4, the
highest-scoring non-standing item in the queue) has sat untouched
for 3 days because `/iterate` structurally cannot run while the
content-gaps gate stays open (see Tuning proposals). A separate
cloud `march` tick also hard-timed-out this morning (09:23 UTC,
run 29404349827) — the fifth recurrence on issue #565's "prompt
too long" / long-tick crash pattern, three of them landing since
the last digest. Deploy is green at HEAD (`b0cdb56`).

## While you were out

| Time (UTC, 07-14→15) | Tick | Outcome |
|---|---|---|
| 11:14 | march → content | success — 90 Day Fiancé S2-11 backfill, drained 1/12→11/12, 1* |
| 12:14 | march → content | success — Southern Charm S2-11 backfill + canon rebase, **fully drained** |
| 13:09–13:56 | march → content (2 ticks) | success — American Ninja Warrior S7-16 then S17, drained 6/18→17/18, 1* |
| 15:08–15:53 | march → content (2 ticks) | success — Vanderpump Rules S2-11 then S12, **fully drained (12/12)** |
| 17:20 | march → triage | success — closed 2 orphaned content-mirror issues (#577, #580) |
| 18:54–19:47 | march → content (2 ticks) | success — Married at First Sight Australia S2-11 then S12-13, **fully drained (13/13)** |
| 21:07–21:54 | march → content (2 ticks) | success — Married at First Sight S7-16 then S17-19, drained 6/21→19/20, 1* |
| 23:01–23:52 | march → content (2 ticks) | success — Ink Master S2-11 then S12-17, **fully drained (17/17)** |
| 00:50–01:58 | march → content (2 ticks) | success — So You Think You Can Dance S2-11 then S12-18, **fully drained (18/18)** |
| 03:18–07:22 | march → content (3 ticks) | success — The Real World S2-11, S12-21, S22-31, drained 1/33→31/33, 2* |
| 08:31–09:33 | march → content (2 ticks) | success — Chopped S7-16 then S17-26, drained 6/64→26/64 (38 remain) |
| 09:23 | march | **failure** — job-level timeout after ~90 min, no commit; recurred on issue #565 |
| 10:19 | march | **cancelled** — overlapped with this digest tick starting |
| (nightly, separate workflow) 23:19 07-14 | e2e-full | **red** — mobile overflow now on 2 URLs (the-challenge + american-ninja-warrior), 3rd consecutive red night, recurred on issue #568 |

Net: 38 commits (19 content + 18 audit + 1 triage) across ~25 march
ticks — 23 green, 1 red (timeout), 1 cancelled. Every green tick
dispatched to Step 3b.5 (content). Zero ticks reached `/critique`,
`/iterate`, `/expand`, `/ship-a-phase`, or `/ship-data`.

## The saga

**Shows scaffolded:** 0 — still LOCKED per the 2026-07-12 mission
pivot. Catalog holds at **68 shows**.

**Seasons drained:** **140 seasons across 8 shows** this window (90
Day Fiancé, Southern Charm, American Ninja Warrior, Vanderpump
Rules, Married at First Sight Australia, Married at First Sight,
Ink Master, So You Think You Can Dance, The Real World, Chopped —
10 shows touched, 5 driven to zero). Catalog-wide: **1,000 seasons
filed** (up from 860 at window open). The CADENCE gap table:
**325 → 71** across **32 remaining rows** (down from 55 rows at
window open). Of those 71 points, **21 rows carry 1\*** (single
season, confirmed-but-unaired), **2 rows carry 2\*** (hells-kitchen,
the-real-world), and **exactly one row is real, actionable backlog:
chopped at 26/64 filed, 38 remaining**. Once chopped drains, the
entire content-gaps standing row — open since the 2026-07-12
pivot — reads zero for the first time, which would flip march's
Step 3b.5 gate closed and let `/iterate`/`/critique`/`/expand` run
again automatically.

**Velocity vs. bearings:** Rule 1 (show coverage) — still LOCKED,
correctly idle. Rule 1a (weekly sweep) — next due 07-19, on
schedule. Rule 2 (season completeness) — engine at full throttle:
140 seasons in ~22 hours is the fastest window yet, comfortably
ahead of the prior 16-seasons-in-25-hours pace logged 07-13. Rule 3
(themed lists) — untouched, correctly deferred until gap-zero.

**Critique backlog:** unchanged — still **pass 93** (2026-07-12),
6 findings, 1 HIGH still open. No pass has run in **3 days**, the
longest critique-silence window logged since the cadence started.

## Queues now

- **AUDIT.md open:** 6 real rows. The standing content-gaps row
  (stays pending by design until chopped hits zero); the mobile-
  overflow bug (MED, score **5.4** — the highest-scoring non-standing
  row in the file, issue #568, now 3 days old and 2 URLs deep); the
  ship-content mirror-issue idempotency gap (LOW, score 3.0, issues
  #577/#580 — those two issues were closed by hand this window but
  the underlying `loop-issue.mjs` find-or-reuse fix is still
  unshipped); a themed-list category-enum docs drift (LOW, 2.4);
  the `YEAR_TENURE_RE` teen-number gap (LOW, 2.7); the Love Island
  US S8 post-finale shift-note (MED, 4.5 — deliberately deferred,
  reunion special airs 2026-08-31, correctly not drained early).
- **CRITIQUE.md:** last pass **93** (2026-07-12T17:16Z), unchanged
  at **3,463 lines** — file size hasn't moved since the 07-13
  digest, confirming zero critique passes in 3 days. Pass 93's 1
  HIGH finding (dragrace season-18 missing `pull` field) is now
  entering its **3rd day unaddressed**.
- **PHASE_CANDIDATES.md:** unchanged at **4,588 lines**, also flat
  since 07-13. Top unpromoted scores unchanged: **#15 (9.4)** show
  canon completeness gate, **#28 (8.3)** stat-tile literal-duplicate
  invariant, **#25 (8.0)** canon-rationale echo gate. Last real
  promotion is now **34 days stale** (2026-06-11).
- **Triage:** 0 unlabeled open issues. `triage:needs-user`: 3 open —
  **#565** (the "prompt too long"/timeout crash pattern, now **5
  recurrences** since 2026-07-08, 3 of them since the last digest:
  07-13T03:45, 07-13T18:04, 07-13T20:27, plus today's 09:23 timeout),
  and **#398/#399**, now **34–35 days stale**, still no visible
  owner action. `triage:loop-queued`: 1 — **#568** (mobile-overflow,
  recurred twice more since filing, now on 2 URLs).

## Needs you

1. **The e2e-full mobile-overflow bug (issue #568) has recurred 3
   nights running and just spread from 1 URL to 2** —
   `/shows/the-challenge/season/vets-and-new-threats` (all 3
   nights) plus `/shows/american-ninja-warrior/season/the-runoffs`
   (new last night). It carries the highest score (5.4) of any
   non-standing AUDIT row and a fully-scoped fix path (trace files
   already captured), but `/iterate` cannot reach it: march's Step
   3b.5 content-gate has fired on every single tick for 3 straight
   days because the standing season-fill-drain row never empties.
   With 38 chopped seasons still ahead and each drained show risking
   a *new* long-title season that trips the same overflow class, the
   affected-URL count could keep growing before anyone fixes the
   underlying CSS/content defect. Worth a targeted decision: either
   let `/iterate` run out-of-band once (bypassing 3b.5 for one tick)
   or accept the bug rides until chopped hits zero.
2. **`/critique`, `/iterate`, and `/expand` have not run in 3 days**
   — the longest silence on any of the three since the 2026-07-12
   pivot. This is the direct, intended cost of the content-gaps
   bias, but it is now large enough (a HIGH critique finding open 3
   days, a scored bug open 3 days, zero phase/data work) that it's
   worth confirming this is still the desired tradeoff rather than
   an unintended side effect of how absolute the Step 3b.5 gate is.
3. **Issue #565's crash pattern hit its 5th occurrence today**
   (09:23 UTC, run 29404349827) — 3 of the 5 total recurrences have
   landed since the 07-13 digest first flagged it. Candidate #29
   (archive closed CRITIQUE.md/AUDIT.md rows to shrink prompt size)
   remains unpromoted and is the most plausible fix; both files it
   targets are still growing.
4. **Two `triage:needs-user` issues (#398, #399) are now 34-35 days
   stale** with no apparent progress since filing 2026-06-11.
5. **Phase-candidate backlog hasn't been promoted in 34 days.** #15
   (score 9.4, show canon completeness gate) is still the standout.

## Today's intent

**Saga:** finish draining chopped — 38 seasons remain, the only
real (non-deferred) gap left in the whole catalog. At the current
~10-seasons-per-tick cap this is roughly 4 more content ticks from
zero, which would close the standing AUDIT row for the first time
since the 2026-07-12 pivot and reopen the Step 3b.5 gate.

**Top non-content finding:** the mobile-overflow bug on season
pages (issue #568, AUDIT MED, score 5.4) — already scoped with two
trace paths captured, and now affecting 2 URLs instead of 1. Ready
for `/iterate` the moment the content-gaps gate clears, or sooner
if bypassed by hand.

**Second-priority finding:** issue #565's crash/timeout pattern —
5 occurrences now, candidate #29 already proposes the fix, needs
promotion.

## Tuning proposals

1. **New this tick — the content-gaps gate has no bug-priority
   carve-out.** `skills/march.md` Step 3b.5 dispatches to content
   whenever any `category: content-gaps` row is Pending, and the
   standing season-fill-drain row (oversight 2026-07-12) is
   explicitly designed to stay Pending until the CADENCE gap table
   reads zero. That's correct by design, but it also means Step 3d
   (`/iterate`) is structurally unreachable for as long as the
   standing row exists — which has now been 3+ days straight, long
   enough that a real, worsening, high-scoring bug (issue #568) sat
   completely unaddressed while it spread from 1 URL to 2. Evidence:
   38 commits this window, 100% content/audit/triage, 0% iterate/
   critique/expand/phase/data. Proposing a scoped carve-out: if
   `plan/AUDIT.md` has a non-content-gaps row scoring ≥5.0 (i.e.
   above the standing row's own 4.5), let Step 3b.5 yield to Step 3d
   for one tick before returning to content, rather than an absolute
   priority order. This is a rails change (gate logic), so proposing
   only — `/oversight` decides.
2. **Reinforcing candidate #29** (archive closed CRITIQUE.md/
   AUDIT.md rows) with fresh numbers: issue #565's crash pattern hit
   its 5th occurrence today, 3 of them landing since this candidate
   was last reinforced in the 07-13 digest. `plan/CRITIQUE.md` (3,463
   lines) and `plan/PHASE_CANDIDATES.md` (4,588 lines) have not
   shrunk — they can't, since no `/critique` or `/expand` pass has
   run to prune them either. The correlation between prompt-size
   growth and recurring crashes is now strong across 5 independent
   incidents; still the standing top candidate for the next
   `/oversight` promotion round.

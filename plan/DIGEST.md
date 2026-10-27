# DIGEST — 2026-10-27

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**The loop recovered and then had a very big day.** Last night's
digest closed on a 20-hour CI outage (Playwright couldn't install
Chromium on GitHub's new Ubuntu 26.04 runner image) with a
confirmed, in-permission fix queued. That fix (`@playwright/test`
1.60→1.64) landed first thing this morning and the loop has been
green since — 9 of the 11 scheduled `march` ticks since last
digest shipped, 2 isolated crashes cleared on retry with no
recurrence. Once unblocked, the loop didn't just catch up, it
restructured: the **nexus v2 upgrade merged** (plan moves from
flat phases to specs+chunks, PR #826), the owner set **`Improve:
bold`** the same window, and a same-day `/expand` pass caught and
fixed a schema gap — the ~23 legacy v1 candidates migrated into
the new `Pending` list weren't visible to the new `Promote: aged`
tooling at all. They are now, and that surfaced something worth a
human look tonight: 8 candidates already clear the aged-promotion
bar (floor 6.0, 21+ days old), top of the stack scoring 9.4, but
every cloud checkout lacks the `.owner` marker — so
`promote.mjs pick` can only `ask`, never auto-promote. The valve
is open; only a local `/oversight` session can actually turn it.
Content-wise: rhoc fully drained to 20/20 (Season 20 "The
Homecoming" filed + canon rebased), the 16th weekly season sweep
found 2 new renewals (survivor S52, below-deck-mediterranean S12),
and critique pass 193 filed a fresh HIGH — rhoc's new Homecoming
page states Vicki Gunvalson's return gap two different ways
("13 seasons away" vs. "since season thirteen") — still open and
the top target for the next tick.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| seven_day utilization | — | unknown (no cached reading) |
| 10-26 20:44–20:45 | march | **failure** — Playwright/Ubuntu-26.04 Chromium crash continuing from last digest |
| 10-27 00:13–00:23 | march | success — Playwright bumped to 1.64 (closes the outage) + a security dependency pass (next, vitest, zod, postcss, vite) |
| 10-27 00:37–02:04 | march (two overlapping ticks) | success — big catch-up batch: rhoc Season 20 "The Homecoming" filed + canon rebased + drained to 20/20; 16th weekly season sweep (2 new gap rows, net 36 shows/38 slots); Amazing Race S39 + The Challenge S42 "Cutthroat" backfilled; the-voice S22-30 corrected against the real NBC run; one themed list extended; a community rank-% header fix; a bachelor/grant-ellis fact fix; e2e vote-spec state isolation fixed; e2e-full sharded across 5 jobs |
| 10-27 02:04–02:40 | march | success — nexus v2 upgrade merged (PR #826: specs+chunks); `Improve: bold` set by the owner; night shift given its own concurrency group; setup-action fix |
| 10-27 02:22 | march | **failure** — isolated crash, cleared on next retry, no recurrence |
| 10-27 02:40–04:37 | march | success — caught up after the retry |
| 10-27 03:20–04:37 | march | success — expand pass 76: field research filed 1 candidate; found and same-day fixed the v1-candidate schema gap (legacy candidates invisible to `Promote: aged`) |
| 10-27 05:25–05:46 | march | success — critique pass 193 (4 findings: 1 HIGH, 2 MED, 1 LOW); a stuck-tick-retries-with-nothing-ready bug fixed; a cadence cron-line-with-trailing-comment parsing bug fixed |
| 10-27 10:36–12:43 | march (3 ticks) | success — CI scheduling hardening (march now fires at :07/:47 off the top of the hour; chained/retried ticks now reach the model under the github-actions bot identity; the cloud Bash ceiling raised to an hour for long foreground gate legs); Rule 3 review batch (4 themed lists re-reviewed, no factual drift) |

## Shipped

- **CI outage closed.** `@playwright/test` 1.60→1.64 restores
  Chromium installs on GitHub's Ubuntu 26.04 runners — last
  night's HIGH `plan/AUDIT.md` row, now ticked `[x]` (green for
  10+ commits since).
- **Nexus v2 upgrade** (PR #826): the plan moves from flat phases
  to specs+chunks. `Improve: bold` set by the owner the same
  window; the night shift gets its own concurrency group.
- **Content:** rhoc fully drained (Season 20 "The Homecoming"
  filed, canon rebased, frontmatter bumped 19→20 seasons);
  Amazing Race S39 + The Challenge S42 "Cutthroat" backfilled;
  the-voice S22-30 corrected against the real NBC run (issue
  #762 lineage); one themed list extended; 4 Rule 3 ledger rows
  re-reviewed with no drift found.
- **16th weekly season sweep:** 2 new gap-table rows — `survivor`
  (S52 renewed/filmed, no premiere date) and
  `below-deck-mediterranean` (S12 renewed). Net: 36 shows / 38
  gap-slots, every row starred confirmed-but-unaired.
- **critique pass 193:** 4 fresh findings on rhoc's new Homecoming
  page — 1 HIGH (Vicki Gunvalson's return gap stated two ways:
  "13 seasons away" vs. "since season thirteen"), 2 MED
  (near-verbatim fact restatement across sections; a canon
  rationale re-derives the body prose above it), 1 LOW (HOST stat
  caption bare-restates its own value).
- **expand pass 76:** field research filed 1 candidate
  ("graduated spoiler-risk labeling"); found and same-day fixed
  the schema gap keeping ~23 legacy v1 candidates invisible to
  `promote.mjs`.
- **Reliability:** e2e vote specs no longer share mutable state;
  `e2e-full` sharded across 5 jobs; a tick that lost background
  work no longer retries when nothing is actually ready; a
  cadence cron-line-with-trailing-comment parsing bug fixed.

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — the v2 upgrade
  landed with an empty table. Building is idle; the AUDIT/
  CRITIQUE/CADENCE maintenance queues are carrying the loop.
- **plan/AUDIT.md:** 1 pending (the standing Season-fill drain
  row — stays open by design until the CADENCE gap table reads
  zero; every row is currently starred/unaired).
- **plan/CRITIQUE.md:** 71 pending, last pass 16h ago (pass 193,
  commit `514b6d8f`).
- **plan/CANDIDATES.md:** 21 pending (20 >21d), oldest 167d.
  Support (fix-all): 0 open user issues · first response none (0
  opened in 7d) · close 2191.2h mean (6 closed in 7d).
- **Candidate cap:** 15 (current count 21, 6 over) — no cuts
  since the last digest (`promote.mjs cuts --since 2026-10-26` →
  none); the cap-cut sweep hasn't run this window.
- **Open `triage:needs-user` / `needs-user` / `triage:loop-queued`
  / `loop-queued`:** 0 across all four labels. Only 2 open issues
  total (#827 content gap, #828 critique-filed HIGH), neither
  flagged for a human call.
- **data/BACKLOG.md:** no data-layer backlog file exists.
- **Deploy:** ready at HEAD `4854d01`.
- **CADENCE gap table:** 36 shows / 38 gap-slots, every row
  starred confirmed-but-unaired as of today's sweep + drain.
- **Breadth (`e2e-full`):** green — latest run
  (2026-10-27T03:36–04:35Z) passed; read, not re-run, per the
  standing rule for this tick.
- **seven_day utilization:** unknown (no cached reading).

## Needs you

- **oversight needed: candidate queue silting (20 pending >21d,
  oldest 167d).**
- **`Promote: aged` is live (`Improve: bold`, set today) but the
  valve can't turn itself from the cloud.** 8 Pending candidates
  already clear the floor (6.0) and the age bar (21d): top of the
  stack is `[score 9.4] Show canon completeness lax→strict gate`
  (proposed 2026-06-15, 134d old). Every cloud checkout lacks the
  `.owner` marker (`scripts/owner.mjs`), so `promote.mjs pick`
  returns `ask` instead of `pick` — this is the intended trust
  boundary, not a bug, but it means the dial's promise ("the loop
  pushes past the plan as far as it can justify") only actually
  fires from a local, owner-mode `/oversight` session.
  **auto-promoted none, 8 awaiting.**
- No `escalate #N` rows (0 open user issues), no blocked specs
  (`Held` lane empty), no open needs-user issues, no
  `motion stalled` (this week already clears the floor), no
  `rotate` rows (0 secret-audit events).

## Today's intent

1. The plan table is empty — the next ready work is the
   CRITIQUE queue's one open HIGH: pass 193's Vicki Gunvalson
   "13 seasons away" vs. "since season thirteen" contradiction on
   rhoc's new Homecoming season page. That's the top target for
   the next `/march` or `/iterate` tick.
2. At the next local `/oversight` session: turn the
   `Promote: aged` valve (8 candidates waiting, top-scored at
   9.4) and weigh the broader candidate-queue silting (20 of 21
   pending are over 21 days old).

## Tuning proposals

None. Both of today's real gaps — the CI outage and the
v1-candidate schema migration — were plain bugs with
in-permission fixes, and both are already shipped. The
`promote.mjs` "ask" behavior for non-owner (cloud) checkouts is
working as designed (`scripts/owner.mjs`'s deliberate trust
boundary), not a mistuned gate — nothing to propose.

# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-07

## Headline

A clean 26 hours (17 of 18 march ticks green, one self-healed infra
blip) that fully drained wave 7's five new shows and closed out
critique pass 77's medium finding — but the nightly breadth crawl
went red on a **timeout**, not a regression: the exhaustive e2e
walk is now large enough (6,573 tests, single worker) to graze the
50-minute CI ceiling, and it will keep tipping over as content
keeps growing unless the gate itself changes. Deploy is green at
HEAD.

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 09:09–18:22 (7 ticks) | march → content drain | success — Big Brother canon rewrite, MAFS/Southern Charm FORMAT caption fixes, critique pass 76 fixes |
| 19:18 | march | **failure** — transient `claude-code-action` infra bug ("directory mismatch... indicates a bug"), not a code regression; self-healed next tick |
| 20:20–23:04 (4 ticks) | march → content-gaps | success — wave 7 new shows shipped: RHOP, The Circle, RHOM |
| 23:27 | e2e-full (nightly breadth) | **failure** — 50-minute timeout at 6,409/6,573 tests (97.5% through, zero actual test failures) |
| 00:04–09:16 (8 ticks) | march → content drain + critique | success — Too Hot to Handle, Southern Charm shipped (wave 7 complete); critique pass 77 filed (2 findings) and finding #489 addressed same-day |
| 10:40 | march | success |

Net: 28 commits since yesterday's digest (11:57 UTC). 18 march
ticks in the last 26h, 17 green.

## The saga

**Shows scaffolded (5, wave 7 fully drained):** The Real
Housewives of Potomac, The Circle, The Real Housewives of Miami,
Too Hot to Handle, Southern Charm. Catalog now stands at **53
shows**. Each wave-7 show shipped frontmatter + canon.md + a
first-season batch per Rule 1, exactly on the standing cadence.

**Seasons drained:** wave 7's first-season batches only so far
(5 seasons, one per new show) — none of the ~36-season remaining
gap those five shows now carry has started draining yet:

| Show | Remaining for Rule 2 drain |
|---|---|
| Southern Charm | 10 |
| The Real Housewives of Potomac | 9 |
| The Circle | 6 |
| The Real Housewives of Miami | 6 |
| Too Hot to Handle | 5 |

**Velocity vs. bearings:** Rule 1 (show coverage) — on pace; wave
7 drained same-day it was filed, same shape as wave 6. Rule 2
(canon completeness, ~5 seasons/tick) — **queue just got heavier,
not lighter**; the wave-7 season backlog above (36 seasons) is now
the largest standing Rule 2 debt since wave 6. Rule 3 (themed
list/tick) — no themed list shipped in this window; worth a check
next content-gap pass.

**New-show queue is empty again** — wave 7 fully shipped, Pending
rows back to 0. This is the exact stall pattern candidate #24
(still awaiting `/oversight` promotion) warns about. The next
`/expand` pass needs to refill wave 8, or Rule 1's mandate stalls
until it does.

## Queues now

- **AUDIT.md Pending:** 1 open row — `[LOW]` pin Supabase CLI
  version in `e2e-full.yml`/`march.yml`/`migrate.yml` (issue
  #416/#480), blocked from cloud (see Needs You).
- **AUDIT.md needs-user-call:** 2 — Naked and Afraid S12/13/15/16
  premiere-date numbering ambiguity; The Apprentice S5 "LA Season"
  framing accuracy check. Both LOW, both editorial calls.
- **CRITIQUE.md:** last pass **77** (2026-07-06), 2 findings — 1
  MED resolved same-day (#489, Southern Charm FORMAT caption), 1
  LOW still open (`/shows` B-tier has no genre/network filter
  chips at 39 shows in one flat scroll — data already exists in
  frontmatter, chrome-only fix).
- **PHASE_CANDIDATES.md:** 10 pending, awaiting promotion (#14,
  15, 16, 18, 19, 20, 21, 22, 23, 24, 25 minus #17 superseded).
  Last promotion was **2026-06-11** — 26 days and 10 candidates
  ago. Backlog is aging.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-user`:
  3 open — #480 (this week's workflows-permission blocker, see
  Needs You), #398/#399 (both **2026-06-11**, nearly a month
  stale — worth an `/oversight` look to close or reconfirm).
  `triage:loop-queued`: 1 — #416 (see Needs You).

## Needs you

1. **Workflow-file edits are structurally blocked from cloud.**
   Two independent tickets now hit the same wall: the Supabase
   CLI version pin (issue #416/#480, a verified-ready fix sitting
   idle since 2026-06-14) and — new this tick — the e2e-full
   timeout tuning below. The cloud loop's `ACTIONS_PAT` lacks the
   `workflows` OAuth scope, so any edit to `.github/workflows/*`
   gets push-rejected. Both fixes are cheap and ready; both need
   a local/`/oversight` session (or a token scope grant) to land.
2. **Two `triage:needs-user` issues (#398, #399) are 26 days
   stale.** Both are one-off cloud-tick crash reports from
   2026-06-11; the loop has run cleanly hundreds of times since.
   Worth a quick `/oversight` pass to close them out or confirm
   they're still relevant.
3. **Phase-candidate backlog (10 pending) hasn't been touched in
   26 days.** Not urgent, but it's the largest it's been all
   cycle — a build-plan-exhaustion check is due.

## Today's intent

**Saga:** `/expand` should refill the new-show queue (wave 8) —
it's empty. Once refilled, `/ship-content` drains it same-day per
the wave-6/wave-7 pattern; meanwhile the 36-season wave-7 Rule 2
backlog (Southern Charm 10, RHOP 9, Circle 6, RHOM 6, TH2H 5) is
the natural next few ticks' content-gap work even without a fresh
expand pass.

**Top non-content finding:** the e2e-full timeout (below) — not
ship-ready from cloud, but the highest-leverage thing an
`/oversight` session could unblock this week alongside the
Supabase CLI pin, since both are one PR away and both are stuck
on the same permission wall.

## Tuning proposals

1. **e2e-full step timeout is now undersized for the catalog's
   growth.** The 2026-07-06 23:27 nightly run (run 28830277979)
   was NOT a test regression — all 6,409 checks that ran passed;
   it hit the workflow's hard `timeout-minutes: 50` cap on the
   "Exhaustive e2e crawl" step with only 164 of 6,573 tests left
   (97.5% complete). The crawl runs Playwright with **1 worker**
   (`Running 6573 tests using 1 worker`, ~460ms/test average), so
   its wall-clock time scales linearly with total page count —
   and total page count scales directly with the content saga's
   own mandate (53 shows, 700 seasons and climbing per Rule 1/2).
   This is the second time this exact class of failure has hit
   (2026-06-14 original, now 2026-07-06 recurrence with a
   different proximate cause — that one was a Supabase API
   flake, this one is a genuine duration ceiling), and the
   underlying content growth that causes it is not going to
   reverse. Filing as a `PHASE_CANDIDATES.md` candidate rather
   than editing the workflow directly (meta-loop rail): raise
   `timeout-minutes` on the "Exhaustive e2e crawl" step from 50
   to ~75 (job-level `timeout-minutes: 90` has headroom — build +
   setup steps observed to consume roughly 20 minutes before the
   crawl starts) as the cheap near-term fix, with a follow-up
   scope note that a **sharded/parallel-worker crawl** is the
   real structural fix once even 75 minutes stops being enough.
   Same `workflows`-scope cloud blocker as the Supabase CLI pin
   applies — this can only ship via local/`/oversight`, so bundle
   it with that fix in the same session.
2. No other tuning signal this window — bias mechanism is
   currently inactive (cleared 2026-06-14) and no gate looked
   mistuned in the pulse besides the above.

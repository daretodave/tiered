# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The dispatcher went dark for ~10 days and nobody noticed until this morning.** `march` last completed a tick at 2026-06-23 16:56:56 UTC — then zero runs, zero commits, zero loop activity of any kind until a manual local commit (`e146071`, 2026-07-03 08:01 ET) re-lit it. That single commit also added the fix: `night.yml` (this briefing) and `heartbeat.yml`, a model-free watchdog that opens an issue if `march` goes 14h without a completed tick. Deploy is green at HEAD and the breadth suite (`e2e-full`) has a clean 3-run streak (06-30, 07-01, 07-02), so nothing broke *because* of the gap — the product just stood still for a week and a half.

## While you were out

| When | Verb | Outcome |
|---|---|---|
| 2026-06-23 12:04–16:56 UTC | march (7 ticks) | 6 success, content saga: Masked Singer + Naked and Afraid + ANTM drains, ANTM new show, Apprentice (US) new show, critique pass 66 |
| 2026-06-23 13:36, 14:37 UTC | march | 2 failures (same window, resolved by later ticks same day) |
| 2026-06-23 17:00 — 2026-07-03 07:59 | *(nothing — dispatcher silent, ~9d 15h)* | — |
| 2026-07-03 08:01 ET | manual commit `e146071` | readopt: night shift + heartbeat + sonnet-5 march bump |

No `march` runs at all in the trailing 26h window this digest normally reports on — the loop only came back a few hours before this tick.

## The saga

Catalog stands at **40 shows**. Last content shipped 2026-06-23: The Apprentice (US) scaffolded (40th show) and America's Next Top Model drained C16–C24 (fully drained). Zero seasons or shows shipped in the last 10 days — purely a function of the outage, not a starved queue.

**Queue depth right now** (`plan/AUDIT.md`, wave-6 new-show queue, filed via expand pass 39):
- [ ] Queer Eye (MED, score 3.5)
- [ ] Selling Sunset (MED, score 3.5)
- [ ] Jersey Shore (LOW, score 3.0)

No season-drain rows are currently open — wave-6 drains get filed once these three shows are scaffolded. Velocity note: at the ~5-7 content commits/day pace seen through 06-23, this queue clears in well under a day once `march` resumes normal cadence. The queue is fed; the dispatcher just wasn't running.

## Queues now

- **`plan/AUDIT.md`**: 4 pending rows — 3 content-gaps (above) + 1 LOW engineering row (`check-test-colocation` fails wholesale on Windows/node 22.22.3, filed today during the readopt; green on ubuntu CI so it's not gating anything).
- **`plan/CRITIQUE.md`**: 58 pending rows spanning passes 60–66, all MED/LOW. Recent clusters: missing `tier_s_blurb` fields (Masked Singer + 8 others), repeated boilerplate closer phrasing across 7-8 canon files ("I'm trying to be honest"), a couple of fabricated-looking `Jan 1` premiere dates on Naked and Afraid S18/S19. No HIGH rows. Last pass (66) is 10 days old — due for a fresh `/critique` pass now that the loop is back.
- **`plan/PHASE_CANDIDATES.md`**: all 46 build-plan phases shipped; candidates file has historical entries only, nothing awaiting promotion right now.
- **Deploy**: ready at HEAD (`e146071`).
- **Breadth (`e2e-full`)**: green, 3-run streak (06-30, 07-01, 07-02 UTC).

## Needs you

- **Three stale GitHub issues predate the outage and were never closed out**, worth a look now that the loop is live again:
  - #398 "Cloud march tick crashed" (`triage:needs-user`, opened 2026-06-11 — 22 days old)
  - #399 "13 authed e2e specs red on main" (`triage:needs-user`, opened 2026-06-11 — 22 days old)
  - #416 "Nightly e2e-full failed" (`triage:loop-queued`, opened 2026-06-14 — 19 days old; e2e-full has been green for at least 3 consecutive nights, so this one may just need closing)
- Two `loop:phase` mirror issues (#400 Phase 44, #405 Phase 46) are still open on GitHub even though both phases show `[x]` shipped in `plan/steps/01_build_plan.md` — looks like the close-on-ship step didn't fire for these two.
- The 10-day dispatcher gap itself needs no action (heartbeat now covers it) but is worth confirming: watch for a heartbeat-filed issue if `march` ever again goes >14h quiet.

## Today's intent

Saga: `/ship-content` the three queued wave-6 shows (Queer Eye → Selling Sunset → Jersey Shore, in score order), then let `/expand` file their season-drain rows. Non-content: run a fresh `/critique` pass (58-row backlog, last pass 10 days stale) and clear the three stale needs-user/loop-queued issues via `/triage`.

## Tuning proposals

None. The one candidate this pulse would suggest — harden the march schedule against silent multi-day gaps — was already shipped this morning (`heartbeat.yml`, 14h threshold) via the local readopt commit, not through this digest. Watching whether 14h is the right threshold is worth a look after the watchdog has fired for real at least once; no change proposed pre-emptively.

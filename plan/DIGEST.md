# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean 24 hours — 21 for 21.** Every `march` tick since yesterday's digest (`1559b83`, 2026-07-04 11:06 UTC) came back green; yesterday's single transient Supabase-CLI rate-limit failure did not recur. 38 commits shipped: two real content-gap season drains (Selling Sunset S2–S6, The Apprentice S6–S10), three critique passes (70/71/72 — 0, 4, 5 findings, most fixed same-tick), one expand pass (42, 0 new candidates — the second pass in a row to file nothing while the new-show queue sits empty), and a run of small correctness fixes (a11y on the comment composer, a `{yearsWord}` capitalization bug, a repeated-phrase content fix, a stat-label singular/plural fix, a canon-tier voice-mixing fix). Deploy is green at HEAD (`c394bd3`); breadth (`e2e-full`) is green two nights running.

## While you were out

| When | Verb | Outcome |
|---|---|---|
| 2026-07-04 11:59 – 13:34 UTC | march (3 ticks) | Windows colocation-test fix, `/shows` hero stat relabel, Jersey Shore missing `episodes_caption` |
| 2026-07-04 14:40 – 16:33 UTC | march (3 ticks) | ANTM cycles-vs-seasons terminology fix, critique pass 70 (0 findings), season page Section 03 stub fix |
| 2026-07-04 17:44 – 19:38 UTC | march (3 ticks) | **The Apprentice S6–S10 drained** (Rule 2), voice-hedge-phrase batch fix across 3 canons, **Selling Sunset S2–S6 drained** (Rule 2) |
| 2026-07-04 20:35 – 22:18 UTC | march (3 ticks) | `{yearsWord}` sentence-start capitalization fix, expand pass 42 (0 new candidates), critique pass 71 (4 findings) |
| 2026-07-04 23:28 – 2026-07-05 00:35 UTC | march (2 ticks) | comment composer accessible-name a11y fix, Love Island UK canon-rationale de-duplication |
| 2026-07-05 01:55 – 04:29 UTC | march (2 ticks) | repeated candor-hedge phrase fix, canon-tier headline voice-mixing fix |
| 2026-07-05 06:30 – 10:53 UTC | march (3 ticks) | best-villain-editing repeated closer fix, singular season-stat label fix, Bachelor Joey Graziadei triple-duplication fix, critique pass 72 (5 findings), Bachelor `format_summary` batch fix (6 of 11 files) |

No new-show scaffolds shipped this window — the new-show queue has sat at zero Pending rows since before yesterday's digest, and expand pass 42 is the second consecutive pass to file nothing against it (see "The saga").

## The saga

Catalog stands at **43 shows / 680 seasons / 43 canons / 12 themes**, up from 670 seasons yesterday — the two Rule 2 drains (Apprentice +5, Selling Sunset +5) account for the growth exactly.

**Season-drain queue (Rule 2), current known gaps** (frontmatter `seasons:` vs. files on disk):
- The Apprentice: 10/15 → S11–S15 still to drain (5 remaining)
- Selling Sunset: 6/9 → S7–S9 still to drain (3 remaining)
- Queer Eye: 1/8 → S2–S8 still to drain (7 remaining, untouched this window)
- Jersey Shore: 1/6 → S2–S6 still to drain (5 remaining, untouched — flagged with a Miami/Italy renumbering risk that may need a scout pass before authoring)

None of these four have a fresh Pending row filed in `plan/AUDIT.md` right now — the prior rows were resolved with "remaining seasons queued for a later tick" language but no follow-up row exists yet. Whichever `/iterate` tick re-diffs frontmatter against season files will refile them.

**New-show queue (Rule 1 "keep the queue fed"): still zero Pending rows**, and now confirmed as a two-pass pattern — expand pass 41 (2026-07-04) filed 0 new candidates, and pass 42 (2026-07-04, same day) also filed 0. Bearings Rule 1 says the queue should never run dry and a new wave should be proposed once Pending show rows drop to ≤2; it's been at 0 for over a day across two expand passes without a refill. This is the standout non-content finding this window — see "Tuning proposals."

## Queues now

- **`plan/AUDIT.md`**: 2 pending rows — `[LOW]` Bachelor `format_summary`/`cast_size_caption` headcount-duplication, 5 files remaining (S23–S27) after this window's 6-file batch fix; `[LOW]` pin the Supabase CLI version in `.github/workflows/e2e-full.yml` (issue #416, filed 2026-06-14, still unshipped — see "Needs you"). Plus 2 `[needs-user-call]` rows unchanged from yesterday: Naked and Afraid S12/13/15/16 premiere-date numbering (needs an editorial call on season-numbering convention before any date fix) and The Apprentice S5 LA-framing question.
- **`plan/CRITIQUE.md`**: last pass **72** (2026-07-05, commit `29b0ccb`… `e3dbdaa`, 5 findings — 0 high, 5 medium, 0 low). 31 pending rows now, down from 43 yesterday — passes 70/71/72 and the same-tick fixes that followed drained a dozen.
- **`plan/PHASE_CANDIDATES.md`**: 14 candidates awaiting promotion, unchanged — expand pass 42 filed 0 new (same as pass 41). Nothing promoted this window; `/oversight` is the only path.
- **Deploy**: ready at HEAD (`c394bd3`).
- **Breadth (`e2e-full`)**: green, 2-run streak (2026-07-03, 2026-07-04 both success).
- **Night workflow**: last completed run 2026-07-04 succeeded; this tick in progress.

## Needs you

- **Five stale GitHub issues, all still open, all older than three weeks:**
  - #398 "Cloud march tick crashed" (`triage:needs-user`, opened 2026-06-11, now 24 days)
  - #399 "13 authed e2e specs red on main" (`triage:needs-user`, opened 2026-06-11, now 24 days)
  - #416 "Nightly e2e-full failed" (`triage:loop-queued`, opened 2026-06-14, now 21 days) — same root cause as the Supabase CLI rate-limit flake seen twice now (2026-06-14 original + 2026-07-04 05:23 recurrence); the corresponding `plan/AUDIT.md` LOW row (pin the CLI version) is still unshipped despite scoring 4.8
  - #400 "Phase 44 — Brand-spelling discipline" and #405 "Phase 46 — Colocated-test coverage gate" (`loop:phase` mirrors) — both phases shipped weeks ago but the close-on-ship step never fired; unchanged for the second digest running
- Nothing new blocked this window; deploy and breadth are both clean.

## Today's intent

Saga: refile the four known season-drain gaps (Apprentice S11–15, Selling Sunset S7–9, Queer Eye S2–8, Jersey Shore S2–6) as fresh `plan/AUDIT.md` rows so `/iterate` picks them up, and finish the Bachelor `format_summary` batch (5 files left, S23–S27). Non-content: the Supabase-CLI-pin fix (issue #416) is now the single highest-value unshipped row on the board — it directly prevents the exact flake class that has now hit twice; worth promoting ahead of its LOW severity. Clear the five aging stale/mirror issues via `/triage` or `/oversight`.

## Tuning proposals

**New-show queue refill appears mistuned, not just quiet.** Filed as a `plan/PHASE_CANDIDATES.md` candidate this tick, not applied directly (meta-loop rail). Bearings Rule 1 states the new-show Pending-row queue "must never run dry" and that `/expand` should propose a fresh wave once it drops to ≤2 rows. The queue has been at exactly 0 rows since at least 2026-07-04, and two consecutive expand passes (41, 42) have each filed 0 new candidates during that window without proposing a new show wave. Either the ≤2 trigger isn't being evaluated against the AUDIT.md show-queue specifically (it may be scoped to phase-candidate signal only), or the show-queue nudge needs to be made explicit in `/expand`'s own checklist rather than inferred from general signal review. Citing: `plan/bearings.md` lines 543–551 (Rule 1 "keep the queue fed"), `plan/PHASE_CANDIDATES.md` pass 41/42 metadata (both "0 new candidates filed" with no mention of the show queue in the reviewed-signals list).

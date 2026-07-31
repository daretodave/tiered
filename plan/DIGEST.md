# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-31

## Headline

**The-voice content lockout got breached from inside the loop today —
a Rule 3 tick cited the exact fabricated claim its own AUDIT row
blocks.** Commit `9ec927d9` (`the-panel-turned-over-more-than-the-
contestants-did` extend) added a "The Voice S23 'The Farewell'" entry
describing "Blake Shelton's twelfth and final season, the last
founding coach's departure" — restating the corrupted `23-the-
farewell.md` file's conflated claim the HIGH row (filed 07-26) exists
specifically to stop from spreading. Caught same-day by a later tick's
self-observation and logged as an addendum rather than reverted (a
mid-ledger revert risks its own renumbering error without the
dedicated fix pass). Elsewhere: the night-shift starvation bug
(candidate #35) recurred a second time since diagnosis — 07-30's
scheduled run was cancelled the same way 07-28's was, tonight got
through on the same luck as before — and e2e-full's duration-ceiling
breach hit its **10th** consecutive red night. Both standing HIGH rows
remain open, unstarted, and now joined by direct evidence that the
content saga's own guardrail can be bypassed by the very process it's
meant to constrain.

## While you were out

Pulse window: last 48h (2026-07-29T11:30Z → 2026-07-31T11:17Z) — wider
than the usual 26h because last night's scheduled digest (07-30,
30537780428) was itself a starvation casualty; this is the first
briefing since 07-29's.

| Tick | Verb | Outcome |
|---|---|---|
| 84 commits | content (43) / audit progress-notes (39) / digest (1) / no-op | 100% Rule 3 (themed-list) drain again — extend-first across dozens of lists, 2 zero-ship passes (fiftieth, fifty-sixth — no concept cleared the excellence gate), 1 Rule 3 review (`survivor-pillars`, no change). Zero commits from `/iterate`, `/triage`, `/ship-a-phase`, `/ship-data`, or `/expand` this window — Rule 2 (season-fill) stays fully stalled, re-verified same-day (commit `3cec0ab8`). One extend tick (`the-panel-turned-over-more-than-the-contestants-did`) breached the-voice's content lockout — see Headline. |
| march runs (46 in window) | dispatcher ticks | 44 success, 1 cancelled (07-30T17:10Z — a starvation casualty of its own, unrelated to night.yml), 1 failure (07-29T19:05Z, run 30482841470 — matches the self-healing issue #565 crash pattern, third recurrence, no new issue filed). |
| e2e-full (nightly breadth) | duration-ceiling breach | **Red for the 10th straight night** — latest run 30590354920 (2026-07-30T23:23:28Z), same 75-minute wall; every completed check passed. Not a regression — candidate #34's scaling problem, unpromoted 10 days. |
| night (this tick + last) | digest | **07-30's scheduled run (30537780428) was cancelled** — starvation recurrence #2 since the 07-27 diagnosis. Tonight's (07-31, run 30626522806) got through. |
| deploy:check | HEAD `c9a6be5` | `ready` on Vercel. No red deploy. |

## The saga

**Rule 2 (season-fill drain) stays fully stalled**, re-verified again
today (commit `3cec0ab8`, 07-31 07:19). `plan/CADENCE.md`'s gap table
holds at **35 shows / 36 gap-slots**, every slot starred
(confirmed-but-unaired) — unchanged since the 07-26 third full sweep.
Next sweep due 2026-08-02.

**Rule 3 (themed lists) remains the sole content driver.** Catalog now
carries **174 live themed lists** and **68 shows / 1,043 season
files** — unchanged catalog size from the last digest (no Rule 2
drain, and Rule 3 only extends existing lists rather than adding
shows/seasons). Extend-first pattern held for essentially the entire
window; two zero-ship passes (fiftieth, fifty-sixth) confirm the well
is getting harder to mine at this ledger size, consistent with the
last several digests' trend line.

**Both standing content-integrity risks remain open — and one got
worse today.** `the-voice`'s 8-season factual corruption (wrong
dates, conflated casts, a fabricated "series finale," a currently-live
false "show has ended" claim) is still HIGH, still filed 2026-07-26,
still zero remediation progress — and today a Rule 3 extend tick
restated the exact fabricated S23 "final season" claim the row exists
to contain (see Headline; logged as an AUDIT addendum, not reverted).
`/expand` scoped this as candidate #36 (score 6.0, filed 07-28,
19-item fix touching file renumbering + canon rebase + cross-catalog
reference cleanup) — still unpromoted. e2e-full's duration-ceiling
breach is now its **10th** consecutive red night (07-21 through
07-30) with candidate #34 (shard the crawl) unpromoted 10 days after
filing.

## Queues now

- `plan/AUDIT.md` Pending: 2 HIGH (`the-voice` corruption, now with a
  same-day breach logged; night-shift starvation, recurred a second
  time), 2 MED (season-fill drain standing row, stalled per above;
  e2e-full breach, now 10th recurrence), 4 LOW single-tick fixes
  unchanged from last digest.
- `plan/PHASE_CANDIDATES.md`: 36 total candidates filed, 18 pending
  promotion by direct count of this tick (no new `/expand` pass since
  07-28's #59 — zero `/expand` commits this window). Top three by
  score: #15 (9.4, show-canon completeness gate), #28 (8.7, stat-tile
  duplicate-value invariant), #25 (8.3, canon-rationale echo gate) —
  none promoted in 46+ days.
- `plan/CRITIQUE.md`: pass 104, 2026-07-25 — 6 days stale now.
- GitHub issues: `triage:needs-user` — 4 (#398, #399 both 50+ days
  stale; #565 self-healing crash tracker, recurred again this window;
  #586 night-crash tracker, superseded by the fuller starvation
  root-cause row). `triage:loop-queued` — 1 (#636, the e2e-full
  mirror). 0 unlabeled, 11 open total.

## Needs you

1. **The-voice content lockout was breached from inside the loop
   (new signal, 2026-07-31).** A Rule 3 extend tick cited the exact
   fabricated claim the HIGH row exists to block. The blocking
   instruction relies on every future tick individually remembering
   to avoid `the-voice` ≥S22 — today's near-miss shows that's not
   holding reliably. Candidate #36 (the dedicated remediation, score
   6.0) is the real fix; until it's promoted, consider whether the
   lockout needs a harder mechanical gate (e.g. a `content-check`
   rule that flags any new themed-list entry citing `the-voice`
   seasons ≥22) rather than relying on tick-by-tick discipline.
2. **Night-shift starvation recurred a second time (HIGH, candidate
   #35, unpromoted 4 days).** 07-30's run joined 07-28's as a
   starvation casualty; tonight's success is still luck, not a fix.
   Likely blocked from cloud (same `workflows` OAuth-scope gap as
   candidates #26/#34) — needs local/`/oversight`.
3. **e2e-full duration ceiling, 10th straight red night.** Candidate
   #34 (shard the crawl) has sat unpromoted 10 days. Every completed
   check still passes — pure scaling debt, not a quality regression,
   but effective coverage keeps eroding.
4. **`the-voice` content corruption (HIGH, filed 07-26, zero
   remediation progress 5 days on, now actively spreading).**
   Candidate #36 scopes the fix; too large and fabrication-risky for
   a same-tick autonomous patch.
5. **`triage:needs-user` issues #398/#399** — 50+ days stale, no
   apparent movement since filing 2026-06-11.
6. **Phase-candidate backlog unpromoted 46+ days** — #15 (9.4) is
   the standout; #28 and #25 close behind.

## Today's intent

**Saga:** Rule 2 stays stalled until the next sweep (2026-08-02) or a
starred row's air date passes. Expect Rule 3 to keep absorbing every
content tick; the zero-ship rate (2 of this window's 43 content
commits) suggests the 174-list well is getting harder to mine —
watch whether `/expand` widens Rule 3's search space, and separately,
watch whether any future Rule 3 tick touches `the-voice` again before
candidate #36 lands.

**Top non-content finding:** today's the-voice lockout breach — a
guardrail relying on per-tick memory got bypassed on exactly the
schedule you'd expect one to. This is the clearest case yet for either
promoting candidate #36 outright or adding a mechanical gate that
doesn't depend on every future tick remembering the exclusion.

**Second-priority finding:** the night-shift starvation bug's second
recurrence (07-30) confirms candidate #35 is not a one-off — it's a
genuine intermittent failure mode that needs the workflow-file fix,
not another lucky queue window.

## Tuning proposals

None new this tick. Both open workflow-file proposals (candidate #34,
shard e2e-full — now 10 days unpromoted with 3 more red nights of
evidence since last cited; candidate #35, decouple night.yml's
concurrency group — now 4 days unpromoted with a second recurrence)
remain the standing recommendations, both overdue for promotion. A
third item worth flagging for `/oversight` alongside them: whether
the-voice's content lockout (currently informal, tick-by-tick
discipline only) should get a mechanical `content-check` gate rather
than staying candidate #36's responsibility alone — not drafted as a
formal candidate yet since it would piggyback on #36's own scope
decision, but the breach today is the first concrete evidence the
informal version isn't sufficient.

# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-28

## Headline

**A quiet, single-mission 26 hours: `march` ran 6 ticks in this window, all six routing to the content-gap dispatch — five continued the mechanical `shape_h2` drain (pass-131: rhop, summer-house, queer-eye, love-is-blind, bake-off — the latter three each fully clearing their show) and one shipped a genuine season-fill (married-at-first-sight Season 20, off the finale-shift path rather than the starred CADENCE queue).** Zero `/iterate`, `/critique`, or `/expand` ticks fired — the `plan/CRITIQUE.md` gate loaded at pass 147 (26+ hours ago: 2 HIGH findings, the meta-description-echo recurrence and the vote-pair pre-vote quadruple-stack) is still un-cleared, exactly the pattern issue #758 and candidate #33 already track. Deploy is green at HEAD (`eee4a2fb`). `e2e-full` breached its 75-minute duration ceiling again last night (08-28, run 33133693773) — the 38th day of an unresolved, cloud-blocked timeout (candidate #34), same wall, zero actual test-quality regression. Catalog held flat at 68 shows / 1048 seasons / 68 canons / 181 themes; the `shape_h2` mechanical backfill (content:check basis) fell from 829 to 799 remaining warnings across the window's five drain ticks.

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 14:15 (08-27) | content-gap redirect | shipped — bachelor-in-paradise `shape_h2` drain (pass-131) |
| 14:26 | digest | 2026-08-27 briefing written |
| 18:11 | content-gap redirect | shipped — rhop `shape_h2` drain (pass-131) |
| 21:39 | content-gap redirect | shipped — summer-house `shape_h2` drain (pass-131) |
| 00:53 (08-28) | content-gap redirect | shipped — queer-eye `shape_h2` drain (pass-131), show fully cleared |
| 04:17 | season-fill | shipped — married-at-first-sight Season 20 (finale-shift path, canon rebased) |
| 06:57 | content-gap redirect | shipped — love-is-blind `shape_h2` drain (pass-131), show fully cleared |
| 10:45 | content-gap redirect | shipped — bake-off `shape_h2` drain (pass-131), show fully cleared |

No crashes and no true no-ops this window — all 6 `march` ticks in the 26h lookback landed a content-gap ship. `gh run list --workflow march` shows every run in this window green.

## The saga

**Rule 2 (season-fill):** CADENCE gap table unchanged at 44 shows / 44 gap-slots, every slot starred confirmed-but-unaired (next weekly sweep due 2026-08-30) — structurally stalled, as it has been since the 2026-08-23 sweep. The one season that did land this window (married-at-first-sight S20) came via the separate finale-shift path (a season that just aired, outside the starred-gap mechanism), not a CADENCE drain.

**Rule 3 (themed lists):** silent this window — 0 lists shipped, 181 held flat. No signal this is starved on its own merits; the content-gap dispatch simply never reached Rule 3 because the `shape_h2` mechanical sub-drain (also `category: content-gaps`) kept winning Step 3b.5 all six ticks.

**The `shape_h2` mechanical drain (pass-131, sub-row on the standing AUDIT season-fill row):** three shows fully cleared this window — queer-eye (10/10), love-is-blind (10/10), bake-off (11/11) — plus continuing partial progress on rhop and summer-house (both carried in from the prior window, now further drained or cleared per the AUDIT trail). Corpus-wide remaining count (content:check warning basis): 829 → 799, a drop of 30 across the window's 5 continuing-drain ticks — smallest-remaining-scope-first, each show's fragments grounded in its own episode-count/scheduling facts rather than templated filler. At this window's pace full drain (799 remaining) is still many weeks out; the field ships LAX today, so there's no gate pressure to accelerate, just a long queue.

## Queues now

- `plan/AUDIT.md` Pending: the standing season-fill/`shape_h2` combined row (`category: content-gaps`, updated every drain tick), plus 5 non-content rows — 2 HIGH (the-voice S22-29 corruption, `triage:needs-user`, blocked pending human `/oversight`; night.yml starvation race — no new occurrence this window, tonight's own tick started clean), 1 MED (e2e-full duration-ceiling, updated tonight, 38 days unpromoted), 2 LOW (themed-list description SERP-budget overrun; `YEAR_TENURE_RE` teen-number gap).
- `plan/CRITIQUE.md` Pending: unchanged since pass 147 (2026-08-27, same day) — 2 HIGH, 14 MED, 15 LOW. The gate loaded 26+ hours ago and no `/iterate` tick has run to clear either HIGH.
- `plan/PHASE_CANDIDATES.md`: last pass 66 (2026-08-23, commit 5abd7a16), unchanged this window — no `/expand` tick fired. Candidate #33 (content-gaps gate needs a bug-priority carve-out) sits 36+ days unpromoted; candidates #34 (shard e2e-full) and #35 (decouple night.yml concurrency) sit at 38 and 37+ days unpromoted respectively — all three still the standing `/oversight` recommendations.
- Open `triage:needs-user`: 5 issues (#777, #763, #762, #758, #565), all previously surfaced, none new this window.
- Open `triage:loop-queued`: 4 issues (#787, #785, #754, #636) — #636 (the e2e-full tracker) freshly commented tonight, its 34th recurrence comment.

## Needs you

- **The `/iterate`/`critique` gate has been loaded for 26+ hours with no clearing tick.** Root cause is the known dispatch-ordering issue (issue #758, candidate #33): `march` Step 3b.5 routes every content-eligible tick to `/ship-content` before `/iterate` ever gets a turn, and this window's 6-for-6 dispatch record is fresh, unremarkable confirmation of that pattern — not new information, but it means the two pass-147 HIGH findings (meta-description echo, vote-pair pre-vote stack) will keep sitting un-fixed until the content-gap queue genuinely runs dry or an `/oversight` session promotes candidate #33's carve-out.
- **`e2e-full` is now 38 days into an unresolved cloud-blocked timeout** (candidate #34, shard the crawl). Cloud's `ACTIONS_PAT` cannot push `.github/workflows/e2e-full.yml` edits (missing `workflows` OAuth scope). Purely a day-count update — no new evidence changes the recommendation.
- **the-voice S22-29 factual corruption** (issue #762, `triage:needs-user`) remains an 8-file renumbering cascade that needs a human-reviewed `/oversight` session given the fabrication/blast-radius risk — still untouched this window.

## Today's intent

The saga's next drain targets: `shape_h2` pass-131 continues smallest-remaining-scope-first toward the 799-warning corpus target; Rule 2 stays dormant until the 2026-08-30 CADENCE sweep might unstar a slot. Top non-content finding: the CRITIQUE gate's two HIGH findings (meta-description echo, vote-pair pre-vote stack) are the highest-value thing an `/iterate` tick could clear the moment the dispatch chain lets one through.

## Tuning proposals

None filed fresh this window. The three standing candidates (#33 dispatch carve-out, #34 e2e-full sharding, #35 night.yml concurrency decoupling) already cover every gate-tuning signal visible in this window's pulse — reinforcing them with unchanged evidence would add noise, not information. All three remain `/oversight`-only promotions.

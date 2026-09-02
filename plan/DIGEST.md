# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-09-02

## Headline

**A clean 26-hour window: one content-gap defect class closed catalog-wide, a second cut nearly in half, and both of the loop's two chronic red flags (the e2e-full duration ceiling, the night-shift starvation race) came back green two nights running.** The season-eyebrow calendar-drift drain (issue #317, critique pass-33) finished its last three shows — americas-got-talent (10 seasons), bachelorette (11), survivor (18), 39 seasons across 3 shows — and `pnpm content:check` now confirms **zero** remaining instances catalog-wide, closing the track end-to-end. The `filming_caption` bare-restatement drain (started 09-01) ran five more rounds (2 through 6), fully clearing hells-kitchen, below-deck, love-island-us, top-chef, rhoa, alone, rhonj, the-real-world, rhony, and bake-off; the ad-hoc estimate is down from ~94 at round 1 to **~58 remaining**, still no dedicated `content-check.ts` collector for this class. Catalog held flat at 68 shows / 1048 seasons / 68 canons / 181 themes; content-check's *mechanized* warning count sits at 130 (down from 169 at the last digest). `e2e-full` broke a two-night red streak (08-30, 08-31) with a green run on 09-01; the night shift itself ran clean both 09-01 and tonight, breaking the three-night starvation streak the last briefing flagged. Deploy is green at HEAD (`d8d9310c`). Two long-standing findings still need eyes: the-voice's 8-file factual corruption (issue #762) and the night.yml concurrency race (candidate #35, issue #763) — both cloud-blocked, both now 43 days unpromoted.

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 14:09 (09-01) | content-gap | shipped — season-eyebrow calendar-drift drain, americas-got-talent (10 seasons) |
| 17:58 | content-gap | shipped — season-eyebrow calendar-drift drain, bachelorette (11 seasons) |
| 20:50 | content-gap | shipped — season-eyebrow calendar-drift drain, survivor (18 seasons) — **track closed catalog-wide**, zero instances remain |
| 23:35 | content-gap | shipped — `filming_caption` bare-restatement drain round 2 — hells-kitchen (6/6) |
| 01:42 (09-02) | content-gap | shipped — `filming_caption` drain round 3 — below-deck, love-island-us, top-chef, rhoa, alone |
| 06:25 | content-gap | shipped — `filming_caption` drain round 4 — rhonj + the-real-world (6 instances, 2 shows fully cleared) |
| 10:38 | content-gap | shipped — `filming_caption` drain round 5 — rhony fully cleared (10 seasons) |
| 15:05 | content-gap | shipped — `filming_caption` drain round 6 — bake-off fully cleared (7) + a rhony round-5 correction (2 missed instances) |

One `march` tick (08-31T19:44) failed on the stale "Prompt is too long" signature already tracked by issue #565 — commented on the existing issue rather than filing a duplicate, self-recovered on the next scheduled trigger, no lost work. Every other tick in the window landed a ship; no true no-ops.

## The saga

**Rule 2 (season-fill):** still fully stalled — the `plan/CADENCE.md` gap table held at 42 gap-slots / 42 shows on its last sweep (2026-08-30), every slot starred confirmed-but-unaired. The standing AUDIT row (line 31, score 4.5) continues to ride its two fallback side-drains.

**Fallback drain #1 — season-eyebrow calendar drift (issue #317, critique pass-33): CLOSED.** The three shows left at the last briefing (americas-got-talent, bachelorette, survivor — 39 seasons) all drained this window. `pnpm content:check` confirms zero remaining catalog-wide. This closes the second defect class end-to-end in two consecutive windows (after `watch_list` cross-callout repetition closed the window before).

**Fallback drain #2 — `filming_caption` bare-restatement: ~58/~94 remaining.** Started 09-01 (round 1, 7 instances, no dedicated linter). Rounds 2–6 this window cleared hells-kitchen (6), below-deck/love-island-us/top-chef/rhoa/alone (round 3, count folded into the running estimate), rhonj + the-real-world (6, 2 shows fully cleared), rhony (10, full clear), and bake-off (7, full clear) plus a 2-instance correction to round 5's rhony claim. Remaining, per the tick's own running estimate: the-challenge, sytycd, the-real-world (partial), and others — dispatcher's call next content-gap tick.

**Rule 3 (themed lists):** silent again this window, 181 held flat — same saturation `plan/LISTS.md` and issue #758 already document; the content-gap side-drains keep winning Step 3b.5.

## Queues now

- `plan/AUDIT.md` Pending: 6 open rows — 1 standing content-gaps drain (line 31, the two side-drains above), 2 LOW (SERP-truncation, `YEAR_TENURE_RE` teen-number gap), 1 MED (e2e-full duration ceiling, updated tonight), 2 HIGH (the-voice 8-file corruption; night.yml starvation race, updated tonight).
- `plan/CRITIQUE.md` Pending: 38 rows (1 HIGH, 18 MED, 17 LOW+unclassified) as of pass-149 (last run 2026-08-31/09-01 window). The one open HIGH is systemic: the "WHY THIS SLOT" canon callout re-paraphrasing body copy, now confirmed on 4 shows (top-chef, bake-off, hells-kitchen, project-runway) — ripe for the corpus-wide check pass-148 already flagged.
- `plan/PHASE_CANDIDATES.md`: pass 67 (2026-08-30), 28 candidates awaiting promotion, latest numbered #37. Candidates #34 (shard the e2e-full crawl) and #35 (decouple night.yml's concurrency group) remain the two standing `/oversight` recommendations, both now 43 days unpromoted.
- Open `triage:needs-user`: #762 (the-voice corruption, HIGH), #763 (night.yml race, tied to candidate #35), #758 (content-gap dispatch starving `/iterate` — filed 08-08, likely stale given both side-drains and CRITIQUE passes are shipping regularly now; worth a `/triage` pass to confirm and close). #777, #586, #565, #399, #398 are older, largely self-resolved incident issues.
- Open `triage:loop-queued`: #787, #785 (both stale cloud-march-failure issues from 08-22/08-23), #754 (themed-list Rule-3 pass 22, likely superseded by the saturation finding above), #636 (the e2e-full duration-ceiling origin issue, still active — same track as the AUDIT MED row).

## Needs you

- **The-voice factual corruption (issue #762, AUDIT line 661, HIGH):** 8 season files + show frontmatter need a dedicated verify-and-rewrite pass with a canon rebase — blast radius too large for autonomous dispatch, needs a human-reviewed tick.
- **night.yml concurrency race (issue #763, candidate #35):** workflow-file edit, blocked from cloud (`ACTIONS_PAT` lacks the `workflows` OAuth scope). Two clean nights in a row now, but the race itself is unfixed — still needs a local `/oversight` session to apply.
- **e2e-full duration ceiling (candidate #34):** same cloud-permission block as above. Green last night, but the underlying 75-minute wall vs. a growing catalog is unresolved.
- **issue #758** likely stale — worth a `/triage` look to confirm the content-gap-starves-iterate concern no longer holds and close it out.

## Today's intent

**Saga:** keep draining `filming_caption` bare-restatement — next up per the tick's own estimate: the-challenge, sytycd, the remaining the-real-world seasons, and whatever else the next round's scan turns up (~58 instances left, no collector yet to make this exact).

**Top non-content finding:** the pending CRITIQUE HIGH — systemic "WHY THIS SLOT" canon-callout restatement, now confirmed on 4 shows. Worth the corpus-wide audit pass-148 called for rather than another one-off fix.

## Tuning proposals

None new this cycle. Candidates #34 (shard the e2e-full crawl) and #35 (decouple night.yml's concurrency group) remain the standing, unpromoted recommendations — both reinforced with tonight's clean-run data in `plan/AUDIT.md` rather than re-filed. No newly mistuned gate observed: the dispatch cadence, content-gap side-drains, and critique cadence all look healthy this window.

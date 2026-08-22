# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-22

## Headline

**A steady, healthy 26 hours — 24 successful `march` ticks, 2 failures, both self-healed on retry.** The two failures carry distinct signatures worth separating: the 04:15 UTC run hit `Claude Code returned an error result: Prompt is too long` — the exact string issue #565 has carried since 2026-07-12 under a diagnosis the 08-20 digest flagged as stale (the 08-16→08-20 outage's real cause was an org-access toggle, not prompt length). It just reproduced live, on a clean day with no outage in progress — #565's original 07-12 diagnosis looks correct after all and has been silently absorbed into "Recurred" comments this whole time. The 09:10–10:46 run hit a plain wall-clock timeout after three tool calls all returned cleanly (`is_error: false`) — reads as a long tick, not a crash. Content-gap dispatch (Rule 2/3) stayed fully saturated for a second straight day: the season-fill gap table is flat at **42 shows / 43 gap-slots**, every slot starred confirmed-but-unaired (nearest real dates 2026-08-23 RHOA reunion, 2026-08-27 MAFS finale), and Rule 3's idea space returned **zero-ship twice today** (14:15, five fresh angles; 09:11, twelve concepts). The content-gap-redirect workaround (issue #758) carried the day instead — 11 lede/body/canon echo-repetition fixes shipped across 10 shows, an AGT `watch_list` backfill (S07-S11 landed, S01-S06 still open), 2 themed lists, one real bug fix (`VotePair` zero-vote copy), and one new content bug discovered and filed (AGT S8/S9 panel-transition swap). The nightly `e2e-full` breadth crawl went red both nights this window (08-20, 08-21) on the same known duration-ceiling breach — flat at 10,548 tests, zero real test regressions, candidate #34 (shard the crawl) now **32 days unpromoted**. Deploy is green at HEAD (`2388103`).

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 09:13 | content-gap redirect | shipped — top-chef carolinas filming-location repetition fix |
| 10:20 | content-gap redirect | shipped — traitors FORMAT field self-restatement fix |
| 11:20 | content-gap redirect | shipped — summer-house filming_caption fix |
| 12:03 | Rule 3 (themed list) | shipped — twice-in-one-year (Amazing Race S02/S03) |
| 12:53 | Rule 3 (themed list) | shipped — when-scripted-went-dark (Project Runway S20 / Love Island US S05) |
| 13:39 | content-gap redirect | shipped — perfect-match S4 field repetition fix |
| 13:55 | critique | pass 133 — 3 findings (0 high, 3 med, 0 low) |
| 14:15 | Rule 3 | **zero-ship** — invent-new sweep, five fresh angles, none landed |
| 15:00 | content-gap redirect | shipped — ink-master team-rule list retitle |
| 15:58 | content-gap redirect (self-found) | shipped — jersey-shore S6 / love-is-blind Columbus phrase echoes |
| 16:45 | content-gap redirect | shipped — traitors "on merit" echo fix |
| 17:31 | content-gap redirect | shipped — amazing-race S38 canon/body echo fix |
| 18:20 | bug fix (self-found) | shipped — VotePair zero-vote state copy fix |
| 19:07 | content-gap redirect | shipped — AGT S17-21 watch_list backfill |
| 19:22 | critique | pass 134 — 3 findings (0 high, 3 med, 0 low) |
| 20:05 | content-gap redirect | shipped — american-idol S24 FILMED caption fix |
| 20:52 | Rule 3 | **zero-ship** — ninth same-day saturation pass |
| 21:43 | content-gap redirect | shipped — AGT S12-16 watch_list backfill |
| 22:34 | content-gap redirect | shipped — /u/[handle] OG image threading fix |
| 23:22 | content-gap redirect | shipped — DWTS S34 canon echo + SEO clip fix |
| 00:34 | content-gap redirect | shipped — bake-off S16 cast_size_caption guard |
| 00:46 | critique | pass 135 — 5 findings (0 high, 4 med, 1 low) |
| 02:10 | triage | 1 issue processed, 1 queued |
| **04:15** | march tick | **failed** — "Prompt is too long" (issue #565 signature, self-healed next tick) |
| 04:37 | content-gap redirect | shipped — vanderpump-rules S1 canon slot_argument echo fix |
| 06:16 | content-gap redirect | shipped — queer-eye S10 FILMED caption fix |
| 07:03 | content-gap redirect | shipped — bake-off hammond-continues lede/body echo fix |
| 08:18 | content-gap redirect | shipped — AGT S07-S11 watch_list backfill |
| **09:10–10:46** | march tick | **timed out** — plain wall-clock wall after 3 clean tool calls, no error surfaced |
| 09:11 | Rule 3 | **zero-ship** — second same-day pass, 12 concepts checked |

(13 additional `march` runs this window show `cancelled` — normal concurrency-group overlap when a trigger lands mid-tick, not incidents.)

## The saga

**Rule 2 (season-fill drain):** flat at **42 shows / 43 gap-slots**, unchanged since the 08-16 sweep — every remaining slot is confirmed-but-unaired, not a search failure. Nearest real premiere/finale dates: RHOA S17 reunion 2026-08-23, MAFS S20 "Seattle" reunion/finale 2026-08-27. Standing row stays pending by design until the table reads zero.

**Rule 3 (themed lists):** zero-ship **twice** in this window (14:15 five-angle sweep, 09:11 twelve-concept sweep) — the idea space keeps coming back dry on same-day repeats. 2 lists still shipped earlier in the window (twice-in-one-year, when-scripted-went-dark) before saturation set in.

**Content-gap redirect (issue #758's workaround):** this is where the day's actual content velocity lived. 10 echo/repetition fixes across bake-off (×2), traitors (×2), summer-house, perfect-match, ink-master, jersey-shore/love-is-blind, amazing-race, american-idol, dancing-with-the-stars, vanderpump-rules, queer-eye — all sourced from CRITIQUE.md's own backlog (passes 125, 127, 130, 132, 133, 134). Plus AGT `watch_list` backfill: S17-21, then S12-16, then S07-11 landed today (11 of 21 seasons still bare: S01-S06). One net-new bug surfaced along the way: AGT S8/S9 carry the panel-transition narrative on the wrong season (filed AUDIT line 645, MED, discovered via scout cross-verification during the watch_list backfill).

## Queues now

- `plan/AUDIT.md`: 10 open non-standing rows (3 HIGH, 5 MED, 2 LOW) + the standing Rule-2 row. HIGH: the-voice factual corruption (line 636, unresolved), march's 4-day outage post-mortem (line 643), night/march concurrency starvation (line 637, last recurrence 08-16→08-19, root-caused to org-access, distinct from the concurrency race). New today: AGT S8/S9 panel-transition swap (line 645, MED).
- `plan/CRITIQUE.md`: latest pass **135** (00:46 UTC tonight), 5 findings (0 high / 4 med / 1 low) — fresh, not stale. ~15 open MED/LOW findings still in the pending queue feeding the content-gap-redirect pipeline.
- `plan/PHASE_CANDIDATES.md`: last pass 65 (2026-08-21), **31 open candidates**. Longest-unpromoted: #34 shard e2e-full crawl (32 days), #35 decouple night.yml concurrency (26 days), #36 the-voice remediation, #37 org-outage fallback (both filed within the last 2 weeks).
- Open `triage:needs-user`: 8 issues (#777, #763, #762, #758, #586, #565, #399, #398) — several stale (#398/#399 since June).
- Open `triage:loop-queued`: 3 issues (#785, #754, #636).

## Needs you

- **Issue #565 needs re-triage.** Its 2026-07-12 diagnosis ("prompt too long") was marked stale after the 08-16→08-20 outage (the outage's real cause was an org-access toggle, not prompt length). Tonight's 04:15 failure reproduced the exact "Prompt is too long" string on a day with no outage — the original diagnosis looks correct after all and has been silently absorbed into "Recurred" comments this whole time.
- **Candidate #34 (shard e2e-full crawl) — 32 days unpromoted**, still the standing `/oversight` recommendation. Two more red nights this window (08-20, 08-21), test count flat at 10,548 — no growth, no recovery, same wall every time.
- **The-voice factual corruption (AUDIT line 636, HIGH)** — still live, still reader-facing (false "show has ended" claim), candidate #36 filed but unpromoted.
- **e2e test-isolation bug (AUDIT line 644, MED, issue #785)** — blocked a content-gap ship earlier this window (run 32542338041); `vote-state-pill.spec.ts` and `user-profile.spec.ts` share a vote target and stomp each other's state.

## Today's intent

Rule 2 stays starred (next real target: RHOA S17 reunion 2026-08-23, one day out). Rule 3's idea space needs either a fresh season landing or a deliberate cool-down — two same-day zero-ship passes in one window is the clearest saturation signal yet. Expect the content-gap-redirect path (issue #758) to keep carrying the day: CRITIQUE pass 135's 4 new MED findings plus the remaining AGT watch_list gap (S01-S06) are the next-in-line targets. Top non-content finding: get eyes on issue #565's re-triage before it silently absorbs another failure under the wrong label.

## Tuning proposals

None new this tick. Existing candidates (#34 shard crawl, #35 decouple night concurrency, #36 the-voice remediation, #37 org-outage fallback) already cover every signal seen in this window — filing duplicates would just add noise. The `/oversight` backlog is the bottleneck, not a gap in candidate coverage.

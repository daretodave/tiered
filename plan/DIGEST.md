# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-25

## Headline

**A clean, high-volume 26 hours on the code side — 31 successful `march` ticks, 0 failures, 9 normal concurrency cancellations — but the night shift itself lost two nights to the same starvation race it's been fighting since July.** `plan/DIGEST.md` sat stuck on its 08-22 snapshot through 08-23 and 08-24: `gh run view` on both `night` runs shows zero jobs ever started (evicted from the queue before GitHub scheduled them), the exact concurrency-eviction signature already diagnosed and tracked as candidate #35 — now a **third confirmed occurrence**, 35 days unpromoted. Tonight's tick only got through on luck, same as every prior recovery. On the content side, Rule 2 (season-fill drain) stayed **fully stalled at 44/44 shows starred** for a 19th consecutive pass — nothing premiered, nothing to drain — and Rule 3 (themed lists) mostly saturated too (4 zero-ship passes logged, 3 extends shipped before running dry each time). The real velocity came from the content-gap-redirect workaround (issue #758): **3 critique passes** (141, 142, 143) ran and nearly every finding they raised — including a HIGH (stale OG-image 404 regression) — got shipped same-window, plus a real production bug fix (season vote block now states its 72h change-window). Catalog held flat at 68 shows / 1047 seasons / 68 canons / 181 themes all night — a maintenance-and-polish window, not a growth one. The `e2e-full` breadth crawl went red again both nights this window (08-23, 08-24) on the same known duration-ceiling breach — candidate #34 now 35 days unpromoted. Deploy is green at HEAD (`30eba7e0`).

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 09:43 (08-24) | content-gap redirect | shipped — dragrace-allstars fact-echo fix (pass-133) |
| 10:30 | content-gap redirect | shipped — community-live-strip redundant "live" label fix |
| 11:16 | content-gap redirect | shipped — pass-128 `isRscPrefetchAbort()` tooling fix |
| 11:30 | critique | pass 140 — 5 findings (0 high, 2 med, 3 low) |
| 12:26 | content-gap redirect | shipped — the-voice finale eyebrow/lede echo fix (pass-135) |
| 13:09 | content-gap redirect | shipped — top-chef era-filter label consistency fix |
| 13:52 | content-gap redirect | shipped — amazing-race S38 watch_list echo fix (pass-140) |
| 14:44 | Rule 3 | **zero-ship** — thirteenth same-day-class pass, saturation reconfirmed |
| 15:28 | content-gap redirect | shipped — top-chef Las Vegas slot_argument echo fix (pass-139) |
| 16:17 | Rule 3 | **zero-ship** — fourteenth same-day-class pass |
| 17:00 | content-gap redirect | shipped — AGT mobile "Approval" label fix (pass-138) |
| 17:15 | critique | pass 141 — 6 findings (**1 high**, 2 med, 3 low) |
| 17:56 | content-gap redirect | shipped — survivor-50 eyebrow ambiguity fix (pass-141) |
| 18:48 | content-gap redirect | shipped — survivor-50 canon placeholder forward-pointer fix (pass-139) |
| 19:47 | content-gap redirect | shipped — **opengraph-image route-group hash bug fix (pass-141 HIGH, resolved same-window)** |
| 20:30 | content-gap redirect | shipped — bake-off community-trend badge legend (pass-140) |
| 21:17 | content-gap redirect | shipped — community live-strip zero-vote clarity fix (pass-139) |
| 22:12 | Rule 3 (themed list) | shipped — ratings-record season entries extend |
| 22:58 | Rule 3 (themed list) | shipped — the-reveal-was-the-whole-show extend |
| 00:02 (08-25) | Rule 3 | **zero-ship** — fifteenth same-day-class pass |
| 00:51 | Rule 3 (themed list) | shipped — the-vote-left-the-phone-line extend |
| 02:32 | Rule 3 (themed list) | shipped — running-long-running-short extend |
| 03:20 | Rule 3 | **zero-ship** — seventeenth same-day-class pass |
| 04:07 | audit | content-gap redirect audit finds none safe (Rule 2 still stalled) |
| 05:33 | Rule 3 | **zero-ship** — eighteenth same-day-class pass |
| 06:15 | audit | Rule 2 reconfirmed fully stalled — 44/44 shows starred (19th pass) |
| 07:02 | content-gap redirect | shipped — bake-off Slot #1 slot_argument echo fix |
| 07:16 | critique | pass 143 — 3 findings (0 high, 2 med, 1 low) |
| 08:29 | content-gap redirect | shipped — vanderpump-rules weekly_question metaphor fix (pass-143) |
| 09:11 | content-gap redirect | shipped — dragrace Season 5 dek/body-opener echo fix (pass-142) |
| 10:01 | content-gap redirect | shipped — ink-master hometown-heroes canon.md echo fix |
| 10:45 | bug fix | shipped — season vote block now states the 72h change-window (pass-143) |

(9 additional `march` runs this window show `cancelled` — normal
concurrency-group overlap when a trigger lands mid-tick, not
incidents. `critique` pass 142 — 2 findings, 0 high, 1 med, 1 low —
also ran at 23:18 08-24, both resolved same-window, omitted above
for length.)

## The saga

**Rule 2 (season-fill drain):** flat at **44/44 shows starred**, unchanged since the 08-23 CADENCE sweep — every remaining gap slot is confirmed-but-unaired, not a search failure. The standing row stays pending by design until the table reads zero; 19 consecutive passes now report the same "nothing to drain" result. No calendar date crossed in this window.

**Rule 3 (themed lists):** deeply saturated — **4 zero-ship passes** logged this window (13th, 14th, 15th, 17th, 18th same-day-class — five passes total, four of them dry), interleaved with **4 extends that did land** (ratings-record, the-reveal-was-the-whole-show, the-vote-left-the-phone-line, running-long-running-short) before the idea space ran dry again each time. The 19th-pass audit note explicitly lists eight fresh fact classes chased to exhaustion (labor-strike disruption, cross-franchise casting, remote judging, production mishaps, weather disruption, occupation-based tribes, Uncloaked companion-show angle, non-cash prizes) — all either sub-floor or already staked elsewhere in the 181-row ledger.

**Content-gap redirect (issue #758's workaround):** this is where the window's real velocity lived. Four critique passes (140, 141, 142, 143) fed a steady stream of same-window fixes: echo/repetition cleanups across dragrace (×2), top-chef (×2), bake-off (×2), survivor-50 (×2), AGT, amazing-race, the-voice, vanderpump-rules, ink-master, community-live-strip, plus one tooling fix (`isRscPrefetchAbort()`) and one real HIGH-severity bug (the opengraph-image route-group hash issue that silently 404'd `/u/[handle]/opengraph-image` and `/shows/opengraph-image` — root-caused to Next.js appending a disambiguation suffix for metadata routes inside the `(default)` route group, fixed by moving both files out of the group, same pattern as the working `/themes/[theme]/opengraph-image.tsx`). One net-new bug fix shipped outside the redirect pipeline: the season vote block's default copy now states its 72-hour change-window explicitly (pass-143 finding, closed same-window).

## Queues now

- `plan/AUDIT.md`: 5 open non-standing rows (2 HIGH, 1 MED, 2 LOW) + the standing Rule-2 row. HIGH: the-voice factual corruption (issue #762), night-shift starvation (both updated this tick with fresh recurrence data, see below). MED: e2e-full breadth timeout (also updated this tick). LOW: themed-list description SERP-budget overrun, `YEAR_TENURE_RE` teen-number gap.
- `plan/CRITIQUE.md`: latest pass **143** (07:16 UTC today), 3 findings (0 high / 2 med / 1 low) — fresh, all three already redirected same-window. Pass count 143 total, gate remains lifted (Phase 36).
- `plan/PHASE_CANDIDATES.md`: last pass 66 (2026-08-23), 30+ open candidates. Longest-unpromoted: #34 shard e2e-full crawl (**35 days**), #35 decouple night.yml concurrency (**35 days**, 3rd confirmed recurrence tonight), #36 the-voice remediation, #37 org-outage fallback.
- Open `triage:needs-user`: 8 issues (#777, #763, #762, #758, #586, #565, #399, #398) — #758 (content-gaps starving `/iterate`) now 17+ days old with 64 comments, still the operative diagnosis for why Rule 2/3 keep zero-shipping and the redirect pipeline carries the day instead.
- Open `triage:loop-queued`: 4 issues (#787, #785, #754, #636) — #787's underlying e2e test-isolation bug (shared `survivor:20` vote target between `vote-state-pill.spec.ts` and `user-profile.spec.ts`) is already fixed per AUDIT's closed row, issue left open, likely just needs a closing comment.

## Needs you

- **Candidate #35 (decouple night.yml concurrency) — 35 days unpromoted, 3rd confirmed occurrence tonight.** Two more nights lost (08-23, 08-24) to the identical silent-eviction-before-start race first diagnosed 07-27: `night` gets queued, a `march` trigger lands first, GitHub's concurrency semantics evict the queued run with zero jobs ever starting. This is now the clearest-signal unpromoted candidate in the backlog — three separate multi-night gaps since diagnosis, no code fix possible from cloud (workflow-file edit, needs local `/oversight`).
- **Candidate #34 (shard e2e-full crawl) — 35 days unpromoted.** Two more red nights (08-23, 08-24), same 75-minute wall, zero real test regressions both times. Also workflow-file-blocked from cloud.
- **The-voice factual corruption (AUDIT, HIGH, issue #762)** — still live, still reader-facing (false "show has ended" claim on 8 season files + show frontmatter). Candidate #36 filed but unpromoted; blocking rule still holding (no new the-voice ≥S22 content authored this window).
- **Issue #758 (content-gaps starving `/iterate`)** — 17+ days open, 64 comments, no dispatch-mechanics change. The redirect workaround is working well as a stopgap (this window proves it — 4 critique passes fully absorbed same-window) but the underlying dispatch-priority question is still unresolved.

## Today's intent

Rule 2 stays starred — no calendar date is close enough to act on; the next real target is whatever `plan/CADENCE.md`'s biweekly sweep turns up. Rule 3's idea space needs either a fresh season landing or an extended cool-down — 4 zero-ship passes in 26 hours is saturation, not a bad day. Expect the content-gap-redirect path to keep carrying the day: CRITIQUE's pending queue (passes below 143 not yet fully drained) is the next-in-line target. Top non-content ask: get a local `/oversight` session on candidates #34 and #35 — both are workflow-file edits the cloud loop structurally cannot ship, both have now recurred three-plus times each, and both keep re-filing the same diagnosis every few nights with no way to close the loop from here.

## Tuning proposals

None new this tick — the two live patterns (e2e-full timeout ceiling, night/march concurrency race) are already fully covered by candidates #34 and #35, both reinforced with fresh recurrence data in this tick's `plan/AUDIT.md` update rather than filed as duplicates. The bottleneck is the `/oversight` backlog, not missing candidate coverage.

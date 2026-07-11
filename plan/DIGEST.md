# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-11

## Headline

A clean, high-velocity 24 hours: **24 march ticks, 23 green / 1
red**, the red a cloud march crash that self-healed on the very
next tick with no content lost. The catalog grew by **5 new
shows** (WAVE 9 fully drained: The Real Housewives of Dubai,
Summer House, Bachelor in Paradise, RuPaul's Drag Race All
Stars, Chopped) plus a 5-season Chopped drain, 3 critique passes
(86/87/88, 6 findings total, all closed same-day), a TTFB perf
fix, and an expand pass (52, 2 candidates filed). The one real
shadow: the nightly **e2e-full breadth run went red a third
consecutive night** (2026-07-06 → 07-09 → 07-10), the identical
duration-ceiling breach, worse each time — and this tick
confirmed the title-dedupe blind spot first flagged two digests
ago isn't e2e-full-specific: the same tick window's cloud march
crash got silently absorbed into a month-old stale issue by an
identical pattern in `march.yml`. Filed as new candidate #32.
Deploy is green at HEAD.

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 10:39–11:14 | march → content fix | success — top-chef destination-canada lede/body/canon copy de-duplicated, closes #530 |
| 11:42–12:10 | march → expand pass 51 | success — WAVE 9 show-queue refill, 5 shows filed to AUDIT.md |
| 12:53–13:31 | march → new show | success — The Real Housewives of Dubai added (43rd → 59th show) |
| 13:43–14:20 | march → new show | success — Summer House added |
| 14:59–15:11 | march → critique pass 86 | success — 1 finding (1 med) |
| 15:56–16:28 | march → new show | success — Bachelor in Paradise added |
| 16:46–17:27 | march → new show | success — RuPaul's Drag Race All Stars added |
| 17:37–18:16 | march → new show | success — Chopped added, WAVE 9 fully drained |
| 18:13–18:44 | march tick | **failed** — cloud march crash, action exited non-zero; self-healed next tick, no content lost |
| 19:09–19:41 | march → content fix | success — Summer House S1 filming_caption editorial note added |
| 20:08–20:41 | march → content fix | success — Alone canon era coverage clarified with season ranges |
| 21:04–21:37 | march → content fix | success — The Apprentice host introduced by full name on first mention |
| 22:03–22:21 | march → critique pass 87 | success — 3 findings (3 med) |
| 23:03–23:34 | march → a11y fix | success — title attribute added to /shows B-tier canon-progress pill |
| 00:03–00:14 | march → expand pass 52 | success — 2 candidates filed (#30, #31) |
| 01:10–01:40 | march → content fix | success — Chopped S1 premiere_caption date restatement fixed |
| 02:34–03:12 | march → perf fix | success — community-ranking Supabase reads parallelized (The Apprentice TTFB) |
| 03:50–04:30 | march → content-gaps drain | success — Chopped S2–S6 drained (56 remaining of 62 total) |
| 05:08–05:40 | march → content fix | success — Top Chef Kish-era filter label gains a season range |
| 06:26–06:40 | march → critique pass 88 | success — 2 findings (2 med) |
| 07:21–07:52 | march → fix | success — default vote question now scales to each show's real season count |
| 08:19–08:50 | march → content fix | success — The Circle S1 canon rationale trimmed of redundant "only entry" restatement |
| 09:10–10:01 | march → content fix | success — Below Deck Down Under S2 canon rationale sentence-fragment fixed, retroactively annotated with issue #546 |
| 10:06–10:41 | march → content fix | success — America's Next Top Model card_tagline diverged from tagline |

Net: 40 commits since the last digest window opened. 24 march
ticks, **23 green, 1 red** — the one red was a transient cloud
crash (not a code regression), self-healed on the very next
tick.

## The saga

**Shows scaffolded:** 5 this window — The Real Housewives of
Dubai, Summer House, Bachelor in Paradise, RuPaul's Drag Race
All Stars, Chopped. Catalog holds **63 shows**, up from 58.
WAVE 9 (filed expand pass 51 same window) is now fully drained
— the new-show queue is back to **0 Pending "Add show" rows**,
the same recurring empty-queue-after-full-drain pattern
candidate #24 already names. Expect a WAVE 10 refill from a
future `/expand` pass per Rule 1's "keep the queue fed" mandate.

**Seasons drained:** 5 this window — Chopped S2–S6, re-ranked
against the growing canon. Catalog holds **737 seasons**, up
from 727. Because 5 new shows landed with only their S1 seeded,
total queue depth actually **grew** despite the drain: **203
seasons remaining across 23 shows** (up from 118 across 18
shows yesterday). Largest gaps now: **Chopped (56)**, Married
at First Sight (13), American Ninja Warrior (12), Vanderpump
Rules (11), 90 Day Fiancé (11), plus the five freshly-seeded
shows each sitting at 9–11 remaining. This is expected sawtooth
behavior for the saga (new-show adds always spike the queue
before drain catches back up), not a stall.

**Velocity vs. bearings:** Rule 1 (show coverage) — active and
productive, 5 shows landed in one window, queue refilled and
redrained same-day. Rule 2 (canon completeness) — steady, 5
seasons landed on the show with the single largest remaining
gap (Chopped), a sensible drain-target choice. Rule 3 (themed
list) — quota (≥10 lists) remains satisfied at 12, unchanged,
no action needed (per the framing correction filed in the
2026-07-10 digest).

**Critique backlog kept shrinking:** open findings dropped from
**21 to 17** — 3 passes landed (86/87/88, 6 findings total) and
essentially all of them closed same-day via paired content
fixes. Third consecutive digest with real backlog reduction.

## Queues now

- **AUDIT.md Pending:** 3 real rows (plus 2 template-placeholder
  lines that aren't findings). The `[HIGH]` e2e-full timeout row
  was updated this tick with a **third** consecutive-night
  recurrence: run 29130142942 hit the identical 50-minute
  ceiling, test count now 7,098 (up from 6,983 three days ago).
  Still blocked from cloud (missing `workflows` OAuth scope),
  candidate #26 now **4 days** stale, unpromoted across three
  red nights. The Supabase CLI pin (issue #416/#480) is now
  **27 days** stale, same blocker. The low-score
  `YEAR_TENURE_RE` gap (score 2.7) is unchanged, below the
  iterate threshold.
- **AUDIT.md needs-user-call:** unchanged, 2 — Naked and Afraid
  S12/13/15/16 premiere-date numbering ambiguity; The Apprentice
  S5 "LA Season" framing check.
- **CRITIQUE.md:** last pass **88** (2026-07-11T06:38Z, commit
  8122305), 2 findings (both med), both closed same-tick. Open
  backlog now **17 findings** (down from 21). File itself is
  **3,244 lines / ~1.5MB** on disk, up from 3,096 lines
  yesterday — growth continues, tracked by candidate #29.
- **PHASE_CANDIDATES.md:** 20 pending awaiting promotion (was
  15), up 5 this window — #30 and #31 filed by expand pass 52,
  #32 filed by this digest. Last promotion still **2026-06-11**
  — now **30 days** stale. Top scores unpromoted: **#15 (9.4)**
  show canon completeness lax→strict gate, **#28 (8.3)** stat-
  tile literal-duplicate invariant, **#25 (8.0)** canon-
  rationale/season-body echo gate.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-
  user`: 3 open, unchanged — #480, #398, #399 (the latter two
  now **30 days** stale and, per this tick's finding, actively
  absorbing fresh unrelated incidents via title-match dedupe).
  `triage:loop-queued`: 1 — #416, still doing double duty.

## Needs you

1. **Three workflow-file fixes are now stuck behind the cloud
   permission wall**, all one-line-to-few-line diffs blocked by
   the same missing `workflows` OAuth scope: the Supabase CLI
   pin (issue #416/#480, **27 days** idle), the e2e-full timeout
   bump (candidate #26, **4 days** idle, recurred a third time
   overnight), and the new dedupe staleness-bound fix (candidate
   #32, filed this tick). Bundle all three in one local/
   `/oversight` session with a token that carries the
   `workflows` scope.
2. **The title-dedupe blind spot flagged two digests ago has now
   confirmed a third incident, on a second workflow.** Issue
   #416 (e2e-full) has absorbed two distinct-night recurrences
   under one 27-day-old thread; issue #398 (march-crash) just
   absorbed tonight's fresh cloud crash the same way, even
   though that crash self-healed on retry. Every fresh incident's
   own run link is landing nowhere visible except the raw
   workflow log. Worth closing #398 and #399 (both 30 days
   stale, June 11) locally so future incidents regain visibility
   — candidate #32 has the scoped fix (bound the dedupe search
   to a recency window, or comment-on-match instead of skip).
3. **Phase-candidate backlog (20 pending, up from 15) hasn't
   been promoted in 30 days**, now a full month stale and still
   growing faster than it drains. #15 (score 9.4, show canon
   completeness gate) is the standout — the single highest-
   scored open candidate on the board and has sat unpromoted
   the longest of the top three.

## Today's intent

**Saga:** the WAVE 9 refill-and-redrain cycle completed clean
in one window — good sign for velocity. Next natural drain
targets by size: Chopped (56 remaining, now the largest gap by
far), then the five freshly-seeded shows (RH Dubai, Summer
House, Bachelor in Paradise, RuPaul's Drag Race All Stars — each
9–11 remaining) picking up their first real drain batches. The
new-show queue is empty again — expect/welcome a WAVE 10 refill
from the next `/expand` pass per Rule 1.

**Top non-content finding:** the e2e-full breadth ceiling's
third consecutive red night, now compounded by a confirmed
second-workflow instance of the title-dedupe blind spot. Both
symptoms already have `PHASE_CANDIDATES.md` rows (#26, #32) plus
the standing Supabase CLI pin (#416/#480) — none need new
proposals, all three need promotion in the same local session.

## Tuning proposals

One new proposal this tick: **candidate #32**, filed to
`PHASE_CANDIDATES.md` — bound the failure-issue title-dedupe
search (`gh issue list --search 'in:title "..." state:open'`)
used by both `e2e-full.yml` and `march.yml` to a staleness
window (or switch to comment-on-match), so a month-old open
issue stops silently swallowing every new incident that happens
to share its title prefix. This is the "third occurrence" the
2026-07-10 digest flagged as the threshold for filing — it just
happened, on a second workflow, confirming the pattern is
systemic rather than e2e-full-specific. Scored, scoped, and
capped by the same cloud-permission blocker as candidates #26
and #416/#480; see the row for the full rationale and bundling
recommendation.


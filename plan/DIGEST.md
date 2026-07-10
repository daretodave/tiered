# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-10

## Headline

Another productive, mostly-clean 24 hours: **20 march ticks, 19
green / 1 red**, the red a transient `Prompt is too long` crash
that self-healed on the next tick — but it's the **second**
occurrence of that exact error in 2 days, which upgrades
yesterday's "plausible root cause" theory (CRITIQUE.md file
size) to a confirmed recurring pattern. Separately, the nightly
e2e-full breadth run also went red again overnight
(2026-07-09T23:29Z) with the **identical** duration-ceiling
breach flagged 4 days ago — worse this time (92.4% complete vs
97.5% last time) — and its dedupe check quietly folded the
failure into a 26-day-stale, unrelated issue thread instead of
surfacing fresh evidence anywhere visible. Content-wise: 5 more
seasons drained (American Ninja Warrior S2–S6), the critique
backlog kept shrinking (25 → 21 open findings), and deploy is
green at HEAD.

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 09:15–09:55 | march → content-gaps drain | success — Married at First Sight S2–S6 drained (Rule 2), closes #514 |
| 10:40–11:11 | march → SEO fix | success — themes/firsts meta description trimmed to snippet budget, closes #515 |
| 12:04–12:22 | march → critique pass 83 | success — 1 finding (1 med): MAFS Boston format_caption "consecutive panel change" claim contradicted the season's own lede |
| 13:39–14:09 | march → content fix | success — MAFS Boston format_caption "consecutive" claim corrected, closes #516 |
| 14:41–15:13 | march → content fix | success — Top Chef All-Stars seventeen-episode line-break artifact fixed, closes #517 |
| 16:04–16:37 | march → fix | success — SEO clipper prefers em-dash cut over trailing list comma, closes #518 |
| 17:26–17:56 | march → content-gaps drain | success — American Ninja Warrior S2–S6 drained, full canon re-ranked, closes #519 |
| 18:18–18:52 | march → fix | success — Shark Tank ALL-chip label separated from its count badge (critique pass-78 finding) |
| 19:12–19:22 | march → expand pass 50 | success — 0 new candidates filed, candidate #27 closed out (superseded) |
| 20:19–20:33 | march → critique pass 84 | success — 5 findings (1 high, 2 med, 2 low), including a fresh vote-pair/comment SSR auth-state gap |
| 21:07:57 | march tick | **failed** — `SDK execution error: Prompt is too long` (2nd occurrence in 2 days — see Tuning proposals) |
| 22:09–22:52 | march → fix | success — VotePair/VoteRowHead/CommentThreadLive now seed from server-resolved auth on season pages (pass-84 HIGH finding), closes #522 |
| 23:05–23:41 | march → content fix | success — the-apprentice tagline euphemism fixed, closes #523 |
| 00:04–00:41 | march → fix | success — duplicated rank digit dropped from canon-meter dot label, closes #524 |
| 01:14–01:48 | march → a11y fix | success — pre-hydration sign-in flash replaced with a neutral skeleton, closes #525 |
| 02:35–03:11 | march → fix | success — coverage note surfaced when aired seasons outpace ranked canon, closes #526 |
| 04:03–04:38 | march → content fix | success — big-brother card_tagline rewritten to a distinct editorial angle, closes #527 |
| 06:04–06:36 | march → critique pass 85 | success — 4 findings (0 high, 3 med, 1 low) |
| 07:54–08:27 | march → a11y fix | success — home hero heading order fixed (cover-name h2 → p), closes #528 |
| 09:15–09:48 | march → content fix | success — best-non-winning-runs title/description contradiction fixed, closes #529 |
| 10:39–11:14 | march → content fix | success — top-chef destination-canada lede/body/canon copy de-duplicated, closes #530 |

Net: 36 commits since the last digest window opened. 20 march
ticks, **19 green, 1 red** — the one red was transient infra
(not a code regression), self-healed on the very next tick.

## The saga

**Shows scaffolded:** none this window — catalog holds at **58
shows**, unchanged for a second straight digest. New-show queue
has been empty since wave 8; still no wave 9 refill (expand pass
50 also reinforced/closed existing candidates rather than filing
one).

**Seasons drained:** 5 this window — American Ninja Warrior
S2–S6, re-ranked against the full 6-season canon (S6 now #1).
Catalog holds **727 seasons**, up from 722. The wave-7 remainder
flagged for two digests running — Southern Charm (10 left),
RHOP (9), the Circle (6), RHOM (6), Too Hot to Handle (5) —
still hasn't been touched directly; this window's drain again
went to a different show (ANW) instead. Current largest gaps by
seasons remaining: **Married at First Sight (13)**, American
Ninja Warrior (12, still 12 after this window's drain — it's an
18-season show), 90 Day Fiancé (11), Vanderpump Rules (11),
Southern Charm (10). Total queue depth: **118 seasons remaining
across 18 shows**.

**Velocity vs. bearings:** Rule 1 (show coverage) — idle,
2nd window running, queue empty. Rule 2 (canon completeness) —
steady progress, 5 seasons landed, though the oldest-flagged gap
(wave-7) is now 3 digests unaddressed. Rule 3 (themed list) —
correction to the last two digests' framing: this isn't actually
a starved queue. Rule 3's quota is a one-time launch bar (`≥ 10`
themed lists per `plan/bearings.md`), and the catalog already
holds **12** — the quota has been satisfied since 2026-05-14.
`/ship-content` only ships a new list when the count drops below
10, so the "idle" window count is expected behavior, not a
signal. Worth dropping this line from future digests unless the
bearings' Rule 3 threshold itself changes.

**Critique backlog kept shrinking:** open findings dropped from
25 to **21** — mostly same-day fixes rather than a dedicated
sweep this time (11 individual close commits across the window).
Second consecutive digest with real backlog reduction.

## Queues now

- **AUDIT.md Pending:** 4 rows (up from an implied 2 real-blocked
  yesterday, but one is the recurred e2e-full timeout — see
  below — and one is the low-score `YEAR_TENURE_RE` gap, both
  carried over). The `[HIGH]` e2e-full timeout row was updated
  this tick with tonight's recurrence: run 29057481435 hit the
  identical 50-minute ceiling, 6,454/6,983 tests complete (92.4%,
  worse than the 07-06 run's 97.5%), zero actual test failures,
  test count up 410 (~6%) in 3 days. Still blocked from cloud
  (missing `workflows` OAuth scope), candidate #26 still
  unpromoted, now **3 days** stale. The Supabase CLI pin
  (issue #416/#480) is now **26 days** stale, same blocker.
- **AUDIT.md needs-user-call:** unchanged, 2 — Naked and Afraid
  S12/13/15/16 premiere-date numbering ambiguity; The Apprentice
  S5 "LA Season" framing check.
- **CRITIQUE.md:** last pass **85** (2026-07-10T06:15Z, commit
  07cfb0c), 4 findings (0 high, 3 med, 1 low), 3 of the 4 already
  closed same-tick. Open backlog now **21 findings** (down from
  25). File itself is **3,096 lines / ~1.5MB** on disk, up from
  2,967 lines yesterday — still growing, see Tuning proposals.
- **PHASE_CANDIDATES.md:** 15 pending awaiting promotion,
  unchanged in count but reinforced twice this window (#26 with
  fresh recurrence data, #29 with fresh recurrence data). Last
  promotion still **2026-06-11** — now **29 days** stale, the
  largest backlog and staleness this cycle.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-user`:
  3 open, unchanged — #480, #398, #399 (the latter two now **29
  days** stale). `triage:loop-queued`: 1 — #416, now doing double
  duty (see below).

## Needs you

1. **Two workflow-file fixes are still stuck behind the cloud
   permission wall**, both now staler: the Supabase CLI pin
   (issue #416/#480, ready since 2026-06-14, **26 days** idle)
   and the e2e-full timeout bump (candidate #26, ready since
   2026-07-07, **3 days** idle, and it recurred again overnight —
   worse than last time). Both are one-line diffs to workflow
   files; bundle them in one local/`/oversight` session with a
   token that carries the `workflows` scope.
2. **Issue #416 is now silently absorbing two unrelated failure
   classes** under one 26-day-old title-matched thread — its
   original Supabase-CLI-transient cause, and now tonight's
   e2e-full duration-ceiling breach too, via the same
   `gh issue list --search 'in:title "..."'` dedupe pattern
   flagged for issue #398 in yesterday's digest. Neither
   recurrence gets its own visible evidence trail unless someone
   reads the raw run log by hand (as this digest did). Worth
   closing #416 and #398 both so future crashes/failures regain
   visibility — the dedupe logic itself isn't broken, it's doing
   exactly what it's told, but "one issue per title, forever" is
   the wrong shape once a title gets reused across unrelated
   causes.
3. **Phase-candidate backlog (15 pending) hasn't been promoted
   in 29 days**, now a full month stale. Candidate #28 (score
   8.3, stat-tile invariant) remains the standout; candidate #29
   (CRITIQUE.md archival) just gained a second confirmed
   recurrence and is worth a look alongside it — same root class
   of problem (file/context growth silently degrading the loop)
   as the e2e-full timeout, just on the agent side instead of the
   test-runner side.

## Today's intent

**Saga:** Rule 2 momentum continues (5 seasons) but the wave-7
remainder (Southern Charm, RHOP, Circle, RHOM, Too Hot to
Handle) is now 3 digests unaddressed and the oldest open content
backlog — worth prioritizing next over picking up a fresh show's
drain. Rule 3 framing corrected above; no action needed there.

**Top non-content finding:** two independent "the loop's own
memory is outgrowing its container" symptoms landed the same
night — CRITIQUE.md's prompt-length crash (2nd occurrence) and
e2e-full's duration-ceiling breach (2nd occurrence, worse) are
different files hitting the same shape of problem. Both already
have PHASE_CANDIDATES.md rows (#26, #29); neither needs new
proposals, both need promotion.

## Tuning proposals

No new proposals this tick — both live signals (CRITIQUE.md
growth, e2e-full timeout) already have PHASE_CANDIDATES.md rows
from prior digests (#29, #26 respectively). This tick reinforced
both in place with tonight's recurrence evidence rather than
filing duplicates. One new observation, not yet a full proposal:
the title-based dedupe pattern used by both the march-crash and
e2e-full-failure GitHub Actions steps (`gh issue list --search
'in:title "..."'`) has now silently absorbed distinct-cause
recurrences into stale threads twice (#398 in the 2026-07-09
digest, #416 in this one) — if this happens a third time, it's
worth its own candidate (e.g. dedupe by run ID within a rolling
window instead of by title forever, or auto-close+refile past
some staleness threshold).

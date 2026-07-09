# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-09

## Headline

A productive, mostly-clean 24 hours: **21 march ticks, 19
green / 2 red**, both reds self-healed on the very next tick and
neither was a code regression — one was a transient Claude API
500, the other a `Prompt is too long` SDK error. That second one
is worth a closer look (see Tuning proposals): `plan/CRITIQUE.md`
has grown to **1.5MB / ~98K tokens** on disk, and it's a
plausible root cause. Content-wise: 10 more seasons drained
(Married at First Sight S2–S6, Shark Tank S7–S11, the latter now
at full canon coverage), the critique backlog got a real scrub
(39 → 25 open findings, including a 4-row stale-finding sweep),
and the two cloud-blocked workflow-file fixes from yesterday are
both still stuck, now 2 and 25 days stale respectively. Deploy is
green at HEAD.

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 11:20–17:11 (6 ticks) | march → critique pass 80 tail + canon-duplication drain | success — Perfect Match + The Voice finale canon rationales de-duplicated (#501, #502), SEO stop-word fix (#503), critique pass 81 (1 low finding, folded into existing row) |
| 13:25 | march → expand pass 48 | success — 1 candidate filed (#28, stat-tile value/caption literal-duplicate invariant), candidate #25 reinforced |
| 15:05 | march → critique pass-80 fix | success — The Voice tenure copy frozen, status marked ended, closes #504 |
| 17:38 | march → a11y fix | success — SeasonTOCMobile section count exposed to screen readers |
| 18:08 | march tick | **failed** — `API Error: 500 Internal server error` (transient, Claude-side) — no code touched, no issue needed (self-evidently infra, not a defect) |
| 19:06–20:41 (2 ticks) | march → critique fixes | success — masked-singer double-article fix (#507), CAST SIZE caption rewrite across 3 files (#508) |
| 21:04–22:04 | march → content-gaps drain | success — Shark Tank season drain S7–S11, canon extended to 11 ranked seasons, closes #509 |
| 22:04 | march tick | **failed** — `SDK execution error: Prompt is too long` — see Tuning proposals; plausibly `plan/CRITIQUE.md`'s file size |
| 23:04–00:41 (2 ticks) | march → SEO + labeling fixes | success — Below Deck meta-description contradiction fixed (#510), self-referential "also appears in" label fixed (#511) |
| 01:13 | march → critique pass 82 | success — 1 finding (1 med): Shark Tank S11 canon/season-body verbatim duplication |
| 02:35 | march → fix | success — Shark Tank S11 canon rationale de-duplicated, closes #512 |
| 04:03 | march → expand pass 49 | success — 0 new candidates, #25 and #28 reinforced |
| 06:04 | march → content fix | success — big-brother `meth_how_p` rhetorical-question punctuation fixed, closes #513 |
| 07:54 | march → audit sweep | success — 4 stale CRITIQUE.md findings closed (already fixed by unrelated drains) |
| 09:15 | march → content-gaps drain | success — Married at First Sight S2–S6 drained (Rule 2 season drain), closes #514 |
| 10:40 | march → SEO fix | success — themes/firsts meta description trimmed to SEO snippet budget, closes #515 |

Net: 32 commits since yesterday's digest (11:16 UTC). 21 march
ticks, **19 green, 2 red** — both reds transient infra, both
self-healed same-window, neither left a stranded commit.

## The saga

**Shows scaffolded:** none this window — catalog holds at **58
shows**, unchanged from yesterday. New-show queue has been empty
since wave 8 drained two windows ago; no wave 9 refill happened
this window either (expand pass 49 reinforced existing
candidates rather than filing a queue-refill nudge).

**Seasons drained:** 10 this window — Married at First Sight
S2–S6 (5) and Shark Tank S7–S11 (5, completing Shark Tank's
canon at 11 ranked seasons). Catalog now carries **722 seasons**,
up from 712. Real progress against the Rule 2 backlog flagged
the last two digests, but the wave-7 remainder (Southern Charm,
RHOP, Circle, RHOM, Too Hot to Handle — ~36 seasons two digests
ago) still hasn't been touched directly; today's drains targeted
Shark Tank (now closed out) and MAFS instead.

**Velocity vs. bearings:** Rule 1 (show coverage) — idle this
window, queue empty, no refill; watch for a third consecutive
idle window. Rule 2 (canon completeness) — **improving**: 10
seasons landed and one show (Shark Tank) reached full canon
coverage. Rule 3 (themed list) — **still no themed list shipped**,
now the **third window running**; flagged twice before, worth an
explicit `/oversight` nudge if a fourth window passes quiet.

**Critique backlog got real attention:** open findings dropped
from 39 to **25** — a mix of same-day fixes (11+ findings closed
via individual commits) plus a dedicated 4-row stale-finding
sweep at 07:54 UTC. First real backlog reduction in several
digests; worth naming as a positive signal.

## Queues now

- **AUDIT.md Pending:** 2 real blocked rows (unchanged) —
  `[HIGH]` e2e-full step timeout undersized for catalog growth
  (candidate #26, filed 2026-07-07, now 2 days blocked) and
  `[LOW]` Supabase CLI version pin (issue #416/#480, blocked
  since 2026-06-14, now **25 days** stale). Both remain one-line
  workflow-file diffs blocked by the same missing `workflows`
  OAuth scope on the cloud loop's token. One new low-score row
  this window: `YEAR_TENURE_RE` teen-number gap (score 2.7,
  filed 2026-07-08, not urgent).
- **AUDIT.md needs-user-call:** unchanged, 2 — Naked and Afraid
  S12/13/15/16 premiere-date numbering ambiguity; The Apprentice
  S5 "LA Season" framing check.
- **CRITIQUE.md:** last pass **82** (2026-07-09T01:26Z), 1
  finding (1 med) — Shark Tank S11 canon/season-body duplication
  — already fixed same-tick (02:35 UTC commit). Open backlog now
  **25 findings** (down from 39), spanning pass-36 through
  pass-82. **The file itself is now 1.5MB / ~2,967 lines / ~98K
  tokens on disk** — see Tuning proposals.
- **PHASE_CANDIDATES.md:** 15 pending awaiting promotion (up
  from 13 two digests ago — #28 is new this window, score 8.3,
  the highest-scored pending candidate right now). Last
  promotion still **2026-06-11** — 28 days and counting.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-user`:
  3 open, unchanged — #480 (workflows-permission blocker), #398/
  #399 (both 2026-06-11, now **28 days** stale). `triage:
  loop-queued`: 1 — #416 (see Needs you).

## Needs you

1. **Two workflow-file fixes are still stuck behind the cloud
   permission wall**, now more stale than yesterday: the
   Supabase CLI pin (issue #416/#480, ready since 2026-06-14,
   **25 days** idle) and the e2e-full timeout bump (candidate
   #26, ready since 2026-07-07). Both are one-line diffs;
   bundle them in one local/`/oversight` session with a token
   that carries the `workflows` scope.
2. **#398/#399 (`triage:needs-user`) are 28 days stale.** Same
   ask as yesterday, now a day older: one-off cloud-tick crash
   reports from 2026-06-11, the loop has since run cleanly for
   weeks including two fully-green stretches. Note: the open
   #398 also means the crash-dedupe check (`gh issue list
   --search 'in:title "Cloud march tick crashed"'`) silently
   absorbed both of *this window's* crashes (18:08, 22:04) into
   the same stale issue rather than filing fresh ones with their
   own run links — worth closing #398 so future crashes regain
   visibility, independent of whether these two specific crashes
   need further action (they don't; see Tuning proposals).
3. **Phase-candidate backlog (15 pending) hasn't been promoted
   in 28 days**, now the largest and stalest it's been all
   cycle. Candidate #28 (score 8.3) is the standout — a
   content-check invariant that would have caught issue #508
   before it needed a reactive fix.

## Today's intent

**Saga:** Rule 2 momentum is good (10 seasons, Shark Tank
closed out) — keep pushing the wave-7 remainder (Southern Charm,
RHOP, Circle, RHOM, Too Hot to Handle) next, since it's the
oldest open backlog item. Rule 3 (themed lists) is now 3 windows
idle and deserves an explicit dispatch if a 4th window passes
quiet.

**Top non-content finding:** the CRITIQUE.md file-size growth
(1.5MB / ~98K tokens) as the likely cause of last night's
`Prompt is too long` crash — see Tuning proposals below.

## Tuning proposals

1. **Archive closed CRITIQUE.md / AUDIT.md rows out of the live
   file.** `plan/CRITIQUE.md` is now 2,967 lines / 1.5MB / ~98K
   tokens on disk (`plan/AUDIT.md` is 388KB); a march tick failed
   last night with `SDK execution error: Prompt is too long`
   (run 28978947705, 2026-07-08T22:04Z) — the timing lines up
   with a tick that would need to read or scan these files as
   part of its normal context-gathering. 360 of 385 CRITIQUE.md
   findings are already `[x]` closed; nothing in `skills/critique.md`
   or the file's own header says these should ever be pruned or
   archived, so the file has grown append-only since pass 1.
   Proposing: a scoped tuning where closed rows older than some
   pass-count or age threshold move to `plan/CRITIQUE_ARCHIVE.md`
   (git history keeps everything regardless), keeping the live
   file's working set small enough that no single tick's context
   read risks the prompt-length ceiling again. Filing as a
   candidate for `/expand` or direct `/oversight` scoping —
   not applying anything here per the meta-loop rail.

Candidates #26 (e2e-full timeout) and #28 (stat-tile invariant,
score 8.3) remain the other live proposals from prior passes;
noted here, not re-filed.

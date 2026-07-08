# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-08

## Headline

The cleanest 26 hours in a while: **24 of 24 march ticks green**,
wave 8's five new shows fully scaffolded and drained same-day, a
139-file catalog-wide FILMED-caption defect class closed out
across six batches, and — the good news on last night's worry —
the e2e-full breadth crawl that timed out on 2026-07-06 ran clean
last night (2026-07-07T23:21Z, no timeout). Deploy is green at
HEAD. The two workflow-file fixes (Supabase CLI pin, e2e-full
timeout headroom) are both still stuck behind the same cloud
permission wall, now three-plus weeks and one week stale
respectively.

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 09:16–12:30 (3 ticks) | march → critique pass 77 tail | success — finding #489 (Southern Charm FORMAT caption) and #490 addressed same-day; unrelated fix: home hero sign-in CTA suppressed once authed |
| 13:26 | march → expand pass 46 | success — 0 candidates filed, wave 8 new-show queue refilled (5 rows), candidate #25 reinforced |
| 14:35–19:56 (5 ticks) | march → content-gaps drain | success — wave 8 shipped: RuPaul's Drag Race UK, The Real Housewives of Dallas, Shark Tank, The Ultimatum, Perfect Match (queue fully drained same-day) |
| 20:21 | march → critique pass 78 | success — 5 findings (2 med, 3 low); Shark Tank CAST SIZE fix shipped same-tick |
| 21:10–23:35 (3 ticks) | march → content drain | success — Shark Tank season drain S2–S6; FILMED-caption fix batches 1–2/139 |
| 00:03 | march → critique pass 79 | success — 5 findings (0 high, 4 med, 1 low) |
| 01:11 | march → expand pass 47 | success — 1 candidate filed (#27, `clipToSeoBudget()` recurring-patch pattern), candidate #25 reinforced again (6→7 signal instances) |
| 02:34–07:05 (4 ticks) | march → FILMED-caption drain | success — batches 3–6/139 shipped, drain complete (issue #498 closed) |
| 08:33–09:49 (2 ticks) | march → critique pass-79 fixes + pass 80 | success — B-tier lede voice fix, Perfect Match villa/house contradiction fix, critique pass 80 filed (4 findings, 0 high) |
| 10:29–11:05 (1 tick) | march → critique pass-79 canon-duplication fix | success — Perfect Match canon rationale rewritten |

Net: 41 commits since yesterday's digest (11:33 UTC). 24 march
ticks in the last 26h, **24 green, 0 red** — the first fully
clean window in recent memory.

## The saga

**Shows scaffolded (5, wave 8 fully drained):** RuPaul's Drag
Race UK, The Real Housewives of Dallas, Shark Tank, The
Ultimatum, Perfect Match. Catalog now stands at **58 shows**,
up from 53 yesterday. Each shipped frontmatter + canon.md + a
first-season batch per Rule 1, same-day as filed — matching the
wave-6/wave-7 cadence exactly.

**Seasons drained:** 10 this window — the 5 wave-8 first-season
seeds, plus Shark Tank's Rule 2 batch (S2–S6, 5 of its 17 total).
Catalog now carries **712 seasons**. The wave-7 backlog flagged
in yesterday's digest (Southern Charm 10, RHOP 9, Circle 6, RHOM
6, Too Hot to Handle 5 — 36 seasons) went **untouched** this
window; Shark Tank's own remaining gap (S7–S17, 11 seasons) adds
to it, alongside smaller wave-8 remainders (Drag Race UK 4, RHOD
4, Perfect Match 3, Ultimatum unscoped).

**Velocity vs. bearings:** Rule 1 (show coverage) — on pace,
wave 8 drained same-day it was filed. Rule 2 (canon completeness)
— **falling further behind**: the standing season-drain backlog
is now wave-7's 36 plus Shark Tank's remaining 11, and none of
wave 7's specific rows moved this window while five brand-new
shows landed instead. Rule 3 (themed list/tick) — **no themed
list shipped again**, second window running; flagged in
yesterday's digest as "worth a check," still hasn't happened.

**New-show queue is empty again** — wave 8 fully drained,
Pending rows back to 0, the exact stall pattern candidate #24
(still awaiting `/oversight` promotion) warns about. Unlike
yesterday, `/expand` pass 47 explicitly chose *not* to refill a
wave 9 this pass, leaving the queue-refill call to whichever
march tick's Step 3b.5 next finds it empty.

## Queues now

- **AUDIT.md Pending:** 2 open rows — `[HIGH]` e2e-full step
  timeout undersized for catalog growth (candidate #26, filed
  2026-07-07, still blocked from cloud) and `[LOW]` Supabase CLI
  version pin (issue #416/#480, blocked from cloud since
  2026-06-14 — now 3+ weeks). Both are one-line workflow-file
  diffs, both need a local/`/oversight` session with `workflows`
  OAuth scope.
- **AUDIT.md needs-user-call:** 2, unchanged — Naked and Afraid
  S12/13/15/16 premiere-date numbering ambiguity; The Apprentice
  S5 "LA Season" framing check.
- **CRITIQUE.md:** last pass **80** (2026-07-08T09:47Z, ~90 min
  ago), 4 findings (0 high, 2 med, 2 low) — The Voice
  tenure/status contradiction, The Voice season-body/canon echo,
  two `/themes/best-villain-editing` prose LOW findings — all
  still open. Total Pending backlog: **39 open findings**, mostly
  LOW, spanning pass-36 through pass-80. `/expand` pass 47
  reviewed this growth (30→40 over passes 78/79) directly and
  did not flag it as a gate-tuning signal beyond the two defect
  classes already filed as candidates #25 and #27 — noted here,
  not re-litigated.
- **PHASE_CANDIDATES.md:** 13 pending awaiting promotion (#14,
  15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 — #17
  superseded), up from ~10-11 yesterday (#26, #27 both new this
  window). Last promotion **2026-06-11** — 27 days and 13
  candidates ago now.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-user`:
  3 open — #480 (workflows-permission blocker, see Needs You),
  #398/#399 (both **2026-06-11**, now 27 days stale). `triage:
  loop-queued`: 1 — #416 (see Needs You).

## Needs you

1. **Two workflow-file fixes are still stuck behind the same
   cloud permission wall.** The Supabase CLI pin (issue #416/#480,
   ready since 2026-06-14, now 3+ weeks idle) and the e2e-full
   timeout bump (candidate #26, ready since 2026-07-07) are both
   one-line diffs to `.github/workflows/*` that the cloud loop's
   `ACTIONS_PAT` cannot push (no `workflows` OAuth scope). Both
   are cheap; bundle them in one local/`/oversight` session.
2. **#398/#399 (`triage:needs-user`) are 27 days stale.** One-off
   cloud-tick crash reports from 2026-06-11; the loop has run
   cleanly hundreds of times since, including a fully green 24/24
   window last night. Worth a quick pass to close or reconfirm.
3. **Phase-candidate backlog (13 pending) hasn't been promoted
   in 27 days** and grew by 2 this window. Not urgent, but the
   largest it's been all cycle.

## Today's intent

**Saga:** new-show queue is empty again — the next `/expand` or
a direct Rule 1 dispatch should refill wave 9. But the bigger
lever is Rule 2: the season-drain backlog (wave 7's 36 seasons,
untouched, plus Shark Tank's own 11) is now large enough that a
few ticks of pure Rule 2 drain — no new shows — would do more
for canon completeness than another wave.

**Top non-content finding:** unchanged from yesterday — the
Supabase CLI pin and e2e-full timeout bump, both cloud-blocked,
both one `/oversight` session away from landing together.

## Tuning proposals

None new this window. Candidates #26 (e2e-full timeout) and #27
(`clipToSeoBudget()` recurring-patch pattern) were filed by the
digest and `/expand` respectively in the prior two passes and
remain the live proposals; the CRITIQUE.md backlog growth
(30→40 findings) was reviewed by `/expand` pass 47 directly and
judged not to be a gate-tuning signal beyond those two already-
filed candidates.

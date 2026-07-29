# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-29

## Headline

**The night-shift starvation bug (candidate #35) recurred the very
next night after it was diagnosed.** 07-27's digest ran clean and
named the fix; 07-28's scheduled run got cancelled by a march
trigger anyway — the exact eviction pattern candidate #35
describes, still unpromoted. Tonight's tick only got through
because no march trigger happened to contend during its queue
window; that's luck, not a fix. Elsewhere: the content saga logged
its **59th `/expand` pass and kept Rule 3 (themed lists) absorbing
100% of content ticks** — Rule 2 stays fully stalled (36 gap-slots,
all starred confirmed-but-unaired, next sweep 2026-08-02) — and
both standing HIGH rows (`the-voice` factual corruption, e2e-full's
now **8th** consecutive red night) remain open and unstarted.

## While you were out

Pulse window: last 26h (2026-07-28T09:24Z → 2026-07-29T11:26Z).

| Tick | Verb | Outcome |
|---|---|---|
| 44 commits | content (22) / audit progress-notes (21) / expand (1) | 100% Rule 3 (themed-list) drain — extend-first pattern across 12 distinct lists (`no-season-here-got-the-calendar-to-itself` hit 5 separate extensions this window alone), 1 brand-new list shipped (`thirteen-was-the-promise-not-the-rule`), 3 zero-ship passes (28th/32nd/33rd — no concept cleared the Rule 3 excellence gate). Zero commits from `/iterate`, `/triage`, `/ship-a-phase`, or `/ship-data` this window. |
| march runs (26 in window) | dispatcher ticks | 25 success, 1 failure — the failure (07:36 UTC) matches the self-healing `issue #565` crash pattern (recurrence comment appended, no new issue filed). |
| e2e-full (nightly breadth) | duration-ceiling breach | **Red again**, 2026-07-28T23:22:37Z run (30407780025) — same 75-minute wall, timed out at test 9,348 of 10,480 (~89% complete, 1,132 remaining); every completed check passed. Not a regression — the scaling problem candidate #34 already names. |
| night (this tick) | digest | Running now (30446969992, in-progress). **Yesterday's scheduled run (07-28T11:16Z, 30354092861) was cancelled** — the starvation bug recurring one day after being diagnosed and filed as candidate #35. |
| deploy:check | HEAD `f0ea1aa` | `ready` on Vercel. No red deploy. |

## The saga

**Rule 2 (season-fill drain) stays fully stalled.** `plan/CADENCE.md`'s
gap table holds at 35 shows / 36 gap-slots, every slot starred
(confirmed-but-unaired) — re-verified same-day by an earlier tick's
"Rule 2 stall" note (commit 3e9f9c3b) covering the pick-order-top
candidates (survivor, the-challenge, big-brother, amazing-race,
bachelor). Last sweep 2026-07-26; next due 2026-08-02 — not yet
due.

**Rule 3 (themed lists) is now the sole content driver, and the well
keeps getting shallower.** The catalog carries **174 live themed
lists** (content/themes/*.md). `plan/LISTS.md`'s Ideas log puts
extend-first at **24-for-25** against a blind new-concept search's
historical ~1-in-13 hit rate — still winning, but 3 of this
window's passes zero-shipped entirely (28th, 32nd, 33rd) with no
concept clearing the excellence gate, and the 43rd pass's own notes describe having
to re-read a season's full lede/pull directly rather than trust an
"already claimed elsewhere" shortcut to find a fresh angle. Catalog
now sits at **68 shows / 1,043 season files**.

**Both standing content-integrity risks remain open and untouched.**
`the-voice`'s 8-season factual corruption (wrong dates, conflated
casts, a fabricated "series finale," a currently-live false
"show has ended" claim) is still HIGH, still filed 2026-07-26,
still zero progress — new `the-voice` content stays correctly
locked in the meantime. e2e-full's duration-ceiling breach is now
its **8th** consecutive red night (07-21 through 07-28) with
candidate #34 (shard the crawl) unpromoted 8 days after filing.

## Queues now

- `plan/AUDIT.md` Pending: 8 rows. 1 standing content-gaps row
  (Rule 2 drain, stalled per above — not actionable this window).
  2 HIGH (`the-voice` corruption 4.8; night-workflow starvation
  6.4 — now recurred once since filing). 1 MED (e2e-full breach
  5.4, 8th recurrence). 4 LOW single-tick fixes (`ship-content`
  mirror idempotency, `/ship-a-phase` close-trailer reliability,
  `YEAR_TENURE_RE` teen-number blind spot, themed-list category
  enum drift).
- `plan/PHASE_CANDIDATES.md`: 36 total candidates filed, 17
  pending promotion (one new since last digest — #36, the-voice
  remediation scope). Top three by score: #15 (9.4, show-canon
  completeness gate), #28 (8.7, stat-tile duplicate-value
  invariant), #25 (8.3, canon-rationale echo gate) — none
  promoted in 44 days.
- `plan/CRITIQUE.md`: pass 104, 2026-07-25 — 4 days stale, still
  within this file's own cadence.
- GitHub issues: `triage:needs-user` — 4 (#398, #399 both 48+
  days stale; #565 self-healing crash tracker, still recurring;
  #586 night-crash tracker, superseded by the fuller starvation
  root-cause row). `triage:loop-queued` — 1 (#636, the e2e-full
  mirror, updated again tonight). 0 unlabeled.

## Needs you

1. **Night-shift starvation recurred (HIGH, candidate #35,
   unpromoted).** One day after 07-27's digest named the fix,
   07-28's run got cancelled by the same march-eviction pattern.
   Tonight's success was luck, not a fix. Likely blocked from
   cloud (same `workflows` OAuth-scope gap as candidates #26/#34)
   — needs local/`/oversight`.
2. **e2e-full duration ceiling, 8th straight red night.** Candidate
   #34 (shard the crawl) has sat unpromoted 8 days. Every
   completed check still passes — pure scaling debt, not a
   quality regression, but effective coverage keeps eroding.
3. **`the-voice` content corruption (HIGH, filed 07-26, zero
   progress 3 days on).** 8 season files need a source-by-source
   Wikipedia/NBC re-verify, a possible file-count insertion, a
   frontmatter status fix (`hiatus`→`airing`), and two new seasons
   authored. Candidate #36 scopes it; too large and fabrication-
   risky for a same-tick autonomous patch.
4. **`triage:needs-user` issues #398/#399** — 48+ days stale, no
   apparent movement since filing 2026-06-11.
5. **Phase-candidate backlog unpromoted 44 days** — #15 (9.4) is
   the standout; #28 and #25 close behind.

## Today's intent

**Saga:** Rule 2 stays stalled until the next sweep (2026-08-02) or
a starred row's air date passes. Expect Rule 3 to keep absorbing
every content tick; watch the zero-ship rate (3 of the last 26
commits this window, per LISTS.md passes 28/32/33) as the 174-list
well gets harder to mine — if it climbs,
`/expand` should widen Rule 3's search space rather than let
extend-first grind on diminishing angles.

**Top non-content finding:** the night-shift starvation bug
(candidate #35) recurring one night after diagnosis is the clearest
signal yet that this needs an `/oversight` promotion, not another
digest tick hoping for a lucky queue window.

**Second-priority finding:** `the-voice` corruption — still live,
still reader-facing, still zero progress 3 days after filing.

## Tuning proposals

None new this tick. Both open workflow-file proposals (candidate
#34, shard e2e-full; candidate #35, decouple night.yml's
concurrency group) already carry current, escalating evidence and
remain the standing recommendations — #35 now has a second data
point (the 07-28 recurrence) reinforcing it, but the underlying
scope sketch is unchanged from 07-27's filing, so no new candidate
text is needed, just a note that it's overdue for promotion.

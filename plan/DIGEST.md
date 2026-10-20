# DIGEST — 2026-10-20

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Full recovery from the usage-cap outage — six clean march ticks
in the last 26h, plus a ledger-hygiene find.** The 4-day cap
outage flagged in yesterday's digest stayed resolved; every
scheduled tick since 2026-10-19 11:14:57Z landed a commit (6/6
success). The loop spent the recovery window on content-gap
redirect (Rule 2/3 both saturated most ticks) and one audit-ledger
sweep that caught a real bookkeeping bug: 39 `plan/CRITIQUE.md`
Pending rows had been "resolved" inline by content-gap-redirect
ticks since 2026-08-24 but never moved to `## Done` — found while
scoring the queue for `/iterate`, two spot-verified against live
content, swept whole. Pending findings now read 63 (down from a
stale 102). Deploy is green at HEAD (`0fd18e48`). `e2e-full`
flipped green last night (2026-10-20T01:35Z) after 10-19's red —
still the same alternating single-worker duration-ceiling story
(candidate #34), not a fix.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-19 17:08 | night | digest: 2026-10-19 (outage recap) |
| 10-19 18:35 | march | success — content: themed-list review batch, 5 overdue lists |
| 10-19 22:59 | march | success — content: themed-list review batch, 5 overdue lists |
| 10-20 01:35 | e2e-full | **success** — breadth crawl green after 10-19's red (candidate #34 unfixed, just completed in time) |
| 10-20 02:06 | march | success — content: themed-list review batch, 4 overdue lists |
| 10-20 07:30 | march | success — content: themed list zero-ship (Rule 2/3 both non-actionable) |
| 10-20 13:04 | march | success — audit: closed 39 orphaned-resolved CRITIQUE.md rows |
| 10-20 15:14 | night | this tick (digest) |

6 of 6 scheduled march windows in the period produced a commit —
a clean return to normal cadence after the prior outage.

## The saga

**Season-fill (Rule 2) / sweep:** CADENCE gap table holds at
**35 shows / 37 gap-slots**, all starred confirmed-but-unaired.
15th full weekly sweep ran 2026-10-19 (zero new gaps, every
starred row reconfirmed); next sweep due 2026-10-26. Show-add
stays LOCKED until the table reads zero.

**Rule 3 (themed-list extend/review):** three review batches
shipped this window (5 + 5 + 4 = 14 overdue lists refreshed
against the 90-day floor), then the floor hit saturation —
today's third tick found the review floor cleared one day short
(oldest remaining row 2026-07-23) and logged a zero-ship rather
than force a pick. Consistent with the standing dispatch-
starvation pattern (issue #758): Rule 2 and Rule 3 both
non-actionable most ticks right now, which is why today's
strongest tick redirected to ledger hygiene instead.

**Velocity vs. the three bearings rules:** fully recovered —
6/6 ticks shipped in the recovery window, same cadence as before
the outage. No new drain capacity opened (CADENCE unchanged),
so the loop correctly spent its cycles on review-batch refresh
and the audit-ledger fix rather than inventing work.

## Queues now

- **CADENCE gap table:** 37 shows/slots, unchanged since
  2026-10-14; next sweep not due until 2026-10-26.
- **plan/CRITIQUE.md:** last pass 188 (commit 80a52e1c,
  2026-10-13) — now **7 days stale**, one day worse than
  yesterday's report, still purely a dispatch-precedence effect
  (content-gap redirect keeps winning the tick). 63 genuinely
  open findings after today's 39-row cleanup (3 HIGH, 37 MED,
  23 LOW) — see "Today's intent" for the 3 HIGH.
- **plan/PHASE_CANDIDATES.md:** last pass 74 (commit 6d1d104e,
  2026-10-04) — now **16 days stale**, same cause. Candidate #34
  (shard e2e-full) remains the longest-unpromoted cloud-blocked
  item; candidate #29 (ledger file-size wall) gets fresh evidence
  below.
- **Open `triage:needs-user`:** 9 (unchanged). **`triage:loop-
  queued`:** 5 (unchanged). **Open unlabeled issues:** 0.
- **Ledger file sizes** (candidate #29, re-measured this tick):
  `plan/LISTS.md` 1.34MB, `plan/AUDIT.md` 1.30MB, `plan/CRITIQUE.md`
  **890KB, down from 2.3MB** — today's 39-row Done-section
  condensing (the orphaned-resolved sweep) shrank the file by
  1.4MB on its own, informal proof the archive-and-condense
  pattern candidate #29 proposes actually works once applied.
  `plan/CADENCE.md` 216KB, `plan/PHASE_CANDIDATES.md` 475KB. This
  digest's own `Read` call on `plan/AUDIT.md` (1.3MB) still failed
  outright against the 256KB tool ceiling — the same wall first
  confirmed at the 2026-10-04 and 2026-10-13 reinforcements, not a
  new mode, but still live on the one file nobody's condensed yet.

## Needs you

- **3 HIGH `plan/CRITIQUE.md` findings, oldest 7 days old:**
  (1) pass-177 RHONY "The Legacy Return" self-contradicts "eight
  seasons" vs. "eight years" for Carole Radziwill's absence on the
  same page (and the canon.md source itself disagrees with its own
  body two lines apart) — math backs "eight years," already leaked
  into a themed-list entry too; (2) pass-187 Bachelor "Grant Ellis"
  restates its two headline facts 3-5 times across nearly every
  section; (3) pass-188 Below Deck "Phuket" restates its headline
  fact 5 times plus a verbatim meta-description/lede duplicate.
  All three are straightforward content-only fixes already scoped
  with suggested fixes in the row text — good candidates for the
  next `/iterate` tick once Rule 2/3 next go non-actionable, or a
  direct oversight pick if you want them off the board sooner.
- **Candidate #34 (shard e2e-full)** still the standing highest-
  leverage `/oversight` action — the breadth crawl's green/red
  split (green 10-16, 10-20; red 10-17, 10-18, 10-19) is coin-flip
  variance around the same 75-minute wall, not stability.
- **Candidate #29 (ledger file-size wall)** just got its best
  evidence yet in the *other* direction: today's orphaned-row
  cleanup shrank `plan/CRITIQUE.md` from 2.3MB to 890KB simply by
  moving closed rows out of Pending-section prose — informal proof
  the archive/condense fix works. `plan/AUDIT.md` (1.3MB) hasn't
  had the equivalent pass and still fails a plain `Read` outright.
  Worth promoting now that the fix pattern is proven cheap, rather
  than waiting for a dedicated archive file.
- 9 open `triage:needs-user` / 5 `triage:loop-queued` issues,
  unreviewed since before the outage — still waiting on a
  `/triage` sweep.
- Deploy is green at HEAD (`0fd18e48`) — no action needed there.

## Today's intent

CADENCE and the Rule-3 review floor are both running dry at the
same time, which is exactly when the loop should default to the
3 open HIGH critique findings above (all content-only, all
pre-scoped) rather than another zero-ship or ledger-hygiene pass.
Top non-content finding: candidate #29 just got proof its own
proposed fix works (today's cleanup shrank CRITIQUE.md by 1.4MB)
— worth promoting rather than leaving it to accumulate more
reinforcement passes.

## Tuning proposals

One filed as a `plan/PHASE_CANDIDATES.md`-bound signal this tick
(not promoted — `/oversight` only):

1. **Reinforcing #29 (append-only ledger file-size wall) with
   proof the proposed fix is cheap and works.** Every prior
   reinforcement was evidence the problem is getting worse (file
   growth, SDK "prompt too long" crashes, the 256KB `Read`-tool
   ceiling first hit 2026-10-04). Today's orphaned-row cleanup
   commit (moving 39 stale `- resolved:` notes from `## Pending`
   to a condensed one-line `## Done` format) shrank
   `plan/CRITIQUE.md` from 2.3MB to 890KB as a side effect of
   ledger-integrity work, not a dedicated archive effort — this is
   the same mechanism candidate #29 proposes, done manually, on
   one file. `plan/AUDIT.md` (1.3MB, still fails a plain `Read`)
   is the obvious next candidate for the identical treatment.
   Worth promoting now rather than waiting for more reinforcement
   evidence — the fix pattern is proven cheap (one sweep, no code,
   no schema change) and the files keep growing in the meantime.

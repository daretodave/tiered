# DIGEST — 2026-10-02

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Five `march` ticks since last night's briefing, four clean and one
timeout (06:11–07:44 UTC, same class as issue #565 — SDK call hit
its 90-minute wall with no agent output, nothing to route). The
four clean ticks shipped a content-gap redirect (RHONY's pass-177
HIGH, closed same-day — see yesterday's briefing), a duplicate-
rationale fix (Amazing Race Family Edition), a Big Brother Season
28 finale-shift backfill (catalog's first new season since
yesterday), and critique pass 178 (2 MED, 0 HIGH). `e2e-full`
reverted to red overnight (02:00–03:18 UTC, 85.3% complete — 9,144
of 10,719 tests — the same duration-ceiling wall candidate #34
targets; last night's near-miss at 99.8% was the outlier, not a
trend). Deploy is ready at HEAD `4e9f4272`. Catalog holds at **68
shows / 1,058 seasons / 68 canons / 182 themes**.

One correction worth flagging: last night's "corrected" CRITIQUE.md
pending count of 55 undercounted again. A fresh header-level count
this tick (`### [SEV]` entries between `## Pending` and `## Done`)
finds **87 headed findings**, only 5 of which carry an in-place
resolved/closed marker — genuinely open is closer to **82** (1
HIGH, 51 MED, 30 LOW). The file itself is now **7,114 lines**, up
from 2,967 when candidate #29 (archive closed rows) was filed on
2026-07-09 — the exact bookkeeping-accuracy risk that candidate
named is compounding in real time. See Tuning proposals.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:20–16:05 (10-01) | e479b844, ffa844d9 | content (gap redirect) | RHONY `the-legacy-return` "eight seasons" vs. "eight years" fixed — closes pass-177 HIGH same-day |
| 20:29–21:23 (10-01) | 53485113, 031ec9a0 | content (gap redirect) | Amazing Race `family-edition` near-verbatim duplicate paragraph between season body and `canon.md` rationale — pass-178's precursor MED, closed |
| 00:13–01:11 | 66c10e74, aeccb6ff | content (finale-shift) | Big Brother Season 28 ("Time Trip") filed — frontmatter bumped 27→28, canon rebased rank 18, 10 `canonical_position` shifts; not a gap-table row, caught by the phase-39 finale gate |
| 02:00–03:18 | — | e2e-full (nightly) | **red** — 75-minute wall hit at 9,144/10,719 tests (85.3%), reverting last night's 99.8% near-miss; all completed checks passed, zero test-quality regression |
| 06:11–07:44 | — | march (timeout) | SDK call hit the action's 90-minute wall with zero turns of output after init — same pattern as issue #565, routed there automatically, nothing for `/iterate` to action |
| 13:10–13:20 | 4e9f4272 | critique | pass 178 — 2 findings (0 high, 2 medium, 0 low) |

4 of 5 `march` ticks shipped real work; 1 timed out with no output
(known SDK-prompt-growth class, not a new failure mode).

## The saga

**Rule 2 (season-fill drain):** still fully non-actionable by its
own gap table — every one of the 38 gap-table rows remains starred
confirmed-but-unaired. Big Brother Season 28 shipped anyway, but
through the separate phase-39 finale gate (the show's frontmatter
hadn't yet declared the season, so it was never a gap-table row).
Next weekly sweep due 2026-10-04.

**Content-gap redirects:** two same-day closures this window,
both following the established issue-#758 pattern — RHONY's
internally self-contradicting "eight seasons"/"eight years" (pass-
177 HIGH) and Amazing Race's duplicate rationale paragraph (a
precursor to pass-178, same single-fact-owner-drift defect class
fixed repeatedly across the catalog: ink-master, hells-kitchen,
90-day-fiance S12, survivor-51).

**Big Brother Season 28:** the first season filed since yesterday's
briefing, timed to the franchise's 1,000th episode. Spoiler
discipline held — twist mechanics and the milestone only, no
outcome named anywhere in the file or canon rationale. Note:
critique pass 178 immediately flagged this same page for restating
the 1,000th-episode fact five times across five fields — see
Queues now.

**e2e-full breadth watch:** back to red after one green night.
9,144/10,719 (85.3%) complete at the 75-minute wall — worse than
09-29's 86.1% and well off 09-30's 99.8% near-miss, confirming the
near-miss was the outlier the 09-30 digest already called it, not
a trend toward clearing the ceiling. Candidate #34 (shard the
crawl) now **72 days unpromoted** (filed 2026-07-22).

Catalog: **68 shows / 1,058 seasons / 68 canons / 182 themes** —
+1 season overnight (Big Brother S28); no new show (Rule 3 locked
behind the gap table), no new theme.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 178 (2026-10-02, commit
  4e9f4272), 2 new MED findings (0 HIGH, 0 LOW) — a five-way
  fact-repetition on the freshly-filed Big Brother S28 page, and a
  stale "Featured for September" badge on `/themes` now that
  October has started (third recurrence of this exact mechanism,
  closed twice before at pass-103 and pass-168). **Pending count:
  87 headed findings, ~82 genuinely open** (1 HIGH, 51 MED, 30 LOW)
  — see Headline correction; last night's "55" figure undercounted.
- **`plan/AUDIT.md`**: 8 open rows, unchanged in substance — 2 HIGH
  (`the-voice` factual corruption #762, frozen since 2026-08-08;
  the historical night.yml-starvation row, quiet since 09-07), 1
  standing MED (season-fill drain, 38/38, all starred), 1 MED
  (e2e-full duration-ceiling — back to red this tick, appended as
  a fresh update), 2 LOW (SERP description budget;
  `YEAR_TENURE_RE` teen-number gap), 1 LOW (heartbeat
  false-positive #806, no recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 73
  (2026-09-26) — 6 days since last, one past the loop's typical
  cadence. Candidate #34 (shard e2e-full) at **72 days unpromoted**
  with fresh red-run evidence; candidate #29 (archive closed
  ledger rows) at **85 days unpromoted** with fresh evidence of its
  own (see Headline).
- **Open `triage:needs-user`**: 9 issues, unchanged from yesterday
  — #762 (the-voice) remains the oldest live urgency.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues.**

## Needs you

1. **Candidate #29 (archive closed CRITIQUE.md/AUDIT.md rows) is
   85 days unpromoted and the risk it named is now visibly
   compounding** — the file has grown from 2,967 to 7,114 lines
   since filing, and this tick's own pending-count exercise
   rediscovered the undercounting problem the candidate predicted
   (two consecutive nights now got the count wrong using the same
   naive method). This is no longer a hypothetical read-ceiling
   risk; it's an active bookkeeping-accuracy defect recurring
   nightly.
2. **Candidate #34 (shard e2e-full) crossed 72 unpromoted days**,
   and tonight's run reverted to red at 85.3% complete after one
   green night — the alternating pattern continues with no
   structural fix landing. Still blocked on a workflow-file edit
   the cloud loop's token can't push.
3. **the-voice factual corruption (issue #762) is still going
   stale** — no comment since 2026-08-08, still the sole blocker
   keeping Rule 2 from ever reaching a fully-drained gap table even
   hypothetically.
4. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.

## Today's intent

Rule 2 stays fully starred until the 10-04 sweep, so expect the
next ticks to work CRITIQUE's queue — pass-178's two fresh MEDs
are both clean single-surface fixes (the Big Brother fact-owner
consolidation, the `/themes` featured-badge month rotation,
already a known three-time-recurring curation gap). Top non-content
signal: candidate #29's 85-day mark (Needs you #1) is now backed by
same-tick evidence of the exact defect it predicted — the clearest
`/oversight` pickup on the board, ahead even of candidate #34.

## Tuning proposals

No new candidates filed tonight — both live signals already have
filed, scored candidates (#29, #34) that this tick's pulse
reinforces with fresh evidence rather than needing a new filing.
Flagging both for `/oversight` promotion per Needs you #1 and #2;
neither should be re-filed or re-scored, just picked up.

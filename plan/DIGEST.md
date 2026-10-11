# DIGEST — 2026-10-11

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean 26h: five `march` ticks, five real outcomes, zero crashes,
zero no-ops — the cleanest window in recent memory. Rule 1a (weekly
sweep, due today) ran on schedule and found one genuine new gap
(`traitors` US S6, dated January 2027), pushing the CADENCE table to
38 shows / 40 gap-slots, still all starred. Rule 3 absorbed the rest
of the window with two findings-driven fixes (married-at-first-sight
pass-157 repetition, same-crown-new-price-tag title/blurb echo) plus
a fresh critique pass (187: 1 HIGH, 0 MED, 3 LOW). The one real
blemish sits outside the loop's own ticks: **the predicted `e2e-full`
breach landed** — seven straight green nights (10-04 through 10-10)
broke tonight at the 75-minute wall, 92.7% complete, same ceiling
candidate #34 (now 82 days unpromoted) has named since July. Deploy
is ready at HEAD `891b513e`. Catalog unchanged: **68 shows / 1,058
seasons / 68 canons / 182 themes.**

## While you were out

| time (UTC) | commit(s) | verb | outcome |
|---|---|---|---|
| 2026-10-10 16:22–17:11 | b70b4e58 | content (Rule 3) | rotated `/themes` featured trio, closed pass-178 staleness finding |
| 2026-10-10 20:18–21:18 | 68d60779, c8fc6b43 | content + audit (critique redirect) | fixed married-at-first-sight Seattle pull/canon repetition (pass-157), resolved the audit row |
| 2026-10-10 23:49–00:02 | 7ffa655d | critique (pass 187) | 4 findings — 1 HIGH (bachelor grant-ellis headline-fact restated 3-5x across nearly every section), 3 LOW |
| 2026-10-11 05:26–06:13 | a3e45b13 | sweep (Rule 1a) | 14th weekly sweep: 1 new gap (traitors US S6), gap table 39→40 |
| 2026-10-11 11:35–12:25 | 891b513e | content (Rule 3 fallback) | same-crown-new-price-tag rank-18 title/blurb echo fixed (within-entry headline-to-body echo, lax-mode `content:check` class) |

5 of 5 `march` ticks shipped real output. No crashes, no zero-ship
ticks this window — a contrast with the prior window's one `Prompt
is too long` crash (candidate #29, still unaddressed — see below).

## The saga

**Rule 2 (season-fill drain):** untouched directly, but Rule 1a's
weekly sweep ran on schedule today (due 2026-10-11, last ran
2026-10-04) and found the first new gap since 10-04: `traitors` (US)
Season 6, officially dated "January 2027" per TVLine. Gap table now
**38 shows / 40 gap-slots**, every slot starred confirmed-but-unaired
— the same stall pattern that's held since 09-20. Next sweep due
**2026-10-18**. `the-voice` remains the sole non-starred,
non-actionable row, blocked behind issue #762 since 2026-08-08 (now
64 days).

**Rule 3 (themed lists):** two fixes this window, both Rule 3
fallback picks rather than new entries — a critique-redirect fix
(married-at-first-sight, pass-157) and a lax-mode `content:check`
echo fix (same-crown-new-price-tag, rank 18) when no new themed-list
angle cleared the ~40% overlap ceiling. 182 lists total, unchanged.

**e2e-full breadth watch — the breach arrived.** The seven-night
green streak (2026-10-04 through 2026-10-10, last clocked 74m38s
against the 75-minute wall) ended tonight: run 38102237540 (started
01:33:33Z) hit the wall at 9,278/10,012 tests complete (92.7%), all
completed checks passing — not a regression, the same duration-
ceiling class tracked since 2026-07-21 (issue #636, now 55
occurrences logged). This is exactly the erosion the 2026-10-10
digest flagged as a risk ("margin is thinning, not widening")
materializing the very next scheduled run. Appended updates to both
`plan/AUDIT.md`'s e2e-full row and `plan/PHASE_CANDIDATES.md`
candidate #34 (now **82 days unpromoted**, the file's
longest-standing item) this tick — see Tuning proposals.

Catalog: **68 shows / 1,058 seasons / 68 canons / 182 themes** — no
change since last digest.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 187 (2026-10-11, commit
  7ffa655d), 4 new findings (1 HIGH, 0 MED, 3 LOW). The new HIGH —
  `/shows/bachelor/season/grant-ellis` restates its two headline
  facts ("second Black Bachelor," "fastest turnaround") across
  nearly every section on the page — is the most actionable pickup
  in the queue right now. ~100 headed findings total in the Pending
  section (~39 already carry `resolved:` notes awaiting a Done
  sweep; ~61 genuinely open: 2 HIGH, 36 MED, 23 LOW). The other open
  HIGH is still the oldest: `/shows/rhony/season/the-legacy-return`'s
  self-contradicting "eight seasons" vs. "eight years" (pass 177,
  still undrained).
- **`plan/AUDIT.md`**: 8 open rows (was 7 — the e2e-full breach
  update doesn't add a new row, count is unchanged in substance from
  yesterday). 2 HIGH (the-voice factual corruption #762, frozen since
  08-08, now 64 days; night.yml/march concurrency-starvation race,
  unpromoted since 07-27). 2 MED (season-fill drain standing row;
  e2e-full duration-ceiling, freshly updated this tick). 3 LOW (SERP
  description budget, `YEAR_TENURE_RE` teen-number gap, heartbeat
  false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 74
  (2026-10-04, commit 6d1d104e), now 7 days old. 23 candidates
  pending promotion, unchanged. Candidate #29 (archive closed ledger
  rows) is now **94 days unpromoted**, still the file's single
  oldest item by filing date. Candidate #34 (shard e2e-full) just
  reinforced this tick at **82 days** — now the most acute item by
  recency of evidence. Candidate #35 (decouple night.yml's
  concurrency group) at **76 days**.
- **Open `triage:needs-user`**: 9 issues, unchanged in count.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues.**
- **Deploy**: ready at HEAD `891b513e`.

## Needs you

1. **The e2e-full breach happened exactly as last night's digest
   warned.** Candidate #34 (shard the crawl) is 82 days unpromoted
   and the thing it would fix just broke a seven-night green streak.
   This is the sharpest standing item in the queue right now — not
   theoretical, dated evidence twice running (10-10's margin warning,
   10-11's actual breach).
2. **Candidate #29 (archive closed ledger rows) is 94 days
   unpromoted**, now the file's oldest item by filing date, and
   caused a real `Prompt is too long` crash as recently as 10-09
   (quiet since, but unfixed).
3. **The night.yml/march concurrency-starvation race (candidate #35)
   is 76 days unpromoted** — still quiet, still unfixed.
4. **the-voice factual corruption (issue #762) is still stale** — no
   movement since 2026-08-08 (64 days), the sole blocker keeping
   Rule 2's gap table from a hypothetically-full drain.
5. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11, now 122 days old) — worth a sweep
   alongside the items above if an `/oversight` session opens.

## Today's intent

Rule 1a's sweep just ran (due again 2026-10-18); expect Rule 3
fallback fixes or zero-ship research ticks on the content side until
the gap table un-stalls or a genuine new themed-list angle clears the
overlap ceiling. The most actionable content pickup is the fresh
pass-187 HIGH on `/shows/bachelor/season/grant-ellis` (headline-fact
restatement across nearly every section) — more severe in scope than
any currently-pending fact-restatement case, and newer than the still-
undrained rhony HIGH from pass 177. On the infra side: the e2e-full
ceiling just broke for real, not hypothetically — candidate #34 is
the most time-sensitive `/oversight` pickup in the queue, with
candidate #29's crash risk and candidate #35's quiet-but-unfixed race
close behind.

## Tuning proposals

Reinforced candidate #34 (`plan/PHASE_CANDIDATES.md`) with tonight's
e2e-full breach (run 38102237540, 92.7% complete at the 75-minute
wall) ending the seven-night green streak — appended matching update
notes to both the candidate and `plan/AUDIT.md`'s e2e-full row,
citing the 2026-10-10 digest's own prediction coming true one
scheduled run later. No gates, cadences, or ceilings edited directly.

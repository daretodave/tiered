# DIGEST — 2026-10-10

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A mostly clean 26h with one blemish: 4 of 5 `march` ticks shipped
real work or a clean no-finding pass; one (2026-10-09 23:56–00:36)
crashed on `Prompt is too long` — the exact failure mode candidate
#29 has tracked since 07-09, recurring for the first time in 8 days.
Rule 2 (season-fill) stayed fully starred all window — gap table
unchanged at 37 shows / 39 gap-slots, next sweep due tomorrow
(2026-10-11). Rule 3 absorbed the slack with one Big Brother Time
Trip tenure-year fix (27→26 years, closing a pass-185 MED finding)
and critique pass 186 (1 new MED finding, 0 HIGH, 0 LOW). `e2e-full`
extended its green streak to **seven straight nights**
(2026-10-04 through 2026-10-10), 74m38s against the 75-minute wall
— margin is thinning, not widening. Deploy is ready at HEAD
`ebd5a0ee`. Catalog unchanged: **68 shows / 1,058 seasons / 68
canons / 182 themes.**

## While you were out

| time (UTC) | commit(s) | verb | outcome |
|---|---|---|---|
| 2026-10-09 14:39–15:32 | 6bfa2c89, 1f3677b0 | content (Rule 3 extend) | `someone-else-held-the-chair-for-a-while` gained a rank-13 entry: AGT S21's Cowell-absence fact |
| 2026-10-09 17:14 | 6c67c09d | digest | 2026-10-09 briefing |
| 2026-10-09 20:41 | 15088611, 383a5dab | content (Rule 3 research, zero-ship) | both Rule 2 and Rule 3 exhausted; no candidate cleared the excellence gate this tick |
| 2026-10-09 23:56–00:36 | (none — crashed) | march (crashed) | `Prompt is too long` after 62 turns/~37min; auto-filed as a comment on issue #565 (candidate #29's tracking issue) |
| 2026-10-10 05:37–05:56 | 11713e5f | critique (pass 186) | 1 finding (0 HIGH, 1 MED, 0 LOW) — templated opening-sentence repetition on `built-for-one-playing-as-a-team` |
| 2026-10-10 11:22–12:06 | ebd5a0ee | content (critique redirect) | fixed pass-185's Big Brother Time Trip "27 years" → "26 years" tenure error |

4 of 5 `march` ticks completed with real output (3 shipped content/
critique work, 1 was a legitimate zero-ship research tick); 1
crashed before reaching the agent step.

## The saga

**Rule 2 (season-fill drain):** untouched this window — the 13th
full sweep ran 2026-10-04, next due **tomorrow** (2026-10-11). Gap
table holds at **37 shows / 39 gap-slots, all starred**
(confirmed-but-unaired), unchanged. `the-voice` remains the sole
non-starred, non-actionable row, blocked behind issue #762 since
2026-08-08 (63 days now).

**Rule 3 (themed lists):** zero-ship this window on the themed-list
front (10-09's research tick confirmed the review floor still not
due — 0 of 182 lists past 90 days). The window's only content
change was a one-field factual fix closing a prior critique finding,
not a new Rule-3 entry. 182 lists total, unchanged.

**e2e-full breadth watch:** green for **seven consecutive nights**
now (2026-10-04 through 2026-10-10), latest duration 74m38s against
the 75-minute wall — the margin that was "some, tight" at six
nights is now thinner, not safer; a sharding fix (candidate #34,
unpromoted 81 days) remains the structural answer if the streak
breaks again.

**The crash:** the 2026-10-09T23:56 `march` tick (run 38006815107)
died with `SDK execution error: Claude Code returned an error
result: Prompt is too long` after 62 turns and ~37 minutes
($4.86 spent). This is the identical crash class candidate #29 (now
93 days unpromoted) was filed against on 2026-07-09 — it recurred
daily through July/August, went quiet through September, and has
now resurfaced twice in the last 8 days (10-02, 10-09). The safety
net worked as designed: no commit landed, the next tick (05:37)
ran clean, and the crash auto-appended to issue #565 rather than
filing a duplicate. A reinforcement citing this occurrence plus
current file sizes (`CRITIQUE.md` 2.32MB, `AUDIT.md` 1.29MB,
`LISTS.md` 1.31MB, and now `PHASE_CANDIDATES.md` itself at 470KB)
was added to candidate #29 this tick — see `Tuning proposals`.

Catalog: **68 shows / 1,058 seasons / 68 canons / 182 themes** — no
change since last digest.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 186 (2026-10-10, commit
  11713e5f), 1 new finding (0 HIGH, 1 MED, 0 LOW) — `built-for-
  one-playing-as-a-team` has 6 of 12 entries opening on the same
  "[cast-count] [noun] [verb] [team noun]" sentence shape, 3
  landing consecutively at the top. 96 headed findings total in
  the Pending section (37 already carry `resolved:` notes awaiting
  a Done sweep; 59 genuinely open: 1 HIGH, 37 MED, 21 LOW — the
  Big Brother tenure MED resolved today was offset by pass 186's
  new MED, so the open count is unchanged from yesterday). The one
  open HIGH is still the oldest: `/shows/rhony/season/the-legacy-
  return`'s self-contradicting "eight seasons" vs. "eight years"
  (pass 177, still undrained).
- **`plan/AUDIT.md`**: 7 open rows, unchanged in count and
  substance. 2 HIGH (the-voice factual corruption #762, frozen
  since 08-08; night.yml/march concurrency-starvation race,
  unpromoted since 07-27). 2 MED (season-fill drain standing row;
  e2e-full duration-ceiling). 3 LOW (SERP description budget,
  `YEAR_TENURE_RE` teen-number gap, heartbeat false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 74
  (2026-10-04, commit 6d1d104e), now 6 days old. 23 candidates
  pending promotion, unchanged. Candidate #29 (archive closed
  ledger rows) now **93 days unpromoted** and freshly reinforced
  this tick with a real production-crash data point — still the
  file's longest-standing item. Candidate #34 (shard e2e-full) at
  **81 days**. Candidate #35 (decouple night.yml's concurrency
  group) at **75 days**.
- **Open `triage:needs-user`**: 9 issues, unchanged in count and
  substance.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues.**
- **Deploy**: ready at HEAD `ebd5a0ee`.

## Needs you

1. **Candidate #29 (archive closed ledger rows) is now 93 days
   unpromoted and just caused a real crash, not just a slow read.**
   The 10-09 23:56 tick lost 37 minutes and $4.86 to the exact
   `Prompt is too long` failure this candidate was filed against in
   July — quiet for two months, now recurring. The safety net
   caught it cleanly (no bad commit, next tick ran clean), but
   that's luck of timing, not a fix. This is the sharpest standing
   item in the queue.
2. **The night.yml/march concurrency-starvation race (candidate #35
   / AUDIT HIGH 6.4) is 75 days unpromoted** — still quiet, still
   unfixed.
3. **the-voice factual corruption (issue #762) is still stale** — no
   movement since 2026-08-08 (63 days), the sole blocker keeping
   Rule 2's gap table from a hypothetically-full drain.
4. **e2e-full's margin is eroding** — seven green nights running but
   the latest clocked 74m38s against a 75-minute wall. If duration
   keeps creeping, candidate #34 (sharding, 81 days unpromoted)
   stops being optional.
5. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11, now 121 days old) — worth a sweep
   alongside the items above if an `/oversight` session opens.

## Today's intent

Rule 2 stays fully starred until tomorrow's sweep (2026-10-11) —
expect continued Rule 3 pressure or zero-ship research ticks until
then. The most actionable pickup for the next content-gap or
`/iterate` tick is the older, higher-severity `/shows/rhony` HIGH
("eight seasons" vs. "eight years," pass 177, still undrained) —
the Big Brother tenure fix that would have been the obvious pick
shipped this window already. On the infra side: the e2e-full streak
is now seven nights but tighter than before (74m38s vs. the
65–76-minute range reported yesterday), and last night's march
crash is fresh, dated evidence that candidate #29 is not just
theoretical file-size arithmetic anymore — both are worth an
`/oversight` look before the next breach or crash, not after.

## Tuning proposals

Reinforced candidate #29 (`plan/PHASE_CANDIDATES.md`) with the
2026-10-09T23:56 crash occurrence and current file sizes for all
four append-only ledgers (`CRITIQUE.md`, `AUDIT.md`, `LISTS.md`,
`PHASE_CANDIDATES.md` itself) — committed this tick, no other
tuning proposals filed. No gates, cadences, or ceilings edited
directly.

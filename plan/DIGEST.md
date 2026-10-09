# DIGEST — 2026-10-09

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, productive 26h — 5 of 5 `march` ticks shipped real work,
zero no-ops, zero crashes. Rule 2 (season-fill) stayed fully
starred the entire window — gap table unchanged at 37 shows / 39
gap-slots, next sweep due 2026-10-11. Rule 3 absorbed the slack
exactly as designed: 2 themed-list extends (Big Brother S28 onto
`every-summer-gets-its-own-twist`; AGT S21 onto `someone-else-
held-the-chair-for-a-while`), plus one small mechanical content fix
earlier in the window. One critique pass (185, 1 MED finding) ran
clean. `e2e-full` just closed its **sixth straight green night**
(2026-10-04 through 2026-10-09) — the longest clean streak since
candidate #34 (duration-ceiling) was filed 80 days ago; logged as a
progress note on the matching `plan/AUDIT.md` row. Deploy is ready
at HEAD `1f3677b0`. Catalog unchanged: **68 shows / 1,058 seasons /
68 canons / 182 themes.**

## While you were out

| time (UTC) | commit(s) | verb | outcome |
|---|---|---|---|
| 2026-10-08 14:56–15:46 | 9d9f1173, c448cefe | content (critique redirect) | fixed stale "Ten seasons" count on `same-crown-new-price-tag`'s `featured_pull` (pass-184 HIGH, resolved) |
| 2026-10-08 20:38–21:38 | b38dbddd, b2c47325 | content (Rule 3 zero-ship, redirect) | Rule 2/3 both exhausted; fixed a within-entry title/blurb echo on `running-long-running-short` #18 instead |
| 2026-10-09 00:40–01:33 | 219bbd4e, fb041cff | content (Rule 3 extend) | `every-summer-gets-its-own-twist` gained a rank-6 entry: Big Brother S28's Time Capsule mechanic |
| 2026-10-09 07:17–07:33 | 3e7a9117 | critique (pass 185) | 1 finding (0 HIGH, 1 MED, 0 LOW) |
| 2026-10-09 14:39–15:32 | 6bfa2c89, 1f3677b0 | content (Rule 3 extend) | `someone-else-held-the-chair-for-a-while` gained a rank-13 entry: AGT S21's Cowell-absence fact |

5 of 5 `march` ticks completed successfully, all shipping real
work — zero no-ops, zero crashes this window.

## The saga

**Rule 2 (season-fill drain):** untouched this window — the 13th
full sweep ran 2026-10-04, next due 2026-10-11 (2 days out). Gap
table holds at **37 shows / 39 gap-slots, all starred**
(confirmed-but-unaired), unchanged. `the-voice` remains the sole
non-starred, non-actionable row, blocked behind issue #762 since
2026-08-08 (62 days now).

**Rule 3 (themed lists):** 2 extends this window (`every-summer-
gets-its-own-twist`, `someone-else-held-the-chair-for-a-while`),
each clearing the zero-prior-hits excellence gate against the
182-list ledger. Zero lists are past the 90-day review floor
right now, so the queue isn't starved — Rule 3 is simply doing
the job Rule 2's dormancy hands it. 182 lists total, unchanged
(extends add entries to existing files, not new ones).

**e2e-full breadth watch:** green for six consecutive nights
(2026-10-04 through 2026-10-09), durations 65–76 minutes against
the 75-minute wall — some margin, some tight. This is the longest
clean streak logged against candidate #34 since its 2026-07-21
filing; appended as a progress note to the matching `plan/AUDIT.md`
row (data only, not a resolution — the structural sharding fix is
still unshipped and the last breach was only 6 nights ago).

Catalog: **68 shows / 1,058 seasons / 68 canons / 182 themes** — no
change since last digest.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 185 (2026-10-09, commit
  fb041cff), 1 new finding (0 HIGH, 1 MED, 0 LOW) — Big Brother's
  Time Trip `pull` field says "27 years of history" but
  `est_year: 2000` → 2026 is 26 years, not 27 (still open, one-field
  fix). 95 headed findings total in the Pending section (36 already
  carry `resolved:` notes awaiting a Done sweep — the un-swept
  bookkeeping debt candidate #29 would fix; 59 genuinely open: 1
  HIGH, 37 MED, 21 LOW). The one open HIGH is older: `/shows/rhony/
  season/the-legacy-return`'s self-contradicting "eight seasons" vs.
  "eight years" for Carole Radziwill's absence (pass 177, still
  undrained).
- **`plan/AUDIT.md`**: 7 open rows, unchanged in count. 2 HIGH (the-
  voice factual corruption #762, frozen since 08-08; night.yml/march
  concurrency-starvation race, quiet but unpromoted since 07-27 —
  the file's highest-scoring open row at 6.4). 2 MED (season-fill
  drain standing row; e2e-full duration-ceiling — updated this tick
  with the six-night streak). 3 LOW (SERP description budget,
  `YEAR_TENURE_RE` teen-number gap, heartbeat false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 74
  (2026-10-04, commit 6d1d104e), now 5 days old. 23 candidates
  pending promotion, unchanged. Candidate #29 (archive closed ledger
  rows) at **92 days** unpromoted — still the file's longest-
  standing item. Candidate #34 (shard e2e-full) at **80 days**.
  Candidate #35 (decouple night.yml's concurrency group) at **74
  days**.
- **Open `triage:needs-user`**: 9 issues, unchanged in count and
  substance.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues.**
- **Deploy**: ready at HEAD `1f3677b0`.

## Needs you

1. **Candidate #29 (archive closed ledger rows) is still the
   sharpest standing item — now 92 days unpromoted.** Tonight's own
   digest tick again had to grep around `plan/CRITIQUE.md` and
   `plan/AUDIT.md` rather than read them plainly; the pass-184 HIGH
   resolved two nights ago is a fresh example of the gap this
   candidate would close — resolved in substance, still counted as
   "Pending" until a human-run sweep moves it.
2. **The night.yml/march concurrency-starvation race (candidate #35
   / AUDIT HIGH 6.4) is 74 days unpromoted** — quiet lately (no
   fresh occurrence logged), but the underlying race is unfixed, not
   resolved.
3. **the-voice factual corruption (issue #762) is still stale** — no
   movement since 2026-08-08 (62 days), the sole blocker keeping
   Rule 2's gap table from a hypothetically-full drain.
4. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11, now 120 days old) — worth a sweep
   alongside the items above if an `/oversight` session opens.
5. Four CRITIQUE `[needs-user-call]` rows (home mobile catalog
   weight, `/shows` B-tier sub-structure, `/themes` stat-chip label,
   `/u/[handle]` own-profile scaffold) remain correctly parked —
   each already documents why the loop can't resolve it
   unilaterally.

## Today's intent

Rule 2 stays fully starred until the next sweep (due 2026-10-11, 2
days out) — expect continued Rule 3 extends until then. The most
actionable pickup for the next content-gap or `/iterate` tick is a
one-field mechanical fix with no judgment call attached: either
this tick's own pass-185 MED (Big Brother's "27 years" → "26
years") or the older, higher-severity `/shows/rhony` HIGH
("eight seasons" vs. "eight years," pass 177, still undrained).
The e2e-full six-night green streak is worth one more cycle of
watching before treating candidate #34 as anything but "holding for
now" — the margin under the wall (as little as ~3 minutes on some
nights) means the next catalog-growth tick could re-breach it.

## Tuning proposals

None this tick. Rule 2's dormancy reflects a genuinely all-starred
gap table, not starvation; Rule 3 is absorbing the slack as
designed; critique/audit/triage queues are moving at normal pace.
No new mistuning signal surfaced. Appended a progress note to
`plan/AUDIT.md`'s e2e-full duration-ceiling row (candidate #34)
logging the six-night green streak — data only, no promotion.

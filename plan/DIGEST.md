# DIGEST — 2026-10-12

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Four `march` ticks in the last 26h, all green, two seasons drained
(rhop S11, below-deck S13), deploy ready at HEAD `92d69ba7`. The one
blemish: the nightly breadth crawl just went red for the **second
night running** — same 75-minute single-worker wall as every prior
occurrence, zero actual test failures. Candidate #34 (shard the
crawl) is now unpromoted **83 days**, still the file's
longest-standing item. Catalog: **68 shows / 1,060 seasons / 182
themes** (+2 seasons since last digest).

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-11 20:52→21:48 | march | Rule 3 review tick — zero-ship, no themed-list concept cleared the excellence gate (`150a0a23`) |
| 10-12 00:23→01:29 | march | no-op — nothing actionable this tick |
| 10-12 06:31→07:21 | march | content: rhop Season 11 drained + canon rebase (`9eeec78b`, `6c5a7f37`) |
| 10-12 16:06→17:00 | march | content: Below Deck Season 13 drained + canon rebase (`717cc0b7`, `92d69ba7`) |

4 of 4 ticks shipped or zero-shipped cleanly. No crashes.

## The saga

- **Seasons drained today:** 2 — rhop S11 (Karen Huger era,
  provisional pre-finale rank) and below-deck S13 (Phuket/Azul V,
  also provisional), both filed same-day as their real-world
  premieres. Both pre-season/format-only per spoiler discipline;
  below-deck's episode count correctly omitted rather than guessed
  since no primary source had confirmed it yet.
- **Gap table:** 40 (per the 10-11 weekly sweep) → 39 (rhop drain)
  → **38** (below-deck drain, a second same-day drain tick) — see
  `plan/CADENCE.md` lines 27-61 for both drain notes. The file's
  own sweep-log table still shows the intermediate "39" row; the
  detailed drain notes above it are the source of truth per the
  file's header, so this is cosmetic lag, not a data conflict.
- **Shows scaffolded:** 0 — show-add clock stays LOCKED (gap table
  non-zero).
- **Velocity vs. the three bearings rules:** Rule 2 produced two
  opportunistic same-day-premiere drains rather than a sweep-driven
  batch — consistent with the pattern since the 07-12 pivot. Rule 3
  ran once (10-11 21:52) and zero-shipped cleanly against the
  excellence gate — the gate working as designed, not starvation.
  Next weekly sweep due **2026-10-18**.

## Queues now

- **`plan/CRITIQUE.md`**: last pass **187** (same day as issue #821
  below). Pending section: 8 unresolved rows (1 is the file's own
  template placeholder), all LOW/MED, nearly all tagged
  `needs-user-call` — long-stable, no urgency. The rhony pass-177
  "eight seasons vs. eight years" HIGH some earlier notes flagged
  is already resolved (2026-10-01) and closed.
- **`plan/AUDIT.md`**: 8 open rows, unchanged in count — 2 HIGH
  (the-voice factual corruption #762, frozen since 08-08, now 65
  days; night.yml/march concurrency-starvation race #763, unpromoted
  since 07-27), 1 MED (e2e-full duration-ceiling — updated this tick
  with tonight's second breach), 2 LOW/needs-user-call content calls
  (Naked and Afraid numbering offset, The Apprentice S5 location
  framing), 1 LOW (themed-list SERP-description budget, parked for
  oversight), 1 LOW (`YEAR_TENURE_RE` teen-number gap), 1 LOW
  (heartbeat false-positive hardening, issue #806).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass **74**
  (2026-10-04, 0 new candidates — all signal was a duplicate of an
  already-reinforced row). This file is itself now 7,432 lines /
  464KB — the fourth append-only ledger approaching the 256KB
  single-`Read` wall candidate #29 was filed to fix for the other
  three (`plan/CRITIQUE.md` 7,524 lines/2.3MB, `plan/AUDIT.md`
  705 lines/1.3MB — both still over that wall tonight, confirmed
  first-hand: this tick's own attempts to `Read` both files outright
  failed on size/token limits, same as every reinforcement since
  07-09). #29 was reinforced 2 nights ago (10-10) with near-identical
  numbers — skipping a third same-week reinforcement on no material
  growth, per the same "don't restate flat evidence" logic pass-74
  applied elsewhere. Oldest standing unpromoted: #29 (93 days, 07-09)
  and #34 (83 days, 07-21, updated this tick) and #35 (77 days,
  07-27) — all three genuinely blocked on a local/`/oversight`
  session (workflow-file pushes need a `workflows` OAuth scope the
  cloud loop's token doesn't carry; #29 is pure file hygiene but sits
  behind the same backlog).
- **Triage:** 9 open `triage:needs-user` issues (#817, #777, #763,
  #762, #758, #586, #399, #398, #565) — several are stale "night
  digest crashed" / "cloud march crashed" one-offs from June-August
  with no recurrence since filing, likely closeable on sight. 5 open
  `triage:loop-queued` issues, nothing new blocking.

## Needs you

1. **e2e-full breadth crawl, two consecutive red nights (10-11,
   10-12).** Same single-worker 75-minute wall both times, zero
   actual test failures. Candidate #34 (shard the crawl) is
   unpromoted 83 days after filing — still the sharpest standing
   `/oversight` recommendation in the queue, and the gap between
   occurrences keeps shrinking (back-to-back now, vs. the prior
   mixed-week pattern).
2. **Three ledger files sit past the 256KB single-`Read` wall**
   (`plan/CRITIQUE.md`, `plan/AUDIT.md`, and now `plan/
   PHASE_CANDIDATES.md` itself) — candidate #29 (archive closed
   rows) is 93 days unpromoted and this tick hit the exact failure
   first-hand while gathering the pulse above. Worth pairing with
   #34/#35 at the next session since all three share the same
   `workflows`-OAuth-scope-or-file-hygiene blocker class.
3. **The-voice factual corruption (issue #762)** and **night.yml
   concurrency race (issue #763)** remain `triage:needs-user`, no
   movement this window.
4. **9-issue `triage:needs-user` backlog** — several (#398, #399,
   #565, #586) are crash one-offs from June/July with no recurrence
   since filing; likely safe to close on sight at the next session.

## Today's intent

- **Saga:** gap table sits at 38, next sweep not due until
  2026-10-18 — expect march to keep picking off same-day premiere
  drains opportunistically (today's pattern) rather than a
  sweep-driven batch until then.
- **Top non-content finding:** issue **#821** (Bachelor S29 / Grant
  Ellis, HIGH, `loop:opened`, filed today via CRITIQUE pass-187) —
  four facts (second Black Bachelor, fastest contestant-to-lead
  turnaround, nine episodes, the Edinburgh stop) restated across
  nearly every section of the season page, the worst-scoped case of
  this recurring pattern yet. Already queued for the dispatcher; no
  action needed from this tick.

## Tuning proposals

No new candidates filed. Appended tonight's second-red-night data
point directly to `plan/AUDIT.md`'s standing e2e-full row and to
candidate #34 in `plan/PHASE_CANDIDATES.md` (the established
pattern for this recurring finding). Declined to re-reinforce
candidate #29 (ledger file-size wall) despite hitting the exact
failure first-hand tonight — it was already reinforced 2 nights ago
with near-identical numbers; no new information to add beyond what
"Needs you" #2 above already restates. No gates, cadences, or
ceilings edited directly.

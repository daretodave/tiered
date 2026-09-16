# DIGEST — 2026-09-16

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Quiet, clean window on the content side — 6 tracked `march` ticks
since yesterday's digest (15:17 09-15 through 12:32 09-16, ~21h),
all green, one genuine no-op. Rule 2 stayed fully locked (CADENCE
gap table at 39 shows / 40 gap-slots, all starred confirmed-but-
unaired) and Rule 3 shipped a themed list staking the already-filed
Alone Australia S4 rather than drain new ground. A stale-ledger fix
landed too: `plan/CRITIQUE.md`'s Pending section was found carrying
24 already-resolved findings (including all 6 open HIGH rows) that
were never moved to Done — re-verified and archived, 70→46 Pending,
0 HIGH remaining. Critique pass 161 ran clean (0 console errors, 0
spoiler leaks). The one open story, now more urgent: `e2e-full`
breached its 75-minute wall for a **seventh consecutive night**, the
longest unbroken streak this row has recorded, and for the first
time the test catalog held perfectly flat across three straight
nights (10,602 tests, 09-14 through 09-16) — meaning the wall is no
longer chasing content growth, it's a pure single-worker throughput
ceiling. Candidate #34 (shard the crawl) is now 57 days unpromoted.
Deploy is ready at HEAD (52a5532f).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:16–18:06 | ab99ff14 / e7698ab8 | content / audit | themed-list — Rule 3 stakes the freshly-filed Alone Australia S4 season instead of a blind concept search |
| 20:25–21:10 | e227ce3e / cf50047f | fix / audit | a11y — show-page season/theme card titles promoted h4→h3, resolves pass-159 finding |
| 23:10–23:27 | 2cb0cf96 | critique | pass 161 — 2 new findings (0 high, 1 med, 1 low), site reads clean on spoilers/console/mobile-overflow |
| 01:38–02:34 | 1758b8d7 | audit | `CRITIQUE.md` bookkeeping — 24 stale-resolved Pending rows (incl. all 6 open HIGH) re-verified and moved to Done, 70→46 |
| 06:48–06:56 | — | (no-op) | tick found nothing actionable across the dispatch order; ended cleanly, no commit |
| 12:32–13:20 | aa4b08bf / 52a5532f | content / audit | voice fix — bake-off weekly community-vote question, resolves pass-147 finding |

6 of 6 tracked runs completed cleanly; 5 shipped, 1 logged a genuine
no-op. No crashes this window.

## The saga

**Rule 2 (season-fill drain):** locked the entire window. CADENCE
gap table held flat at **39 shows carrying a gap / 40 gap-slots**,
every row starred confirmed-but-unaired since the 2026-09-13 tenth
full weekly sweep (next sweep due 2026-09-20). One near-term trigger
worth flagging: `masterchef` (US) S16's finale Part 2 is confirmed
for **2026-09-17 — tomorrow** — the gate should fire on the very
next Rule 2 pick after it airs.

**Rule 3 (themed lists):** shipped once this window — rather than
run a fourth blind concept search after three same-day rejections,
the tick staked a themed list around Alone Australia's already-filed
Season 4 (Sápmi/Finland), the "freshly-filed-season" fallback pattern
this loop has used before when both rules run dry. Catalog holds flat
at **68 shows / 1,052 seasons / 68 canons / 182 themes** — no new
season or theme, but real content motion via the list.

**Ledger hygiene (unplanned but high-value):** the 06:41-class tick
that would normally log a Rule 2/3 zero-ship instead found
`plan/CRITIQUE.md`'s own Pending queue corrupted — 24 of 70 findings
carried an inline "RESOLVED (...)" annotation but were never moved to
Done, including all 6 open HIGH-severity rows. Each was independently
re-verified against live code/content before archiving. This is
exactly the drift candidate #29 (archive closed ledger rows) has been
naming since 07-09 — a manual one-off fix bought real breathing room
this tick, though the structural automation candidate #29 proposes
is still what prevents the next recurrence.

Net: for the third straight window, the loop is finding real work
(a11y fix, ledger cleanup, voice fix, themed list) even when both
content rules are locked — the critique-redirect and ledger-hygiene
paths are doing the job Rule 2/3 can't right now.

## Queues now

- **`plan/CRITIQUE.md`**: pass 161 (2026-09-15 23:24, commit
  2cb0cf96). Pending section now genuinely clean after tonight's
  archival: **46 headings, all real** (0 HIGH / 27 MED / 19 LOW) —
  the 69-vs-44 drift flagged in the last two digests is resolved for
  now. File itself is unchanged in size (~2.1MB, rows moved not
  deleted) — still too large for a direct `Read`, `grep` remains the
  only safe access path.
- **`plan/AUDIT.md`**: ~1.2MB, 7 Pending rows: 2 HIGH (the-voice
  factual corruption #762; night.yml starvation #763, mirrors
  candidate #35 — no new occurrence, 5 clean nights running), 2 MED
  (season-fill drain, continuously reconfirmed; e2e-full duration-
  ceiling — seventh breach night logged tonight), 3 LOW (SERP
  description budget; `YEAR_TENURE_RE` regex gap; heartbeat
  false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: ~29 candidates awaiting promotion,
  no new candidate filed this window. Candidate #34 (shard e2e-full)
  — 57 days unpromoted, seventh consecutive red night, now caught up
  with 09-13 through 09-16 detail. Candidate #35 (decouple night.yml)
  — no new occurrence, 5 consecutive clean nights. Candidate #29
  (archive closed ledger rows) — 68+ days unpromoted; tonight's
  manual `CRITIQUE.md` cleanup is direct evidence the underlying
  problem is real, even though it bought temporary relief.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 (the-voice)
  and #763 (night-starvation) remain the two live ones needing an
  actual decision, untouched since 2026-08-08 (39 days).
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up three
  more "Recurred" comments tonight (now 48 total).

## Needs you

1. **Candidate #34 (shard e2e-full) is now 57 days unpromoted, seven
   consecutive red nights — the longest unbroken streak yet, and the
   test catalog has stopped growing (flat at 10,602 for three straight
   nights).** That last point matters: this was always framed as "the
   ceiling erodes as the catalog grows," but three flat nights still
   breaching means it's now purely a single-worker throughput problem
   at the current catalog size — sharding is a durable fix, not a
   stopgap against more growth. This remains a `.github/workflows/e2e-full.yml`
   edit the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — only a local/`/oversight` session can promote it.
2. **the-voice factual corruption (issue #762) — S30 premieres in 5
   days (2026-09-21, NBC).** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix; live frontmatter still
   reads `status: hiatus` with a "the show has ended" framing that
   scout-verified research says is false.
3. **Candidate #29 (archive closed CRITIQUE.md/AUDIT.md rows)** — the
   underlying drift is now confirmed a second time by a real
   incident: tonight's tick found 24 stale-resolved findings
   (including all 6 open HIGH rows) sitting in Pending instead of
   Done. Manually fixed this time, but the recurrence is exactly what
   the automation this candidate proposes would prevent going
   forward.
4. **Night.yml (candidate #35) has now run clean five nights running**
   — the opposite of urgent. If this holds, #35 can keep deferring
   in favor of #34/#29.

## Today's intent

Rule 2 stays locked until either the 2026-09-20 sweep or the
`masterchef` S16 finale lands **tomorrow, 2026-09-17** — that's the
next concrete Rule 2 trigger to watch for, and it's close enough that
the next tick or two should pick it up directly. Rule 3 will likely
keep leaning on the freshly-filed-season fallback or a critique/
ledger redirect when both rules are dry, which is fine as long as
there's real work to redirect to. Top non-content finding, sharpened
tonight: candidate #34 at 57 days unpromoted, seven consecutive red
nights, and now provably a pure throughput ceiling rather than a
growth-chasing one — still needing an `/oversight` decision.

## Tuning proposals

No new candidates filed tonight. Reinforcing evidence added to two
already-open candidates (both edits landed in this digest commit):

- **Candidate #34** (shard e2e-full): appended 09-13 through 09-16
  detail to both `plan/AUDIT.md` and `plan/PHASE_CANDIDATES.md` —
  seventh consecutive breach night, and the first time the catalog
  held flat (10,602) across three nights while still breaching,
  isolating the ceiling as a pure throughput problem.
- **Candidate #29** (archive closed ledger rows): tonight's
  `CRITIQUE.md` bookkeeping fix (70→46 Pending, 24 stale rows
  archived) is a second, independent, real-incident confirmation of
  the drift this candidate was filed to prevent structurally.

No gate mistuning observed otherwise — Rule 2/3 correctly recognized
their own stall, and the loop found genuine non-content work (ledger
hygiene, a11y, voice) instead of forcing a mediocre list or a
no-op streak.

# DIGEST — 2026-09-24

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A mixed day: 6 of 8 tracked `march` ticks shipped real work — one
critique pass (169, 5 findings, 0 high), two content-gap redirect
fixes (naked-and-afraid repetition, survivor season-50 fact
restatement), and the americas-got-talent season 21 finale-shift
note. Two ticks crashed zero-ship (docker registry rate-limit on
the Supabase Postgres image pull; a mid-tick action timeout) — both
routed by the safety net to the standing issue #565 thread, neither
a code defect. The nightly `e2e-full` breadth crawl went **red**
again (2026-09-24T01:05Z) — the same duration-ceiling breach
tracked since 2026-07-21 (candidate #34), now **65 days
unpromoted**. Rule 2 stays locked at 44 starred gap-slots — nothing
actionable to drain. Catalog holds flat at 68 shows / 1,052 seasons
/ 182 themes. Deploy is ready at HEAD (05901e4c).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:10 (09-23) | 29bfcc3e | digest | 2026-09-23 briefing |
| 15:33–16:20 (09-23) | 274e06cc, 5cb1805c | content + audit | naked-and-afraid the-active-season repetition fix |
| 19:13–19:14 (09-23) | — | march (crash) | docker registry rate-limit pulling `ghcr.io/supabase/postgres` — zero-ship, filed to issue #565 |
| 22:26–22:38 (09-23) | 2bce4a86 | critique | pass 169 — 5 findings (0 high, 5 medium) |
| 00:52–01:35 (09-24) | 3ca6320b, ed9c221a | content + audit | americas-got-talent season 21 finale-shift note |
| 01:05 (09-24) | — | e2e-full (nightly) | **red** — 75-min wall again, 8,836/10,603 (83.3%) complete, all passing |
| 06:00–06:46 (09-24) | aa8d97f0, 05901e4c | content + audit | survivor season 50 fact-restatement fix |
| 12:11–13:44 (09-24) | — | march (crash) | action timed out mid-tick — zero-ship, filed to issue #565 |

6 of 8 tracked `march` ticks shipped real work; 2 crashed with no
code touched. Both crashes auto-filed to the existing issue #565
thread rather than opening duplicates — the safety net working as
designed. Neither crash shares a root cause with the other (infra
rate-limit vs. a generic action timeout), but both fall in the same
"long/flaky cloud tick, nothing to fix in the product" bucket #565
already tracks.

## The saga

**Rule 2 (season-fill drain):** unchanged since 09-20's sweep — gap
table holds at **44 slots**, every row starred confirmed-but-unaired
(the americas-got-talent S21 finale-shift needed no new season file
or gap-table change — the season was already filed pre-finale). No
sweep due this window (weekly cadence, last ran 09-20, next due
09-27).

**Rule 3 (themed lists):** no ship this window; no commit touched
`content/themes/`. Catalog holds at 182 themes.

**The content-gaps redirect fallback carried the entire content
side of the window.** Both ships (naked-and-afraid repetition fix,
survivor season-50 fact restatement) were small drift fixes rather
than new seasons or lists — the same pattern as every recent night
while both Rule 2 and Rule 3 sit idle. Catalog holds flat at **68
shows / 1,052 seasons / 68 canons / 182 themes**.

## Queues now

- **`plan/CRITIQUE.md`**: pass 169 (2026-09-23, commit 2bce4a86), 5
  findings (0 HIGH, 5 MED). 8 Pending rows total in the file, all
  tagged `[needs-user-call]` or awaiting an editorial/architecture
  call — the mobile home catalog list, `/shows` desktop + mobile
  browse structure, `/themes` chip-label ambiguity, `/u/e2e`
  own-profile scaffold, `/shows/dragrace` + adjacent themes cache
  headers, two themed-list over-concentration notes. File too large
  for a direct `Read`; grep remains the only safe access path.
- **`plan/AUDIT.md`**: 7 real Pending rows (8 counting the row
  template), unchanged in substance from yesterday: 1 standing MED
  (season-fill drain, 44 slots all-starred), 2 HIGH (the-voice
  factual corruption #762, frozen since 2026-08-08; night.yml
  concurrency starvation, candidate #35, quiet since 09-07), 1 MED
  (e2e-full duration-ceiling, candidate #34, red again tonight —
  updated this tick), 2 LOW (SERP description budget;
  `YEAR_TENURE_RE` teen-number gap), 1 LOW (heartbeat
  false-positive #806, no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: no `/expand` pass this window.
  ~21 numbered candidates still sit "awaiting promotion." Candidate
  #34 (shard e2e-full) is now **65 days unpromoted**, still the
  file's longest-lived open item.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) remains the oldest live urgency.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 65 unpromoted days.**
   Tonight's run went red again (10,603 tests now vs. 7,138 when
   the 75-minute ceiling was set) — the alternating breach/green
   pattern continues with no trend, still blocked on a
   `.github/workflows/e2e-full.yml` edit the cloud loop cannot push
   (lacks `workflows` OAuth scope). Single strongest case for the
   next `/oversight` session.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08; `content/shows/the-voice.md`
   still carries the corrupted seasons 22-29 and the false
   "show has ended" framing. Needs a human-reviewed 8-file fix —
   can't ship from the loop.
3. **8 open `triage:needs-user` issues**, several stale (oldest:
   #777 night-digest crash from 2026-08-16, #398/#399 from
   2026-06-11). Worth a sweep to close what's since been superseded
   by later fixes.

## Today's intent

Rule 2 stays locked at 44 starred slots; expect the content-gaps
redirect fallback to keep catching small drift issues until the
next weekly sweep (due 09-27) turns up a real actionable gap, or a
starred item airs. Top non-content finding: candidate #34's
65-day-unpromoted status on a chronic, cloud-unfixable e2e timeout
— still the strongest standing case for the next `/oversight`
session, just ahead of issue #762's stale-but-urgent the-voice fix.

## Tuning proposals

None filed tonight. No fresh mistuned gate observed — the two
crashed ticks both route to the already-tracked #565 crash class
rather than a new pattern; the content-gaps fallback continues
working as designed with no starvation symptom.

# DIGEST — 2026-11-07

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A busy ~17 hours — spec 48 drained to zero, two critique passes,
spec 49 chunked, and a candidate promoted clean into spec 50.**
Since last digest (`3101859c`, 2026-11-06 17:41Z): a critique pass
(197, 18:47Z — 2 findings, 1 med + 1 low) kicked things off, then
four of spec 48's stat-tile caption guards landed back to back —
`48.1` filming_caption (bare-location restatement), `48.2`
premiere_caption (bare-date), `48.3` format_caption (bare
format_summary), `48.4` host_caption (bare-host), each closed and
settled in its own commit. A second critique pass (198, 00:05Z —
3 findings, 0 high / 3 med / 0 low) followed, then `48.5` closed
the spec entirely by documenting the convention rather than adding
a sixth gate (no more stat-tile captions left to guard). Right
after, `1c506a89` ran a depth promotion: the highest-scored pending
candidate (8.3, "canon-rationale/season-body verbatim-argument echo
gate") auto-promoted into spec 50, now sitting in the Held lane
under a 1-day veto window (fallback: release) ending **2026-11-08**,
tracked via issue #839 — not yet pickable. The nightly `e2e-full`
run (02:31–03:07Z) came back **green**. The last commit, `a1e1082b`
(10:50Z), chunked spec 49 (graduated spoiler-risk hold for the
flagged-comment queue) into 2 chunks, next up `49.1`. Quota is
healthy (`0.36` utilization, resets 2026-11-09). Last digest's one
flagged item — the stale "Held (veto window)" label on spec 49's
Status column — is resolved on its own: the table now correctly
reads spec 49 as **Ready** and spec 50 as the actually-Held row.
Candidate queue silting eased rather than worsened: last night's
8.3-scored top pick is no longer sitting in Pending (it's the
candidate that just got promoted), leaving the queue at exactly its
15-item pending cap instead of 1 over.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-06 18:47 | critique pass 197 | `b46c94f4` — 2 findings (1 med, 1 low) |
| 11-06 18:57–19:14 | ship-a-chunk 48.1 | filming_caption bare-location restatement guard; closed + settled (`2c4b7694`→`a0f97e2d`) |
| 11-06 19:36–19:42 | ship-a-chunk 48.2 | premiere_caption bare-date restatement guard; closed + settled (`fb52b351`→`82dec47f`) |
| 11-06 20:01–20:08 | ship-a-chunk 48.3 | format_caption bare format_summary restatement guard; closed + settled (`18261b4d`→`bc37ae4c`) |
| 11-06 23:50–23:52 | ship-a-chunk 48.4 | host_caption bare-host restatement guard; closed + settled (`d0fede2f`→`b7bd1810`) |
| 11-07 00:05 | critique pass 198 | `9ff817da` — 3 findings (0 high, 3 med, 0 low) |
| 11-07 00:13–00:26 | ship-a-chunk 48.5 | documented the stat-tile caption convention (no new gate) — closes spec 48 entirely; closed + settled (`f0aecdff`→`d190ab03`) |
| 11-07 00:41 | depth promotion | `1c506a89` — candidate (score 8.3, canon-rationale/season-body echo gate) auto-promoted to spec 50, Held lane, veto until 2026-11-08 (#839) |
| 11-07 02:31–03:07 | e2e-full (nightly) | **green** |
| 11-07 10:50 | plan-a-spec | `a1e1082b` — chunked spec 49 (graduated spoiler-risk hold), 2 chunks, next `49.1` |

10 `march` workflow runs completed successfully in the window (per
`gh run list --workflow march`); the ones not listed above (03:15,
10:42) landed no new commit on HEAD.

## Shipped

Spec 48 (stat-tile value/caption literal-duplicate invariant) is
now **fully closed** — all 5 chunks landed: the value/caption guard
itself plus four restatement guards (filming, premiere, format,
host captions) and a closing documentation chunk. Two critique
passes ran (197, 198) adding 5 findings to the queue (2 med from
197, 3 med from 198, 0 high throughout — no spoiler-adjacent or
urgent findings in either pass). One depth promotion cleared the
top-scored candidate into spec 50. One new spec got chunked (49,
2 chunks).

## Queues now

- **plan:** 2 specs — 49 (Ready, 2 chunks left, next `49.1`
  `ended_date` season-frontmatter field) and 50 (Held — veto window
  open until 2026-11-08, issue #839, max_age 1d, fallback:
  release). 0 chunks held at the chunk level.
- **plan/AUDIT.md:** 6 pending (1 standing MED season-fill drain —
  shark-tank, rhoslc, dragrace-uk remain immediately actionable; 5
  LOW — Naked and Afraid PSR-date verification, themed-list
  description length, `YEAR_TENURE_RE` teen-number gap, heartbeat
  false-positive hardening, and the #830 mirror-orphan row) + 17
  non-counted standing finale-shift rows (tracked via inline
  HTML-comment markers, outside `/iterate`'s pending count by
  design) — love-is-blind season 11 is the newest, still not
  drained.
- **plan/CRITIQUE.md:** 79 pending (0 HIGH, 46 MED, 33 LOW), last
  pass 198 (2026-11-07 00:05Z, ~17h ago) — the 5 rows added by
  passes 197/198 are counted in the totals above.
- **candidates:** 15 pending, right at the 15-item pending cap
  (`promote.mjs cap` reads clean, not over) — all 15 are >21d old
  by proposed-date, oldest 178d ("Newsletter subscribe," score 3.0).
  `promote.mjs sweep` (Held-lane depth promotion): 0 of 1
  auto-promoted, 1 awaiting (spec 50, veto until 2026-11-08).
  `cuts --since 2026-11-06` returned none. Support: 0 open user
  issues · first response 31.9h mean (1 of 1 opened in 7d) · close
  31.9h mean (1 closed in 7d) — unchanged from last digest.

## Needs you

- **oversight needed: candidate queue silting (15 pending >21d,
  oldest 178d).** Same substance as prior digests but eased by one:
  the queue sits exactly at its 15-item cap rather than over it,
  because last night's top-scored row (8.3, canon-rationale echo
  gate) already drained out via the depth-promotion valve into spec
  50 — no human action needed for that one. The next strongest
  promotion candidate is now "Spoiler-language heuristic gate"
  (score 7.5, proposed 2026-09-09, 59d, per `promote.mjs pick`).
- **Spec 50's veto window closes 2026-11-08.** It auto-promoted
  into the Held lane overnight (issue #839, max_age 1d, fallback:
  release) — if nobody vetoes by then it releases into Ready on its
  own; flagging the date in case a veto is wanted.
- Promote: aged — `sweep` reads "0 of 1 auto-promoted Held lines
  due" → auto-promoted none, 1 awaiting (the spec-50 row above).
- No `cut` lines — `cuts --since 2026-11-06` returned none.
- No motion-stalled line — `pulse.mjs --motion` reads `ok` (36
  shipped last full week vs. 19.5 baseline, well above the 9.75
  floor; 7 so far in 2026-W45).
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

Next ready work: spec 49's first chunk (`49.1`, `ended_date`
season-frontmatter field — small, closes acceptance item A1, no
dependencies). Spec 50 is not yet pickable (Held, veto window open
until 2026-11-08). Top standing finding: the season-fill drain row
(MED, score 4.5) — shark-tank, rhoslc, and dragrace-uk remain
immediately actionable from the last drain tick's own flag. Top
non-standing finding: the love-is-blind S11 shift-note row (MED,
score 4.5), still the newest of the 17 standing finale-shift rows
waiting on a content-gap dispatch.

## Tuning proposals

None filed this tick. The candidate-queue silting signal that's
driven prior tuning discussion resolved itself one layer this
cycle — the depth-promotion valve (`promote.mjs sweep`/the Held
lane) already drained the highest-scored row into spec 50 without
any gate change, which is the mechanism working as designed rather
than a sign it needs retuning.

# DIGEST — 2026-11-08

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Spec 49 closed clean — both chunks landed, one clean critique
pass, nightly `e2e-full` green — and the plan table is now down to
a single spec, Held.** Since last digest (`d8dd06d1`, 2026-11-07
16:39Z): `49.1` (`b36b5ed4`) added the optional `ended_date` field
to season frontmatter, closing acceptance item A1; `227cc126`
closed + settled it. A critique pass (199, 2026-11-08 13:26Z — 3
findings, 0 high / 2 med / 1 low) followed. Then `49.2`
(`4d78a719`) taught `getModQueue()` to join `ai_decisions.verdict`,
resolve the target season's `ended_date` via `getSeason()`, and
auto-flip flag-tier (never block-tier) pending comments to
published once `FLAG_HOLD_DAYS` (30) elapses past that date —
`e33a605f` closed, `819582ac` settled, and spec 49 (graduated
spoiler-risk hold for the flagged-comment queue) is now fully
archived. The nightly `e2e-full` run (2026-11-08 02:03–02:37Z) came
back **green**. Quota is healthy (0.61 utilization, resets
2026-11-09). With spec 49 gone, `plan/README.md`'s table carries
only spec 50 — Held, not yet chunked, veto window dated
2026-11-08 — so there is currently no chunked, pickable plan work
on the table; the next `/next`-style tick falls through to
`/iterate` or `/critique` territory unless the Held lane clears
first. Candidate queue sits unchanged: 15 pending, all >21d old,
oldest 179d.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-07 17:02 | ship-a-chunk 49.1 | `ended_date` optional season-frontmatter field (A1); closed + settled (`b36b5ed4`→`227cc126`) |
| 11-08 13:26 | critique pass 199 | `8f5b90dd` — 3 findings (0 high, 2 med, 1 low) |
| 11-08 13:40 | ship-a-chunk 49.2 | flag-tier pending comments auto-resolve past `FLAG_HOLD_DAYS` (A2-A6); closed + settled (`4d78a719`→`819582ac`) — spec 49 fully archived |
| 11-08 02:03–02:37 | e2e-full (nightly) | **green** |

8 commits landed on `main` in the window (per `git log --since
"26 hours ago"`). `gh run list --workflow march` shows 2 `march
march chain` / `march march` runs completing successfully in the
last few hours (13:15, 13:28); no run in the window landed a
no-op.

## Shipped

Spec 49 (graduated spoiler-risk hold for the flagged-comment
queue) is now **fully closed** — both chunks landed: `49.1` added
the optional `ended_date` field to season frontmatter, `49.2`
wired `getModQueue()` to auto-resolve flag-tier pending comments to
published once the hold window elapses past that date (block-tier
rows are untouched by construction). One critique pass (199) added
3 findings to the queue (2 med, 1 low, 0 high — nothing
spoiler-adjacent or urgent). No new spec got chunked this window —
spec 50 (canon-rationale/season-body echo gate) remains in the
Held lane, not yet chunked.

## Queues now

- **plan:** 1 spec — 50 (Held, veto window since 2026-11-07 ~00:41
  until 2026-11-08, max_age 1d, fallback: release, issue #839), not
  chunked yet. 0 chunks left, 0 chunks held at the chunk level —
  the plan table currently has no pickable chunk.
- **plan/AUDIT.md:** 6 pending (1 standing MED season-fill drain —
  shark-tank, rhoslc, dragrace-uk remain immediately actionable; 4
  LOW — Naked and Afraid PSR-date verification, themed-list
  description length, `YEAR_TENURE_RE` teen-number gap, heartbeat
  false-positive hardening; 1 LOW mirror-orphan row for issue #830)
  + 17 non-counted standing finale-shift rows (tracked via inline
  HTML-comment markers, outside `/iterate`'s pending count by
  design) — love-is-blind season 11 is still the newest, still not
  drained.
- **plan/CRITIQUE.md:** 82 pending (0 HIGH, 48 MED, 34 LOW), last
  pass 199 (2026-11-08 13:26Z, ~3h ago) — the 3 rows added by pass
  199 are counted in the totals above.
- **candidates:** 15 pending, right at the 15-item pending cap —
  all 15 are >21d old by proposed-date, oldest 179d ("Newsletter
  subscribe," score 3.0), unchanged from last digest.
  `promote.mjs sweep` (Held-lane depth promotion): 0 of 1
  auto-promoted, 1 awaiting (spec 50's row, still waiting on its
  own veto window as of this read). `cuts --since 2026-11-07`
  returned none. Support: 0 open user issues · first response
  31.9h mean (1 of 1 opened in 7d) · close 31.9h mean (1 closed in
  7d) — unchanged from last digest.

## Needs you

- **oversight needed: candidate queue silting (15 pending >21d,
  oldest 179d).** Same substance as every recent digest — the
  queue has sat at its 15-item cap with the same oldest row
  (2026-05-14, "Newsletter subscribe") for several nights running,
  with no depth promotion draining it this window (spec 50 already
  occupies the one Held slot). The next strongest promotion
  candidate is "Spoiler-language heuristic gate" (score 7.5,
  proposed 2026-09-09, 61d, per `promote.mjs pick`).
- **Spec 50's veto window is dated 2026-11-08** — today. Issue
  #839 (max_age 1d, fallback: release) is still open and
  `promote.mjs sweep` still reads it as "wait 50 #839 until
  2026-11-08" rather than due, even though the current UTC time
  (16:46Z) is past the ~00:41Z promotion timestamp plus the 1-day
  max_age. Flagging the discrepancy rather than guessing at the
  sweep's exact date-vs-timestamp comparison — worth a look if the
  Held lane is still showing this row tomorrow.
- Promote: aged — `sweep` reads "0 of 1 auto-promoted Held lines
  due" → auto-promoted none, 1 awaiting (the spec-50 row above).
- No `cut` lines — `cuts --since 2026-11-07` returned none.
- No motion-stalled line — `pulse.mjs --motion` reads `ok` (36
  shipped last full week vs. 19.5 baseline, well above the 9.75
  floor; 9 so far in 2026-W45).
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

The plan table has no pickable chunk right now — spec 50 is Held
and not yet chunked, so there's nothing for `/ship-a-chunk` to
pick up until the veto window resolves one way or the other. Top
standing finding: the season-fill drain row (MED, score 4.5) —
shark-tank, rhoslc, and dragrace-uk remain immediately actionable
from the last drain tick's own flag. Top non-standing finding: the
recurring "Featured this month" rotation-staleness badge on
`/themes` (MED, pass 198) — its 4th recurrence of a bug closed
three times before (passes 103/168/178), worth considering as a
proactive housekeeping check rather than waiting for a 5th catch.

## Tuning proposals

None filed this tick. The spec-50 veto-window date-comparison
discrepancy noted above under Needs you is worth watching before
it's worth a candidate — one night's read isn't enough to tell
whether `promote.mjs sweep`'s window math is actually off or
whether it simply hasn't ticked over yet at the hour this digest
ran.

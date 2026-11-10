# DIGEST — 2026-11-10

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A ~25-hour quota pause split an otherwise-clean window: spec 50
shipped its one real chunk, spec 51 moved into Held, and both
critique passes that bracketed the pause came back light.** Since
last digest (`f22af644`, 2026-11-08 16:49Z), 8 commits landed.
Three landed right before the loop ran dry: `4e8dc080` released
spec 50 from its own Held veto window (09:52Z, no veto filed),
`c96b6eee` auto-promoted spec 51 into Held behind a fresh veto
window (10:03Z, issue #843), and critique pass 200 found nothing
(10:09Z). At 10:13Z the weekly Claude Code quota hit `rejected`
(utilization 1.0) — issue #844 opened itself, every scheduled
`march`/`night` tick exited as a no-op skip rather than failing,
and nothing shipped again until the quota reset and the loop's own
first post-reset tick closed #844 at 11:04Z on 2026-11-10. From
there: critique pass 201 (11:19Z) caught one MED finding — the
Survivor Heroes vs. Villains "THE TAKE"/"WHERE IT SITS IN THE
CANON" pair re-duplicating the same accumulated-memory claim the
pass-169 fix already moved once. Spec 50 got chunked (11:28Z) and
its chunk 50.1 (12:03Z, `0fa7f060`→`308aaad0`) shipped
`collectCanonRationaleSeasonBodyEchoIssues()` — the same
tokenize/5-gram/shared-phrase technique the themed-entry echo
detector already uses, now comparing a canon.md entry's
`rationale` against its matching season's rendered body, wired in
LAX (warn-only; 20+ live corpus instances, not blocking). Critique
pass 202 (12:19Z) found nothing. The nightly `e2e-full`
(2026-11-10 04:29–05:03Z, before the quota reset even landed — a
separately-authorized workflow) came back green. Quota is healthy
now: 0.61 utilization, resets 2026-11-16. Motion pulse reads
**stalled** (9 shipped vs. 22.5 baseline, floor 11.25) — that's the
quota pause showing up in the weekly count, not a code or gate
regression; 2 shipped so far in 2026-W46. One live item needs a
look before tomorrow: issue #843's own body text promises "close
by 2026-11-12" to veto spec 51, but the Held line it minted
alongside that text computes release a full day sooner — see
Needs you.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-09 09:52 | plan: veto sweep | spec 50 released from Held — its own window closed with no veto filed (`4e8dc080`) |
| 11-09 10:03 | plan: depth promotion | spec 51 auto-promoted into Held, veto until 2026-11-10 (#843, `c96b6eee`) |
| 11-09 10:09 | critique pass 200 | no findings (`a80e42d4`) |
| 11-09 10:13 → 11-10 11:04 | quota pause | weekly cap hit `rejected` (utilization 1.0); issue #844 opened; every scheduled tick in the window exited as a no-op skip, not a failure; #844 closed automatically at the first post-reset tick |
| 11-10 11:19 | critique pass 201 | 1 finding (0 high, 1 med, 0 low) — Survivor H v V pull/rationale echo (`8b116d39`) |
| 11-10 11:28 | plan: chunk spec 50 | canon-rationale/season-body echo gate chunked (`34d2f517`) |
| 11-10 12:03 | ship-a-chunk 50.1 | `collectCanonRationaleSeasonBodyEchoIssues()` shipped LAX; closed + settled (`0fa7f060`→`308aaad0`) |
| 11-10 12:19 | critique pass 202 | no findings (`efcd1c7d`) |
| 11-10 04:29–05:03 | e2e-full (nightly) | **green** |

8 commits landed on `main` in the ~43.5h window. `gh run list
--workflow march` shows ticks every few hours before and after the
gap, with the pre-reset run at 11-09 20:11 and 11-10 02:58 almost
certainly absorbed as quota-gate no-op skips (same shape as this
digest's own 11-09 20:54 run, confirmed via its log: "Quota gate
(scheduled run): skip - paused: weekly quota until 2026-11-10T08:00:00Z
(issue #844)") rather than real ticks — `conclusion: success` on a
skip looks identical to a real tick from the run list alone.

## Shipped

Spec 50 (canon-rationale/season-body verbatim-argument echo gate)
is chunked with its one real chunk landed: 50.1 added
`collectCanonRationaleSeasonBodyEchoIssues()` to
`scripts/content-check.ts`, mirroring
`collectThemedEntryVerbatimPhraseEchoIssues()` — tokenizes a show's
canon.md entry `rationale` against that entry's matching season's
rendered Section 02 body (`effectiveSeasonShapeBody()`: a `body`
override, or `blurb_md` once `lede` is set), flags any shared
5-gram. Wired behind `CANON_RATIONALE_SEASON_BODY_ECHO_STRICT =
false` — warns via `console.warn`, `content:check` stays green
against the corpus's 20+ existing instances. One chunk remains
(50.2 — `content-curator`'s brief documents the convention, no
code). Spec 51 (spoiler-language heuristic gate) was auto-promoted
into Held, not yet chunked. Two critique passes (200, 202) found
nothing; pass 201 found one MED echo defect on Survivor's own
`pull`/canon-rationale pair — the same shape spec 50's new gate
catches, but on the `pull` field specifically, which spec 50's own
design doc named as out of scope and deferred.

## Queues now

- **plan:** 1 spec — 50 (Ready, 1 chunk left: 50.2, S, no code) · 1
  Held — 51 (auto-promoted, veto until 2026-11-10, #843, max_age:
  1d, fallback: release).
- **plan/AUDIT.md:** 6 pending (1 standing MED season-fill drain —
  shark-tank, rhoslc, dragrace-uk remain immediately actionable
  per the 2026-10-31 drain tick's own flag, unchanged since; 4 LOW
  — Naked and Afraid PSR-date verification, themed-list description
  length, `YEAR_TENURE_RE` teen-number gap, heartbeat
  false-positive hardening; 1 LOW mirror-orphan row for issue
  #830) + 17 non-counted standing finale-shift rows (tracked via
  inline HTML-comment markers, outside `/iterate`'s pending count
  by design) — love-is-blind season 11 is still the newest, still
  not drained.
- **plan/CRITIQUE.md:** 83 pending (0 HIGH, 49 MED, 34 LOW), last
  pass 202 (2026-11-10 12:19Z, ~6h ago) — the finding pass 201
  added is counted in the totals above; pass 202 added none.
- **candidates:** 15 pending (14 carried + 1 filed tonight, below
  — right at the 15-item pending cap), 14 of the 15 >21d old by
  proposed-date, oldest 181d ("Newsletter subscribe," score 3.0).
  `promote.mjs sweep` (Held-lane depth promotion): 0 of 1
  auto-promoted, 1 awaiting (spec 51's own row, still inside its
  own window as of this read). `cuts --since 2026-11-08` returned
  none. `pick` (next strongest, were the floor to clear): "Prose
  sentence-capitalization invariant" (score 6.4, proposed 130d).
  Support: 0 open user issues · first response 31.9h mean (1 of 1
  opened in 7d) · close 31.9h mean (1 closed in 7d) — unchanged
  from last digest.

## Needs you

- **oversight needed: candidate queue silting (14 pending >21d,
  oldest 181d, 15 pending total — at the pending cap).** Same
  substance as every recent digest — no depth promotion has
  drained the queue this window (the one Held slot is occupied by
  spec 51, auto-promoted, not owner-picked), and tonight's own
  tuning proposal (below) adds a fifteenth row rather than
  shrinking the backlog. Next strongest candidate per
  `promote.mjs pick`: "Prose sentence-capitalization invariant"
  (score 6.4, proposed 130d ago).
- **Issue #843 (spec 51's veto) tells the reader the wrong
  deadline.** Its body text reads "close this issue by 2026-11-12
  to veto; left open, the loop builds it" — the skill's default
  3-day window. But the Held line minted alongside it reads `veto
  until 2026-11-10 · max_age: 1d`, matching `bearings.md`'s
  explicit `veto_days: 1` override (set under the bold posture).
  `promote.mjs decide()` releases (builds) the spec once today's
  date is past `until` — so the mechanical release lands
  2026-11-11, a full day before the promise in the issue text. If
  spec 51 should get the full 3 days a reader sees in #843, close
  it now and let `/expand` re-promote properly-windowed, or extend
  the Held line by hand; if the 1-day override is intended as
  written, the issue text is the thing that's wrong and whichever
  step composed it should read the live `veto_days` knob instead
  of the skill doc's documented default. See Tuning proposals.
- Promote: aged — `sweep` reads "0 of 1 auto-promoted Held lines
  due" → auto-promoted none, 1 awaiting (the spec-51 row above).
- No `cut` lines — `cuts --since 2026-11-08` returned none.
- **motion stalled: 9 shipped / 22.5 baseline (floor 11.25),
  2026-W45; 2 so far in 2026-W46.** Fully accounted for by the
  ~25h quota pause (2026-11-09 10:13Z–2026-11-10 11:04Z, issue
  #844) documented above — not a code or gate regression. No
  action needed unless the pattern repeats without a matching
  quota event.
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

Spec 50's one remaining chunk (50.2 — `content-curator` documents
the canon-rationale/season-body echo convention in its brief; S,
no code) is the next pickable `/ship-a-chunk` unit. Top standing
finding: the season-fill drain row (MED, score 4.5) — shark-tank,
rhoslc, and dragrace-uk remain immediately actionable from the
2026-10-31 drain tick's own flag. Top non-standing finding:
pass-201's Survivor `pull`/canon-rationale echo (MED) — the same
defect shape spec 50 just shipped a detector for, on the one field
(`pull`) that detector's design doc explicitly deferred; worth a
look as a direct content fix since the detector itself won't catch
it.

## Tuning proposals

Filed one: `scripts/plan/promote.mjs`'s `heldLine()` computes the
Held-line veto date from the live `veto_days` knob, but the
human-facing veto-issue body text (composed by hand per
`skills/expand.md` §Signal, step 3) has no equivalent shared
source — on 2026-11-09 it was written using the skill doc's
*documented default* (3 days) instead of the bold posture's
actual override (1 day, `bearings.md` line 944), so issue #843
promises a 2026-11-12 veto deadline a full day later than the
Held line it sits beside actually honors. Proposed scope: add a
`promote.mjs mint <issue-date>`-style helper (or extend `heldLine`
callers) that returns both the Held-line text and the veto-body
date string from the same `addDays(date, k.vetoDays)` call, so the
two can't drift again — see `plan/CANDIDATES.md` for the full
row.

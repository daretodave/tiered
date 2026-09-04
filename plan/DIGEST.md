# DIGEST — 2026-09-04

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, quiet-in-the-best-way day: 7 of 7 tracked march runs
succeeded, zero crashes, zero cancellations, 14 shipping commits.
The `slot_argument` ("WHY THIS SLOT") side-drain that's carried
content output for the last several days reached full corpus
completion tonight — no known outstanding instance remains
anywhere in the 68-show catalog. One good self-catch: a premature
finale-shift row for Alone S13 got retracted after fresh research
found the show hadn't actually finished airing (real finale is
09-09, not 09-03). The one thing that needs a harder look:
`plan/CRITIQUE.md`'s Pending section has quietly grown to 43 rows
spanning passes 137–151 — a scale that doesn't square with recent
digests reporting same-day drains, and spot-checks suggest some of
that is fixed-but-never-moved bookkeeping debt rather than live
defects. See "Needs you."

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:00 | e62a9156 / fe349222 | content / audit | slot_argument drain — american-idol canon (24 entries) |
| 20:14 | fd9d13ee / 3e7993a2 | content / audit | slot_argument drain — bachelor canon (25 entries) |
| 22:39–22:40 | 292a9247 / f945f171 | content / audit | slot_argument drain — vanderpump-rules canon (10 entries) |
| 00:09 | 39873056 | critique | pass 151 — 6 findings (0 high, 5 medium, 1 low) |
| 04:59 | 280a4c1a | fix | Alone S13 finale date corrected (09-03→09-09); premature finale-gate row retracted before it shipped a settled shift note for an unaired episode |
| 05:00 | 8bb51771 / 79804471 | content / audit | slot_argument drain — 90-day-fiance canon |
| 09:45 | e9804f13 / ad691b92 | content / audit | slot_argument drain — big-brother canon |
| 14:30–14:31 | 1ba7ba59 / 6149d718 | content / audit | slot_argument drain — dragrace-uk canon (**closes the sub-drain**: full second-pass completion of all 68 shows, zero known remaining instances) |

7 of 7 tracked `march` runs since yesterday's digest (16:16 through
13:46 UTC) succeeded — no crashes, no GitHub-side cancellations.
The cleanest run of ticks logged in recent digests.

## The saga

**Rule 2 (season-fill drain):** still flat. Gap table unchanged
since the 2026-08-30 sweep — 43 shows carrying a gap, all starred
(confirmed-but-unaired). Next sweep due 2026-09-06. `show-add`
stays LOCKED. Near-term real events that will unlock fresh
material once they air: Survivor S51 (2026-09-23, CBS), The Voice
S30 (2026-09-21, NBC — back catalog still under the S22-29 content
freeze, issue #762), Alone S13's real finale (now correctly dated
2026-09-09), America's Got Talent S21 finale (2026-09-23).

**Rule 3 (themed lists):** still saturated per issue #758 — no
list-drain activity today, no change from prior digests.

**Content-gap side-drain (the slot_argument sweep):** this is the
one that moved today. Following the same pattern as the earlier
`filming_caption`/`watch_list` side-drains, this multi-day sweep
rewrote "WHY THIS SLOT" canon-rationale callouts that bare-restated
the season's own body copy, across american-idol, bachelor,
vanderpump-rules, 90-day-fiance, big-brother, and — closing it out
tonight — dragrace-uk (the last of 68 shows to get a fresh-eyes
check). Tonight's commit message states it plainly: "no known
outstanding slot_argument/closing-clause defect remains anywhere
in the corpus as of this tick." That means the fallback avenue
that's carried Rule 2/3-starved days for over a week is now
itself exhausted — tomorrow's tick needs either a fresh
corpus-quality target or a critique-redirect pick (see "Today's
intent").

Catalog stands at 68 shows / 1048 seasons / 68 canons / 181 themes
/ 3 legal docs (per the last verify-gate `content:check` run,
today's dragrace-uk tick).

## Queues now

- **`plan/CRITIQUE.md`**: pass 151 (2026-09-04, today) filed 6
  findings, all still `[ ]` — unlike pass 150's same-day closure,
  nothing from pass 151 drained yet. More notable: the Pending
  section as a whole now holds **43 rows spanning passes 137
  through 151**, not the "8 rows, mostly needs-user-call" figure
  the last two digests reported. Only 8 of the 43 carry a
  `[needs-user-call]` flag; the other 35 read as plain actionable
  findings. A spot-check (the pass-139/142 "voters, last 7 days ·
  0" contradiction rows) found the underlying component
  (`CommunityLiveStrip.tsx`) already carries a qualifying suffix —
  "0 (no new votes since last update)" — in its current tests,
  which reads like the fix landed but the CRITIQUE.md row was
  never moved to Done. This isn't a fresh regression discovery, it
  is very likely ledger drift (candidate #29, "archive closed
  CRITIQUE.md/AUDIT.md rows," already names exactly this failure
  mode) — but the gap between reported and actual pending count is
  large enough that it needs a deliberate reconciliation pass, not
  another digest guess. See "Needs you."
- **`plan/AUDIT.md`**: same 5 real pending rows as recent digests
  (excluding the row template) — 2 HIGH (the-voice factual
  corruption, issue #762; the night.yml/march concurrency race,
  updated tonight — see below), 1 MED (e2e-full duration-ceiling,
  breached again tonight, updated below), 2 LOW (SERP description
  budget; `YEAR_TENURE_RE` regex gap). No new rows filed today —
  the slot_argument closure was tracked via progress notes on the
  existing STANDING ROW, not a new entry.
- **`plan/PHASE_CANDIDATES.md`**: 29 active (unpromoted) numbered
  candidates. Candidate #34 (shard the e2e-full crawl) is now 45
  days unpromoted; candidate #35 (decouple night.yml's concurrency
  group) is now 39 days unpromoted. Both updated tonight with
  fresh recurrence data (see below) — both remain the standing
  `/oversight` recommendation.
- **Open `triage:needs-user`**: 8 issues, most stale (oldest pair,
  #398/#399, are 85 days old with no activity since filing). The
  two live ones are #762 (the-voice corruption) and #758
  (content-gap starvation escape valve — itself working as
  designed, needs no action).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787)
  — #636 (nightly e2e-full) is the only one still actively
  recurring; the other three read as already resolved via linked
  commits but not closed.

## Needs you

1. **CRITIQUE.md Pending-count drift (new finding tonight).** The
   file holds 43 pending rows across passes 137–151, not the
   "handful, mostly needs-user-call" figure recent digests
   reported — and at least one spot-checked pair (pass 139/142's
   "voters · 0" contradiction) looks fixed in code but never moved
   to Done. Recommend a dedicated `/oversight` pass to (a) walk the
   43 rows against current `main` and move genuinely-fixed ones to
   Done, (b) confirm which of the remainder are real open findings,
   and (c) consider finally promoting candidate #29 (archive closed
   rows out of the live ledger) so this drift stops recurring
   silently. This is a bookkeeping-accuracy problem, not (as far as
   tonight's spot-check shows) a live-defect problem — but an
   inaccurate queue count degrades every future digest's saga
   reporting.
2. **Two workflow-file infra fixes, both blocked from cloud push,
   both now over a month unpromoted** — candidate #34 (shard the
   e2e-full crawl; tonight's run breached the 75-minute wall again
   at 87.3% complete, 45 days unpromoted) and candidate #35
   (decouple night.yml's concurrency group from march; 8 more
   silent cancellations since filing, currently surviving only on
   next-day luck, 39 days unpromoted). Both are ready-to-apply,
   low-risk, sitting in `plan/PHASE_CANDIDATES.md`, waiting only on
   a local session with `workflows` OAuth scope.
3. **the-voice factual corruption (issue #762)** — unchanged from
   prior digests. S22-29 still frozen, still needs a dedicated
   human-reviewed 8-file renumbering pass before The Voice S30
   premieres 2026-09-21 makes the live false "show has ended" claim
   more visible.

## Today's intent

The slot_argument side-drain is now fully closed corpus-wide —
tomorrow's tick starts with Rule 2 still locked (next sweep
2026-09-06) and Rule 3 still saturated, and no fresh side-drain
queued. The highest-value next content move is either (a) a fresh
full-corpus scan for a new systemic prose defect class, or (b)
pulling straight from pass 151's 6 fresh CRITIQUE findings, which
is the more concrete option now that the queue-count finding above
shows the redirect path has room to run. Top non-content finding:
the CRITIQUE.md pending-count drift (new tonight) — worth a
reconciliation pass before it distorts another week of digests.

## Tuning proposals

None filed as new candidates tonight — the pending-count drift
finding maps onto the already-filed candidate #29 (archive closed
CRITIQUE.md/AUDIT.md rows), so it's recorded as a "Needs you" item
and a case for promoting #29, not a new proposal. No gate mistuning
observed in today's pulse otherwise: the loop ran clean, and the
slot_argument redirect mechanism worked exactly as designed for its
full run.

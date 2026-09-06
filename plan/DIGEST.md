# DIGEST — 2026-09-06

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, fully-green day on the dispatcher: all 8 tracked `march`
runs since yesterday's digest succeeded, no crashes, no self-heals
needed. The standout content win is mechanical rather than
narrative: the hero/body "count-restate" content-check invariant
(`SHOW_COUNT_RESTATE_STRICT`) drained to zero across its final 12
shows and flipped from lax to strict — the fourth invariant class to
reach that bar, joining `SEASON_EYEBROW_CALENDAR_STRICT` and
`WATCHLIST_PHRASE_REPETITION_STRICT` — closing issue #333 for good.
The weekly season sweep (ninth full pass) reconfirmed all 41
gap-table rows accurate with zero new gaps found, resolved the
below-deck-mediterranean finale-date uncertainty, and closed out a
false Chopped "Season 64" claim. Critique pass 153 filed 6 fresh
findings (2 HIGH, 3 MED, 1 LOW); one HIGH (traitors ardross-2026) and
one carried-over pass-152 MED (alone Arctic II) both shipped same-day
via the content-gap redirect. The one real miss: `e2e-full` reverted
to a duration-ceiling breach after last night's rare green run —
85.4% complete at the 75-minute wall, worse than two nights ago.
Deploy is ready at HEAD (78e61eb8). Nothing needs a same-day fire
drill, but two workflow-file fixes are now well past a month
unpromoted.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 16:21 | 435ab021 / 0f40b9ea | content / audit | hero/body count-restate drain — final 12 shows; flips `SHOW_COUNT_RESTATE_STRICT` lax→strict, closes issue #333 |
| 18:16 | a30f7b28 | content | fix cross-field repetition — dragrace-uk Series 7 (critique pass-152) |
| 20:16 | faa7996b | content | fix cross-field repetition — southern-charm Season 11 (critique pass-152) |
| 22:21 | ac9479e0 / dedb99b7 | content / audit | fix cross-field repetition — jersey-shore Season 6 (critique pass-152) |
| 23:53 | 1ecf2025 | critique | pass 153 — 6 findings (2 high, 3 med, 1 low) |
| 04:53 | 77aec1b8 | sweep | weekly season sweep (9th pass) — 0 new seasons, gap table unchanged at 41/42 |
| 09:34 | 5d79654e / 214f99eb | content / audit | fix cross-field repetition — alone Arctic II "twelfth roster" (critique pass-152) |
| 13:38 | 78e61eb8 | content | fix cross-field repetition — traitors ardross-2026 lede/shape/canon echo (critique pass-153) |

8 of 8 tracked `march` runs since yesterday's digest (13:42 through
12:48 UTC) succeeded — the cleanest run of runs in recent digests,
no crashes, no self-heals, no dedupe absorptions.

## The saga

**Rule 2 (season-fill drain):** stayed fully stalled all window —
every one of the 41 gap-table rows is confirmed-but-unaired
(starred). Today's weekly sweep (the ninth full pass, per Rule 1a)
covered all 68 catalogued shows across 6 scout batches, reconfirmed
every gap row accurate, found zero new gaps, resolved
below-deck-mediterranean's finale-date uncertainty (2026-09-14, 15
episodes confirmed), and closed a false "Chopped Season 64" claim as
a numbering-scheme mismatch. One soft flag: vanderpump-rules' S13
renewal star needs re-verification next sweep (conflicting signal,
not strong enough to unstar yet). `show-add` stays LOCKED. Gap table:
**41 shows / 42 gap-slots, unchanged.** Next full sweep due
2026-09-13.

**Rule 3 (themed lists):** no activity this window; stays saturated
at 181/181 per issue #758, unchanged from recent digests.

**Content-gap redirect:** with Rule 2 and Rule 3 both stalled, three
ticks this window pulled from mechanical fallback classes instead —
the count-restate drain (12 shows, now fully strict) and two
`/critique` Pending-queue fixes (dragrace-uk, southern-charm,
jersey-shore all shipped yesterday's window; alone Arctic II and
traitors ardross-2026 shipped today). The count-restate drain is the
more structurally significant of the two: it's the fourth
lax-to-strict content-check invariant to reach zero corpus-wide,
following the same established pattern — once a fallback drain class
empties, it becomes a permanent regression gate rather than a
one-time cleanup.

Catalog now stands at **68 shows / 1049 seasons / 68 canons / 181
themes / 3 legal docs** — flat this window (no new season-fill
ticks; the count-restate and critique-redirect drains touch existing
files only).

## Queues now

- **`plan/CRITIQUE.md`**: pass 153 (today) filed 6 findings; 2 of
  pass 153's findings and 3 more carried-over pass-152 findings
  shipped this window (5 total resolved). Pending section total: **54
  findings on file, 14 marked RESOLVED-but-not-archived, 40 still
  genuinely open** — up from 39 unresolved yesterday despite 5 fixes
  shipping, since pass 153 added 6 fresh ones. Candidate #29 (archive
  closed rows out of the ledger) remains the standing fix for the
  accounting side of this; the live-finding backlog itself is being
  drained by the content-gap redirect at a real clip.
- **`plan/AUDIT.md`**: 6 real pending rows (excluding the row
  template) — the season-fill STANDING ROW (MED, reconfirmed today by
  the sweep), 2 HIGH (the-voice factual corruption, issue #762,
  unchanged; night.yml concurrency-starvation race, issue #763,
  unchanged — but tonight's own night run completed clean and
  on-schedule, no starvation observed), 1 MED (e2e-full
  duration-ceiling, breached again tonight after last night's
  outlier green), 2 LOW (SERP description budget; `YEAR_TENURE_RE`
  regex gap).
- **`plan/PHASE_CANDIDATES.md`**: ~26 candidates awaiting promotion.
  Candidate #34 (shard e2e-full) got a fresh reinforcement data point
  tonight — now **47 days unpromoted**, still the standing
  `/oversight` recommendation. Candidate #35 (decouple night.yml's
  concurrency group) sits at 41 days unpromoted with no new evidence
  either direction this window (tonight's night run had no
  starvation to report).
- **Open `triage:needs-user`**: 8 issues, several stale — #762 and
  #763 are the two live ones needing an actual decision, both
  untouched since 2026-08-08 (29 days).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787) —
  same set as recent digests, no change.

## Needs you

1. **the-voice factual corruption (issue #762) — 15 days to
   premiere.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`; S30 premieres 2026-09-21 (NBC) — the false
   "ended" claim becomes visibly wrong to any reader landing on the
   show page in barely two weeks.
2. **Two ready-to-apply workflow-file fixes, both well over a month
   unpromoted, both blocked from cloud push** — candidate #34 (shard
   the e2e-full crawl, 47 days) and candidate #35 (decouple
   night.yml's concurrency group, 41 days). Tonight's `e2e-full` run
   reverted to a breach right after the first green run in weeks,
   underscoring that the single-worker throughput ceiling — not
   variance — is the real bottleneck. Both candidates are unchanged
   in scope since filing and sitting only on a local/`workflows`-
   OAuth-scope session.
3. **CRITIQUE.md Pending queue keeps net-growing** (40 unresolved,
   up from 39 despite 5 fixes shipping this window) because critique
   itself files ~6 new rows a pass and the content-gap redirect can
   only drain a few per window. Not urgent, but worth watching —
   the redirect pattern is working exactly as designed, it's just
   not yet outpacing the inflow.

## Today's intent

Content-gap ticks should keep pulling from CRITIQUE.md's Pending
queue while Rule 2 stays locked until the 2026-09-13 sweep and Rule
3 stays saturated. With the count-restate invariant now fully
strict, the next fallback-class candidate (if the critique queue
ever runs dry on its own) is whatever `pnpm content:check` warning
class is next in line — none currently open per this window's clean
verify runs. Top non-content finding: the-voice's S30 premiere is
now 15 days out and issue #762 still needs a human-reviewed fix
before the live "ended" claim becomes publicly visible as wrong.

## Tuning proposals

None filed as new candidates tonight. No gate mistuning observed:
critique fired on schedule (pass 153), the weekly sweep fired on
schedule (9th pass), the content-gap redirect mechanism kept handling
the post-side-drain gap as designed, and all 8 march runs finished
clean. The two live infra candidates (#34, #35) both got reinforcement
data points, not new proposals — both already exist and remain
`/oversight`'s call, now 47 and 41 days unpromoted respectively.

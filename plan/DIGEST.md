# DIGEST — 2026-09-05

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A productive, mostly-clean day: 7 of 8 tracked `march` runs
succeeded, one self-healed without human attention (a 04:55 UTC
crash hit a stale GitHub token — `Bad credentials` — and the
workflow's own staleness-bound logic appended it to the existing
month-old issue #565 rather than filing a duplicate; no digest
action needed). The headline win is the saga: **American Ninja
Warrior fully drained to 18/18** — S18's true finale confirmed via
two independent sources, `canon.md` rebased, and the gap table row
removed entirely, dropping the standing count from 42 to 41
gapped shows. Critique pass 152 also caught the first confirmed
spoiler leak `/critique` has ever found (a named Miss Congeniality
winner on `dragrace-uk` Series 7) — fixed same-day. Two more
cross-field-repetition findings from pass 151 (`the-circle`,
`selling-sunset`) also shipped. Tonight's `e2e-full` breadth run
came back green (71m19s, under the 75-minute wall) after
yesterday's breach. Deploy is ready at HEAD. Nothing needs a
same-day fire drill.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 18:10 | 8d645adf | content | fix cross-field repetition — the-circle Season 7 (critique pass-151) |
| 20:34 | 5283315d | content | fix cross-field repetition — selling-sunset Season 9 (critique pass-151) |
| 22:28 | 9b014bce | expand | pass 68 — 0 new candidates filed, 3 reinforced (#34, #35, #29) |
| 00:34 | a61c5951 | critique | pass 152 — 6 findings (1 high, 4 medium, 1 low) |
| 04:55 | — | march | crashed — stale GH token (`Bad credentials`); auto-appended to existing issue #565, no new issue filed |
| 09:42 | 8b78cdfa | content | fix spoiler leak — dragrace-uk Series 7 (critique pass-152, first confirmed spoiler `/critique` has ever caught) |
| 13:33 | 27afccd0 / 91c09aed | content / audit | season backfill — American Ninja Warrior S18 (**closes the show**: gap table row removed, 18/18) |

7 of 8 tracked `march` runs since yesterday's digest (14:40 through
13:37 UTC) succeeded; the one failure was a transient auth error
that resolved itself on the next hourly retry with no content or
code impact.

## The saga

**Rule 2 (season-fill drain):** moved for the first time in over a
week. Today's tick re-verified the three nearest-dated stall
candidates before falling back to a full scan, confirmed
`american-ninja-warrior` S18's true finale aired 2026-08-31 (NBC
Insider + Celeb Dirty Laundry agree), filed `18-the-tripleheader.md`,
fully rebased `canon.md` (inserted at rank 15, three neighboring
ranks shifted, `era_bands` widened, tenure caption bumped), and
removed the show's gap-table row entirely. **Gap table: 42 shows /
43 gap-slots → 41 shows / 42 gap-slots.** `rhoc` S20 and
`the-challenge` S42 were checked and stay deferred (neither has a
confirmed finale yet). Next full sweep due 2026-09-06 (tomorrow).
`show-add` stays LOCKED — 41 shows still carry a gap, nowhere near
zero.

**Rule 3 (themed lists):** no activity this window; stays saturated
per issue #758, unchanged from recent digests.

**Content-gap redirect:** with the slot_argument side-drain fully
exhausted as of yesterday's digest, today's content-gap ticks
pulled straight from `/critique`'s own Pending queue instead — the
the-circle and selling-sunset repetition fixes and the dragrace-uk
spoiler fix were all shipped this way (each RESOLVED note cites
"content-gap redirect per issue #758"). This is exactly the path
yesterday's digest recommended once the mechanical side-drain ran
dry, and it's working: three fresh findings closed, one of them a
real spoiler.

Catalog now stands at **68 shows / 1049 seasons / 68 canons / 181
themes / 3 legal docs** — the season count ticked up by one with
tonight's American Ninja Warrior fill.

## Queues now

- **`plan/CRITIQUE.md`**: pass 152 (today) filed 6 findings; the
  HIGH spoiler is already resolved, leaving 5 fresh rows (4 MED, 1
  LOW) pending. Pending section total across all passes: **39
  unresolved rows** (of 49 total entries — 10 already carry inline
  RESOLVED notes not yet archived out). Oldest unresolved rows
  trace back to roughly pass 130-140; no reconciliation pass has
  run since the drift finding two digests ago (candidate #29,
  archive closed rows out of the ledger, is still the standing fix
  for the accounting gap itself, separate from the live-finding
  backlog).
- **`plan/AUDIT.md`**: 6 real pending rows (excluding the row
  template) — the season-fill STANDING ROW (MED, updated today),
  2 HIGH (the-voice factual corruption, issue #762; the night.yml
  concurrency-starvation race, issue #763, updated tonight — see
  below), 1 MED (e2e-full duration-ceiling, went green tonight but
  the underlying single-worker bottleneck is unchanged), 2 LOW
  (SERP description budget; `YEAR_TENURE_RE` regex gap).
- **`plan/PHASE_CANDIDATES.md`**: ~26 candidates awaiting
  promotion. Candidates #34 (shard e2e-full) and #35 (decouple
  night.yml's concurrency group) both got fresh data points
  tonight — #34 is now 45 days unpromoted, #35 is 40 days
  unpromoted — both remain the standing `/oversight`
  recommendation.
- **Open `triage:needs-user`**: 8 issues, several stale — the
  oldest pair (#398/#399) are now 86 days old with no activity
  since filing. The two live ones needing an actual decision are
  #762 (the-voice corruption, S30 premieres 2026-09-21 — deadline
  approaching) and #763 (night.yml starvation race — 4 confirmed
  occurrences since diagnosis, candidate #35 ready to apply).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787)
  — same set as recent digests, no change.

## Needs you

1. **the-voice factual corruption (issue #762) — clock is now
   real.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`, but S30 premieres 2026-09-21 (NBC) — **16 days
   from today** — at which point the false "ended" claim becomes
   visibly wrong to any reader landing on the show page, not just
   an internal content-quality issue.
2. **Two ready-to-apply workflow-file fixes, both over a month
   unpromoted, both blocked from cloud push** — candidate #34
   (shard the e2e-full crawl, 45 days) and candidate #35 (decouple
   night.yml's concurrency group, 40 days). Tonight's night run
   actually demonstrated the race directly: it queued behind an
   in-progress march run instead of getting evicted, and only
   started because that march run happened to finish before the
   next hourly trigger landed — still luck, not a fix. Both
   candidates are unchanged in scope since filing and sitting only
   on a local/`workflows`-OAuth-scope session.
3. **CRITIQUE.md Pending queue is genuinely large (39 unresolved
   rows), not just an accounting artifact this time.** Unlike the
   ledger-drift finding two digests ago (which turned out to be
   mostly fixed-but-unmoved rows), today's count reflects real
   open findings spanning many shows and severities. Worth a look
   at whether the content-gap redirect's recent pivot to pulling
   straight from CRITIQUE.md (see "The saga") should become the
   standing default once Rule 2/3 are both stalled, rather than an
   ad hoc fallback — it's draining the queue at a real clip (3 rows
   closed today) but the queue is still net-growing given critique
   itself files ~6 new rows a pass.

## Today's intent

Content-gap ticks should keep pulling from CRITIQUE.md's Pending
queue while Rule 2 stays locked until tomorrow's sweep (2026-09-06)
and Rule 3 stays saturated — today proved the pattern works (3
findings closed, including a real spoiler). Top non-content
finding: the-voice's S30 premiere is now 16 days out and issue #762
still needs a human-reviewed fix before the live "ended" claim
becomes publicly visible as wrong.

## Tuning proposals

None filed as new candidates tonight. No gate mistuning observed:
critique fired on schedule (pass 152), expand fired on schedule
(pass 68), the content-gap redirect mechanism handled the
post-side-drain gap exactly as designed, and the one march crash
self-healed via existing staleness-bound logic. The two live
infra candidates (#34, #35) got reinforcement data points, not new
proposals — both already exist and are `/oversight`'s call.

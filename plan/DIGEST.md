# DIGEST — 2026-09-07

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, fully-green day on the dispatcher: all 7 tracked `march`
runs since yesterday's digest succeeded, no crashes, no self-heals.
With Rule 2 (season-fill) still fully stalled and Rule 3 (themed
lists) saturated, the window ran on fallback: two themed-list
extensions (America's Got Talent S05 into `a-way-back-in`, American
Ninja Warrior S18 into `the-finals-never-run-the-same-course-twice`)
and two `/critique` Pending-queue fixes from pass 154 (the "three
named qualifying regions" repetition and a host-name spelling
mismatch, both on American Ninja Warrior's S18 page). Critique pass
154 itself came back mechanically clean across nine URLs — 0 console
errors, no spoiler leaks — filing 2 fresh MED findings. The one real
miss, again: `e2e-full` breached the 75-minute wall for the **second
consecutive night** (86.9% complete tonight, up slightly from
09-06's 85.4%), pushing candidate #34 (shard the crawl) to **48 days
unpromoted**. Deploy is ready at HEAD (0c1b1ae8). Nothing needs a
same-day fire drill, but the two workflow-file fixes are now well
into their second month unpromoted.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 16:58 | 86c88f89 | expand | pass 69 — 0 candidates filed, 3 reinforced |
| 19:24 | 94994963 | content | fix cross-field repetition — below-deck-mediterranean dubrovnik-ii canon echo (critique pass-153) |
| 21:37 | 91a26c8e | content | themed-list extend — the-finals-never-run-the-same-course-twice (American Ninja Warrior S18) |
| 23:01 | fc9e92fd | critique | pass 154 — 2 findings (0 high, 2 medium, 0 low) |
| 01:32 | 2551a53d | content | fix cross-field repetition — american-ninja-warrior the-tripleheader (critique pass-154) |
| 01:33 | a84e28ac | audit | content-gap addressed — american-ninja-warrior the-tripleheader repetition fix |
| 12:57 | feaa460a / 0c1b1ae8 | content / audit | themed-list extend — a-way-back-in (America's Got Talent S05); content-gap progress note — Rule 2 stall, fell through to Rule 3 |

7 of 7 tracked `march` runs since yesterday's digest (16:58 through
12:57 UTC) succeeded — no crashes, no self-heals, no dedupe
absorptions.

## The saga

**Rule 2 (season-fill drain):** stayed fully stalled all window —
every one of the 41 gap-table rows (42 gap-slots) is
confirmed-but-unaired (starred). No new sweep this window; the ninth
full sweep (2026-08-30 cadence, reconfirmed via digest 2026-09-06)
still stands, next full sweep due 2026-09-13. `show-add` stays
LOCKED.

**Rule 3 (themed lists):** two extension ticks this window —
`a-way-back-in` grew 15→16 entries (America's Got Talent S05's
Wildcard-quarterfinal mechanic) and
`the-finals-never-run-the-same-course-twice` gained a rank-8 entry
for American Ninja Warrior S18's three-region qualifying split.
Both are extensions under the entry cap, not new lists — list count
holds at 181/181 per issue #758's saturation finding.

**Content-gap redirect:** with Rule 2 and Rule 3 both stalled/
saturated for new work, two ticks pulled from `/critique`'s Pending
queue instead — both pass-154 findings on American Ninja Warrior's
S18 season page (the six-place "three named qualifying regions"
restatement, and the Gbajabiamila/Gbaja-Biamila host-name spelling
mismatch — the repetition fix shipped same-day, the spelling fix
remains open in the queue). This is the same redirect pattern digest
has reported for weeks: mechanical fallback classes keep the
dispatcher shipping real fixes while the two primary rules stay
gated.

Catalog holds at **68 shows / 1049 seasons / 68 canons / 181 themes
/ 3 legal docs** — flat this window, as expected with Rule 2 stalled
and Rule 3's activity confined to within-cap extensions.

## Queues now

- **`plan/CRITIQUE.md`**: pass 154 (today) filed 2 findings; 1 of
  them shipped same-day via the content-gap redirect. Pending
  section: **56 findings on file, 16 marked RESOLVED-but-not-
  archived, 40 still genuinely open** — flat vs. yesterday (5 fixes
  shipped last window pushed it to 40; today's redirect resolved 1
  of pass 154's 2 new findings, netting to the same 40). Candidate
  #29 (archive closed rows out of the ledger) remains the standing
  fix for the accounting side; the live-finding backlog is being
  held roughly flat by the redirect.
- **`plan/AUDIT.md`**: standing rows unchanged in count — the
  season-fill STANDING ROW (MED, stalled since 08-30 sweep), 2 HIGH
  (the-voice factual corruption issue #762, unchanged; night.yml
  concurrency-starvation issue #763 — three clean nights in a row,
  09-04 through tonight, no new occurrence to log), 1 MED (e2e-full
  duration-ceiling, breached again both nights this window), 2 LOW
  (SERP description budget; `YEAR_TENURE_RE` regex gap).
- **`plan/PHASE_CANDIDATES.md`**: ~28 candidates awaiting promotion.
  Candidate #34 (shard e2e-full) got its second fresh reinforcement
  data point in two nights — now **48 days unpromoted**, still the
  standing `/oversight` recommendation. Candidate #35 (decouple
  night.yml's concurrency group) sits at **42 days unpromoted**, no
  new occurrence this window (three clean nights running).
- **Open `triage:needs-user`**: 8 issues, several stale — #762 and
  #763 are the two live ones needing an actual decision, both
  untouched since 2026-08-08 (30 days).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787) —
  same set as recent digests, no change. #636 (e2e-full tracking
  issue) picked up its 39th and 40th "Recurred" comments tonight and
  last night.

## Needs you

1. **the-voice factual corruption (issue #762) — 14 days to
   premiere.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`; S30 premieres 2026-09-21 (NBC) — the false
   "ended" claim becomes visibly wrong to any reader within two
   weeks.
2. **Two ready-to-apply workflow-file fixes, both past a month
   unpromoted, both blocked from cloud push** — candidate #34 (shard
   the e2e-full crawl, 48 days) and candidate #35 (decouple
   night.yml's concurrency group, 42 days). `e2e-full` has now
   breached on 2 consecutive nights (85.4%, then 86.9% complete at
   the wall), reinforcing that the single-worker throughput ceiling —
   not variance — is the real bottleneck. Both candidates are
   unchanged in scope since filing and sitting only on a local/
   `workflows`-OAuth-scope session.
3. **CRITIQUE.md Pending queue is holding flat at 40 unresolved**,
   not shrinking — the content-gap redirect is draining about as
   fast as critique files new rows, but no faster. Not urgent, just
   worth naming: the redirect alone won't work the backlog down to
   zero, only keep it from growing.

## Today's intent

Content-gap ticks should keep pulling from CRITIQUE.md's Pending
queue (the host-name spelling mismatch on American Ninja Warrior's
S18 page is the freshest, unresolved candidate) while Rule 2 stays
locked until the 2026-09-13 sweep and Rule 3 stays saturated at
181/181 outside of within-cap extensions. Top non-content finding:
the-voice's S30 premiere is now 14 days out and issue #762 still
needs a human-reviewed fix before the live "ended" claim becomes
publicly visible as wrong.

## Tuning proposals

None filed as new candidates tonight. No gate mistuning observed:
critique fired on schedule (pass 154), the content-gap redirect kept
handling the dual-stall gap as designed, and all 7 march runs
finished clean. The two live infra candidates (#34, #35) both got
reinforcement data points, not new proposals — both already exist
and remain `/oversight`'s call, now 48 and 42 days unpromoted
respectively. Two consecutive e2e-full breaches (09-06 and tonight,
right after 09-05's rare green night) is worth flagging as a trend,
not a new finding: the structural fix candidate #34 already names is
the only thing that changes this pattern — another timeout bump was
explicitly rejected at the 50→75 change and would only buy a few
more weeks.

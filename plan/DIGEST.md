# DIGEST — 2026-09-09

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Another clean sweep: all 6 tracked `march` runs since yesterday's
digest succeeded, zero crashes, zero self-heals. Rule 3 broke its own
saturation ceiling for a day — a brand-new themed list,
`too-few-to-call-it-all-stars` (10 entries, 9 shows), shipped mid-window
— only for critique pass 156 to catch a spoiler-coded "twist" phrase
in that same list's entry #03 a few hours later (filed as this pass's
HIGH, same-day-adjacent rather than same-tick). Pass 156 also filed 2
MED findings (a shape/canon near-duplicate on vanderpump-rules S12, an
a11y heading-level slip on `/shows`) and reconfirmed 3 already-tracked
systemic bugs on new pages. The other real story tonight is
`e2e-full`: it broke its 3-night breach streak, finishing **green** in
70m22s — but that's only ~5 minutes under the 75-minute wall, so the
margin is thin, not a resolution. Content otherwise idled: Rule 2
stayed fully stalled (41 shows/42 gap-slots, all confirmed-but-unaired)
and Rule 3 zero-shipped twice after its one list-and-extend burst,
falling back to draining the CRITIQUE.md Pending queue (a pass-155 MED
pull-quote near-duplicate on too-hot-to-handle S06) when both primary
rules had nothing left to give. Deploy is ready at HEAD (a0124937).
Nothing needs a same-day fire drill.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 18:34 | 4b290aa7 / 0b3b90af | content / audit | fix pull-quote near-duplicate — too hot to handle S06 (critique pass-155 MED, content-gap redirect) |
| 21:48–21:53 | bb499ffd / 7aece0b7 | content / audit | themed-list extend — the-cast-outgrew-the-format + the-fix-stayed-after-the-season-left |
| 00:56 | a51f1a7d | audit | content-gap progress note — Rule 2 stalled, Rule 3 zero-ship (21st zero-ship pass) |
| 02:34 | d65385b3 / edebabb7 | content / audit | rule-3 new list — too-few-to-call-it-all-stars (10 entries, 9 shows) |
| 06:53 | ae289b02 | audit | content-gap progress note — Rule 2 stalled, Rule 3 zero-ship (second tick same day) |
| 12:35 | a0124937 | critique | pass 156 — 3 findings (1 HIGH, 2 MED), 3 systemic confirmations |

6 of 6 tracked `march` runs since yesterday's digest (14:47 09-08
through 12:35 09-09 UTC) succeeded — no crashes, no self-heals, every
tick shipped a real change (no no-op ticks logged this window).

## The saga

**Rule 2 (season-fill drain):** stayed fully stalled — unchanged since
the ninth weekly sweep (2026-09-06): all 41 gap-table rows (42
gap-slots) confirmed-but-unaired, nothing drained, nothing new found.
Next full sweep due 2026-09-13. `show-add` stays LOCKED.

**Rule 3 (themed lists):** the most active window in a while — one
extension (`the-cast-outgrew-the-format` + `the-fix-stayed-after-the-
season-left`, both gaining entries) and one brand-new list
(`too-few-to-call-it-all-stars`, 10 entries across 9 shows), the first
new list since issue #758's 181/181 saturation finding. Then two
zero-ship ticks in a row as the fresh-angle search came up dry again
(21st and 22nd zero-ship passes, per the progress notes) — so the
saturation verdict holds outside of the one list this window produced.
Catalog now **182/182** themes.

**Content-gap redirect:** with both primary rules quiet for most of
the window, one tick pulled from the `/critique` Pending queue instead
— the pass-155 MED pull-quote near-duplicate fix on too-hot-to-handle
S06. Same weeks-long redirect pattern: mechanical fallback classes
keep the dispatcher shipping real fixes while Rule 2 stays gated and
Rule 3 mostly saturated.

**Notable cross-tick catch:** critique pass 156's HIGH finding flags
`too-few-to-call-it-all-stars` — the list this very window's Rule-3
tick shipped — for spoiler-coded "twist" language in its Bachelorette
S11 entry. The list and its own defect both landed inside 26 hours;
worth watching whether new-list Rule-3 ships need a same-tick voice
self-check rather than waiting for the next critique pass to catch it.

Catalog holds at **68 shows / 1049 seasons / 68 canons / 182 themes /
3 legal docs** — seasons flat (Rule 2 stalled), themes +1 (Rule 3's
one new list).

## Queues now

- **`plan/CRITIQUE.md`**: pass 156 (today) filed 3 new findings (1
  HIGH voice/spoiler flag on the just-shipped `too-few-to-call-it-all-
  stars` list, 2 MED — vanderpump-rules S12 shape/canon duplication,
  `/shows` tier-heading a11y) and appended 3 confirming systemic
  instances to already-tracked rows (masterchef's `?view=community`
  canonical bug reproduced on naked-and-afraid, selling-sunset's
  season-detail `?view=community` no-op reproduced on
  vanderpump-rules, love-island-uk's mobile 7D-column drop reproduced
  on naked-and-afraid — two of the three bumped severity given the
  now-confirmed systemic scope). The 6 `[needs-user-call]` editorial-
  judgment rows are unchanged (home compact-tile cap, `/shows` B-tier
  sub-grouping — now cited on two more shows this pass, `/themes` stat
  chip label, `/u/e2e` record scaffold, dynamic-vs-ISR caching split),
  all still routed for `/oversight`, none auto-resolvable.
- **`plan/AUDIT.md`**: standing rows unchanged in count — the
  season-fill STANDING ROW (MED, stalled since the 09-06 sweep), 2
  HIGH (the-voice factual corruption issue #762, unchanged 32 days;
  night.yml concurrency-starvation issue #763 — now **8 clean
  night.yml runs in a row**, 09-01 through tonight), 1 MED
  (e2e-full duration-ceiling — broke its 3-night breach streak
  tonight, finishing green with only ~5 minutes of margin), 2 LOW
  (SERP description budget; `YEAR_TENURE_RE` regex gap).
- **`plan/PHASE_CANDIDATES.md`**: 28 candidates awaiting promotion
  (correcting an undercount in recent digests). Candidate #34 (shard
  e2e-full) got tonight's reinforcement update — the breach streak
  broke, but the ~5-minute margin on a green run keeps the standing
  recommendation unchanged; now **49 days unpromoted**. Candidate #35
  (decouple night.yml's concurrency group) has gone 8 clean nights
  with no new occurrence to reinforce.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 and #763
  remain the two live ones needing an actual decision, both untouched
  since 2026-08-08 (32 days).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787) —
  same set as recent digests. #636 (e2e-full tracking issue) is due
  its next "Recurred" comment only if tomorrow breaches again.

## Needs you

1. **Two ready-to-apply workflow-file fixes, both roughly seven weeks
   unpromoted, both blocked from cloud push** — candidate #34 (shard
   the e2e-full crawl, 49 days) and candidate #35 (decouple night.yml's
   concurrency group, 44 days at filing, quiet for 8 nights). Tonight's
   green e2e-full run (70m22s, ~5 min under the 75-min wall) doesn't
   change the recommendation — the margin is too thin for the catalog's
   current growth trajectory to hold much longer.
2. **the-voice factual corruption (issue #762) — 12 days to premiere.**
   S22-29 stays frozen pending a human-reviewed 8-file renumbering fix.
   The show's live frontmatter still reads `status: ended`; S30
   premieres 2026-09-21 (NBC).
3. **CRITIQUE.md Pending queue keeps growing slightly faster than the
   content-gap redirect drains it this window** — pass 156 added 3 new
   rows, only 1 pass-155 row was resolved. Not urgent on its own, but
   worth naming since Rule 2/Rule 3 both spent most of the window idle
   and the redirect only had bandwidth for one fix.

## Today's intent

Content-gap ticks should keep pulling from CRITIQUE.md's Pending queue
(now including pass 156's 3 fresh rows) while Rule 2 stays locked
until the 2026-09-13 sweep and Rule 3 returns to its post-list lull.
Top non-content finding: candidate #34 (shard e2e-full) is now 49 days
unpromoted, and tonight's green run — despite breaking the breach
streak — only reinforces that the fix is needed soon rather than
resolving the underlying issue.

## Tuning proposals

No new candidates filed tonight. One reinforcement update: candidate
#34 got tonight's green-run data point (70m22s, ~5 min margin under
the 75-min wall) appended directly to its existing write-up in
`plan/PHASE_CANDIDATES.md` — this is evidence-gathering on an
already-filed, already-unpromoted candidate, not a new proposal. No
gate mistuning observed otherwise: critique fired on schedule (pass
156, including catching a same-window Rule-3 list's spoiler-coded
phrasing), the content-gap redirect handled the dual-stall gap as
designed, and all 6 march runs finished clean with zero no-ops.
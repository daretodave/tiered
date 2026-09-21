# DIGEST — 2026-09-21

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A day split cleanly in two: the afternoon/evening of 09-20 lost
three of four `march` ticks to the org-access-toggle outage
(issue #565) in under 8 hours, then the loop went fully green
overnight and stayed green all morning — one critique pass (166,
3 findings) and three content-gap redirect-fallback fixes (90 Day
Fiancé S12 finale date, Amazing Race S38 watch_list repetition,
Survivor 50 cast-composition repetition) shipped clean. The
nightly `e2e-full` breadth crawl came back **green** for the
first time in three nights, breaking the prior digest's reported
breach. Rule 2 stays structurally locked at 44/44 starred
gap-slots; the redirect fallback carried the entire content
window again. Deploy is ready at HEAD (45bffdb).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 14:20–14:39 (09-20) | — | march (crashed) | issue #565 recurrence — org-access toggle disabled |
| 17:39–17:42 (09-20) | — | march (crashed) | issue #565 recurrence, same class, ~3h later |
| 19:46–20:01 (09-20) | 06195ee7 | critique | pass 166 — 3 findings (0 high, 2 medium, 1 low) |
| 22:20–22:23 (09-20) | — | march (crashed) | issue #565 recurrence, third in one afternoon/evening |
| 00:29–01:18 (09-21) | 355a9584 | audit | 90-day-fiance S12 finale-date correction |
| 00:39–01:58 (09-21) | — | e2e-full (nightly) | **green** — first green night in three, breaks the prior digest's reported breach |
| 05:28–06:16 (09-21) | f3d88cee, 6884e4ce | content + audit | amazing-race S38 watch_list repetition redirect fix |
| 11:05–11:50 (09-21) | 9c06eb63, 45bffdbd | content + audit | survivor-50 cast-composition repetition redirect fix |

4 of 7 tracked `march` ticks shipped real work (1 critique pass +
3 redirect-fallback content fixes); 3 crashed on the same known,
non-actionable-from-cloud org-access class — the worst single-day
concentration of that failure since the original 4-day 08-16→08-20
outage (candidate #37, still unpromoted).

## The saga

**Rule 2 (season-fill drain):** unchanged since 09-20's sweep —
gap table holds at **44 shows/44 slots**, every row starred
confirmed-but-unaired. No new sweep due this window (weekly
cadence, last ran 09-20). Structurally locked, same as every
digest since 09-04.

**Rule 3 (themed lists):** no ship this window; no commit touched
`content/themes/`.

**The redirect fallback carried the window again.** Two of pass-
165/166's own repetition findings landed as fixes: Survivor 50's
cast-composition restatement (flagged in pass 166, fixed same
window) and Amazing Race Season 38's watch_list route repetition
(the field pass-140's earlier fix had explicitly left untouched,
now closed). A third fix — 90 Day Fiancé Season 12's finale date —
was a factual correction, not a repetition fix. Catalog holds flat
at **68 shows / 1,052 seasons / 68 canons** — no new season or
list filed this window, all three ships rewrote existing files.

## Queues now

- **`plan/CRITIQUE.md`**: pass 166 (2026-09-20 19:58, commit
  06195ee7), 3 findings (0 HIGH, 2 MED, 1 LOW) — both MED findings
  are the same fact-restatement class flagged on Survivor 50, one
  of which was fixed this window; the LOW (Amazing Race S38
  watch_list) was also fixed this window. Pass is same-day fresh.
  File still too large for a direct `Read`; `grep`/`awk` remain
  the only safe access path.
- **`plan/AUDIT.md`**: 7 Pending rows, unchanged count from
  yesterday: 2 HIGH (the-voice factual corruption #762, still
  frozen — S30's confirmed 2026-09-21 premiere is **today**; night-
  shift starvation row / candidate #35, no new occurrence, clean
  streak continues), 2 MED (season-fill drain, 44/44 all-starred,
  no change; e2e-full duration-ceiling row, candidate #34, back to
  green after 09-20's breach), 3 LOW (SERP description budget;
  `YEAR_TENURE_RE` teen-number gap; heartbeat false-positive #806,
  no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still
  2026-09-16 (commit 17d830ee, pass 71) — **5 days with no pass
  now**, one day longer than yesterday's digest flagged. 39
  numbered candidates under "Considered (awaiting promotion)."
  Candidate #34 (shard e2e-full) is now **62 days unpromoted**,
  still the file's longest-lived open item; candidate #37
  (org-access fallback) is the one most reinforced by today's
  pulse — see Needs you.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) is now maximally time-pressured with S30 premiering
  today.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **the-voice factual corruption (issue #762) — S30 premieres
   today, 2026-09-21.** S22-29 stays frozen pending a human-
   reviewed 8-file renumbering fix; live frontmatter still reads
   `status: hiatus` with a false "show has ended" framing that
   today's real premiere makes more visible than at any prior
   digest.
2. **Candidate #37 (org-access fallback for cloud workflows) just
   got its clearest reinforcement yet.** Three of four `march`
   ticks failed to the same org-access-toggle class within an
   8-hour span on 09-20 (14:20, 17:39, 22:20 UTC) — a tighter
   clustering than any single day logged since the original 4-day
   outage that filed the candidate. The fix (an `ANTHROPIC_API_KEY`
   fallback, or at minimum a faster same-day alert) is a
   cost/reliability tradeoff only a human should make.
3. **Candidate #34 (shard e2e-full) crossed 62 unpromoted days**,
   though tonight's run came back green — still the file's
   longest-unpromoted candidate, still blocked on a
   `.github/workflows/e2e-full.yml` edit the cloud loop cannot
   push.
4. **`/expand` hasn't run in 5 days** (last pass 09-16, count 71).
   No queue-starvation symptom yet (39 candidates still sit
   "awaiting promotion"), but worth a look if the gap stretches
   further.

## Today's intent

Rule 2 stays locked at 44/44 starred; expect the redirect fallback
to keep carrying content ticks until a real air date lands on one
of those rows or the next weekly sweep (due ~09-27) turns one.
Top non-content finding: today's clustered org-access failures
make candidate #37 the strongest live case for the next
`/oversight` session, just ahead of issue #762's now-same-day
urgency.

## Tuning proposals

No new meta-loop tuning candidates filed tonight — no mistuned
gate observed; the redirect fallback continues working as
designed. One reinforcement appended to an already-open candidate,
data-only (no gate, cadence, or rule edited):

- **Candidate #37** (org-access fallback): the 09-20 clustering
  (3 failures in 8 hours, all issue #565's known class) is the
  clearest same-day case for this candidate since it was filed —
  noted here for the next `/oversight` session, not filed as a
  new candidate.

# DIGEST — 2026-09-20

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A working, mostly-green window with one real event: the weekly
season-sweep fired on schedule and found 3 genuine new gap-slots
for the first time in three sweeps (american-ninja-warrior's
double-renewal, survivor-australia's Season 13) — but both remain
starred confirmed-but-unaired, so Rule 2 stays structurally locked
and the redirect fallback kept carrying content ticks, landing
three more critique-driven repetition fixes (masterchef
global-gauntlet, vanderpump-rules S12, dragrace-allstars S11 —
the latter two of pass-165's five findings). 6 tracked `march`
ticks since yesterday's digest, 5 green + 1 crash (recurrence of
issue #565's prompt-too-long class, unrelated to content). The
nightly `e2e-full` breadth crawl broke its two-night green streak
and breached the 75-minute wall again — candidate #34 (shard the
crawl) is now 61 days unpromoted, still the file's longest-lived
open item. Deploy is ready at HEAD (487acb2a).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:07–17:25 (09-19) | c439d8d8 | critique | pass 165 — 5 findings (0 high, 2 medium, 3 low) |
| 19:35–20:21 (09-19) | 0d44db01, ca60efac | content + audit | masterchef global-gauntlet repetition redirect fix |
| 21:44–22:29 (09-19) | 4c4e77f5, aab02872 | content + audit | vanderpump-rules S12 canon-repetition redirect fix |
| 00:01–00:50 (09-20) | 2a013f76 | sweep | weekly season sweep — 3 new gap-slots found (first genuine find in 3 sweeps), gap 41→44 |
| 00:39–01:58 (09-20) | — | e2e-full (nightly) | red — 75-min duration-ceiling breach, 9,104/10,603 (85.9%), issue #636 recurrence |
| 05:24–06:09 (09-20) | fe5a3fb3, 487acb2a | content + audit | dragrace-allstars S11 watch_list repetition redirect fix |
| 10:05–10:50 (09-20) | — | march (crashed) | issue #565 recurrence — prompt-too-long context growth, first since 09-14 |

5 of 6 `march` ticks shipped real redirect-fallback or critique
work; 1 crashed (context growth, not a content or code defect);
the separate nightly `e2e-full` breadth run also went red.

## The saga

**Rule 2 (season-fill drain):** the eleventh full weekly sweep
(due today, landed on schedule) found its first genuine new gaps
since the 2026-08-23 sweep — american-ninja-warrior's confirmed
S19+S20 double-renewal (2 slots) and survivor-australia's
confirmed Season 13 renewal (1 slot) — plus 8 status-field hygiene
corrections (airing→hiatus for shows whose latest season already
concluded). Gap table moved **41 shows/41 slots → 44 shows/44
slots**, but every one of the 44 rows remains starred
confirmed-but-unaired (no premiere or air date has landed yet for
either new find), so Rule 2 is still not actionable this window —
same structural lock as the prior two sweeps, just with a larger
starred backlog now.

**Rule 3 (themed lists):** no ship this window; no evidence
checked separately, but no commit touched `content/themes/`.

**The redirect fallback carried the window again.** With Rule 2
locked and Rule 3 quiet, three more critique-flagged repetition
fixes landed, two of them directly from pass-165's own finding
list: masterchef global-gauntlet's repeated judges/regions/bracket
fact set, and dragrace-allstars S11's watch_list re-explanation of
the reentry mechanic (a gap pass-165 explicitly flagged as outside
the scope of an earlier same-tick fix). vanderpump-rules S12's
canon-repetition fix landed the same way but wasn't itself in
pass-165's finding list — likely an independent redirect-lane pick
against an older open CRITIQUE row. Catalog holds flat at **68
shows / 1,052 seasons / 68 canons / 182 themes** — no new season
or list filed this window, all three ships were rewrites of
existing files.

## Queues now

- **`plan/CRITIQUE.md`**: pass 165 (2026-09-19 17:22, commit
  c439d8d8), 5 findings (0 HIGH, 2 MED, 3 LOW). File still too
  large for a direct `Read`; `grep`/`awk` remain the only safe
  access path.
- **`plan/AUDIT.md`**: 7 Pending rows, same count as yesterday: 2
  HIGH (the-voice factual corruption #762, still frozen — S30
  premieres tomorrow, 2026-09-21, now 1 day out; night.yml
  starvation row / candidate #35, no new occurrence, streak now
  ~19 consecutive clean nights since 2026-09-01), 2 MED
  (season-fill drain, now 44/44 all-starred after today's sweep;
  e2e-full duration-ceiling row, candidate #34, third breach after
  a two-night green streak), 3 LOW (SERP description budget;
  `YEAR_TENURE_RE` teen-number gap; heartbeat false-positive #806,
  no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still
  2026-09-16 (commit 17d830ee, pass 71) — no pass this window. 39
  numbered candidates under "Considered (awaiting promotion)."
  Candidate #34 (shard e2e-full) is now **61 days unpromoted**,
  still the file's longest-lived open item; candidate #35
  (decouple night.yml) remains healthy but technically unpromoted.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) is the most time-pressured given tomorrow's S30
  premiere; #758 (content-gap dispatch starving /iterate, filed
  2026-08-08) still reads stale against three more weeks of
  redirect-fallback evidence — see Needs you.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **the-voice factual corruption (issue #762) — S30 premieres
   tomorrow, 2026-09-21.** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix; live frontmatter still
   reads `status: hiatus` with a false "show has ended" framing
   that a real premiere tomorrow will make more visible, not less.
2. **Candidate #34 (shard e2e-full) crossed 61 unpromoted days.**
   Two green nights (09-18, 09-19) turned out to be variance, not
   a trend break — tonight's run reverted to the standard breach.
   The fix is still a `.github/workflows/e2e-full.yml` edit the
   cloud loop cannot push; only a local/`/oversight` session closes
   this.
3. **Issue #758 ("content-gap dispatch is starving /iterate")
   still reads stale and worth closing** — three more
   redirect-fallback ships landed this window (masterchef,
   vanderpump-rules, dragrace-allstars), all explicitly citing the
   working fallback the issue was asking for.
4. **Today's march crash (issue #565, 10:05–10:50 UTC) is a known,
   non-actionable class** (prompt-too-long context growth
   mid-turn) — first recurrence since 09-14, no new information,
   nothing to route beyond the existing `/oversight` note on that
   issue.

## Today's intent

Rule 2 is unlocked in principle (44 gap-slots exist) but not in
practice (every row starred, no confirmed air date yet) — expect
the redirect fallback to keep carrying content ticks until one of
the 44 rows gets a real date. Top non-content finding: candidate
#34's 61-day-and-counting unpromoted status is the strongest
standing case in the file for a local `/oversight` session,
alongside issue #762's now-1-day-out urgency.

## Tuning proposals

No new meta-loop tuning candidates filed tonight — no mistuned
gate observed; the redirect fallback continues working as designed
(3 more productive ships this window with Rule 2 freshly re-locked
by starring). Two reinforcements appended to already-open
candidates, both data-only (no gate, cadence, or rule edited):

- **Candidate #34** (shard e2e-full): appended 09-20 detail to both
  `plan/AUDIT.md` and `plan/PHASE_CANDIDATES.md` — the two-night
  green streak broke, third breach logged, 61 days unpromoted.
- Noted (not filed as a new candidate) today's issue #565
  recurrence — same non-actionable-from-cloud class documented at
  filing, no new scope information to add.

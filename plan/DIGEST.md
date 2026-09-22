# DIGEST — 2026-09-22

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, fully-green day after yesterday's org-access outage: all
5 tracked `march` ticks in the last 26h shipped real work — zero
crashes, zero no-ops, no candidate #37 recurrence. One critique
pass (167, 4 findings) plus four canon-repetition redirect fixes
across four different shows (Alone: The Skills Challenge,
So You Think You Can Dance, MasterChef, Project Runway) — pass
167's own fact-restatement findings turned into same-window fixes,
continuing the pattern from the last several digests. The nightly
`e2e-full` breadth crawl reverted to **red** after Sunday's green
night — the same chronic single-worker duration-ceiling breach
(candidate #34, now 63 days unpromoted), not a test regression.
Rule 2 stays locked at 44/44 starred gap-slots; catalog holds flat
at 68 shows / 1,052 seasons / 182 themes. Deploy is ready at HEAD
(4720a968).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:11–17:27 (09-21) | ce313e6a | critique | pass 167 — 4 findings (0 high, 3 medium, 1 low) |
| 21:13–21:56 (09-21) | 1d4a1ae4, 1d7674d6 | content + audit | alone-the-skills-challenge canon repetition redirect fix |
| 00:16–00:58 (09-22) | b5d5eedb, 0cd2f9e6 | content + audit | so-you-think-you-can-dance Atlanta canon repetition redirect fix |
| 01:26–02:44 (09-22) | — | e2e-full (nightly) | **red** — 75-min wall, 9,248/10,603 (87.2%) complete, all passing — chronic, candidate #34 |
| 05:22–06:07 (09-22) | 1431a86d, 586599b8 | content + audit | masterchef canon rationale + repetition redirect fix |
| 10:19–11:04 (09-22) | 703b2f5d, 4720a968 | content + audit | project-runway new-york-2025 canon repetition redirect fix |

5 of 5 tracked `march` ticks shipped real work — the first fully
clean, fully-shipping 26h window in recent digest history. All
four content fixes hit the same defect class pass 167 (and the two
passes before it) flagged: canon.md rationale repeating lede/body
facts verbatim. The redirect fallback is working through that
backlog show by show.

## The saga

**Rule 2 (season-fill drain):** unchanged since 09-20's sweep —
gap table holds at **44 shows/44 slots**, every row starred
confirmed-but-unaired. No sweep due this window (weekly cadence,
last ran 09-20, next due ~09-27). Structurally locked, same as
every digest since 09-04.

**Rule 3 (themed lists):** no ship this window; no commit touched
`content/themes/`. Catalog holds at 182 themes.

**The redirect fallback carried the entire window.** Four of four
content ships were canon-repetition fixes, each closing a finding
pass 165/166/167 raised on a different show — the fact-restatement
defect class (canon.md rationale re-stating lede/body facts nearly
verbatim) that's recurred independently across at least six shows
now (Alone: The Skills Challenge, So You Think You Can Dance,
MasterChef, Project Runway this window; Drag Race All Stars and
others in prior windows). Catalog holds flat at **68 shows /
1,052 seasons / 68 canons / 182 themes** — no new season or list
filed this window, all four ships rewrote existing files.

## Queues now

- **`plan/CRITIQUE.md`**: pass 167 (2026-09-21 17:23, commit
  ce313e6a), 4 findings (0 HIGH, 3 MED, 1 LOW) — the same
  fact-restatement class surfaced independently on both
  freshly-sampled shows this pass (Alone: The Skills Challenge,
  So You Think You Can Dance), both since fixed. No pending HIGH
  findings. File still too large for a direct `Read`; `grep`/`awk`
  remain the only safe access path.
- **`plan/AUDIT.md`**: 7 Pending rows, unchanged count from
  yesterday: 2 HIGH (the-voice factual corruption #762, still
  frozen, stale since 2026-08-08 — no calendar.yml entry ever
  landed for the S30 premiere either; night-shift concurrency row
  / candidate #35, no new occurrence since 09-07), 2 MED
  (season-fill drain, 44/44 all-starred, no change; e2e-full
  duration-ceiling row, candidate #34, back to red tonight after
  09-21's green — see above), 3 LOW (SERP description budget;
  `YEAR_TENURE_RE` teen-number gap; heartbeat false-positive #806,
  no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still
  2026-09-16 (commit 17d830ee, pass 71) — **6 days with no pass
  now**, one day longer than yesterday's digest flagged. 39
  numbered candidates under "Considered (awaiting promotion)."
  Candidate #34 (shard e2e-full) is now **63 days unpromoted**,
  still the file's longest-lived open item.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) remains the oldest live urgency, now over 6 weeks
  since last comment despite S30's 09-21 premiere having already
  passed.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **the-voice factual corruption (issue #762) is going stale.**
   No comment since 2026-08-08, S30 premiered 2026-09-21 as
   predicted, and `content/shows/the-voice.md` still reads
   `status: hiatus` with the false "show has ended" framing live.
   The fix needs a human-reviewed 8-file renumbering — it can't
   ship from the loop.
2. **`/expand` hasn't run in 6 days** (last pass 09-16, count 71).
   No queue-starvation symptom yet (39 candidates still sit
   "awaiting promotion"), but the gap is growing one day at a
   time with no sign of the next pass.
3. **Candidate #34 (shard e2e-full) crossed 63 unpromoted days**,
   the single longest-lived item in `plan/PHASE_CANDIDATES.md`.
   Tonight's run reverted to red on the same chronic wall — still
   blocked on a `.github/workflows/e2e-full.yml` edit the cloud
   loop cannot push (lacks `workflows` OAuth scope).
4. **Issue #758** (content-gap dispatch potentially starving
   `/iterate`) sits quiet since 2026-09-18 — today's pulse shows
   no starvation symptom (critique + 4 distinct content fixes all
   shipped), but it's worth a look next time a starved-queue day
   recurs.

## Today's intent

Rule 2 stays locked at 44/44 starred; expect the redirect fallback
to keep working through the fact-restatement backlog (at least two
more shows flagged in pass 165/166 not yet confirmed fixed) until
the next weekly sweep (due ~09-27) turns a real season, or a fresh
critique pass surfaces new targets. Top non-content finding:
candidate #34 crossing 63 unpromoted days on a chronic, well-
documented, cloud-unfixable timeout — still the strongest
standing case for the next `/oversight` session, just ahead of
issue #762's stale-but-urgent the-voice fix.

## Tuning proposals

No new meta-loop tuning candidates filed tonight — no fresh
mistuned gate observed; the redirect fallback continues working
as designed and today's dispatch showed no starvation symptom.
One reinforcement appended directly to the standing AUDIT.md row
(established pattern for this recurring finding, not a new
candidate):

- **Candidate #34** (shard e2e-full): tonight's breach (run
  35675731787, 9,248/10,603 complete, 87.2%) extends the
  alternating breach/green/breach pattern with no clear trend
  either direction after 63 days — still the standing
  `/oversight` recommendation, unchanged in substance.

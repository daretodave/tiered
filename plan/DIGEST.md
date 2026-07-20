# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-20

## Headline

**The cleanest content-gate window on record — 21 themed lists in ~24
hours, zero non-content commits, and only 1 march failure — while the
mobile-overflow bug's spread finally plateaued at 4 URLs even as its fix
path got sharper, and a new, unrelated bug surfaced: two of the last two
shipped phases orphaned their own tracking issues.** 41 commits since the
last digest (21 content + 20 audit-progress — a perfect alternation, no
stragglers), 23 march ticks (21 green, 1 red, 1 still running at read
time). The one failure was issue #565's familiar "prompt is too long"
crash (now 25 recurrences) — down sharply from the last window's 4
failures. The e2e-full breadth crawl is red for an **8th consecutive
night**, but for the first time the affected-URL count held flat at 4
instead of growing, and `plan/CRITIQUE.md`'s pass-94 diagnosis (already on
file, independently arrived at) turns out to name the exact same URL with
a pre-narrowed list of culprits — two detection paths converging on one
bug with a short fix list, still untouched by `/iterate` after 8 days.
Separately, while checking phase-shipping hygiene I found that Phase 44's
and Phase 46's shipping commits both failed to correctly close their
mirror issues (#400 and #405, both still open) — a new, previously
undocumented defect, filed this tick. Deploy is green at HEAD (`f42e52c`).

## While you were out

| Time (UTC, 07-19→20) | Tick | Outcome |
|---|---|---|
| 11:37 (last digest) | digest | success — 2026-07-19 briefing |
| 12:02–17:00 | march → content (5 ticks) | success — 5 themed lists (when-the-crew-stepped-into-frame, built-for-one-playing-as-a-team, away-from-home-turf, the-roster-was-the-twist, two-channels-same-night) |
| 17:03–20:04 | march → content (3 ticks) | success — 3 themed lists (the-elimination-round-never-keeps-its-name, the-clock-had-to-make-room, the-city-already-had-a-show) |
| 21:02–00:02 | march → content (3 ticks) | success — 3 themed lists (twist-is-the-format, the-broadcast-wasnt-the-whole-show, a-second-life-built-into-the-format) |
| 01:12 | march | **failure** — "Prompt is too long" crash, no commit, issue #565 (25th recurrence) |
| 02:35–05:21 | march → content (3 ticks) | success — 3 themed lists (the-finale-broke-its-own-rulebook, the-competition-leaves-the-country, the-grudge-was-the-casting-call) |
| 06:36–09:12 | march → content (3 ticks) | success — 3 themed lists (sight-unseen-already-committed, the-vote-left-the-phone-line, never-starts-cold) |
| 10:36 | march → content | success — themed list (the-couch-kept-adding-chairs) |
| — (nightly, separate workflow) 23:20 07-19 | e2e-full | **red** — mobile overflow held at 4 URLs (no growth), 8th consecutive red night, crawl cut at 75-minute step ceiling (9,411/9,927 tests, 94.8%) |
| ~10:59–11:38 | march → content (2 ticks) | success — 2 themed lists (the-team-never-means-the-same-thing-twice, the-format-learned-to-travel) — plus one more (the-slow-build-was-the-point) landed just before this read |
| 11:37 | march | in progress at read time (conclusion not yet recorded) |

Net: 23 march ticks in the window — 21 green, 1 red (issue #565's crash
pattern, self-healed on the next retry, zero content lost), 1 still
running. Every green content tick fell through to Rule 3 — zero ticks
reached `/critique`, `/iterate`, `/expand`, `/ship-a-phase`, `/ship-data`,
or the weekly sweep (not due until 2026-07-26).

## The saga

**Shows scaffolded:** 0 — still LOCKED per the 2026-07-12 mission pivot.
Catalog holds at **68 shows**, 1,040 season files.

**Seasons drained:** none — Rule 2 stayed structurally stalled on the same
all-starred (confirmed-but-unaired) gap table all window (28 shows / 29
gap-slots). No sweep ran this window (last one 2026-07-19, next due
2026-07-26), so no new gap-table evidence either way.

**Themed lists (Rule 3):** **21 lists shipped this window** — a new high,
up from 17 at the last digest. Ledger (`plan/LISTS.md`) now **77 rows**,
up from 56. Titles: when-the-crew-stepped-into-frame,
built-for-one-playing-as-a-team, away-from-home-turf,
the-roster-was-the-twist, two-channels-same-night,
the-elimination-round-never-keeps-its-name, the-clock-had-to-make-room,
the-city-already-had-a-show, the-twist-is-the-format,
the-broadcast-wasnt-the-whole-show, a-second-life-built-into-the-format,
the-finale-broke-its-own-rulebook, the-competition-leaves-the-country,
the-grudge-was-the-casting-call, sight-unseen-already-committed,
the-vote-left-the-phone-line, never-starts-cold,
the-couch-kept-adding-chairs, the-team-never-means-the-same-thing-twice,
the-format-learned-to-travel, the-slow-build-was-the-point. "Ideas"
parking lot still empty — no sign of angle exhaustion after 77 lists.
**Category-balance note (a good one):** the ledger's category mix is now
41 craft / 13 structure / 11 single / 7 tone / 4 era — craft has been
badly oversaturated (41/77, >50%) for several windows, and tonight's final
tick (`the-slow-build-was-the-point`) explicitly self-corrected, steering
into `tone` (6 lists at the time) rather than defaulting to craft again.
Worth watching whether this becomes a repeated pattern or was a one-off.

**Velocity vs. bearings:** Rule 1 (show coverage) — LOCKED, correctly
idle. Rule 1a (weekly sweep) — not due this window (next 2026-07-26), no
new evidence. Rule 2 (season completeness) — third straight full-window
stall since the pivot, still a real-world calendar artifact. Rule 3
(themed lists) — new velocity high (21 vs. 17), and the first sign this
window of the loop noticing and correcting its own category skew without
being told to.

**Critique backlog:** still pass **94** (2026-07-16, `plan/CRITIQUE.md`
flat at 3,513 lines) — now **4 days stale**, unchanged from the last
digest. Both open pass-94 findings remain unresolved: the mobile-overflow
HIGH (now directly relevant to tonight's AUDIT update — see below) and the
Chopped S62 repetition MED.

## Queues now

- **AUDIT.md open:** 6 rows. The mobile-overflow row (HIGH, score 5.4,
  issue #568) is the longest-standing real finding — **8 days old**,
  URL count held at 4 for the first time, now cross-referenced against
  CRITIQUE pass-94's independent diagnosis of the same URL (see Needs
  you). One **new** row filed this tick (LOW, score 3.6): the
  `/ship-a-phase` mirror-close trailer bug (issues #400, #405 both
  orphaned). The standing Rule-2 drain row stays Pending by design (28
  shows, all starred).
- **CRITIQUE.md:** pass 94 (2026-07-16), 3,513 lines, 4 days stale — no
  growth since the last digest.
- **PHASE_CANDIDATES.md:** now 4,801 lines (was 4,775), candidate #33
  reinforced this tick with the plateau + cross-reference evidence. Top
  unpromoted scores unchanged: **#15 (9.4)** show canon completeness
  gate, **#28 (8.3)** stat-tile literal-duplicate invariant, **#25
  (8.0)** canon-rationale echo gate, **#33 (5.5)** content-gate
  bug-priority carve-out. Last real promotion is now **39 days stale**
  (2026-06-11).
- **Triage:** 4 `triage:needs-user` open: **#565** (prompt-too-long
  crash, now **25 recurrences**, 1 more this window), **#586** (night
  digest crash 07-16, no new recurrence), and the long-stale **#398/#399**
  (39-40 days, no owner action). 1 `triage:loop-queued`: **#568**
  (mobile-overflow, 8 comments, 8 days old, still HIGH).

## Needs you

1. **The mobile-overflow bug (issue #568) is 8 days old, on its 8th
   consecutive red breadth night, but its spread has stopped** — the
   affected-URL count held at 4 tonight instead of growing, and the
   75-minute crawl step is hitting its wall clock at a stable ~94.8%
   complete (not eroding further, not recovering). The more actionable
   news: `plan/CRITIQUE.md` pass 94 independently diagnosed the exact
   same URL (`/shows/the-real-world/season/go-big-or-go-home`) via the
   cloud walker three days before tonight's crawl even ran, and already
   narrowed the cause to one of three named candidates — a long
   `location`/`filming_caption` string, the forced `<br/>` in
   `display_title: "Go Big<br/>or Go Home"`, or `AdjacentSeasons.tsx`
   rendering — while ruling out the mobile stacking media query. I've
   folded this cross-reference into the AUDIT row and into candidate
   #33. This is now the shortest this bug's fix path has ever looked,
   and it's had zero `/iterate` attention across 8 days because the
   content-gate hasn't yielded a single tick since the row was filed.
   Worth an explicit decision on candidate #33.
2. **New finding: `/ship-a-phase`'s close trailer failed on both of the
   last two phases shipped.** Phase 44's commit (`b8ebba8`) has no
   `Closes #N` trailer at all, orphaning issue #400. Phase 46's commit
   (`9ed40d5`) has `Closes #46` — the phase *number*, not the mirror
   issue number — which resolves to an unrelated, already-closed May
   issue, orphaning issue #405. Both #400 and #405 are still open. I
   checked all 30 other closed phase-mirror issues (Phase 1–45 excluding
   44/46) and every one closed correctly, so this looks like an isolated
   two-phase slip rather than a systemic pattern — but the mechanism
   (phase-number/issue-number confusion, or an omitted trailer) could
   recur. Filed as a new LOW AUDIT row (score 3.6). Digest is notes-only
   scope, so #400/#405 were not closed manually this tick — that's a
   short, low-risk cleanup task for a local session.
3. **Issue #565's crash pattern is now at 25 recurrences** (1 more this
   window, down sharply from 3 the prior window). Fully self-healing,
   zero content lost. Candidate #29 (archive closed rows) remains the
   standing unpromoted mitigation.
4. **Issue #586 (night-shift crash on 07-16)** — no new recurrence since,
   still looks transient.
5. **`triage:needs-user` issues #398/#399 are now 39-40 days stale** with
   no apparent progress since filing 2026-06-11.
6. **Phase-candidate backlog hasn't been promoted in 39 days.** #15
   (score 9.4) is still the standout, followed by #28 (8.3) and #25
   (8.0).

## Today's intent

**Saga:** Rule 2 stays stalled — next actionable drain fires whenever a
deferred air date passes or next week's sweep (2026-07-26). Expect Rule 3
to keep absorbing every content tick; watch whether tonight's tone-steer
on category balance repeats, since craft is still at 41/77 (~53%) of the
ledger.

**Top non-content finding:** the mobile-overflow bug (issue #568, HIGH,
score 5.4) — 8 days old, spread has plateaued at 4 URLs, and two
independent diagnoses (breadth crawl + critique pass 94) now agree on the
URL and narrow the fix to three named candidates. The single highest-value
non-content action available, blocked only by gate design (candidate #33).

**Second-priority finding:** the new `/ship-a-phase` mirror-close bug
(issues #400, #405 orphaned) — small, isolated so far, but worth a quick
manual close-and-comment plus a look at the close-trailer logic before the
next phase ships.

## Tuning proposals

1. **Reinforced candidate #33** (content-gaps gate bug-priority
   carve-out) with this tick's evidence: issue #568's URL count plateaued
   at 4 (first time not growing) and its fix path sharpened via the
   CRITIQUE pass-94 cross-reference; the content-gate window is now the
   cleanest on record (41/41 commits content/audit, zero yield to any
   other verb). No change to score or scope sketch — evidence only,
   `/oversight` decides.
2. **Candidate #29** (archive closed rows) remains the standing proposed
   fix for `plan/CRITIQUE.md` (3,513 lines, flat) and
   `plan/PHASE_CANDIDATES.md` (now 4,801 lines, growing) — no new
   evidence to add beyond issue #565's continued (slower) recurrence.
3. **No new candidate filed for the phase-mirror-close bug** — evidence
   (2 isolated instances, 30/30 other phases correct) doesn't yet
   warrant a rails change; filed as an AUDIT row instead so a future
   `/iterate` or local session can decide whether it needs a process fix
   or was a one-time double-slip.

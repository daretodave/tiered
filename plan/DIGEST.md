# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-18

## Headline

**Rule 2 hit a wall, Rule 3 caught the fountain cleanly.** Every
remaining row in the `plan/CADENCE.md` gap table (28 shows) now
carries an individual confirmed-but-unaired star — the first tick
since the 2026-07-12 mission pivot where the *entire* season-fill
board is deferred to real-world air dates, not a gap-zero state.
The loop noticed and fell through to Rule 3 without missing a
beat: **16 themed lists shipped in ~26 hours** (LISTS.md ledger now
40 rows, up from ~20 at the last digest), plus 3 season-fill
drains that did land (The Real World to 33/33 — fully drained,
dragrace-allstars S11, Love Island US S8 post-finale shift-note).
38 commits total, one triage tick, zero `/critique` / `/iterate`
/ `/expand` / `/ship-a-phase` / `/ship-data` runs. **The cost
compounded**: the e2e-full breadth crawl is now on its **5th
straight red night** (07-13 through 07-17) on the same mobile-
overflow defect class, which just grew from 2 affected URLs to
**3** (`the-real-world/season/go-big-or-go-home` joined last
night) — critique pass 94 (07-16) independently caught the same
bug on that URL and filed a HIGH finding for it, so this is now
double-confirmed and 5 days old (issue #568, AUDIT score 5.4,
still the highest-scoring non-standing row) with no path to
`/iterate` because the content-gate is designed to run
indefinitely. Separately, two cloud `march` ticks (00:01 and
00:03 UTC, both nights right after the breadth crawl) hard-failed
on "Prompt is too long" — issue #565's crash pattern, now **20
recurrences**. The night shift itself missed two nights: 07-16
crashed on an org-level Claude access error ("Your organization
has disabled Claude subscription access"), 07-17 was cancelled by
the overlap — both look transient (today's run is clean) but
worth a glance. Deploy is green at HEAD (`fdbb268`).

## While you were out

| Time (UTC, 07-17→18) | Tick | Outcome |
|---|---|---|
| 09:12–10:07 | march → content (2 ticks) | success — 2 themed lists (new-flags-planted-fast, built-for-the-drop) |
| 11:47 | march → triage | success — 1 issue processed, 0 user-call |
| 15:06 | march → content | success — The Real World S32-33 backfill + canon rebase, **fully drained (33/33)** |
| 15:50–23:05 | march → content (7 ticks) | success — 7 themed lists (closing-statement, new-network-same-rulebook, one-rule-fills-every-seat, the-place-fought-back, the-house-that-kept-changing, tried-once-never-repeated, not-who-they-say-they-are) |
| 23:49 (07-17) | march → content | success — dragrace-allstars S11 season-fill drain |
| — (nightly, separate workflow) 23:18 07-17 | e2e-full | **red** — mobile overflow now on 3 URLs (the-challenge, american-ninja-warrior/the-runoffs, the-real-world/go-big-or-go-home), 5th consecutive red night, recurred on issue #568 |
| 00:01 | march | **failure** — "Prompt is too long" crash, no commit, recurred on issue #565 (20th occurrence) |
| 01:56 | march → content | success — Love Island US S8 post-finale shift-note + finale-shift, closed the deferred row |
| 03:33–10:54 | march → content (7 ticks) | success — 7 themed lists (who-actually-got-the-vote, the-shifting-yardstick, the-schedule-didnt-ask-permission, pre-recap-culture-seasons, milestones-spent-not-marked, same-crown-new-price-tag, the-cast-outgrew-the-format) |

Net: 38 commits (19 content — 16 themed lists + 3 season-fill/
finale-shift — + 18 audit-progress notes + 1 triage) across ~18
march ticks in the window — 17 green, 1 red (prompt-too-long
timeout). Every green content tick fell through to Rule 3; zero
ticks reached `/critique`, `/iterate`, `/expand`, `/ship-a-phase`,
or `/ship-data`.

## The saga

**Shows scaffolded:** 0 — still LOCKED per the 2026-07-12 mission
pivot. Catalog holds at **68 shows**, 1,040 season files.

**Seasons drained:** The Real World finished (32-33 filed, **fully
drained 33/33**), dragrace-allstars S11 filed, Love Island US S8
closed out its post-finale shift-note. Beyond that, **Rule 2 is
structurally stalled** — every one of the 28 remaining
`plan/CADENCE.md` gap rows now carries a confirmed-but-unaired
star (closest to unstarring: masterchef-australia S18, finale
likely early-to-mid August; alone-australia S4, premiered
2026-07-15, three days old). This is not the gap-zero state that
would unlock the biweekly show-add clock or flip the content-gate
closed — it's a temporary pipeline stall on real-world broadcast
calendars. Next actionable drain fires on the weekly sweep (due
2026-07-19, tomorrow) or whenever a deferred date passes.

**Themed lists (Rule 3):** the mission's real engine this window —
**16 lists shipped in ~26 hours**, the fastest Rule-3 velocity
logged since the pivot. Ledger now 40 rows (was ~20 at the last
digest four days ago). Categories this window skew craft/structure
with a few tone/era/single entries — no obvious angle exhaustion
yet, `plan/LISTS.md`'s "Ideas" parking lot is still empty (lists
are being invented fresh each tick rather than drawn from a seed
queue, which is fine per the mission note but worth watching if
velocity ever stalls).

**Velocity vs. bearings:** Rule 1 (show coverage) — LOCKED,
correctly idle. Rule 1a (weekly sweep) — due tomorrow (07-19).
Rule 2 (season completeness) — first-ever full-board stall since
the pivot; not a bug, a real-world calendar artifact. Rule 3
(themed lists) — running at its highest recorded velocity,
correctly absorbing every tick Rule 2 can't use.

**Critique backlog:** pass **94** (2026-07-16, commit `e2dfbc8`),
2 days old — advanced since the 07-15 digest (was stuck at pass
93 for 3 days). Pass 94 filed 2 findings: 1 HIGH (The Real World
S31 mobile overflow, 7px breach — now confirmed a second way by
last night's breadth crawl) and 1 MED (Chopped S62 verbatim
repetition across body/canon/watchlist). Both unresolved.

## Queues now

- **AUDIT.md open:** several real rows, longest-standing being
  the mobile-overflow bug (MED, score **5.4**, issue #568) — now
  **5 days old**, grown from 1 URL to 3, and independently
  reconfirmed by critique pass 94. The standing Rule-2 drain row
  stays Pending by design (28 shows, all starred). Chopped S62
  verbatim-repetition finding from pass 94 does not yet appear
  filed as its own AUDIT row — worth confirming it lands one.
- **CRITIQUE.md:** pass **94** (2026-07-16), 3,513 lines — grew
  from 3,463 at the last digest despite the 3-day critique
  silence noted then; still only one pass since 07-12 (pass 93),
  now two since.
- **PHASE_CANDIDATES.md:** 4,691 lines (was 4,588), pass 56 still
  the last recorded expand pass. Top unpromoted scores unchanged:
  **#15 (9.4)** show canon completeness gate, **#28 (8.3)**
  stat-tile literal-duplicate invariant, **#25 (8.0)** canon-
  rationale echo gate, **#29 (5.0)** archive closed
  CRITIQUE.md/AUDIT.md rows (directly relevant to the #565 crash
  pattern below). Last real promotion is now **37 days stale**
  (2026-06-11).
- **Triage:** 0 unlabeled open issues (10 open total). 4
  `triage:needs-user`: **#565** (prompt-too-long crash, now **20
  recurrences**, 2 more landed overnight), **#586** (night digest
  crashed 07-16 on an org Claude-access error, unaddressed), and
  the long-stale **#398/#399** (37-38 days, no owner action). 1
  `triage:loop-queued`: **#568** (mobile-overflow, now 3 URLs, 5
  days old).

## Needs you

1. **The mobile-overflow bug (issue #568) is 5 days old, on its
   5th consecutive red breadth night, and just grew from 2 URLs to
   3** (`the-real-world/season/go-big-or-go-home` joined
   `the-challenge/season/vets-and-new-threats` and
   `american-ninja-warrior/season/the-runoffs`). Critique pass 94
   independently caught the same defect on the same URL and filed
   it as a HIGH finding — two independent detection paths now agree.
   It has the highest score (5.4) of any non-standing AUDIT row and
   a scoped fix path (trace files captured on all three URLs), but
   `/iterate` structurally cannot reach it: `skills/march.md` Step
   3b.5 is designed to dispatch to content (Rule 2, then Rule 3)
   "on most content-eligible ticks indefinitely" per the 07-12
   pivot, and Rule 3's mission ("hundreds of lists over months and
   years") means the content-gate may now genuinely never yield on
   its own. The 07-15 digest proposed a scoped bug-priority
   carve-out for exactly this scenario but it was never filed to
   `plan/PHASE_CANDIDATES.md` (only written into that day's
   DIGEST.md, which then got overwritten) — re-proposed below with
   fresh numbers now that the bug has grown from 2 URLs to 3 and
   aged from 3 days to 5. Worth an explicit decision either way.
2. **Issue #565's "Prompt is too long" crash pattern is now at 20
   recurrences**, including 2 more overnight (00:01 and 00:03 UTC,
   both nights, both right after the e2e-full breadth crawl window
   closes — worth checking whether that timing correlation is
   causal, e.g. shared runner resource pressure, or coincidental).
   `plan/CRITIQUE.md` (3,513 lines) and `plan/PHASE_CANDIDATES.md`
   (4,691 lines) keep growing with no archival mechanism; candidate
   #29 (score 5.0, archive closed rows) is the standing proposed
   fix and remains unpromoted.
3. **Issue #586: the night shift crashed outright on 2026-07-16**
   with "Your organization has disabled Claude subscription
   access for Claude Code — Use an Anthropic API key instead, or
   ask your admin to enable access." This is an org/billing-level
   error, not a code bug — today's run completed cleanly, so it
   looks transient, but it's outside the loop's ability to self-
   heal and cost one full digest cycle (07-17's run was then
   cancelled by the overlap, so no digest existed for 3 days
   straight until this one).
4. **Two `triage:needs-user` issues (#398, #399) are now 37-38
   days stale** with no apparent progress since filing 2026-06-11.
5. **Phase-candidate backlog hasn't been promoted in 37 days.**
   #15 (score 9.4, show canon completeness gate) is still the
   standout, followed by #28 (8.3) and #25 (8.0).

## Today's intent

**Saga:** Rule 2 stays stalled until the weekly sweep (due
tomorrow, 07-19) or a deferred air date passes — expect Rule 3 to
keep absorbing every content tick at its current ~16-lists/26h
pace. Watch `plan/LISTS.md`'s empty "Ideas" queue; if list
invention ever slows, that queue is the fallback.

**Top non-content finding:** the mobile-overflow bug (issue #568,
AUDIT score 5.4) — 5 days old, 3 URLs, independently reconfirmed
by critique pass 94. The single highest-value non-content action
available, blocked only by gate design.

**Second-priority finding:** issue #565's crash pattern — 20
recurrences, candidate #29 already proposes the fix, needs
promotion.

## Tuning proposals

1. **Re-proposing the content-gaps bug-priority carve-out** (first
   raised 07-15, never filed — re-filing now with updated
   evidence). `skills/march.md` Step 3b.5 dispatches to content
   whenever any `category: content-gaps` row is Pending, and is
   explicitly documented to fire "on most content-eligible ticks
   indefinitely" now that Rule 3 is the perpetual objective. That's
   correct by design, but issue #568 has now sat unaddressed for 5
   days and spread from 1 URL to 3 while the gate never once
   yielded. Evidence: 38 commits this window, 100%
   content/audit/triage, 0% iterate/critique/expand/phase/data —
   the fourth straight digest window with that shape. Proposing the
   same scoped carve-out as before: if `plan/AUDIT.md` has a
   non-content-gaps row scoring ≥5.0 (above the standing row's own
   4.5), let Step 3b.5 yield to Step 3d for one tick before
   returning to content. This is a rails change — proposing only,
   `/oversight` decides.
2. **Reinforcing candidate #29** (archive closed CRITIQUE.md/
   AUDIT.md rows) with fresh numbers: issue #565 hit 20 total
   recurrences, 2 more overnight, both immediately after the
   nightly e2e-full window closes — a timing pattern worth
   checking for a causal link (shared runner load) rather than
   coincidence. `plan/CRITIQUE.md` (3,513 lines) and
   `plan/PHASE_CANDIDATES.md` (4,691 lines) have grown, not
   shrunk, since the 07-15 digest — consistent with zero
   `/critique`/`/expand` prune passes running in the interim.
3. **New — the night shift has no resilience to org-level Claude
   access errors.** 07-16's run failed outright on "organization
   has disabled Claude subscription access," and the resulting gap
   (no digest 07-16 or 07-17) meant AUDIT/CRITIQUE/PHASE_CANDIDATES
   evidence went unread and unfiled for 3 days. This is likely
   transient and outside the workflow's control, but if it recurs
   a simple one-retry-after-delay step in `night.yml` would turn a
   3-day blackout into a same-morning retry. Low-cost, low-urgency
   — flagging for awareness rather than proposing a scored
   candidate.

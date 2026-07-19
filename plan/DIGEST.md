# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-19

## Headline

**Rule 3 kept the fountain running — 17 themed lists in ~26 hours,
the highest velocity yet — while the mobile-overflow bug quietly
crossed a threshold that changes its diagnosis.** 36 commits total
(17 content + 15 audit-progress + 2 triage + 1 sweep + 1 digest),
25 march ticks (21 green, 4 red — all the same self-healing
"prompt is too long" crash, issue #565, now 24 recurrences). The
weekly sweep (Rule 1a, due today) ran on schedule and found one
genuine gap on survivor-australia — then the very next tick caught
it as a false positive (a season-numbering-convention collision
with content seeded a month earlier) and self-corrected same-day,
a clean catch worth noting. The real story is the e2e-full breadth
crawl: **6th consecutive red night**, and the mobile-overflow
defect it's been flagging since 07-13 just grew from 3 affected
URLs to **4** (`love-island-us/season/fiji-2026` joined tonight) —
four different shows, four different season slugs, both
`season-page.spec.ts` and `smoke-mobile.spec.ts` failing
identically on all four. That pattern rules out a per-content fix;
this is a shared-component CSS defect. I've escalated the
AUDIT.md row MED→HIGH and reinforced `PHASE_CANDIDATES.md`
candidate #33 (the content-gate bug-priority carve-out) with the
new evidence — it's the highest-scoring non-standing row for the
7th straight digest window and the content-gate has never once
yielded to `/iterate` in that span. Deploy is green at HEAD
(`e5110ba`).

## While you were out

| Time (UTC, 07-18→19) | Tick | Outcome |
|---|---|---|
| 09:07–10:54 | march → content (3 ticks) | success — 3 themed lists (milestones-spent-not-marked, same-crown-new-price-tag, the-cast-outgrew-the-format) |
| 11:03 | digest | success — 2026-07-18 briefing |
| 13:23 | march → content | success — themed list (the-judges-picked-a-side) |
| 14:55 | march → triage | success — 1 issue processed, 0 user-call |
| 17:26–18:14 | march → content (2 ticks) | success — 2 themed lists (same-license-different-rules, been-here-before) |
| 18:01 | march | **failure** — "Prompt is too long" crash, no commit, issue #565 (recurrence) |
| 20:57 | march → triage | success — 1 issue processed, 0 user-call |
| 22:10–23:53 | march → content (3 ticks) | success — 3 themed lists (the-mic-changed-hands, live-without-a-net, a-guest-spot-with-room-to-grow) |
| — (nightly, separate workflow) 23:19 07-18 | e2e-full | **red** — mobile overflow now 3 URLs, 5th consecutive red night, recurred on issue #568 |
| 00:42 | march → sweep | success — weekly season sweep (Rule 1a, on schedule): survivor-australia flagged as a 2-season gap |
| 02:05 | march → content | success — themed list (one-season-two-flags) + audit correction: survivor-australia gap was a false positive (numbering-convention collision with content already seeded 2026-06-20), self-corrected same tick |
| 03:26–05:54 | march → content (2 ticks) | success — 2 themed lists (a-change-of-address, the-hand-behind-the-couple — the latter landed without a matching audit-progress commit this tick, unlike every other content tick this window) |
| 05:53–10:59 | march → content (5 ticks) | success — 5 themed lists (before-the-spinoff-had-a-name, not-the-usual-episode-order, played-it-straight, running-long-running-short, the-other-side-of-the-table) |
| 08:30 | march | **failure** — "Prompt is too long" crash, no commit, issue #565 (recurrence) |
| 09:23 | march | **failure** — "Prompt is too long" crash, no commit, issue #565 (recurrence, 3rd this window) |

Net: 25 march ticks in the window — 21 green, 4 red (all issue
#565's crash pattern, all self-healed on the very next retry, zero
content lost). Every green content tick fell through to Rule 3;
zero ticks reached `/critique`, `/iterate`, `/expand`,
`/ship-a-phase`, or `/ship-data`.

## The saga

**Shows scaffolded:** 0 — still LOCKED per the 2026-07-12 mission
pivot. Catalog holds at **68 shows**, 1,040 season files.

**Seasons drained:** none landed this window — Rule 2 stayed
structurally stalled on the same all-starred (confirmed-but-unaired)
gap table as the last two digests. The weekly sweep (due today,
ran on schedule at 00:42) found one apparent new gap
(survivor-australia S13/S14) but it was a false positive, caught
and corrected same-day: the content was already seeded a month ago
under a different season-numbering convention. Gap table is back
to 28 shows / 29 gap-slots, all starred, zero actionable Rule 2
work.

**Themed lists (Rule 3):** **17 lists shipped in ~26 hours** — a
new high, up from 16 at the last digest. Ledger (`plan/LISTS.md`)
now 56 rows, up from 40 at the last digest. Titles this window: milestones-spent-not-marked,
same-crown-new-price-tag, the-cast-outgrew-the-format,
the-judges-picked-a-side, same-license-different-rules,
been-here-before, the-mic-changed-hands, live-without-a-net,
a-guest-spot-with-room-to-grow, one-season-two-flags,
a-change-of-address, the-hand-behind-the-couple,
before-the-spinoff-had-a-name, not-the-usual-episode-order,
played-it-straight, running-long-running-short,
the-other-side-of-the-table. "Ideas" parking lot in `LISTS.md`
still empty — lists keep getting invented fresh each tick, no sign
of angle exhaustion.

**Velocity vs. bearings:** Rule 1 (show coverage) — LOCKED,
correctly idle. Rule 1a (weekly sweep) — ran on schedule today
(2026-07-19), next due 2026-07-26; one false-positive gap
self-corrected same day, worth a light process note (see Needs
you). Rule 2 (season completeness) — second straight full-board
stall since the pivot, still a real-world calendar artifact, not a
bug. Rule 3 (themed lists) — new velocity high, correctly
absorbing every tick Rule 2 can't use.

**Critique backlog:** still pass **94** (2026-07-16, commit
`e2dfbc8`) — now **3 days stale**, unchanged from the last digest.
`plan/CRITIQUE.md` holds flat at 3,513 lines (no growth, meaning
no new pass ran). Both of pass 94's findings (mobile overflow HIGH,
Chopped S62 repetition MED) remain unresolved.

## Queues now

- **AUDIT.md open:** the mobile-overflow row (now HIGH, score 5.4,
  issue #568) is the longest-standing real finding — **6 days
  old**, grown from 1 URL to 4, escalated this tick. The standing
  Rule-2 drain row stays Pending by design (28 shows, all starred).
- **CRITIQUE.md:** pass 94 (2026-07-16), 3,513 lines, 3 days stale
  — no growth since the last digest, confirming zero critique
  passes ran this window either.
- **PHASE_CANDIDATES.md:** 4,756 lines (was 4,691 before this
  tick's candidate #33 update), pass 56 still the last recorded
  expand pass. Top unpromoted scores unchanged: **#15 (9.4)** show
  canon completeness gate, **#28 (8.3)** stat-tile literal-duplicate
  invariant, **#25 (8.0)** canon-rationale echo gate, **#33 (5.5)**
  content-gate bug-priority carve-out (reinforced this tick). Last
  real promotion is now **38 days stale** (2026-06-11).
- **Triage:** 4 `triage:needs-user` open: **#565** (prompt-too-long
  crash, now **24 recurrences**, 3 more landed this window),
  **#586** (night digest crashed 07-16 on an org Claude-access
  error, unaddressed), and the long-stale **#398/#399** (38-39
  days, no owner action). 1 `triage:loop-queued`: **#568**
  (mobile-overflow, now 4 URLs, 6 days old, escalated to HIGH this
  tick).

## Needs you

1. **The mobile-overflow bug (issue #568) is now 6 days old, on
   its 6th consecutive red breadth night, and just crossed from 3
   URLs to 4** (`love-island-us/season/fiji-2026` joined
   `the-challenge/season/vets-and-new-threats`,
   `american-ninja-warrior/season/the-runoffs`,
   `the-real-world/season/go-big-or-go-home`). All four fail
   identically on both `season-page.spec.ts:172` and
   `smoke-mobile.spec.ts:25` — four different shows, four different
   season slugs, same 375px overflow signature. This confirms a
   shared-component CSS defect, not four separate content-string
   issues, which sharpens the fix scope considerably from the
   07-13 filing. I escalated the AUDIT.md row to HIGH this tick.
   It has the highest score (5.4) of any non-standing row and now
   a much better-scoped fix path, but `/iterate` structurally
   cannot reach it — same gate-design reason as the last two
   digests (`skills/march.md` Step 3b.5 dispatches to content on
   "most content-eligible ticks indefinitely"). Candidate #33 (the
   proposed carve-out) is reinforced with this tick's evidence.
   Worth an explicit decision.
2. **Issue #565's "Prompt is too long" crash pattern is now at 24
   recurrences**, 3 more this window (18:01, 08:30, 09:23 UTC — no
   longer clustered right after the e2e-full window as the last
   digest wondered; this window's three are spread across the day,
   which argues against the runner-resource-pressure theory).
   Still fully self-healing on the next retry, zero content lost.
   Candidate #29 (archive closed CRITIQUE.md/AUDIT.md rows, the
   standing proposed mitigation) remains unpromoted.
3. **Issue #586 (night-shift crash on 07-16)** — no new
   recurrence since, still looks transient, still worth a glance
   given it cost 2 blackout days at the time.
4. **`triage:needs-user` issues #398/#399 are now 38-39 days
   stale** with no apparent progress since filing 2026-06-11.
5. **Phase-candidate backlog hasn't been promoted in 38 days.**
   #15 (score 9.4, show canon completeness gate) is still the
   standout, followed by #28 (8.3) and #25 (8.0).
6. **Light process note (not scored):** the 00:42 weekly sweep
   flagged a false-positive gap on survivor-australia that a later
   tick caught and corrected same-day — no user action needed, the
   loop self-healed cleanly, but two sweeps in a row have now
   surfaced numbering-convention edge cases (this one, plus the
   known suspect frontmatter counts on the standing Rule-2 row).
   Worth a passing glance if a third one shows up.

## Today's intent

**Saga:** Rule 2 stays stalled — next actionable drain fires
whenever a deferred air date passes (masterchef-australia S18 and
alone-australia S4 remain closest) or next week's sweep
(2026-07-26). Expect Rule 3 to keep absorbing every content tick
at its current ~17-lists/26h pace; watch `plan/LISTS.md`'s empty
"Ideas" queue as the fallback if invention ever slows.

**Top non-content finding:** the mobile-overflow bug (issue #568,
now HIGH, score 5.4) — 6 days old, 4 URLs, now confirmed a
shared-component defect with a sharpened fix scope. The single
highest-value non-content action available, blocked only by gate
design.

**Second-priority finding:** issue #565's crash pattern — 24
recurrences, fully self-healing, candidate #29 already proposes
the archival fix, needs promotion.

## Tuning proposals

1. **Reinforced candidate #33** (content-gaps gate bug-priority
   carve-out) with this tick's evidence, filed directly to
   `plan/PHASE_CANDIDATES.md` (not just this digest, so it
   survives the nightly overwrite): issue #568 crossed 3→4 URLs
   and 5→6 consecutive red nights; the four-URL failure pattern
   now confirms a shared-component defect rather than four
   one-offs, sharpening the fix scope. No change to score or scope
   sketch — evidence only, `/oversight` decides.
2. **Candidate #29** (archive closed rows) remains the standing
   proposed fix for `plan/CRITIQUE.md` (3,513 lines, flat) and
   `plan/PHASE_CANDIDATES.md` (4,756 lines, growing) — no new
   evidence to add this tick beyond issue #565's continued
   recurrence count, already reflected above.
3. **No new tuning proposal this tick beyond the above two** — the
   sweep false-positive (Needs You #6) self-corrected without
   needing a rails change; flagging as a pattern to watch rather
   than proposing a fix, since a second correct self-heal in a row
   is evidence the existing verification step is already doing its
   job.

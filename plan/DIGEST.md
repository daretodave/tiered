# DIGEST — 2026-11-04

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A multi-day quota outage swallowed two scheduled digest ticks
(2026-11-02, 2026-11-03) and most of the loop's `march` ticks in
between — this digest covers the full three-day gap since
2026-11-01.** `night.yml`'s own quota gate (the governor built
2026-10-26, hardened 2026-11-01) did exactly what it's designed to
do: both nights read `seven_day` utilization at `1` (rejected) and
skipped cleanly rather than burning a CI run rediscovering the same
exhausted state — the digest itself just never got written, so
"quiet" went unreported for two nights running. Eight of the
fourteen `march` ticks since 2026-11-01 21:09 were the same
quota-paused no-op; the other six shipped seven commits total:
two depth-promotions (specs 48 and 49, both written straight to
Held behind a veto window), then a burst this afternoon
(15:47–16:42 UTC) once quota cleared — a veto-window release
(spec 48 → Ready), the weekly season sweep (1 new season found,
gap now 35), critique pass 195 (1 LOW finding, three
reader-proposed findings correctly self-rejected against the
documented VotePair spec and CLAUDE.md's blurb format), a
mirror-orphan refill (issue #830 had no plan row, now does), and
spec 48's chunk plan (5 S-sized chunks, ready to build). Quota is
healthy now — `0.03` utilization, resets 2026-11-09. Breadth is
green on the latest `e2e-full` (2026-11-04 02:54–03:23 UTC, before
today's afternoon commits — not yet re-verified against them, per
its own daily cadence). Deploy is green at HEAD `a5c54e9c`. No
open `[needs-user-call]` rows, no open user issues, nothing to
escalate. The one real signal worth a human's attention: the
candidate queue is badly silted — all 16 pending candidates are
over 21 days old, the oldest is 175 days old, and the
highest-scored one (8.3, a canon-rationale/season-body
verbatim-echo gate) already matches the single largest pattern in
the 72-row CRITIQUE backlog. See Needs you.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-01 21:09–21:12 | march | no-op, honestly reported: `quota` (paused: weekly quota until 2026-11-02T08:00Z, issue #831) |
| 11-02 01:03–07:41 (2 ticks) | march | no-op, honestly reported: `quota` (same pause, issue #831) |
| 11-02 17:27–17:47 | march | success — depth promotion: spec 48 written (stat-tile value/caption literal-duplicate guard), Held behind veto window (#832) |
| 11-02 (night) | digest | **skipped** — quota gate read `seven_day` 1 (rejected), paused until 2026-11-03T08:00Z (issue #833) |
| 11-03 00:04–06:45 (2 ticks) | march | no-op, honestly reported: `quota` (pause carried over, issue #833) |
| 11-03 14:41–14:58 | march | success — depth promotion: spec 49 written (graduated spoiler-risk mod-hold), Held behind veto window (#834) |
| 11-03 (night) | digest | **skipped** — quota gate read `seven_day` 1 (rejected), paused until 2026-11-04T08:00Z (issue #835) |
| 11-03 20:39–20:42 | march | no-op, honestly reported: `quota` (pause carried over, issue #835) |
| 11-04 00:55–07:30 (2 ticks) | march | no-op, honestly reported: `quota` (pause carried over, issue #835) |
| 11-04 15:47–16:25 | march | success — veto sweep released spec 48 (Ready); weekly season sweep (1 new season found, gap 35) |
| 11-04 16:07–16:34 | march | success — critique pass 195 (1 finding: 0 HIGH, 0 MED, 1 LOW; 3 reader-proposed findings self-rejected) |
| 11-04 16:18–16:35 | march | success — mirror-orphan refill (issue #830 → `plan/AUDIT.md` row) |
| 11-04 16:32–16:42 | march | success — chunked spec 48 (5 chunks, all S, covering A1–A7) |

## Shipped

- **Plan (2 specs written, 1 released, 1 chunked):** spec 48
  (stat-tile value/caption literal-duplicate guard, score 8.7 —
  two of six pairs already guarded, the other four
  location/filming, premiere_date/caption, format/caption,
  host/caption now scoped) and spec 49 (graduated spoiler-risk
  mod-hold — a flagged comment on a season ended >30 days ago
  auto-resolves to published instead of waiting on a human
  forever; the block tier stays a permanent binary gate per
  agents.md §7) both landed as depth-promotions, each immediately
  Held behind its own veto window. Spec 48's veto window closed
  today — released to Ready, then chunked into 5 S-sized chunks
  (A1–A7 scope) with 4 build-time decisions pre-resolved. Spec 49
  (#834) is still in its veto window, due to release 2026-11-04
  (today), `fallback: release`.
- **Content ops:** the weekly season sweep found 1 new season,
  widening the `plan/CADENCE.md` gap table to 35.
- **Critique:** pass 195 walked the home/shows/lists/survivor
  surfaces (desktop + mobile), filed 1 LOW, and correctly
  self-rejected three reader-proposed findings that contradicted
  documented spec (VotePair's net-votes-only design, the
  show-hero blurb format in CLAUDE.md) or would have fabricated
  data.
- **Plan hygiene:** 1 mirror-orphan refill — issue #830 (opened by
  a prior `/iterate` mirror, 2026-10-31) had no corresponding row
  in any plan file, so no pass would ever see it; now filed as a
  LOW `plan/AUDIT.md` row.

## Queues now

- **plan:** 2 specs — 48 Ready (5 chunks left), 49 Held (veto
  until today, #834). 0 chunks held.
- **plan/AUDIT.md:** 6 pending (was 5 last digest, +1
  mirror-orphan today): 1 standing MED (season-fill drain,
  always-open by design), 1 LOW (Naked and Afraid S4 PSR-claim +
  founding-era-language siblings), 1 LOW (themed-list SERP-budget,
  parked for oversight), 1 LOW (`YEAR_TENURE_RE` teen-number blind
  spot, scoped-but-not-simple), 1 LOW (heartbeat false-positive
  alert, #806), 1 LOW (mirror-orphan #830, new today).
- **plan/CRITIQUE.md:** 72 pending (was 71), last pass 2h ago
  (pass 195). 0 HIGH, 41 MED, 31 LOW. The single largest MED
  pattern (sampled 10 of 41): near-verbatim fact restatement
  across a page's own sections — rhoc's homecoming eyebrow/lede/
  body/take, bachelor's grant-ellis episode-count, love-is-blind's
  boston canon/body, two theme catalogs, big-brother's time-trip
  milestone, amazing-race's family-edition canon/body, survivor-51.
  This is the exact shape of the already-pending #25 candidate
  below.
- **candidates:** 16 pending (16 >21d), oldest 175d. Support:
  0 open user issues · first response none (0 opened in 7d) ·
  close none in 7d.

## Needs you

- **oversight needed: candidate queue silting (16 pending >21d,
  oldest 175d).** Every single pending candidate is already past
  the 21-day mark; none has moved since before the v1→v2 kit
  migration folded them into Pending on 2026-10-27. The
  highest-scored (8.3, "Canon-rationale/season-body verbatim-
  argument echo gate," filed 2026-07-06 as v1 #25) would directly
  address the dominant CRITIQUE MED pattern above — 10+ sampled
  instances across 6+ shows, all variations of the same
  restatement defect a formal gate would catch at author time
  instead of one `/iterate` pick at a time.
- Promote: aged — auto-promoted none, 1 awaiting (spec 49, #834,
  due to release today).
- No `cut` lines (`promote.mjs cuts --since 2026-11-01` returned
  none).
- No motion-stalled line — `pulse.mjs --motion` reads `ok` (36
  shipped last full week vs. 19.5 baseline, well above the 9.75
  floor), even though 0 ship-grade units have landed so far this
  week — the quota outage ate the first three days of it and the
  week isn't over.
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues, nothing to escalate.

## Today's intent

Next ready work: spec 48's first chunk (A1, the stat-tile
value/caption literal-duplicate guard — location/filming_caption
checked by near-equality, the remaining three pairs lax/strict
decided fresh at build time). Spec 49 should release out of its
veto window today if nobody vetoes #834. Top standing finding:
the season-fill drain row (MED, score 4.5) — always-open by
design, next drain tick has shark-tank, rhoslc, and dragrace-uk
immediately actionable (all already premiered, unfiled). Top
non-standing finding: any of the CRITIQUE restatement MEDs — but
the candidate queue silting note above is the more leveraged
fix, since one gate closes many of them at once.

## Tuning proposals

None filed this tick. The one gate-tuning signal worth flagging —
CRITIQUE's restatement-MED pattern needs a formal content-check
gate, not another one-off fix — already has a filed, well-scored
candidate (#25, 8.3) sitting in Pending; writing a second proposal
for the same fix would just add to the silting this digest is
already flagging. The actionable move is promotion, not a new
candidate — that's `/oversight`'s call, not this skill's.

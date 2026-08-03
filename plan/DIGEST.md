# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-03

## Headline

**The night shift went dark for two more nights (08-01, 08-02 both
`cancelled`) before tonight's tick got through — candidate #35's
starvation bug recurring for a third time since diagnosis on 07-27 —
while e2e-full's duration-ceiling breach reached its 15th straight
red night (07-19 through 08-02, every single night since filing).**
Both fixes are fully scoped, sit in `plan/PHASE_CANDIDATES.md` at
scores 6.4 and 6.6, and are blocked on the identical cause: the cloud
loop's `ACTIONS_PAT` lacks the `workflows` OAuth scope needed to edit
`.github/workflows/*.yml`, so neither can ship without a local
`/oversight` session. Every day either stays unpromoted is a
guaranteed-red night with zero new information. Underneath that, the
loop itself had an exceptionally clean 26 hours: 45 commits (25
content ships, 20 matching audit logs), all 40 `march` runs in the
window green, deploy ready at HEAD.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| 2026-08-02 10:16 → 2026-08-03 10:01 (40 `march` runs in window) | 40 | All `success` — no crashes, no cancellations in the sampled window |
| Commits, last 26h | 45 | 25 `content:` ships, 20 matching `audit:` progress logs (near 1:1 pairing — Rule 3 drain cadence) |
| `night` (digest) | 3 runs since last digest (07-31) | 08-01 `cancelled`, 08-02 `cancelled`, 08-03 (today) got through |
| `e2e-full` breadth crawl | 15 consecutive nights (07-19 → 08-02) | All `failure` — duration-ceiling breach, not a test regression (candidate #34, unpromoted) |
| `pnpm deploy:check` at HEAD (`d78fce9e`) | — | `ready` |

## The saga

Rule 2 (season-fill drain) is stalled just short of gap-zero: the
2026-08-02 sweep found the gap table sitting at **46 gap-slots**
(up from 37 on 07-26), and every remaining row is starred
(confirmed-but-unaired or still-airing) — nothing left to drain
today. That correctly falls through to **Rule 3 (themed lists)**,
where all 25 of the last 26h's content commits landed: five
consecutive passes (85th–89th) extending `the-format-learned-to-
travel`, plus earlier passes on `not-the-usual-order`, `down-to-
just-the-two-of-you`, `running-on-muscle-memory`, and `the-season-
structure-never-holds-still`. One zero-ship pass (82nd) is logged
where no concept cleared the excellence gate — expected noise at
this drain depth, not a fault.

Catalog size: 68 shows, 1,043 season files, 174 themed lists. Next
weekly season sweep due ~2026-08-09 (last ran 08-02); Rule 1
(new-show add) stays LOCKED until the gap table reads a literal
zero.

## Queues now

- `plan/AUDIT.md`: 9 Pending rows (205 resolved). Two HIGH (the-voice
  factual corruption; night-shift starvation), one MED (e2e-full
  timeout), one MED standing Rule 2 drain row, five LOW.
- `plan/CRITIQUE.md`: 52 Pending rows (400 resolved), latest pass is
  **104**.
- `plan/PHASE_CANDIDATES.md`: three fully-scoped candidates awaiting
  `/oversight` promotion — #34 (shard e2e-full, score 6.6, filed
  07-22, blocked from cloud), #35 (decouple night.yml's concurrency
  group, score 6.4, filed 07-27, blocked from cloud), #36 (the-voice
  remediation, score 6.0, filed 07-28, not cloud-blocked but flagged
  for a review checkpoint given fabrication risk).
- Open GitHub issues: 11 total, none labeled `spoiler`. Four sit in
  `triage:needs-user` and are stale: #586 (night crash, 07-16), #565
  (march crash, 07-12), #399 and #398 (march crashes, both 06-11 —
  over 7 weeks old, never actioned by a human pass).

## Needs you

1. **Promote #34 + #35 via local `/oversight`.** Both are
   fully-scoped workflow-YAML edits the cloud loop structurally
   cannot push. #34 (e2e-full sharding) has recurred 15 nights
   straight since filing; #35 (night.yml concurrency isolation) has
   now starved the digest on multiple nights since its own diagnosis,
   including both nights just past. Neither needs more design — both
   need a few minutes in a local session.
2. **#36 (the-voice corruption)** — `content/shows/the-voice.md`
   still reads `status: hiatus` with a "signed off" claim that is
   false on production right now. Scoped, HIGH, awaiting promotion.
3. **Four stale `triage:needs-user` issues** (#586, #565, #399,
   #398), the oldest from 2026-06-11, have sat untouched through
   several `/oversight` passes — worth a close-or-act sweep.

## Today's intent

Content saga continues Rule 3 (themed-list drain) until the next
season sweep (~08-09) or the gap table's starred rows clear. Top
non-content priority: get #34/#35 in front of a local `/oversight`
session — they're the cheapest, highest-signal fix available and the
cost of delay compounds nightly.

## Tuning proposals

None new this tick. The pulse's two live gate problems (e2e-full
timeout, night/march concurrency starvation) are already captured
comprehensively by candidates #34 and #35 with fresh recurrence
evidence in their own histories — filing duplicates would add noise,
not information. See "Needs you" above for the actionable ask.

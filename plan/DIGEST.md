# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-11

## Headline

**The e2e-full observation window closed: it's red again, not fixed.**
2026-08-10's breadth crawl (run 31441429717) reverted to the
identical 75-minute duration-ceiling breach (9,462/10,544 tests,
89.7%) the very night after breaking a 9-night red streak — the
08-09 green run was a lucky one-off, not a trend break. Candidate
#34 (shard the crawl) is now updated and ready to promote rather
than watch further. Meanwhile Rule 3's idea pool hit a new record
**25 same-day zero-ship passes** (up from 15 two days ago), but the
content-gate showed its healthiest self-correction yet: on three
exhausted ticks, cloud `march` fell through to `plan/CRITIQUE.md`
instead of forcing a 26th search, landing 3 fixes and driving
Pending HIGH back to zero. `/expand` also ran (pass 60, 08-10
evening) after 13 days stale, closing the loop's last starved verb.
The one thread that hasn't moved: the-voice factual corruption
(candidate #36) is still live in production at its root, though the
loop caught and neutralized a second live spread of the same false
claim today (a themed-list entry). One `march` tick crashed and
self-healed on the next run, silently absorbed into a month-old
issue thread. Deploy's green at HEAD (5535476b).

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last 26h, `march` | 34 runs | 29 `success`, 3 `cancelled` (concurrency evictions, expected), 1 `failure` (self-healed next tick, run 31396508983) |
| Commits since last digest (7a5e8e12) | 36 | 20 `audit:`, 7 `content:`, 5 `fix:`, 3 `critique:`, 1 `expand:` |
| `night` (digest) | 2 daily triggers | 08-10 **success**, this tick (08-11) running now |
| `e2e-full` breadth crawl | 1 night (08-10) | **failure** — reverted to red after the single 08-09 green, same 75-minute wall, 89.7% complete |
| `pnpm deploy:check` at HEAD | — | `ready` |

## The saga

Rule 2 (season-fill drain) still reads 47 confirmed-but-unaired at
the last full sweep (2026-08-09, next due ~08-16), but two shows
drained opportunistically between sweeps as their airing seasons
concluded: Below Deck Mediterranean Season 11 (Dubrovnik II) and
America's Got Talent Season 21, each landing with the same-commit
canon rebase the standing row requires. Rule 3 (themed lists) had
its thinnest yield yet — 25 same-day zero-ship passes against only
3 successful extends (a-way-back-in, been-here-before,
built-for-one-playing-as-a-team) — the worst search-to-ship ratio
logged this window. Rather than force a 26th search, cloud `march`
increasingly fell through to `plan/CRITIQUE.md` on exhausted ticks:
3 fixes landed this way today (masterchef-australia S18
cross-surface repetition, below-deck-mediterranean S11 stat-caption
repetition, the-challenge S41 FILMED stat-caption punctuation-only
restatement), plus critique pass 113 itself ran and bumped 2
findings MED→HIGH before both got fixed same-day. `/expand` also
broke its 13-day silence, running pass 60 (2026-08-10 evening) —
0 new candidates, but it escalated candidate #36 (the-voice) on its
own read of the evidence. Content also caught a second live
instance of the-voice's fabricated "series finale" claim — a themed
list entry (closing-statement) restated the false premise; it was
removed with a scoped subtraction, per the standing block on
authoring new the-voice content until the full 8-file remediation
ships.

## Queues now

- `plan/AUDIT.md`: 5 actionable Pending rows. 2 HIGH (the-voice
  factual corruption — live false "show has ended" claim, candidate
  #36; night.yml starvation, candidate #35 — currently quiet but
  unfixed at the root), 1 MED (standing Rule 2 drain row, correctly
  starved of actionable work), 1 MED (e2e-full duration-ceiling
  breach, candidate #34 — confirmed recurring, not dormant), 1 LOW
  (`YEAR_TENURE_RE` teen-number gap).
- `plan/CRITIQUE.md`: last pass **113**, today (2026-08-11) — 55
  Pending rows, **0 Pending HIGH** (2 bumped MED→HIGH this pass,
  both fixed same-day), 23 MED, 31 LOW.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass 60, 2026-08-10 —
  1 day stale, no longer starved. 4 fully-scoped unpromoted
  candidates: #33 (content-gate carve-out, now lowest-urgency after
  3 consecutive days of unforced self-recovery across all three
  gated verbs), #34 (shard e2e-full, now confirmed still broken —
  ready to promote), #35 (decouple night.yml concurrency, dormant
  risk), #36 (the-voice remediation, top priority — live harm). All
  await a local `/oversight` session.
- Open triage issues: 3 `triage:needs-user` (#758 content-gate
  starvation, #762 the-voice corruption mirror, #763 night.yml
  starvation mirror — all tracked above), 2 `triage:loop-queued`
  (#754 Rule-3 pass-22 extend, #636 a stale 07-21 e2e-full mirror
  still absorbing recurrences). No new unlabeled issues since 08-08.

## Needs you

Same four candidates as yesterday, priority order shifted:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still top: a live, reader-facing false "show has ended" claim at
   the root (8 season files + frontmatter), unchanged since filing,
   even though today's loop caught and removed a second live spread
   into a themed list. `/expand` independently escalated this
   yesterday — two signals now converge on the same priority call.
2. **Candidate #34** — shard the e2e-full crawl. Promoted from
   "wait and observe" to "confirmed, ready to ship": the 08-09 green
   run was the outlier, 08-10 reverted to the identical 75-minute
   wall. No more observation needed — the catalog (10,544 tests,
   single worker) hasn't shrunk and won't.
3. **Candidate #35** — decouple night.yml's concurrency group. No
   new starvation incident since the 08-07/08-08 back-to-back scare
   (3 clean nights running), but the race is still unfixed — dormant
   risk, cheap fix, worth bundling with #34 in the same session.
4. **Candidate #33** — content-gate bug-priority carve-out. Lowest
   urgency yet: all three gated verbs (`/iterate` via
   critique-fallback, `/critique`, `/expand`) have now self-recovered
   without it, on cadences the emptying Rule-3 pool keeps shortening
   organically. Still worth shipping for determinism, not for
   urgency.

All four remain workflow/skill-file or multi-file edits scoped for a
local `/oversight` session, not a cloud tick.

## Today's intent

Recommend bundling #36 (the-voice, top priority — active harm) and
#34 (e2e-full sharding, now confirmed rather than provisional) in
the next `/oversight` session; #35 is cheap enough to fold into the
same sitting. #33 can wait — three straight days of organic
self-recovery weakens the case for urgency without weakening the
case for eventually shipping it. Content-wise, watch whether Rule
3's zero-ship ratio (25 passes / 3 ships today, worse than
yesterday's 15/4) keeps degrading — `/expand` pass 60 found no new
candidates addressing idea-pool depth directly, so if tomorrow's
window shows the same or worse shape, that's a distinct signal from
candidate #33's gate-priority question and worth its own look.

## Tuning proposals

Updated `plan/PHASE_CANDIDATES.md` in place rather than filing new
candidates:

- **#34** — added the 2026-08-10 reversion to red (89.7% complete,
  identical 75-minute wall), closing the observation window the
  08-10 digest opened; recommends promoting now rather than
  watching for a third data point.
- **#33** — added the 08-11 self-recovery data point (`/expand`
  pass 60 after 13 days stale, plus 3 organic critique-fallback
  fixes today on Rule-3-exhausted ticks) — downgraded to lowest
  urgency of the four unpromoted candidates.

No new candidate filed — Rule 3's worsening zero-ship ratio (25/3)
is flagged in Today's intent for the next `/expand` pass to
evaluate directly rather than pre-judging a mechanism here.

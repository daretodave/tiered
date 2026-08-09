# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-09

## Headline

**The loop partially self-healed since the last briefing, but a
different gate got worse.** The 2026-08-06 digest's crisis —
`/critique` locked out by 2 Pending HIGH rows, `/iterate` and
`/expand` starved by the content-gate — resolved itself without
`/oversight` promoting candidate #33: both HIGH rows got fixed
(mobile `.ep-foot` overflow, community-view `og:image`), which
reopened `/critique`'s own rate-limit condition, and it ran three
more times (passes 106, 107, 108) in the 3 days since, alongside 6
`fix:` commits. Pass 108 (today) filed a fresh Pending HIGH —
the community weekly-question card's non-interactive CTA, now
confirmed systemic across two shows — so the same lockout risk is
live again pending the next `/iterate` tick. Meanwhile **night.yml
starvation (candidate #35) got worse, not better**: 08-07 and
08-08 were both cancelled back-to-back, the first time two
consecutive nights have been lost since diagnosis, producing this
digest's own 3-day gap. `e2e-full` posted its **20th consecutive
red night** (07-20 through 08-08), still the same duration-ceiling
breach (candidate #34, unpromoted 19 days). The-voice factual
corruption (candidate #36) remains live and unfixed. Deploy's
green at HEAD (d962d3d8).

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| 2026-08-06 11:20 → 2026-08-09 10:47 (3 days, 107 `march` runs) | 107 | 91 `success`, 5 `failure` (self-healed on retry, no issue filed), 11 `cancelled` |
| Commits since last digest (100788b6) | 113 | 56 `audit:`, 44 `content:`, 6 `fix:`, 4 `critique:`, 1 `triage:`, 1 `sweep:`, 1 `docs:` — non-content share climbed from 0% (08-06 digest) to ~9.7% |
| `night` (digest) | 3 daily triggers | 08-07 **cancelled**, 08-08 **cancelled** (starvation, candidate #35 — two in a row, first time since diagnosis) — this digest was frozen on the 08-06 snapshot for 3 days; 08-09 (this tick) got through |
| `e2e-full` breadth crawl | 3 nights (08-06, 08-07 ×2, 08-08) | All `failure` — same duration-ceiling breach, catalog now 10,510 tests (single worker), 20 consecutive red nights total (07-20 → 08-08) |
| `pnpm deploy:check` at HEAD | — | `ready` |

## The saga

Rule 2 (season-fill drain) stays fully starred-out in
`plan/CADENCE.md` — the 2026-08-09 weekly sweep (due today, ran
on schedule) found 1 new confirmed-but-unaired season (Top Chef
S24) and re-flagged Chopped's recurring S63/S64 false-positive
without reopening it; gap moved 46→47, still zero actionable
picks. Rule 3 (themed lists) carried the content window: 48
Rule-3 audit passes logged, 30 zero-ship — a ~62% zero-ship rate
on a maturing 180+-list ledger, consistent with prior weeks.
Non-Rule-3 content also shipped this window: a MasterChef
Australia S18 season backfill, and a three-show card_tagline/
tagline-overlap drain (rhoa, rhonj, bachelor — issue #394
reference) closing out a defect class critique had flagged.

Next weekly season sweep due ~2026-08-16. Rule 1 (new-show add)
stays LOCKED until the gap table reads a literal zero.

## Queues now

- `plan/AUDIT.md`: 5 Pending rows (down from 7 at the 08-06
  digest — 2 LOW housekeeping rows resolved). 2 HIGH (the-voice
  factual corruption — live false "show has ended" claim,
  candidate #36; night-shift starvation — now recurred worse,
  candidate #35), 2 MED (e2e-full duration-ceiling, candidate
  #34, now 20 consecutive red nights; the standing Rule 2 drain
  row, correctly starved of actionable work), 1 LOW housekeeping
  row (`YEAR_TENURE_RE` teen-number gap).
- `plan/CRITIQUE.md`: last pass **108**, today (2026-08-09) —
  fresh, cloud loop self-recovered. 1 Pending HIGH (community
  weekly-question card CTA, systemic to `/shows/[show]?view=
  community`, filed pass-106 and confirmed on a second show at
  pass-108) — this row alone will re-block `/critique`'s Step 2
  condition 3 until `/iterate` clears it, same mechanism as the
  08-06 crisis.
- `plan/PHASE_CANDIDATES.md`: last pass 59, 2026-07-28 — **12
  days stale**, `/expand` still effectively starved by the
  content-gate. 4 fully-scoped unpromoted candidates unchanged
  in shape: #33 (content-gate bug-priority carve-out — evidence
  now softer than 08-06's worst case, see Tuning proposals),
  #34 (shard e2e-full, 19 days), #35 (decouple night.yml
  concurrency, 13 days, now worse — two consecutive losses),
  #36 (the-voice remediation, 14 days).
- `triage:needs-user`: 7 open issues — 3 new since 08-06 (#758
  content-gate starvation, #762 the-voice corruption, #763
  night.yml starvation — both #762/#763 are GitHub mirrors of
  existing AUDIT rows #631/#632, filed via the escape-route
  mechanism noted in those rows), plus the same 4 stale
  infra-crash reports (#586, #565, #399, #398).
- `triage:loop-queued`: 2 open issues (#754 themed-list Rule-3
  pass 22, #636 the e2e-full mirror).

## Needs you

The picture changed since 08-06: the loop proved it can
self-recover from a critique lockout without a promoted fix, so
candidate #33 is less urgent than it looked 3 days ago. What
didn't self-recover:

1. **Candidate #35** — decouple night.yml's concurrency group.
   This is now the most concrete regression: two consecutive
   nights lost (08-07, 08-08) for the first time since the
   07-27 diagnosis, producing a 3-day digest blackout — worse
   than any single instance since the original 7-day outage
   that prompted the fix's discovery.
2. **Candidate #34** — shard the e2e-full crawl. 20 consecutive
   red nights now; catalog keeps growing (10,510 tests), no
   sign the duration ceiling self-resolves.
3. **Candidate #36** — the-voice factual-corruption remediation.
   Still live in production (false "show has ended" claim),
   mirrored to GitHub as #762, labeled `triage:needs-user`
   pending a dedicated oversight-reviewed tick given the
   8-file/canon-rebase blast radius.
4. **Candidate #33** — content-gate bug-priority carve-out.
   Downgrade from "single highest-leverage row" to "still worth
   doing" — the loop cleared 2 Pending HIGH critique rows and
   ran 3 critique passes + 6 fixes in 3 days without it, but the
   same lockout mechanics just reloaded with pass-108's fresh
   HIGH finding, so the underlying risk is unresolved, just not
   currently biting.

All four remain workflow/skill-file or multi-file edits scoped
for a local `/oversight` session, not a cloud tick.

## Today's intent

Top priority for the next `/oversight` session: promote candidate
#35 first — it's the one actively degrading (two-night starvation
streak, first of its kind), and it's cheap (a concurrency-group
edit). #34 and #36 remain queued behind it. Content-wise, Rule 3
keeps finding new angles at a sustainable clip; nothing to
redirect there. Watch pass-108's fresh HIGH (community
weekly-question CTA) — if the next few ticks don't reach
`/iterate` before another critique cycle comes due, the 08-06
lockout pattern will repeat.

## Tuning proposals

Updated `plan/PHASE_CANDIDATES.md` in place rather than filing new
candidates:

- **#35** — added the 08-07/08-08 back-to-back starvation
  evidence (first two-consecutive-night loss since diagnosis) and
  the resulting 3-day digest gap, sharpening urgency over #34/#36.
- **#34** — added the 08-08 recurrence (20 consecutive red
  nights), catalog now 10,510 tests.
- **#33** — added the self-recovery evidence (3 critique passes +
  6 fixes shipped in the 3 days since filing, without promotion)
  alongside the fresh pass-108 HIGH finding that reloads the same
  lockout risk — net: still a real gap, but demonstrably not an
  absolute one anymore. No score change; softened the "single
  highest-leverage" framing from the 08-06 update.

No new candidate filed — no new tuning shape emerged that isn't
already captured by an existing one.

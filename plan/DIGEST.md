# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-10

## Headline

**Two of yesterday's three open fires cooled overnight; the third
is holding steady, not worsening.** `e2e-full` broke its
9-consecutive-red streak (07-31 through 08-08) with a clean
**success** on 2026-08-09 — the duration-ceiling breach candidate
#34 has been tracking didn't recur last night, though one clean
run isn't proof the sharding fix is unnecessary. `night.yml`'s
starvation race (candidate #35) also held: after the first-ever
two-in-a-row loss (08-07, 08-08), 08-09 got through clean and
tonight's tick (this one) is running now — no new cancellation
since the scare. The community weekly-question CTA Pending HIGH
that reloaded `/critique`'s lockout risk yesterday got fixed same
day (3ed3c5da, confirmed via `0c197516`), so `plan/CRITIQUE.md`
carries **zero Pending HIGH rows** this morning — the lockout
mechanism candidate #33 worries about isn't currently loaded.
What hasn't moved: the-voice factual corruption (candidate #36)
is still live in production, and Rule 3's idea pool is showing
real strain — **15 same-day zero-ship passes since midnight**,
the last five in a row (11th–15th). Deploy's green at HEAD
(0f057691).

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last 26h, `march` | 40 runs | 36 `success`, 4 `cancelled` (concurrency evictions — expected self-overlap, not failures) |
| Commits since last digest (7fd803a6) | 43 | 27 `audit:`, 12 `content:`, 2 `critique:`, 1 `fix:`, 1 `digest:` |
| `night` (digest) | 1 daily trigger | 08-09 **success**, this tick (08-10) **in progress** at time of writing — no cancellation since the 08-07/08-08 pair |
| `e2e-full` breadth crawl | 1 night (08-09) | **success** — first green run since 07-30, breaking a 9-night red streak |
| `pnpm deploy:check` at HEAD | — | `ready` |

## The saga

Rule 2 (season-fill drain) stays fully starred-out — the
2026-08-09 weekly sweep found the gap table's 47 remaining
seasons all confirmed-but-unaired, no actionable pick; next sweep
due ~2026-08-16. MasterChef Australia S18 concluded (finale
2026-08-09) and got its finale-shift note same-day (fdb5e78d),
closing that AUDIT row within hours of airing. Rule 3 (themed
lists) carried today's window but is visibly thinning: since
midnight, 15 same-day audit passes logged, only 4 shipped content
(best-post-merge, the-calendar-moved-the-format-didnt,
the-season-the-audience-showed-up-all-at-once, plus one extend),
and the most recent five passes in a row (11th–15th) found nothing
to ship — the deepest same-day zero-ship run logged yet. Two
content-repair commits also landed outside Rule 3: an
anonymization-convention break in
the-anchor-count-set-the-ceiling, and a panel-continuity echo fix
on the MasterChef Australia open-call entry, both caught by the
same-day audit loop rather than a dedicated critique pass.

Non-content share held at a healthy ~9% today (1 critique pass,
1 fix, alongside the content work) — the content-gate did not
behave as "absolute" today, consistent with the 08-09 self-
recovery finding, not the 08-06 lockout scare.

## Queues now

- `plan/AUDIT.md`: 6 Pending rows. 2 HIGH (the-voice factual
  corruption — live false "show has ended" claim, candidate #36;
  night-shift starvation, candidate #35 — currently quiet but
  unfixed at the root), 1 MED (the standing Rule 2 drain row,
  correctly starved of actionable work), 1 MED (e2e-full
  duration-ceiling breach, candidate #34 — dormant after last
  night's green run, not resolved), 1 LOW (`YEAR_TENURE_RE`
  teen-number gap).
- `plan/CRITIQUE.md`: last pass **110**, today (2026-08-10) — 52
  Pending rows, **0 Pending HIGH** (down from 1 yesterday — the
  community weekly-question CTA finding was fixed same-day). The
  `/critique` lockout risk candidate #33 tracks is currently
  unloaded.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass 59, 2026-07-28
  — **13 days stale**, still starved behind the content-gate.
  4 fully-scoped unpromoted candidates unchanged in shape: #33
  (content-gate bug-priority carve-out), #34 (shard e2e-full),
  #35 (decouple night.yml concurrency), #36 (the-voice
  remediation). All await a local `/oversight` session.
- Open triage issues: 3 `triage:needs-user` (#758 content-gate
  starvation, #762 the-voice corruption mirror, #763 night.yml
  starvation mirror — all already tracked above), 2
  `triage:loop-queued` (#754 Rule-3 pass-22 extend, #636 a stale
  07-21 e2e-full mirror). No new unlabeled issues since 08-08.

## Needs you

Same four candidates as yesterday, with two now trending better
rather than worse:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still the top item: a live, reader-facing false "show has
   ended" claim, unchanged since filing. 8-file renumbering +
   canon rebase + cross-catalog reference cleanup — explicitly
   flagged as needing a reviewed tick, not a routine drain.
2. **Candidate #35** — decouple night.yml's concurrency group.
   One clean night since the 08-07/08-08 back-to-back scare; the
   underlying race is still unfixed, so this is dormant risk, not
   resolved risk. Still cheap, still worth promoting before the
   next multi-night loss.
3. **Candidate #34** — shard the e2e-full crawl. The 9-night red
   streak broke last night (first green since 07-30) — good
   sign, but the catalog (10,500+ tests, single worker) hasn't
   shrunk, so this could easily be one lucky night rather than a
   fix. Worth a day or two more observation before deprioritizing.
4. **Candidate #33** — content-gate bug-priority carve-out.
   Zero Pending HIGH critique rows this morning and non-content
   commits landed today without promotion — second consecutive
   day the gate behaved as biased-but-not-absolute rather than
   locked. Lowest urgency of the four right now.

All four remain workflow/skill-file or multi-file edits scoped
for a local `/oversight` session, not a cloud tick.

## Today's intent

Top priority unchanged: candidate #36 (the-voice) is the only one
of the four with an active, worsening reader-facing cost (a false
claim staying live) rather than a dormant risk — recommend
promoting it first at the next `/oversight` session, ahead of #35
even though #35 is cheaper, because #36's blast radius grows the
longer new the-voice content stays blocked. Content-wise, watch
Rule 3's zero-ship streak (15 same-day passes, 5 in a row empty)
— if tomorrow's window shows the same shape, the idea-pool
exhaustion `/expand`'s own posture review should address is worth
a dedicated look, distinct from the gate-priority question
candidate #33 already covers.

## Tuning proposals

Updated `plan/PHASE_CANDIDATES.md` in place rather than filing new
candidates:

- **#34** — added the 08-09 green-run recovery, breaking the
  9-consecutive-red streak; flagged as inconclusive (one night,
  no catalog shrink) rather than a resolution.
- **#35** — added the 08-09 clean-run data point following the
  08-07/08-08 back-to-back loss; softened urgency slightly but
  kept the root cause explicitly unfixed.
- **#33** — added the second consecutive day of non-content
  commits landing without promotion (critique pass 110 + 1 fix
  today, alongside content), reinforcing the 08-09 update's
  "biased-but-not-absolute" framing.

No new candidate filed — the Rule-3 zero-ship depth (15 same-day
passes) is a fresh signal but doesn't yet have a clean fix shape;
flagging it in Today's intent for the next `/expand` pass to
evaluate rather than pre-judging a mechanism here.

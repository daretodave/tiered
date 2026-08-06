# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-06

## Headline

**The content gate has been structurally absolute for 9 straight
days** (since `/expand` pass 59, 2026-07-28T19:24:18Z, through
tonight) — 348 commits, and not one of them is `iterate:`,
`critique:`, `expand:`, `fix:`, `phase:`, or `data:`. This is
`plan/PHASE_CANDIDATES.md` candidate #33's predicted failure mode
(filed 2026-07-18, last updated 2026-07-20), now confirmed worse
than its own worst case: `plan/CRITIQUE.md` carries **2** Pending
HIGH rows, and `skills/march.md` Step 2's own condition 3 ("no
pending HIGH critique already queued for iterate") means `/critique`
cannot run again until `/iterate` clears them — but `/iterate` never
runs, because Step 3b.5's content-gaps gate never yields. The loop
has quietly locked itself out of both its bug-fixing path and its
bug-detection path at once. Layered on top: `night.yml` starved out
again on 2026-08-05 (candidate #35's exact predicted race, third
recurrence since diagnosis) — this digest itself was the casualty,
skipped a full day; `e2e-full` posted its 16th consecutive red night
(07-21 through 08-05, candidate #34, still unpromoted); and none of
that slowed the content saga itself, which shipped 31 Rule-3
themed-list extends against 15 zero-ship passes in the same window.
Deploy's green at HEAD (19e8e4b6).

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| 2026-08-04 11:23 → 2026-08-06 11:20 (46 `march` runs) | 46 | 42 `success`, 3 `failure` (self-healed on retry next tick, no issue filed), 1 `cancelled` |
| Commits since last digest (63494cc6) | 75 | 44 `content:`, 31 `audit:` — 0 `iterate:` / `critique:` / `expand:` / `fix:` / `phase:` / `data:` |
| `night` (digest) | 2 daily triggers | 08-05 **cancelled** (starvation, candidate #35 recurrence — this digest was skipped a day, frozen on the 08-04 snapshot); 08-06 (this tick) got through |
| `e2e-full` breadth crawl | 2 nights (08-04, 08-05) | Both `failure` — same duration-ceiling breach, catalog flat at 10,485 tests, completion ~89.5% both nights (9,399/10,485 on 08-04, 9,389/10,485 on 08-05 — plateaued, not eroding further this window) |
| `pnpm deploy:check` at HEAD | — | `ready` |

## The saga

Rule 2 (season-fill drain) stays fully starred-out in
`plan/CADENCE.md` — every remaining gap is confirmed-but-unaired,
nothing actionable. Rule 3 (themed lists) carried all of this
window's content commits: 31 shipped extends (season-one-doesnt-
own-every-first, milestones-spent-not-marked, not-who-they-say-
they-are, when-the-crew-stepped-into-frame, best-returnees,
best-challenge-design, best-premieres, familiar-faces-wrong-
franchise, best-post-merge, the-place-fought-back, when-the-cast-
was-already-related, best-comeback-seasons, everything-but-the-
pass-keeps-changing, the-turnaround-skipped-a-year, best-reunion-
specials, the-fix-stayed-after-the-season-left, best-finales,
one-season-two-flags, firsts, the-grudge-was-the-casting-call,
sight-unseen-already-committed, the-broadcast-wasnt-the-whole-show,
the-couch-kept-adding-chairs, best-villain-editing, a-way-back-in,
pandemic-seasons — several touched twice) against 15 zero-ship
passes — roughly a 67% ship rate, consistent with a maturing
180+-list ledger where unclaimed angles are getting harder to find
but not yet exhausted. Velocity itself is healthy; it's the
loop's *other* verbs that have gone dark (see Headline).

Next weekly season sweep due ~2026-08-09 (last ran 08-02, +12
seasons found, gap 47). Rule 1 (new-show add) stays LOCKED until
the gap table reads a literal zero.

## Queues now

- `plan/AUDIT.md`: 7 Pending rows. 2 HIGH (the-voice factual
  corruption — a live false "the show has ended" claim; night-shift
  starvation — recurred again 08-05), 2 MED (e2e-full sharding, 16
  consecutive red nights; the standing Rule 2 drain row, correctly
  starved of actionable work), 3 LOW housekeeping rows.
- `plan/CRITIQUE.md`: last pass 104, 2026-07-25 — **12 days
  stale**, 52 Pending rows, including the 2 HIGH rows now
  structurally blocking `/critique` from ever running again (see
  Headline).
- `plan/PHASE_CANDIDATES.md`: last pass 59, 2026-07-28 — **9 days
  stale**. 4 fully-scoped unpromoted candidates: #33 (content-gate
  bug-priority carve-out — now the single highest-leverage row in
  the file, updated this tick with the 9-day evidence), #34 (shard
  e2e-full, 16 days), #35 (decouple night.yml concurrency, 10 days,
  recurred a third time — updated this tick), #36 (the-voice
  remediation, 11 days).
- `triage:needs-user`: 4 open issues, same stale infra-crash
  reports as last digest (#586, #565, #399, #398).
- `triage:loop-queued`: 1 open issue (#636, the e2e-full mirror).

## Needs you

Four fixes are fully scoped and sitting idle. Priority order has
changed from prior digests — #33 now leads, because it's the one
whose absence is preventing the loop from ever reaching the other
three (or any future bug) without a human forcing a tick by hand:

1. **Candidate #33** — give `skills/march.md` Step 3b.5's
   content-gaps gate a bug-priority carve-out. Proof it's needed: 9
   straight days, 348 commits, 0 `iterate`/`critique`/`expand`
   ticks. Consequence: 2 HIGH `plan/CRITIQUE.md` rows can't clear,
   which means `/critique`'s own rate-limit condition can't clear
   either — a closed loop, not just a slow queue.
2. **Candidate #34** — shard the e2e-full crawl. 16 consecutive red
   nights; completion held flat around 89.5% the last two nights
   rather than eroding further.
3. **Candidate #35** — decouple night.yml's concurrency group.
   Recurred a third time (08-05) since the 07-27 diagnosis; this
   digest itself was the casualty this time.
4. **Candidate #36** — the-voice factual-corruption remediation.
   Still live in production; blocked behind the same content-gate
   starvation as everything else, since it's `/iterate`-shaped, not
   `/ship-content`-shaped.

All four are workflow/skill-file or multi-file edits explicitly
scoped for a local `/oversight` session, not a cloud tick.

## Today's intent

Top priority for the next `/oversight` session: promote candidate
#33 first, ahead of #34/#35/#36 — it reopens the loop's own ability
to reach the other three (and any future bug) rather than fixing
one more symptom. Content-wise, Rule 3 keeps finding new angles at
a healthy clip; nothing to redirect there.

## Tuning proposals

Updated `plan/PHASE_CANDIDATES.md` in place rather than filing new
candidates — the existing shapes were already correct, they just
needed sharper numbers:

- **#33** — added the 9-day/348-commit all-content-gate evidence and
  the newly-confirmed critique self-lock (2 Pending HIGH rows
  blocking `/critique`'s own rate-limit condition). Raised to "single
  highest-leverage row in the file" in the update text; no score
  change.
- **#34** — added 08-04/08-05 recurrence (16 consecutive red nights,
  completion plateaued ~89.5%, catalog flat at 10,485 tests).
- **#35** — added the 08-05 starvation recurrence (third since
  diagnosis), with the bracketing `march` run IDs confirming the
  exact predicted eviction mechanism.

No new candidate filed — no new tuning shape emerged that isn't
already captured by an existing one.

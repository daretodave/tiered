# DIGEST — 2026-11-16

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A third straight weekly-quota pause cycle ate most of the window
since the last digest — but tonight's post-reset stretch is the
healthiest one yet.** Three "Loop paused: weekly quota" cycles
(#849, #851, #852) covered roughly 63 of the last 74 hours, leaving
only two short productive windows (~11 minutes, then ~39 minutes)
between resets before quota re-exhausted again — a continuation of
the shrinking-recovery-window trend the 2026-11-13 digest flagged.
`pulse.mjs --motion` now reads **stalled** (7 shipped this week
against a baseline of 20, floor 10), the clearest confirmation yet
that quota, not a code or gate regression, is throttling throughput.
The one bright spot: the window opened by #852's 08:00Z reset this
morning has now run **10h23m with no re-exhaustion** (`seven_day`
utilization reads 0.07, comfortably `allowed`) — a real break from
the 11-minute and 39-minute windows that preceded it. Inside the
gaps, the loop still moved: spec 53 was auto-promoted and released
from Held with no veto filed, spec 52 picked up a shipped chunk (the
prose sentence-capitalization gate) and one more ready to go, two
critique passes ran (205 clean, 206 found two new low-severity UI
issues), and a fresh settle.mjs defect got caught and filed before
it could silently corrupt the plan tree.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-13 ~18:16 | night/march | **quota exhausted** — issue #849 opened, paused until 11-14 08:00 |
| 11-13 18:48 | march | no-op — quota paused (#849) |
| 11-14 00:18 | march | no-op — quota paused (#849) |
| 11-14 07:05 | march | no-op — quota paused (#849) |
| 11-14 14:07–14:20 | march | reset landed: spec 53 auto-promoted, veto until 11-15 (`d1abe1d1`); critique pass 205 ran clean (`b5636d7f`) — then quota re-exhausted, issue #851 opened (paused until 11-15 08:00), productive window only **~11 min** |
| 11-14 16:39 | night | no-op — quota paused (#851) |
| 11-14 19:30 | march | no-op — quota paused (#851) |
| 11-14 23:25 | march | no-op — quota paused (#851) |
| 11-15 03:08 | march | no-op — quota paused (#851) |
| 11-15 11:33–12:14 | march (chain) | reset landed: spec 52 chunked (`78ae26f3`), prose sentence-capitalization gate shipped (`3b80ebbd`), chunk 52.1 closed (`d3fbee2a`) and settled (`ca3e8203`), settle.mjs chunk-removal defect filed to AUDIT (`b3f1b3e4`) — then quota re-exhausted, issue #852 opened (paused until 11-16 08:00), productive window only **~39 min** |
| 11-15 17:18 | night | no-op — quota paused (#852) |
| 11-15 17:59 | march | no-op — quota paused (#852) |
| 11-15 22:45 | march | no-op — quota paused (#852) |
| 11-16 02:25 | march | no-op — quota paused (#852) |
| 11-16 10:11–10:31 | march | reset landed: spec 53 released from Held, no veto filed (`e8336a42`); critique pass 206 ran, 2 new LOW findings (`fbe907fb`); issue #852 closed. **No re-exhaustion since** — 10h23m and counting. |

## Shipped

- **Spec 53** (archive closed CRITIQUE.md/AUDIT.md rows out of the
  live ledger) — auto-promoted via depth promotion (11-14), held
  one day under bold posture's `veto_days: 1`, released 11-16 with
  no veto filed. Not chunked yet — the roadmap's Status column
  still reads "Held (veto window)," a stale-text pipeline artifact
  (the actual Held bullet line is gone); the next `/next` or
  `/plot` pass should chunk it.
- **Spec 52** (prose sentence-capitalization invariant) — chunked
  into 52.1/52.2, chunk 52.1 shipped (`scripts/content-check.ts`
  gate + colocated test), closed and settled. One chunk left
  (52.2, "Curator brief guardrail").
- **Critique pass 205** — ran clean, zero new findings.
- **Critique pass 206** — 2 new LOW findings, both on
  `/shows/survivor/season/heroes-vs-villains`: the FILMED caption's
  bare "S19" shorthand (the page's one unglossed abbreviation) and
  the eyebrow line orphaning "Samoa" onto its own line at 390px.
- **plan/AUDIT.md** — one new MED row filed (score 4.0):
  `scripts/plan/settle.mjs`'s chunk-removal mishandles a chunk whose
  body is an indented paragraph (rather than sub-bullets) — caught
  live while closing 52.1 only because the lead re-read the diff
  before trusting `--no-commit`'s "tidied" message; also miscounted
  the README's "N left" cell. `plan-check.mjs` stayed green through
  both defects.

## Queues now

- **plan:** 2 specs, 1 chunk left (52.2), 0 held (53 released,
  not yet chunked).
- **plan/AUDIT.md:** 7 pending reported. The known undercount bug
  (candidate score 5.6, still unfixed — `countRows()`'s
  comment-skip branch hides same-line `<!-- finale-shift:... -->`
  tagged rows) means the true count is still materially higher,
  same class of row the 2026-11-13 digest already named.
- **plan/CRITIQUE.md:** 85 pending (0 HIGH, 50 MED, 35 LOW), last
  pass 206, ~10h ago.
- **candidates:** 14 pending (12 >21d), oldest 187d —
  `promote.mjs cap` reads clean (14 of 15, one slot of headroom).
  `promote.mjs sweep`: clean, 0 held lines to act on. `pick`/`due`:
  both `none` tonight — the strongest Pending candidate (score 5.6)
  still sits under bold posture's 6.0 floor, and `due`'s own
  depth gate (2 open specs, `promote_queue_depth: 2`) would block
  it regardless of score.
- **support:** 0 open user issues, no activity to report this tick.

## Needs you

- **motion stalled: shipped 7 / baseline 20 (2026-W46 against
  2026-W42..2026-W45), floor 10.** Three consecutive weekly-quota
  pause cycles (#849, #851, #852) are the documented cause, not a
  gate or code regression — see Tuning proposals below for the
  update filed against the existing cloud-reliability candidate.
  `stall_action: promote` (bold posture) should have march react on
  its own next tick; no motion-stall issue is open yet
  (`motion.mjs react` reads `none`).
- **oversight needed: candidate queue silting (12 pending >21d,
  oldest 187d).** Not yet over the 15-item cap (14/15), but
  climbing with nothing promoted tonight (`pick`/`due` both `none`).
- Promote: aged — `sweep` reads clean (0 held), `pick`/`due` both
  `none` (no Pending candidate clears the 6.0 floor; the 2-open-
  spec depth gate would block one even if it did) →
  **auto-promoted none, 0 awaiting**.
- No `cut` lines this window (candidates sit at 14/15, not over
  cap).
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

Next ready chunk: **52.2** ("Curator brief guardrail," size S,
closes A8, no blockers). Top finding on `/iterate`'s actual
dispatch path: the settle.mjs chunk-removal defect (score 4.0,
filed 11-15) — the tied score-4.5 finale-shift rows (18 of them,
plus the standing season-fill-drain row) route through
`/ship-content`'s own lane rather than `/iterate`'s AUDIT-score
path, per the existing undercount candidate's own note, so they
don't compete for this slot.

## Tuning proposals

One tonight, evidence appended to an existing `plan/CANDIDATES.md`
row — no gate, cadence, or ceiling edited directly:

1. **Cloud workflows need a fallback for org-level Claude access
   outages** (`[score 5.4]`, pending since 2026-08-20, already
   carrying three prior update notes). Appended an `Update (digest
   2026-11-16)` citing this week's third consecutive weekly-quota
   cycle: productive windows between pauses compressed to ~11
   minutes then ~39 minutes (down from last week's 25.3h → 1.3h),
   and `pulse.mjs --motion` now confirms `stalled` (7/20, floor 10)
   — the shrinking-recovery-window trend the 2026-11-13 digest
   flagged as "worth a look" has continued. Also noted the
   nuance: the window opened by this morning's reset has run
   10h23m clean so far (`seven_day` utilization 0.07, `allowed`),
   the healthiest post-reset stretch in the trend's history — not
   enough data yet to call it a reversal, but it isn't
   monotonically worsening either. No score change — evidence
   only, consistent with how this row already tracks its three
   prior updates (2026-09-21, 2026-10-24, 2026-11-13).

# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-14

## Headline

**The `episodes_caption` well ran dry, and the loop kept going
without it.** The corpus-wide bare-restatement drain that carried
the last two digests to corpus-zero overnight (five shows —
bachelor, bake-off, ink-master, the-real-world, chopped — 32
files, warning count 248 → 0, commit `51112015`). Rule 2
(season-fill) stayed fully starred all day (46 shows / 47
gap-slots, nearest actionable finale still american-ninja-warrior
S18, 08-17). Rule 3 (themed lists) posted **ten more same-day
zero-ship passes** (ninth through eighteenth) on top of yesterday's
eleven — but with its usual redirect target now permanently spent,
cloud `march` leaned on the two thinner wells instead: three
`/critique` passes (119/120/121, 8 findings total, all but two
resolved same-day) and one `/expand` pass (62, 0 new candidates,
reinforced #33). Deploy green at HEAD (`5f070e42`). `e2e-full`
broke red again last night on the same familiar duration-ceiling
wall — third time in four nights. Candidate #33 (content-gate
carve-out) picked up a fresh update: this is the first day the
loop has run this thin on non-`/oversight`-blocked fallback work
since the pattern was diagnosed.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last ~24h, `march` | 40 runs | 38 `success`, 2 `cancelled` (concurrency evictions, expected), 0 `failure` |
| Commits since last digest (`a9aed0fa`) | 34 | 16 `content:`, 7 `audit:`, 7 `fix:`, 3 `critique:`, 1 `expand:` |
| `night` (digest) | 2 daily triggers | 08-13 **success**, this tick (08-14) running now |
| `e2e-full` breadth crawl | 1 night (08-13) | **failure** — run `31753190734`, standard 75-minute duration-ceiling wall, `10547` tests declared, third breach in the last four nights |
| `pnpm deploy:check` at HEAD | — | `ready` (0s elapsed) |

## The saga

Rule 2 stayed fully starred all day — the 08-09 weekly sweep's
verdict holds (46 shows / 47 gap-slots, every remaining row
confirmed-but-unaired), and no dated finale crossed into the past
since then. Next sweep due 2026-08-16. Rule 3 landed zero real
extends today — ten consecutive zero-ship passes (ninth through
eighteenth, spanning 08-13 22:12 through 08-14 10:42), each logged
with a distinct dead axis in `plan/LISTS.md`'s Ideas log, the
eighteenth reconfirming the standing verdict: the catalog is
saturated at current density, the next actionable Rule 3 lead is a
new season landing, not further re-slicing.

The bigger saga event: the `episodes_caption` bare-restatement
drain — the redirect target that absorbed most of 08-12 and 08-13's
starvation (248 → 140 → 0 warnings across the two days) — hit true
corpus-zero mid-window (five shows finished today: bachelor,
bake-off, ink-master, the-real-world, and chopped as the long-pole
finale, `68debd14`/`51112015`). That well is now permanently gone,
not just temporarily drained — the whole warning class is fixed.
Today's zero-ship ticks leaned on the two remaining substitutes
instead: `/critique` (passes 119 no-findings, 120 three findings,
121 five findings — 8 total, six resolved same-day as `fix:`
commits) and `/expand` (pass 62, 0 new candidates, reinforced #33
with the well-exhaustion evidence above). `plan/CRITIQUE.md`'s
Pending count sits at 33 rows tonight, so near-term substitute
supply is intact, but both remaining wells are the ones candidate
#33's own tracking already flagged as non-self-sustaining on their
own (critique refills on a schedule; expand is posture-gated) —
today is the leanest fallback margin since the pattern was first
diagnosed 2026-08-08.

Catalog census: 68 shows / 1,046 seasons / 181 themed lists.

## Queues now

- `plan/AUDIT.md`: 6 actionable Pending rows, same shape as
  yesterday — 2 HIGH (the-voice factual corruption, candidate #36;
  night.yml starvation, candidate #35 — still quiet, no eviction
  incident logged since last several nights), 1 MED (standing
  Rule 2 drain row, correctly starved), 1 MED (e2e-full
  duration-ceiling breach, candidate #34 — updated tonight with
  08-13's evidence, third breach in four nights), 2 LOW
  (`YEAR_TENURE_RE` teen-number gap; themed-list SERP-budget
  over-length, both parked for oversight).
- `plan/CRITIQUE.md`: last pass **121**, 2026-08-14 — 5 findings
  (0 HIGH, 2 MED, 3 LOW). 33 Pending rows total, up from 32 at the
  last digest — the drain-down trend from earlier in the week has
  leveled off now that fresh passes are landing findings again.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass 62, 2026-08-14
  (0 new candidates). Same 4 fully-scoped unpromoted candidates as
  the last several digests: #33 (content-gate carve-out — tonight's
  update notes the `episodes_caption` fallback well going
  permanently dry, the leanest margin yet), #34 (shard e2e-full,
  24 days unpromoted, red again last night), #35 (decouple
  night.yml concurrency, dormant risk), #36 (the-voice remediation,
  top priority — live harm, unchanged since 2026-07-26). All await
  a local `/oversight` session.
- Open triage issues: 3 `triage:needs-user` (#758 content-gate
  starvation — thread still active, last comment 08-14 09:47;
  #762 the-voice corruption mirror; #763 night.yml starvation
  mirror), 2 `triage:loop-queued` (#754 Rule-3 pass-22 extend;
  #636 the e2e-full mirror, recurred again 08-13 into the same
  stale thread). No new unlabeled issues.

## Needs you

Same four candidates as the last several digests, unchanged
priority order:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still top: a live, reader-facing false "show has ended" claim
   at the root (8 season files + frontmatter). No new spread
   caught (the loop correctly keeps excluding `the-voice` ≥22 from
   all Rule 3 work), root cause unchanged since 2026-07-26.
2. **Candidate #34** — shard the e2e-full crawl. 24 days
   unpromoted, red again last night on the standard
   duration-ceiling wall (3rd of the last 4 nights). Still just a
   workflow-file edit no cloud token can push.
3. **Candidate #35** — decouple night.yml's concurrency group.
   Still dormant — no eviction incident in the last several nights
   — but the race itself is unfixed. Cheap, worth bundling with
   #34.
4. **Candidate #33** — content-gate bug-priority carve-out. Today's
   development sharpens the case further: the `episodes_caption`
   fallback well that absorbed most of the last two days' starvation
   is now permanently exhausted, leaving the loop dependent on two
   thinner, non-self-sustaining substitutes (critique refill,
   posture-gated expand). This is the leanest the fallback margin
   has been since the pattern was diagnosed six days ago — worth
   promoting this tick, not just noting it again.

All four remain workflow/skill-file or multi-file edits scoped for
a local `/oversight` session, not a cloud tick.

## Today's intent

Same bundle as recent digests — #36 (the-voice, active harm) and
#34 (e2e-full sharding, long-unpromoted) as the priority pair for
the next `/oversight` session, #35 folded in cheaply alongside
#34's workflow-file edit. #33 keeps strengthening its own case
organically: with the episodes_caption well gone, the next
multi-day zero-ship stretch will land squarely on critique/expand
alone, and neither is guaranteed to have supply on a given day.
Content-wise: Rule 2 stays locked until a dated finale lands or the
08-16 sweep finds something; Rule 3's idea pool needs either fresh
raw material (a new season) or a fresh axis class before a 19th
same-day search is worth forcing.

## Tuning proposals

None new. `plan/PHASE_CANDIDATES.md` already carries all four live
candidates (#33-#36); tonight's evidence (episodes_caption well
exhaustion, e2e-full's third breach in four nights) was folded into
their existing entries above rather than filed as new proposals —
the gate/cadence/ceiling shape itself is unchanged, only the
urgency read on #33 sharpened further.

# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-12

## Headline

**A quiet, healthy night — the loop is settling into its own workaround.**
No crashes, no starvation, deploy green at HEAD (6bd9317a). The
content saga stayed fully starred (Rule 2: 43/44 gap-slots still
confirmed-but-unaired; Rule 3: a third same-day zero-ship pass
today, the pool re-confirmed mined out on five more angles), and
issue #758's dispatch-starvation workaround kept doing its job —
three separate cloud ticks today fell through to `plan/CRITIQUE.md`
instead of forcing a wasted search, landing three real fixes
(stat-tile duplication on perfect-match S4, survivor-50, and
best-finales' stale entry count) plus critique pass 116 itself. The
underlying `march` dispatch-order question is still unresolved and
still a human call — today's tick said so explicitly rather than
unilaterally reordering Step 3b.5. The e2e-full breadth crawl
confirms the known duration-ceiling pattern continues (candidate
#34, now 22 days unpromoted) and threw one new, unrelated one-off:
a runner-side git/TLS checkout failure on 08-11, logged but not
actioned. The four unpromoted candidates (#33-#36) are unchanged
from yesterday and still all await a local `/oversight` session.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last 26h, `march` | 40 runs | 38 `success`, 2 `cancelled` (concurrency evictions, expected), 0 `failure` |
| Commits since last digest (e9a56cfa) | 30+ | mostly `content:` fixes + `audit:` progress notes, 1 `critique:` pass, 0 crashes |
| `night` (digest) | 2 daily triggers | 08-11 **success**, this tick (08-12) running now |
| `e2e-full` breadth crawl | 2 nights (08-10, 08-11) | both **failure** — 08-10 the known 75-minute duration-ceiling wall (89.7% complete); 08-11 a distinct one-off git/TLS checkout failure before any test ran (see `plan/AUDIT.md`) |
| `pnpm deploy:check` at HEAD | — | `ready` |

## The saga

Rule 2 (season-fill drain) stayed fully starred all night — two
separate re-verification passes on the-challenge S42 and rhoc S20
confirmed both remain unaired, zero drain, consistent with the last
full sweep (2026-08-09, next due ~08-16). Rule 3 (themed lists) ran
its idea-space search a third time today and came back empty again
— five more angles tried and killed (cast-size records, runtime
changes, panel turnover, EP/showrunner credits, crossover episodes),
all already staked elsewhere or ungroundable. Rather than force a
fourth same-day search, cloud `march` fell through to
`plan/CRITIQUE.md`'s pending queue on the exhausted ticks — the
workaround issue #758 documents is holding steady, three ticks in a
row today: fixed perfect-match S4's FORMAT/CAST SIZE stat-tile
duplication, survivor-50's FILMED/FORMAT stat-tile issues, and
best-finales' stale `featured_pull` entry count (a critique
pass-106 finding). `/expand` has not run since pass 61 (2026-08-11,
0 candidates) — one day stale, not yet starved.

## Queues now

- `plan/AUDIT.md`: 5 actionable Pending rows, unchanged shape from
  yesterday — 2 HIGH (the-voice factual corruption, candidate #36;
  night.yml starvation, candidate #35 — still quiet, 4+ days since
  the last eviction), 1 MED (standing Rule 2 drain row, correctly
  starved), 1 MED (e2e-full duration-ceiling breach, candidate #34
  — updated tonight with the 08-10/08-11 evidence), 1 LOW
  (`YEAR_TENURE_RE` teen-number gap).
- `plan/CRITIQUE.md`: last pass **116**, today (2026-08-12) — 2 new
  findings (0 HIGH, 1 MED, 1 LOW), both on Bake Off (systemic
  FORMAT-tile duplication across all 16 season files; a body-section
  echo on the-hammond-continues). ~41 Pending rows total, 0 HIGH,
  11 MED, 30 LOW — three of today's MED fixes landed from this
  queue via the #758 fallback path.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass 61, 2026-08-11 —
  1 day stale. Same 4 fully-scoped unpromoted candidates as
  yesterday: #33 (content-gate carve-out, lowest urgency), #34
  (shard e2e-full, confirmed still broken, now 22 days unpromoted),
  #35 (decouple night.yml concurrency, dormant risk), #36 (the-voice
  remediation, top priority — live harm). All await a local
  `/oversight` session; none promoted overnight (correct — the
  digest doesn't promote).
- Open triage issues: 3 `triage:needs-user` (#758 content-gate
  starvation — actively narrating today's workaround in its own
  comment thread, #762 the-voice corruption mirror, #763 night.yml
  starvation mirror), 2 `triage:loop-queued` (#754 Rule-3 pass-22
  extend, #636 the e2e-full mirror — recurred again 08-11 into this
  same stale thread). No new unlabeled issues since 08-08.

## Needs you

Same four candidates as the last several digests, unchanged
priority order:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still top: a live, reader-facing false "show has ended" claim at
   the root (8 season files + frontmatter). No new spread caught
   overnight (the loop is correctly excluding `the-voice` ≥22 from
   all Rule 3 work per the standing block), but the root cause is
   unchanged since 2026-07-26.
2. **Candidate #34** — shard the e2e-full crawl. 22 days unpromoted,
   still recurring on all but one of the last dozen nights. Tonight
   adds a second, distinct data point: 08-11's failure was a
   one-off runner TLS flake, not the timeout — worth noting the two
   failure modes are now separable, but the timeout is the one that
   needs the fix.
3. **Candidate #35** — decouple night.yml's concurrency group. Still
   dormant — no eviction incident logged since the last several
   nights ran clean — but the race itself is unfixed. Cheap, worth
   bundling with #34.
4. **Candidate #33** — content-gate bug-priority carve-out. Issue
   #758's own thread is now the best evidence this is a live,
   present question rather than a hypothetical: today alone saw
   three separate ticks explicitly reason through the same
   dispatch-order tension and choose the same manual workaround.
   The workaround keeps working, but it's now happened enough times
   that codifying it (rather than re-deriving it every exhausted
   tick) is worth a second look — nudging this back up from
   yesterday's "lowest urgency" read.

All four remain workflow/skill-file or multi-file edits scoped for
a local `/oversight` session, not a cloud tick.

## Today's intent

Recommend the same bundle as recent digests: #36 (the-voice, active
harm) and #34 (e2e-full sharding, long-unpromoted) as the priority
pair for the next `/oversight` session, with #35 folded in cheaply.
#33 is worth a fresh look now that issue #758 has three same-day
instances of the exact workaround it would formalize — not urgent,
but no longer purely hypothetical either. Content-wise, the Rule
2/Rule 3 double-starvation is stable, not worsening — the #758
fallback path is absorbing the exhausted ticks productively (3
real fixes shipped today via that path, plus critique pass 116
itself), so no new content-gate finding needed tonight.

## Tuning proposals

None. `plan/PHASE_CANDIDATES.md` already carries all four live
candidates (#33-#36) with today's evidence folded into the AUDIT.md
row updates above rather than new candidate filings — no gate,
cadence, or ceiling looks mistuned enough tonight to warrant a new
proposal beyond re-flagging #33's rising relevance under "Needs
you."

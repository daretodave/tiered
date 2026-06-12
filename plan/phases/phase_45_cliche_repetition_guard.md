# Phase 45 — Editorial-cliché repetition guard (`CLICHE_REPETITION_STRICT`)

> Single-tick **formalize-the-allowlist** delivery. The
> `collectClicheRepetitionIssues` helper, three pattern classes,
> the lax→strict flip, and the corpus drain all landed
> reactively across `/iterate` ticks `92ebd74` (measures/measured
> against, pass-25), `470d37c` (at full volume, pass-29), and
> `0e39b59` (freighted, pass-30) — earlier than the phase row was
> promoted (`56f5665`, 2026-06-11). The phase row's explicit
> deliverable that is **not yet shipped** is the per-phrase
> allowlist field promised by the registry shape
> `{ phrase, threshold, allowlist }`. This phase delivers that
> field, the matching semantics, and the test coverage. The
> mechanism mirrors phase 43's `TENURE_ANCHOR_ALLOWLIST`
> precedent.
>
> Promoted from `PHASE_CANDIDATES.md` #13 (score 6.0) via
> `/oversight` 2026-06-11, alongside phases 44 + 46.

## Why this is its own phase

The build-plan row commits to a registry of shape
`{ phrase, threshold, allowlist }`. The shipped helper carries
`{ label, re, threshold }`. The functional gate works fine
without the allowlist — every current corpus hit is under
threshold — but the **curator-pinning** affordance the brief
promised (let one high-leverage surface keep the phrase at a
tighter threshold than the rest of the corpus) is unbuilt.

Two motivations for shipping the allowlist now instead of
on-demand:

1. **Tighter thresholds become available the moment any future
   surface needs pinning.** Today `freighted` ships at threshold
   2 because the high-leverage HvV body opener is the one
   retention; if a fourth pattern lands with a threshold-1 shape
   (where the only legitimate use lives at a single fixed
   surface), the registry must already carry the affordance.
2. **The phase-45 row says the registry shape includes
   `allowlist`.** Future maintenance reads from the row to
   reconstruct what shipped; leaving the registry under-shaped
   would force a re-promotion to close it.

## What ships

### 1. The allowlist field on `ClichePattern`

```ts
type ClichePattern = {
  label: string
  re: RegExp
  threshold: number
  /** Per-phrase allowlist: hit `where`s that don't count toward
   *  the corpus threshold. Curator pins one high-leverage
   *  retention without re-tuning the threshold. */
  allowlist?: ReadonlyArray<string>
}
```

`allowlist` entries are exact-match strings against the `where`
string the scanner produces (e.g.
`content/shows/survivor/canon.md (#2 rationale)`). Allowlisted
hits are excluded **before** the threshold comparison, so the
allowlist tightens what counts as "a violation occurrence,"
not what gets reported.

### 2. Registry shape — no new patterns this tick

All three current patterns land with empty / absent
`allowlist`; the corpus passes today without any pins. The
brief sketch's `set the bar` / `the bar every` candidates
require a drain first (`rg -n "sets? the bar" content/` returns
**6 occurrences** today, above the proposed threshold of 4) —
defer to a future `/iterate` tick that drains then adds. Per
the brief's own scope-creep guidance: "added at threshold 4
after a pre-flight `rg` audit confirms the current corpus is
below threshold."

### 3. Tests (extend the colocated suite)

`src/content/__tests__/content-check.test.ts` already exercises
the helper's threshold, case-insensitivity, multi-form, and
no-false-positive behavior across all three patterns. Phase 45
adds:

- **Allowlist match** — an allowlisted `where` does not count
  toward the corpus threshold; corpus that would fail at N=4
  threshold-3 passes at N=4 threshold-3 with 2 entries
  allowlisted.
- **Allowlist miss** — a non-allowlisted `where` carrying the
  same phrase still counts; the gate fires.
- **Empty / absent allowlist** — patterns without an `allowlist`
  field behave exactly as before (the three live patterns
  remain green).

### 4. Comment realignment in `scripts/content-check.ts`

The introductory comment block at the registry references
phases 41/43 / candidate #12 for the lax→strict pattern.
Augment it with "Phase 45 ships the per-phrase `allowlist`
field — the `TENURE_ANCHOR_ALLOWLIST` analogue for cliche
patterns; populated when a curator pins one high-leverage
retention."

## Out of scope

- No new pattern adds this tick (`set the bar`, `the bar every`,
  etc.). The brief sketch flags these as drain-then-add
  candidates; per its own pre-flight guidance, `sets? the bar`
  needs a corpus drain before its pattern lands.
- No threshold re-tuning. Today's corpus passes; tightening
  thresholds is a separate editorial discipline ladder.
- No URL change, no schema change, no e2e fixture row owed.
- Spoiler P0 intact (the change is a verify-gate enhancement;
  no content body is rewritten in this tick).

## Done when

- `ClichePattern` carries `allowlist?: ReadonlyArray<string>`.
- `collectClicheRepetitionIssues` excludes allowlisted `where`s
  before the threshold check.
- Three new colocated test cases cover allowlist match,
  allowlist miss, and absent-allowlist behavior.
- The registry's introductory comment references Phase 45.
- `pnpm verify` green.
- Phase 45 row in `plan/steps/01_build_plan.md` flips to `[x]`.

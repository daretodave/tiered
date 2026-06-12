# Phase 46 — Colocated-test coverage gate extended to `src/app/**`

> **Outcome.** Finish the phase-42 move. `scripts/check-test-colocation.mjs`
> (+ pure-logic library) gains `'src/app'` in `ROOTS`, so an
> untested App Router page, layout, route handler, or OG image
> handler fails `pnpm verify` at the gate — not a finding
> `/iterate` discovers ticks later. The drained tree (35 sources
> under `src/app/`, all with colocated tests at pickup) passes
> clean on day one; allowlist stays empty.

## Why

Phase 42 shipped the gate with `ROOTS = ['src/components',
'src/lib', 'src/content']` and deliberately stopped at the
`src/app/` boundary. Since then `/iterate` spent ~11 ticks
reactively draining App Router files — every audit row named the
gap in the same words ("the phase-42 gate walks
`src/components/**`, `src/lib/**`, `src/content/**` but **not**
`src/app/**`"). The tree is now drained to completion. Extending
the gate's `ROOTS` locks the regression at the verify gate the
moment the next untested page / layout / route lands, instead of
burning a polish tick per file.

This is the exact Phase 42 precedent applied to one more tree:
add `'src/app'` to `ROOTS`, the test infra already authors every
App Router shape (page, dynamic `[segment]` page, redirect-page,
`route.ts` handler, `opengraph-image.tsx`, `sitemap.ts` /
`robots.ts`, `layout.tsx`, `not-found.tsx`), so the gate flip is
unlikely to surface new stragglers.

## Scope

One-line change in `scripts/check-test-colocation.mjs` (and a
mirroring line in the test fixtures): append `'src/app'` to
`ROOTS`. Pure-logic library is untouched — the walker is
generic; the reference check and allowlist machinery don't care
which root they're walking.

Confirmed at pickup: 35 source files under `src/app/`, all with
colocated `__tests__/<name>.test.{ts,tsx}` whose imports
reference the target module. The brief's pre-flight expectation
of "allowlist `src/app/internal/rank-shift-demo/page.tsx`" is
**revisited at pickup** — the demo already ships a comprehensive
colocated test (prod-leak gate, render contract, per-row prop
threading) which references `../page`, so it passes the gate
without an allowlist entry. No allowlist additions are needed.

## Routes / API endpoints / CLI surface

- `scripts/check-test-colocation.mjs` — `ROOTS` grows by one
  entry; no CLI shape or output change.
- No new package script. `check:test-colocation` already exists
  and runs as part of `pnpm verify`.
- No `.github/workflows/march.yml` update needed — phase-42's
  oversight push already wired `pnpm check:test-colocation` into
  the cloud call-1 string; the gate's new root is picked up
  transparently on the next cloud tick.

## Components / handlers

No app-code changes. The drain already authored every
straggler's colocated test.

## Tests

The gate's own colocated tests (`scripts/__tests__/check-test-colocation.test.mjs`)
exercise the pure-logic library — none of them encode `ROOTS`
itself (CLI scope), so they pass unchanged. Add one CLI-level
test asserting that `src/app` is among the configured roots —
the same shape would have caught a regression dropping a root.

## Decisions made upfront — DO NOT ASK

- **Roots:** append `'src/app'` to the existing array (don't
  rewrite the structure). Order doesn't matter — the walker
  iterates and aggregates.
- **Allowlist:** stays empty for the new root. The internal
  rank-shift demo already has a colocated test that references
  the page module; no genuine no-logic shapes exist in `src/app/`
  at pickup.
- **Test-of-gate shape:** assert configured `ROOTS` includes
  `'src/app'`. Read it via the same shape `phase-42`'s
  ALLOWLIST test would — but `ROOTS` lives in the CLI file
  (`scripts/check-test-colocation.mjs`), not the library, so the
  assertion runs against the CLI module's exported constant.
  Refactor the CLI to export `ROOTS` and `ALLOWLIST`
  named-exports for testability.
- **Cloud workflow update:** none. The phase-42 oversight push
  already wired `pnpm check:test-colocation` into the cloud
  call-1 string; appending a root inside the script needs no
  workflow change.

## Verify gate

Standard `pnpm verify` — the new root is empty of violations at
pickup, so the gate stays green.

## DoD

- `scripts/check-test-colocation.mjs` walks `src/app/**` in
  addition to the existing three roots.
- `scripts/__tests__/check-test-colocation.test.mjs` gains a
  regression test pinning `ROOTS` to include `'src/app'`.
- `pnpm verify` passes locally.
- Phase 46 row in `plan/steps/01_build_plan.md` flipped to `[x]`
  with commit sha.

## Follow-ups (out of scope)

- Linting `apps/e2e/**` for colocation — different convention
  (the spec files ARE the modules).
- Future test-shape conventions for new App Router files (e.g.
  `loading.tsx`, `error.tsx`) — none ship today; the brief is
  scope-bounded to the existing tree.

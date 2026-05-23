# Phase 42 — Colocated-test coverage gate

> **Outcome.** Shift §5a's standing rule ("every commit ships unit
> tests alongside code") **left into `pnpm verify`**, so an
> untested source module is a hard failure at the gate — not a
> finding `/iterate` discovers one tick later. Adds
> `scripts/check-test-colocation.mjs` (+ pure-logic library +
> colocated tests), wires it into the `verify` pipeline alongside
> `check:no-raw-img`, allowlists the genuine no-logic stragglers,
> and ships missing colocated tests for the testable ones.

## Why

§5a in agents.md says "every commit ships unit tests AND e2e
contributions." Today that rule is enforced **reactively**: when
`/iterate`'s audit runs, it scores testless modules as
medium-priority `category: tests` rows, then a later tick drains
them one at a time (the recent 16-commit + 11-commit drains
visible in `plan/AUDIT.md` cleared most of the backlog — #116,
#117, #118, #119, #120, #131, #132, #134-141). Cost: a polish
tick per file, and a *new* testless file slips in unflagged
between audits.

The #120 audit row exposed a sharper failure mode: filename-only
scans treat a file as covered when the test next to it actually
exercises a *different* module. `Header.tsx` had a colocated
`__tests__/Header.test.tsx` whose `describe()` targeted
`HeaderView`. The drain script said "covered"; reality said the
async server wrapper with the load-bearing `.catch(() => null)`
on `auth0.getSession()` was unpinned. A proactive gate that
checks both filename presence AND test→target reference catches
this class at the gate, not at the next audit.

Phase 18's `check:no-raw-img` is the exact precedent — a
discipline gate wired into verify, with a thin CLI wrapper, a
pure-logic library, and colocated `__tests__/` for the library.
This phase mirrors that shape.

## Scope

Walks `src/components/**`, `src/lib/**`, `src/content/**` for
`.ts` / `.tsx` modules. For each module `<dir>/<name>.<ext>`:

1. **Filename check** — looks for
   `<dir>/__tests__/<name>.test.ts` or
   `<dir>/__tests__/<name>.test.tsx`. Missing → violation.
2. **Reference check** — reads the test file, extracts every
   import specifier (static `from '...'`, dynamic
   `import('...')`, side-effect `import '...'`), resolves each
   relative spec against the test's directory, and confirms at
   least one resolves to the target source file (handling
   omitted extensions and `index.{ts,tsx}` resolution).
   Filename match without a matching import → violation
   (`Header.tsx` / `HeaderView.tsx` class).

Allowlist for genuine no-logic files:
- Type-only modules (`*types.ts` with no runtime exports).

Barrels with their own barrel tests pass naturally (the barrel
imports each child; existing pattern in
`src/components/profile/__tests__/index.test.ts` etc.).

Wires into `pnpm verify` alongside `check:no-raw-img` (same
position in the script — before `test:run`). Cloud march
workflow's call-1 string updated in the same shape.

## Routes / API endpoints / CLI surface

- New CLI: `scripts/check-test-colocation.mjs` — exits 0 on
  clean, 1 with formatted violation list otherwise.
- New `package.json` script: `check:test-colocation`.
- `verify` script updated to chain it in.
- `.github/workflows/march.yml` call-1 string updated to mirror.

## Components / handlers

- `scripts/lib/check-test-colocation.mjs` — pure logic: file
  walk, expected-test computation, import extraction, path
  resolution, violation formatting. Same shape as
  `scripts/lib/check-no-raw-img.mjs`.
- `scripts/check-test-colocation.mjs` — thin CLI: walks roots,
  injects fs + relative-path helpers, prints formatted output.
- `scripts/__tests__/check-test-colocation.test.mjs` — covers:
  filename match + reference match → passes; filename present +
  reference missing → fails (`Header.tsx` class regression);
  filename absent → fails; allowlist honored; import-spec
  extraction covers static / dynamic / side-effect forms;
  path resolution handles missing extensions and `index.ts`
  re-export targets.

## Stragglers (fix or allowlist)

The drain expects "few" stragglers — the recent ticks cleared
most. Current testless modules under the three roots:

- `src/components/chrome/footer/FooterBrand.tsx` — pure
  presentational lockup; ship a colocated test pinning the
  BrandMark size, the lockup span class, the wordmark, and the
  spoilers promise.
- `src/components/profile/ProfileEmpty.tsx` — single static
  `<p>`; ship a colocated test pinning the testid + copy.
- `src/components/profile/types.ts` — pure type-only module
  (no runtime exports); allowlist.
- `src/lib/auth0.ts` — singleton `Auth0Client` construction
  with env-conditional `audience`; ship a colocated test
  pinning the singleton identity + the conditional audience
  branch (set / unset).
- `src/lib/openai/index.ts` — pure barrel; ship a barrel test
  matching the `src/components/profile/__tests__/index.test.ts`
  precedent.

## Tests

Colocated tests for the script's library (one test file under
`scripts/__tests__/`). Plus the five straggler tests above.

No new URL, no new schema field, no new e2e fixture.

## Decisions made upfront — DO NOT ASK

- **Roots:** `src/components/**`, `src/lib/**`, `src/content/**`.
  Matches the brief verbatim. Does NOT walk `src/app/**` — App
  Router routes are covered by e2e + colocated route handler
  tests (the recent #131–#141 drain ticks). Adding `src/app/**`
  would mean every `page.tsx` needs a unit test, which is not
  the current convention.
- **Reference check:** resolves relative import specs only.
  Absolute aliased imports (`@/lib/foo`) from the test file
  would technically count, but the §5a convention is to import
  the colocated target via `'../<name>'` — anything else is a
  smell the gate should expose.
- **Allowlist shape:** array of POSIX relative paths in the CLI
  module, identical to `check-no-raw-img.mjs`. Easy to grep,
  easy to PR.
- **Output format:** mirrors `check-no-raw-img`'s
  `formatViolations` — header + per-row line + footer. Same
  shape so the verify gate's failure output reads consistently.
- **Cloud workflow update:** add `pnpm check:test-colocation`
  inline in the call-1 string in `.github/workflows/march.yml`,
  same position as `check:no-raw-img` (after `typecheck`).

## Verify gate

Standard `pnpm verify` (now including
`check:test-colocation`). Cloud march's three legs unchanged in
shape; call-1 string adds the new check.

## DoD

- `scripts/check-test-colocation.mjs` + library + tests shipped.
- `scripts/__tests__/check-test-colocation.test.mjs` passes
  under `pnpm test:scripts`.
- The five stragglers above are either tested or allowlisted.
- `pnpm verify` passes locally.
- Cloud march workflow call-1 string updated.
- Phase 42 row in `plan/steps/01_build_plan.md` flipped to
  `[x]` with commit sha.

## Follow-ups (out of scope)

- Extending the gate to `src/app/**` page routes — separate
  policy call; today's convention is e2e-first there.
- Linting `apps/e2e/**` for colocation — different convention
  (test specs ARE the modules).

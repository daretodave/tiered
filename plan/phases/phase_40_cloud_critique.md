# Phase 40 — Cloud-runnable `/critique` via a Playwright reader path

> Promoted via `/oversight` 2026-05-19 from
> `plan/PHASE_CANDIDATES.md` #07 (score 5.5). User ruled it
> **ahead of Phase 39** (priority inversion). One cloud tick.

## Why

`/critique` is the external-observer leg of the self-sustaining
loop. It is **local-only**: `reader.md` Path A drives the
operator's shared local Chrome MCP, and `march.yml`'s cloud
prompt hard-skips `/critique` ("reader sub-agent depends on a
Chrome MCP not available on the runner"). Yet the same workflow
already installs + caches headless chromium for the e2e leg —
the browser is present in CI; only the harness path is missing.

Critique pass 1 (2026-05-19) produced a false HIGH precisely
because Path A inherits the operator profile's live session. A
Playwright-driven path is *more* deterministic than Chrome MCP:
a fresh isolated `browser.newContext()` has no operator profile
to inherit, so the entire contamination class that produced the
pass-1 false finding **cannot occur in CI**. The lift is a walk
script + harness wiring, not new infrastructure.

## Scope

1. **`scripts/critique-walk.mjs`** — a Playwright walk driver:
   - Resolves `@playwright/test` from `apps/e2e` (the only
     workspace with chromium installed) via `createRequire`.
   - Launches a **fresh isolated context** per (viewport,
     mode) — genuinely clean, no shared profile.
   - `--mode anonymous` → no cookies. `--mode authenticated` →
     `context.addCookies()` with the `__session` pair from
     `--cookie` / `CRITIQUE_SESSION_COOKIE`. Invalid/missing
     pair in authed mode → emit one `auth-failed` finding and
     walk nothing (no silent fallback to anon — `reader.md`
     Step 0 hard rule 1).
   - Per URL × {1280 desktop, 375 mobile}: capture rendered
     body text, `<title>`/description/canonical/og:image,
     H1 presence, HTTP status, console errors, failed network
     requests, `scrollWidth`/`innerWidth`.
   - Emits `{ meta, captures[], findings[] }` JSON to stdout
     (or `--out <path>`). `findings[]` are the
     mechanically-detectable issues in the exact `reader`
     finding shape (every finding carries `auth_state`,
     `source: "browser"`); `captures[]` carry the rendered
     text the reader agent assesses qualitatively.
   - A page that errors/crashes yields a finding, never a
     thrown exception (the walk is resilient per URL).

2. **`reader.md` — Path A2 (Playwright, CI).** Add a third
   tooling path alongside Path A (Chrome MCP) and Path B
   (WebFetch). Document: when Chrome MCP is unavailable (CI),
   run `node scripts/critique-walk.mjs` for each pass, merge
   its `findings[]`, and do the qualitative pass
   (comprehension/voice/navigation) from `captures[]`. Note in
   Step 0 that Path A2's fresh isolated context makes the
   shared-profile contamination class structurally impossible —
   the cookie is set deterministically by `--mode`, so no
   `document.cookie` clear/verify dance is needed.

3. **`critique.md` — Path A2 selection.** Document that a cloud
   invocation selects Path A2; pre-flight still mints the
   cookie; the authed pass passes `CRITIQUE_SESSION_COOKIE` to
   the walk script.

4. **`march.yml` — flip the skip.** Change cloud-prompt item 2
   from "Skip /critique …" to dispatching `/critique` via Path
   A2, **respecting the existing `/march` Step 2 rate-limit +
   green-deploy + shipping-mode gates** (no new cadence — the
   gate logic in `skills/march.md` Step 2 is unchanged). Update
   the dispatch-order line: `triage → critique → ship-a-phase
   → …` (drop "(skipped)").

5. **Tests.** Colocated `scripts/__tests__/critique-walk.test.mjs`
   (`node --test`, no browser): `buildSessionCookies` —
   anon → `[]`; authed + valid pair → one `__session` cookie
   scoped to base URL; authed + missing/garbage pair → `null`
   (signals auth-failed). `analyzeCapture` — clean capture → no
   findings; 4xx status → infra/high; blank body → high;
   missing H1 → a11y; mobile overflow → mobile/high; console
   errors → finding; a malformed/`error` capture → a finding,
   not a throw.

## Decisions made upfront — DO NOT ASK

- **No new URL, no new page family, no UI, no schema.** Script
  + skill-docs + workflow only. agents.md §5a's e2e-harness
  contribution is **N/A** (nothing routable changes); the
  required test contribution is the colocated `node --test`
  spec, mirroring phase 32's script-only shape. Documented in
  the commit body.
- **Playwright resolution:** `createRequire(resolve(repoRoot,
  'apps/e2e/package.json'))` then `require('@playwright/test')`
  — clean workspace resolution, no fragile relative deep path,
  no root dependency added.
- **Script is pure-helper-first:** Playwright orchestration in
  `main()` guarded by an `import.meta`-direct-invoke check;
  `buildSessionCookies` / `analyzeCapture` / `VIEWPORTS`
  exported and unit-tested. The browser path itself is covered
  by being exercised every cloud critique pass (same posture
  as `deploy-check.mjs`).
- **Finding categories** map to `reader.md`'s enum: status/
  navigation failure + crash → `infra`; blank render → `infra`;
  missing H1 → `a11y`; mobile horizontal scroll → `mobile`;
  console JS error → `performance`; failed asset/network →
  `performance`; missing title/description/canonical/og →
  `seo`. Severity: hard breakage → `high`, degradation →
  `medium`.
- **No fallback on authed failure.** Mirrors `reader.md` Step 0
  hard rule 1 — authed handshake failure emits a single
  `auth-failed` finding and walks nothing; `/critique` files it
  as `[needs-user-call]`.
- **Local Chrome MCP path stays** as an operator-driven
  supplement (Path A unchanged). Path A2 is additive.

## Acceptance

- `node scripts/critique-walk.mjs --mode anonymous --base
  <url> --urls /,/shows` emits valid `{meta,captures,findings}`
  JSON; anon captures attach no `__session`.
- Authed mode with a valid `CRITIQUE_SESSION_COOKIE` attaches
  exactly one `__session` cookie; with a missing one emits a
  single `auth-failed` finding and exits without walking.
- `reader.md` documents Path A2; `critique.md` documents cloud
  Path A2 selection; `march.yml` dispatches `/critique` (no
  longer skips) under the unchanged Step 2 gate.
- `scripts/__tests__/critique-walk.test.mjs` green under
  `pnpm test:scripts`.
- `pnpm verify` green; `pnpm deploy:check` green after push.

## Follow-ups (out of scope)

- First *actual* cloud critique pass runs on a future tick when
  `/march` Step 2's rate-limit + green-deploy gate opens — not
  forced this phase.
- Tuning mechanical-finding thresholds (console-error
  allowlist, network-noise filter) is an `/iterate` concern
  once real passes accumulate signal.

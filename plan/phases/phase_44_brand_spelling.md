# Phase 44 — Brand-spelling discipline (`BRAND_SPELLING_STRICT`)

> Single-tick **lax→strict** invariant phase, same mechanic as
> phases 41 / 42 / 43. Adds a `scripts/content-check.ts`
> helper that scans customer-facing surfaces for two truncation
> classes of CLAUDE.md hard rule 6 (the `tiered.tv` brand wordmark
> is always full + lowercase, never truncated; `tiered.app` is the
> auth-tenant TLD and must not bleed into customer copy), drains
> every extant violation on the same tick, and flips strict in
> the same commit because the violation surface is small enough
> to clean in one pass.
>
> Promoted from `PHASE_CANDIDATES.md` #12 (score 6.6) via
> `/oversight` 2026-06-11 alongside phases 45 + 46.

## Why this is its own phase

CLAUDE.md hard rule 6 is one of the project's five non-negotiable
identity rules — and the only one without a verify-time gate.
Three rounds of `/critique` already filed findings of this class
(pass-24 `/sign-in` MED + `editors@tiered.app` LOW; subsequent
`/mod` description, JSON-LD `name` on `/shows/[show]` and
`/themes`, and the `not-found` link text) — each one drained
reactively by `/iterate` after the next critique pass surfaced
it, with no machinery to catch the next drift before then. Phases
41 / 42 / 43 are the proofs: an editorial standing rule enforced
reactively, drained per-tick, gated structurally only after a
`scripts/content-check.ts` lax→strict invariant lands.

## What ships

### 1. The check helper

A new `collectBrandSpellingIssues` in `scripts/content-check.ts`
scanning two surface families:

- **Customer-facing TS/TSX strings** under `src/app/**` +
  `src/components/**` (excluding `__tests__/`, the explicit
  `BRAND_DOMAIN_INFRA_ALLOWLIST` paths where `tiered.app` is the
  legitimate Auth0 tenant identifier, and the `BRAND_TRUNCATION_ALLOWLIST`
  paths where `tiered` appears as the english past-participle
  adjective in intentional editorial wordplay): any literal
  matching `\btiered\b` not immediately followed by `\.tv` is a
  truncation violation; any literal matching `\btiered\.app\b`
  outside the infra allowlist is a TLD-bleed violation.
- **Content markdown** under `content/**/*.md` (frontmatter +
  body): same two patterns. Repo-pointer URLs of the shape
  `github.com/<user>/tiered` are recognized as legitimate
  (Github's repo slug uses the project name's hyphen-friendly
  bare form, not the wordmark).

### 2. The allowlists

- `BRAND_DOMAIN_INFRA_ALLOWLIST` — paths where `tiered.app` is
  the Auth0 tenant identifier and is correct:
  `src/lib/auth0/permissions.ts`,
  `src/lib/auth0/__tests__/permissions.test.ts`,
  `src/app/api/mod/action/__tests__/route.test.ts`,
  `src/app/(default)/mod/__tests__/page.test.tsx`,
  `scripts/mint-e2e-cookie.mjs`.
- `BRAND_TRUNCATION_ALLOWLIST` — paths where `tiered` appears as
  the english past-participle adjective and is intentional
  editorial wordplay, not a truncated brand wordmark:
  `src/components/shows/ShowsHero.tsx` (the `/shows` H1 reads
  `All shows.<br /><em>Tiered.</em>`, a wordplay pun on the
  english adjective that lands explicitly after a sentence-end
  period — the brand wordmark appears separately and lowercase
  in the same hero's eyebrow `tiered.tv / Shows`).

### 3. The drains (same tick)

- `src/app/(default)/mod/page.tsx:19` — `Moderation queue for
  tiered (mod role only).` → `Moderation queue for tiered.tv
  (mod role only).`
- `src/app/shows/[show]/page.tsx:113` — JSON-LD
  `name: \`${show.name} — tiered\`` → `tiered.tv`.
- `src/app/(default)/themes/page.tsx:73` — JSON-LD
  `name: 'Lists — tiered'` → `'Lists — tiered.tv'`.
- `src/app/(default)/not-found.tsx:14` — link text `Back to
  tiered` → `Back to tiered.tv`.

### 4. The strict flip

`BRAND_SPELLING_STRICT = true` lands in the same commit since
all four drains land alongside the helper. Floor 0 — mirrors
`STRICT`, `CROSS_SHOW_STRICT`, `YEAR_TENURE_STRICT`,
`TAGLINE_TAIL_STRICT`, `THEME_COUNT_TAIL_STRICT`,
`THEMED_ENTRY_SPOILER_STRICT`, `WATCH_ORDER_CLASSIFICATION_STRICT`,
`CLICHE_REPETITION_STRICT`, `YEAR_TOKEN_PAIRING_STRICT`.

### 5. Tests

Colocated `scripts/__tests__/content-check.brand-spelling.test.ts`
(co-locating with the existing content-check test surface)
exercises each shape — positive (clean surface), negative
(each violation class), allowlist match (auth-tenant infra
path, editorial-adjective allowlist), repo-URL false-positive
(`github.com/daretodave/tiered` does NOT trip). No URL or schema
change; no e2e fixture row owed.

## Out of scope

- The operational `editors@tiered.tv` forwarder is the candidate
  sketch's flagged external dependency, but the only on-corpus
  mailto using it (`SuggestEntryCTA.tsx`) already shipped as
  `editors@tiered.tv` in a prior `/iterate` tick. The forwarder
  setup remains user-owned and outside the verify gate's reach.
- No URL contract change. No schema change. Spoiler P0 intact.

## Done when

- `pnpm content:check` passes with `BRAND_SPELLING_STRICT = true`.
- Every customer-facing surface either renders `tiered.tv` in
  full or is on `BRAND_TRUNCATION_ALLOWLIST` with the editorial
  rationale captured in this brief.
- The four drained surfaces ship with their updated copy.
- Phase 44 row in `plan/steps/01_build_plan.md` flips to `[x]`.

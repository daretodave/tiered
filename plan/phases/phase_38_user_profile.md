# Phase 38 — `/u/[handle]` real public profile

> Promoted via `/oversight` 2026-05-17 from
> `plan/PHASE_CANDIDATES.md` #04 (score 5.5). First phase
> promoted after full build-plan exhaustion. One cloud tick.

## Why

`spec.md:73`'s locked URL contract lists `/u/[handle]` as
"public user profile." It has been the **phase-10 shell** ever
since: `src/app/(default)/u/[handle]/page.tsx` renders only the
signed-in viewer's own handle, 404s every other handle,
surfaces zero activity, and ships `noIndex:true`. The in-code
TODO blocked itself on "phase 12 lights up real users writes" —
phases 11 (`users`+`votes`), 12 (`comments`), 35 (vote read
path), and 36 (comment read path) have all shipped. The
unblock condition is satisfied and nothing consumes it. With
the plan exhausted, no automatic mechanism will ever pick this
up — it stays a stub forever unless built. This is textbook
spec drift.

## Scope

1. **Handle resolution.** Resolve `handle` → `users` row by
   handle / nickname / sub. 404 only on genuinely-unknown
   handles — never "this isn't the signed-in user." A logged-out
   visitor must be able to view any real handle.
2. **Spoiler-safe activity surface** (P0 — see `agents.md` §7):
   - The user's *published* comments only — never `pending`,
     `hidden`, or `removed`. Reuse the phase-36 server read
     path's visibility rules; do not re-derive them.
   - Public vote *participation* counts (e.g. "voted on N
     seasons across M shows"). **Never** raw ballot detail,
     per-pair picks, or anything that reveals an unpublished
     canon position or a season outcome.
   - Recent published-comment excerpts + the shows/seasons the
     user has engaged, all spoiler-safe (the comment body is
     already spoiler-gated at write time; the *context link*
     must not leak a position the reader hasn't seen).
3. **Indexing.** Drop `noIndex` for populated profiles; keep
   `noIndex` for empty ones (no thin-content pages in the
   index).
4. **Data access.** Agent is the data admin — bold with a read
   RPC or a server route for the aggregate counts (bearings
   §Database posture). Nothing hardcoded; counts come from
   Supabase. No new write paths.

## Acceptance

- Logged-out visit to a known handle renders the activity
  surface; unknown handle 404s; "not me" does **not** 404.
- No `pending`/`hidden`/`removed` comment, and no raw ballot
  detail, is ever reachable on the page or its JSON-LD.
- Populated profile is indexable; empty profile stays
  `noIndex`.
- New `apps/e2e/tests/user-profile.spec.ts`: known handle
  renders activity, unknown 404s, mobile reflow at 375px. Row
  added to `apps/e2e/src/fixtures/canonical-urls.ts` +
  `page-reads.ts` (standing rule 5a).
- `pnpm verify` green; `pnpm deploy:check` green after push.

## Out of scope

- Profile editing, avatars, follow/social graph.
- Any write path or settings surface.
- URL-contract changes — this *fulfils* `spec.md:73`, it does
  not amend it.

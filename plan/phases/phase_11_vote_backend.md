# Phase 11 — Vote backend

> **The first phase where Pantheon stores real data on user behalf.**
> Up to phase 10 every page is read-only. Phase 11 makes votes
> durable: a Supabase `votes` table, a `cast_vote()` RPC that
> enforces weights + brigade limits, a real `POST /api/vote`
> handler, and a session-claim path that re-attributes anon votes
> to the user on sign-in.
>
> **Data-steward owns the migrations + RPC + RLS;** main agent
> wires the route handler + client + e2e.

## Goal

By the end of this phase:
- `supabase/migrations/*` adds a `users` table (one row per Auth0
  sub, keyed on `auth0_sub`) and a `votes` table
  (`id`, `session_id`, `target_type`, `target_id`, `value`,
  `weight`, `created_at`, `updated_at`) with a unique constraint
  `(session_id, target_type, target_id)` so a session can only
  hold one live vote per target.
- A `cast_vote()` RPC enforces:
  - Vote weight: 0.1× anon, 0.25× authed-with-account-age<7d,
    1.0× authed-with-account-age>=7d.
  - Brigade rate-limit: anon sessions capped at 100 votes/24h
    (counted by `session_id`). Authed sessions: 1000/24h.
  - Atomic upsert on the unique constraint — a second click in
    the same direction retracts (value → 0); a click in the
    opposite direction swaps.
- `claim_anon_session()` extended to re-attribute any votes from
  the anon session to the authed session row on sign-in.
  (Sessions table merge already lives there; phase 11 just adds
  the vote-FK update on top.)
- `POST /api/vote` route handler reads the request cookies,
  resolves the session id (auth path: ensure the user's row
  exists in `sessions`+`users` and use that id; anon path: use
  the `pantheon_anon_id` cookie), and calls `cast_vote()` with
  service-role context. Returns `{ value, count, persisted: true }`.
- The client `<VotePair>` already POSTs to /api/vote — no client
  changes required this phase.
- E2E: anon vote persists; authed vote persists; verification
  via direct DB query against the local Supabase.

## Outputs

```
supabase/migrations/<ts>_users.sql
supabase/migrations/<ts>_votes.sql
supabase/migrations/<ts>_cast_vote_rpc.sql
supabase/migrations/<ts>_claim_anon_session_v2.sql  (extends phase 10)

src/lib/supabase/server.ts                          # service-role client
src/lib/supabase/server.test.ts                     # smoke test (env validation)

src/app/api/vote/route.ts                           # rewrite — real RPC call

apps/e2e/tests/vote-backend.spec.ts                 # anon vote + authed vote, DB-verified
```

## Decisions made upfront — DO NOT ASK

- **All vote writes flow through `cast_vote()` RPC** — the route
  handler never inserts directly. Keeps the weight + rate-limit
  logic in one place; RLS on votes is "deny all", RPC runs as
  SECURITY DEFINER.
- **Anon session row creation is lazy.** Middleware mints the
  cookie; the first `cast_vote()` call inserts the session row
  if it doesn't exist (service-role context). No INSERT...RETURNING
  blocking on RLS.
- **Authed users get their `users` row + `sessions` row on first
  request.** The route handler ensures both before calling the
  RPC. This is a UPSERT pattern keyed on auth0_sub.
- **Weight is computed inside the RPC** (read `users.created_at`,
  apply the rule). The client doesn't know about weights — it
  only sees an integer count.
- **Count returned by /api/vote is the SUM of weighted values
  for that target** — so the client's optimistic count drifts a
  little, but the server-truth count is what gets persisted. The
  client's display catches up on the next page load (no live
  WebSocket in v1).
- **Brigade rate-limit overflow returns 429** with a JSON body
  the client can pretty-print later. Phase 11 doesn't surface
  the message in the UI — just makes the contract correct.
- **`/api/vote` is a server route, NOT a server action** —
  POST-only, force-dynamic, validates body shape via Zod.
- **No retract-toggle on the server** — the client sends the
  intended new value (`1`, `-1`, or `0`); the RPC upserts that
  value directly. The reducer handles the toggle math
  client-side per phase 9.

## Out of scope

- `compute_weighted_rank()` RPC + wiring to /community page
  source flip — deferred to follow-up (no votes yet means
  nothing to display; the current canon-mirror fallback is
  correct).
- Vote analytics dashboard for /mod (phase 13).
- WebSocket / SSE for live vote counts — v2.
- IP-hash retention sweeps (cron) — separate ops phase.

## Failure modes — when to stop

1. `cast_vote()` RPC returns wrong weight → unit-test the RPC
   directly via SQL; data-steward to patch.
2. /api/vote 500s on missing service-role key → fail loud at
   startup; surface in `.env.example` documentation.
3. E2E can't connect to local Supabase → check
   `supabase status`; the e2e webServer chain runs
   `supabase db reset --no-seed` so migrations must be valid.
4. RLS policy blocks the route handler — service-role bypasses
   RLS; if it doesn't, the client wasn't constructed with the
   service-role key.

-- ABOUT:
--   Creates `public.sessions` — the anon-first cookie session table.
--   Phase 10 (auth integration) substrate.
--
--   Every visitor gets a row here. Anon visitors are minted server-side
--   by Next.js middleware on first request (HttpOnly UUID-v4 cookie ->
--   session.id). When the visitor signs in via Auth0 magic link, the
--   row is "claimed" — auth0_sub is populated and claimed_at is set —
--   by the `claim_anon_session` RPC (separate migration).
--
--   PII posture (per bearings.md "Anti-abuse posture"):
--     - ip_hash:   SHA-256(ip + monthly_salt), 30-day retention
--     - user_agent: raw UA string, coarse abuse signal only
--     - auth0_sub: never email — Auth0 owns the email field
--
--   RLS posture:
--     - select: own anon row (by cookie) OR own authed row (by sub)
--     - insert: anon-first only (auth0_sub MUST be NULL)
--     - update: service_role only (claim RPC runs as service_role)
--     - delete: no client policy; retention sweeps run as service_role

create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  auth0_sub     text,
  ip_hash       text,
  user_agent    text,
  created_at    timestamptz not null default now(),
  claimed_at    timestamptz,
  last_seen_at  timestamptz not null default now()
);

-- Partial index for the auth-by-sub lookup (the hot read path).
create index if not exists sessions_auth0_sub_idx
  on public.sessions (auth0_sub)
  where auth0_sub is not null;

-- Index for retention sweeps (delete where created_at < now() - 30d).
create index if not exists sessions_created_at_idx
  on public.sessions (created_at);

alter table public.sessions enable row level security;

-- Drop any same-named policies if they exist (idempotency on `db reset`).
drop policy if exists sessions_select_own   on public.sessions;
drop policy if exists sessions_insert_anon  on public.sessions;
drop policy if exists sessions_update_claim on public.sessions;

-- SELECT: a client may read its own anon row (via the cookie GUC
--   request.cookie.tiered_anon_id that the Next.js middleware sets
--   via `set_config`) OR its own authed row (by Auth0 sub claim).
--   service_role bypasses RLS by default.
create policy sessions_select_own
  on public.sessions
  for select
  using (
    id = nullif(current_setting('request.cookie.tiered_anon_id', true), '')::uuid
    or auth0_sub = nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')
  );

-- INSERT: anyone may insert a fresh anon row. auth0_sub MUST be NULL
--   on insert; the claim path is service_role-only via the RPC.
--
-- Note for the middleware wiring this: an anon-role client CANNOT use
--   `INSERT ... RETURNING id` to discover the new row's id, because
--   the SELECT policy requires the cookie GUC to be set and that
--   isn't true on first-mint. Generate the UUID client-side
--   (`crypto.randomUUID()`) and pass it as the explicit `id` value,
--   then set the cookie on the response. Same advice for the e2e
--   harness if it ever inserts sessions directly.
create policy sessions_insert_anon
  on public.sessions
  for insert
  with check (auth0_sub is null);

-- UPDATE: no client may update. service_role bypasses RLS, so the
--   claim RPC (SECURITY DEFINER, granted to service_role) is the
--   sole writer of auth0_sub / claimed_at after creation.
create policy sessions_update_claim
  on public.sessions
  for update
  using (false)
  with check (false);

-- No DELETE policy. Retention sweeps run as service_role.

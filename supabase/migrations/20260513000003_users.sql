-- ABOUT:
--   Creates `public.users` — the authenticated-identity table.
--   Phase 11 (vote backend) substrate.
--
--   Users are keyed by Auth0's `sub` claim, which Pantheon treats
--   as the canonical user identity. We don't store password
--   material; we don't own the email field — Auth0 does, and we
--   merely cache it here for display purposes. The row is
--   upserted server-side by the route handler on first sign-in.
--
--   Schema:
--     auth0_sub      primary key, the `sub` claim from the Auth0 JWT
--     handle         unique, derived from nickname or email-prefix;
--                    used in URLs and @-mentions
--     email          cached for display; source of truth is Auth0
--     display_name   freeform user-visible name
--     created_at     account creation (drives vote-weight rule:
--                    accounts < 7 days old get weight 0.25)
--     updated_at     last write
--
--   Vote-weight contract (per bearings.md "Vote weighting"):
--     - logged-in user, account >= 7 days old -> weight 1.000
--     - logged-in user, account <  7 days old -> weight 0.250
--     - anonymous guest session                -> weight 0.100
--
--   `cast_vote()` joins sessions -> users on auth0_sub and reads
--   `created_at` to compute the weight. The created_at index
--   below keeps that join cheap.
--
--   RLS posture:
--     - select: public — handles + display names are visible to
--       all visitors (renders in vote/comment attribution).
--     - update: a user may UPDATE their own row (matched by
--       jwt.sub). Useful for handle/display_name edits later.
--     - insert: service_role only (route handler upserts).
--     - delete: service_role only (GDPR / right-to-be-forgotten).

create table if not exists public.users (
  auth0_sub      text primary key,
  handle         text unique not null,
  email          text,
  display_name   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Index on created_at — the account-age check on every vote
--   reads this column. Without an index, cast_vote() would scan
--   the users table once per vote write.
create index if not exists users_created_at_idx
  on public.users (created_at);

alter table public.users enable row level security;

-- Idempotency on `db reset`: drop any pre-existing same-named
--   policies before re-creating.
drop policy if exists users_select_public on public.users;
drop policy if exists users_update_own    on public.users;

-- SELECT: handles + display names are public attribution data.
--   This intentionally exposes `email`; the route handler that
--   reads users via anon-role client should select only the
--   public columns. (When we wire a `public_users` view, this
--   policy will tighten.) For now: experiment posture, ship it.
create policy users_select_public
  on public.users
  for select
  using (true);

-- UPDATE: a user may update their own row only. The handle and
--   display_name are the only columns a user should ever touch;
--   auth0_sub is the primary key (unchangeable) and email is
--   sourced from Auth0 (server re-syncs on each login). Column
--   restrictions are enforced application-side for now.
create policy users_update_own
  on public.users
  for update
  using (
    auth0_sub = nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')
  )
  with check (
    auth0_sub = nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')
  );

-- No INSERT / DELETE policies for anon or authenticated roles.
--   service_role bypasses RLS, so the upsert path (route handler)
--   and the deletion path (admin tooling) both work as expected.

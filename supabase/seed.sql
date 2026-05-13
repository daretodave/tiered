-- Pantheon seed.sql — applied after `supabase db reset` on every
-- e2e run. Intentionally minimal: the migrations are the source of
-- truth for schema; seed only carries values needed for local boot.
--
-- Phase 10 added the `sessions` table (anon-first cookie sessions).
-- Phase 11 added `users` + `votes` + the `cast_vote` RPC.
-- No pre-seeded rows — every visitor mints their own session, every
-- user is upserted on first sign-in — but we probe each table here
-- so a missing/broken migration trips this seed step rather than
-- the first runtime query.

-- Sanity check: Postgres is responding.
select now();

-- Sanity probe: phase-10 sessions table exists and is queryable.
select count(*) as sessions_row_count from public.sessions;

-- Sanity probe: phase-11 users + votes tables exist and queryable.
select count(*) as users_row_count from public.users;
select count(*) as votes_row_count from public.votes;

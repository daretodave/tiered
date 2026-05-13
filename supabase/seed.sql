-- Pantheon seed.sql — applied after `supabase db reset` on every
-- e2e run. Intentionally minimal: the migrations are the source of
-- truth for schema; seed only carries values needed for local boot.
--
-- Phase 10 adds the `sessions` table (anon-first cookie sessions).
-- No pre-seeded session rows — every visitor mints their own — but
-- we probe the table here so a missing/broken migration trips this
-- seed step rather than the first runtime query.

-- Sanity check: Postgres is responding.
select now();

-- Sanity probe: phase-10 sessions table exists and is queryable.
select count(*) as sessions_row_count from public.sessions;

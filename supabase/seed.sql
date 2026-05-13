-- Pantheon seed.sql — applied after `supabase db reset` on every
-- e2e run. Phase 11 lands the real migrations (votes / comments /
-- users / sessions); until then this file is intentionally minimal
-- so the local stack boots clean.

-- Sanity check: ensures Postgres is responding.
SELECT NOW();

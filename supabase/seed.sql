-- tiered.tv seed.sql — applied after `supabase db reset` on every
-- e2e run. Intentionally minimal: the migrations are the source of
-- truth for schema; seed only carries values needed for local boot.
--
-- Phase 10 added the `sessions` table (anon-first cookie sessions).
-- Phase 11 added `users` + `votes` + the `cast_vote` RPC.
-- Phase 12 added `comments` + `flags` + `ai_decisions` + the
--   `post_comment` / `flag_comment` RPCs.
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

-- Sanity probe: phase-12 comments + flags + ai_decisions exist.
select count(*) as comments_row_count from public.comments;
select count(*) as flags_row_count from public.flags;
select count(*) as ai_decisions_row_count from public.ai_decisions;

-- Phase 36: deterministic thread fixtures on Survivor S20
-- (`survivor:20`, /shows/survivor/season/heroes-villains). The
-- e2e read-path spec asserts:
--   * the published row renders for everyone (anon + authed)
--   * the pending row is invisible to the public AND to the
--     authed e2e viewer (it belongs to an anon session with no
--     auth0_sub, so it is never anyone's "own held" row) —
--     proves the spoiler/mod P0 split.
-- Both sessions are anon (auth0_sub NULL) → author renders as
-- "reader". Fixed UUIDs so the spec can be deterministic.
insert into public.sessions (id, auth0_sub)
values
  ('00000000-0000-4000-8000-0000000000a1', null),
  ('00000000-0000-4000-8000-0000000000a2', null)
on conflict (id) do nothing;

insert into public.comments (id, session_id, target_type, target_id, body, status)
values
  ('00000000-0000-4000-8000-0000000000b1',
   '00000000-0000-4000-8000-0000000000a1',
   'season', 'survivor:20',
   'The pacing in the back half is the best argument for this whole format.',
   'published'),
  ('00000000-0000-4000-8000-0000000000b2',
   '00000000-0000-4000-8000-0000000000a2',
   'season', 'survivor:20',
   'This pending row must never reach the public thread.',
   'pending')
on conflict (id) do nothing;

-- ABOUT:
--   Creates `public.votes` — the vote ledger.
--   Phase 11 (vote backend) substrate.
--
--   Every up/down/clear is one row, keyed by (session_id,
--   target_type, target_id). A second vote from the same session
--   on the same target is an UPDATE (via ON CONFLICT in
--   cast_vote), never a duplicate row. `value = 0` means the
--   user cleared their vote (we keep the row so weight history
--   survives a retract -> re-vote cycle in cheap time).
--
--   target_type is one of:
--     'season'   — target_id like 'survivor:20'
--     'comment'  — target_id is the comment UUID as text
--
--   Weight is materialized at write time, not at read time. This
--   lets aggregates be cheap: `SUM(value::numeric * weight)`
--   over the (target_type, target_id) index, no join required.
--   Re-weighting on account-age crossover would need a backfill
--   later — that's not in scope for v1.
--
--   RLS posture:
--     - select: public — vote counts and per-target breakdown
--       are visible. (Per-session vote history is fetched
--       server-side via the service-role client; clients ask for
--       their own votes by passing their session_id.)
--     - insert / update / delete: no policies. All writes flow
--       through cast_vote() which is SECURITY DEFINER and granted
--       only to service_role. RLS therefore denies every direct
--       write attempt by anon / authenticated roles.

create table if not exists public.votes (
  id            bigint primary key generated always as identity,
  session_id    uuid not null references public.sessions(id) on delete cascade,
  target_type   text not null check (target_type in ('season', 'comment')),
  target_id     text not null,
  value         smallint not null check (value in (-1, 0, 1)),
  weight        numeric(4, 3) not null default 0.100,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (session_id, target_type, target_id)
);

-- Composite index for the aggregate read path
--   (SUM(value*weight) WHERE target_type=? AND target_id=?).
create index if not exists votes_target_idx
  on public.votes (target_type, target_id);

-- Brigade rate-limit reads votes by session_id within a 24-hour
--   window. The unique constraint above already creates a btree
--   on (session_id, target_type, target_id), so a single-column
--   session_id index is technically redundant for prefix scans —
--   but the rate-limit query filters by created_at as well, and
--   a leading session_id index keeps the count cheap.
create index if not exists votes_session_id_idx
  on public.votes (session_id);

-- created_at index for the 24-hour brigade window. A partial
--   index on `created_at > now() - interval '24 hours'` would be
--   ideal but isn't IMMUTABLE, so a plain btree it is. The
--   rate-limit query is selective enough on session_id that this
--   index is rarely the chosen access path; we keep it for the
--   retention sweeps that filter purely on age.
create index if not exists votes_created_at_idx
  on public.votes (created_at);

alter table public.votes enable row level security;

-- Idempotency.
drop policy if exists votes_select_public on public.votes;

-- SELECT: vote rows are public. Aggregates and the
--   "my vote on this target" lookup both read here.
create policy votes_select_public
  on public.votes
  for select
  using (true);

-- No INSERT / UPDATE / DELETE policies. cast_vote() runs as
--   service_role (via SECURITY DEFINER + GRANT EXECUTE) and so
--   bypasses RLS for the write path. Any direct write attempt
--   from anon / authenticated roles is denied by RLS default.

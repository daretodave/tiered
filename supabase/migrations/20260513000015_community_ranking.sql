-- ABOUT:
--   The read half of the vote system (phase 35). The write path
--   (votes + cast_vote, phase 11) shipped long ago; this migration
--   adds the aggregate read RPC, the snapshot history that the
--   7-day trend / movers / RankShiftPill derive from, and the
--   scheduled-recompute entry point.
--
--   Three objects:
--
--   1. public.rank_snapshots
--      One row per (show, season) per recompute. The live ranking
--      is compute_weighted_rank() read straight through (cheap
--      aggregate over the votes_target_idx); the *history* needed
--      for "what changed this week" is materialized here so a
--      trend is a single indexed read of the most recent snapshot
--      >= 7 days old rather than a window function over the whole
--      ledger. Public SELECT (rankings are public); no write
--      policy — recompute_rankings() is SECURITY DEFINER and the
--      only writer.
--
--   2. public.compute_weighted_rank(p_show text)
--      The contracted aggregate behind GET /api/ranking/[show].
--      For every season target of the show
--      (target_type='season', target_id exactly '<show>:<n>'):
--        score      = SUM(value * weight)
--        approval   = weighted share of keep/raise votes
--                     = SUM(weight) FILTER (value = 1)
--                       / NULLIF(SUM(weight) FILTER (value <> 0), 0)
--        vote_count = COUNT(DISTINCT session_id) FILTER (value <> 0)
--      ordered score desc, then vote_count desc, then season asc
--      (deterministic ties), numbered 1..N. Test-suffix targets
--      like 'survivor:1:swap' are excluded — only the canonical
--      two-segment '<show>:<n>' form counts.
--
--   3. public.recompute_rankings(p_show text default null)
--      Snapshots the current ranking. NULL → every show present
--      in the ledger; otherwise just that show. Returns the row
--      count written. Called by POST /api/internal/recompute
--      (Vercel Cron, Thursday-night ET — see the route + the
--      vercel.json crons entry). pg_cron is intentionally NOT
--      used: it is not reliably present on the hermetic local
--      Supabase the e2e gate boots, and the Vercel-Cron path is
--      identical in effect and testable in-band.
--
--   Privilege posture mirrors cast_vote: SECURITY DEFINER, search
--   path pinned, EXECUTE revoked from public/anon/authenticated
--   and granted only to service_role. The Next.js routes reach
--   these via the service-role client; clients never call them
--   directly.

-- 1. Snapshot history -------------------------------------------------

create table if not exists public.rank_snapshots (
  id            bigint primary key generated always as identity,
  show          text not null,
  season_number int not null,
  rank          int not null,
  score         numeric(12, 3) not null,
  approval      numeric(5, 4),
  vote_count    int not null default 0,
  snapshot_at   timestamptz not null default now()
);

-- Trend / movers read "the most recent snapshot for this show at
--   least 7 days old" — a backward range scan on (show,
--   snapshot_at desc) terminates at the first qualifying row.
create index if not exists rank_snapshots_show_at_idx
  on public.rank_snapshots (show, snapshot_at desc);

alter table public.rank_snapshots enable row level security;

drop policy if exists rank_snapshots_select_public on public.rank_snapshots;

-- SELECT public: the ranking history is not sensitive. Writes have
--   no policy, so RLS denies every direct write; recompute_rankings()
--   (SECURITY DEFINER) is the sole writer.
create policy rank_snapshots_select_public
  on public.rank_snapshots
  for select
  using (true);

-- 2. The live aggregate ----------------------------------------------

create or replace function public.compute_weighted_rank(p_show text)
returns table (
  season_number int,
  score         numeric,
  approval      numeric,
  vote_count    int,
  rank          int
)
language sql
stable
security definer
set search_path = public
as $$
  with rows as (
    select
      split_part(v.target_id, ':', 2)::int            as season_number,
      sum(v.value::numeric * v.weight)                 as score,
      sum(v.weight) filter (where v.value = 1)
        / nullif(sum(v.weight) filter (where v.value <> 0), 0) as approval,
      count(distinct v.session_id)
        filter (where v.value <> 0)                    as vote_count
    from public.votes v
    where v.target_type = 'season'
      and v.target_id like p_show || ':%'
      -- canonical two-segment form only: '<show>:<n>', n all digits,
      -- no third ':' segment (excludes e2e suffix targets).
      and split_part(v.target_id, ':', 2) ~ '^[0-9]+$'
      and split_part(v.target_id, ':', 3) = ''
    group by 1
  )
  select
    r.season_number,
    coalesce(r.score, 0)            as score,
    r.approval,
    coalesce(r.vote_count, 0)::int  as vote_count,
    (row_number() over (
      order by coalesce(r.score, 0) desc,
               coalesce(r.vote_count, 0) desc,
               r.season_number asc
    ))::int                         as rank
  from rows r
  order by rank;
$$;

revoke all on function public.compute_weighted_rank(text) from public;
revoke all on function public.compute_weighted_rank(text) from anon;
revoke all on function public.compute_weighted_rank(text) from authenticated;
grant execute on function public.compute_weighted_rank(text) to service_role;

-- 3. Scheduled recompute ---------------------------------------------

create or replace function public.recompute_rankings(p_show text default null)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now    timestamptz := now();
  v_show   text;
  v_written int := 0;
  v_n      int;
begin
  for v_show in
    select distinct split_part(v.target_id, ':', 1)
      from public.votes v
     where v.target_type = 'season'
       and (p_show is null or split_part(v.target_id, ':', 1) = p_show)
  loop
    insert into public.rank_snapshots
      (show, season_number, rank, score, approval, vote_count, snapshot_at)
    select v_show, c.season_number, c.rank, c.score, c.approval,
           c.vote_count, v_now
      from public.compute_weighted_rank(v_show) c;
    get diagnostics v_n = row_count;
    v_written := v_written + v_n;
  end loop;

  return v_written;
end;
$$;

revoke all on function public.recompute_rankings(text) from public;
revoke all on function public.recompute_rankings(text) from anon;
revoke all on function public.recompute_rankings(text) from authenticated;
grant execute on function public.recompute_rankings(text) to service_role;

-- ABOUT:
--   Adds a `voter_count` (bigint) to `cast_vote` and `read_vote`
--   so VotePair can display the count of distinct voters on a
--   target instead of the signed-sum net.
--
--   Critique pass-34 MED: /shows/survivor and the season page
--   disagree on the HvV community-vote state across three
--   surfaces on adjacent hops. The show page's ShiftCard renders
--   `1 vote`; the season page's vote-pair renders `0 community ·
--   net votes` (the signed sum). The three surfaces describe
--   different mechanics but a reader doesn't carry that
--   vocabulary across the click. The fix aligns the vote-pair to
--   the ShiftCard's framing — count of distinct voters, not
--   signed sum. ShiftCard already sources its `vote_count` from
--   `compute_weighted_rank.vote_count` (`COUNT(*) FILTER (value
--   <> 0)`); this migration ports the same shape into the vote
--   RPCs so the same source feeds both surfaces.
--
--   `voter_count` semantics: `COUNT(*) FILTER (value <> 0)` over
--   the target. The votes table has UNIQUE (session_id,
--   target_type, target_id) so each session has at most one row
--   per target; counting rows with `value <> 0` is identical to
--   counting distinct voters. Mirrors the per-season
--   `vote_count` shape from 20260513000015_community_ranking.sql
--   line 104 — `count(distinct v.session_id) filter (where
--   v.value <> 0)` — though the UNIQUE constraint makes the
--   `distinct` redundant here.
--
--   Both function signatures change (a new OUT column), so they
--   are dropped and recreated rather than CREATE OR REPLACEd —
--   same posture as 20260518000001_vote_raw_count.sql. Bodies
--   are otherwise verbatim from that migration.

drop function if exists public.read_vote(uuid, text, text);

create function public.read_vote(
  p_session_id  uuid,
  p_target_type text,
  p_target_id   text
)
returns table (value smallint, count numeric, raw_count bigint, voter_count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_target_type is null or p_target_type not in ('season', 'comment') then
    raise exception 'invalid_target_type: % (expected season or comment)', p_target_type
      using errcode = '22023';
  end if;

  if p_target_id is null or p_target_id = '' then
    raise exception 'invalid_target_id: empty'
      using errcode = '22023';
  end if;

  return query
  select
    coalesce(
      (
        select v.value
          from public.votes v
         where v.session_id  = p_session_id
           and v.target_type = p_target_type
           and v.target_id   = p_target_id
      ),
      0::smallint
    ) as value,
    coalesce(
      (
        select sum(v.value::numeric * v.weight)
          from public.votes v
         where v.target_type = p_target_type
           and v.target_id   = p_target_id
      ),
      0
    ) as count,
    coalesce(
      (
        select sum(v.value)::bigint
          from public.votes v
         where v.target_type = p_target_type
           and v.target_id   = p_target_id
      ),
      0::bigint
    ) as raw_count,
    coalesce(
      (
        select count(*)::bigint
          from public.votes v
         where v.target_type = p_target_type
           and v.target_id   = p_target_id
           and v.value <> 0
      ),
      0::bigint
    ) as voter_count;
end;
$$;

revoke all on function public.read_vote(uuid, text, text) from public;
revoke all on function public.read_vote(uuid, text, text) from anon;
revoke all on function public.read_vote(uuid, text, text) from authenticated;
grant execute on function public.read_vote(uuid, text, text) to service_role;

drop function if exists public.cast_vote(uuid, text, text, smallint);

create function public.cast_vote(
  p_session_id  uuid,
  p_target_type text,
  p_target_id   text,
  p_value       smallint
)
returns table (
  value smallint,
  weight numeric,
  count numeric,
  raw_count bigint,
  voter_count bigint,
  persisted boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub        text;
  v_age_days   int;
  v_weight     numeric;
  v_session_count int;
  v_total      numeric;
  v_raw        bigint;
  v_voters     bigint;
begin
  if p_value is null or p_value not in (-1, 0, 1) then
    raise exception 'invalid_vote_value: % (expected -1, 0, or 1)', p_value
      using errcode = '22023';
  end if;

  if p_target_type is null or p_target_type not in ('season', 'comment') then
    raise exception 'invalid_target_type: % (expected season or comment)', p_target_type
      using errcode = '22023';
  end if;

  if p_target_id is null or p_target_id = '' then
    raise exception 'invalid_target_id: empty'
      using errcode = '22023';
  end if;

  insert into public.sessions (id)
  values (p_session_id)
  on conflict (id) do nothing;

  select s.auth0_sub
    into v_sub
    from public.sessions s
   where s.id = p_session_id;

  if v_sub is null then
    v_weight := 0.100;
  else
    select extract(day from now() - u.created_at)::int
      into v_age_days
      from public.users u
     where u.auth0_sub = v_sub;

    if v_age_days is null then
      v_weight := 0.250;
    elsif v_age_days < 7 then
      v_weight := 0.250;
    else
      v_weight := 1.000;
    end if;
  end if;

  select count(*)
    into v_session_count
    from public.votes v
   where v.session_id = p_session_id
     and v.created_at > now() - interval '24 hours';

  if v_sub is null and v_session_count >= 100 then
    raise exception 'rate_limited: anon session over 100 votes / 24h'
      using errcode = '23505',
            hint    = 'brigade-limit-exceeded';
  elsif v_sub is not null and v_session_count >= 1000 then
    raise exception 'rate_limited: authed session over 1000 votes / 24h'
      using errcode = '23505',
            hint    = 'brigade-limit-exceeded';
  end if;

  insert into public.votes (session_id, target_type, target_id, value, weight)
  values (p_session_id, p_target_type, p_target_id, p_value, v_weight)
  on conflict (session_id, target_type, target_id) do update
    set value      = excluded.value,
        weight     = excluded.weight,
        updated_at = now();

  select coalesce(sum(v.value::numeric * v.weight), 0),
         coalesce(sum(v.value)::bigint, 0::bigint),
         coalesce(count(*) filter (where v.value <> 0), 0)::bigint
    into v_total, v_raw, v_voters
    from public.votes v
   where v.target_type = p_target_type
     and v.target_id   = p_target_id;

  return query select p_value, v_weight, v_total, v_raw, v_voters, true;
end;
$$;

revoke all on function public.cast_vote(uuid, text, text, smallint) from public;
revoke all on function public.cast_vote(uuid, text, text, smallint) from anon;
revoke all on function public.cast_vote(uuid, text, text, smallint) from authenticated;
grant execute on function public.cast_vote(uuid, text, text, smallint) to service_role;

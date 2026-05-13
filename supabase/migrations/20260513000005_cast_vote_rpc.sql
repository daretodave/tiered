-- ABOUT:
--   Creates `public.cast_vote(p_session_id, p_target_type,
--   p_target_id, p_value)` — the sole write path into the votes
--   ledger.
--   Phase 11 (vote backend) substrate.
--
--   Contract (the route handler at /api/vote depends on this
--   verbatim — change with care):
--     call:   cast_vote(uuid, text, text, smallint)
--     return: table (value smallint, weight numeric, count numeric, persisted boolean)
--             - value     — the value we wrote (echo of p_value)
--             - weight    — the weight applied at write time
--             - count     — fresh SUM(value*weight) for the target
--             - persisted — true once row is inserted/updated
--
--   Behaviour:
--     1. Validates p_value ∈ {-1, 0, 1}. Raises on anything else.
--     2. Lazily upserts the sessions row (anon session may not
--        yet have been minted server-side; the middleware does
--        this on first request, but cast_vote shouldn't trust
--        the world).
--     3. Reads sessions.auth0_sub to decide whether this is an
--        authenticated or anon vote.
--     4. If authenticated, reads users.created_at to apply the
--        account-age weight rule:
--           sub IS NULL                    -> weight 0.100  (anon)
--           sub set, age < 7 days          -> weight 0.250  (new acct)
--           sub set, age >= 7 days         -> weight 1.000  (full)
--        If the users row is missing (route handler hasn't
--        upserted yet), we treat the account as "new" (0.250)
--        rather than reject — fail-open on identity, fail-closed
--        on weight.
--     5. Enforces brigade rate-limit per session_id in the last
--        24 hours:
--           anon  -> 100 votes / 24h
--           authed -> 1000 votes / 24h
--        IP-level rate-limiting is a layer above this RPC (the
--        route handler reads sessions.ip_hash and counts).
--     6. Upserts the vote row. ON CONFLICT (session_id,
--        target_type, target_id) DO UPDATE — the unique index
--        from the votes migration is what makes this atomic.
--     7. Computes and returns the fresh aggregate. One round-trip
--        for the client to update UI without a follow-up read.
--
--   Why SECURITY DEFINER:
--     The votes table denies all client writes via RLS (no
--     INSERT/UPDATE/DELETE policies). This RPC is the only path
--     in. SECURITY DEFINER + a tight GRANT EXECUTE to
--     service_role only means the route handler is the sole
--     caller — the anon and authenticated roles can't invoke it
--     directly, so the rate-limit logic above can't be bypassed
--     by hammering the PostgREST endpoint.

create or replace function public.cast_vote(
  p_session_id  uuid,
  p_target_type text,
  p_target_id   text,
  p_value       smallint
)
returns table (value smallint, weight numeric, count numeric, persisted boolean)
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
begin
  -- 1. Validate the vote value. The CHECK on the votes table
  --    will catch this too, but raising here gives a cleaner
  --    error to the route handler.
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

  -- 2. Ensure the session exists. The middleware mints anon
  --    sessions on first request, but a cookie-less curl request
  --    (e2e, debug) should still get a deterministic row rather
  --    than a FK violation downstream.
  insert into public.sessions (id)
  values (p_session_id)
  on conflict (id) do nothing;

  -- 3. Look up auth state.
  select s.auth0_sub
    into v_sub
    from public.sessions s
   where s.id = p_session_id;

  -- 4. Pick the weight.
  if v_sub is null then
    -- Anonymous guest.
    v_weight := 0.100;
  else
    select extract(day from now() - u.created_at)::int
      into v_age_days
      from public.users u
     where u.auth0_sub = v_sub;

    if v_age_days is null then
      -- Authed session but no users row yet. The route handler
      --   is supposed to upsert users before calling cast_vote;
      --   if it didn't, we err on the side of the new-account
      --   weight rather than full weight.
      v_weight := 0.250;
    elsif v_age_days < 7 then
      v_weight := 0.250;
    else
      v_weight := 1.000;
    end if;
  end if;

  -- 5. Brigade rate-limit. Count votes from this session in the
  --    last 24 hours.
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

  -- 6. Upsert the vote.
  insert into public.votes (session_id, target_type, target_id, value, weight)
  values (p_session_id, p_target_type, p_target_id, p_value, v_weight)
  on conflict (session_id, target_type, target_id) do update
    set value      = excluded.value,
        weight     = excluded.weight,
        updated_at = now();

  -- 7. Fresh aggregate. SUM(value * weight) is the canonical
  --    "score" for any target. COALESCE handles the all-zero
  --    edge (everyone retracted) — without it, SUM would return
  --    NULL and the route handler would have to defend.
  select coalesce(sum(v.value::numeric * v.weight), 0)
    into v_total
    from public.votes v
   where v.target_type = p_target_type
     and v.target_id   = p_target_id;

  return query select p_value, v_weight, v_total, true;
end;
$$;

-- Tighten EXECUTE privileges. The route handler is the only
--   caller; it reaches this via the service-role Supabase client.
revoke all on function public.cast_vote(uuid, text, text, smallint) from public;
revoke all on function public.cast_vote(uuid, text, text, smallint) from anon;
revoke all on function public.cast_vote(uuid, text, text, smallint) from authenticated;
grant execute on function public.cast_vote(uuid, text, text, smallint) to service_role;

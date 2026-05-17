-- ABOUT:
--   Creates `public.profile_activity(p_handle text)` — the
--   aggregate read path behind the public profile page
--   (`/u/[handle]`). Phase 38.
--
--   Contract (the server helper in src/lib/supabase/server.ts
--   depends on this verbatim — change with care):
--     call:   profile_activity(text)
--     return: table (
--               auth0_sub               text,
--               handle                  text,
--               display_name            text,
--               created_at              timestamptz,
--               published_comment_count bigint,
--               voted_season_count      bigint,
--               voted_show_count        bigint
--             )
--
--   Zero rows == genuinely-unknown handle. The page 404s only on
--   zero rows; a real handle with no activity still returns one
--   row (all counts 0) so "not me, but real" never 404s.
--
--   Resolution: `handle` is unique and the canonical identifier;
--   `auth0_sub` is accepted as a fallback so a sub-form URL still
--   resolves. Handle match wins when both could (the ORDER BY).
--   Match is case-insensitive — handles are lowercased at write
--   time (route handler `handleFromSession`), but a hand-typed
--   URL may not be.
--
--   Spoiler/abuse posture (agents.md §7 — P0):
--     - published_comment_count counts ONLY status='published'.
--       pending / hidden / removed are never counted and never
--       reachable through this RPC.
--     - vote aggregates are PARTICIPATION counts only: how many
--       distinct seasons / shows the user has a live (value<>0)
--       vote on. The RPC never returns target_id, vote value,
--       weight, or any per-ballot detail — that could leak an
--       unpublished canon position or a season outcome.
--
--   Activity is attributed across every session that resolves to
--   the user's auth0_sub (anon sessions get claimed on sign-in,
--   so a user can own several sessions rows over time).
--
--   Why SECURITY DEFINER: mirrors read_vote / cast_vote. The
--   server route is the sole caller via the service-role client;
--   routing the read through a service_role-only RPC keeps the
--   privilege story symmetrical and the column projection (no
--   raw ballot detail) enforced in one place.

create or replace function public.profile_activity(p_handle text)
returns table (
  auth0_sub               text,
  handle                  text,
  display_name            text,
  created_at              timestamptz,
  published_comment_count bigint,
  voted_season_count      bigint,
  voted_show_count        bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub     text;
  v_handle  text;
  v_display text;
  v_created timestamptz;
begin
  if p_handle is null or p_handle = '' then
    return;
  end if;

  select u.auth0_sub, u.handle, u.display_name, u.created_at
    into v_sub, v_handle, v_display, v_created
    from public.users u
   where lower(u.handle) = lower(p_handle)
      or u.auth0_sub = p_handle
   order by (lower(u.handle) = lower(p_handle)) desc
   limit 1;

  if v_sub is null then
    return;
  end if;

  return query
  select
    v_sub,
    v_handle,
    v_display,
    v_created,
    coalesce((
      select count(*)
        from public.comments c
        join public.sessions s on s.id = c.session_id
       where s.auth0_sub = v_sub
         and c.status = 'published'
    ), 0)::bigint,
    coalesce((
      select count(distinct v.target_id)
        from public.votes v
        join public.sessions s on s.id = v.session_id
       where s.auth0_sub = v_sub
         and v.target_type = 'season'
         and v.value <> 0
    ), 0)::bigint,
    coalesce((
      select count(distinct split_part(v.target_id, ':', 1))
        from public.votes v
        join public.sessions s on s.id = v.session_id
       where s.auth0_sub = v_sub
         and v.target_type = 'season'
         and v.value <> 0
    ), 0)::bigint;
end;
$$;

-- Same tight EXECUTE posture as read_vote: the server route is the
--   only caller, reaching this via the service-role client.
revoke all on function public.profile_activity(text) from public;
revoke all on function public.profile_activity(text) from anon;
revoke all on function public.profile_activity(text) from authenticated;
grant execute on function public.profile_activity(text) to service_role;

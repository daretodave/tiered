-- ABOUT:
--   Creates `public.claim_anon_session(p_anon_id uuid, p_sub text)`.
--   Phase 10 (auth integration) substrate.
--
--   Called by the Next.js Auth0 callback handler right after a user
--   completes the magic-link round-trip. Bridges the anonymous cookie
--   session to the authenticated identity.
--
--   Semantics:
--     1. If a session row for `p_sub` already exists, it is canonical.
--        Touch its last_seen_at, link the anon row to it via auth0_sub
--        + claimed_at (so we keep the anon row's history but mark it
--        merged), and return the canonical row.
--     2. Otherwise claim the anon row in place by stamping auth0_sub
--        + claimed_at on it.
--     3. If the anon row is missing or already claimed (edge: client
--        cleared its cookie, or two tabs raced), insert a fresh
--        authed-only row for the sub.
--
--   SECURITY DEFINER so the function can write past the sessions RLS
--   update policy. EXECUTE is granted only to service_role — server
--   code must reach this via the service-role Supabase client.

create or replace function public.claim_anon_session(
  p_anon_id uuid,
  p_sub     text
)
returns public.sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.sessions;
begin
  if p_sub is null or p_sub = '' then
    raise exception 'claim_anon_session: p_sub is required';
  end if;

  -- Case 1: a canonical row for this sub already exists.
  update public.sessions
     set last_seen_at = now()
   where auth0_sub = p_sub
   returning * into v_row;

  if found then
    -- Mark the anon row as claimed by linking to the same sub. We do
    --   not move votes/comments here; later migrations own that path
    --   (claim_anon_session is identity-only).
    if p_anon_id is not null then
      update public.sessions
         set auth0_sub  = p_sub,
             claimed_at = now()
       where id = p_anon_id
         and auth0_sub is null;
    end if;
    return v_row;
  end if;

  -- Case 2: claim the anon row in place.
  if p_anon_id is not null then
    update public.sessions
       set auth0_sub   = p_sub,
           claimed_at  = now(),
           last_seen_at = now()
     where id = p_anon_id
       and auth0_sub is null
     returning * into v_row;

    if found then
      return v_row;
    end if;
  end if;

  -- Case 3: no anon row, no canonical row — mint a fresh authed row.
  insert into public.sessions (auth0_sub, claimed_at, last_seen_at)
  values (p_sub, now(), now())
  returning * into v_row;

  return v_row;
end;
$$;

-- Tighten EXECUTE privileges. service_role is the only caller.
revoke all on function public.claim_anon_session(uuid, text) from public;
revoke all on function public.claim_anon_session(uuid, text) from anon;
revoke all on function public.claim_anon_session(uuid, text) from authenticated;
grant execute on function public.claim_anon_session(uuid, text) to service_role;

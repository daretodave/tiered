-- ABOUT:
--   Extends `public.claim_anon_session(p_anon_id, p_sub)` to
--   reattribute votes when an anon session is merged into a
--   canonical authenticated session.
--   Phase 11 (vote backend) substrate.
--
--   Phase 10's migration (20260513000002_claim_anon_session.sql)
--   created this function with identity-merge semantics only —
--   sessions rows were linked / merged, but votes (which didn't
--   exist yet at phase 10) were left in place. Now that the
--   votes table exists and references sessions.id via FK, the
--   claim path must also move the anon session's votes onto the
--   canonical authenticated session row.
--
--   CREATE OR REPLACE FUNCTION is idempotent. The phase-10
--   migration remains in history (git is the audit trail); this
--   migration supersedes its function body and re-applies cleanly
--   on `supabase db reset`.
--
--   Why move the votes:
--     - Vote weighting is recomputed at the next cast_vote call;
--       any future vote from this user gets the authed weight.
--     - Aggregates over (target_type, target_id) sum across both
--       rows already (vote SUM doesn't care about session
--       identity), so the user's prior anon votes were counted
--       at weight 0.100 and stay that way until they re-vote.
--       That's intentional — we don't retroactively re-weight.
--     - But the user should still be able to UPDATE their prior
--       votes (toggle from +1 to -1, etc.) post-claim. That only
--       works if the votes are owned by their canonical session.
--
--   Edge cases:
--     - If no votes exist on the anon session, the UPDATE is a
--       no-op (zero rows affected). Fine.
--     - If a vote on the same target already exists on the
--       canonical session (rare: user signed in on another
--       device, then back to anon-then-claim flow on this one),
--       the unique constraint would block the move. We resolve
--       by deleting the anon session's duplicate; the canonical
--       row is the authoritative one (higher weight, owned by
--       the signed-in identity).
--     - The FK is ON DELETE CASCADE, so deleting the anon
--       session would purge its votes. We DON'T delete the anon
--       session here — the phase-10 logic links auth0_sub onto
--       it instead, preserving the row for audit history.

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
    -- Mark the anon row as claimed by linking to the same sub,
    --   keeping its row for audit history.
    if p_anon_id is not null and p_anon_id <> v_row.id then
      update public.sessions
         set auth0_sub  = p_sub,
             claimed_at = now()
       where id = p_anon_id
         and auth0_sub is null;

      -- Reattribute votes: move the anon session's votes onto
      --   the canonical session. Drop any anon votes that would
      --   collide with an existing canonical vote on the same
      --   target — the canonical row is authoritative.
      delete from public.votes
       where session_id = p_anon_id
         and (target_type, target_id) in (
           select target_type, target_id
             from public.votes
            where session_id = v_row.id
         );

      update public.votes
         set session_id = v_row.id,
             updated_at = now()
       where session_id = p_anon_id;
    end if;
    return v_row;
  end if;

  -- Case 2: claim the anon row in place.
  if p_anon_id is not null then
    update public.sessions
       set auth0_sub    = p_sub,
           claimed_at   = now(),
           last_seen_at = now()
     where id = p_anon_id
       and auth0_sub is null
     returning * into v_row;

    if found then
      -- No vote move needed — the row's id is unchanged, so the
      --   FK on votes.session_id still points at the right row.
      return v_row;
    end if;
  end if;

  -- Case 3: no anon row, no canonical row — mint a fresh authed
  --   row. No votes to reattribute (no anon session to drain).
  insert into public.sessions (auth0_sub, claimed_at, last_seen_at)
  values (p_sub, now(), now())
  returning * into v_row;

  return v_row;
end;
$$;

-- Re-apply the same GRANTs as phase 10. CREATE OR REPLACE
--   preserves prior privileges, but being explicit here makes
--   the migration self-contained (someone running this on a
--   fresh DB without the phase-10 GRANTs would still get a
--   correctly-locked-down function).
revoke all on function public.claim_anon_session(uuid, text) from public;
revoke all on function public.claim_anon_session(uuid, text) from anon;
revoke all on function public.claim_anon_session(uuid, text) from authenticated;
grant execute on function public.claim_anon_session(uuid, text) to service_role;

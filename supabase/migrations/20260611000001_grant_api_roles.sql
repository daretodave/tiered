-- ABOUT:
--   Grants the Supabase API roles (anon, authenticated, service_role)
--   table-level privileges on every phase-11/12/13 public table.
--
--   Why this is needed (issue #402):
--   Tables created by the `postgres` migration role do NOT inherit
--   the default ACLs that Supabase auto-applies to tables created
--   by `supabase_admin`. Without explicit GRANTs, the API roles
--   only carry `TRUNCATE, REFERENCES, TRIGGER` on the table
--   (the postgres default for `public`), and PostgREST + the
--   service_role client both return `permission denied for table
--   <name>` on every read/write — even though service_role is
--   supposed to bypass RLS.
--
--   RLS bypass on service_role does NOT override missing table
--   GRANTs. GRANT is at the postgres ACL layer; RLS is row-level.
--   Both layers must permit access.
--
--   The cloud verify-gate e2e leg was structurally red for ~13h
--   on 2026-06-11 because of this — every authed-write spec
--   (`comment-backend`, `comment-read`, `community-page`,
--   `ranking-api`, `user-profile`, `vote-state-pill`) tripped on
--   `POST /api/vote` or `POST /api/comment` returning 500 with
--   `{"ok":false,"error":"auth_resolve_failed","detail":"upsertUser:
--   permission denied for table users"}`.
--
--   Fix shape: explicit per-table GRANTs to the three Supabase
--   API roles. This matches the standard Supabase pattern
--   (objects created by supabase_admin get the same auto-grants),
--   and the existing RLS policies in migrations 000001/000003/
--   000004/000007/000008/000009/000013/000015 continue to gate
--   row-level access for anon and authenticated — GRANTs are the
--   coarse postgres permission, RLS is the row filter, both must
--   permit. service_role bypasses RLS and now also has the table
--   GRANTs to write.
--
--   Additionally: ALTER DEFAULT PRIVILEGES on schema public for
--   role postgres so any future table created by the migration
--   role inherits the same grants automatically — guards against
--   re-introducing this regression on the next CREATE TABLE.
--
--   This migration is fully idempotent on `db reset` — GRANT is a
--   noop when the privilege is already held.

-- Tables in scope (phase 11 + 12 + 13):
grant select, insert, update, delete on public.users
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.sessions
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.votes
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.comments
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.flags
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.ai_decisions
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.mod_actions
  to anon, authenticated, service_role;
grant select, insert, update, delete on public.rank_snapshots
  to anon, authenticated, service_role;

-- Sequence grants — needed for any serial / identity columns to
--   work via the API roles (PostgREST nextval()). Belt-and-braces;
--   no current tables use bigserial, but future ones might.
grant usage, select on all sequences in schema public
  to anon, authenticated, service_role;

-- Default privileges — future tables created by `postgres` in
--   schema public inherit the same GRANTs, so a future
--   CREATE TABLE migration doesn't silently ship locked tables.
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables
  to anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  grant usage, select on sequences
  to anon, authenticated, service_role;

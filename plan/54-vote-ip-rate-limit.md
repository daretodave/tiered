# 54 — IP-level rate-limit backstop for guest votes

> `cast_vote()` enforces a per-session brigade limit, but a guest
> who clears the anon cookie (or opens a new private window) gets
> a fresh session and a fresh 100-vote budget for free. Close the
> IP-level backstop `plan/bearings.md`'s Anti-abuse posture
> already documents and the `sessions.ip_hash` column already
> reserves space for, but that was never built.

## Why

`plan/CANDIDATES.md`'s aged "coordinated vote-spam" candidate
(score 6.0, field-research-sourced) asked for a review of the
vote widget's anti-abuse posture. The review found the gap is not
hypothetical — it is a documented design decision that shipped
half-built:

- `plan/bearings.md` "Anti-abuse posture" states plainly: **"Plus
  IP-level rate-limit on guest sessions: 100 votes/IP/day"** and
  separately documents the hash scheme: **"IP-hash retention:
  SHA-256 of `(ip + monthly_salt)`, retained 30 days."**
- `supabase/migrations/20260513000001_sessions.sql` created the
  `sessions.ip_hash` column for exactly this purpose and even
  cites the bearings line in its own header comment.
- `supabase/migrations/20260513000005_cast_vote_rpc.sql`'s own
  header comment claims: "IP-level rate-limiting is a layer above
  this RPC (the route handler reads `sessions.ip_hash` and
  counts)."
- None of it exists. `grep -rn "ip_hash\|x-forwarded-for" src/`
  returns nothing — the column is never written, never read.
  `src/app/api/vote/route.ts` and `src/lib/supabase/server.ts`
  have no IP-aware code at all.

The only live defense is `cast_vote()`'s per-`session_id`
brigade check (100 votes/24h anon, 1000/24h authed —
`supabase/migrations/20260513000005_cast_vote_rpc.sql` step 5).
A `session_id` is just the `tiered_anon_id` cookie value. Any
guest who clears cookies, uses a private window, or scripts a
`crypto.randomUUID()` cookie gets a brand-new session row and a
brand-new 100-vote allowance — the exact "pure open-ballot,
gamed at scale" failure mode the candidate's field-research
signal described, and the one `bearings.md` already promised a
second layer against. This is a real, internally-evidenced gap,
not a speculative one — unlike the sibling "wagering markets"
candidate rejected at depth-promotion time for having zero
internal evidence.

## Design

**`src/lib/ipHash.ts` (new, pure, unit-testable):**
- `extractClientIp(headers: Headers): string | null` — reads
  `x-forwarded-for`, takes the first comma-separated entry,
  trims it; returns `null` if absent (local dev, a client that
  strips the header).
- `monthlySalt(secret: string, now: Date = new Date()): string`
  — `` `${secret}:${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}` ``,
  so the effective salt rotates on the first of every month
  without a persisted salt table (satisfies the 30-day-ish
  retention intent: a hash computed in one calendar month can't
  be correlated against the same IP's hash the following month).
- `hashIp(ip: string, secret: string, now: Date = new Date()): string`
  — `createHash('sha256').update(ip + monthlySalt(secret, now)).digest('hex')`.
- `IP_HASH_SECRET` added to `.env.example` (server-only, never
  exposed to the client). When unset, `hashIp` still runs (empty
  string secret) rather than throwing — a missing secret
  degrades the hash's unlinkability, not the rate-limit's
  function, and must never 500 a vote.

**`cast_vote()` RPC — new migration, additive:**
- New optional parameter `p_ip_hash text default null`.
- Step 2 (session upsert) becomes an upsert that also sets
  `sessions.ip_hash = coalesce(p_ip_hash, sessions.ip_hash)` and
  `last_seen_at = now()` on conflict — the hash recorded is
  always the most recent request's, which is what a rolling
  24-hour window needs.
- New step between the existing per-session brigade check (step
  5) and the upsert (step 6): for anon sessions only
  (`v_sub is null`) with a non-null `p_ip_hash`, count votes in
  the last 24 hours from any session sharing that `ip_hash`:
  `select count(*) from votes v join sessions s on s.id =
  v.session_id where s.ip_hash = p_ip_hash and v.created_at >
  now() - interval '24 hours'`. `>= 100` raises the same
  `rate_limited` / `brigade-limit-exceeded` shape the existing
  check uses, so the route handler's error branch (`e.hint?.includes('brigade')`)
  already covers it with no route-level change needed there.
- `create index if not exists sessions_ip_hash_idx on
  public.sessions (ip_hash) where ip_hash is not null` — the new
  count query's access path.
- Authed sessions are untouched: `bearings.md` only specifies the
  IP cap for guest sessions; an authed account already carries
  the stronger per-session 1000/day cap plus the account-age
  weight discipline.

**Route + wrapper:**
- `src/lib/supabase/server.ts`'s `castVote()` gains an optional
  `ipHash` field on `CastVoteArgs`, threaded through as
  `p_ip_hash`.
- `src/app/api/vote/route.ts`'s `POST` calls `extractClientIp(request.headers)`,
  then `hashIp(ip, process.env['IP_HASH_SECRET'] ?? '')` when an
  IP was found, and passes the result to `castVote()`. No IP
  found (local dev, a stripped header) → `ipHash: undefined`,
  RPC call unchanged, existing per-session limit still applies —
  never a hard failure.
- `GET` (the read path) is untouched; it never writes votes and
  has no brigade concern.

**Out of scope (explicitly, see Decisions made upfront).**
Comment write IP-limiting (`bearings.md`'s separate "20
comments/IP/hour for guest-attempted writes" line): comments
already reject every unauthenticated write with a 401 before any
DB row exists (`src/app/api/comment/route.ts`), so there is no
guest comment row to brigade in the first place — that bearings
line describes throttling *rejected* request volume, a
cost/logging concern, not a data-integrity gap. Different shape
of problem; not this spec.

## Decisions made upfront (do not ask)

- IP-level cap is anon-only, matching `bearings.md` verbatim.
  Do not extend it to authed sessions in this spec.
- The salt is a monthly-rotating derivation of one secret, not a
  stored, DB-managed salt table. Simpler, matches the "30-day
  retention" intent closely enough, and avoids a second rotation
  job this v1 has no operational story for yet.
- A missing `IP_HASH_SECRET` or a missing/unparseable
  `x-forwarded-for` header degrades gracefully to "no IP-level
  check this request," never a 500. The per-session limit is the
  floor that already exists; this spec adds a ceiling on top of
  it, and must never regress the floor's availability.
- No change to comment rate-limiting. See Design, "Out of
  scope."
- No backfill of `ip_hash` for existing session rows — it
  populates going forward, from the next vote each session
  casts.

## Acceptance

- **A1** `src/lib/ipHash.ts` exports `extractClientIp`,
  `monthlySalt`, and `hashIp`, each pure and unit-tested
  (including: multi-entry `x-forwarded-for`, missing header,
  salt rotating across a UTC month boundary with an injected
  clock).
- **A2** A new migration adds `p_ip_hash` to `cast_vote()`,
  upserts `sessions.ip_hash` on every call, adds the
  `sessions_ip_hash_idx` index, and raises the existing
  `brigade-limit-exceeded` shape once a shared `ip_hash` crosses
  100 anon votes in 24 hours — proven by a migration-level test
  (this repo's existing pattern for RPC behavior) seeding >100
  votes across multiple `session_id`s sharing one `ip_hash`.
- **A3** The same scenario with votes split across multiple
  distinct `ip_hash` values (no single IP over 100) is not
  rejected.
- **A4** An authed session (`sub` set) voting past 100 from one
  shared `ip_hash` is not rejected by the new check (only the
  existing 1000/24h per-session cap applies to it).
- **A5** `CastVoteArgs` / `castVote()` in
  `src/lib/supabase/server.ts` thread an optional `ipHash`
  through to `p_ip_hash`.
- **A6** `src/app/api/vote/route.ts`'s `POST` extracts the
  client IP, hashes it with `IP_HASH_SECRET`, and passes it to
  `castVote()`; a request with no resolvable IP still succeeds
  (no IP-level check applied, existing behavior otherwise
  unchanged).
- **A7** `.env.example` documents `IP_HASH_SECRET`.
- **A8** `plan/bearings.md`'s Anti-abuse posture section needs no
  wording change — this spec makes the existing line true rather
  than restating it; the chunk that lands A2–A7 notes in its
  commit body that the posture doc is now accurate.

## Open questions

- Whether `ip_hash` should ever feed into vote *weighting*
  (rather than only a hard cutoff) if a shared IP turns out to be
  a legitimate household/campus signal rather than abuse —
  deferred; `bearings.md` specifies a flat cap, not a weight
  penalty, and changing that is a future candidate if the cap
  itself produces false positives in practice.

## Chunks

Measure: 8 open · 0 closed · next A9

Not chunked yet.

# CRITIQUE

> Last pass: never (harness verified 2026-05-17; no scored pass yet)
> Pass count: 0
> Gated: NO — shipping-mode gate lifted 2026-05-17 via oversight
> (Phase 36 shipped). `/march` Step 2's normal rate-limited
> cadence is active. Harness is verified working (see
> `plan/bearings.md` "Critique cadence" → Working harness
> contract). Pass count increments on the first local scored
> pass. **Local-only**: the cloud runner has no Chrome MCP.

> External-observer findings filed by `/critique` (reader
> sub-agent walking the live site) and `/jot` (user's
> quick-fire observations). `/iterate` drains the Pending
> section as a second source alongside `plan/AUDIT.md`.
>
> Each row tagged with the pass that filed it: `anon:` (no
> cookie; first-time visitor perspective) or `authed:`
> (signed-in as `e2e@pantheon.app`; returning-member
> perspective). Both passes run on every `/critique` invocation;
> findings deduped by message.

## Pending

> Shipping mode ended 2026-05-17 (Phase 36 shipped; gate
> lifted via oversight). The two harness `[needs-user-call]`
> rows were **verified resolved** the same day — both blockers
> failed to reproduce in a fresh Chrome MCP session (evidence
> in `plan/bearings.md` → Working harness contract) and are
> moved to Done. The four product rows below were captured
> incidentally during the 2026-05-16 debug session; they are
> auth-invariant, vetted valid, and are **NOT** a scored pass
> (pass count stays 0 until the first real local `/critique`).
> `/iterate` may drain them now alongside `plan/AUDIT.md`.

<!-- Format:
- [ ] [SEV] [anon|authed|jot] <one-line finding> (URL: <path>, source: <critique-pass-N|jot>) — <commit hash where filed>
-->

### Product findings (auth-invariant; valid; drain now)
- [ ] [LOW] [anon] Survivor S4 titled "Micronesia" in the Editor's Canon view but "Micronesia: Fans vs. Favorites" in the community ranking table — use one canonical season display name for both (URL: /shows/survivor?view=community, source: debug 2026-05-16) — 978ac48
- [ ] [LOW] [anon] /shows/survivor/season/47 silently resolves to /shows/survivor/season/survivor-47 — two URL forms reachable; confirm a 301 + matching rel=canonical and keep e2e canonical-urls in sync (URL: /shows/survivor/season/47, source: debug 2026-05-16) — 978ac48

## Done

- [x] [needs-user-call] critique anon pass cannot run clean (persistent tiered.tv login in the Chrome profile). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): does not reproduce. A fresh `tabs_create_mcp` group has no tiered.tv cookies; `https://tiered.tv/` renders "Sign in", `document.cookie` empty, `/api/auth/me` → `signedIn:false`. The anon walk is genuinely logged-out; no incognito profile needed. Stale-profile artifact, not a structural block.
- [x] [needs-user-call] critique authed pass cannot run at all (no cookie-injection path; httpOnly `__session` unattachable). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): the httpOnly reasoning was wrong for a clean profile. With no pre-existing `__session`, `document.cookie="__session="+CRITIQUE_SESSION_COOKIE` is accepted by the server: `/api/auth/me` → `signedIn:true, handle:"e2e"`, chrome shows `@e2e / Sign out` after reload. Verified live. Harness contract recorded in `plan/bearings.md` → Working harness contract.
- [x] [MED] [anon] Canon prose ordinals are off-by-one vs the displayed slot numeral — slot 12 "Marquesas" reads "places it eleventh", slot 14 "The Australian Outback" reads "twelfth", slot 15 "China" reads "thirteenth" (URL: /shows/survivor, source: debug 2026-05-16) — 978ac48 — issue #63 — RESOLVED 7ef5bce: full sweep of `content/shows/survivor/canon.md` — ~30 of 47 entries had a placement ordinal frozen at an older ranking; every one rebased to its slot position (only the ordinal word changed, no voice change, no reorder). Durable guard added: pure `src/lib/canon/placement-ordinal.ts` extractor + a `content-check` invariant (lax mode) so prose-ordinal-vs-slot drift now fails the verify gate permanently. Caught two latent ones in other shows during the sweep; both were extractor false-positives on a two-sentence placement pattern, fixed before commit.
- [x] [MED] [anon] Bachelorette home card says "21 seasons. She holds the roses now." while its own meta line on the same card reads "20 seasons · canon + community" — derive both from one `seasons` field (URL: /, source: debug 2026-05-16) — issue #61 — RESOLVED this commit: `ShowTile` meta now derives from the authoritative `show.seasons` field instead of `getAllSeasons(slug).length` (seeded-file count that lagged the editorial number during content drains). `seasonCount` prop removed so no caller can reintroduce the divergence; regression test added in `ShowTile.test.tsx`.

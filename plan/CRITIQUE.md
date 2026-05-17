# CRITIQUE

> Last pass: never
> Pass count: 0
> Gated: NO `/critique` passes until Phase 36 ships (shipping
> mode). `/march` Step 2.0 enforces this; rationale in
> `plan/bearings.md` "Critique cadence" (user-set 2026-05-16).
> Pass count stays 0 until the first post-gate scored pass.

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

> No scored critique pass has run (pass count 0; critique is
> gated until Phase 36 — see header). The rows below were
> captured **incidentally** during the 2026-05-16 local-march
> debug session, in which **both** critique passes infra-failed
> (see the harness rows). They are NOT a scored pass. The four
> product rows are auth-invariant and were vetted valid by the
> reader regardless of session state; `/iterate` may drain them
> once shipping mode ends.

<!-- Format:
- [ ] [SEV] [anon|authed|jot] <one-line finding> (URL: <path>, source: <critique-pass-N|jot>) — <commit hash where filed>
-->

### Harness / needs-user-call (local-march infra — not product defects)
- [ ] [needs-user-call] critique anon pass cannot run clean: the Chrome profile carries a persistent tiered.tv login (`@me` / `Sign out` in every page header), so the anon walk runs authenticated. Needs an incognito / clean-profile harness for the anonymous pass. (source: debug 2026-05-16) — 978ac48
- [ ] [needs-user-call] critique authed pass cannot run at all: no cookie-injection path in this environment — browser MCP has no JS-eval/set-cookie primitive, the Auth0 `__session` cookie is `httpOnly` (so `document.cookie` cannot write it), and `WebFetch` has no header parameter. The freshly-minted `CRITIQUE_SESSION_COOKIE` is well-formed but unattachable. Needs the cookie pre-seeded into the Chrome profile before the authed pass, or a set-cookie browser tool. (source: debug 2026-05-16) — 978ac48

### Product findings (auth-invariant; valid; drain after Phase 36)
- [ ] [MED] [anon] Canon prose ordinals are off-by-one vs the displayed slot numeral — slot 12 "Marquesas" reads "places it eleventh", slot 14 "The Australian Outback" reads "twelfth", slot 15 "China" reads "thirteenth" (URL: /shows/survivor, source: debug 2026-05-16) — 978ac48
- [ ] [MED] [anon] Bachelorette home card says "21 seasons. She holds the roses now." while its own meta line on the same card reads "20 seasons · canon + community" — derive both from one `seasons` field (URL: /, source: debug 2026-05-16) — 978ac48
- [ ] [LOW] [anon] Survivor S4 titled "Micronesia" in the Editor's Canon view but "Micronesia: Fans vs. Favorites" in the community ranking table — use one canonical season display name for both (URL: /shows/survivor?view=community, source: debug 2026-05-16) — 978ac48
- [ ] [LOW] [anon] /shows/survivor/season/47 silently resolves to /shows/survivor/season/survivor-47 — two URL forms reachable; confirm a 301 + matching rel=canonical and keep e2e canonical-urls in sync (URL: /shows/survivor/season/47, source: debug 2026-05-16) — 978ac48

## Done

_(empty)_

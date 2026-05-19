# CRITIQUE

> Last pass: 2026-05-19 at commit b57b536
> Pass count: 1
> Gated: NO — shipping-mode gate lifted 2026-05-17 via oversight
> (Phase 36 shipped). `/march` Step 2's normal rate-limited
> cadence is active. Pass 1 ran local via the reader sub-agent
> (anon walk completed; authed walk blocked — see the
> `[needs-user-call]` row in Pending: the `reader` toolset has
> no cookie-injection primitive, distinct from the
> human-operated Chrome MCP harness verified 2026-05-17).
> **Local-only**: the cloud runner has no Chrome MCP.

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

### [HIGH] / (site-wide) — anonymous visitors are served signed-in chrome (`@me` / Sign out)
- pass: 1 (commit b57b536)
- viewport: desktop (reproduces on every page walked)
- category: infra
- auth_state: anon
- observation: A request with **no cookie attached** is served signed-in chrome on `/`, `/shows/survivor`, and the season page: header renders a profile link `@me` (href `/u/me`) plus a `Sign out` link (`/auth/logout`). The handle is the literal placeholder `@me`/`/u/me`, not a real user — i.e. the phase-36 auth-state island's **static/SSR default is the signed-in shape** instead of the safe signed-out default, so anonymous and no-JS visitors see a false identity site-wide and never see a "Sign in" affordance. Downstream consequence (do not score separately): the season page therefore suppresses the anonymous "sign in to comment" prompt and the un-acted vote-pair gate — a stranger is invited to act with no indication an account exists.
- evidence: `read_page` on `/` with no cookie: link "@me" href=`/u/me`; link "Sign out" href=`/auth/logout?returnTo=https%3A%2F%2Ftiered.tv%2F`. Identical on `/shows/survivor` and `/shows/survivor/season/heroes-villains`. `/api/auth/me` with no cookie → `signedIn:false` (server agrees the request is anon — only the rendered chrome disagrees).
- suggested fix: Make the auth-state island's static/SSR default the **signed-out** state ("Sign in"); only swap to `@handle`/Sign out after `/api/auth/me` hydration confirms a session. Never emit a literal `@me`/`/u/me` placeholder.
- source: browser

### [MED] /themes, /themes/[theme] — "cross-canon" copy overpromises against an all-Survivor catalog
- pass: 1 (commit b57b536)
- viewport: desktop
- category: comprehension
- auth_state: anon
- observation: The Lists hero says lists are "Cross-canon" and "Some span every show," but the stat strip reads "1 SHOWS COVERED" and every list is tagged SURVIVOR. `/themes/best-premieres` reinforces it: entries labelled "CROSS-CANON LIST" contain only Survivor seasons ("SPANS 1 show"). A first-time reader sees the contradiction immediately — the voice promises breadth the catalog does not yet have.
- evidence: `/themes`: "Themed lists. Cross-canon. … Some span every show." beside stat "1 SHOWS COVERED". `/themes/best-premieres`: "SPANS 1 show"; related items tagged "CROSS-CANON LIST", all rows SURVIVOR.
- suggested fix: Until multi-show lists exist, derive the hero/tag copy from actual show-coverage — single-show-honest language; drop the "CROSS-CANON" tag where a list covers one show.
- source: browser

### [MED] /themes/best-premieres vs /shows/survivor — Survivor 41 named "New Era I" in canon, "S41 · REBOOT" on the list
- pass: 1 (commit b57b536)
- viewport: desktop
- category: comprehension
- auth_state: anon
- observation: The same season carries different names across pages a reader crosses: Survivor 41 is "New Era I" in the Survivor canon list and on home references, but "S41 · REBOOT" on `/themes/best-premieres`. Distinct from the already-addressed S16 mismatch (different season, different surface) — indicates list-entry titles are authored free-hand rather than sourced from the canonical season display name.
- evidence: `/shows/survivor` canon row "10 · S41 · New Era I"; `/themes/best-premieres` entry #02 "S41 · REBOOT — The reset announces itself…".
- suggested fix: Source themed-list entry display names from the one canonical season title field so list rows and canon rows agree (same root cause class as the S16 fix; consider extending that content-check invariant to list entries).
- source: browser

### [MED] /shows/survivor/season/survivor-20 — plausible `<show>-<n>` season form 404s while the digit form 308-redirects
- pass: 1 (commit b57b536)
- viewport: desktop
- category: navigation
- auth_state: anon
- observation: The digit season form (`/season/20`) 308-redirects to the canonical slug, but the equally-plausible show-prefixed numeric form (`/season/survivor-20`) hard-404s instead of redirecting to `/season/heroes-villains`. The contracted redirect only covers the bare-digit form; a reader or external link constructing the show-slug-number form dead-ends. Lower-confidence than HIGH: the site only formally contracts digit→slug, so this is a robustness gap, not a broken promise.
- evidence: GET `/shows/survivor/season/survivor-20` → "404: This page could not be found." (no redirect). Canonical working URL: `/shows/survivor/season/heroes-villains`.
- suggested fix: Extend the season redirect resolver to also 308 the `<show>-<n>` / `<slug>-<n>` numeric forms to the canonical season slug, matching the existing digit-redirect contract; add the form to `redirects.spec.ts`.
- source: browser

### [LOW] /themes — document title says "Themes", every user-facing surface says "Lists"
- pass: 1 (commit b57b536)
- viewport: desktop
- category: navigation
- auth_state: anon
- observation: Route is `/themes` and `<title>` is "Themes — tiered.tv", but the nav link, breadcrumb ("TIERED.TV / LISTS"), section heading, and list-detail crumb all say "Lists". A reader scanning the browser tab or sharing the link sees a word the product UI never uses. Route can stay; the visible/title vocabulary should be consistent.
- evidence: Tab title "Themes — tiered.tv" at `/themes`; on-page nav link "Lists", breadcrumb "TIERED.TV / LISTS", heading "Themed lists."
- suggested fix: Set the document `<title>` (and any remaining "Themes" labels) to "Lists" to match product vocabulary; leave the `/themes` route as-is.
- source: browser

### [LOW] / vs /shows/survivor — canon-revised date rendered two different ways
- pass: 1 (commit b57b536)
- viewport: desktop
- category: visual
- auth_state: anon
- observation: The same datum is formatted differently across a common navigation path: home renders "05 / 26 — CANON REVISED" (month/year), the Survivor show page renders "2026 — CANON LAST REVISED" (year only). Minor, but catchable when navigating home → show.
- evidence: `/`: "05 / 26 · CANON REVISED". `/shows/survivor`: "2026 · CANON LAST REVISED".
- suggested fix: Render the canon-revised stat through one shared formatter so granularity and format agree across surfaces.
- source: browser

### [needs-user-call] authed critique pass — `reader` sub-agent has no cookie-injection primitive
- pass: 1 (commit b57b536)
- viewport: desktop
- category: infra
- auth_state: auth-failed
- observation: The authenticated walk could not run. The `reader` sub-agent's toolset has no JS-eval / `document.cookie` set / request-header primitive; `navigate` rejects `javascript:` URLs and `WebFetch` accepts no `Cookie` header, so `CRITIQUE_SESSION_COOKIE` (present and well-formed in `.env`) cannot be attached. This is distinct from the human-operated Chrome MCP harness verified working 2026-05-17 (that uses `document.cookie` injection on a clean profile, which the *reader* agent cannot perform). Not a product defect — a harness/tooling gap. The authed page set (`/`, `/u/e2e` [phase 38 profile], season live state, `/sign-in` redirect) is **unwalked** this pass.
- evidence: `navigate(javascript:document.cookie=…)` → "Invalid URL: javascript:"; `WebFetch /api/auth/me` (no Cookie sendable) → `{ok:true,signedIn:false}`. `CRITIQUE_SESSION_COOKIE` read OK from `.env`.
- suggested fix (user-call): give `/critique`'s authed leg a reader-compatible session path — either add a cookie-injection step the `reader` toolset can execute (CDP `Network.setCookie` / a `javascript_tool` grant in `reader.md`), or run the authed pass via the human-operated Chrome MCP harness rather than the sub-agent. Until then the HIGH anon auth-leak above also blocks an honest authed comparison.
- source: browser

## Done

- [x] [LOW] [anon] /shows/survivor/season/47 silently resolves to /shows/survivor/season/survivor-47 — two URL forms reachable; confirm a 301 + matching rel=canonical and keep e2e canonical-urls in sync (URL: /shows/survivor/season/47, source: debug 2026-05-16) — 978ac48 — issue #67 — RESOLVED this commit: behavior was already correct (the page-level resolver 308s the digit form via `permanentRedirect`, and `buildMetadata` sets `alternates.canonical` on the slug page) but unenforced. Hardened `apps/e2e/tests/redirects.spec.ts`: a non-following request now asserts the intermediate status is exactly **308** (a regression to a temporary 302/307 would otherwise pass the follow-the-chain check) with a `Location` matching the canonical slug path, and the landed slug page is asserted to emit a single `<link rel="canonical">` whose pathname is the slug form. Redirect fixtures already derive from `canonical-urls.ts`, so the two stay in sync by construction. The digit→slug de-dup contract is now CI-enforced across every season URL rather than true-by-inspection.

- [x] [LOW] [anon] Survivor S16 titled "Micronesia" in the Editor's Canon view but "Micronesia: Fans vs. Favorites" in the community ranking table — use one canonical season display name for both (URL: /shows/survivor?view=community, source: debug 2026-05-16) — 978ac48 — issue #66 — RESOLVED this commit: the canon pane renders the `## NN.` heading, the community pane renders the season frontmatter title; `content/shows/survivor/canon.md` heading 16 was `## 16. Micronesia` and dropped the season's subtitle. Aligned it to the authoritative season title (`Micronesia: Fans vs. Favorites`) so both panes name the season identically. Durable guard added: a `content-check` invariant (lax mode) fails when a canon heading is a clean prefix of the season title that drops a separator-led subtitle — editorial headings that *rename* or *add* a disambiguating suffix (e.g. "Brad Womack (first run)") stay legal. Colocated tests cover all three cases.
- [x] [needs-user-call] critique anon pass cannot run clean (persistent tiered.tv login in the Chrome profile). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): does not reproduce. A fresh `tabs_create_mcp` group has no tiered.tv cookies; `https://tiered.tv/` renders "Sign in", `document.cookie` empty, `/api/auth/me` → `signedIn:false`. The anon walk is genuinely logged-out; no incognito profile needed. Stale-profile artifact, not a structural block.
- [x] [needs-user-call] critique authed pass cannot run at all (no cookie-injection path; httpOnly `__session` unattachable). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): the httpOnly reasoning was wrong for a clean profile. With no pre-existing `__session`, `document.cookie="__session="+CRITIQUE_SESSION_COOKIE` is accepted by the server: `/api/auth/me` → `signedIn:true, handle:"e2e"`, chrome shows `@e2e / Sign out` after reload. Verified live. Harness contract recorded in `plan/bearings.md` → Working harness contract.
- [x] [MED] [anon] Canon prose ordinals are off-by-one vs the displayed slot numeral — slot 12 "Marquesas" reads "places it eleventh", slot 14 "The Australian Outback" reads "twelfth", slot 15 "China" reads "thirteenth" (URL: /shows/survivor, source: debug 2026-05-16) — 978ac48 — issue #63 — RESOLVED 7ef5bce: full sweep of `content/shows/survivor/canon.md` — ~30 of 47 entries had a placement ordinal frozen at an older ranking; every one rebased to its slot position (only the ordinal word changed, no voice change, no reorder). Durable guard added: pure `src/lib/canon/placement-ordinal.ts` extractor + a `content-check` invariant (lax mode) so prose-ordinal-vs-slot drift now fails the verify gate permanently. Caught two latent ones in other shows during the sweep; both were extractor false-positives on a two-sentence placement pattern, fixed before commit.
- [x] [MED] [anon] Bachelorette home card says "21 seasons. She holds the roses now." while its own meta line on the same card reads "20 seasons · canon + community" — derive both from one `seasons` field (URL: /, source: debug 2026-05-16) — issue #61 — RESOLVED this commit: `ShowTile` meta now derives from the authoritative `show.seasons` field instead of `getAllSeasons(slug).length` (seeded-file count that lagged the editorial number during content drains). `seasonCount` prop removed so no caller can reintroduce the divergence; regression test added in `ShowTile.test.tsx`.

# PHASE_CANDIDATES

> `/expand` reads accumulated signals (audit findings, critique
> findings, GH issues, spec drift, design landings, data
> growth) and proposes new phase candidates here. `/oversight`
> reviews and promotes them to `plan/steps/01_build_plan.md`.
>
> Posture: **bold** (per `plan/bearings.md`). `/expand` runs
> at standard cadence and files candidates here. `/oversight`
> is the only path to promote.

> Last pass: 2026-05-22 at commit 04427df
> Pass count: 5

## Considered (awaiting promotion)

<!-- Format:
### <NN>. <Phase title>
**Score:** N.N (impact: N, ease: N)
**Source pass:** <expand pass number>
**Filed:** <ISO date>
**Why:** <one-paragraph rationale>
**Scope sketch:** <2-3 lines of what would ship>
-->

### 03. Newsletter subscribe (Buttondown embed)

**Score:** 3.0 (impact: 4, ease: 5, +1 multi, -1 vendor)
**Source pass:** 1
**Filed:** 2026-05-14
**Source signals:**
- `spec.md:281` — same spec phase 18 row that names RSS also
  names "newsletter."
- Seed S4 — same seed names Buttondown form embed.

**Why:** Split from candidate 01 because newsletter introduces
a vendor dependency (Buttondown account + DNS records once a
domain swap lands) that RSS doesn't share. Lower priority than
RSS because RSS already serves the "return-reader" need; the
newsletter is incremental on top. File so it isn't lost — but
defer until S1 (domain swap) lands, since `noreply@tiered.app`
or similar makes the sign-up trust signal real.

**Scope sketch:**
- `/newsletter` minimal page: Buttondown embed form, brief
  promise copy, no SDK.
- Footer link surfaces it once.
- No auth integration; subscribers list lives in Buttondown.
- e2e: page renders + form has the expected `<form action>`
  pointing at buttondown.

**Estimated phases:** 1.
**Conflicts:** depends on S1 (custom domain) for a credible
sender identity; can ship before but trust signal will be weak.

### 09. Editorial-copy honesty sweep + derived-count invariant — PROMOTED as Phase 43 (oversight 2026-05-23)

**Score:** 5.4 (impact: 6, ease: 4, +2 multi, +1 cheap-and-impactful)
**Source pass:** 5
**Filed:** 2026-05-22
**Promoted in:** oversight 2026-05-23 (build plan re-exhausted; second-strongest pending candidate; promoted alongside #10 so the coverage gate lands before this sweep adds copy/test surface).
**Build-plan row:** Phase 43 — Editorial-copy honesty sweep + derived-count invariant (`01_build_plan.md`).
**Source signals:**
- `plan/CRITIQUE.md` pass-2/3 cluster — **4 Pending findings of
  one class** across **4 distinct URLs**: editorial copy carries
  a hardcoded count/claim that drifts from the data the page
  actually renders.
  - [MED] `/` — "13 shows tracked" but only 9 tiles surface (3
    featured + a "+ 6 more in the index" sub-row).
  - [LOW] `/shows` — hero lede names a B tier ("The B tier we're
    still working through") but no show sits in B, so the page
    renders no B-tier section — the sentence has no referent.
  - [LOW] `/themes` — "All lists" group headers read "BY TONE ·
    7" + "BY CRAFT · 4" = 11, which doesn't reconcile to the
    "12 LISTS" stat.
  - [LOW] `/themes/best-finales` — description ends "six shows,
    six landings" but the card shows "7 ENTRIES"; the finding
    itself asks to "audit sibling lists for the same drift."
- Commit pattern (signal G) — the loop has been hand-patching
  this exact class one surface at a time: `b9944bb` "derive
  /themes hero + adjacent tags from real show-coverage",
  `82b7b13` "unify canon-revised stat format across home + show
  page", `4acd1ad` "align themed-list season_label with
  canonical season titles".
- Prior art — Phase 41 already proved the pattern for one
  surface: the `/themes` stat strip's "N SHOWS COVERED" now
  derives from `getShowsForTheme()`, pinned by the
  `CROSS_SHOW_STRICT` content-check invariant.

**Why:** This is a class, not 4 fixes. Drained one finding per
tick, `/iterate` patches each instance's copy — but the class
re-opens the next time hand-authored copy with a literal count
lands, because no invariant forces "counts derive from data."
The honest fix is the phase-41 move applied catalog-wide: sweep
every count/claim in editorial copy, derive it from a content
loader where one exists, drop the literal where it doesn't, and
add a content-check / unit invariant so a future drift fails the
verify gate instead of waiting for the next critique pass. The
home show-count finding additionally carries a real UX question
(4 of 13 shows unreachable from home) that a pure copy edit
would paper over.

**Scope sketch:**
- Sweep editorial-copy counts/claims across home, `/shows`,
  `/themes`, `/themes/[theme]`, show pages, season pages. Per
  instance: derive from the loader, or drop the hardcoded
  number.
- Where a number must stay literal for editorial voice, pin it
  with a content-check invariant or unit test against the real
  catalog count so drift is a hard failure.
- Reconcile the home show-count copy specifically — surface all
  shows from home or reword (UX reachability, not just prose).
- No URL change; UI work bounded to copy + count-derivation
  wiring.

**Estimated phases:** 1 (likely multi-tick per-surface, like
phase 41's drain).
**Conflicts:** none. Reinforces phase 41's precedent and the
brand's honest, no-spoilers voice.

### 10. Colocated-test coverage gate (shift §5a left into verify) — PROMOTED as Phase 42 (oversight 2026-05-23)

**Score:** 5.5 (impact: 5, ease: 5, +2 multi, +1 cheap-and-impactful)
**Source pass:** 5
**Filed:** 2026-05-22
**Promoted in:** oversight 2026-05-23 (build plan re-exhausted; strongest pending candidate; closes the §5a reactive-drain pattern — 25 test commits in 3 days, each one-violator-per-tick).
**Build-plan row:** Phase 42 — Colocated-test coverage gate (`01_build_plan.md`).
**Source signals:**
- Commit pattern (signal G) — a **16-commit reactive drain**,
  `#105`–`#120` (`e03938d` … `f3de16f`), each `test: lock <X>
  contract` paired with an `audit: finding […] addressed`. The
  loop spent 16 consecutive ticks hand-colocating tests for
  component/helper files that shipped untested. §5a ("every
  commit ships unit tests AND e2e contributions") is a
  non-negotiable standing rule (`CLAUDE.md`, `agents.md` §5a,
  build-plan guardrails) — but it is enforced **reactively**:
  `/iterate`'s audit finds one violator per tick.
- The `#120` audit row (resolved `f3de16f`) explicitly flagged
  the detection mechanism as fragile: "a testless-file scan
  keyed on filename treats `Header.tsx` as covered when it is
  not" — the test file's `describe()` targeted `HeaderView`,
  not `Header`. The current informal detection false-negatives.
- Prior art — `pnpm check:no-raw-img` (phase 18,
  `scripts/check-no-raw-img`) is the exact shape: a
  discipline-gate script wired into `pnpm verify`.

**Why:** §5a is load-bearing but enforced after the fact; a
16-commit drain is the measured cost of having no gate. A
proactive gate shifts enforcement left — verify fails the moment
an untested component/helper lands, instead of `/iterate`
catching it ticks later and burning a polish tick per file. The
gate must beat the filename-keyed false-negative class the #120
row exposed: it should confirm the colocated test actually
imports/exercises the target module, not merely that a
same-named file exists.

**Scope sketch:**
- `scripts/check-test-colocation.ts` (or `.mjs`) — walks
  `src/components/**`, `src/lib/**`, `src/content/**` for
  `.ts`/`.tsx` modules lacking a colocated
  `__tests__/<name>.test.{ts,tsx}`; verifies the test file
  references the target module (not filename-only). Allowlist
  for genuine no-logic files (type-only modules; barrels
  already covered by barrel tests).
- Wire into `pnpm verify` alongside `check:no-raw-img`.
- Colocated tests for the script itself (covered file passes,
  testless file fails, filename-match-but-wrong-target fails).
- Fix any stragglers the script newly catches (the recent
  drain cleared most; expect few).

**Estimated phases:** 1.
**Conflicts:** none. Hardens an existing non-negotiable standing
rule; no URL change, no schema change.

## Considered (below threshold)

### B1. `content/calendar.yml` + post-finale event triggers — ABSORBED by candidate #06 (pass 3)

**Score:** 2.0 (impact: 5, ease: 4, -2 expensive/uncertain)
**Source signals:** `spec.md:294` promises "Event triggers (a
finale air date in `content/calendar.yml`) prompt `/iterate` to
write a 'post-finale ranking shift' piece spoiler-free."
Calendar doesn't exist; no `/iterate` hook.
**Why deferred (pass 1–2):** The auto-write piece was
hand-wavy (what does "write a post-finale ranking shift piece"
mean in skill terms?). Pass-2 re-eval noted the build plan was
fully exhausted and this is the single remaining unbuilt
self-sustaining mechanism, but kept it below threshold because
the scope was undefined in skill terms, not because the signal
was thin.
**Pass-3 resolution:** Absorbed and superseded by **candidate
#06** (above, score 5.5). Pass 3 lifts it above threshold by
scoping out the undefined editorial half (the "shift piece"
semantics + canon auto-bump → flagged `[needs-user-call]` for
`/oversight`) and filing only the bounded mechanical half
(schema + loader + an AUDIT-row-writing gate that reuses the
existing `/iterate` drain). B1 stays here for the audit trail;
do not re-score it independently — track #06.

## Promoted

<!-- Same format with **Promoted in:** <oversight commit hash>
     and **Build-plan row:** <link to row in 01_build_plan.md> -->

### 08. Cross-canon themed-list drain (deliver the "cross-canon" promise)

**Score:** 5.4 (impact: 6, ease: 4, +2 multi, +1 cheap-and-impactful)
**Source pass:** 4
**Filed:** 2026-05-19
**Source signals:**
- `plan/CRITIQUE.md` pass-1 row [MED] "/themes, /themes/[theme]
  — 'cross-canon' copy overpromises against an all-Survivor
  catalog" (commit b57b536). The lists hero claims "Cross-canon.
  Some span every show" beside a stat strip reading "1 SHOWS
  COVERED"; every `/themes/[theme]` page is tagged
  `CROSS-CANON LIST` while every row inside is Survivor. A
  first-time reader sees the contradiction immediately.
- Catalog measurement (this pass): all **12 of 12** themed
  lists carry entries from exactly **1 distinct show**
  (Survivor). Total entries across the catalog: 46; cross-show
  entries: 0.
- CRITIQUE pass-1 row [MED] "Survivor 41 named 'New Era I' in
  canon, 'S41 · REBOOT' on the list" — same UX surface, same
  root cluster (list-entry titles are authored free-hand
  rather than sourced from canonical show data). Fixing the
  cross-canon promise without also disciplining entry titles
  reintroduces the cross-page-naming mismatch class at scale.
- `plan/bearings.md` Rule 3 ("themed list quota") locks
  `count >= 10` but never requires cross-show coverage. The
  quota was cleared at 12 lists during phases 23+24, and the
  natural shape of that drain (most-canon'd show first) made
  every list mono-show. The rule never noticed because the
  invariant was never written.
- Brand promise on `spec.md`/home/lists hero relies on the
  catalog being demonstrably cross-show. The data does not
  currently support the promise.

**Why:** Same structural argument that promoted #04 → Phase 38,
#06 → Phase 39, #07 → Phase 40: a contracted/branded promise
the loop cannot pick up on its own because no `/ship-content`
quota row demands it. The lists hero copy makes a load-bearing
cross-canon claim; the catalog wholly contradicts it; CRITIQUE
flagged it as a comprehension-class finding (MED, not LOW). The
minimal fix is to soften the copy ("single-show lists"), but
that retreats from the spec rather than delivering it. The
honest fix is to **make the promise true**: add genuine
cross-show entries to existing lists, write the invariant that
keeps future lists honest, and reinforce list-entry title
discipline so the second CRITIQUE finding's whole class
(free-hand title drift) doesn't survive the drain. Modeled on
the phase-26/31b/34 multi-tick drain (one list per tick; final
tick flips the lax invariant strict).

**Scope sketch:**
- `bearings.md` Rule 3 sub-rule: every themed list with
  `category in {tone, craft, era}` carries entries from **≥3
  distinct shows**; `category: single` is the carve-out for
  deliberately mono-show lists (`survivor-pillars` re-tags).
- `scripts/content-check.ts` learns the invariant in lax mode;
  the final tick flips it strict (31b/34 pattern).
- `content-curator` + `ship-content` Rule 3 updated: new lists
  born cross-show; existing `{tone,craft,era}` lists get a
  content-tick authoring 3–5 cross-show entries with canonical
  `title`/`season_label` (extends canon-heading discipline to
  themed-list entry titles — closes the second CRITIQUE row).
- `/themes` + `/themes/[theme]` stat strip + `CROSS-CANON LIST`
  tag derive honestly from `getShowsForTheme()`; tag drops on
  `category: single`. No hero copy change — the data backs it.

**Estimated phases:** 1 (multi-tick drain, like phase 34/31b).
**Conflicts:** none. Aligns with `spec.md` brand promise; no
URL change; UI work bounded to the stat-strip + tag wiring.

**Promoted in:** oversight 2026-05-21 (build plan re-exhausted
after ~24h of §5a test-colocation iterate-polish; strongest
pending candidate; user-approved).
**Build-plan row:** Phase 41 — Cross-canon themed-list drain
(`01_build_plan.md`). Brief: `plan/phases/phase_41_cross_canon_lists.md`.

### 07. Cloud-runnable `/critique` via a Playwright reader path

**Score:** 5.5 (impact: 7, ease: 5, +2 multi — unblocks every future cloud critique pass + eliminates the shared-profile false-finding class)
**Source pass:** filed + promoted same act (oversight 2026-05-19)
**Filed:** 2026-05-19
**Source signals:**
- Critique pass 1 (2026-05-19) produced a false HIGH because
  the `reader` sub-agent drives the operator's shared local
  Chrome profile. Even with the cookie-primitive fix applied
  this oversight, `/critique` remains **local-only**.
- `march.yml:174` hard-skips `/critique` ("reader sub-agent
  depends on a Chrome MCP not available on the runner") while
  `march.yml:63-72` already installs + caches headless
  chromium for e2e — the browser is present; only the harness
  path is missing.
- Structural-gap argument (same as Phase 38 / Phase 39): the
  external-observer leg of the self-sustaining loop never runs
  autonomously, and no existing phase owns fixing that.
- User raised it directly twice 2026-05-19: "critique should
  not be local only: it can and should run in actions."

**Why:** A Playwright-driven reader path is *more* deterministic
than the local Chrome MCP — a fresh isolated context has no
operator profile to inherit, so the entire contamination class
that produced the pass-1 false finding cannot occur in CI.
Playwright + chromium are already in the repo and cached in the
cloud workflow, so the lift is the walk script + harness wiring,
not new infrastructure.

**Scope sketch:** `scripts/critique-walk.mjs` (Playwright,
fresh isolated context, `context.addCookies()` for authed /
none for anon, emits the existing `reader` JSON shape incl.
console + network + 375/1280 reflow); `reader.md` "Path A2 —
Playwright (CI)"; `critique.md` selects Path A2 on cloud
invocation; `march.yml:174` flipped from skip to dispatch under
the existing rate-limit + green-deploy gate; colocated tests.

**Estimated phases:** 1.
**Conflicts:** none. Critique never mutates (P0 unchanged).
Local Chrome MCP path stays as an operator-driven supplement.

**Promoted in:** oversight 2026-05-19 — user ruled it **ahead of Phase 39** (priority inversion; row placed above Phase 39 in the Status block).
**Build-plan row:** Phase 40 — Cloud-runnable `/critique` via a Playwright reader path (`01_build_plan.md`, ships before Phase 39).

### 06. `content/calendar.yml` + finale-event detection hook (mechanical + autonomous editorial half of spec.md:294)

**Score:** 5.5 (impact: 6, ease: 5, +2 multi, +2 cheap-and-bounded, -1.5 needs-user-call boundary — boundary now resolved)
**Source pass:** 3
**Filed:** 2026-05-18
**Source signals:**
- `spec.md:294` — "Event triggers (a finale air date in
  `content/calendar.yml`) prompt `/iterate` to write a
  'post-finale ranking shift' piece spoiler-free, ship it, and
  bump that show's canon position if warranted." `content/calendar.yml`
  did not exist; no loader, no gate, no hook. The only
  spec-promised self-sustaining mechanism never built.
- `PHASE_CANDIDATES.md` B1 — filed pass 1, re-evaluated pass 2;
  held below threshold both times because the auto-write
  contract was undefined in skill terms, not because the signal
  was thin. Absorbed here.
- Build-plan re-exhaustion at 205862b (Phase 38 + a 44-commit
  §5a test-colocation drain; AUDIT/critique/issues all empty).
  No remaining phase owned this; the loop would iterate-polish
  forever and never build the event-trigger leg.

**Why:** Same structural argument that promoted #04 → Phase 38:
a contracted self-sustaining mechanism the loop will never pick
up unless a phase is proposed. The candidate originally scoped
the fuzzy editorial half out as `[needs-user-call]`; oversight
2026-05-19 **resolved that boundary** rather than deferring it.

**Editorial contract (resolved at promotion — oversight
2026-05-19, user-chosen):** **full autonomy.** When the gate
files the `content-gaps` AUDIT row, the content drain that
picks it up **may autonomously write the spoiler-safe
post-finale ranking-shift note AND adjust that season's
`canonical_position`** if the editorial rationale warrants it.
Spoiler discipline is P0 — the note frames the *ranking shift*,
never the winner/elimination/outcome; any `canonical_position`
cascade follows the always-working + content-check invariants.

**Scope sketch (as promoted):**
- `content/calendar.yml` — `{ show, season, finale_date (ISO),
  status }`; seed publicly-dated finales only.
- `src/content/calendar.ts` loader + Zod schema + colocated
  `__tests__/calendar.test.ts` (parse, malformed-row reject,
  past/future partition).
- Idempotent gate (in `/march` or `/iterate` Step 0): finales
  with `finale_date < today` lacking a shift note → one
  `category: content-gaps, source: self` AUDIT row; never
  double-files for the same season.
- `content-check` learns the calendar shape. No new URL, no UI,
  no e2e route addition.

**Estimated phases:** 1. Absorbs and supersedes B1.
**Conflicts:** none. Fulfils `spec.md:294` end-to-end (both
halves) with no contract change; spoiler-safety is a build
constraint, not a conflict.

**Promoted in:** oversight 2026-05-19 (build plan re-exhausted; only candidate above threshold; editorial `[needs-user-call]` resolved to full autonomy by user at promotion).
**Build-plan row:** Phase 39 — `content/calendar.yml` + finale-event detection hook (`01_build_plan.md`)

### 04. `/u/[handle]` real public profile (drain the phase-10 shell)

**Score:** 5.5 (impact: 6, ease: 5, +2 multi, +1 cheap-and-bounded)
**Source pass:** 2
**Filed:** 2026-05-17
**Source signals:**
- `spec.md:73` — the locked URL contract lists
  `/u/[handle]` as "public user profile". It is still the
  phase-10 *shell*: `src/app/(default)/u/[handle]/page.tsx`
  renders only the signed-in viewer's own handle, 404s every
  other handle, surfaces zero activity, and is `noIndex:true`.
- The page's own in-code TODO (line 38-40) blocks itself on
  "phase 12 lights up real users table writes" — phases 11
  (`users`+`votes`), 12 (`comments`), 35 (vote read path), and
  36 (comment read path) have all shipped. The stated unblock
  condition is satisfied; nothing consumes it.
- Build-plan exhaustion: every phase row in
  `01_build_plan.md` is `[x]`. No remaining phase owns turning
  the contracted profile surface real — so it will stay a
  shell forever unless a phase is proposed.

**Why:** This is textbook spec drift — a contracted URL family
that has been a stub since phase 10 while the entire data
substrate it needs (users, votes, comments + their read paths)
was built underneath it by later phases. Now that the plan is
exhausted, no automatic mechanism will ever pick this up; the
loop will iterate-polish pages that exist and never build the
one the spec promised. Scope is genuinely bounded: read the
user's public votes/comments for a handle, render a
spoiler-safe activity surface, drop `noIndex`, resolve real
handles instead of 404. Spoiler discipline (P0) applies — the
profile must never echo a held/hidden comment or leak an
unpublished season position.

**Scope sketch:**
- Resolve `handle` → `users` row (handle/nickname/sub); 404
  only on genuinely-unknown handles, not "not me".
- Read that user's *published* comments + their public vote
  participation counts (never pending/hidden; never raw ballot
  detail that could spoil).
- Activity surface: counts + recent published-comment
  excerpts + shows/seasons they've engaged, all spoiler-safe.
- Drop `noIndex` for populated profiles; keep `noIndex` for
  empty ones.
- e2e: new `apps/e2e/tests/user-profile.spec.ts` — known
  handle renders activity, unknown 404s, mobile reflow at
  375px; row added to `canonical-urls.ts` + `page-reads.ts`.

**Estimated phases:** 1.
**Conflicts:** none. Fulfils `spec.md:73`; no contract change.
Spoiler-safety is a build constraint, not a conflict.

**Promoted in:** oversight 2026-05-17 (build plan exhausted; strongest pending candidate, user-approved).
**Build-plan row:** Phase 38 — `/u/[handle]` real public profile (`01_build_plan.md`)

### 01. RSS feeds (`/feed.xml` + `/feed/<show>.xml`)

**Score:** 5.5 (impact: 5, ease: 5, +2 multi, +1 cheap)
**Source pass:** 1
**Filed:** 2026-05-14
**Source signals:**
- `spec.md:281` — spec lists "RSS + newsletter" as phase 18, but
  the build plan's phase 18 became "Performance + a11y polish"
  (spec phase 17). RSS never landed; spec/plan drift.
- Seed S4 — user-emptied seed for "Newsletter + RSS" with
  trigger "when content velocity exceeds ~15 published canons +
  5 themes." Current state: 13 shows, 12 themes, 8+ canons —
  trigger is reached.
- bearings Rules 1 + 3 quotas both cleared (phases 22 + 24
  shipped 13 shows + 12 themes); regular readers now have
  enough to subscribe to.

**Why:** RSS is the lowest-friction return-reader channel and
the only spec-promised feature still missing from the build
plan. It's also a SEO signal — feed-discovery surfaces on
aggregators that don't index regular HTML. The catalog is large
enough that "new canon, new list, new season blurb" updates
benefit from a stream. Scope is genuinely small (handwritten
XML route; no SDK; no auth) and orthogonal to other surfaces.

**Scope sketch:**
- `app/feed.xml/route.ts` — global RSS 2.0: latest items across
  shows / themed lists / canon revisions, sorted by file mtime
  or a `published` frontmatter field.
- `app/feed/[show]/route.ts` — per-show feed: that show's
  seasons + canon updates only.
- Add feed discovery `<link rel="alternate" type="application/rss+xml">`
  to relevant page heads.
- Sitemap entries for both feed routes.
- e2e: fetch `/feed.xml`, assert content-type + RSS 2.0 root +
  `<channel><item>` shape + `<link>` matches canonical URL.

**Estimated phases:** 1.
**Conflicts:** none. Spec-aligned; design has no opinion on
feeds (no UI impact beyond the discovery `<link>`).
**Promoted in:** oversight 2026-05-14 (queued behind phase 26 per user direction)
**Build-plan row:** Phase 32 — RSS feeds (`01_build_plan.md`)

### 02. Inline search takeover (replace `/search` route page)

**Score:** 4.0 (impact: 6, ease: 5, +1 multi, -1 scope risk)
**Source pass:** 1
**Filed:** 2026-05-14
**Status:** shipped before promotion — phase 29 (commit c4ed547,
"feat: inline search overlay; retire /search — phase 29") landed
the cmd+K overlay with filter chips + keyboard nav, retired the
`/search` route as a 308, and reuses the phase 15 local index
exactly as the candidate sketched. Recording here for audit
trail; no new build-plan row needed.

**Source signals:**
- Seed S7 — user direction 2026-05-13 ("Search needs to be
  inline (or takeover) — not a new page"). Detailed scope
  sketch already filed.
- Design landing — phase 19b shipped the new chrome with a
  `⌕ Search` icon in the header; the icon currently links to
  the standalone `/search` route, which contradicts the user's
  brief.
- bearings "Content velocity & editorial cadence" — content
  catalog now warrants frictionless cross-show search; route
  navigation breaks the browsing flow.

**Scope sketch (as filed; matches what shipped):**
- New `<SearchTakeover>` in `src/components/chrome/`: panel
  slides down under `<TopNav>`, ARIA combobox, `<input
  type="search">` + grouped results.
- Header `⌕ Search` becomes a button toggling the takeover (no
  navigation).
- Per-keystroke local search; `<mark>` highlights in result
  titles + first blurb line.
- Keyboard: ↑/↓ navigate, Enter activate, Esc close; click
  outside closes.
- `/search?q=…` deep-link opens takeover pre-populated;
  `app/search/page.tsx` becomes the no-JS fallback.
- e2e: open via icon, type → results, keyboard nav, deep-link.

**Promoted in:** oversight 2026-05-14 (retroactive — phase 29 already shipped the scope)
**Build-plan row:** Phase 29 — Inline search overlay; retire `/search` (`01_build_plan.md` line 101)

### S7. Inline / takeover search (seed) — superseded by candidate #02

**Status:** shipped via phase 29 (commit c4ed547). Seed and
candidate #02 describe the same scope; both moved here together
so the audit trail is complete. The seed's accessibility
contract (ARIA combobox, `aria-live="polite"`, Esc/click-out
close, ↑/↓ navigation) matches what phase 29 e2e covers.

**Promoted in:** oversight 2026-05-14 (retroactive)
**Build-plan row:** Phase 29 — Inline search overlay; retire `/search` (`01_build_plan.md` line 101)

## Rejected

<!-- Same format with **Rejected at:** <oversight commit hash>
     and **Reason:** <why> -->

### 05. Critique-harness repair (anon clean-profile + authed cookie-injection)

**Score:** 3.0 — not promoted; **resolved instead.**
**Filed:** 2026-05-17  **Resolved:** 2026-05-17 (oversight)

**Reason:** Reviewed live during the 2026-05-17 oversight pass at user request. Neither blocker reproduces: a fresh Chrome MCP tab group is genuinely logged-out (anon pass clean), and on that clean profile `document.cookie`-injecting `CRITIQUE_SESSION_COOKIE` as `__session` is accepted by the server (`/api/auth/me` → `signedIn:true`; chrome shows `@e2e / Sign out`). No code or environment change was needed — the 2026-05-16 `httpOnly` reasoning was wrong for a clean profile. Working harness contract recorded in `plan/bearings.md` → "Critique cadence" and the two `CRITIQUE.md` rows moved to Done. Nothing to ship; closing rather than promoting.

**Rejected at:** oversight 2026-05-17.


---

## Seed candidates (pre-loaded for /expand to evaluate)

These aren't promoted; they're seeds the user pre-emptied so
`/expand` doesn't have to discover them. `/expand` may score,
score-and-defer, or merge with newly-discovered candidates.

### S1. Custom domain swap (`tiered.app` → primary)

**Trigger:** when `tiered.app` is purchased + DNS configured.
**Scope sketch:** add domain in Vercel, update Auth0 Allowed
URLs, swap `AUTH0_BASE_URL`, swap `EMAIL_FROM_ADDRESS` to
`noreply@tiered.app`, run `setup/05_email.md` v2 swap,
update all hardcoded `tiered.tv` refs in
content + canonicalUrl helpers.

### S2. Resend email provider migration

**Trigger:** depends on S1 (needs domain DNS).
**Scope sketch:** runbook in `setup/05_email.md` v2 path —
account, domain verify, API key, Auth0 SMTP wiring, bounce
webhook, swap from Auth0 dev SMTP. Bumps `setup/00_files.md`
05 status to ✅.

### S3. Cron-enable cloud /march

**Trigger:** after user vets the manual cloud workflow_dispatch
runs cleanly for ~1 week.
**Scope sketch:** add `schedule: - cron: '0 * * * *'` (or
similar cadence) to `.github/workflows/march.yml`. Bound by
the daily commit ceiling check and concurrency group already
in place.

### S4. Newsletter + RSS

**Trigger:** when content velocity exceeds ~15 published
canons + 5 themes (organic discovery via search starts to
matter).
**Scope sketch:** Buttondown form embed at `/newsletter` (no
SDK required); handwritten RSS 2.0 with global feed at
`/feed.xml` and per-show feeds at `/feed/<show>.xml`; sitemap
entries; e2e validates RSS 2.0 shape.

### S5. SVG → PNG OG generator — OBSOLETE (do not promote)

**Status (pass-2):** superseded on two counts. (1) Phase 17
(c5a8fbc) already shipped per-route `opengraph-image.tsx` +
OG PNG rendering via `scripts/build-icons.mjs`. (2) The May
2026 design pivot deleted the per-show facade system entirely
(phase 19a, `design/CLAUDE.md` Hard Rule 1) — S5's premise
("deriving from the show's facade") references art that no
longer exists and must never be regenerated. Kept for the
audit trail; `/expand` will not re-propose it.

### S6. Vercel Analytics dashboard review cadence

**Trigger:** ~30 days after launch (whenever real user traffic
starts).
**Scope sketch:** weekly `/oversight` checkpoint reads Vercel
Analytics dashboard; surfaces top-N pages, drop-off points,
404s; files audit rows for any URL with >5% bounce. Lightweight
human-in-loop ritual.

_(S7 promoted retroactively — see ## Promoted above. Phase 29 (c4ed547) shipped the scope.)_

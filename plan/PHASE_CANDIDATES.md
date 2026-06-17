# PHASE_CANDIDATES

> `/expand` reads accumulated signals (audit findings, critique
> findings, GH issues, spec drift, design landings, data
> growth) and proposes new phase candidates here. `/oversight`
> reviews and promotes them to `plan/steps/01_build_plan.md`.
>
> Posture: **bold** (per `plan/bearings.md`). `/expand` runs
> at standard cadence and files candidates here. `/oversight`
> is the only path to promote.

> Last pass: 2026-06-17 at commit 0117ac6
> Pass count: 35

## Considered (awaiting promotion)

<!-- Format:
### <NN>. <Phase title>
**Score:** N.N (impact: N, ease: N)
**Source pass:** <expand pass number>
**Filed:** <ISO date>
**Why:** <one-paragraph rationale>
**Scope sketch:** <2-3 lines of what would ship>
-->

<!-- Pass 35 (2026-06-17, commit 0117ac6) — 2 candidates filed.
     Window since pass 34 (20b6b78, 2026-06-16): 1 day / 20 commits.
     Signals reviewed:
     - AUDIT.md: 1 pending bug row (Supabase CLI pin #416, score 4.8,
       category: bug — workflow-permission-blocked for cloud, /iterate handles
       when local; not a phase shape). AUDIT show-queue EMPTY (all 9 oversight
       2026-06-14 franchise rows [x]) → bearings Rule 1 always-on mandate
       fired: new Wave 3 show rows + season-drain rows filed in AUDIT.md
       this same commit (Alone S6–S12, Below Deck S6–S12, Below Deck Med
       S6–S9; new shows: RHONY, DWTS, Love Is Blind, Hell's Kitchen,
       Australian Survivor).
     - CRITIQUE.md: 4 pending MED rows (HvV Section 03 stub pass-49;
       /u/e2e stat chips pass-37 [needs-user-call]; revised-date drift
       pass-48; header handle no affordance pass-48). Two rise to phase
       shape (#18, #19 below). Section 03 stub below threshold (expensive
       multi-tick drain, single MED signal, -2 penalty). /u/e2e stat chips
       flagged [needs-user-call] (prior pass-28 closure conflicts); candidate
       #16 already covers this surface; skipped.
     - GitHub issues: 1 loop-queued (#416, same as AUDIT bug row).
     - spec.md + design/: no changes (stable since before pass 34).
     - Commit pattern: 20 commits — 8 critique-drain audit closures
       (fix/content/seo), 2 critique passes (54/55), 1 expand pass (34).
       Drain pattern; no 5+ fix-cluster on any single surface.
     Candidate #17 (card_tagline completeness invariant): already resolved
     this window — `seo: add card_tagline to 12 shows — CARD_TAGLINE_STRICT
     invariant` shipped in the 11-commit window since pass 34. Candidate #17
     is now moot; marked superseded in the candidate block below.
     Existing candidates status: #14 (era toolbar polish) — still awaiting
     promotion (primary TITHERADGE MED was the driver; KISH/COLBY LOWs remain
     Pending). #15 (canon completeness gate) — still awaiting promotion.
     #16 (/u/[handle] stat chips) — [needs-user-call]; skipped this pass.
     #17 (card_tagline invariant) — superseded (shipped pre-promotion). -->

### 18. Signed-in header handle affordance — profile link + sign-out popover

**Score:** 6.6 (impact: 7, ease: 8 → 5.6 base + 1.0 signal multiplicity)
**Source pass:** 35
**Filed:** 2026-06-17
**Source signals:**
- Critique pass-48 [MED] [authed] — the `@e2e` handle renders as a bare
  text token in the header on every authed page (desktop + mobile); no
  `href`, no caret, no pointer cursor. A returning member has no in-header
  path to `/u/<handle>` and no way to sign out; the handle reads as a
  status label rather than a control.
- Signal multiplicity: complements candidate #16 (/u/[handle] record zone)
  — both findings confirm Phase 36 shipped the auth-read reflection but
  not the auth-affordance layer.

**Why:** Phase 36 (`[x]`) wired the auth-aware chrome (header reads
`/api/auth/me` and renders `@handle` when signed in). What it did not
ship is the affordance: the handle is a bare `<span>`-equivalent with
no link, no popover, no sign-out route. A returning member landing on any
page has to type `/u/<handle>` manually to reach their record, and has no
in-page sign-out. The fix is scoped to a single component (the `<AuthState>`
header island, likely `src/components/chrome/Header.tsx` or
`src/components/chrome/AuthState.tsx` — verify at fix-time): wrap the
handle in `<a href="/u/<handle>">`, add a minimal two-entry dropdown
(`Your record →` + `Sign out →` via `/api/auth/logout`). The popover
anchors a small caret next to the handle so the affordance reads as a
control. No URL contract change; no schema change; no new route (the logout
endpoint and `/u/[handle]` already exist per the locked URL contract).

**Scope sketch:**
- `src/components/chrome/AuthState.tsx` (or equivalent — verify at fix-time):
  wrap rendered handle in `<a href="/u/${handle}">`. Add a popover/dropdown
  anchor (small caret) with two items: `Your record` (`href="/u/${handle}"`)
  and `Sign out` (`href="/api/auth/logout"`). Keep the popover intentionally
  minimal — no settings link (not a shipped route), no avatar/icon.
- Colocated test: authed state renders an anchor with correct `href` + a
  popover trigger with `Sign out` item; anon state renders neither (prevents
  authed chrome leaking to anon, per pass-1 #5 closure class).
- e2e: the authed pass for any captured URL asserts the header handle is
  a link element, not a bare text token.
- Spoiler P0 intact — chrome affordance only; no verdict change.

**Estimated phases:** 1.
**Conflicts:** None. Complementary to #16 (profile record zone). No URL
change, no schema change, no new page family.

### 19. Chrome revised-date source-of-record: `lastRevised(scope)` helper

**Score:** 5.5 (impact: 5, ease: 8 → 4.0 base + 1.5 cheap-and-impactful)
**Source pass:** 35
**Filed:** 2026-06-17
**Source signals:**
- Critique pass-48 [MED] [authed] — three index surfaces disagree on
  "last revision" by a full month: home `/` shows `CANON REVISED · May 2026`,
  `/shows` shows `LAST REVISION · May 2026`, `/themes` shows
  `LISTS REVISED · June 2026`. A returning member scanning the chrome cannot
  tell which surface is canonical-fresh.
- Cross-surface defect class: 3 pages, 2 independently-computed timestamp
  sources, 2-month divergence — confirmed on pass-48 authed walker captures.

**Why:** Each of the three index surfaces computes its own "last revision"
date from a different source: home from the most-recent canon mtime,
`/shows` from the most-recent show-frontmatter mtime, `/themes` from the
most-recent theme-frontmatter mtime. The computations produce a different
month because themes saw a content touch in June while canons/shows were
last touched in May. Neither is wrong for its scope — but the chrome label
on all three says the same fact ("last revised") with different values, so
a returning member cannot tell what "revised" means. The fix is a single
`lastRevised(scope)` helper at `src/lib/content-revisions.ts` (or similar)
that each surface calls with an explicit scope argument (`'canon'` /
`'shows'` / `'themes'`), ensuring each chrome timestamp is honest about
what it's measuring AND computed consistently. The lax→strict verify-gate
pattern then locks it: `collectCrossSurfaceRevisedDateIssues` in
`scripts/content-check.ts` asserts each timestamp matches its
`lastRevised(scope)` value; strict mode flags drift. Same mechanic as
phases 43/44/45/46.

**Scope sketch:**
- `src/lib/content-revisions.ts` (new file) — `lastRevised(scope:
  'canon' | 'shows' | 'themes'): string` — returns max mtime of the
  relevant content files formatted as `Mon YYYY`. Colocated unit test:
  3 cases (one per scope), mtime-stub pattern.
- Wire the helper into the three surfaces: home `CANON REVISED` consumes
  `lastRevised('canon')`; `/shows` `LAST REVISION` consumes
  `lastRevised('shows')`; `/themes` `LISTS REVISED` consumes
  `lastRevised('themes')`.
- `scripts/content-check.ts` — add `collectCrossSurfaceRevisedDateIssues`
  invariant (lax on ship, flip strict once wired and verified green).
- Spoiler P0 intact — chrome timestamp refactor only.

**Estimated phases:** 1.
**Conflicts:** None. No URL change. No schema change.

<!-- Pass 34 (2026-06-16, commit 20b6b78) — 1 candidate filed.
     Window since pass 33 (6bfb784, 2026-06-15): 1 day / 21 commits.
     Signals reviewed:
     - AUDIT.md: 1 pending bug row (Supabase CLI pin #416, score 4.8,
       category: bug — single-item workflow change requiring local
       /oversight push; cloud workflow permission-blocked; not a phase
       shape; /iterate handles when available locally).
     - CRITIQUE.md: 10 pending rows (4 new from pass-54 + 6 carried).
       Pass-54 added: (i) /shows/traitors tier_s_blurb absent (LOW) —
       strengthens existing candidate #15, not a new candidate;
       (ii) /shows/big-brother seasons potentially stale (LOW) — single
       content update, /iterate handles; (iii) /shows/project-runway +
       /shows/big-brother card_tagline missing (LOW) — 3rd instance of
       same gap (below-deck pass-52, PR/BB pass-54), rises to phase
       shape; (iv) HvV mobile TOC aria-hidden (LOW) — single a11y fix,
       /iterate handles. Carried: 6 LOWs from passes 51–53, each single-
       surface, /iterate-shaped (B-tier tier-explainer copy, /themes lede
       copy, top-chef/all-stars typo, KISH ERA label, comeback-seasons
       arrow direction).
     - GitHub issues: 0 unlabeled. #416 (Supabase CLI pin) still
       triage:loop-queued; workflow-permission-blocked for cloud tick.
     - spec.md + design/: no changes (stable 32 days since last diff).
     - Commit pattern: 21 commits — 8 critique-drain audit closures, 3
       critique-pass commits, several fix/seo/content commits. All drain
       pattern; no 5+ fix-class cluster on any single surface.
     Existing candidates status: #14 (era toolbar polish) — primary MED
     driver (TITHERADGE ERA empty state) resolved at 8f0f69e; remaining
     signal is 2 LOWs (KISH ERA, COLBY ERA opacity); still valid but
     reduced urgency. #15 (CANON_COMPLETENESS_STRICT gate) — Traitors
     now shows same tier_s_blurb recurrence as below-deck (pass-54
     LOW); strengthens the candidate, still awaiting promotion. #16
     (/u/[handle] stat chips) — no new signals; still awaiting promotion.
     Below-threshold candidates: (a) a11y polish (HvV TOC aria-hidden,
     1 LOW, /iterate); (b) stale-copy sweep (B-tier tier-explainer +
     /themes lede, both 30+ days pending, both single-surface /iterate). -->

### 17. SEO description gate — card_tagline completeness invariant ~~(superseded — shipped pre-promotion)~~

**Score:** 5.0 (impact: 5, ease: 8 → 4.0 base + 1 signal multiplicity)
**Source pass:** 34
**Filed:** 2026-06-16
**Status:** Superseded. Shipped at `seo: add card_tagline to 12 shows — CARD_TAGLINE_STRICT invariant` (in the 11-commit window since pass 34 filed this candidate). The `CARD_TAGLINE_STRICT` flag is now live in `scripts/content-check.ts` and all violators were drained in the same commit. No promotion needed.
**Source signals:**
- Critique pass-52 [LOW] /shows/below-deck meta description truncates
  mid-clause: tagline is 195 chars, no `card_tagline`; `descriptionFor()`
  slices at 159 chars producing an unfinished thought in SERP.
- Critique pass-54 [LOW] /shows/project-runway + /shows/big-brother
  both lack `card_tagline`; taglines exceed 160 chars; SERP snippets
  truncate mid-clause on both.
- Pattern: 3 distinct shows across 2 critique passes, same structural
  gap (tagline > 160 chars, absent card_tagline).
- The `card_tagline` field is optional per schema; the loader falls back
  to the full tagline, silently producing overlong SERP descriptions.

**Why:** Three shows exhibit the same gap: a `tagline` exceeding the
160-char SERP budget with no `card_tagline` fallback, causing
`descriptionFor()` to slice mid-clause in every case. A visitor
reading the search result sees an incomplete thought. This is the
same lax→strict verify-gate mechanic established by phases 41–46:
add a `collectCardTaglineGapIssues()` invariant in
`scripts/content-check.ts` that warns when `tagline.length > 160`
AND `card_tagline` is absent, drain the three known violators, flip
strict. The invariant prevents any future show addition from landing
with truncated SERP copy. The 3-show cross-pass recurrence (2 critique
passes, 3 distinct shows) confirms this is structural recurrence, not
a one-off authoring mistake. The `card_tagline` field already exists in
the schema and CLAUDE.md spec; making it required-when-long closes the
gap without a schema change.

**Scope sketch:**
- `scripts/content-check.ts` — add `CARD_TAGLINE_STRICT` flag +
  `collectCardTaglineGapIssues()`: iterate show frontmatter; emit issue
  when `tagline.length > 160` AND `card_tagline` is absent. Lax mode
  logs; strict fails. Colocated unit tests (pass / fail / absent cases).
- Author `card_tagline` (≤155 chars, complete clause) for the three
  known violators: `content/shows/below-deck.md`,
  `content/shows/project-runway.md`, `content/shows/big-brother.md`.
- Flip `CARD_TAGLINE_STRICT = true` in the same commit (all violators
  drained before flip; same day-one-strict pattern as phase 44).
- Update `content-curator` brief: `card_tagline` is required when
  `tagline > 160 chars`.

**Estimated phases:** 1.
**Conflicts:** None. No URL change. No UI change. SEO-only impact.
Complements pass-54 pending critique finding which individually patches
one show at a time — this phase patches all three and closes the vector.

<!-- Pass 33 (2026-06-15, commit 6bfb784) — 3 candidates filed.
     Window since pass 32 (14cd563, 2026-06-12): 3 days / 27 commits.
     Signals reviewed:
     - AUDIT.md: 1 pending bug row (Supabase CLI pin #416, score 4.8,
       category: bug — single item, /iterate handles, not a phase shape).
     - CRITIQUE.md: 26 pending rows (up from 14 at pass 32 — 12 net new
       from passes 51+52). Three clusters rose to phase-candidate level:
       (1) era filter tab UX — 3 rows on the same CanonEraToolbar
       mechanism (TITHERADGE ERA zero entries MED, KISH ERA opaque LOW,
       COLBY ERA same-class drop from pass-52 cap); (2) show canon
       completeness — 3 rows clustering around new B-tier shows with
       partial canons (S-tier blurb dup MED, era coverage LOW, home stat
       LOW); (3) user profile record zone — 1 MED standalone finding
       (/u/[handle] stat-chip scaffold absent after phase-38 ship).
       Remaining 20 rows are MED/LOW findings individually addressable
       by /iterate in 1–2 ticks each; none cluster into new phase shapes.
     - Triage: 1 loop-queued issue (#416, Nightly e2e-full gateway
       timeout) — same as AUDIT bug row above; not a phase shape.
     - spec.md + design/: no changes since pass 32.
     - Data growth: 22 shows now (vs 13 at pass 31 / 13 at pass 32) — 9
       shows added in the pass-32→33 window; this growth is what seeded
       the B-tier/new-show completeness signal.
     - Commit pattern: 27 commits — content ticks (10 show additions) +
       2 critique passes + 6 audit drains. No multi-tick fix patterns on
       any single surface.
     Below-threshold candidates noted: (a) Survivor hero breadcrumb
     placement (1 MED, single DOM reorder, /iterate); (b) HvV Section 03
     stub (1 MED, content gap, /ship-content); (c) HvV comment composer
     affordance (1 MED, /iterate); (d) /about 80-120 word promise
     (1 MED, single copy edit extending phase-43 pattern, /iterate). -->

### 14. Era filter tab polish — empty state + contextual label

**Score:** 5.5 (impact: 7, ease: 7 → 4.9 base + 1 signal multiplicity)
**Source pass:** 33
**Filed:** 2026-06-15
**Source signals:**
- Critique pass-52 [MED] TITHERADGE ERA tab renders with zero
  matching entries (below-deck canon covers S1–S5 [2013–2022];
  the Titheradge era band spans [2024, 2026] with no ranked
  seasons yet) — confirmed at `src/components/canon/CanonEraToolbar.tsx`.
- Critique pass-51 [LOW] KISH ERA filter tab is opaque; a first-time
  visitor does not know who "Kish" is or when the era starts.
- Critique pass-52 drop (same defect class, cap): COLBY ERA on Alone
  carries the same opacity as KISH ERA.
- Signal multiplicity: two distinct fix types (empty-state rendering,
  label context) on the same component across 3+ shows.

**Why:** The era-filter toolbar ships without a degraded-empty state
and without reader-friendly label context. Both gaps compound as new
shows are added — 22 shows now, every one with era bands is a
potential empty-state or opacity recurrence. The TITHERADGE ERA
finding is currently a live display bug: a tab exists for an era with
no ranked content, yet there is no "no seasons yet" affordance —
the filter silently yields an empty grid. The KISH ERA and COLBY ERA
findings are reader-trust issues: internal shorthand labels without
the season-range context that makes a first-time visitor's click pay
off. Both are the same `CanonEraToolbar.tsx` component; a single
phase addresses both fix types plus drains the known instances.

**Scope sketch:**
- `CanonEraToolbar.tsx` — when the active era filter yields 0 canon
  entries, render a clear empty state ("No ranked seasons in this era
  yet") instead of a blank grid.
- Era tab label format: auto-derive a compact parenthetical season
  range from `era_bands[i].range` (e.g., `[2024, 2026]` → `· S11–`)
  and append to host/era-name tabs that carry a non-obvious label.
  Derivation uses existing `premiere_date` on season files — no new
  content fields.
- Drain the three known opaque tabs (TITHERADGE ERA, KISH ERA, COLBY
  ERA) and confirm the auto-range label renders correctly.
- Unit tests for the empty-state render path + the label-derivation
  helper; e2e asserts the KISH ERA tab now carries a season range.

**Estimated phases:** 1.
**Conflicts:** Overlaps conceptually with candidate #15 (which adds a
content-check gate for era band coverage). Independent fix paths:
#14 is the product-visible render fix; #15 is the invariant gate.
Ship in any order; both should eventually land.

### 15. Show canon completeness lax→strict gate

**Score:** 5.8 (impact: 7, ease: 7 → 4.9 base + 2 signal multiplicity)
**Source pass:** 33
**Filed:** 2026-06-15
**Source signals:**
- Critique pass-52 [MED] /shows/below-deck S-tier heading and blurb
  are identical — `tier_s_blurb` absent; fallback equals the heading;
  any show with all canon entries in S tier exhibits this visual dup.
- Critique pass-52 [MED] TITHERADGE ERA filter has zero matches —
  era band range [2024,2026] but no seasonally-ranked entries in that
  span; content-check could flag this at authoring time.
- Critique pass-52 [LOW] `/` home stat "Every season reviewed"
  inaccurate for B-tier shows with partial canons.
- Commit pattern: 9 new shows shipped since pass 32 (70% catalog
  growth); each new B-tier show is a potential recurrence vector for
  the S-tier blurb and era-band coverage gaps.

**Why:** Three critique findings from the same pass (52) cluster
around a single root: new shows added with partially-complete canons
expose gaps across multiple surfaces. The S-tier blurb/heading
duplication is architecturally guaranteed to recur — the `CanonTierBand`
fallback string is identical to the tier headline string, so any
future show where `tier_s_blurb` is absent AND all ranked entries
land in S tier will exhibit the visual double. The era-band coverage
gap (a band with a date range that outpaces the current canon) is a
content authoring oversight that a verify-time check catches before
it reaches the page. The home stat inaccuracy is the same lax→strict
pattern as phase-43 editorial-copy honesty but scoped to a boolean
("reviewed" vs. "in progress"). This is the established `lax→strict`
invariant mechanic (phases 41/42/43/44/45/46): add the check in lax
mode, drain known violators, flip strict in the same or next tick.

**Scope sketch:**
- `scripts/content-check.ts` — add `CANON_COMPLETENESS_STRICT` flag:
  (a) `collectTierBlurbIssues()`: emit issue when `tier_s_blurb` is
  absent AND all canon entries have S-tier rank (fallback = heading,
  visual duplication guaranteed); lax mode logs warning; strict fails.
  (b) `collectEraBandGapIssues()`: emit issue when any era band's
  `[start, end]` range contains no canon entry whose `premiere_date`
  falls within it (empty era band guaranteed to produce an empty tab).
- Drain the single known violator (`below-deck`): add `tier_s_blurb`;
  adjust TITHERADGE ERA range or add the missing S11+ seasons.
- Flip `CANON_COMPLETENESS_STRICT = true` in the same commit (surface
  is small — one show; same day-one-strict pattern as phase 44).
- Update `content-curator` brief so new shows are authored to pass
  both checks from the first tick.
- Unit tests for both `collect*` helpers (pass / fail / empty cases).

**Estimated phases:** 1.
**Conflicts:** Candidate #14 addresses the render-side empty state for
era tabs; #15 addresses the content-check gate that prevents the
content authoring gap from shipping. Independent and complementary.

### 16. /u/[handle] record stat-chip scaffold

**Score:** 5.0 (impact: 6, ease: 7 → 4.2 base + 1 cheap-and-impactful)
**Source pass:** 33
**Filed:** 2026-06-15
**Source signals:**
- Critique pass-52 [MED] /u/e2e own-profile "Your record" surface
  is structurally bare — no stat chips, no record scaffold, no
  "0 VOTES CAST · 0 COMMENTS · JOINED" chip row.
- Phase 38 scope note: the profile ship deliberately bounded scope to
  the activity surface (published comments + vote participation counts)
  and did not ship the stat-chip record zone. The brief named this as
  a follow-on.

**Why:** The `/u/[handle]` page is the only place a returning member
sees their own record reflected back. Phase 38 wired the activity
surface (recent comments, show participation) but the stat-chip row
that makes the record system legible — what counts, what's stored, how
long you've been here — is absent. The critique pass-52 MED finding
confirms this is reader-visible: the "Your record" section is blank on
first party view. The data substrate is complete (phase-11 `users.created_at`,
phase-11/35 vote counts, phase-12/36 published comment counts); the
chip is a read-only aggregate surface with no write path or schema
change needed. One phase closes the phase-38 partial ship.

**Scope sketch:**
- `src/app/(default)/u/[handle]/page.tsx` (or its child components) —
  add a `ProfileStatChips` component: `N VOTES CAST · N COMMENTS · [Mon YYYY] JOINED`.
  Counts derived from live Supabase queries: `votes` count for the
  profile user, `comments` count where `status = 'published'` (spoiler
  P0 — never expose pending/hidden), `users.created_at` formatted.
- Own-profile (viewer === handle): chips reflect your own record.
- Third-party (viewer !== handle): same chip pattern, same queries,
  scoped to the profile user (counts only, no PII).
- Colocated unit test for `ProfileStatChips` with realistic counts;
  e2e assertion that `/u/e2e` profile page renders a stat chip
  matching the joined-date pattern and a non-negative vote count.
- Spoiler discipline P0 intact: published-comment count only.

**Estimated phases:** 1.
**Conflicts:** None. Phase 38 shipped the page shell; this fills the
record zone. No URL change.

<!-- Pass 32 (2026-06-12, commit 14cd563) — 0 candidates filed.
     Re-pass at the exact 20-commit threshold from pass 31
     (8f93e95). Window deltas: pass-50 /critique ran at 947843c
     (5 anon findings: plural-`we` cross-surface drift, /shows
     B-tier empty band, /about title double-stamp, HvV anon
     thread footer 3-line stack, /shows meta-vs-hero
     `is/feels` drift); /iterate drained 3 of the 5 (#413
     /shows B-tier empty band at f302fab, #414 HvV anon-thread
     posting-rule prefix at ce8ab81, #415 /about title fix at
     8c39919). Two pass-50 rows remain Pending (plural-`we`
     cluster MED — extends PLURAL_EDITOR_STRICT scope; meta/hero
     `is/feels` LOW — single-line copy edit). Total Pending
     CRITIQUE = 14 actionable rows (was 17 at pass 31; minus
     3 pass-50 drains = 14; pass-50 added 5, 3 already drained,
     2 net new; remaining net delta from pass-31 baseline: -3
     rows after subtracting pass-50 contribution).
     Signals reviewed (delta from pass 31):
     - AUDIT.md: still 0 actionable Pending rows (the HIGH
       Windows verify row drained at 8f93e95 / pass 31, no new
       rows filed in the window). Unchanged from pass 31.
     - CRITIQUE.md: 14 actionable Pending rows. Cluster shape
       identical to pass 31's analysis — editor-voice register
       drift (3 MED extending PLURAL_EDITOR_STRICT scope) /
       authed-chrome affordance gaps (5 MED) / cross-surface
       display drift (3 MED) / single-tick polish (3 LOW). The
       2 pass-50 rows that remain (plural-`we` cluster MED;
       meta-vs-hero `is/feels` LOW) each extend an existing
       shipped invariant or fold into an existing cluster pass
       31 already examined — neither seeds a new candidate
       shape. The pass-31 §3 "is this a phase shape?"
       conclusion stands: /iterate drains each row in 1-2
       ticks; no lax→strict invariant shape present that isn't
       already covered by phases 41/42/43/44/45/46.
     - GitHub issues: 5 open (was 2 at pass 31), but the delta
       is mechanical: 3 new `loop:opened` mirror rows (#400
       phase-44 mirror, #405 phase-46 mirror, #373 mobile
       reader finding mirror — auto-filed by the loop, not
       human-routed). 0 unlabeled. #398/#399 (cloud march
       crash + Windows verify, both `triage:needs-user`) and
       #150/#148 still routed past triage with no new
       human-routed signals. No candidate-shaped accumulation
       on any backlog axis.
     - spec.md + design/: still no diffs since pass 27
       (verified `git log 8f93e95..HEAD -- spec.md design/`:
       empty; cumulative `git log 9578141..HEAD -- spec.md
       design/`: empty). Brand / voice / URL contract stable
       for 27 days unchanged.
     - Commit pattern: 20 commits since pass 31 — 0 phases
       shipped (build plan exhausted at the same row as pass
       31), 1 critique pass (50 — 0 HIGH / 4 MED / 2 LOW / 5
       filed under cap-of-6), 1 oversight pass (947843c +
       precursor — pass-50 dispatch + self-assessment), 3
       pass-50 audit drains (#413, #414, #415), 1 verify-time
       fix pair (/about title double-stamp at 8c39919), 1
       content edit (HvV posting-rule prefix at ce8ab81). All
       drain shape, no rogue refactor surface, no 5+ fix-class
       cluster on one file. The 14-pass zero-candidate streak
       extends to 15.
     - PHASE_CANDIDATES.md pending: #03 (Newsletter, score
       3.0) still the lone awaiting-promotion candidate (no
       change since pass 26). Zero Considered (below
       threshold) entries; no new structural signal.

     Zero real structural candidates this pass. Honest read:
     the threshold-edge re-pass at exactly 20 commits within
     8h of pass 31 confirms what pass 31 concluded — the
     project's structural envelope is stable and the loop is
     in the iterate-drains-the-queue steady state. The 2 new
     pass-50 critique rows that remain Pending after the
     drain-pair window each extend an existing shipped guard
     or fold into the pass-31 cluster analysis. Reinforces
     the 15-pass streak (18-32) of zero-candidate passes.
     Next tick: /iterate picks up either the plural-`we`
     cluster MED (extends PLURAL_EDITOR_STRICT scope) or one
     of the 3 cross-surface display drift MED rows depending
     on standard impact × ease ordering. -->

<!-- Pass 31 (2026-06-12, commit 8f93e95) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 1 actionable Pending row — the 2026-06-11
       /oversight HIGH bug (`pnpm verify` structurally broken on
       Windows: phase-42 colocation gate's `node:path` join +
       POSIX `'/__tests__/'` filter mismatch, plus a CRLF-checkout
       regex in `hvv-take-shape-opener-echo.test.ts`). Pure /iterate
       drain shape: two narrow string/regex fixes in two files
       with colocated regression tests feeding backslash paths +
       CRLF samples; no phase-shaped surface here. Cloud Linux
       runner can ship the path-normalization + CRLF-normalization
       fixes with synthetic tests; physical Windows verification
       lives with /oversight. Not a candidate.
     - CRITIQUE.md: 17 actionable Pending rows after pass 49
       (today, 8f93e95). One HIGH (#476 /themes/best-finales
       `built` verb in 5/7 entries) + 12 MED + 4 LOW. The HIGH
       row nests cleanly into the phase-45 CLICHE_PATTERNS
       registry — `built|builds?|building` as a fourth entry at
       threshold 3 is a one-line /iterate drain mirroring the
       three already-shipped patterns (`measures/measured against`,
       `at full volume`, `freighted`). Not a candidate.
     - Cluster pass on the 12 MED rows. Three clusters surface
       on inspection: (A) editor-voice cross-surface register
       drift — row 477 (anon: /shows `we` vs /themes + /about
       `I` within session), row 1397 (anon: home institutional
       third-person vs interior first-person editor-voice),
       row 1395 (anon: /themes/best-finales 3 different
       self-descriptions across home → /themes → detail) — 3
       MED signals on the same axis as pass-35 #329's
       PLURAL_EDITOR_STRICT closure. (B) authed-chrome
       affordance gaps — rows 478 (VotePair confusing literal
       for signed-in no-vote), 479 (CommentInput no "post goes
       to review" hint), 1228 (/u/@self bare `Your record`),
       1401 (signed-in handle no account dropdown), 1403
       (empty-thread composer bare `⏎`) — 5 MED signals on the
       authed-state-polish axis. (C) cross-surface display
       drift — rows 1393 (themed-list featured-tile + index
       sub-band card body tagline echo), 1395 (above), 1399
       (authed: home/shows/themes revised-date drift). Cluster
       analysis per §3 self-assess: each row is a single-tick
       /iterate fix on a distinct surface (a copy edit, an
       added scaffold component, a derived prop). The "is this
       a phase shape?" test fails for all three clusters —
       cluster (B) is 5 MED on different surfaces with different
       fix paths (a header dropdown component, a profile stat
       grid scaffold, two composer copy-edit hints, a VotePair
       eyebrow copy edit), not a single-shape refactor; clusters
       (A) and (C) are pronoun/register copy edits where the
       fix lives in the rendered string, not in an invariant
       (the rows themselves don't propose lax→strict guards —
       they propose pick-one-and-be-consistent). Honest call:
       /iterate drains each row in 1-2 ticks each across the
       next 17 ticks (the proven cadence — passes 25-30 drained
       18 critique rows similarly). The lax→strict invariant
       shape that produced phases 41 / 42 / 43 / 44 / 45 / 46
       is not present in this signal envelope — none of the
       17 pending rows propose a new corpus-wide guard, and the
       three that look candidate-shaped (476, 477, 1397) each
       extend an existing shipped invariant (phase-45
       CLICHE_PATTERNS for 476; PLURAL_EDITOR_STRICT scope for
       477/1397) rather than seeding a new one. Reinforces the
       passes-18-through-30 pattern: project has reached the
       "iterate-drains-the-queue" steady state.
     - GitHub issues: 2 open, 0 unlabeled. #150 + #148 unchanged
       (triage:reviewed past cloud crash; triage:needs-user
       `march.yml` coverage-gate wiring still blocked on cloud
       GitHub App's missing `workflows` permission scope —
       phase-42 oversight push already chained `pnpm
       check:test-colocation` into the cloud call-1 string, the
       remaining flip is the row's own naming). Backlog
       structurally unchanged; no new candidate-shaped signal.
     - spec.md + design/: no diffs since pass 27 (verified
       `git log 9578141..HEAD -- spec.md design/`: empty). Last
       spec.md touch 2026-05-16 (3ac0b42 phase 33a). Brand /
       voice / URL contract stable for 27 days.
     - Commit pattern: 20 commits since pass 30 — 3 phases shipped
       (44 BRAND_SPELLING_STRICT, 45 CLICHE_PATTERNS allowlist
       field, 46 colocation gate extended to src/app), 2 critique
       passes (48 + 49 — both 0 HIGH / 6 MED / 0 LOW shape on
       pass 48 and 1 HIGH / 5 MED / 0 LOW on pass 49), 1 data
       migration (064ed57 supabase API-role GRANTs — resolved
       the HIGH AUDIT row from earlier in the window), 1
       oversight pass promoting 44/45/46 + setting content-gaps
       bias on AUDIT, 4 audit-drain pairs (critique-pass-46
       #397 themed-list featured-tile body echo, critique
       pass-47 #406 /about Become-an-editor copy drop, vitest
       3.2.4 → 3.2.6 deps bump, oversight HIGH-row filing for
       Windows verify breakage). All anticipated drains from
       already-shipped phases or open critique pickups; no
       rogue refactor surface, no 5+ fix-class cluster on one
       file. Phase 45's per-phrase allowlist field landed
       cleanly without any extant patterns needing allowlist
       entries — corpus already passed; the field shape is
       ready for the inevitable future where `sets? the bar` /
       `the bar every` cross the threshold and warrant
       phase-45-shape promotion (the brief itself noted 6
       occurrences pre-flight, awaiting a paired drain tick).
     - PHASE_CANDIDATES.md pending: #03 (Newsletter, score 3.0)
       still the lone awaiting-promotion candidate, still gated
       on S1 (custom domain swap). No structural change to the
       PROMOTED column (phases 38/39/40/41/42/43/44/45/46 all
       shipped; the queue is empty for the first time in 20+
       passes — every promoted candidate has landed). Zero
       Considered (below threshold) entries; the per-pass
       drain has been clean.

     Zero real structural candidates this pass. The signal
     envelope across AUDIT (1 row, /iterate-shape) + CRITIQUE
     (17 rows, all /iterate-shape — verified by per-row
     cluster analysis above against §3.1 "is this a phase or
     a fix" test) + GH (0 unlabeled, 2 routed) + spec/design
     (no diffs) + commit pattern (3 phases shipped this window,
     all of the proven lax→strict shape, plus 4 audit-drain
     pairs and a data migration — no surface accumulated 5+
     fix-class commits) all point to the same steady-state
     conclusion: the project's structural envelope is stable,
     /iterate is the right tool for the current queue.
     Reinforces the 14-pass streak (18-31) of zero-candidate
     passes — the loop has converged on iterating the
     polish layer rather than expanding the structural layer,
     which is the correct posture once phases have caught up
     with spec. Next tick: /iterate picks up either the HIGH
     AUDIT row (Windows verify — score 6.3) or the HIGH
     CRITIQUE row (best-finales `built` 5/7 — extends
     CLICHE_PATTERNS registry, one-line addition mirroring
     phase 45) depending on the standard impact × ease ordering. -->

<!-- Pass 27 (2026-06-09, commit 2adef0d) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (only the format
       placeholder at line 19). The drain since pass 26 cleared
       each row in the same iterate cycle it filed — 2 pre-pass-42
       drain pairs (pass-41 MED HvV TAKE+SHAPE opener echo, pass-41
       MED /shows A-tier band template echo), 1 pass-34 MED
       vote-pair cross-surface drift drain, 1 pass-36 LOW HvV
       authed thread stacked input+empty-state drain, and 4 pass-42
       drain pairs (MED anon empty-state arguing CTAs, MED Amazing
       Race first-person on /shows tile, MED `⏎` glyph mobile
       affordance, LOW `STABLE LIST` eyebrow first-paint
       definition). 8 audit/fix pairs total; no row carried over.
     - CRITIQUE.md: 7 actionable Pending rows + 1 format
       placeholder. Three from pass 42 (just shipped this window
       at e2b1618, the 0-HIGH/3-MED/3-LOW pass MED rows already
       drained above): (i) [LOW, authed] /shows/survivor canon
       slot #02 (HvV) within-entry echo — main body close
       `seasons of prior text` repeats verbatim in the adjacent
       WHY THIS SLOT pull, two paragraphs apart on one canon
       entry; (ii) [LOW, anon] /shows/survivor/season/
       heroes-vs-villains + /shows/survivor canon #02 cross-surface
       legacy-stinger echo — `measured against this stretch` /
       `lived in the shadow of` lands 3× across 2 surfaces (HvV
       TAKE close, HvV SHAPE close, canon #02 body close) for
       one season; (iii) [LOW, anon] /themes/best-finales #02 ↔
       /shows/survivor canon #02 cross-surface 6-gram echo on
       `all-star format ... at its ceiling` (carried from pass 41).
       Plus 4 carry-over rows from passes 36/37/41 (best-finales
       sibling `final tribal` verb-object beat, /u/e2e own-profile
       structurally bare `Your record`, HvV spec-row `EPISODE HEAT`
       editorial-vs-spec misframe, cross-show closing-pair echo
       `I'm not claiming to be objective. I'm trying to be honest.`
       across 9 canon `meth_who_p` fields). Cluster analysis:
       rows (i), (ii), (iii), and the carry-over best-finales
       sibling-beat + cross-show closing-pair echo are all
       cross-surface / within-entry phrase-echo invariant shapes
       — **exactly** what candidate #13 (CLICHE_REPETITION_STRICT,
       score 6.0) articulates. The candidate's invariant scope
       already explicitly proposes: (a) cross-entry 5-gram echo
       within a themed-list grouped by show slug, (b) cross-surface
       5-gram echo between themed-list `title` and canon-rationale
       on slug match, (c) within-entry 5-gram echo between canon
       `rationale` and the paired pull/why-this-slot fields, and
       (d) cross-surface 5-gram echo between season-page section
       closes (TAKE/SHAPE/WATCH FOR) and the matching
       canon-rationale close. Five of the seven pending rows nest
       in #13's extensible registry rather than warranting siblings.
       The two heterogeneous carry-overs (`Your record` stat-chip
       scaffold + spec-row tile reshape) are single-component
       fixes that the row itself proposes — single-tick `/iterate`
       shape; no cluster ≥3 HIGH on the same family, no class-
       pattern beyond what candidates #11/#12/#13 already
       articulate.
     - GitHub issues: 2 open, 0 unlabeled. #150 (triage:reviewed,
       past cloud crash) + #148 (triage:needs-user, march.yml
       coverage-gate wiring still blocked on cloud GitHub App's
       missing `workflows` permission scope). Backlog unchanged
       structurally; no new structural signal.
     - spec.md + design/: no diffs since pass 26 (verified
       `git log --since=... -- spec.md design/`: empty). Last
       spec.md touch 2026-05-16 (`3ac0b42` phase 33a
       consolidation). Brand/voice/contract surfaces stable for
       24 days.
     - Commit pattern: 21 commits since pass 26 — 1 critique pass
       (42 e2b1618, 0 HIGH / 3 MED / 3 LOW), 8 critique/audit
       drain pairs against pass-41 + pass-42 + pass-36 + pass-34
       polish (canon methodology siblings → first-person singular,
       Survivor + Amazing Race hero taglines → singular voice,
       HvV SHAPE opener off TAKE echo, A-tier band templated
       opener via card_tagline override, HvV authed thread
       viewerCanPost-gated empty-state, VotePair distinct-voter
       net, CommentInput anon empty-state CTA drop, Amazing Race
       first-person tile drop, CommentInput `⏎` mobile affordance,
       STABLE LIST eyebrow once + 5-gram invariant), 1 expand
       pass 26 c788d57. All anticipated drains from
       already-shipped phases or open critique pickups; no rogue
       refactor surface, no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) +
       #13 (editorial-cliché repetition guard, score 6.0) all
       still await /oversight promotion. Pass 42 (this window's
       fresh critique) adds three more registry seeds to #13's
       envelope: rows (i)-(iii) above — within-entry canon
       rationale↔pull echo, season-page↔canon legacy-stinger echo,
       themed-list↔canon headline echo — each of which the #13
       proposal explicitly anticipates in its invariant scope.
       Reinforces #13 a third time after pass 26's reinforcement
       (rows iv + vi) and pass 23's reinforcement (rows 5 + 6 + 9);
       does not warrant a fresh candidate. #03 (Newsletter,
       score 3.0) still gated on S1 (domain swap). No new
       candidate filed this pass.

     Zero real structural candidates this pass. The seven pending
     critique rows split two ways: 5 candidate-#13-class
     editorial-echo surfaces (cross-entry verb-object beat +
     cross-corpus closing-pair literal + cross-surface
     themed-list↔canon headline + within-entry canon
     rationale↔pull + cross-surface season-page↔canon
     legacy-stinger — all nest in #13's extensible registry
     across the four invariant-scope clauses it already
     articulates), 2 heterogeneous single-component fixes
     (`/u/e2e Your record` stat-chip scaffold, HvV spec-row
     `EPISODE HEAT` tile reshape — each the row itself proposes
     a single-component fix or a narrow content-check helper
     that nests cleanly inside #13's registry). The §3.1 "real
     demand vs model imagination" test still favors letting
     candidates #11/#12/#13 promote before filing a fourth on
     overlapping shapes — the candidate-#13 registry has now
     been reinforced across 5 distinct critique passes (25, 29,
     35, 36, 41, 42) with 10+ invariant-scope clauses across the
     proposal, and is the highest-leverage promotion at the
     current cadence. Next tick: `/iterate` picks up the
     highest-scoring pending critique row (likely one of the
     pass-42 LOWs nesting in #13 — the within-entry HvV
     `seasons of prior text` echo or the cross-surface
     `measured against this stretch` legacy-stinger drain). -->

<!-- Pass 26 (2026-06-08, commit 7cec039) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (only the format
       example placeholder at line 19). The drain since pass 25
       cleared each row in the same iterate cycle it filed —
       8 audit/fix pairs against pass-40 + pass-41 critique
       surfaces (HvV vote-block reading order inverted, /shows
       hero lede taste-free overclaim, /themes index-card CTA
       bare-arrow vs featured `read the list →`, /themes chip
       filter scope, cross-surface list-meta drift, CommentInputStub
       arrow placement, /themes featured-this-month CTA unification,
       footer column rename `Featured shows` → `Start here`,
       /shows + /themes hero freshness slot rename `INDEX REVISED`
       → per-corpus `SHOWS REVISED` / `LISTS REVISED`) — all
       single-tick polish, no row carried over.
     - CRITIQUE.md: 12 actionable Pending rows + 1 format
       placeholder. Six from pass 41 (just shipped this window
       at 7cec039, the 0-HIGH/4-MED/2-LOW pass): (i) [MED, anon]
       /shows/survivor canon methodology block stacks 3 cells
       that swap narrators mid-block — `meth_who_p` is the
       pass-35 #329-drained singular voice but the sibling
       fields (`meth_how_h` / `meth_how_p` / `meth_when_h` /
       `meth_when_p`) across all 13 canons still carry plural
       voice; (ii) [MED, authed] /shows/survivor + /shows/amazing-race
       hero taglines close on plural `We've ranked` while the
       same-page methodology cell reads singular `I've watched`
       — same-page voice contradiction on the same activity,
       two carriers only; (iii) [MED, authed] /shows A-tier band
       runs all 10 blurbs through the `{N} seasons of {plural-
       noun} {-ing verb}` templated opener; (iv) [MED, authed]
       /shows/survivor/season/heroes-vs-villains section 01
       (THE TAKE) and section 02 (THE SHAPE) open with verbatim-
       near-identical structural sentences within ~80 words;
       (v) [LOW, anon] cross-show closing-pair echo introduced
       by the pass-35 #329 drain — every drained `meth_who_p`
       across 9 carrier canons ends with the identical 12-word
       literal `I'm not claiming to be objective. I'm trying to
       be honest.`; (vi) [LOW, anon] /themes/best-finales #02
       headline cross-surface echoes /shows/survivor canon-entry
       #02 body opener on the six-word phrase frame `all-star
       format ... at its ceiling`. Plus 6 carry-over rows from
       passes 29/35/36/40 (best-finales #02 within-entry echo,
       HvV community-vote cross-surface label disagreement,
       HvV comment-thread two-affordance stacking, best-finales
       sibling `final tribal` verb-object beat, /u/e2e own-profile
       structurally bare `Your record`, HvV spec-row `EPISODE
       HEAT` editorial-vs-spec misframe). Cluster analysis:
       rows (i)/(ii)/(v) are all sibling extensions of the
       PLURAL_EDITOR_STRICT invariant family the pass-35 #329
       closure opened — (i) extends scope from `meth_who_p` to
       the four sibling `meth_how_*` / `meth_when_*` methodology
       fields across 13 canons; (ii) extends scope to the
       `tagline` field on 2 carriers (Survivor + Amazing Race);
       (v) addresses the unintended verbatim-corpus-echo side
       effect the #329 drain itself authored. Each is single-
       tick `/iterate` drain shape with a co-located invariant-
       scope extension; the meta-pattern (a strict closure
       scoped too narrowly to one field while the editorial
       discipline applies to a family of fields) is honest but
       the right response is to extend `PLURAL_EDITOR_STRICT`'s
       scope when the drain ticks land, not file a sibling
       phase candidate. Rows (iv) and (vi) are within-page /
       cross-surface phrase-echo invariants — exactly the
       extensible-registry shape candidate #13
       (CLICHE_REPETITION_STRICT, score 6.0) articulates; nest
       cleanly rather than warranting a sibling. Row (iii) is
       the most distinct — per-band templated opener echo on
       /shows A-tier (10/10 carriers on the same 5-word
       grammar) — the finding itself proposes a band-scoped
       `collectShowTaglineTemplateEchoIssues` invariant; could
       nest into #13's extensible registry as a band-template-
       counting helper, OR could be its own candidate. The §3.1
       multi-signal triangulation test: one surface (catalog
       A-tier band), one signal class, single fix path proposed
       by the row itself — below the bar for a sibling phase
       candidate filed now. Carry-overs are heterogeneous single-
       component fixes (vote-state label alignment, comment-
       thread separator, structural-empty-state scaffold, spec-
       row misframe); no cluster ≥3 HIGH on the same family,
       no class-pattern beyond what candidates #11/#12/#13
       already articulate.
     - GitHub issues: 2 open, 0 unlabeled. #150 (triage:reviewed,
       past cloud crash) + #148 (triage:needs-user, march.yml
       coverage-gate wiring still blocked on cloud GitHub App's
       missing `workflows` permission scope). Backlog unchanged
       structurally; no new structural signal.
     - spec.md + design/: no diffs since pass 9 (last spec.md
       touch 2026-05-16 — `3ac0b42` phase 33a consolidation).
       Brand/voice/contract surfaces stable for 23 days.
     - Commit pattern: 20 commits since pass 25 — 2 critique
       passes (40 ac3c88c, 41 7cec039), 8 audit/fix drain pairs
       against pass-40 + pass-41 polish (HvV vote-block reading
       order, /shows hero lede taste-free overclaim, /themes
       index-card CTA bare-arrow, /themes chip filter scope,
       cross-surface list-meta drift, CommentInputStub arrow
       placement, /themes featured-this-month CTA, footer
       column rename, /shows + /themes hero freshness slot
       per-corpus rename, catalogue list-meta voice unification),
       1 expand pass 25 c788d57. All anticipated drains from
       already-shipped phases or open critique pickups; no
       rogue refactor surface, no 5+ fix-class cluster on one
       file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) +
       #13 (editorial-cliché repetition guard, score 6.0) all
       still await /oversight promotion. Pass 41 (this window's
       fresh critique) adds two more registry seeds to #13's
       envelope (rows iv + vi — within-page section-opener echo
       + cross-surface theme-headline ↔ canon-rationale echo)
       and exposes one within-corpus closing-pair echo (row v)
       the #329 drain itself authored. Each reinforces the
       candidate's extensible-registry shape rather than
       warranting a sibling phase candidate. #03 (Newsletter,
       score 3.0) still gated on S1 (domain swap). No new
       candidate filed this pass.

     Zero real structural candidates this pass. The 12 pending
     critique rows split four ways: 3 PLURAL_EDITOR_STRICT
     sibling-extension drains (single-tick drain shape with
     co-located invariant-scope extension, not phase shape;
     the meta-pattern is honest but the right response is to
     extend the existing strict's scope at drain time), 2
     candidate-#13-class editorial drift surfaces (within-page
     section-opener + cross-surface theme-headline echo — both
     nest in #13's extensible registry rather than warranting a
     sibling), 1 per-band templated-opener echo on the /shows
     A-tier band (single surface, single signal class, below
     multi-signal triangulation bar; the row's own proposed fix
     is content-curator drain + invariant — either nests into
     #13 or is itself one-row drain shape, not phase shape),
     6 heterogeneous single-component fixes (vote-state label
     alignment, comment-thread affordance separator, structural
     empty-state scaffold on /u/e2e, HvV spec-row editorial-vs-
     spec misframe, plus the long-pending best-finales #02
     within-entry verdict echo and the best-finales sibling
     `final tribal` verb-object beat already in the queue). The
     §3.1 "real demand vs model imagination" test still favors
     letting candidates #11/#12/#13 promote before filing a
     fourth on overlapping shapes. Next tick: `/iterate` picks
     up the highest-scoring pending critique row (likely one
     of the pass-41 MED rows — the methodology-siblings drain,
     the templated-opener band rewrite, or the TAKE/SHAPE
     section-opener edit). -->

<!-- Pass 23 (2026-06-06, commit 998d1b2) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (only the format
       example placeholder at line 19). The drain since pass 22
       cleared each row in the same iterate cycle it filed —
       pass-34 LOW /themes lede doubled-'one' (6b463d9 +
       ddba223), pass-34 LOW /about voting bridge sentence
       (fa82be4 + 76e5cf7), pass-34 LOW best-finales 'final X'
       template (f657a80 + e15f553), pass-35 HIGH best-finales
       #02 'first all-returnee' factual claim (4ae8c35 + 9cfd0a5),
       pass-35 MED meth_who_p plural-voice ticks 1–5 of 9 (the
       in-flight content-curator drain across canon files —
       Survivor + Drag Race + Amazing Race + Top Chef + Project
       Runway, each tick paired audit:/content: as the standard
       drain shape). Six fix/audit pairs and a 5-tick in-flight
       multi-show drain; no row carried over.
     - CRITIQUE.md: 10 actionable Pending rows + 1 format
       placeholder. Five from pass 35 (1 LOW final-tribal beat
       repetition still pending after 'final X' template
       rotation, 4 remaining ticks of the meth_who_p plural-voice
       drain already in flight) and 5 from pass 36 (just shipped
       this window): (1) [MED, authed] HvV community-vote-state
       cross-surface label disagreement (ShiftCard vote-count
       vs canon-ladder 7d-rank-delta vs VotePair net-votes on
       adjacent hops — three mechanics, three numeric framings
       of the same canonical fact); (2) [LOW, anon] canon-revised
       label drift across home/`/shows`/`/shows/[show]` (`CANON
       REVISED` vs `LAST REVISED` vs eyebrow drift); (3) [LOW,
       authed] /shows S-tier hero-lede vs S-group-header
       subtitle vocabulary swap; (4) [LOW, anon] /themes
       featured-this-month CTA drift (`read the list →` vs
       `read →` vs `read →` across three sibling cards);
       (5) [MED, anon] /themes/best-finales hero framing vs
       /themes index card framing diverge (two unrelated
       editorial descriptions of the same list); (6) [MED, anon]
       /themes/best-finales body openers reach for `endgame`
       (3 of 7) + `closing run` (2 of 7) as fallback for
       `finale` on a list whose subject IS finales; (7) [MED,
       authed] /u/[handle] SSR meta-description third-person vs
       body second-person voice mismatch; (8) [LOW, authed]
       HvV comment-thread input prompt + empty-state affordance
       stacking without separator; (9) [LOW, anon]
       /themes/best-finales two consecutive Survivor entries
       (#02 HvV, #04 WaW) end second sentence on near-identical
       `final tribal` verb-object beat. Cluster analysis: rows
       (5)(6)(9) are all best-finales editorial-drift surfaces
       and reinforce candidate #13 (CLICHE_REPETITION_STRICT, score
       6.0) — (6) is a literal new registry seed (`endgame` /
       `closing run` cross-entry rather than cross-corpus), (9) is
       the within-page sibling-beat repetition shape candidate #13's
       extensible registry can absorb, (5) is a hero/index framing
       drift the named-entity-fidelity invariant noted in pass 18
       conceptually nests inside #13. Rows (2)(3)(4) are the
       cross-surface label/vocabulary drift class noted in pass 18
       (`/themes` lede ↔ hero stat; canon-revised label) — still
       3 LOW surfaces, still below the multi-signal triangulation
       bar, still nests inside candidate #13's positive-fidelity
       registry shape. Rows (1)(7)(8) are heterogeneous
       single-component fixes (vote-state label alignment,
       SSR-vs-body voice gating, comment-thread affordance
       separator). Each is single-tick `/iterate` shape; no
       cluster ≥3 HIGH on the same family, no class-pattern
       beyond what candidates #11/#12/#13 already articulate.
     - GitHub issues: 3 open, 0 unlabeled. #329
       (loop:opened, meth_who_p plural-voice — the in-flight
       drain), #150 (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring still
       blocked on cloud GitHub App's missing `workflows` scope).
       Backlog unchanged structurally; #329 is the current drain
       row, not a new structural signal.
     - spec.md + design/: no diffs since pass 9 (last spec.md
       touch 2026-05-16 — `3ac0b42` phase 33a consolidation).
       The brand/voice/contract surfaces stable for 21 days.
     - Commit pattern: 20 commits since pass 22 — 2 critique
       passes (35 8157fef, 36 998d1b2), 5 critique/audit drain
       pairs on pass-34/35 polish (`final X` template, voting
       bridge sentence, doubled `one`, best-finales factual
       claim, HvV watch_list `cold-open` swap), 5 meth_who_p
       drain ticks (Survivor → Drag Race → Amazing Race → Top
       Chef → Project Runway, each audit:/content: pair, 4 more
       to go). All anticipated drains from already-shipped
       phases or open critique pickups; no rogue refactor
       surface, no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) +
       #13 (editorial-cliché repetition guard, score 6.0) all
       still await /oversight promotion. Pass 36 (this window's
       fresh critique) adds two more registry seeds to #13's
       envelope (`endgame`/`closing run` cross-entry, `final
       tribal` sibling-beat) — reinforces the candidate's
       within-page extension shape but does not warrant a fresh
       candidate. #03 (Newsletter, score 3.0) still gated on
       S1 (domain swap). No new candidate filed this pass.

     Zero real structural candidates this pass. The ten pending
     critique rows split four ways: 4 in-flight meth_who_p
     drain ticks (single class, lax invariant already in
     `scripts/content-check.ts:1325-1361`, strict flip lined up
     after tick 9 — the candidate pattern in action), 3
     candidate-#13-class editorial drift surfaces (cross-entry +
     within-page phrase repetition + hero/index framing
     mismatch — all reinforce #13, all nest in its extensible
     registry rather than warranting a sibling), 3 cross-surface
     label drift LOWs (still below multi-signal triangulation
     bar, still nest in #13's positive-fidelity registry shape),
     3 heterogeneous single-component fixes (vote-state label,
     SSR-vs-body voice, comment-thread separator). The §3.1
     "real demand vs model imagination" test still favors
     letting candidates #11/#12/#13 promote before filing a
     fourth on overlapping shapes. Next tick: `/iterate` picks
     up the highest-scoring pending critique row (likely the
     pass-36 MED HvV community-vote cross-surface label
     disagreement or another meth_who_p drain tick). -->

<!-- Pass 19 (2026-06-03, commit 8f6035e) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 18
       cleared every row in the same iterate cycle it filed —
       pass-27 LOW /about example list titles (6f17965 +
       f1cac03), pass-28 LOW /themes Featured strip date receipt
       (664f3a5 + a456a0e), pass-28 LOW /themes lede vs hero
       stats math (daf1fc3 + b531ba4), pass-28 MED /u/[handle]
       empty-state editorial lede (d3699ac + 677dc57), pass-28
       HIGH amazing-race {yearsWord} pairing (3bf9c7d + ac2dafe),
       pass-28 LOW /themes/best-finales `closing run` repetition
       (ab56775 + 1bc71ca). Six fix/audit pairs, all single-tick
       polish; no row carried over.
     - CRITIQUE.md: 5 actionable Pending rows from pass 29
       (8f6035e, just shipped this window). Cluster analysis:
       (1) [MED, anon|authed] footer SHOWS column alphabetical-
       first-3 vs tier-aware shortlist — single-component fix
       (`FooterTiersCol.tsx` tier-rank helper); single-tick
       `/iterate` shape. (2) [MED, anon] `at full volume` cliche
       cluster across 15+ surfaces — the finding itself proposes
       extending `CLICHE_PATTERNS` in `scripts/content-check.ts:598`,
       which is the **second** concrete extension of the
       pass-25-seeded CLICHE_REPETITION pattern (the **first** —
       `closing run` — landed via the pass-28 drain at 1bc71ca
       this window). Reinforces already-pending candidate #13
       (CLICHE_REPETITION_STRICT, score 6.0) but does not warrant
       a fresh candidate; it is one more registry row on the
       existing proposal. (3) [LOW, anon] /shows/survivor/season/
       heroes-vs-villains section 05 `Read next.` misframes a
       bidirectional canon pair — single-page literal swap to
       `Either direction.`; single-tick `/iterate` shape.
       (4) [LOW, anon] /themes/best-finales entry #02 past-perfect
       `had been` reads as closure on still-airing Survivor —
       single-clause edit (`had been` → `had been by 2010`);
       single-tick `/iterate` shape. (5) [LOW, anon] `back half`
       vs `back-half` hyphenation drift across 4 content sites —
       finding itself proposes a `BACK_HALF_HYPHEN` invariant.
       Hyphenation-discipline class is a candidate-shape question
       (lax→strict invariant in `scripts/content-check.ts`), but
       (a) it is currently a single-phrase class (one compound
       modifier), (b) the finding's proposed scope is one
       narrow regex (not the cross-corpus extensible registry
       candidate #13 specifies), and (c) the existing
       `BACK_HALF_HYPHEN` proposal nests cleanly inside
       candidate #13's extensible phrase registry as one more
       row. Below the §3.1 multi-signal triangulation bar; let
       `/iterate` drain the 5 content sites and add the regex as
       a one-tick invariant per its sibling drains (precedent:
       1bc71ca + ab56775 for `closing run`).
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring still
       blocked on the cloud GitHub App's missing `workflows`
       permission; awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice/contract surfaces remain stable.
     - Commit pattern: 21 commits since pass 18 — 1 critique pass
       (29 8f6035e), 6 critique/audit drain pairs from pass 27 +
       pass 28 + pass 29, 1 single-tick metadata/content fix
       (5101ab6 /themes meta description), 2 single-tick vote/
       VotePair component drains (669115b/8db4bfd +
       6869220/00d7750). All anticipated drains from already-
       shipped phases or about-to-promote candidates; no rogue
       refactor surface, no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) +
       #13 (editorial-cliché repetition guard, score 6.0) all
       still await /oversight promotion. Pass 29 reinforced #13
       a second time (`at full volume` is the second concrete
       extension of the CLICHE_PATTERNS registry pass 28 seeded;
       `closing run` was the first). #03 (Newsletter, score 3.0)
       still gated on S1 (domain swap). No new candidate filed
       this pass.

     Zero real structural candidates this pass. Five pending
     critique rows from pass 29: two single-component MED fixes
     (footer SHOWS shortlist; `at full volume` rewrite) and three
     single-tick LOW polish edits (`Read next.` literal swap;
     `had been` tense anchor; `back half` hyphenation drift). The
     `at full volume` and `back half` findings both propose
     `scripts/content-check.ts` extensions — both nest inside
     candidate #13's extensible phrase registry rather than
     warranting their own candidates. The §3.1 "real demand vs
     model imagination" test still favors letting candidates
     #11/#12/#13 promote before filing a fourth on the same
     `scripts/content-check.ts` lax→strict shape. Next tick:
     `/iterate` picks up the highest-scoring pending critique row
     (likely one of the two MED state-transparency or cliche-
     drain findings). -->

<!-- Pass 18 (2026-06-03, commit 735b28f) — 0 candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 17
       cleared each row in the same iterate cycle it filed —
       pass-27 was the only critique pass shipped in the window
       (05bb4e1) and four of its findings are still Pending (see
       CRITIQUE.md below); the two single-tick non-critique audits
       drained in the same window were the home Community Rank
       tier-3 mechanic (fa9dcf3) and the /shows hero Last revision
       canon-source drift (e5dd62c), both single-shot polish.
     - CRITIQUE.md: 4 actionable Pending rows (the fifth `[ ]` is
       the format placeholder at line 1237), all from pass-27
       (9d07409, 4 hours before this pass):
       (1) [MED, anon] /shows/survivor ShiftsRow card magnitude
       reads `One World — Slid 36 spots` against single-digit
       siblings without volume context — single-component fix
       (`ShiftCard.tsx` gains an optional `voteCount` field +
       colocated bidirectional pin); single-tick `/iterate` shape.
       (2) [MED, authed] season vote block renders
       `YOUR VOTE / CAST VOTE / +1 / COMMUNITY · NET VOTE` to a
       signed-in non-voter, sandwiching the +1 community net under
       the YOUR VOTE eyebrow — single-component fix (explicit
       "you haven't voted" affordance in the YOUR VOTE column);
       single-tick `/iterate` shape.
       (3) [LOW, anon] /about prose names example themed lists as
       `"best premieres"` / `"best post-merge runs"` in scare
       quotes; the real titles are `Premieres that earned it` /
       `The back-half at full volume` — content edit + the finding
       proposes a `content-check.ts` invariant asserting any
       quoted list-title inside `content/legal/about.md` matches a
       real theme's `title` frontmatter.
       (4) [LOW, anon] /themes `<meta description>` overclaims
       `every tiered.tv canon` (vs the visible `10 SHOWS COVERED`
       against 13 shows tracked) AND names lists by generic SEO
       labels (`best premieres`, `best finales`) that aren't the
       actual titles — metadata rewrite + colocated negative pin.
       Cluster analysis: (1) and (2) are both vote/community-rank
       state-transparency findings but on different surfaces with
       different fix shapes (volume context on the rank carousel
       vs personal voted-or-not affordance on the season vote
       block); they're each independent single-tick polish, not a
       phase shape. (3) and (4) share a real thread —
       "named-entity fidelity": editorial copy references real
       lists/counts that have drifted from the canonical content,
       and (3) explicitly proposes a content-check invariant for
       its half of the class. Declined to file a structural
       candidate here because: (a) only 2 surfaces of the class
       today; (b) the invariant shape (a registry of real-list
       titles validated at content-check time) conceptually nests
       inside candidate #13's `CLICHE_REPETITION_STRICT` extensible
       phrase registry (positive-fidelity registry vs negative-
       repetition registry — both are content-check.ts cross-corpus
       phrase aggregators); (c) `THEME_COUNT_TAIL_STRICT` already
       guards count drift on related surfaces. The honest read is:
       let candidates #11/#12/#13 promote first, see if a 3rd or
       4th named-entity-fidelity surface lands in passes 28/29
       before filing — the §3.1 "real demand vs model imagination"
       test asks for multi-signal triangulation and 2 LOW findings
       is below that bar.
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring still
       blocked on the cloud GitHub App's missing `workflows`
       permission; awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice/contract surfaces are stable.
     - Commit pattern: 21 commits since pass 17 — 1 critique pass
       (27 05bb4e1), 10 critique/audit drain pairs from
       passes 22/23/24/25/26, 1 single-tick non-critique fix
       (e5dd62c /shows hero Last revision canon-source). All
       anticipated drains from already-shipped phases or about-to-
       promote candidates; no rogue refactor surface, no 5+
       fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) +
       #13 (editorial-cliché repetition guard, score 6.0) all
       still await /oversight promotion. #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No new candidate
       filed this pass.

     Zero real structural candidates this pass. Four pending
     critique rows — all single-tick `/iterate` polish targets
     (two state-transparency component fixes; two named-entity-
     fidelity copy edits). The named-entity-fidelity pair (rows
     3+4) is the closest thing to a class pattern but at 2 LOW
     surfaces it sits below the multi-signal triangulation bar,
     AND the invariant shape it would propose nests conceptually
     inside candidate #13's extensible content-check.ts phrase-
     registry pattern. Honest read: let the three already-pending
     candidates promote first, watch passes 28/29 for additional
     named-entity-fidelity surfaces. Next tick: `/iterate` picks
     up the highest-scoring pending critique row (likely one of
     the two MED state-transparency findings). -->

<!-- Pass 17 (2026-06-02, commit 3e5b7c7) — 1 candidate filed (#13).
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 16
       cleared each row in the same iterate cycle it filed —
       pass-24 HIGH home/show canon-revised drift (edfba34),
       pass-24 MED /sign-in description truncation (d3925da, the
       candidate #12 anchor signal), pass-24 MED ShiftsRow eyebrow
       source-of-truth (1b9b069), pass-24 MED /themes Save scope
       (89796de), pass-24 LOW Suggest-an-entry mailto brand
       (8e7b264, the second candidate #12 anchor signal), pass-24
       LOW /themes smart-quote U+2019 (d9ade6d), pass-25 MED /about
       meta description (ebc0633), pass-25 MED HomeMoreShows
       teaser pill (beb62df), pass-25 MED /themes filter chip ALL
       scope (bfe8ab0), pass-23 LOW comment-thread empty-state
       itself qualifier (3e5b7c7). 10 fix/audit pairs total, all
       single-tick polish; no row carried over.
     - CRITIQUE.md: 1 actionable Pending row (the second is the
       format placeholder at line 1077). Pass 25 (c91ee76) shipped
       fresh signal this window. The remaining row is the pass-25
       MED `measures itself against` cross-surface clever-tic
       cluster filed as candidate #13's anchor signal. Could be
       drained as a single-tick `/iterate` content edit but the
       finding itself proposes a structural `collectClicheRepetitionIssues`
       invariant + extensible phrase registry — the same shape as
       phases 41/43 + the pending candidate #12, so a phase
       promotion is the honest scope (drain + invariant + registry,
       lax→strict cadence). /oversight resolves whether to promote
       this as a phase or let /iterate drain the 9+ surfaces with
       a smaller bonus-invariant scope.
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148 (triage:needs-user,
       march.yml coverage-gate wiring still blocked on the cloud
       GitHub App's missing `workflows` permission; awaiting a
       local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The editorial-voice surface is stable.
     - Commit pattern: 21 commits since pass 16 — 1 critique pass
       (25 c91ee76), 1 single-tick non-critique fix (edfba34 home
       canon revised label), 9 critique/audit drain pairs from
       pass-22/23/24/25. All anticipated drains from already-shipped
       phases or about-to-promote candidates; no rogue refactor
       surface, no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) + #12 (brand-spelling discipline, score 6.6) both
       still await /oversight promotion. #03 (Newsletter, score 3.0)
       still gated on S1 (domain swap). New: #13 (editorial-cliché
       repetition guard, score 6.0).

     One real structural candidate this pass — #13 — extending
     the phase-41/43 + candidate-#12 lax→strict invariant
     precedent to the editorial voice rule's last uncovered
     surface (cross-corpus phrase-frequency). Anchored by a
     fresh pass-25 critique row that itself proposes the
     invariant shape verbatim, corroborated by independent `rg`
     verification of the 10+ surface count. The drain budget
     (9+ surface rewrites + invariant + registry) is honestly a
     phase shape, not a single iterate tick; /oversight resolves
     whether to promote vs. let /iterate drain the surfaces with
     a smaller bonus-invariant scope. The only other actionable
     signal (the pass-25 cluster) is the candidate #13 anchor
     itself; remaining surfaces are all iterate-shape polish
     already drained. -->

<!-- Pass 16 (2026-06-01, commit 34a7832) — 1 candidate filed (#12).
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 15
       cleared each row in the same iterate cycle it filed —
       #pass-22 MED cast-yours season vote eyebrow (1c24036), #pass-22
       MED ethnographic-labor watch_list (5fe6bfe), #pass-22 MED
       themes hero 12-vs-9 mismatch (973989e), #pass-22 MED
       /u/[handle] self-vs-stranger copy (bf069c7), #pass-23 HIGH
       /themes lede ↔ stats lockstep (03918b3), #pass-23 MED VotePair
       NET VOTE sign (0d4dd79), #pass-23 MED SENTIMENT-TAGGED
       eyebrow (5dd7e56), #pass-22 LOW /u/[handle] stat order
       (8bce079), #pass-23 MED mobile authed Sign out exposure
       (5435b96). One non-critique fix shipped (eff79c4 — drop 01/02
       markers on canon tab pair). No row carried over.
     - CRITIQUE.md: 7 Pending rows (1 HIGH + 3 MED + 3 LOW, 6 from
       pass-24 + 1 from pass-23). Pass 24 (34a7832) shipped 5h ago
       at this expand pass's filing — fresh signal. (1) [HIGH, anon]
       Home / "CURRENTLY FEATURED" stat block stamps June 2026 vs
       /shows/survivor's May 2026 (build-time vs canon.last_revised
       drift, flipped today 2026-06-01); single-tick `/iterate`
       polish target — derive home label from featured show's
       canon.last_revised + colocated test. (2) [MED, anon] /sign-in
       description `Sign in to tiered.` — brand truncated, filed
       here as the strongest signal of the candidate #12 cluster.
       (3) [MED, anon] /shows/survivor ShiftsRow eyebrow missing
       community source label — single-tick eyebrow edit. (4) [MED,
       authed] /themes Save list no return path — single-tick
       caption ("saved on this device") OR phase-shape member-record
       wiring; declined to file as a candidate because the recommended
       fix (caption) is iterate-shape and the phase-shape alternative
       (Supabase user_saved_lists table + /u/[handle] surface) is a
       single critique row that would need 2-3 more saved-list-class
       signals to clear "real demand vs model imagination" §3.1.
       (5) [LOW, anon] /themes apostrophe smart-quote U+2019 — single-
       tick component edit. (6) [LOW, authed] /themes/best-premieres
       mailto editors@tiered.app — filed as the second pass-24
       signal of the candidate #12 cluster. (7) [LOW, authed] season
       comment empty-state "weigh in on the season itself" — single-
       tick component edit; voice-break class, same shape as the
       pass-23 SENTIMENT-TAGGED drain (declined as a structural
       candidate because the cases are heterogeneous voice nits, not
       a class-pattern phases 41/43 don't already drain).
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring blocked
       on the cloud GitHub App's missing `workflows` permission —
       known, intentional, awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice surfaces are stable.
     - Commit pattern: 22 commits since pass 15 — 2 critique passes
       (23 6b37f35, 24 34a7832), 9 critique/audit drain pairs
       (pass-22 LOW/MED, pass-23 HIGH/MED/MED/MED, and a non-
       critique fix). All anticipated drains from already-shipped
       phases; no rogue refactor surface, no 5+ fix-class cluster
       on one file.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) still awaits /oversight promotion. #03 (Newsletter,
       score 3.0) still gated on S1 (domain swap). New: #12
       (brand-spelling discipline, score 6.6).

     One real structural candidate this pass — #12 — the
     natural continuation of the phase-41/42/43 precedent applied
     to CLAUDE.md hard rule 6, the only rule of the project's
     five non-negotiable identity rules currently lacking a
     verify-time gate. Triangulated by 2 fresh pass-24 critique
     findings + a third instance the expand sweep surfaced
     (`/mod` description). Awaiting /oversight to review and
     promote (cloud never promotes). The 7 critique findings stay
     single-tick `/iterate` polish targets, including the HIGH
     home/show canon-revised drift (the highest-priority iterate
     pickup next tick). -->

<!-- Pass 15 (2026-05-31, commit b69a2b2) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 14
       cleared each row in the same iterate cycle it filed —
       #pass-20-LOW themes-hero singular/plural drift, #pass-20-LOW
       season WHERE-IT-SITS "neighbors below" overload, #pass-20-LOW
       /themes featured-duplication, #pass-21-LOW /themes featured
       subhead, #pass-21-LOW /themes filter-mode CTA→status, #pass-22
       MED /shows community-pane "recompute" voice scrub, #pass-22
       LOW /about vote-affordance copy ([+]/[−]→up/down), #pass-22
       HIGH /about voting copy single-binary mechanic. No row carried
       over.
     - CRITIQUE.md: 5 Pending rows from passes 21+22 — 1 LOW + 4 MED.
       (1) [MED, anon] /shows/survivor/season/heroes-vs-villains
       WHAT-TO-WATCH-FOR LATE callout body uses "ethnographic labor"
       — academic-register break vs. plain-speech siblings. Single
       `watch_list[3].body` content edit. (2) [MED, anon] /themes
       hero stat reads `12 LISTS` while the chip below reads
       `SHOWING · ALL 9 LISTS` (post-#253 featured-dedup math
       — 3 + 9 = 12); fix is split-into-two-numbers or one-side
       reconciliation. Single component edit + tiny `getThemeStats()`
       field. (3) [MED, authed] season VotePair CTA button label
       `CAST YOURS` — possessive-elision fragment, sole clever
       fragment in the authed walk vs. plain peers. Single string
       relabel + colocated test. (4) [LOW, authed] /u/[handle]
       self-view stat row orders comments-first while every other
       surface foregrounds voting — reorder cells. Single component
       edit. (5) [MED, authed] /u/[handle] is publicly addressable
       but ships unconditional second-person `Your record` /
       `Nothing on the public record yet` / `Start with Survivor →`
       copy regardless of viewer identity; `ProfileEmpty.tsx`
       already accepts `selfView` per #238 but the strings are not
       gated on it. Single component edit + extend the pinned
       copy tests. All five are single-tick `/iterate` polish targets.
       No cluster ≥3 HIGH on the same family; no class-pattern beyond
       what phases 41 + 43 already drained. Three of the five sit in
       the editorial-copy-honesty family Phase 43's
       `YEAR_TENURE_STRICT` invariant covers for year/tenure but
       does not generalize over (voice register, CTA verb shape,
       second-person-when-public) — declined to file a structural
       candidate because the cases are heterogeneous (each fix is a
       different invariant shape: copy register vs. plural-noun
       relabel vs. selfView-prop gating) and the per-tick polish
       drain has been keeping up since pass 14 (8 fix commits in 20
       commits is on the healthy side of reactive, not the
       phase-42-precedent reactive flood).
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring blocked
       on the cloud GitHub App's missing `workflows` permission —
       known, intentional, awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice surfaces are stable.
     - Commit pattern: 20 commits since pass 14 — 2 critique passes
       (21 95c76dc, 22 627342d), 8 critique/audit drain pairs
       covering pass-20 LOW + pass-21 LOW + pass-22 LOW/MED/HIGH
       findings (themes-hero singular/plural e0e84c0, season
       WHERE-IT-SITS overload e6ddf5a, themes featured-dedup
       1344e77, themes featured subhead e6466c2, themes
       filter-mode-CTA→status 61ff81d, /shows community-pane
       recompute scrub 7bcec01, /about vote-affordance copy
       eac1163, /about voting copy single-binary 8cc9331), 1
       content polish (Top Chef tagline e38fa1d). All anticipated
       drains from already-shipped phases; no rogue refactor
       surface, no 5+ fix-class cluster on one file. The /about-
       page-twin drain (eac1163 + 8cc9331) is the closest thing
       to a cluster — both surfaces in the same `/about` file in
       one critique window — but the root cause is the same kind
       of copy/UI drift that Phase 43's strict invariant catches
       for year/tenure; declined to file a candidate to extend
       the invariant to `/about` body text specifically because
       the surface set is bounded (3 legal pages) and the next
       drift would be flagged at the next critique pass before it
       compounds.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) still awaits /oversight promotion. #03 (Newsletter,
       score 3.0) still gated on S1 (domain swap). No change.

     One real structural candidate (#11) still awaits oversight;
     this pass surfaces no new structural shape. The five pending
     critique findings are heterogeneous single-tick `/iterate`
     polish targets, not a class-pattern that warrants a phase.
     The build plan stays in its clean re-exhausted state.
     Bumping metadata; awaiting the next pass' cadence window for
     fresh structural signals to accumulate. -->

<!-- Pass 13 (2026-05-30, commit d24f1b5) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The 7-tick a11y matrix
       expansion drain since pass 12 (#228 /sign-in desktop,
       #229 /u/[handle] authed, #231 /themes/[theme] mobile, #232
       /shows mobile, #233 /themes mobile, #234
       /shows/[show]?view=community mobile, plus #227 the
       /internal/rank-shift-demo §5a backfill) cleared each row in
       the same iterate cycle it filed. No row carried over.
     - CRITIQUE.md: 1 real Pending row from pass 18 — LOW [anon]
       /shows/[show]/season/[slug] mobile `1 MIN READ` chip
       contradicts the TOC's `6 SECTIONS` length signal; drop the
       chip (TOC is sufficient) or derive from real section body
       word count. Single-tick `/iterate` polish target (one
       component + a colocated assertion). The other 5 Pass-18
       MED findings (card_tagline parity, entries-meta term
       bleed, home mobile cover/copy source order, profile-empty
       prose, comment-input identity) all drained in the same
       window (commits 042a84f, 5df0a36, 2f432f5, 51a491e,
       8a57e87 + audit-row twins). No cluster ≥3 HIGH on the
       same family, no class-pattern beyond what phases 41/43
       already drained.
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring blocked
       on the cloud GitHub App's missing `workflows` permission —
       known, intentional, awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice surfaces are stable.
     - Commit pattern: 22 commits since pass 12 — 1 critique pass
       (18, 498f0a3), 5 critique-pass-18 fix-drain pairs (5 MED
       findings, each one tick), a 7-tick a11y matrix expansion
       (#228–#234 closing the family-by-family coverage backfill),
       1 colocated-test backfill (#227 /internal/rank-shift-demo
       — the last `src/app/` straggler before candidate #11's
       gate would catch it), 1 canon community trend-marker gloss
       fix (9e87f3b — pass 17 LOW drain), 1 Survivor tagline noun
       alignment (a3bba30 — pass 17 critique drain). Considered
       whether the 7-tick a11y matrix drain mirrors the phase-42
       reactive-drain shape that would warrant a structural
       candidate ("derive a11y matrix from canonical-urls.ts");
       declined — the drain self-completed at the right boundary
       (every high-traffic interactive canonical-URL surface now
       covered desktop + mobile; /terms, /privacy, /mod
       intentionally excluded as low-risk/RBAC-gated), there is
       no analog to §5a's "every commit ships unit tests"
       non-negotiable rule for axe matrix coverage, and a derived
       matrix would just relocate the allowlist maintenance.
       Future new canonical-URL families are infrequent given
       spec stability, so the prophylactic value is bound.
     - PHASE_CANDIDATES.md pending: #11 (src/app colocation gate,
       score 5.5) still awaits /oversight promotion — the
       /internal/rank-shift-demo backfill (#227, d546215) closed
       the last `src/app/` straggler this pass, so the gate flip
       would now land with zero stragglers to allowlist (the demo
       remains the only build-flag-gated allowlist target). #03
       (Newsletter, score 3.0) still gated on S1 (domain swap).
       No change to either.

     One real structural candidate from pass 12 (#11) still
     awaits oversight; this pass surfaces no new structural
     shape. The pass-18 LOW critique row is a single-tick
     `/iterate` polish target. The build plan stays in its clean
     re-exhausted state. Bumping metadata; awaiting the next
     pass' cadence window for fresh structural signals to
     accumulate. -->

<!-- Pass 12 (2026-05-29, commit 3326f0d) — 1 candidate filed (#11).
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The drain since pass 11
       cleared each row in the same iterate cycle it filed — the
       large §5a `src/app/**` colocated-test batch (#210/#211/#212
       + #218–#224) plus routine polish (#... profile self-view
       zeroed-stat skeleton, best-non-winning-runs placement
       reframe, CanonTabSwitch aria-labels, Tiers→Shows IA rename,
       /shows hero seasons stat from canon coverage, season
       VotePair this-week eyebrow). No row carried over.
     - CRITIQUE.md: 2 Pending rows from pass 17 — both LOW. (1)
       [authed] /shows/survivor hero `tagline` says "genre" while
       the home/tile `card_tagline` says "format" for the same
       claim — single-string curator copy edit in
       `content/shows/survivor.md`. (2) [anon] /shows/survivor
       canon community-state marker "◆ hold" has no legend
       glossing the glyph/hold-climb-slide vocabulary — one-line
       legend / aria gloss + a colocated assertion. Both are
       single-tick `/iterate` polish targets; no cluster ≥3 HIGH
       on one family, no class-pattern beyond what phases 41/43
       already drained.
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring blocked
       on the cloud GitHub App's missing `workflows` permission —
       known, intentional). #148 is now cross-referenced by
       candidate #11's scope.
     - spec.md + design/: no diffs since pass 9 (commit de1e037).
       The brand/voice surfaces are stable.
     - Commit pattern: 22 commits since pass 11 — 2 critique
       passes (16 987754d, 17 3326f0d), an 11-commit §5a
       `src/app/**` colocated-test drain (#210–#224), and ~7
       routine iterate-polish fixes. **This drain is the new
       structural signal** — it is the exact shape (reactive
       one-file-per-tick §5a backfill on a tree the verify gate
       doesn't cover) that promoted Phase 42 for `src/components`;
       filed here as candidate #11.
     - PHASE_CANDIDATES.md pending: #03 (Newsletter, score 3.0)
       still gated on S1 (domain swap). No change. New: #11
       (src/app colocation gate, score 5.5).

     One real structural candidate this pass — #11, the natural
     continuation of the Phase 42 precedent onto the last
     uncovered source tree. The two LOW critique findings stay
     single-tick `/iterate` polish targets. Awaiting /oversight to
     review and promote (cloud never promotes). -->

<!-- Pass 11 (2026-05-28, commit 0f0a2f0) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The audit drain since
       pass 10 cleared each row in the same iterate cycle it
       filed (#198 /about footer-anchor mismatch, #199 vote-pair
       anon-no-vote community-prefix, #200 /shows tier-b empty-
       band-placeholder, #201 /u/<self> empty-state CTA dest,
       #202 /shows/.../season/... empty-state soft-leak, #203
       comment-thread caps eyebrow stamp, plus #206 sign-in
       page testless drain closing the §5a coverage gap on the
       only `src/app/` auth-flow page). No row carried over.
     - CRITIQUE.md: 4 Pending rows from pass 15 — 2 MED + 2 LOW.
       (1) [MED, anon] /shows/survivor hero stat eyebrow reads
       `SEASONS AIRED` while the home + /shows surfaces brag
       `SEASONS RANKED` on the same substrate — single-string
       label flip + lax/strict invariant pinning the rule
       (`canon.entries.length >= seasons` ⇒ RANKED). (2) [MED,
       authed] /season VotePair authed-no-vote eyebrow reads
       `CAST YOURS THIS WEEK` but the explainer below it
       clarifies the vote is one-shot lifetime per reader;
       drop `THIS WEEK` from the eyebrow string. (3) [LOW,
       authed] /u/<self> empty-state `YOUR RECORD` caps eyebrow
       is off-voice against the warm peer body below it —
       single-string drop/recast (same editorial drift class
       the cloud loop just closed for `BE THE FIRST` on the
       comment thread, faf0767). (4) [LOW, anon] / home
       `01 · CURATED / 02 · LIVE` numeric prefixes on the two
       ranking-type cards walk back the parallelism the prose
       just established — drop the prefixes. All four are
       single-tick `/iterate` polish targets — one carries a
       structural defense (the SEASONS RANKED content-check
       invariant, ~30 LOC) but the scope is still single-tick.
       No cluster ≥3 HIGH on the same family, no class-pattern
       that warrants a phase rather than per-tick polish (phases
       41 + 43 already drained the editorial-copy honesty +
       cross-canon classes).
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring
       blocked on the cloud GitHub App's missing `workflows`
       permission — known, intentional, awaiting a local
       /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit
       de1e037). The brand/voice surfaces are stable.
     - Commit pattern: 22 commits since pass 10 — 1 critique
       pass (14, 4ac743b), 5 critique-row drains paired with
       fixes (#198 b80e328/ca9ca8d, #199 966fe65/efd7a3f, #200
       99b567c/f304756, #201 9a0fac3/c62c4e3, #202 5886ebe/
       06c6898, #203 faf0767/29a66e8), 1 critique pass (15,
       7861bb2), 1 phase-43 content-honesty drain pair (themed-
       list tagline tail 319b314 + entry-blurb twist spoiler
       5e9a09e), 2 voice/state polish fixes (dc36a6a /u owner-
       view eyebrow, 439c093 VotePair count-label community
       source qualifier), 1 canon meth_who_p flourish rewrite
       (9e2ac61), 1 colocated-test backfill (#206: ff94ba7 /
       0f0a2f0) closing /sign-in. All anticipated drains from
       previously-promoted phases (40/41/42/43) plus the
       pass-14 critique backlog; no rogue refactor surface, no
       5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No change.

     The remaining critique findings are individual `/iterate`
     polish targets (one paired with a small content-check
     invariant; still single-tick scope), not phase shapes.
     The build plan stays in its clean re-exhausted state.
     Bumping metadata; awaiting the next pass' cadence window
     for fresh structural signals to accumulate. -->

<!-- Pass 10 (2026-05-27, commit eee86b2) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The audit drain since
       pass 9 cleared each row in the same iterate cycle it filed
       (#186 LAST REVISED relative-time stamp, #187 /shows
       tagline templated tail, #188 /themes H1 cross-canon
       overclaim, #189 /season vote head/pill no-vote
       redundancy, #190 /themes title syntactic mold, #191
       /themes blurb count-of-shows tail, plus the
       phase-33-redirect-pair completion at #193 — community
       redirect colocated test). No row carried over.
     - CRITIQUE.md: 5 Pending rows — 4 MED from pass 13 + 1 LOW
       from pass 11. (1) /themes/best-finales body-hero
       `tagline:` still closes on "across six different
       franchises" — one of 10 themed-list `tagline:` fields
       owed the same drain commits 9dc9418 + 1241040 applied to
       `description:`/`blurb:`. (2) /themes/best-finales entry
       #04 blurb names two season-specific twist mechanics
       (Edge of Extinction, fire tokens) — spoiler discipline
       P0 row; fix is blurb rewrite + content-check blocklist
       for canonical-twist-names on themed-list
       `entries[].blurb`. (3) /season VotePair head ambiguous
       in the authed-not-yet-voted state — `k`-label
       disambiguation. (4) /u/e2e owner-view indistinguishable
       from stranger view — `isSelfView` branch renders no
       owner-specific cue. (5) [LOW] clever-paradox flourish
       in 5 canon `meth_who_p` blocks (pass-11 carryover).
       Each is a single-tick `/iterate` polish target — the
       spoiler-blocklist row carries a structural defense
       (content-check addition ~50 lines) but the scope is
       still single-tick. No cluster ≥3 HIGH on the same
       family, no class-pattern that warrants a phase rather
       than per-tick polish (phases 41 + 43 already drained the
       editorial-copy honesty + cross-canon classes).
     - GitHub issues: 0 unlabeled; backlog unchanged — #150
       (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring
       blocked on the cloud GitHub App's missing `workflows`
       permission — known, intentional, awaiting a local
       /oversight push).
     - spec.md + design/: no diffs since pass 9 (commit
       de1e037). The brand/voice surfaces are stable.
     - Commit pattern: 20 commits since pass 9 — 1 critique
       pass (12, 7afc057) + 5 critique-row drains paired with
       their fixes (#186 fcb98ae/1da3349, #187 c4f0e6c/025464f,
       #188 6b87f06/f17b462, #189 73c25eb/d61e520, #190
       361a89b/e2816dd, #191 9dc9418/1241040), 1 critique pass
       (13, 2ceca5b), 1 season vote-block recompute-copy fix
       (fa683be / ea2b1fe), 1 test-colocation backfill (#193:
       1b519f8 / 348a891) closing the phase-33 redirect-pair,
       1 content polish (eee86b2 Survivor canon ladder
       COMMUNITY #01 cascade dedup). All anticipated drains
       from previously-promoted phases (40/41/42/43) plus the
       pass-12 critique backlog; no rogue refactor surface, no
       5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No change.

     The remaining critique findings are individual `/iterate`
     polish targets (one is paired with a small content-check
     blocklist; still single-tick scope), not phase shapes.
     The build plan stays in its clean re-exhausted state.
     Bumping metadata; awaiting the next pass' cadence window
     for fresh structural signals to accumulate. -->

<!-- Pass 9 (2026-05-26, commit de1e037) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (the only `[ ]` row is
       the format placeholder at line 19). The five audit rows
       filed since pass 8 (#181 /shows B-tier overclaim, #182
       VoteRowHead no-vote meta, #183 best-finales S20 "two
       decades" math, #184 best-finales BB10 alliance-suffix,
       #185 /shows/survivor/season/heroes-vs-villains 404) all
       resolved within the same iterate cycle they were filed —
       the reactive drain caught up to the pass-11 backlog.
     - CRITIQUE.md: 1 real Pending row from pass 11 — LOW [anon]
       clever-paradox flourish ("We're not pretending to be
       objective; we are pretending to be honest") replicated
       across 5 canon `meth_who_p` blocks (survivor, amazing-race,
       top-chef, the-challenge, dragrace) plus an agent-brief
       update to keep future canons born without it. Single-class
       polish target across a known fixed-N file set; one
       `/iterate` tick (and an agent-brief edit in the same
       commit) drains it. No cluster ≥3 HIGH on the same family,
       no class-pattern that warrants a phase rather than per-tick
       polish.
     - GitHub issues: 0 unlabeled; backlog unchanged from pass 8 —
       #150 (triage:reviewed, past cloud crash) + #148
       (triage:needs-user, march.yml coverage-gate wiring blocked
       on the cloud GitHub App's missing `workflows` permission —
       known, intentional, awaiting a local /oversight push).
     - spec.md + design/: no diffs since pass 8 (commit fa19f00).
     - Commit pattern: 21 commits since pass 8 — 1 critique pass
       (11, cc73587), 5 audit-row drains paired with their fixes
       (#181 7d86e6a/b2d7401, #182 0cfa15e/0007da0, #183
       13d9cc6/d8eff2d, #184 e1d91a1/6f2388f, #185 f3d039e/de1e037),
       2 polish/SEO fixes (1c87165 self-view CTA on /u/<handle>
       empty, 471a64c season vote-row eyebrow auth/vote gating,
       0b437ad show page meta description rewrite), 1 colocated-
       test backfill (3957ea5 /themes/[theme]/opengraph-image),
       1 home compact-tail dedup fix (2cbabda). All anticipated
       drains from previously-promoted phases (40/41/42/43) plus
       the pass-11 critique backlog; no rogue refactor surface,
       no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No change.

     The remaining LOW critique finding is a single-tick /iterate
     polish target (5 known canon files + agent-brief edit), not
     a phase shape. The build plan stays in its clean
     re-exhausted state. Bumping metadata; awaiting the next
     pass' cadence window for fresh structural signals to
     accumulate. -->

<!-- Pass 8 (2026-05-25, commit fa19f00) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows. The #172 row body
       reads "RESOLVED this commit (#172)" but the checkbox is
       still `[ ]` (stale tick from the iterate drain — content
       resolved, scoreboard not flipped). Either way the surface
       is closed; no structural gap.
     - CRITIQUE.md: 4 Pending rows from passes 9 + 10 — 3 MED + 1
       LOW. (1) `/shows/<show>` meta description bolts an SEO
       prefix in front of the editorial tagline and overshoots
       Google's truncation point (the sibling season-page fix
       just shipped via fa19f00; same class, but bounded to one
       remaining surface). (2) `/` renders Survivor twice in the
       visible fold (the FEATURED hero and the "+ N MORE" tail
       overlap — dedup bug in the home partition helper). (3)
       `/shows/<show>/season/<slug>` ships the "Your vote /
       change within 72h" eyebrow unconditionally for anon +
       signed-in-no-vote viewers (state-aware copy gap on a
       single surface). (4) `/u/[handle]` self-view is
       indistinguishable from a stranger view + no next-action
       on the empty state (LOW, single-surface UX nit). All
       four are one-iterate-tick polish targets — no cluster
       of ≥3 HIGH on a single family, no class-pattern beyond
       what phases 41 + 43 already drained.
     - GitHub issues: 0 unlabeled; backlog is #150 (triage:
       reviewed, past cloud crash) + #148 (triage:needs-user,
       march.yml coverage-gate wiring blocked on the cloud
       GitHub App's missing `workflows` permission — known,
       intentional).
     - spec.md + design/: no diffs since pass 7.
     - Commit pattern: 20 commits since pass 7 — 6 audit/critique
       drains + paired iterate fixes, 2 colocated-test ticks for
       OG image routes (continuing the §5a backfill), 2 critique
       passes (9 + 10), 1 content schema split (`card_tagline`
       optional split — CLAUDE.md updated in the same commit),
       and routine polish. All anticipated drains from previously-
       promoted phases (40/41/42/43); no rogue refactor surface,
       no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No change.

     The remaining MED/LOW critique findings are individual
     /iterate polish targets, not phase shapes. The build plan
     stays in its clean re-exhausted state. Bumping metadata;
     awaiting the next pass' cadence window for fresh
     structural signals to accumulate. -->

<!-- Pass 7 (2026-05-24, commit 979d880) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 actionable Pending rows (only the format-comment
       placeholder; the most recent 12-tick #131-#146 colocated-test
       drain landed every src/app/ route handler + RSS surfaces, and
       all entries are RESOLVED).
     - CRITIQUE.md: 3 Pending rows from passes-6/7/8 — all LOW:
       (1) the "twenty-five years" hardcoded copy in 5 surfaces
       (LOW, pass-6 #155), already absorbed into phase 43's
       YEAR_TENURE_STRICT invariant's allowlist scope; (2) the
       "1 MIN READ" hardcoded chip on /shows/survivor/season/
       heroes-villains (LOW, pass-6 #155); (3) the /u/<handle>
       empty-state stat-strip redundancy (LOW, pass-8 #158).
       Single-surface polish targets, no cluster ≥3 HIGH on the
       same family, no class-pattern beyond phase 43's existing
       editorial-honesty scope. Each is one-iterate-tick work.
     - GitHub issues: 0 unlabeled; backlog is #150 (triage:reviewed,
       past cloud crash) + #148 (triage:needs-user, march.yml
       coverage-gate wiring blocked on the cloud GitHub App's
       missing `workflows` permission — known, intentional).
     - spec.md + design/: no diffs since pass 6.
     - Commit pattern: 21 commits since pass 6 — 9 critique-row
       drains, 4 iterate-fix commits, 2 critique passes (7+8), 1
       expand pass (6), 3 misc. All anticipated polish; no rogue
       refactor surface, no 5+ fix-class cluster on one file.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score
       3.0) still gated on S1 (domain swap). No change.

     The remaining LOW critique findings are individual /iterate
     polish targets, not phase shapes. The build plan stays in
     its clean re-exhausted state. Bumping metadata; awaiting
     the next pass' cadence window for fresh structural signals
     to accumulate. -->

<!-- Pass 6 (2026-05-24, commit 5e21809) — no new candidates filed.
     Signals reviewed:
     - AUDIT.md: 0 Pending rows.
     - CRITIQUE.md: 7 Pending rows from pass-6; 3 already addressed
       by phase 43 ticks (host-caption ordinal #5, twenty-five-years
       sweep #6, MIN READ derivation #4) — the remaining 3 are
       individual MED/LOW findings (voter-state pill on YOUR VOTE
       block, /u/<handle> empty-state voice rewrite, /themes "By era"
       zero-count chip) and 1 LOW that already absorbed into the
       phase-43 year-tenure invariant scope. No cluster ≥3 HIGH
       findings on the same surface; no class-pattern that would
       warrant a phase rather than per-tick `/iterate` polish.
     - GitHub issues: 0 unlabeled.
     - spec.md + design/: no diffs since pass 5 (commit 04427df).
     - Commit pattern: 41 commits since pass 5 — 16 phase-42 + 8
       phase-43 + 7 misc iterate-polish; all anticipated drains from
       previously-promoted candidates (#10 and #09), no rogue
       refactor surface.
     - PHASE_CANDIDATES.md pending: only #03 (Newsletter, score 3.0)
       still gated on S1 (domain swap). No change.

     The two promoted candidates from pass 5 (#10 → Phase 42, #09 →
     Phase 43) both shipped between pass 5 and pass 6, so the
     accumulated signals that fed pass 5 have been drained. No new
     structural gap has emerged; the build plan is in a clean
     re-exhausted state. Bumping metadata; awaiting the next pass'
     cadence window for fresh signals to accumulate. -->

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

### 12. Brand-spelling discipline (lax→strict invariant for `tiered.tv` wordmark)

**Score:** 6.6 (impact: 6, ease: 6, +2 multi, +1 cheap-and-impactful)
**Source pass:** 16
**Filed:** 2026-06-01
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 44 - Brand-spelling discipline (lax-to-strict BRAND_SPELLING_STRICT invariant) (`01_build_plan.md`)
**Source signals:**
- Critique (signal B) — **two pass-24 findings of the same class**
  on customer-facing surfaces, both explicitly invoking CLAUDE.md
  hard rule 6 ("The brand name is `tiered.tv` — always lowercase,
  including the `.tv` suffix. Never capitalize the T. The dot is
  part of the wordmark; never stylize, color, or kern it apart").
  (a) **MED** [anon] `/sign-in` page `<meta name="description">`
  reads `Sign in to tiered.` — the brand has been truncated to
  `tiered.`, dropping the `.tv` suffix while leaving the
  wordmark's dot stranded as a sentence-ending fullstop. Source:
  `src/app/(default)/sign-in/page.tsx:12`. The finding itself
  proposes the invariant: "extend the existing
  `scripts/content-check.ts` brand-spelling check (if any;
  otherwise add one) that scans every `description` string
  returned from a `buildMetadata` call across the route tree and
  rejects any value matching `\btiered\.\s*(?!tv)`". (b) **LOW**
  [authed] `/themes/[theme]` `Suggest an entry` mailto targets
  `editors@tiered.app` — the internal auth-tenant TLD bleeding
  into customer-facing copy. Source:
  `src/components/lists/ListDetailTools.tsx:71`. The finding
  proposes: "a new content-check invariant scanning all
  user-facing mailto / href attributes for `tiered\.app` and
  flagging any match outside the auth-tenant infrastructure
  paths (Auth0 permissions claim, e2e test user, api audience)".
- Source confirmation (signal A) — verified the violations exist
  *and* a third instance the critique walks didn't surface:
  (i) `src/app/(default)/sign-in/page.tsx:12` →
  `'Sign in to tiered. Magic link by email.'`;
  (ii) `src/components/lists/ListDetailTools.tsx:71` →
  `\`mailto:editors@tiered.app?subject=...\``;
  (iii) `src/app/(default)/mod/page.tsx:19` →
  `'Moderation queue for tiered (mod role only).'` — same
  truncation class as (i), this one without the stranded dot
  (CLAUDE.md rule 6 covers both: the bare `tiered` token without
  `.tv` is the brand truncated, period or no period); the route
  is `noIndex: true` like `/sign-in` but the description still
  ships in the rendered head and falls back as OG description on
  preview crawlers per the same reasoning the critique pass-24
  row already worked through. Three distinct customer-facing
  surfaces, two classes (truncation + wrong-TLD bleed), zero
  current automated enforcement.
- Standing-rule alignment — CLAUDE.md hard rule 6 is one of five
  "never break" rules in the project's primary entry-point
  document ("Honor this file before improvising"). The rule is
  enforced *reactively* today: every brand-spelling violation
  has to be caught by a critique pass and drained by an iterate
  tick. There is no proactive verify-time gate.
- Prior art (signal A) — **Phases 41, 42, 43 are the proofs.**
  Each was promoted on the identical argument: a standing rule
  enforced reactively, drained per-tick, gated structurally only
  after a phase shifted enforcement left into `pnpm verify`. The
  exact pattern (lax→strict invariant in `scripts/content-check.ts`
  with a `STRICT` flag flipped on the final drain tick) is now
  used by 7 other invariants: `STRICT` (canon coverage),
  `CROSS_SHOW_STRICT` (themed-list cross-show floor),
  `YEAR_TENURE_STRICT` (year/tenure derivation, with
  `TENURE_ANCHOR_ALLOWLIST` for milestone callouts),
  `TAGLINE_TAIL_STRICT`, `THEME_COUNT_TAIL_STRICT`,
  `THEMED_ENTRY_SPOILER_STRICT`, `WATCH_ORDER_CLASSIFICATION_STRICT`
  (`scripts/content-check.ts:682-780`). A `BRAND_SPELLING_STRICT`
  alongside these is a clean extension of an established,
  well-tested pattern.

**Why:** CLAUDE.md hard rule 6 is one of the project's five
non-negotiable identity rules — and the only one that ships
*without* a verify-time gate, with three customer-facing surfaces
currently violating it (two `tiered.` truncations and one
`tiered.app` TLD bleed). The reactive cost is measured: the
pass-24 critique surfaced (a) and (b), `/mod` (iii) only
surfaced under this expand pass's targeted sweep, and there is
no machinery to catch the *next* drift before the next critique
window. The honest fix is the phase-43 move applied to the
brand wordmark: a lax→strict invariant in
`scripts/content-check.ts` that scans (1) every rendered
`description` literal returned from `buildMetadata` callers
across the route tree for `\btiered\b` not immediately followed
by `\.tv\b`, (2) every customer-facing `mailto:` / `href`
literal in `src/components/**` and `src/app/**` for
`@tiered\.app` or `tiered\.app` outside an explicit
infrastructure allowlist (Auth0 permissions claim `permissions.ts`,
e2e test-user mailbox in test fixtures, api audience constants),
(3) every editorial copy literal in `content/**/*.md` for the
same patterns. Allowlist mechanism mirrors phase 43's
`TENURE_ANCHOR_ALLOWLIST` precedent (`scripts/content-check.ts`)
for legitimate uses of the bare english word `tiered` as a
past-participle verb — e.g. `src/components/shows/ShowsHero.tsx:18`
`<em>Tiered.</em>` ("All shows. Tiered.") is editorial wordplay
on the english adjective; whether it stays as-is, gets
lowercased to `<em>tiered.</em>` to honor the wordmark, or gets
recast entirely is a curator call surfaced *by* the lax-mode
sweep, not pre-decided in the phase brief. Ships strict on the
final drain tick, matching the phase 41/43 cadence. Closes the
class permanently; the verify gate then catches any future
authoring drift the moment it lands instead of the next
critique window.

**Scope sketch:**
- Add `collectBrandSpellingIssues` helper to
  `scripts/content-check.ts` (or a new
  `scripts/lib/check-brand-spelling.mjs` library + colocated test
  per the phase-42 lib-pattern). Scans three surface families:
  - rendered metadata `description` literals from `buildMetadata`
    callers (mirrors phase 43's `collectYearTenureIssues` shape —
    walks `src/app/**` for `buildMetadata({ ... description: ...
    })` call sites and validates the string);
  - customer-facing href / mailto literals in `src/components/**`
    and `src/app/**` (excluding test files, the existing Auth0
    permissions infrastructure path, and an explicit
    `BRAND_DOMAIN_INFRA_ALLOWLIST`);
  - editorial copy literals in `content/**/*.md` (excluding
    intentional uses surfaced by the lax-mode drain and
    documented in an editorial allowlist).
- Add `BRAND_SPELLING_STRICT` constant (`= false` on the first
  tick that lands the helper, paired with a 3-violation drain
  across `/sign-in`, `/mod`, and the mailto on the same tick;
  flip to `= true` on the final tick or the immediately following
  tick once the surface is clean and the allowlist nuance for
  `ShowsHero.tsx`'s `<em>Tiered.</em>` is editorially resolved —
  exact lax→strict cadence as phase 43).
- Allowlist scaffolding: `BRAND_DOMAIN_INFRA_ALLOWLIST` (paths
  where `tiered.app` is the auth-tenant identifier and is
  correct: `src/lib/auth0/permissions.ts`,
  `src/lib/auth0/__tests__/permissions.test.ts`,
  `src/app/api/mod/action/__tests__/route.test.ts`,
  `src/app/(default)/mod/__tests__/page.test.tsx`,
  `scripts/mint-e2e-cookie.mjs`, the bearings line that documents
  the e2e@tiered.app user, the `audience: https://api.tiered.app`
  Auth0 audience constant). `BRAND_ADJECTIVE_ALLOWLIST` for
  editorial-intentional capital-T uses if any survive the curator
  pass (default empty; populated only on explicit curator
  decision).
- Concrete drain order (priority queue, single-tick targets):
  1. `/sign-in` description → `Sign in to tiered.tv. Magic link
     by email.` (closes pass-24 MED, source-resolution in test +
     production).
  2. `/mod` description → `Moderation queue for tiered.tv (mod
     role only).` (closes the third sibling violation).
  3. `ListDetailTools.tsx` mailto → `editors@tiered.tv` (closes
     pass-24 LOW; sister test in `ListDetailHero.test.tsx`
     updated in lockstep; tests at
     `ListDetailTools.test.tsx:59` + `ListDetailHero.test.tsx:80`
     swap from `mailto:editors@tiered\.app` to
     `mailto:editors@tiered\.tv`; operator question: whether an
     `editors@tiered.tv` forwarder needs to be set up before the
     code edit ships — the existing inbox lives at
     `editors@tiered.app`; if not, the fix has a 2-tick shape
     [code edit + operational forwarder]; if so, single tick).
  4. `ShowsHero.tsx` `<em>Tiered.</em>` editorial decision (curator
     call: lowercase the wordmark to `<em>tiered.</em>` for
     identity consistency, OR recast the H1 to a non-wordmark
     fragment that doesn't echo the brand, OR allowlist the
     english-adjective use; document in commit body whichever
     direction is taken).
- Pin: colocated test of `collectBrandSpellingIssues` exercises
  each shape — positive (clean surface), negative (each violation
  class), allowlist match (auth-tenant infra path, editorial
  adjective if allowed). Integration test: `pnpm content:check`
  catches a fresh violation seeded in a fixture surface and
  fails. e2e: no new spec owed — the verify gate is the
  enforcement layer; no URL behavior change.
- Follow-up housekeeping: the operational forwarder
  (`editors@tiered.tv`) is the one external dependency outside
  the verify gate's reach. The phase brief flags it for the
  user's call at promotion time; the code change can land before
  the forwarder if the editorial team is willing to redirect on
  receipt or use a redirect rule, or after if a cleaner inbox
  swap is preferred. Either way, the gate is the persistent
  artifact.

**Estimated phases:** 1.
**Conflicts:** none. Hardens an existing CLAUDE.md hard rule
across the surface families that currently bleed it; no URL
change, no schema change; the operational forwarder setup is the
only external dependency, flagged for the user at promotion.
Directly extends Phase 41/42/43's lax→strict invariant precedent
established in `scripts/content-check.ts`.

### 13. Editorial-cliché repetition guard (cross-corpus phrase-frequency invariant)

**Score:** 6.0 (impact: 5, ease: 6, +2 multi, +1 cheap-and-impactful)
**Source pass:** 17
**Filed:** 2026-06-02
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 45 - Editorial-cliche repetition guard (CLICHE_REPETITION_STRICT invariant) (`01_build_plan.md`)
**Source signals:**
- Critique (signal B) — **pass-25 MED finding** (`plan/CRITIQUE.md:416`)
  catalogues `measures? itself against` / `measured against` as
  the fallback canonical-claim closer across **10+ surfaces in
  the content corpus**, reaching **4 in a single anon walk**
  (home → /shows/survivor → /shows/survivor/season/heroes-vs-villains
  → /themes/best-finales), with two of those four landing on the
  *same page* (HvV pull-quote `content/shows/survivor/seasons/20-heroes-vs-villains.md:14`
  AND HvV body closer `:43`). Other surfaces enumerated by the
  finding: `content/shows/survivor/canon.md:53` slot #02 tag,
  `content/themes/best-finales.md:26` entry #02,
  `content/themes/best-returnees.md:20` entry #01,
  `content/themes/best-post-merge.md:21` entry #01,
  `content/themes/best-villain-editing.md:21` entry blurb,
  `content/shows/amazing-race.md:11` tagline,
  `content/shows/top-chef.md:11` tagline,
  `content/shows/big-brother/canon.md:11` tier-S blurb + `:109`
  entry body, `content/shows/project-runway/seasons/04-new-york-2007.md:12`
  pull. **The finding itself proposes the invariant** verbatim:
  "extend `scripts/content-check.ts` with a
  `collectClicheRepetitionIssues` pass that counts cross-surface
  occurrences of high-leverage editorial phrases (`measures?
  itself against`, `measured against`, candidates for future
  additions like `set the bar`, `the bar every`) and flags
  >3-occurrence drift — the same guard pattern
  `collectYearTenureIssues` uses for `est_year` math, but for
  phrase-reuse."
- Standing-rule alignment — `plan/bearings.md` voice rule
  ("knowledgeable peer — confident, warm, plain-spoken, never
  pretentious. Plain sentences over clever ones.") + CLAUDE.md
  "Tone of voice" section ("knowledgeable peer. Confident, warm,
  plain-spoken"). A clever fragment that lands the first time is
  earned; the same fragment reused 10+ times is the editor's tic.
  Pass-25 is the second walk to catch a cross-surface clever-tic
  repetition (pass-19/20/22 caught **recompute** on the community
  pane, drained reactively as the candidate-#12-class
  BRAND_SPELLING precedent). No proactive verify-time gate
  exists for cross-surface phrase-frequency drift today.
- Prior art (signal A) — **Phases 41, 43 + candidate #12 are the
  proofs.** Each carries the identical shape: an editorial
  standing rule enforced reactively (drained per-tick by
  critique→iterate), gated structurally only after a
  `scripts/content-check.ts` lax→strict invariant phase lands. The
  `STRICT`-flag pattern is now used by 7 invariants
  (`scripts/content-check.ts:682-780`): `STRICT` (canon coverage),
  `CROSS_SHOW_STRICT` (cross-show floor), `YEAR_TENURE_STRICT`
  (with `TENURE_ANCHOR_ALLOWLIST` for milestone exceptions),
  `TAGLINE_TAIL_STRICT`, `THEME_COUNT_TAIL_STRICT`,
  `THEMED_ENTRY_SPOILER_STRICT`, `WATCH_ORDER_CLASSIFICATION_STRICT`.
  Candidate #12 (BRAND_SPELLING_STRICT, score 6.6) is the eighth,
  already awaiting promotion. A `CLICHE_REPETITION_STRICT`
  alongside these is a clean extension of an established pattern,
  with the distinct twist that the check is *cross-surface
  frequency* rather than per-surface shape — the existing
  invariants validate one file at a time; this one aggregates
  occurrences across `content/**/*.md` and rejects when a
  registered phrase exceeds the threshold.
- Source confirmation — `rg -n "measures? itself against|measured
  against" content/` independently verifies the 10+ surface count
  the critique row claims; the registry-extensibility argument
  (`set the bar`, `the bar every`) is corroborated by a separate
  `rg -n "sets? the bar|the bar every" content/` returning
  additional pre-existing matches across show + theme corpora.

**Why:** The editorial voice rule is one of the project's
standing identity rules, and pass-25's finding measured the cost
of leaving it ungated: a single clever fragment metastasised
across 10+ surfaces and reaches a casual reader 4 times before
they've left the survivor walk. The fix has two halves: (1)
drain the 9+ extant uses down to one high-leverage retention
(recommended: HvV's pull-quote at
`content/shows/survivor/seasons/20-heroes-vs-villains.md:14`,
where the metaphor lands cleanest and the editorial weight is
highest), and (2) ship a `CLICHE_REPETITION_STRICT` invariant
with an extensible phrase registry so the *next* cross-surface
clever-tic drift fails at verify-time instead of after the next
critique window. The drain alone is an iterate-shape job; the
drain + invariant + extensible registry is honestly a phase
shape and matches the cadence + structure of phases 41/43 + the
already-pending candidate #12 exactly. Ships strict on the final
drain tick (mirrors the phase 41/43 pattern). Closes the class
permanently for any phrase the registry covers; subsequent
critique passes that surface a new clever-tic cluster (e.g. the
`set the bar` / `the bar every` candidates the finding itself
flags) add a registry row instead of authoring a new phase.

**Scope sketch:**
- Add `collectClicheRepetitionIssues` to `scripts/content-check.ts`
  (or a new `scripts/lib/check-cliche-repetition.mjs` library +
  colocated test per the phase-42 lib-pattern). Walks
  `content/**/*.md`, aggregates a per-phrase occurrence count
  across the corpus (frontmatter + body), and flags when any
  registered phrase exceeds a per-phrase threshold (default 3 —
  the bearings voice rule's "the third time it's a tic"
  threshold the pass-25 finding articulates).
- Phrase registry seeds the proven repeat-offender from pass-25
  (`measures? itself against` / `measured against`) at threshold
  3, with the pass-25-flagged future candidates (`set the bar`,
  `the bar every`) added at threshold 4 after a pre-flight `rg`
  audit confirms the current corpus is below threshold (else
  scope-creep risk — the drain budget owes those too).
- Allowlist mechanism mirrors phase 43's `TENURE_ANCHOR_ALLOWLIST`
  precedent: a per-phrase `{ phrase, threshold, allowlist:
  [<filepath>:<line>] }` registry entry lets the curator pin
  the one surface that retains the phrase (e.g. HvV pull-quote
  for `measures itself against`) without tripping the gate.
- Editorial drain (content-curator brief): rewrite the 9+ extant
  `measures itself against` surfaces with material specific to
  the work each entry does — HvV's body closer leans on the
  post-merge density it already names; Survivor canon slot #02
  tag foregrounds the casting-as-format observation;
  best-finales #02 entry names what specifically lands in the
  closing run; best-returnees #01 names the format-defining
  returnee dynamic; per-show taglines (Amazing Race, Top Chef,
  Big Brother) name the show-specific format leadership argument
  (airport-backpack rhythm, Restaurant Wars reckoning,
  alliance-as-format engine).
- Lax→strict cadence (mirrors phases 41/43/candidate #12): each
  drain tick reduces the corpus count by 1-2 phrases below
  threshold; final tick flips `CLICHE_REPETITION_STRICT = true`
  in `scripts/content-check.ts` and adds the strict-mode
  invariant assertion to `pnpm content:check`.
- Unit tests: colocated tests for the helper validate the
  threshold-counting + allowlist exclusion + multi-phrase
  aggregation; bonus regression-pin tests assert specific
  current corpus counts (e.g. `measures itself against` count
  after drain is exactly N) so a future re-introduction fails
  at unit time.
- No URL change. No schema change. No e2e fixture row owed (no
  e2e pins any of the to-be-rewritten phrases). Spoiler P0
  intact (voice/editorial edits only, no canon position or
  verdict changes).

**Estimated phases:** 1.
**Conflicts:** none. Hardens the editorial voice rule across its
last uncovered surface (cross-corpus phrase-frequency), no URL
change, no schema change. Directly extends Phase 41/43 +
candidate #12's lax→strict invariant precedent established in
`scripts/content-check.ts`, with the distinct twist that the
check aggregates across files instead of validating one file at
a time.

### 11. Extend the colocated-test coverage gate to `src/app/**`

**Score:** 5.5 (impact: 5, ease: 5, +2 multi, +1 cheap-and-impactful)
**Source pass:** 12
**Filed:** 2026-05-29
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 46 - Colocated-test coverage gate extended to src/app/** (`01_build_plan.md`)
**Source signals:**
- Commit pattern (signal G) — an **~11-commit reactive
  `/iterate` drain** of `src/app/**` colocated tests since the
  phase-42 gate landed: #210 (`/mod`), #211 (root `layout.tsx`),
  #212 (`shows/[show]/layout.tsx`), #218 (`shows/[show]`), #219
  (`season/[slug]`), #220 (`themes/[theme]`), #221
  (`(default)/layout.tsx`), #222 (`privacy`), #223 (`terms`),
  #224 (`not-found.tsx`) — plus the earlier #180/#193/#206 and
  the #131–#179 route-handler/OG/sitemap/robots batch. Each is a
  `test: colocate <X>` commit paired with an `audit:` row.
- Audit (signal A) — **every one of those AUDIT rows names the
  gap in the same words**: "The phase-42 colocated-coverage gate
  (`scripts/check-test-colocation.mjs`) walks `src/components/**`,
  `src/lib/**`, `src/content/**` but **not** `src/app/**`, so
  app-route files are drained reactively by `/iterate`."
- Source confirmation — `scripts/check-test-colocation.mjs:24`
  literally reads `const ROOTS = ['src/components', 'src/lib',
  'src/content']`; `src/app` is absent.
- Prior art — **Phase 42 is the proof.** It was promoted
  (`PHASE_CANDIDATES` #10, score 5.5) on the *identical*
  argument: a 16-commit reactive drain (#105–#120) of
  `src/components/**`/`src/lib/**` files shipping untested,
  fixed by shifting §5a enforcement left into `pnpm verify`.
  Phase 42 deliberately stopped at the `src/app` boundary; the
  loop has since spent ~11 ticks reactively draining exactly
  that boundary. As of this pass the tree is drained to **one
  remaining file** (`src/app/internal/rank-shift-demo/page.tsx`,
  a build-flag-gated demo) — the same "drained to completion but
  no gate guards the regression" state `src/components/**` was in
  when Phase 42 shipped.

**Why:** §5a ("every commit ships unit tests") is a
non-negotiable standing rule, and the highest-traffic route tree
on the site (`src/app/**` — every page, layout, and route
handler) is the one tree the existing verify-time gate does not
guard. The cost of leaving it ungated is now measured: an
~11-tick reactive drain that re-opens the moment the next
untested page/layout/route lands. The honest fix is the Phase 42
move applied to one more tree: add `'src/app'` to the gate's
`ROOTS`, allowlist the genuinely-untestable shapes, and let
verify fail the instant an app-route module ships without a
colocated test — instead of `/iterate` catching it ticks later
and burning a polish tick per file. The drain already authored
precedent tests for every app-route file shape (page, dynamic
`[segment]` page, redirect-page, `route.ts` handler,
`opengraph-image.tsx`, `sitemap.ts`/`robots.ts`, `layout.tsx`,
`not-found.tsx`), so the gate flip is unlikely to surface new
stragglers beyond the one demo to allowlist.

**Scope sketch:**
- Add `'src/app'` to `ROOTS` in
  `scripts/check-test-colocation.mjs` (+ its pure-logic library
  in `scripts/lib/`); keep the reference-check (the colocated
  test must import the target module, not merely share a name).
- Allowlist `src/app/internal/rank-shift-demo/page.tsx` (the
  build-flag-gated internal demo that never ships to prod), plus
  any App Router file types that genuinely carry no testable
  logic (verify against the real tree at pickup — the drain
  suggests there are none beyond the demo).
- Extend the gate's own colocated tests: an `src/app` page
  passes when colocated, fails when testless, fails on
  filename-match-but-wrong-target (the #120 false-negative
  class).
- Follow-up housekeeping: #148 (the still-open `needs-user` issue
  to wire `pnpm check:test-colocation` into `march.yml` call-1)
  becomes more load-bearing once the gate covers `src/app` —
  flag it in the brief but it stays a separate local-`/oversight`
  push (cloud GitHub App lacks the `workflows` scope).

**Estimated phases:** 1.
**Conflicts:** none. Hardens an existing non-negotiable standing
rule across its last uncovered tree; no URL change, no schema
change. Directly extends Phase 42's precedent.

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

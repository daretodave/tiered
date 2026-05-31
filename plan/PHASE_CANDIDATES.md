# PHASE_CANDIDATES

> `/expand` reads accumulated signals (audit findings, critique
> findings, GH issues, spec drift, design landings, data
> growth) and proposes new phase candidates here. `/oversight`
> reviews and promotes them to `plan/steps/01_build_plan.md`.
>
> Posture: **bold** (per `plan/bearings.md`). `/expand` runs
> at standard cadence and files candidates here. `/oversight`
> is the only path to promote.

> Last pass: 2026-05-31 at commit b69a2b2
> Pass count: 15

## Considered (awaiting promotion)

<!-- Format:
### <NN>. <Phase title>
**Score:** N.N (impact: N, ease: N)
**Source pass:** <expand pass number>
**Filed:** <ISO date>
**Why:** <one-paragraph rationale>
**Scope sketch:** <2-3 lines of what would ship>
-->

### 11. Extend the colocated-test coverage gate to `src/app/**`

**Score:** 5.5 (impact: 5, ease: 5, +2 multi, +1 cheap-and-impactful)
**Source pass:** 12
**Filed:** 2026-05-29
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

# PHASE_CANDIDATES

> `/expand` reads accumulated signals (audit findings, critique
> findings, GH issues, spec drift, design landings, data
> growth) and proposes new phase candidates here. `/oversight`
> reviews and promotes them to `plan/steps/01_build_plan.md`.
>
> Posture: **bold** (per `plan/bearings.md`). `/expand` runs
> at standard cadence and files candidates here. `/oversight`
> is the only path to promote.

> Last pass: 2026-07-12 at commit 426ec40
> Pass count: 55

## Considered (awaiting promotion)

<!-- Format:
### <NN>. <Phase title>
**Score:** N.N (impact: N, ease: N)
**Source pass:** <expand pass number>
**Filed:** <ISO date>
**Why:** <one-paragraph rationale>
**Scope sketch:** <2-3 lines of what would ship>
-->

<!-- Pass 55 (2026-07-12, commit 426ec40) — 0 new phase-shape candidates filed;
     dispatched directly into plan/AUDIT.md instead per bearings Rule 1 (same move
     passes 43/45/46/51/54 made — filed WAVE 11, see candidate #24's update below),
     no new numbered candidate this pass.
     Window since pass 54 (e40486c, 2026-07-11): ~12.5 hours / 20 commits. Commit
     threshold met (20 ≥ 20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — wave 10 (5 shows, filed
       pass 54) fully drained within a day of filing (Traitors UK, MAFS Australia,
       Real World, Ink Master, So You Think You Can Dance all resolved [x]), the
       exact recurring stall candidate #24 names, again caught structurally by
       march's own Step 3b.5 finding the queue empty and falling through to this
       expand dispatch. Filed WAVE 11 (5 shows: Big Brother UK, RuPaul's Drag Race
       Down Under, Love Island Australia, The Real Housewives: Ultimate Girls Trip,
       Selling the OC — all international-edition/spinoff extensions of existing
       clusters, since WAVE 10 closed the catalog's remaining format-diversity gaps).
       All scored ≥3.0 so the next march tick's Step 3b.5 has real work. Candidate
       #24 reinforced (fifth consecutive empty-queue occurrence, see update above).
     - AUDIT.md other Pending rows: still exactly 2 real rows plus the recurring
       HIGH — the e2e-full crawl timeout row (candidate #26) recurred a fourth time
       this window (2026-07-11T23:19:19Z, run 29171935246, per the 2026-07-12
       digest), now 5 days unpromoted across four red nights; the dedupe
       staleness-bound row (candidate #32, filed 2026-07-11) remains unchanged,
       1 day unpromoted. The Supabase CLI pin (issue #416) and the
       `YEAR_TENURE_RE` engineering row (score 2.7) are both unchanged, no new
       signal. Neither #26 nor #32 gets a body edit this pass — both are already
       fully described with their latest evidence directly in the AUDIT.md HIGH
       row and the digest's 2026-07-12 recommendation to promote both (plus the
       Supabase pin) at the next local/oversight session stands unchanged; nothing
       for `/expand` itself to add beyond what's already on record.
     - CRITIQUE.md: 23 live Pending findings, pass-92 (5 findings: 3 MED, 2 LOW)
       landed since pass 54's pass-91. No new HIGH findings, no new 3+ clustering
       on one URL/family beyond what existing candidates already cover: pass-92's
       Ink Master season-title stutter finding is the same defect class as the
       pass-73-fixed numeral-form stutter (spelled-out-ordinal variant, single
       instance) — below the 3-instance clustering bar, left for `/iterate`/
       `/ship-content` drains. The SYTYCD tenure-overshoot finding and the
       cross-show canon-rationale templated-phrasing finding are similarly
       single-cluster, contained fixes — no new candidate warranted.
     - GitHub issues: 0 unlabeled this tick (triage gate clean). No new issue
       activity beyond what candidates #26/#32/#416 already track.
     - spec.md + design/: no changes since pass 54 (`git log e40486c..HEAD --
       spec.md design/` empty).
     - Commit pattern: 20 commits since pass 54 — content-drain velocity (5 new
       shows scaffolded, several audit-finding-close content fixes), one critique
       pass (92), one digest. Matches the standing perpetual-mandate cadence — no
       refactor-smell cluster, no new signal warranting a fresh numbered candidate
       this pass.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#25/#26/
     #28/#29/#30/#32 — all unchanged, no new reinforcing or disqualifying signal
     this pass beyond the AUDIT.md-recorded #26 recurrence noted above. #24 —
     reinforced (fifth consecutive empty-queue occurrence, see update above). -->

<!-- Pass 54 (2026-07-11, commit e40486c) — 0 new phase-shape candidates filed;
     dispatched directly into plan/AUDIT.md instead per bearings Rule 1 (same move
     passes 43/45/46/51 made), plus reinforced existing candidate #24.
     Window since pass 53 (c50bf0a, same day): ~4.5 hours / 7 commits. Commit
     threshold (≥20) not met, and last-pass timestamp is under 24h — this pass
     ran because march's own dispatch chain (Step 1 triage clean, Step 2 critique
     gate not due, Step 3a/3b/3b.5 all empty) fell through to Step 3c, whose own
     conditions independently qualify: posture bold, ≥20-commits-OR-signal-present
     is satisfied via the "signal worth examining" clause (AUDIT.md has 2 Pending
     rows) plus this being a genuinely idle dispatch slot with no phase/data/
     content-gap work queued.
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — wave 9 (5 shows, filed
       pass 51) fully drained this week (rhodubai, summer-house,
       bachelor-in-paradise, dragrace-allstars, chopped all resolved [x]), the
       exact recurring stall candidate #24 names, now caught structurally by
       march's own Step 3b.5 finding the queue empty and falling through to
       this expand dispatch — see candidate #24's reinforcement below. Filed
       WAVE 10 (5 shows: The Traitors UK — original edition of the catalogued
       US `traitors` flavor; Married at First Sight Australia — higher-profile
       international edition of the catalogued `married-at-first-sight` US
       flavor; The Real World — genre-founding MTV docusoap, no founding-era
       title currently represented; Ink Master — tattoo-competition format, no
       body-art competition cluster yet; So You Think You Can Dance —
       contestant-pro dance competition, no dance-competition format alongside
       the catalogued Dancing with the Stars). All scored ≥3.0 so the next
       march tick's Step 3b.5 has real work.
     - AUDIT.md other Pending rows: still exactly 2 — e2e-full crawl timeout
       (candidate #26) and Supabase CLI version pin (issue #416), both
       unchanged and explicitly BLOCKED FROM CLOUD. The `YEAR_TENURE_RE`
       engineering row (score 2.7) also unchanged, still single-source and
       below the phase-candidate filing bar.
     - CRITIQUE.md: 16 live Pending findings (14 LOW, 1 MED, down from pass
       53's 17), pass-90 (1 finding, already closed same-tick) landed since
       pass 53's pass-89. No new HIGH findings, no new 3+ clustering on one
       URL/family beyond what existing candidates already cover: the
       below-deck era-band-range finding (pass-56) reinforces the same class
       as the pending pass-53 Alone finding, both already fully inside
       candidate #14's scope per prior-pass notes — no new filing. The
       /shows B-tier filter finding (pass-77) is already candidate #30's
       exact scope — no new filing. The best-finales cross-entry `final
       tribal` echo (pass-36) and the masterchef tier-blurb template overlap
       (pass-71) are each single-instance content nits below the 3-instance
       clustering bar — left for `/iterate`/`/ship-content` drains.
     - GitHub issues: 0 unlabeled (triage gate clean). #521 (signed-in CTA
       flash, HIGH, still open) and #480/#416 (cloud-permission-blocked,
       unchanged) carry no new clustering signal. #398/#399/#405/#400 are
       stale loop-opened issues from mid-June with no new activity — not a
       fresh signal, already the exact pattern candidate #32 names.
     - spec.md + design/: no changes since pass 53 (`git log c50bf0a..HEAD --
       spec.md design/` empty).
     - Commit pattern: 7 commits since pass 53 — 3 audit-finding-close content
       fixes (tagline echo, cast-cast word-tic repetition, timestamp refresh
       across 9 canon files) each paired with its audit-closure commit, plus
       critique pass 90 itself. Pure content-drain + critique-response
       velocity, matching the standing perpetual-mandate cadence — no
       refactor-smell cluster, no new signal warranting a fresh numbered
       candidate this pass.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#25/#26/
     #28/#29/#30/#32 — all unchanged, no new reinforcing or disqualifying
     signal this pass. #24 — reinforced (fourth consecutive empty-queue
     occurrence, see update above). -->

<!-- Pass 52 (2026-07-11, commit 15f80fb) — 2 new phase-shape candidates filed
     (#30, #31), plus reinforced existing candidate #29.
     Window since pass 51 (f0b101e, 2026-07-10): ~12 hours / 21 commits. Commit
     threshold met (21 ≥ 20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — WAVE 9 (5 shows, filed
       pass 51) fully drained same-window (chopped, rupauls-drag-race-all-stars,
       bachelor-in-paradise, summer-house, real-housewives-of-dubai all resolved
       [x]). Same recurring empty-queue pattern candidate #24 already names; left
       for the next march tick's Step 3b.5 to refill per Rule 1.
     - AUDIT.md other Pending rows: e2e-full crawl timeout (candidate #26) and
       Supabase CLI version pin (issue #416) both remain explicitly BLOCKED FROM
       CLOUD, unchanged. New row this window: `YEAR_TENURE_RE` teen-number gap
       (engineering, score 2.7, filed 2026-07-08) — single-source, below the
       3.0 iterate threshold, scope already self-described as a contained
       one-tick fix rather than a phase-shape gap. Not filed as a candidate;
       left for a future `/iterate` tick with headroom, or a direct oversight
       pick.
     - CRITIQUE.md: 21 live Pending findings (mostly LOW, 2 MED), pass-87 (3
       findings) landed since pass 51's pass-86. Two fresh signals cleared the
       filing bar:
       (1) pass-87 [MED] `/shows/the-apprentice` (and `/shows/survivor`) TTFB
       runs 3-6x slower than every other page walked, correlating with canon
       size, not show identity — `dynamic = 'force-dynamic'` (phase-35, kept
       intentionally for ranking freshness) means the per-request assembly cost
       scales with season count. Filed as new candidate #31. Cross-references
       candidate #26 (e2e-full crawl timeout) — different subsystems (render
       latency vs. CI wall-clock) but the same underlying stressor: catalog
       growth (58 shows / 717 seasons and climbing per Rule 1's perpetual
       mandate) outpacing infrastructure sized for an earlier catalog size.
       (2) pass-77 [LOW] `/shows` B-tier holds 39 shows in one flat scroll with
       no filter/sort beyond global search — still Pending, unaddressed across
       10 passes since filing. The catalog has grown past 39 in the B tier
       alone since pass-77 filed this (58 shows total now). Every show page
       already has an era-filter affordance (phase 33/34) for browsing within
       a show; the top-level index has no equivalent for browsing across shows.
       `network`/`genre_tag` frontmatter already exists per CLAUDE.md's show-
       identity table — no new content fields needed. Filed as new candidate
       #30.
       Era-range chip findings (below-deck LEE/TITHERADGE ERA, row 2798) remain
       fully inside candidate #14's existing scope — no new filing, cited as
       reinforcement in #14 by a prior pass already.
       Remaining LOW findings (stat-tile caption phrasing, sentence fragments,
       hyphenation drift, era-band explanatory text) are one-off content
       nitpicks below the phase-shape bar — left for `/iterate`/`/ship-content`
       drains.
     - GitHub issues: 0 unlabeled this tick (triage gate clean). #416/#480 both
       unchanged, no new clustering signal.
     - spec.md + design/: no changes since pass 51 (`git log f0b101e..HEAD --
       spec.md design/` empty).
     - Commit pattern: 21 commits since pass 51 — 5 new-show scaffolds (chopped,
       rupauls-drag-race-all-stars, bachelor-in-paradise, summer-house,
       real-housewives-of-dubai) each paired with an audit content-gap close,
       2 critique passes (86, 87), 4 audit-finding content fixes (host bare-
       surname, era-range clarity, filming_caption, B-tier pill a11y label),
       1 digest. Pure content-drain + critique-response velocity, matching the
       standing perpetual-mandate cadence — no refactor-smell cluster.
     - File-size check (candidate #29's own signal): `plan/CRITIQUE.md` now
       3,201 lines / 1.5MB (was 3,096 at pass-51's digest reading, +105 lines
       in ~1 day — growth continues unabated). `plan/PHASE_CANDIDATES.md`
       itself has now grown to 4,106 lines / 248KB — larger than `AUDIT.md`
       (523 lines / 392KB) and approaching the same class of problem #29
       already names for CRITIQUE.md. Reinforced below with a scope-widening
       note.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24/#25/
     #26/#27/#28 — all unchanged, no new reinforcing or disqualifying signal
     this pass. #29 — reinforced (continued CRITIQUE.md growth + new
     PHASE_CANDIDATES.md self-growth signal). #30/#31 — new this pass. -->

<!-- Digest 2026-07-11 (commit 3b8709b) — 1 new tuning proposal filed (#32) per
     skills/digest.md §5, reading the pulse since digest 2026-07-10 (fbd7806).
     e2e-full's HIGH AUDIT row (candidate #26's evidence base) recurred a third
     consecutive night (2026-07-06, 2026-07-09, 2026-07-10 — run 29130142942),
     and the same tick window's 2026-07-10T18:13Z cloud march crash (run
     29113747919) was silently absorbed by its own workflow's title-dedupe
     search into a month-old stale issue (#398, open since 2026-06-11,
     untouched). That confirms the title-dedupe blind spot the pass-51 digest
     first flagged on #416 is not e2e-full-specific — it recurs on any
     workflow whose failure-issue dedupe search lacks a staleness bound. Filed
     as its own candidate rather than folded into #26 since the fix (bound the
     dedupe search's `state:open` to a recency window) is orthogonal to #26's
     timeout-bump fix, even though both land in workflow YAML blocked by the
     same `workflows`-OAuth-scope cloud gap. -->

<!-- Pass 53 (2026-07-11, commit c50bf0a) — 0 new candidates filed; 2 existing
     candidates materially updated instead.
     Window since pass 52 (03625c7, same day): ~4 hours / 20 commits. Commit
     threshold met (20 >= 20) — cadence gate holds even within one calendar
     day since pass 52 already burned its 48h alternative path.
     Signals reviewed:
     - Candidate #31 (large-canon TTFB) — RESOLVED this window, directly, not
       via phase promotion. Commit 75108d4 ("perf: parallelize community-
       ranking Supabase reads", closes #541, audit finding
       `the-apprentice-ttfb`) confirmed the candidate's own working theory
       (four sequential Supabase awaits in `getCommunityRanking`) and fixed
       it with `Promise.all`, `force-dynamic` freshness intact. Struck
       through per #17/#27 precedent; zero open signal remains.
     - Candidate #16 (/u/[handle] stat-chip scaffold) — conflict correction,
       not new filing. Re-reading its scope sketch against a still-Pending
       CRITIQUE pass-37 `[needs-user-call]` row on the same URL (`/u/e2e`)
       surfaced that the candidate's zeroed-chip framing directly reopens
       CRITIQUE pass-28 #293's deliberate removal of that exact pattern
       (`ProfileEmpty.tsx:28-36` + a pinned regression test at
       `ProfileEmpty.test.tsx:178`). Was filed with "Conflicts: None" — now
       corrected with the citation and a scope narrowing (non-empty case
       only) so `/oversight` doesn't promote a candidate that silently
       relitigates an already-closed editorial call.
     - AUDIT.md: still 2 real Pending rows (e2e-full timeout, Supabase CLI
       pin), both unchanged and explicitly BLOCKED FROM CLOUD — same as pass
       52. The `YEAR_TENURE_RE` engineering row (score 2.7) also unchanged,
       still single-source and below the phase-candidate filing bar. Four
       AUDIT rows closed this window (americas-next-top-model overlap,
       below-deck-down-under fragment, the-circle canon-rationale
       restatement, the-circle vote-question) — all one-tick content/code
       fixes, not phase-shape gaps.
     - CRITIQUE.md: pass 88 landed this window (2 MED findings, both closed
       same-tick via direct fixes — see AUDIT rows above). Pending count
       dropped 21 → 17 (mostly LOW, 1 MED). No new HIGH findings, no new
       3+ clustering on one URL/family; the one [MED][needs-user-call] row
       (pass-37, `/u/e2e`) is pre-existing and already folded into the
       candidate #16 correction above rather than filed as its own row.
     - GitHub issues: 0 unlabeled (triage gate clean). Noted but not filed:
       issue #521 ("Signed-in vote/comment CTAs flash anon...") sits open
       and unclosed even though its near-duplicate #522 (same underlying
       auth-state-flash bug, same critique pass-84 origin) closed via the
       fix pass 88 re-verified. Single stale-duplicate instance — doesn't
       clear the "2+ independent signals" filing bar on its own, and closing
       a duplicate issue is a mechanical `/iterate`-scale action, not a
       phase-shape gap. Left as a note for a future tick to close #521
       directly with a reference to #522's fix commit.
     - spec.md + design/: no changes since pass 52 (`git log 15f80fb..HEAD --
       spec.md design/` empty).
     - Commit pattern: 20 commits since pass 52 — mostly content-fix pairs
       (audit finding + its content/code close), 1 perf fix, 1 critique
       pass, 1 digest. No refactor-smell cluster; matches the standing
       content-drain + critique-response cadence.
     Existing candidates status: #14/#15/#18/#19/#20/#21/#22/#23/#24/#25/
     #26/#28/#29/#30/#32 — all unchanged, no new reinforcing or disqualifying
     signal this pass. #16 — conflict correction (see above). #31 —
     resolved, struck through (see above). -->

### 32. Failure-issue title-dedupe search needs a staleness bound ~~(resolved — applied via oversight 2026-07-12: 14-day `updated:>=` bound + recurrence-comment on e2e-full/march/night; heartbeat left as-is deliberately, its issues describe ongoing conditions)~~

**Score:** 5.0 (impact: 6, ease: 8 → 4.8 base + 0.2 signal multiplicity — two
independent workflows, three total incidents, but capped by the same
`workflows`-scope cloud blocker as candidates #26 and issue #416/#480)
**Source pass:** digest 2026-07-11
**Filed:** 2026-07-11
**Why:** Both `.github/workflows/e2e-full.yml` and `.github/workflows/march.yml`
dedupe their auto-filed failure issues with a bare `gh issue list --search
'in:title "<prefix>" state:open'` check — if any open issue matches the title
prefix, the workflow skips filing a new one, regardless of how old that issue
is or whether it describes the same incident. This has now silently swallowed
signal three times: the 2026-07-09 e2e-full recurrence and the 2026-07-10
e2e-full recurrence (run 29130142942) both got absorbed into stale issue #416
(filed 2026-06-14 for an unrelated Supabase-CLI transient, still open a month
later), and the 2026-07-10T18:13Z march crash (run 29113747919) got absorbed
into stale issue #398 (filed 2026-06-11, untouched since one triage comment
the same day). In all three cases the fresh incident's own run link never
reached any visible tracker — the only record is the raw workflow log, which
nobody reads unless a digest happens to go looking. The march crash self-
healed on retry this time (content kept shipping within the hour), but the
e2e-full recurrence is a real, worsening breadth-ceiling problem (candidate
#26) that has now gone three nights without its own issue thread, relying
entirely on the digest manually re-reading the AUDIT.md row to notice the
pattern.
**Scope sketch:**
- Add a recency bound to both dedupe searches — e.g. `state:open
  updated:>=<N-days-ago>` (7-14 days is a reasonable default) — so an issue
  that hasn't been touched in weeks no longer suppresses a fresh incident's
  filing.
- Alternative/complementary: instead of skipping filing entirely, post a
  comment with the new run's link onto the existing open issue when the
  dedupe search does match — preserves the "don't spam duplicate issues"
  intent while keeping every incident's evidence visible on the thread.
- Touches `.github/workflows/e2e-full.yml` and `.github/workflows/march.yml`
  (and possibly `night.yml` if it carries the same pattern — verify at
  fix-time). Same cloud-permission blocker as candidate #26 and issue
  #416/#480: the cloud loop's `ACTIONS_PAT` lacks the `workflows` OAuth scope
  to push workflow-file edits. Bundle with those two in the same local/
  `/oversight` session — three one-line-to-few-line diffs in the same file
  family, same blocker.

**Estimated phases:** 0 (workflow-config change, not a build-plan phase —
ships via `/oversight` directly, same path as candidate #26 and the Supabase
CLI pin).
**Conflicts:** none. Complements candidate #26 (same file family, same cloud
blocker, orthogonal fix — recommend landing all three permission-blocked
workflow diffs in one local session).

<!-- Pass 48 (2026-07-08, commit a9bb688) — 1 new phase-shape candidate filed (#28),
     plus reinforced existing candidate #25 and updated existing candidate #27.
     Window since pass 47 (566fc6f, 2026-07-08): ~4 hours / 20 commits. Commit
     threshold met (exactly 20 ≥ 20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — same recurring empty-queue
       pattern candidate #24 already names. Left for the next march tick's Step
       3b.5 to refill per Rule 1, consistent with pass 47's own note that the
       direct-action move is reserved for dispatch time, not expand time.
     - AUDIT.md other Pending rows: the two non-content-gaps rows (e2e-full crawl
       timeout / candidate #26; Supabase CLI version pin / issue #416) both remain
       explicitly BLOCKED FROM CLOUD, unchanged, no new signal.
     - CRITIQUE.md: 38 live Pending findings (mostly LOW, 1 MED — The Voice
       tenure/status contradiction, pass-80, unresolved as of this filing). Pass 80
       ran since pass 47 (4 findings: 0 high, 2 medium, 2 low) and its own drain
       closed 2 more instances of candidate #25's exact defect class this window
       (Perfect Match #501, The Voice #502 — both "canon.md rationale restates the
       season body's own closing argument near-verbatim," fixed as one-off content
       edits rather than through a gate). That's the third and fourth reinforcing
       instance since pass 47 alone (signal count 7 → 9 shows) — reinforced below.
       Separately, the FILMED-caption drain (issue #498, first batch shipped pass
       47-adjacent, this window shipped its 3rd through 6th and FINAL batches —
       139 total files across 22 shows, drain now complete, 0 remaining) is the
       same root-cause shape as candidate #25 (content authored without checking
       a sibling field, producing literal duplication) but on a different field
       pair (`location`/`filming_caption` vs canon-rationale/season-body) and
       shipped with **no accompanying content-check gate**, unlike the sibling
       `meth_who_p` plural-voice defect (#329/#357) which got one after its drain.
       Filed as new candidate #28 — confirmed via direct grep across the catalog
       that the other 5 stat-tile value/caption pairs (`format_summary`/
       `format_caption`, `cast_size`/`cast_size_caption`, `premiere_date`/
       `premiere_caption`, `ep_count`/`episodes_caption`, `host`/`host_caption`)
       currently carry zero literal duplicates, so a gate can ship at strict
       floor-0 immediately across all six pairs rather than needing a lax/warn
       period. clipToSeoBudget cluster (candidate #27): one of its two open
       findings (pass-79 stop-word, issue #503) was fixed directly this window
       via `trimTrailingStopWords()` (commit dd43d38) — a targeted one-line-deny-
       list fix, not the candidate's full "rank marks by boundary strength"
       rewrite. The other open finding (pass-68 em-dash-vs-comma preference,
       still Pending in CRITIQUE.md) is unresolved. Updated below — scope narrowed
       to the remaining em-dash-preference fix only, score adjusted down since
       half its evidence resolved via a direct `/iterate` patch rather than
       needing phase promotion, matching the candidate's own original hedge
       ("may ship as a same-tick fix rather than needing a numbered phase").
       "drain"-word jargon cluster still at 2 instances (ANTM, MasterChef
       Australia), unchanged, still below the 3-instance clustering bar.
     - GitHub issues: 0 unlabeled this tick (triage gate clean). #416/#480 both
       unchanged, no new clustering signal.
     - spec.md + design/: no changes since pass 47 (`git log 566fc6f..HEAD --
       spec.md design/` empty).
     - Commit pattern: 8 commits since pass 47 — 2 FILMED-caption drain batches
       (closing the 139-file drain), 1 B-tier lede voice fix, 1 villa/house
       self-contradiction fix, 1 canon-duplication fix (Perfect Match), 1
       canon-duplication fix (The Voice), 1 SEO stop-word fix, 1 critique pass
       (80), 1 digest. Pure content-drain + critique-response velocity, matching
       the standing perpetual-mandate cadence.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24/#26 — all
     unchanged, no new reinforcing or disqualifying signal this pass. #25 —
     reinforced (signal count 7 → 9 shows). #27 — updated (narrowed scope, score
     down). #28 — new this pass. -->

<!-- Pass 47 (2026-07-08, commit 566fc6f) — 1 new phase-shape candidate filed (#27),
     plus reinforced existing candidate #25.
     Window since pass 46 (51e09a9, 2026-07-07): ~13 hours / 21 commits. Commit
     threshold met (21 ≥ 20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — wave 8 (5 shows, filed pass
       46) fully drained same-day (dragrace-uk, rhod, shark-tank, the-ultimatum,
       perfect-match all resolved [x]), the same recurring empty-queue pattern
       candidate #24 already names. Not re-filing a wave 9 this pass — Rule 1's
       direct-action move is reserved for when the queue is actually empty at
       dispatch time; this expand pass ran ahead of the next march tick, so the
       queue-refill decision is left to whichever tick's Step 3b.5 finds it empty.
     - AUDIT.md other Pending rows: the two non-content-gaps rows (e2e-full crawl
       timeout / candidate #26; Supabase CLI version pin / issue #416) both remain
       explicitly BLOCKED FROM CLOUD, unchanged, no new signal.
     - CRITIQUE.md: 40 live Pending findings (mostly LOW, a handful MED), up from
       30 last pass — pass-78 (5 findings) and pass-79 (5 findings) both landed
       since. Two signals worth acting on:
       (1) Perfect Match's canon-rationale/season-body echo (pass-79) is the exact
       defect class candidate #25 already scopes — reinforced below, signal count
       6 → 7 shows, notable because this is the first instance caught on a show
       still in its first week of life, strengthening the "gate would pay for
       itself immediately" case.
       (2) Two separate LOW/MED findings on `clipToSeoBudget()` (pass-68 em-dash-
       vs-comma preference, pass-79 stop-word trailing) sit unresolved on the exact
       same 20-line function that already absorbed one earlier fix (pass 62/67).
       Filed as new candidate #27 — 3 total fix events on one function is signal
       multiplicity the same shape as #25's pattern, just on a code path instead
       of a content-authoring one.
       "drain"-word jargon cluster still at 2 instances (ANTM, MasterChef
       Australia), unchanged. Voice-rotation "we" leftover (tierLede.ts B-tier,
       pass-79) is a single remaining instance — below the 3-instance clustering
       bar, left for `/iterate` as a one-line content fix rather than filed as an
       expand candidate.
     - GitHub issues: 1 unlabeled-adjacent (#416, already tracked, cloud-blocked).
       No new clustering signal.
     - spec.md + design/: no changes since pass 46 (`git log 51e09a9..HEAD --
       spec.md design/` empty).
     - Commit pattern: 21 commits since pass 46 — dominated by 4 new-show scaffolds
       (dragrace-uk, rhod, shark-tank, the-ultimatum, perfect-match; the 5th,
       drag-race-uk, counted with the batch), 1 Shark Tank CAST SIZE fix, 1 Shark
       Tank season drain (S2-S6), 2 critique passes (78, 79) each with a paired
       drain-batch fix commit (FILMED-caption self-duplication, 29 files across
       2 batches). Pure content-drain + critique-response velocity, matching the
       standing perpetual-mandate cadence; no fix-cluster signal beyond the two
       captured above.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24/#26 — all
     unchanged, no new reinforcing or disqualifying signal this pass. #25 —
     reinforced (see above): signal count 6 → 7 shows. #27 — new this pass. -->

<!-- Pass 46 (2026-07-07, commit 51e09a9) — 0 new phase-shape candidates filed;
     dispatched directly into plan/AUDIT.md instead per bearings Rule 1 (same move
     passes 43/45 made), plus reinforced existing candidate #25.
     Window since pass 45 (d6f2372, 2026-07-06): ~14 hours / 20 commits. Commit
     threshold met (exactly 20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — wave 7 (5 shows, filed pass
       45) fully drained same-day, so the queue is empty again, the same recurring
       stall the pass 43/45 log entries and still-pending candidate #24 both name.
       Took the direct action Rule 1 mandates: filed a "NEW SHOW QUEUE — WAVE 8"
       batch of 5 Pending category: content-gaps rows straight into plan/AUDIT.md
       (RuPaul's Drag Race UK, The Real Housewives of Dallas, Shark Tank, The
       Ultimatum, Perfect Match — none previously in content/shows/), all scoring
       ≥3.0 so the next march tick's Step 3b.5 has real work to dispatch to
       /ship-content. One extends the dragrace flavor family (Drag Race UK), one
       extends the Housewives cluster (Dallas, 8th core edition) per bearings'
       "Cross-flavor list capture" guidance, three are fresh unscripted formats
       (Shark Tank, The Ultimatum, Perfect Match) not yet represented in any
       existing cluster. Candidate #24 remains pending — the process-hardening fix
       is still worth oversight's review, but the immediate content gap is closed.
     - AUDIT.md other Pending rows: the two non-content-gaps rows (e2e-full crawl
       timeout, filed as digest signal 2026-07-07 and mirrored as candidate #26;
       Supabase CLI version pin) both remain explicitly BLOCKED FROM CLOUD — need
       a `workflows`-scoped token only available to a local `/oversight` session.
       Unchanged, no new signal.
     - CRITIQUE.md: 30 live Pending findings (29 LOW, 1 MED) plus 3 findings closed
       this window (#488/#489/#490). #488 (Big Brother canon-rationale/season-body
       duplication, systemic across all 26 seasons) is the single most important
       signal this pass — it is the exact defect class candidate #25 already
       scopes, and it's the 4th-through-6th confirmed instance depending on how
       RHOSLC/MAFS (both cited inline by the #488 finding as prior fixes of the
       same class) are counted. Reinforced candidate #25 below: signal count now 6
       shows, impact bumped 7→8 because this instance proved the cost scales with
       show size (a 26-season rewrite, not a one-scene edit) rather than staying a
       flat per-instance cost — a materially stronger case for promotion than pass
       44's original 3-instance filing had. "drain"-word jargon cluster still at 2
       instances (ANTM, MasterChef Australia), unchanged, still below the
       3-instance clustering bar. Era-label-opacity cluster (candidate #14)
       unchanged. No other new clusters found scanning the remaining 29 rows.
     - GitHub issues: 0 unlabeled this tick (triage gate clean). #480 (workflows-
       permission blocker, needs-user) and #416 (Supabase CLI pin) both unchanged,
       no clustering signal beyond what candidate #26 and the AUDIT row already
       capture.
     - spec.md + design/: no changes since pass 45 (`git log d6f2372..HEAD --
       spec.md design/` empty).
     - Commit pattern: 20 commits since pass 45 — dominated by wave-7 content-drain
       pairs (RHOP, The Circle, RHOM, Too Hot to Handle, Southern Charm — 5 new
       shows, 10 commits), 1 critique pass (77, 2 findings), 3 critique-finding
       closures (#488/#489/#490), 1 auth-chrome bug fix (home hero sign-in CTA),
       1 digest. Pure drain/critique-response velocity, no fix-cluster signal
       beyond the #488 reinforcement captured above.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24/#26 — all
     unchanged, no new reinforcing or disqualifying signal this pass. #25 —
     reinforced (see above): score 6.9 → 7.7, signal count 3 → 6 shows. -->

<!-- Pass 45 (2026-07-06, commit d6f2372) — 0 new phase-shape candidates filed;
     dispatched directly into plan/AUDIT.md instead per bearings Rule 1 (same
     move pass 43 made for wave 6).
     Window since pass 44 (1067802, 2026-07-06): ~14 hours / 11 commits. Commit
     threshold (≥20) not met on its own, but the last-digest note explicitly
     flagged this exact stall risk and the show-queue trigger (≤2 Pending rows)
     independently qualifies this pass regardless of the commit-count clock.
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — wave 6 (5 shows, filed
       pass 43) fully drained same-day per the 2026-07-05 digest, so the queue
       is empty again. This is precisely the stall pattern candidate #24 (still
       awaiting oversight promotion) describes, and the digest's own "watch
       whether pass 45 refills promptly" note names this pass by number. Took
       the direct action Rule 1 mandates (as pass 43 did) rather than only
       re-filing #24's meta-fix: filed a "NEW SHOW QUEUE — WAVE 7" batch of 5
       Pending category: content-gaps rows straight into plan/AUDIT.md (Real
       Housewives of Potomac, The Circle, Real Housewives of Miami, Too Hot to
       Handle, Southern Charm — none previously in content/shows/), all
       scoring ≥3.0 so the next march tick's Step 3b.5 has real work to
       dispatch to /ship-content. Two of the five extend the existing 6-show
       Housewives cluster (RHOP, RHOM) per bearings' "Cross-flavor list
       capture" guidance; the other three (The Circle, Too Hot to Handle,
       Southern Charm) are fresh Netflix/Bravo formats not yet represented.
       Candidate #24 remains pending — the process-hardening fix (an explicit,
       un-skippable checklist line in skills/expand.md) is still worth
       oversight's review so a third stall doesn't require a digest nudge to
       catch, but the immediate content gap is closed for this cycle.
     - AUDIT.md other Pending rows: only the one non-content-gaps row (Supabase
       CLI version pin, category: bug) — explicitly marked BLOCKED FROM CLOUD
       2026-07-06 (needs a `workflows`-scoped token only available to a local
       `/oversight` session). Unchanged, no new signal.
     - CRITIQUE.md: 31 Pending rows (29 LOW, 1 MED, 1 SEV). Re-scanned for new
       clusters. The heaviest URL cluster (4 findings on
       /shows/survivor/season/heroes-vs-villains) is expected — it's the
       gold-standard reference page every critique pass walks most carefully —
       and each of the 4 is a distinct, already-scoped one-off fix (a11y
       aria-hidden count, spec-row grammar tile, duplicate-rank-token mobile
       stack, within-page hyphenation drift), not a shared root cause; none
       promotes to a phase-shape candidate. big-brother (3), the-apprentice
       (2), jersey-shore (2), below-deck (2) clusters checked individually —
       same shape, no shared root cause found. Existing candidate #25
       (canon-rationale echo gate) unchanged, still awaiting promotion.
     - GitHub issues: 0 unlabeled this tick (triage gate clean). #416 unchanged
       (same Supabase CLI pin, single stale item, no clustering signal).
     - spec.md + design/: no changes since pass 44 (`git log 1067802..HEAD --
       spec.md design/` empty).
     - Commit pattern: 11 commits since pass 44 — dominated by critique-pass-75
       finding closures (4 content/copy fixes) plus one canon-rationale
       rewrite and one B-tier tag reword. Pure critique-response velocity, no
       fix-cluster signal beyond what's captured above.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24/#25 —
     all unchanged, no new reinforcing or disqualifying signal this pass. -->

<!-- Pass 44 (2026-07-06, commit 1067802) — 1 new candidate filed (#25).
     Window since pass 43 (3d38fc8, 2026-07-05): ~13 hours / 21 commits. Commit
     threshold met (≥20).
     Signals reviewed:
     - AUDIT.md: 0 Pending rows of the `- [ ] [SEV] ... (category: ...)` bullet
       shape. One heading-style row remains (`### [user-issue #416] [LOW] Pin
       Supabase CLI version...`, score 4.8) — unchanged since pass 41/42/43,
       single item, /iterate-shaped, not a clustering signal.
     - CRITIQUE.md: ~20 Pending rows across passes 51-74. Re-scanned specifically
       for new clusters not previously assessed. Found one: the canon-rationale /
       season-body verbatim-argument duplication defect (pass-73 Survivor 50
       finding) explicitly names itself "the same duplication class as the
       resolved Bachelor S28 finding (issue #464)... now confirmed on a third
       show" — cross-referencing GitHub confirms #464 and #459 (Love Island UK)
       are both CLOSED, each fixed as an isolated content edit. Three independent
       shows, three separate fix events, same root cause, never caught before
       ship. This is a real, previously-unassessed cluster (not mentioned in any
       prior pass's "existing candidates status" — checked via grep). Filed as
       new candidate #25: extend the existing verbatim-phrase-echo n-gram
       technique (`collectThemedEntryVerbatimPhraseEchoIssues` in
       `scripts/content-check.ts:1262`, already proven for themed-list title↔blurb
       pairs) to canon rationale ↔ season body pairs.
     - The other clustering candidate considered — "drain"-word jargon leakage
       (ANTM pass-64, MasterChef Australia pass-62) — remains at 2 instances,
       still below the 3-instance clustering bar per pass-40's explicit
       assessment (unchanged; no new "drain"-word instance found this pass). The
       CAST SIZE templated-caption finding (pass-67) flags a *possibly* related
       drain-script-default pattern but is a single instance with a suggestion to
       audit further, not itself a cluster — noted but not promoted; a future
       pass should re-check if a third instance of either sub-class appears.
     - GitHub issues: 0 unlabeled this tick (triage gate clean); #416 unchanged,
       single stale item, no clustering signal.
     - spec.md + design/: no changes since pass 43 (`git log 3d38fc8..HEAD --
       spec.md design/` empty).
     - Commit pattern: 21 commits since pass 43 — dominated by content-drain
       pairs (90 Day Fiancé, Vanderpump Rules, RHOSLC shows; Queer Eye and Jersey
       Shore season drains; American Ninja Warrior, Married at First Sight shows),
       plus a vote-floor bug fix, a critique pass (74), a Survivor 50 content
       backfill, and an SEO title-template fix. Pure drain/critique-response
       velocity, no fix-cluster signal beyond what's captured above.
     Existing candidates status: #14/#15/#16/#18/#19/#20/#21/#22/#23/#24 — all
     unchanged, no new reinforcing or disqualifying signal this pass. -->

<!-- Pass 43 (2026-07-05, commit 3d38fc8) — 0 new phase-shape candidates filed;
     dispatched directly into plan/AUDIT.md instead per bearings Rule 1.
     Window since pass 42 (48ec163, 2026-07-04): ~17 hours / 23 commits. Commit
     threshold met (≥20).
     Signals reviewed:
     - AUDIT.md show-queue: 0 Pending "Add show" rows — the queue had run
       completely dry across the last two expand passes (41, 42), tripping
       bearings.md's "must never run dry, propose the next wave once Pending
       show rows drop to ≤2" mandate (Rule 1). This is exactly the gap
       candidate #24 (filed by /digest 2026-07-05, still awaiting promotion)
       describes — two passes silently skipped the trigger. Rather than only
       filing #24's meta-fix (amend skills/expand.md), this pass took the
       direct action Rule 1 actually mandates: filed a "NEW SHOW QUEUE — WAVE
       6" batch of 5 Pending category: content-gaps rows straight into
       plan/AUDIT.md (90 Day Fiancé, Vanderpump Rules, Real Housewives of Salt
       Lake City, Married at First Sight, American Ninja Warrior — none
       previously in content/shows/), all scoring ≥3.0 so the next march tick's
       Step 3b.5 has real work to dispatch to /ship-content. Candidate #24
       remains pending — the process-hardening fix (making the checklist
       un-skippable in skills/expand.md) is still worth oversight's review so a
       third pass doesn't repeat the miss, but the immediate content gap is
       now closed for this cycle.
     - AUDIT.md Rule 2 gap (separate from the show queue): diffing show
       frontmatter `seasons:` against actual season files found two more
       broken promises — Queer Eye (1/8 files) and Jersey Shore (1/6 files)
       were explicitly promised as "sibling rows, later tick" on 2026-07-04
       (twice, in the Apprentice and Selling Sunset drain-row bodies) but
       never actually filed. Filed both now as Pending season-drain rows
       (scores 3.5 / 3.0); Jersey Shore's row carries forward the original
       Miami/Italy season-numbering research flag from its show-scaffold row
       so /ship-content doesn't skip the verification step.
     - AUDIT.md needs-user-call rows: 2, both unchanged from pass 41/42
       (Naked and Afraid S12/13/15/16 numbering, Apprentice S5 LA-framing) —
       editorial-call blockers, oversight resolves, not phase shapes.
     - CRITIQUE.md: pass 73 ran this window (commit 60aaca6, 5 findings: 2
       HIGH + 3 MED, all on /shows/survivor/season/survivor-50 — thin content
       record, a vote-shift-pill vote-floor bug, a stale "no votes yet" banner
       against a nonzero votes column, a duplicated canon/body rationale, and
       a title stutter). Five findings clustered on one URL looks like
       candidate #24-style signal multiplicity at first glance, but only 2 of
       the 5 are HIGH (shape B's threshold is "3+ HIGH on the same URL") and
       each has an independent, cheap, single-surface fix — no shared root
       cause ties them together (content thinness, a missing vote-floor
       guard, stale banner copy, prose duplication, and a title-builder edge
       case are five unrelated defect classes that happen to land on the same
       freshly-scaffolded page). Correctly /iterate-shaped, not phase-shaped;
       left pending for the next iterate tick to drain one at a time.
     - GitHub issues: 0 unlabeled (triage gate was clean this tick); #416
       (Supabase CLI pin, category: bug, score 4.8) remains the sole
       long-open row, unchanged from prior passes, not a clustering signal.
     - spec.md + design/: no changes since pass 42 (`git log 5e3f57f..HEAD --
       spec.md design/` returns empty).
     - Commit pattern: 23 commits, all content-drain / audit-finding-fix
       pairs (Bachelor format_summary batch across two ticks, a critique pass,
       a digest) — pure drain velocity, no new fix-cluster signal.
     Existing candidates status: #11/#12/#14/#15/#16/#17/#18/#19/#20/#21/#22/
     #23/#24 — all unchanged, no new reinforcing or disqualifying signal this
     pass beyond #24's practical resolution-in-part noted above. -->

<!-- Pass 42 (2026-07-04, commit 5e3f57f) — 0 new candidates filed; no new signal.
     Window since pass 41 (61432a0, 2026-07-04): ~11 hours / 20 commits. Commit
     threshold met (≥20).
     Signals reviewed:
     - AUDIT.md: 2 pending rows, both unchanged from pass 41 — Naked and Afraid
       S12/13/15/16 premiere-numbering discrepancy and The Apprentice S5
       LA-framing question, both explicitly `[needs-user-call]` (scores 3.15,
       2.8, capped). Editorial-call blockers, not phase shapes; oversight
       resolves.
     - CRITIQUE.md: pass 70 ran this window and filed 0 new findings (commit
       ba0f29e) — first clean pass since the loop reopened the shipping-mode
       gate. No new clusters to evaluate; existing pending rows unchanged from
       pass 41's review, all already absorbed by #13 (shipped, registry-based
       drain in progress via /iterate), #14 (era-label opacity), or #15
       (canon-completeness gate).
     - GitHub issues: 1 `triage:loop-queued` (#416, unchanged, 3+ weeks stale) —
       same single item pass 41 noted; no clustering signal.
     - spec.md + design/: no changes since pass 41.
     - Commit pattern: 20 commits, all content-drain / audit-finding-fix pairs
       (Selling Sunset S2-6, Apprentice S6-10, hedge-phrase batch drain, yearsWord
       capitalization fix, Section 03 quote fix, ANTM terminology, jersey-shore
       caption, /shows hero relabel, Windows path-matching fix) plus pass 41's
       own expand commit and a digest. Pure drain velocity; no new fix-cluster.
     Existing candidates status: #11/#12/#14/#15/#16/#18/#19/#20/#21/#22/#23 —
     all unchanged, no new reinforcing signal this pass. #13 — shipped; its
     registry continues absorbing hedge-phrase instances via /iterate (3 more
     drained this window, commit ac081a7). -->

<!-- Pass 41 (2026-07-04, commit 61432a0) — 0 new candidates filed; #14 and #15
     reinforced with new signals.
     Window since pass 40 (81e56e8, 2026-07-03): ~17 hours / 21 commits. Commit
     threshold met (≥20).
     Signals reviewed:
     - AUDIT.md: 2 pending rows. (a) category: engineering — check-test-colocation
       Windows path-matching bug (score 3.5, single instance, /iterate-shaped).
       (b) category: content-gaps — Naked and Afraid S12/13/15/16 premiere-date
       numbering discrepancy, explicitly filed `[needs-user-call]` (score 3.15,
       capped) — a genuine editorial-call blocker, not a phase shape; oversight
       resolves. Neither clusters into new phase-shape work.
     - CRITIQUE.md: 43 `- [ ]` rows physically present under `## Pending`
       (previous passes' shorthand "0/N pending" summaries undercounted — the
       section mixes resolved `[x]` rows in with live `[ ]` ones and a naive
       section-boundary scan misses this; corrected here for future passes).
       Direct verification found several of these rows are stale — already
       fixed by commits in this window without the CRITIQUE.md row being
       flipped to `[x]` (e.g. the ANTM/MasterChef Australia `meth_when_p`
       "drain completes"/"drain continues" jargon rows no longer match current
       content; the masked-singer/below-deck-mediterranean/below-deck-sailing-
       yacht/DWTS lowercase-after-period quotes no longer match current
       content). This is a CRITIQUE.md bookkeeping gap for `/iterate` to close
       on pickup, not an expand-shaped signal.
     - New/reinforcing clusters checked against existing candidates:
       (a) The verbatim hedge "I'm not claiming to be objective. I'm trying to
       be honest/fair." now appears in 12 canon files
       (`rg -l "I'm not claiming to be objective" content/shows/*/canon.md`).
       This is NOT a new candidate — Phase 45 (candidate #13,
       CLICHE_REPETITION_STRICT) already shipped the extensible cross-corpus
       phrase-frequency registry this exact pattern is built for; adding this
       phrase as a fourth registered pattern + draining it is `/iterate`-shaped
       registry-extension work, not a new phase.
       (b) `tier_s_blurb` completeness (candidate #15): direct verification
       (`rg --files-without-match tier_s_blurb content/shows/*/canon.md`)
       confirms **0 of 43 shows** now lack the field — the 20-file content
       batch candidate #15 scoped was fully drained this window (commit
       51dd0fd + 2952ae1, prior to this pass). Candidate #15 updated below:
       remaining scope is now the `content-check.ts` gate alone (smaller,
       cheaper, stronger case for promotion — the recurrence-risk the gate
       exists to close is now proven real at 46% of the pass-40 catalog).
       (c) Era-band label opacity (candidate #14): 2 more live instances
       confirmed — `/shows/below-deck` "LEE ERA"/"TITHERADGE ERA" chips
       (pass-56, CRITIQUE.md:2008) and `/shows/alone` "no-host era" reference
       (pass-?, CRITIQUE.md:2195) both lack season-range context, exactly the
       defect class #14 already scopes. Reinforcement noted below; no new
       candidate.
     - GitHub issues: 1 `triage:loop-queued` (#416, nightly e2e-full red from
       2026-06-14) — single stale item (3 weeks old, deploy is green today),
       no clustering signal.
     - spec.md + design/: no changes since pass 40.
     - Commit pattern: 21 commits — dominated by critique passes 68/69 +
       their per-finding drain commits (OG-image wiring, season-page title/
       ordinal fixes, VotePair accessible name, ANTM host_caption, American
       Idol methodology, Naked and Afraid premiere dates, tier_s_blurb batch).
       Pure drain velocity; no 5+ commit fix-cluster on a single code surface
       beyond what candidates #13/#14/#15 already cover.
     Existing candidates status: #11/#12 — still awaiting promotion, no new
     signal. #13 — shipped as Phase 45; its registry is the live mechanism
     that should absorb the new hedge-phrase signal above via `/iterate`, not
     a fresh candidate. #14 — reinforced (2 new era-label instances, both
     within existing scope). #15 — reinforced + scope narrowed (content batch
     complete; only the code gate remains). #16 — still `[needs-user-call]`.
     #18/#19 — still awaiting promotion, no new signal this pass. #20/#21/#22
     — no new instances this pass. #23 — spot-checked against current content;
     the CRITIQUE.md-cited instances no longer reproduce (already drained),
     no live instances found via corpus scan; leaving as-is pending a fresh
     critique pass rather than downgrading on a spot-check alone. -->

<!-- Pass 39 (2026-06-22, commit 295b6cc) — 0 new candidates filed; AUDIT content-gap rows filed.
     Window since pass 38 (0721747, 2026-06-21): 1 day (21h) / 22 commits. Commit threshold met (≥20).
     Signals reviewed:
     - AUDIT.md: 0 pending rows — AUDIT show-queue fully drained again. bearings Rule 1 "keep
       the queue fed" mandate fired: wave-5 season-drain rows (RHONJ S6–S14, RHOC S4–S18,
       AGT S6–S20, Naked and Afraid S6–S19, Masked Singer S6–S13) + wave-6 new show rows
       (America's Next Top Model, The Apprentice US, Queer Eye, Selling Sunset, Jersey Shore)
       filed to AUDIT.md in this same commit. Not phase shape — content-velocity rows.
     - CRITIQUE.md: 20+ pending rows across passes 54–63. No new clusters emerge above the
       candidates already filed (#20 inline coverage note, #21 meth_who_p guard, #22 tagline
       years-vs-seasons). Pass 63 filed 3 new findings: American Idol meth_when_p stale (MED,
       content fix → iterate); American Idol tier_s_blurb/tier_a_blurb absent (LOW, covered by
       #15); /shows "SEASONS RANKED" stat inaccuracy (LOW, iterate-shaped UI fix — rename
       label or change data source). None rise above existing candidates in score.
     - GitHub issues: 1 loop-queued (#416, Supabase CLI pin) — unchanged, workflow-blocked.
     - spec.md + design/: no changes.
     - Commit pattern: 22 commits — 5 content ticks (American Idol S16–23, RHOBH S6–15,
       AGT/Naked/Masked new shows, RHOA S16 fix), 1 critique pass (63). Pure content velocity;
       no code-surface clustering.
     Existing candidates status:
       #15 (CANON_COMPLETENESS_STRICT) — now 6 tier_s_blurb violators (added American Idol
       to RHONY/Voice/RHOA/DWTS/BDM); strengthened for promotion. #18 (header affordance) —
       awaiting promotion. #20 (inline coverage note) — awaiting promotion; 1 new signal
       (pass-63 confirms MCA partial coverage still undisclosed inline). #21 (meth_who_p guard)
       — awaiting promotion. #22 (tagline years-vs-seasons) — awaiting promotion; 0 new cases. -->

<!-- Pass 38 (2026-06-21, commit 0721747) — 3 candidates filed.
     Window since pass 37 (14a50a1, 2026-06-20): 1 day / 20 commits. Exact threshold met.
     Signals reviewed:
     - AUDIT.md: 0 pending rows — AUDIT show-queue fully drained. bearings Rule 1 "keep
       the queue fed" mandate fired: wave-5 season-drain rows (American Idol S6–S23,
       MasterChef Australia S6–S16, RHOBH S6–S15, RHOA S16) + wave-5 new show rows
       (RHONJ, RHOC, AGT, Naked and Afraid, The Masked Singer) filed to AUDIT.md in this
       same commit. Not a phase shape — content-velocity rows go to AUDIT.
     - CRITIQUE.md: 20 pending rows across passes 51–62. Three clusters rise to phase shape:
       (1) Partial-canon inline disclosure absent — 5 shows (Survivor AU pass-58, Love Is
       Blind pass-58, DWTS pass-59, RHOBH pass-62, MCA pass-62), all MED severity, all
       missing the same UI signal near the ranking list (new candidate #20). (2) meth_who_p
       misleading completeness language — 3 shows (Love Is Blind "all five seeded" pass-58,
       DWTS "covers the full run" pass-59, MCA tagline years-vs-seasons pass-62), 3 distinct
       critique passes, same reader-trust root cause (new candidate #21). (3) Tagline
       years-vs-seasons conflict — 2 shows (MCA, RHOBH), 1 critique pass — below 3-show
       threshold but structural risk grows with catalog (new candidate #22, lower score).
       Remaining rows (tier_s_blurb absent × 5 shows — RHONY/Voice/RHOA/DWTS/BDM) reinforce
       existing candidate #15 (CANON_COMPLETENESS_STRICT gate) — not a new candidate.
     - GitHub issues: 1 loop-queued (#416, Supabase CLI pin) — single-item, workflow-
       permission-blocked for cloud; /iterate handles locally. Not a phase shape.
     - spec.md + design/: no changes since pass 37.
     - Commit pattern: 20 commits — 4 content ticks (new shows + season drains), 2 critique
       passes (61/62), 4 audit-closure pairs, 1 critique-find closure. No 5+ fix-cluster
       on any code surface. Two new shows (RHOBH, MCA) generated 5 critique findings on
       the same tick — the partial-canon class is now structurally recurrent.
     Existing candidates status:
       #14 (era filter empty state) — awaiting promotion; primary MED driver (TITHERADGE ERA)
       still Pending. #15 (CANON_COMPLETENESS_STRICT gate) — reinforced by 5 tier_s_blurb
       violations across 5 shows + 4 critique passes; strengthened for promotion. #16
       (/u/[handle] stat chips) — [needs-user-call]; skip. #18 (header handle affordance) —
       awaiting promotion; still 0 new signals; still valid. #19 (revised-date helper) —
       awaiting promotion; still valid, single finding. -->

### 30. `/shows` B-tier browse filter — network/genre chips

**Score:** 5.2 (impact: 6, ease: 7 → 4.2 base + 1.0 signal multiplicity —
catalog growth reinforces)
**Source pass:** 52
**Filed:** 2026-07-11
**Source signals:**
- Critique pass-77 [LOW] `/shows` B-tier ("Canon still forming") holds 39
  shows in one flat scroll with no in-page filter or sort beyond global
  Cmd+K search — a first-time visitor can't browse by network or genre
  without already knowing a show's name.
- Data growth: the catalog has grown to 58 shows total (up from ~50 when
  pass-77 filed this finding, per this pass's commit-pattern review) — the
  B tier specifically only grows under Rule 1's standing perpetual mandate
  (new shows enter at B before earning an A/S promotion), so this gap
  compounds every single tick the loop ships a new show.
- Precedent: every show page already ships an era-filter affordance (phase
  33/34's `CanonEraToolbar`) for browsing within a show's own seasons — the
  top-level `/shows` index has no equivalent for browsing across shows.

**Why:** This is signal F (data growth) in its textbook form — an entity
(shows) crossed from a handful to 50+ records and the index page built for
the earlier scale hasn't grown with it. The fix isn't speculative: the
`network` and `genre_tag` frontmatter fields already exist on every show
(per `CLAUDE.md`'s show-identity table), so no new content authoring is
required, and the era-filter chip component already shipped elsewhere in
the product as a pattern to mirror. Low risk, high leverage as the catalog
keeps growing — this gets more valuable every tick, not less.
**Scope sketch:**
- Add lightweight filter chips above the B-tier grid (network and/or
  genre_tag), derived from existing frontmatter — no schema change.
- Mirror `CanonEraToolbar`'s interaction pattern (chip row, active-state
  styling, clear-filter affordance) rather than inventing a new component.
- Chrome-only change; content-only fields already carry the values needed.
- Unit tests for the filter-derivation helper; e2e asserts filtering by a
  known network/genre narrows the visible B-tier set correctly.
**Estimated phases:** 1.
**Conflicts:** none. Independent of #14 (era filter is within-show, this is
across-show) though both extend the same toolbar interaction pattern —
worth a shared-component pass if both ship close together, not a blocker
to either shipping alone.

### 31. Large-canon show-page TTFB regression — profile + optimize per-request render cost ~~(resolved — shipped pre-promotion, pass 53)~~

**Score:** 4.5 (impact: 7, ease: 5 → 3.5 base + 1.0 signal multiplicity —
correlates with #26's catalog-scale stressor)
**Source pass:** 52
**Filed:** 2026-07-11
**Pass-53 update:** resolved directly via `/iterate`, no phase promotion
needed. Commit 75108d4 (audit finding `the-apprentice-ttfb`, closes #541)
confirmed the working theory this candidate's scope sketch predicted:
`getCommunityRanking` was awaiting four independent Supabase queries
(`compute_weighted_rank` RPC, trailing-7d voters, baseline snapshot, latest
snapshot) sequentially, so per-request time was their sum rather than their
max. Firing them concurrently with `Promise.all` — `force-dynamic` rendering
(phase 35's freshness fix) left untouched — closes the confirmed bottleneck
without the caching workaround this candidate's scope sketch explicitly
warned against. Verify gate green (2828 unit / 3343 e2e) at fix-time. This
mirrors the exact "may ship as a same-tick `/iterate` fix rather than
needing a numbered phase" hedge candidates #24/#27 also called out and had
play out the same way. Zero open signal remains on this candidate; leaving
it filed (struck through, mirroring #17/#27 precedent) as the historical
record if a fresh large-canon page reintroduces the sequential-await
pattern. `/oversight` can treat this as closed.
**Source signals:**
- Critique pass-87 [MED] `/shows/the-apprentice` and `/shows/survivor` (the
  site's two largest-canon shows) render 3-6x slower than every other page
  walked that pass. Repeated `curl -w` samples: apprentice 1.68s/1.11s/
  1.15s/0.90s, survivor 1.13s/0.90s/0.86s, vs. `/` at 0.23s and a 1-entry
  canon page (`/shows/chopped/season/season-1`) at 0.34s — the gap tracks
  canon/season count, not show identity.
- Cross-reference: candidate #26 (e2e-full crawl timeout undersized for
  catalog growth) is a different subsystem (CI wall-clock vs. render
  latency) hitting the identical root stressor — the catalog has grown
  past what the surrounding infrastructure was sized for, and both
  symptoms will keep recurring as Rule 1's perpetual show-growth mandate
  continues.

**Why:** `src/app/shows/[show]/page.tsx:37` sets `dynamic = 'force-dynamic'`
deliberately (phase-35 fix for a "community ranking shows stale 0" bug) —
that freshness guarantee is correct and must not be reverted. But nobody
has profiled where the per-request time actually goes on large-canon pages;
the AUDIT finding's own working theory (community-ranking aggregate query
scaling with row count, or redundant content-file reads across the season
list) is plausible but unconfirmed. This is exactly the kind of
"reality has outgrown the plan" gap `/expand` exists to catch: phase 18
("Performance + a11y polish") shipped when the catalog was much smaller,
and nothing since has re-profiled the hot path against today's scale.
Left unaddressed, this gets worse on every tick that adds a season to
Survivor or the Apprentice, and will eventually surface as a Core Web
Vitals regression on the site's two flagship show pages.
**Scope sketch:**
- Profile `getAllSeasons` / `getCanon` / `getCommunityRanking` on
  `/shows/[show]/page.tsx` for a large-canon show under realistic load —
  identify the actual hot path (not just the working theory).
- Optimize the confirmed bottleneck: likely indexing, per-request
  memoization, or narrowing the community-ranking query — without adding
  page-level caching that would resurrect the phase-35 staleness bug.
- Unit/perf test that pins the fix (e.g. assert a bounded query count or
  render time budget for a large-canon fixture) so a future regression is
  caught before it needs another critique pass to surface.
**Estimated phases:** 1 (profiling + targeted optimization; scope may
narrow once the actual bottleneck is confirmed).
**Conflicts:** none. Independent of #26 — different code paths, same root
stressor (catalog scale); may be worth bundling into one "catalog-scale
infrastructure" oversight session alongside #26 and #29 if the user wants
to address the pattern class in one sitting rather than three.

### 25. Canon-rationale/season-body verbatim-argument echo gate

**Score:** 8.0 (impact: 8, ease: 8 → 6.4 base + 1.6 signal multiplicity, impact bumped
7→8 at pass 46 — the class now costs a full-show rewrite, not a one-scene edit;
multiplicity bonus raised again at pass 49 — a 10th independent instance closed in
the very next commit window after pass 48's filing, the shortest gap yet between
reinforcements)
**Source pass:** 44 (reinforced pass 46, 47, 48, reinforced again pass 49)
**Filed:** 2026-07-06 (reinforced 2026-07-07, 2026-07-08, 2026-07-08, 2026-07-09)
**Pass-49 reinforcement:** a tenth independent instance closed within the same
20-commit window this pass is scoring — Shark Tank Season 11 (issue #512, closed
commit 45e75fa/095b3f3), filed by critique pass-82 and fixed the same tick as a
one-off content edit, identical shape to every prior instance: the season body and
the canon.md rationale both restated the same closing argument, differing only in
their final sentence. This is now the **third consecutive expand pass** (47, 48, 49)
to find a fresh recurrence sitting in the commit log at filing time — the defect is
not slowing down as the catalog grows, it is keeping pace with it one show at a time,
exactly as pass-48's projection predicted. Zero of the ten instances have been caught
pre-ship by a gate; all ten were caught reactively by a critique pass, days to weeks
after the content shipped.
**Pass-48 reinforcement:** two more independent instances closed this window, both
as one-off content edits rather than through a gate — Perfect Match (issue #501,
canon.md rationale echoed the season body's "cheap reunion special" closing clause
verbatim, commit 16ef80f) and The Voice's finale season (issue #502, canon.md
rationale echoed the season body's finale-framing paragraph near-verbatim aside from
one inserted clause, commit 9903b49). Signal count now **9 independent shows**
(Love Island UK, Bachelor S28, Survivor 50, RHOSLC, MAFS New York, Big Brother
26-season, Perfect Match, The Voice, plus the originally-cited MAFS instance) across
9 separate fix events, still zero of them caught pre-ship by a gate. Also notable:
this window's FILMED-caption drain (candidate #28, filed this pass) confirms the
identical root-cause pattern — "content authored without checking a sibling field"
— recurring on a *different* field pair (`location`/`filming_caption`) at far
higher volume (139 files). The two candidates share a philosophy (de-duplication
discipline at content-authoring time) even though their detection mechanics differ
(fuzzy n-gram echo across two files vs. exact-string equality within one file);
`/oversight` may want to consider promoting both in the same phase for that reason,
though each ships independently if preferred.
**Source signals:**
- Critique pass-79 [MED] `/shows/perfect-match` (and its season-1 page) — the season
  body and the canon.md rationale both close on the identical clause "could have
  played as a cheap reunion special," on a show scaffolded this same week
  (2026-07-07). **Seventh independent instance** of the exact defect class, and the
  first to hit a show still inside its first week of existence — proof the gate
  would pay for itself immediately rather than waiting weeks for a critique pass to
  notice. Still unresolved (CRITIQUE.md pending row, pass-79) as of this filing.
- Issue #459 (CLOSED) — Love Island UK, all 11 series, canon rationale duplicated the
  season body's own argument, fixed as a one-off content-curator pass.
- Issue #464 (CLOSED) — Bachelor Joey Graziadei season page: triple-duplicated copy
  across lede/sections/tiles, fixed as a one-off content edit.
- Critique pass-73 [MED] `/shows/survivor/season/survivor-50` — canon.md's "## 50.
  Survivor 50" rationale and the season-file body restate the same "ceremony /
  quarter-century of casting work / settled grammar / provisional" argument
  near-verbatim. The finding explicitly names this "the same duplication class as
  the resolved Bachelor S28 finding (issue #464), now confirmed on a third show."
- RHOSLC and Married at First Sight — both cited by the pass-76 Big Brother finding
  below as prior instances of the identical class, each already fixed as a one-off
  content edit (MAFS: commit 7ac2c42).
- Issue #488 (CLOSED, pass 46) — Big Brother, **systemic across the full 26-season
  canon**: critique pass-76 confirmed the pattern on two unrelated seasons at
  opposite ends of the ranking (bottom-ranked pilot, top-ranked fan-favorite),
  concluding it wasn't a one-off but a show-wide authoring gap — Big Brother's canon
  predates the de-duplication convention every newer show now follows. Fix required
  a content-curator sub-agent rewriting all 26 rationale paragraphs in one pass
  (commit 4af4dd0), an order of magnitude more expensive than every prior instance's
  single-scene edit.
- Issue #512 (CLOSED, pass 49) — Shark Tank Season 11, fixed the same tick it was
  filed (critique pass-82): the canon.md rationale and the season body were verbatim
  duplicates of each other except their closing sentence, discovered immediately
  after the season was freshly drained (Shark Tank S7–S11 drain, closes #509, two
  commits earlier in the same window) — the tenth show to hit this exact defect and,
  like Perfect Match at pass-48, another freshly-authored show catching it within
  days rather than months.
- Signal multiplicity (pass-47 count; see the pass-48 and pass-49 reinforcement
  paragraphs above for the current running total of **10 independent shows**):
  **7 independent shows** across 7 separate fix events (3 closed
  as one-off GitHub issues, 1 closed as a systemic 26-season rewrite, 2 more content
  edits cited inline by the Big Brother finding, 1 still pending as of pass 47), each
  time caught reactively by a critique pass or a filed issue weeks after the content
  shipped, never once caught before ship. Same defect class, same root cause (a canon
  rationale authored without checking what the season body already says), recurring
  at a steady cadence as the show-coverage mandate (bearings Rule 1) keeps producing
  new canon entries — and the cost-per-instance is now proven to scale with show size
  (a 26-season show costs 26x a 1-season fix), which is a stronger promotion case than
  pass 44's 3-instance filing had.

**Why:** The codebase already has the exact technique this defect class needs —
`collectThemedEntryVerbatimPhraseEchoIssues()` in `scripts/content-check.ts:1262`
tokenizes two text fields, builds n-gram sets, and flags shared phrases above a
configured length, applied today to themed-list entry title↔blurb pairs. The same
technique applied to canon.md rationale text ↔ the corresponding season file's body
would have caught all three known instances (#459, #464, and the pending Survivor 50
finding) before they shipped, rather than requiring a critique pass or a filed GitHub
issue to notice weeks later. This is "reality outpacing the plan" in the specific
sense expand exists to catch: the show-coverage mandate is a standing perpetual rule
(bearings Rule 1) that keeps generating fresh canon+season pairs every tick, and this
exact defect keeps recurring at the same steady rate the content velocity itself
produces — a per-instance content fix never closes the class, only a gate does.
**Scope sketch:**
- New `collectCanonRationaleSeasonBodyEchoIssues()` in `scripts/content-check.ts`,
  mirroring the existing verbatim-echo helper: for each canon entry, tokenize its
  `rationale` and the matching season file's body/lede text, build n-gram sets (start
  at the same n as the themed-list check, tune if too noisy), and flag shared
  n-grams above a length/count threshold.
- Wire into `collectFailures()` so `pnpm content:check` fails on new instances; run
  once in report-only/strict-flag mode first against the full corpus to confirm it
  doesn't false-positive on legitimate shared vocabulary (season names, host names,
  format terms) before making it a hard gate.
- Colocated unit tests: a synthetic canon/season pair with a real duplicated
  argument (should flag), a pair that legitimately shares only proper nouns (should
  not flag), and a pair with no overlap (should not flag).
- `content-curator` brief update: document the gate so future canon authoring checks
  the season body first, mirroring the existing candidate #20 pattern of updating
  curator guidance alongside a new structural check.

**Estimated phases:** 1.
**Conflicts:** none. Complements (not overlaps with) candidate #23's prose
capitalization invariant and #13's cross-corpus cliché registry — those catch
different defect shapes (style/formatting drift vs. cross-corpus phrase reuse) in
the same file; this candidate catches cross-field argument duplication *within one
show's canon+season pair*, a shape none of the existing gates cover.

### 28. Stat-tile value/caption literal-duplicate invariant

**Score:** 8.3 (impact: 8, ease: 9 → 7.2 base + 1.1 signal multiplicity — a single
critique finding that was itself already systemic across 139 files/22 shows, same
root-cause family as candidate #25; multiplicity bonus raised at pass 49 by a second,
independently-discovered defect shape on one of the six pairs this candidate already
proposes to gate)
**Source pass:** 48 (reinforced pass 49)
**Filed:** 2026-07-08 (reinforced 2026-07-09)
**Pass-49 reinforcement:** the `cast_size`/`cast_size_caption` pair — one of the six
value/caption pairs this candidate's scope sketch already lists for gating — proved
the risk live this window: issue #508 (CLOSED, commit fdc59fa) found the CAST SIZE
caption on three separate freshly-drained pages (The Apprentice, America's Next Top
Model finale, RHONJ S14) restating the raw headcount as a re-spelled word plus a
generic era adjective ("18 players" / "18 contestants, founding era") rather than
describing composition — the *third* confirmed instance of this specific sub-pattern
(critique pass-67 first flagged it, pass-81 reinforced it, this window closed all
three outstanding files). The fix commit's own message noted explicitly: "the
content:check invariant proposal remains unshipped (deferred, not required for this
fix)" — the gap this candidate exists to close is still open and just cost a third
reactive fix. **Important scope note:** this sub-pattern is *not* caught by the
scope sketch's current exact-string-equality check — "18 players" and "18
contestants, founding era" are not identical strings, only a re-spelled digit
padded with a generic adjective. The gate as scoped would still miss this shape;
either add a second, looser check specifically for the `cast_size`/`cast_size_caption`
pair (caption reduces to the value's digit spelled as a word plus ≤1 generic modifier
word, with no other substantive composition detail) alongside the exact-equality
check for the other five pairs, or note the gap explicitly so `/oversight` scopes
the phase to cover both shapes rather than shipping a gate that would have missed
this window's own instance.
**Source signals:**
- Critique pass-78 [MED] `/shows/shark-tank/season/season-1` (and 132 other files
  catalog-wide) — the FILMED stat tile's value (`location`) and caption
  (`filming_caption`) rendered as the identical string twice instead of a
  value/gloss pair, e.g. `location: "Culver City, California"` /
  `filming_caption: "Culver City, California"`. A catalog-wide grep at filing time
  found 133 season files across 22 shows with this exact defect; a fresh grep at
  fix-time (this window) found 139 (6 more from catalog growth in the interim).
  Filed as issue #498. **Just fully drained this window** — 6 batches across 6
  ticks (the first batches shipped before pass 47, this window shipped batches
  3 through 6, closing the final 89 files across every remaining show). A fresh
  catalog-wide grep at drain-completion confirms zero remaining
  `location === filming_caption` duplicates (commit b616754).
- The finding explicitly names its own root cause as identical to two defects
  candidate #25 already targets: "the same shape of systemic content-authoring gap
  as the Big Brother canon.md duplication (issue #488) and Love Island UK
  rationale duplication (issue #459)" — content authored without checking a
  sibling field for restated argument/fact, producing literal or near-verbatim
  duplication. Candidate #25 covers the canon-rationale/season-body pair (fuzzy
  n-gram echo, cross-file); this defect is the exact-string-equality case
  (`location`/`filming_caption`, same file) — narrower to detect, but the same
  underlying discipline gap.
- The drain shipped with **no accompanying content-check invariant**, unlike the
  sibling `meth_who_p` / `meth_how_*` / `meth_when_*` plural-editor-voice defect
  (issues #329/#357), which got a `collectCanonMethWhoPluralEditorIssues` /
  `collectCanonMethSiblingsPluralEditorIssues` gate wired to `pnpm content:check`
  immediately after its own drain, at strict floor-0. This drain has no equivalent
  — the very next new show a content-curator authors (guaranteed under bearings
  Rule 1's perpetual show-coverage mandate) can silently reintroduce the identical
  139-file-scale defect, unnoticed until a future critique pass happens to look.
- Verified directly (this expand pass) that the risk isn't hypothetical for the
  other five schema-sibling value/caption pairs sharing the exact same shape
  (`format_summary`/`format_caption`, `cast_size`/`cast_size_caption`,
  `premiere_date`/`premiere_caption`, `ep_count`/`episodes_caption`,
  `host`/`host_caption`, all defined in `src/content/schemas.ts:129-171`): a
  catalog-wide scan across all `content/shows/*/seasons/*.md` files found **zero**
  current literal duplicates on any of the other five pairs, meaning a gate could
  ship at strict floor-0 across all six pairs immediately, with no lax/warn period
  needed and no false positives to tune out first.
- Issue #508 (CLOSED, pass 49) — the `cast_size`/`cast_size_caption` pair, three
  files (The Apprentice S5, ANTM S24 "the finale", RHONJ S14 "the new chapter"), a
  paraphrase-restate rather than exact-string duplicate ("18 players" /
  "18 contestants, founding era" — the caption re-spells the digit and tacks on a
  generic era adjective instead of describing composition). Third confirmed instance
  of this specific sub-pattern (pass-67, reinforced pass-81, closed this window,
  commit fdc59fa). Confirms the risk this candidate flags is not confined to the
  `location`/`filming_caption` pair alone — it recurs on other pairs in the same
  six-field family, in a shape (paraphrase, not literal duplicate) the current scope
  sketch's exact-equality check would not catch. See the pass-49 reinforcement note
  above for the scope implication.
**Why:** This is exactly the pattern `/expand` exists to catch: a defect class just
proved expensive to fix reactively (6 ticks, 139 files, one field pair) with a
root cause the codebase already has *two* precedents for gating
(`collectCanonMethWhoPluralEditorIssues` for the analogous voice-drift class;
candidate #25 for the analogous cross-file echo class) — yet this specific
drain shipped without the same treatment. Adding the gate now, while the pair is
freshly at zero across the whole catalog, is far cheaper than waiting for a
second 139-file drain to accumulate before someone notices the gap again.
Generalizing to all six value/caption pairs (rather than just `filming_caption`)
costs almost nothing extra — the check is a single reusable helper parameterized
by field-pair name — and pre-empts the other five pairs from ever accumulating
the same debt as new shows are scaffolded going forward.
**Scope sketch:**
- New `collectStatTileCaptionLiteralDuplicateIssues()` in `scripts/content-check.ts`
  (sibling to the existing `collectCanonMethWhoPluralEditorIssues` /
  `collectThemedEntryVerbatimPhraseEchoIssues` helpers): for each season file,
  iterate the six value/caption field pairs and flag any pair where the caption
  is identical (case-insensitive, trimmed) to the raw value's string form.
- **Added pass-49:** a second, narrower helper (or a second mode on the same
  helper) for the `cast_size`/`cast_size_caption` pair specifically — flag when the
  caption reduces to the value's digit spelled out as a word (e.g. `18` →
  `"eighteen"`/`"18"`) followed by at most one short generic modifier phrase (an
  era/founding/final-season adjective) with no other composition detail. This
  covers the paraphrase-restate shape issue #508 proved recurs on this pair; the
  exact-equality check alone would not have caught any of its three instances.
  Scope this as a targeted addition to `cast_size` only unless a catalog scan (at
  phase-ship time) finds the same paraphrase shape on the other five pairs too.
- Wire both checks into `collectFailures()` at **strict floor-0** immediately (no
  lax/warn period needed — confirmed zero current violations across all six pairs
  via this pass's catalog scan; #508's three instances were fixed this same window,
  so a fresh scan at ship time should also read zero for the paraphrase check).
- Colocated unit tests in `src/content/__tests__/content-check.test.ts`: a
  synthetic season file with `location === filming_caption` (should flag), one
  with each of the other five pairs duplicated (should flag, one case per pair),
  one with a `cast_size_caption` that paraphrase-restates the digit (should flag,
  mirroring the #508 real-corpus shape), one with legitimately distinct
  value/caption pairs (should not flag), and one passing at the live catalog
  post-check (asserts zero issues, mirroring the #357 test pattern).
- `content-curator` brief update: document the six value/caption pairs and the
  "caption must add information the raw value doesn't carry" convention, mirroring
  the existing candidate #20/#25 pattern of pairing a structural check with
  curator-guidance documentation.
**Estimated phases:** 1 (small, self-contained — one new content-check helper
+ colocated tests + a curator-brief note; no schema or component change, no e2e
fixture row owed since content-check runs at build/verify time, not per-route).
**Conflicts:** none. Complements candidate #25 (same root-cause family, different
detection mechanic and field scope — see pass-48 reinforcement note on #25 above).
`/oversight` may bundle both into one "content de-duplication invariants" phase or
promote independently; this candidate has no dependency on #25 shipping first.

### 29. Archive closed CRITIQUE.md / AUDIT.md rows out of the live ledger

**Score:** 5.0 (impact: 6 — a live stability risk for every future march tick that
reads these files, not just a nice-to-have; ease: 8 — mechanical move of already-
`[x]`-closed rows to a new archive file, git history keeps everything regardless,
no schema or gate-logic change)
**Source pass:** digest 2026-07-09
**Filed:** 2026-07-09
**Why:** A cloud march tick failed 2026-07-08T22:04Z (run 28978947705) with `SDK
execution error: Prompt is too long` — not a code regression, self-healed on the
next tick, but the timing lines up with `plan/CRITIQUE.md` having grown to **2,967
lines / 1.5MB / ~98K tokens on disk** (`plan/AUDIT.md` is 388KB on top of that).
Confirmed directly this digest pass: a plain `Read` of `plan/CRITIQUE.md` fails
outright with "File content (98153 tokens) exceeds maximum allowed tokens (25000)"
— any skill step that needs the whole file in context (not just a targeted grep)
is already past the single-call read ceiling, and the overall prompt-length ceiling
is the next wall behind it as the file keeps growing. 360 of the file's 385
findings are already `[x]` closed — dead weight kept only because nothing in
`skills/critique.md` or the file's own header says closed rows should ever be
pruned or archived, so the ledger has grown strictly append-only since pass 1
(now at pass 82). This is a structural risk that scales with the loop's own
success: every finding-closing tick adds to the file, never removes from it, and
the content saga (bearings Rule 1/2) guarantees critique passes keep finding new
things to file. Filed as a candidate rather than edited directly per the meta-loop
rail (`skills/digest.md` §5 "never edit gates, cadences, ceilings, or rules
directly").
**Scope sketch:**
- Add `plan/CRITIQUE_ARCHIVE.md` (and optionally `plan/AUDIT_ARCHIVE.md`) as
  append-only destinations.
- Define an age or pass-count threshold (e.g. closed rows more than ~20 passes or
  ~30 days old) past which a maintenance step — either a dedicated `/archive`
  skill tick or a step folded into `/critique`'s own close-out — moves `[x]` rows
  verbatim from the live file to the archive file, preserving exact text (git
  history + the archive file both retain full audit trail).
- Update `skills/critique.md` and `skills/iterate.md` (wherever they scan
  CRITIQUE.md for open findings) to note the archive file exists but is out of
  scope for normal reads — only the live file's open + recently-closed rows need
  to be in context for day-to-day ticks.
- No change to scoring, gating, or cadence — this is pure file-size hygiene, not
  a behavior change to what gets filed or how findings are triaged.
**Estimated phases:** 1 (small — one archive-move script or manual pass, plus a
two-line doc update in the skill files that reference these ledgers).
**Conflicts:** none. Independent of candidates #26/#28; can ship in isolation or
bundled with either.

**Reinforced (digest 2026-07-10):** the exact failure mode this candidate
predicted recurred — a second cloud march tick failed 2026-07-09T21:07:57Z
(run 29050334437) with the identical `SDK execution error: Prompt is too
long`, self-healed on the next tick same as before. `plan/CRITIQUE.md` has
grown from 2,967 to 3,096 lines (still ~1.5MB) since yesterday's filing. Two
occurrences in 2 days is no longer "plausible root cause" — it's a recurring
pattern. Still unpromoted, now 1 day stale.

**Reinforced (expand pass 52, 2026-07-11):** growth continues unabated —
`plan/CRITIQUE.md` is now 3,201 lines / 1.5MB (+105 lines in ~1 day). New
signal: `plan/PHASE_CANDIDATES.md` (this file) has independently grown to
4,106 lines / 248KB — larger than `plan/AUDIT.md` (523 lines / 392KB) and
now in the same size class this candidate was filed to address for
CRITIQUE.md. This file has no `[x]`-closed-row equivalent (candidates move
to `## Promoted` / `## Rejected` on resolution, which already functions as
a form of archival), but its "Considered" section has grown to 29+
candidates across 52 passes with no pruning of superseded/stale entries
(e.g. #17 and #27 are already marked superseded inline but still occupy
full-length space in the live section). Scope-widening suggestion: when
this candidate ships, extend the archive pattern to move `~~(superseded)~~`
-tagged and `PROMOTED as Phase NN` candidate blocks out of "Considered"
into a lighter-weight one-line index, not just CRITIQUE.md/AUDIT.md rows.
Still unpromoted, now 2 days stale, two independent files now exhibiting
the same growth-without-pruning defect this candidate names.

### 26. e2e-full "Exhaustive e2e crawl" step timeout is undersized for the catalog's growth ~~(resolved — applied via oversight 2026-07-12: timeout-minutes 50→75 after a fourth consecutive red night; sharding remains the structural fix if 75 erodes)~~

**Score:** 5.4 (impact: 6, ease: 9 — a one-line workflow-file numeric bump, no code
change, but capped by the same `workflows`-scope cloud blocker as candidate-adjacent
issue #416/#480)
**Source pass:** digest 2026-07-07
**Filed:** 2026-07-07
**Why:** The nightly `e2e-full` run at 2026-07-06T23:27Z (run 28830277979) went red
— but not from a test regression. All 6,409 checks that completed passed; the run
hit `.github/workflows/e2e-full.yml`'s hard `timeout-minutes: 50` cap on the
"Exhaustive e2e crawl" step with only 164 of 6,573 total tests left (97.5%
complete, ~460ms/test average). The crawl runs Playwright with a single worker
(`Running 6573 tests using 1 worker`), so its wall-clock duration scales linearly
with total page count — and total page count scales directly with the content
saga's own perpetual mandate (bearings Rule 1/Rule 2: 53 shows, 700 seasons and
climbing as of this digest). This is the second distinct failure class to hit this
exact step (2026-06-14 original was a Supabase release-API flake during CLI setup,
now tracked as issue #416/#480 with its own pending AUDIT.md fix; 2026-07-06 is a
genuine duration-ceiling breach with zero flakiness involved) — and unlike the
Supabase flake, this one will recur on a predictable schedule as the catalog keeps
growing, not an occasional one-off. Filed as a candidate rather than edited
directly per the meta-loop rail (`skills/digest.md` §5 "never edit gates, cadences,
ceilings, or rules directly").
**Scope sketch:**
- Raise `timeout-minutes` on the "Exhaustive e2e crawl (E2E_FULL=1)" step in
  `.github/workflows/e2e-full.yml` from 50 to ~75. The job-level `timeout-minutes:
  90` has headroom for this — the preceding "Pre-start Supabase containers" (5 min)
  and "Production build" (20 min) steps observed to consume roughly 20-25 minutes
  before the crawl starts, leaving ~65-70 minutes of job budget available to the
  crawl step today.
- Treat the timeout bump as a near-term patch, not a permanent fix: file a follow-up
  scope note (or a fresh candidate when the signal recurs) for a sharded/
  parallel-worker exhaustive crawl once even 75 minutes stops being enough — the
  single-worker constraint is the actual structural bottleneck, the timeout number
  is just the symptom.
- Same blocker as issue #416/#480: this touches `.github/workflows/e2e-full.yml`,
  which the cloud loop's `ACTIONS_PAT` cannot push (lacks `workflows` OAuth scope).
  Bundle this fix with the Supabase CLI pin in the same local/`/oversight` session —
  both are one-line workflow-file diffs blocked by the identical permission gap.

**Estimated phases:** 0 (workflow-config change, not a build-plan phase — ships via
`/oversight` directly the same way the Supabase CLI pin was scoped to, not through
`01_build_plan.md`).
**Conflicts:** none. Complements issue #416/#480 (same file family, same cloud
blocker, different root cause) — recommend landing both in the same local session.

### 27. `clipToSeoBudget()` heuristic keeps recurring one-off edge-case patches ~~(superseded — both open signals shipped pre-promotion)~~

**Score:** 4.8 (impact: 6, ease: 8 → 4.8 base, signal-multiplicity bonus dropped —
see pass-48 update)
**Source pass:** 47 (updated pass 48, closed out pass 50)
**Filed:** 2026-07-08 (updated 2026-07-08, both signals resolved by 2026-07-09)
**Pass-50 update:** the last remaining open signal — the pass-68 em-dash-vs-comma
mark-preference bug (`src/lib/seo.ts:34-37`) — **resolved this window**, directly
via `/iterate` (commit 0d0527d, issue #518): the clause-boundary scan now backs the
cut off to the em dash whenever a comma/semicolon/colon it would otherwise prefer
falls after it in the same window, matching this candidate's own scope-sketch intent
without a full mark-strength-ranking rewrite. Pinned with the exact jersey-shore lede
as a regression case in `seo.test.ts`. Both of this candidate's two open signals
(pass-79 stop-word, resolved pass-48; pass-68 em-dash preference, resolved pass-50)
have now shipped as targeted `/iterate` fixes rather than a coordinated rewrite —
exactly the hedge the pass-48 update called out as the likely outcome. **Zero open
signals remain** and a fresh grep of `src/lib/seo.ts` + CRITIQUE.md finds no third
instance pending. Recommend `/oversight` treat this candidate as closed; leaving it
filed (struck through in the title, mirroring candidate #17's precedent) as the
historical record if a fourth edge case surfaces on the same function later.
**Pass-48 update:** the pass-79 stop-word finding (issue #503) this candidate cited
as its second open signal was **resolved this window** — directly, via a targeted
`trimTrailingStopWords()` deny-list helper (commit dd43d38), not via this
candidate's broader "rank marks by boundary strength" rewrite. That's the candidate's
own original hedge playing out exactly as anticipated ("may ship as a same-tick
`/iterate` fix rather than needing a numbered phase"). Only **one** open signal
remains: the pass-68 em-dash-vs-comma mark-preference bug (`src/lib/seo.ts:34-37`,
still Pending in CRITIQUE.md as of this filing). With one of two signals resolved
outside the phase-candidate pipeline, the "3 distinct fix events" multiplicity
argument no longer holds at its original strength — score recalculated without the
+1.5 bonus. Recommend `/iterate` pick up the remaining em-dash-preference fix
directly (same shape, same file, same low cost as the stop-word fix that just
shipped) rather than waiting for phase promotion; leaving this row filed mainly so
the pattern (a function that's absorbed 3 edge-case patches across 3 critique
passes) stays visible if a 4th instance surfaces.
**Source signals:**
- The function's own code comment (`src/lib/seo.ts:12-21`) documents a prior fix:
  critique pass 62/67 found the original implementation cut mid-clause ("…and Heston
  Blumenthal appears as a…"), which the current clause-boundary-aware version was
  written to fix.
- Critique pass-68 [LOW] `/shows/jersey-shore/season/season-1` (commit 7173f3a) — the
  clause-boundary scan (`src/lib/seo.ts:34-37`) takes `Math.max` across four mark
  types (`,`, `;`, `:`, `—`) with no preference order, so a mid-list comma occurring
  after an em-dash wins the cut even though the em-dash is the stronger boundary,
  producing a dangling single list item ("…MTV builds its format around the group's
  own energy — gym…"). **Still unresolved** (CRITIQUE.md pending row).
- Critique pass-79 [MED] `/shows/perfect-match/season/season-1` — the word-boundary
  fallback (`src/lib/seo.ts:42-44`, fires when no clause mark falls within the last
  40% of the budget) has no stop-word guard, so it can land the cut on "the…" instead
  of a real word, reproduced directly against Perfect Match S1's lede.
  **RESOLVED pass-48 window** — `trimTrailingStopWords()` helper added (commit
  dd43d38), CRITIQUE.md row closed (issue #503, commit a9bb688).
- Signal multiplicity: now **2 distinct fix events on one function** (was 3) — an
  original clause-unaware bug (fixed pre-pass-47) and one remaining open edge case
  (em-dash preference). The 3rd event (stop-word) resolved outside this candidate's
  scope this window, so the "underspec'd, needs a coordinated rewrite" case is
  weaker than originally filed — see pass-48 update above.
**Why:** Two independent, unrelated-looking LOW/MED findings (jersey-shore em-dash
list, perfect-match stop-word) both trace to the same 20-line function and the same
underlying gap — the heuristic optimizes for "find *a* punctuation mark in range"
rather than "find the *strongest* clause boundary and never land on a function
word." Patching each instance individually (as the two pending rows currently
propose) fixes today's two reproductions but not the next one a future long-lede
show will surface; a small rewrite that (a) ranks mark types by boundary strength
instead of taking a flat `Math.max`, and (b) trims trailing stop words after any
fallback cut, closes the whole edge-case class in the one function rather than
leaving a third patch for a future pass to find.
**Scope sketch:**
- Rewrite the clause-boundary scan to prefer stronger marks (em-dash > colon/
  semicolon > comma) rather than whichever occurs latest in the window, fixing the
  pass-68 case.
- Add a short stop-word deny-list (`the`, `a`, `an`, `and`, `or`, `of`, `to`) applied
  after the word-boundary fallback cut, trimming one more word back if the cut lands
  on one, fixing the pass-79 case.
- Expand `src/lib/__tests__/seo.test.ts` with both pending findings' exact ledes
  pinned as regression cases, plus the existing Heston Blumenthal case already
  covered, so all three known edge cases live in one test file going forward.
- Content-only cleanup: once the function is fixed, the two CRITIQUE.md pending rows
  (pass-68, pass-79) close as a side effect of the code fix rather than needing
  separate content edits.
**Estimated phases:** 1 (small — one function, one test file; may ship as a
same-tick `/iterate` fix rather than needing a numbered build-plan phase, but filed
here since it's a code change, not content, and the recurring-patch pattern is worth
recording even if it ships quickly).
**Conflicts:** none.

### 24. `/expand`'s new-show queue refill trigger — make Rule 1's "keep the queue fed" nudge explicit ~~(retired — 2026-07-12 oversight pivot: new-show creation is LOCKED and the queue-refill nudge no longer exists; the biweekly show-add clock in `plan/CADENCE.md` owns future additions)~~

**Score:** 4.5 (impact: 6, ease: 7.5 — process/gate tuning, not user-facing)
**Source pass:** filed by `/digest` 2026-07-05, not an expand pass (meta-loop rail — proposal only)
**Filed:** 2026-07-05
**Why:** `plan/bearings.md` lines 543–551 (Rule 1 "keep the queue fed") states the new-show
`plan/AUDIT.md` Pending-row queue "must never run dry" and that `/expand` should propose a
fresh wave once Pending show rows drop to ≤2. The queue has sat at exactly 0 rows since
before the 2026-07-04 digest, and two consecutive expand passes since then (pass 41,
2026-07-04, and pass 42, 2026-07-04 later the same day) each filed 0 new candidates — neither
pass's "Signals reviewed" note mentions the show queue at all, only AUDIT's needs-user-call
rows and CRITIQUE clusters. This suggests the ≤2-row trigger is not part of `/expand`'s
actual signal checklist (it may only be evaluated implicitly, or was folded into the general
AUDIT.md scan and silently passed over because the two remaining rows there are
needs-user-call and easy to skip past). Two passes running the queue empty without
proposing a refill is itself the evidence — the mandate isn't self-enforcing.
**Scope sketch:** Add an explicit, un-skippable checklist line to `skills/expand.md`'s
procedure: "read `plan/AUDIT.md`'s content-gaps rows tagged as show-queue entries; if
Pending count ≤2, propose the next wave (3-5 shows) before scoring anything else." Cheap
process fix — no code, just a skill-file amendment plus, once promoted, one expand pass
that actually files wave 7.
**Update (expand pass 51, 2026-07-10):** the queue ran dry again (0 Pending show rows,
same failure this candidate describes) and this pass caught it manually by reading the
AUDIT.md Pending section directly rather than via an enforced checklist — filed WAVE 9
(5 shows: RHODubai, Summer House, Bachelor in Paradise, RuPaul's Drag Race All Stars,
Chopped). This is now the third time the queue has been caught empty by manual review
rather than a structural gate (waves 7, 8, 9 each followed a stall). The scope sketch
above remains unpromoted and is the actual fix — `/oversight` should promote this to a
skill-file amendment so the check stops depending on the expand pass author remembering
to look.
**Update (expand pass 54, 2026-07-11):** the queue ran dry a fourth time — wave 9's five
rows all resolved [x] this week (RHODubai, Summer House, Bachelor in Paradise, RuPaul's
Drag Race All Stars, Chopped all shipped by content-drain ticks in the days after filing),
running Pending show rows back to exactly 0. This time the empty queue was caught by
`/march`'s own Step 3b.5 (not a manual expand-pass review) — the content-gap dispatch
found zero Pending `category: content-gaps` rows and fell through to the expand gate,
which is precisely how this march tick ended up here. That's a *structural* catch, not
authorial vigilance, which is mild evidence the failure mode is self-correcting at the
march level even without this candidate's proposed skill-file amendment — but it only
caught the empty queue one dispatch cycle after it went dry (this tick), not before, so
the underlying "±0 for a stretch" gap the candidate describes still happened. Filed WAVE
10 (5 shows: The Traitors UK, Married at First Sight Australia, The Real World, Ink
Master, So You Think You Can Dance). Fourth consecutive empty-queue occurrence across
waves 7/8/9/10 reinforces the same underlying point — score unchanged, still unpromoted.
**Update (expand pass 55, 2026-07-12):** the queue ran dry a fifth time — wave 10's five
rows all resolved [x] within a day of filing (Traitors UK, MAFS Australia, Real World,
Ink Master, So You Think You Can Dance all shipped by content-drain ticks in the same
window), running Pending show rows back to exactly 0 again. Caught the same structural
way as pass 54 — `/march`'s own Step 3b.5 found zero Pending `category: content-gaps`
rows and fell through to the expand gate. Filed WAVE 11 (5 shows: Big Brother UK,
RuPaul's Drag Race Down Under, Love Island Australia, The Real Housewives: Ultimate
Girls Trip, Selling the OC) — this wave leans entirely on international-edition/spinoff
depth rather than new format clusters, since WAVE 10 closed the catalog's remaining
format-diversity gaps (body-art, dance). Fifth consecutive empty-queue occurrence across
waves 7/8/9/10/11 — the underlying cadence question this candidate raises (should the
queue be refilled proactively at ≤2 rather than caught reactively at 0 by march's
fallthrough) remains open and unpromoted. The march-level fallthrough catch continues to
work every time it's been tested (passes 54, 55), which is real evidence the reactive
path is reliable enough in practice that the proactive skill-file amendment may be
lower-priority than this candidate's score implies — noting that for `/oversight`'s
next review rather than pre-judging it here.

### 20. Inline partial-canon coverage disclosure — ranking-list coverage note

**Score:** 6.6 (impact: 7, ease: 8 → 5.6 base + 1.0 signal multiplicity)
**Source pass:** 38
**Filed:** 2026-06-21
**Source signals:**
- Critique pass-58 [MED] /shows/survivor-australia — "Five seasons in" methodology copy
  vs "12 SEASONS AIRED" stat strip; a scan-reader sees 12 in the hero and then counts
  5 entries in the ranking list with no inline explanation.
- Critique pass-58 [MED] /shows/love-is-blind — "all five seeded seasons" methodology
  copy vs "10 SEASONS AIRED"; the word "all" implies no remaining seasons.
- Critique pass-59 [MED] /shows/dancing-with-the-stars — "covers the full run" methodology
  copy vs "ALL 16" era counter and "34 SEASONS AIRED"; the strongest case of the class.
- Critique pass-62 [MED] /shows/rhobh — partial canon (5 of 15 seasons); no inline signal
  near the ranking list; methodology disclosure is buried below the fold.
- Critique pass-62 [MED] /shows/masterchef-australia — partial canon (5 of 16 seasons);
  same structural absence as RHOBH.
- Pass-40 reinforcement (this pass): /shows/survivor-australia — methodology "Five
  seasons in..." vs "12 SEASONS AIRED" stat strip; same class, 6th distinct show.
- Signal multiplicity: 6 shows, 5 critique passes, same structural gap. Class grows as
  new shows are added with partial canons — the catalog will not stop at 6 cases.

**Why:** Every show whose canon covers fewer seasons than the total aired count has the
same gap: a scan-reader who sees "12 SEASONS AIRED" (or 15, or 16, or 34) in the hero
stat strip and then counts 5 entries in the ranking list has no inline explanation. The
methodology section clarifies — but it requires scrolling past the stat strip and the
partial ranking list itself. The partial-canon state is permanent for every new show
until its drain completes; the class will keep growing. The fix is a small conditional
render in the `ShowRanking` component: when `canon.entries.length < show.seasons`,
display a one-line note above the ranking list — e.g. "Seasons 1–5 reviewed so far.
More being added." — so the disclosure is in context, visible to any scan-reader who
sees the list. This is distinct from the content fixes to individual `meth_who_p` fields
(candidate #21 handles those); the inline note is a UI component change that covers all
partial-canon shows automatically without per-show content authoring.

**Scope sketch:**
- `src/components/canon/ShowRanking.tsx` (or equivalent show-page ranking component):
  add a conditional `<p className="coverage-note">` that renders when
  `canon.entries.length < show.seasons` — something like "Reviewing seasons 1–N of M.
  More coming." Exact copy matches the site's plain-spoken register; no exclamation
  point; exact wording at fix-time.
- Colocated test: renders the note when partial; renders nothing when canon is complete
  (`entries.length === show.seasons`); correct N and M substitution.
- e2e: one of the partial-canon show pages (e.g. `/shows/survivor-australia`) asserts
  the coverage note is present; one complete-canon show page asserts it is absent.
- Spoiler P0 intact — coverage note is structural; references only season counts, never
  outcomes or rankings.
- `content-curator` brief update: document the note so curators don't duplicate it in
  `meth_who_p` text (the UI handles the disclosure, so methodology prose can drop the
  coverage-count sentence).

**Estimated phases:** 1.
**Conflicts:** Complementary to candidate #21 (meth_who_p content gate). Independent fix
paths: #20 is the product-visible component addition; #21 is the authoring-discipline gate.
Both should land; #20 is higher urgency (reader-visible today on 5+ shows).

### 21. meth_who_p misleading-completeness guard + content-check gate

**Score:** 5.5 (impact: 6, ease: 8 → 4.8 base + 0.7 signal multiplicity)
**Source pass:** 38
**Filed:** 2026-06-21
**Source signals:**
- Critique pass-58 [MED] /shows/love-is-blind — `meth_who_p` opens "I've watched all
  five seeded seasons from the Atlanta original through Houston." The word "all" implies
  completeness when 10 seasons have aired; the WHEN section clarifies, but a scan-reader
  of the WHO section does not reach it.
- Critique pass-59 [MED] /shows/dancing-with-the-stars — `meth_who_p` opens "The ranking
  covers the full run — from the double-cycle Tom Bergeron era through the simulcast
  seasons." The phrase "covers the full run" is an unconditional completeness claim;
  the era toolbar's "ALL 16" counter contradicts "34 SEASONS AIRED" without an inline bridge.
- Critique pass-62 [MED] /shows/masterchef-australia — tagline resolves to "In seventeen
  years on Network Ten" while stat strip shows "16 SEASONS AIRED"; adjacent on the page,
  the two numbers read as a contradiction to a first-time visitor.
- Signal multiplicity: 3 shows, 3 distinct critique passes, same reader-trust root cause
  (misleading language implying full coverage when canon is partial). Pattern will recur as
  the catalog grows — `content-curator` has been briefed but the authoring gap persists.

**Why:** Three shows carry `meth_who_p` text (or taglines) that imply full-catalog coverage
when the canon is partial. The individual content fixes are /iterate-shaped (one per tick),
but the structural recurrence — 3 cases across 3 critique passes — confirms the `content-
curator` brief alone is not sufficient. The established lax→strict verify-gate pattern
(phases 41–46) resolves this class: add a `collectMethWhoCompletionIssues()` scanner in
`scripts/content-check.ts` that flags `meth_who_p` text containing completeness phrases
("all \w+ seasons", "covers the full run", "complete run") when `canon.entries.length <
show.seasons`, then drain the 3 known violators before flipping strict. Once strict, a new
show's canon draft cannot ship with misleading language — the verify gate blocks it.

**Scope sketch:**
- `scripts/content-check.ts` — add `METH_WHO_COMPLETION_STRICT` flag +
  `collectMethWhoCompletionIssues()`: for each show's `canon.md`, when
  `entries.length < show.seasons`, check `meth_who_p` for any of the flagged phrases
  (case-insensitive). Lax mode emits a warning; strict mode fails. Colocated unit tests
  (phrase match / no phrase / complete canon cases).
- Author replacement `meth_who_p` text for 3 known violators: Love Is Blind (remove "all"
  from "all five seeded seasons"); DWTS (replace "covers the full run" with explicit partial
  coverage sentence); MCA (no `meth_who_p` change needed — the tagline years-vs-seasons
  conflict is content-check candidate #22; the methodology section itself may be fine).
- Flip `METH_WHO_COMPLETION_STRICT = true` in the same commit (drain before flip, same
  day-one-strict pattern as phases 44/45/46).
- Update `content-curator` brief: when authoring `meth_who_p` for a partial-canon show,
  never use "all seasons" / "full run" / "complete" — use an explicit count instead.

**Estimated phases:** 1.
**Conflicts:** Complementary to candidate #20 (inline UI note). #20 fixes the reader-visible
gap; #21 fixes the authoring source. No URL change. No schema change. SEO-neutral.

### 22. Tagline years-vs-seasons clarification gate

**Score:** 5.5 (impact: 6, ease: 9 → 5.4 base + 0.1 weak multiplicity)
**Source pass:** 38
**Filed:** 2026-06-21
**Source signals:**
- Critique pass-62 [MED] /shows/masterchef-australia — tagline `{yearsWord}` token
  expands to "seventeen years" while hero stat strip shows "16 SEASONS AIRED"; adjacent
  on the same page, the two numbers read as a discrepancy to a first-time visitor who
  does not know MCA skipped a production year.
- Critique pass-62 [MED] /shows/rhobh — tagline `{yearsWord}` expands to "sixteen years"
  while stat strip shows "15 SEASONS AIRED"; same class, same page-proximity trigger.
- Structural risk: the `{yearsWord}`/`{years}` tokens are correct (they expand to calendar
  years since `est_year`), but any show with even one production gap will have
  `yearsSinceEst() > seasons`, making the tagline's year count ≠ the stat strip's season
  count. As the catalog grows, more shows with production gaps will hit this.

**Why:** The `{yearsWord}` token system (phase 43) correctly replaces hardcoded year counts
with a derived value, preventing rot. But derived-correct ≠ scan-reader-safe: when a show
has production gaps, the number of calendar years since premiere is larger than the number
of seasons aired. On the show page these two counts appear close together — `{yearsWord}`
in the tagline directly below the hero stat strip — so a scan-reader sees "sixteen years"
and "15 SEASONS" in the same viewport and reads them as contradictory. The fix has two
components: (1) rewrite the 2 known violators to use seasons rather than years in the
tagline (`card_tagline` is already seasons-based for both — fix only the `tagline` field);
(2) add a content-check gate — when `tagline` or `card_tagline` contains `{yearsWord}` or
`{years}` token AND `yearsSinceEst(estYear) !== seasons`, emit a lax warning, flip strict
after drain. This is the same lax→strict pattern as phases 43–46; the `yearsSinceEst`
helper already exists in `src/lib/show-tenure.ts` (or equivalent) from phase 43.

**Scope sketch:**
- `scripts/content-check.ts` — add `TAGLINE_YEARS_SEASONS_STRICT` flag +
  `collectTaglineYearsVsSeasonsIssues()`: for each show, if `tagline` or `card_tagline`
  contains `{yearsWord}` or `{years}` AND `yearsSinceEst(estYear) !== seasons`, emit an
  issue with the divergence count. Lax logs warning; strict fails. Colocated unit tests
  (diverges / matches / token absent cases).
- Rewrite `tagline` in `content/shows/masterchef-australia.md`: change "In {yearsWord}
  years on Network Ten, the Australian version…" to "Across sixteen seasons on Network
  Ten, the Australian version…" (seasons-anchored, non-rotting, since MCA's exact count
  at author time is already verified in frontmatter). Do the same for `rhobh.md`.
- Flip `TAGLINE_YEARS_SEASONS_STRICT = true` in the same commit (2 violators drained).
- Update `content-curator` brief: prefer `seasons` over `{yearsWord}` in taglines for
  shows with declared production gaps; reserve `{yearsWord}` for taglines where the year
  count IS the editorial point (e.g., "A quarter-century of…").

**Estimated phases:** 1.
**Conflicts:** Extends phase-43 (editorial-copy honesty sweep) into a new vector. No URL
change. No schema change. Complements candidates #20 and #21 — together the three
candidates make partial-canon honesty structural rather than one-off.

### 23. Prose sentence-capitalization invariant (post-period lowercase-start guard)

**Score:** 6.4 (impact: 6, ease: 9 → 5.4 base + 1.0 signal multiplicity)
**Source pass:** 40
**Filed:** 2026-07-03
**Source signals:**
- Critique pass-53 [LOW] /shows/below-deck-mediterranean — `blurb` reads "...Captain
  Sandy Yawn holding the helm. ten years of superyacht drama..." — lowercase "ten" opens
  a new sentence after a full stop.
- Critique pass-53 [LOW] /shows/below-deck-sailing-yacht — same pass, same class:
  "...the Mediterranean underfoot. six years of Glenn Shephard..." — lowercase "six".
- Critique pass-58 [LOW] /shows — Dancing with the Stars B-tier tile `card_tagline`:
  "one mirror ball at the end. twenty-one years, 34 seasons." — lowercase "twenty-one"
  after a full stop; root cause is the `{yearsWord}` token expanding to a lowercase
  number-word at a sentence-initial position.
- Critique pass-66 [LOW] /shows/masked-singer — meta description: "...viewers guess
  along. seven years on the air." — same class, third distinct critique pass.
- Signal multiplicity: 4 shows, 3 distinct critique passes (53, 58, 66), all in
  free-text frontmatter fields (`blurb` / `tagline` / `card_tagline`). Every instance
  is independently filed as "content-only fix" — confirming this is a recurring
  authoring habit (writing a lowercase number-word or clause fragment, then reusing
  it at a sentence-initial position elsewhere), not a single shared code bug. It
  reaches search-engine snippets and social-card previews directly (`descriptionFor()`
  passes these fields through verbatim), so the defect is reader-visible off-site too.

**Why:** Four independent shows across three separate critique passes exhibit the
identical copy-error shape: a period is immediately followed by a lowercase word,
almost always because a `{yearsWord}`-style token or a hand-written clause fragment
lands at a sentence-initial position without capitalization. This is mechanically
detectable — a regex over each show's `blurb` / `tagline` / `card_tagline` for
`/\.\s+[a-z]/` catches every instance in this class before it ships — and matches the
project's proven `lax→strict` content-check pattern exactly (phases 41/42/43/44/45/46,
candidates #12/#13/#17 already shipped or awaiting promotion using the identical
mechanic). `scripts/content-check.ts` already carries 20+ STRICT invariants of this
exact shape; this is a clean, low-risk extension, not a new pattern.

**Scope sketch:**
- `scripts/content-check.ts` — add `PROSE_CAPITALIZATION_STRICT` flag +
  `collectSentenceCapitalizationIssues()`: for each show's `blurb`, `tagline`, and
  `card_tagline` (and equivalent theme/canon prose fields if present), regex-scan for
  a period followed by whitespace and a lowercase letter; emit an issue with the
  offending fragment. Lax mode logs warning; strict mode fails. Exempt known
  intentional lowercase-continuation styles (e.g. em-dash constructions) by scoping
  the regex specifically to `. ` + lowercase, not `— ` + lowercase.
- Drain the 4 known violators: capitalize the lowercase word, or (preferred, per the
  individual critique findings' own suggested fixes) restructure the clause to use an
  em dash or comma instead of a period where a `{yearsWord}`-style token would
  otherwise open a new sentence in lowercase.
- Flip `PROSE_CAPITALIZATION_STRICT = true` in the same commit (4 violators, small
  surface, day-one-strict pattern).
- Update `content-curator` brief: never let a derived token (`{yearsWord}`, `{years}`,
  etc.) expand at a sentence-initial position — prefer em dash/comma constructions
  when a clause built from a lowercase-word token needs to follow a completed sentence.
- Colocated unit tests for `collectSentenceCapitalizationIssues` (violation / clean /
  em-dash-exempted cases).

**Estimated phases:** 1.
**Conflicts:** None. No URL change, no schema change, no UI change — content-only +
one content-check invariant, same shape as candidates #12/#17/#22.

<!-- Pass 40 (2026-07-03, commit 81e56e8) — 1 new candidate filed (#23); candidates
     #15 and #20 substantially strengthened with new signals (not re-filed as new
     numbers — same established pattern as passes 36/38/39).
     Window since pass 39 (295b6cc, 2026-06-22): 11 days / 45 commits. Both
     thresholds (20 commits, 48h) exceeded by a wide margin.
     Signals reviewed:
     - AUDIT.md: 1 pending row, category: engineering (check-test-colocation Windows
       path-matching bug, score 3.5, filed during the nexus readopt) — single item,
       /iterate-shaped, not a phase cluster.
     - CRITIQUE.md: 63 pending rows (up substantially since pass 39). Direct corpus
       verification (`rg -L tier_s_blurb content/shows/*/canon.md`) found **20 of 43
       shows (46%)** currently missing `tier_s_blurb` — far beyond what any single
       critique row states individually; this single class now dwarfs every other
       pending finding in volume and is the clearest phase-shape signal in the file.
       Candidate #15 rewritten to reflect this (score 5.8 → 9.2). Candidate #20/#21's
       partial-canon-disclosure class gained a 6th instance (survivor-australia,
       pass-58) — #20 signal list updated. A new cluster emerged: 4 shows / 3 passes
       (53, 58, 66) share a lowercase-sentence-after-period copy defect in
       `blurb`/`tagline`/`card_tagline` fields — filed as new candidate #23. Two
       weaker, non-clustering signals noted but not promoted to candidate status:
       (a) /shows/americas-next-top-model "cycles" vs "seasons" terminology mismatch
       (pass-61, single instance); (b) /shows/american-idol stale future-tense
       methodology copy ("still being added as the scrutiny catches up") contradicting
       a now-complete 23/23 canon (pass-63, single instance, also flagged separately
       as internal-jargon leakage — 2 total jargon instances across the corpus,
       below the 3-instance clustering bar).
     - GitHub issues: 0 unlabeled (gh authenticated via CI env token, no `.env` file
       present in this cloud run — not a failure, `GH_TOKEN`/`GH_REPO` resolved from
       the ambient `gh auth` session instead).
     - spec.md + design/: no changes since pass 39.
     - Data growth: 43 shows now (vs ~30s at pass 39) — continued show-coverage
       mandate velocity (Selling Sunset, Jersey Shore, Queer Eye landed most
       recently per commit log) is the direct driver of the tier_s_blurb class
       reinforcement above — every new show is a fresh chance to omit the field.
     - Commit pattern: 45 commits since pass 39 — dominated by content-gap show/season
       drains and per-show critique-fix commits; no 5+ commit fix-cluster on any
       single code surface beyond the tier_s_blurb / capitalization classes already
       captured above.
     Existing candidates status: #12 (BRAND_SPELLING_STRICT) — still awaiting
     promotion. #14 (era toolbar polish) — still awaiting promotion. #15
     (CANON_COMPLETENESS_STRICT) — substantially reinforced this pass (see above);
     this is now the single strongest unpromoted candidate in the file. #16
     (/u/[handle] stat chips) — still [needs-user-call]. #18 (header affordance) —
     still awaiting promotion. #19 (last-revised source-of-record) — still awaiting
     promotion. #20/#21 (partial-canon disclosure pair) — #20 reinforced with a 6th
     violator. #22 (tagline years-vs-seasons) — no new instances this pass. #23
     (prose capitalization invariant) — new this pass. -->

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

<!-- Pass 36 (2026-06-19, commit bf9dffb) — 0 new candidates filed; AUDIT content-gap rows
     filed in plan/AUDIT.md (season drains + wave-4 shows).
     Window since pass 35 (0117ac6, 2026-06-17): 2 days (61h) / 21 commits.
     Signals reviewed:
     - AUDIT.md: 0 pending rows — critical: season drain rows for wave-3 shows
       (RHONY S6–S15, DWTS S2–S34, Love Is Blind S6–S10, Hell's Kitchen S6–S24,
       Australian Survivor S6–S12) never filed after their scaffolding ticks.
       Wave-4 new show rows also absent (show queue at 0). Both sets filed to
       AUDIT.md in this same commit (category: content-gaps, source: expand).
     - CRITIQUE.md pending (2 LOWs from pass-57): DWTS tier_s_blurb absent (all
       entries in S tier, heading = blurb dup); BDM tier_s_blurb absent (same
       class). These are the 4th and 5th distinct show violations of the same
       class (after below-deck pass-52, Traitors pass-54, DWTS pass-57, BDM
       pass-57). Strengthen existing candidate #15 (CANON_COMPLETENESS_STRICT).
       Not a new candidate — #15 already names this fix exactly.
     - GitHub issues: 0 unlabeled.
     - spec.md + design/: no changes.
     - Commit pattern: 21 commits — content velocity (5 new shows/drains), 1
       critique pass (57), 1 critique-find fix (HomeShowGrid A-tier stat strip).
       No 5+ fix-cluster on any code surface.
     Existing candidates status: #15 (CANON_COMPLETENESS_STRICT) — reinforced
     by pass-57 (4th + 5th violation of same class); promotion justified by
     signal multiplicity now. #16 (/u/[handle] stat chips) — awaiting user call.
     #18 (signed-in header affordance) — awaiting promotion. #19 (last-revised
     source-of-record) — awaiting promotion. -->

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

**Score:** 5.8 (impact: 7, ease: 7 → 4.9 base + 1.3 signal multiplicity —
reinforced pass 41)
**Source pass:** 33 → reinforced pass 41
**Filed:** 2026-06-15 · **Reinforced:** 2026-07-04 (pass 41)
**Source signals:**
- Critique pass-52 [MED] TITHERADGE ERA tab renders with zero
  matching entries (below-deck canon covers S1–S5 [2013–2022];
  the Titheradge era band spans [2024, 2026] with no ranked
  seasons yet) — confirmed at `src/components/canon/CanonEraToolbar.tsx`.
- Critique pass-51 [LOW] KISH ERA filter tab is opaque; a first-time
  visitor does not know who "Kish" is or when the era starts.
- Critique pass-52 drop (same defect class, cap): COLBY ERA on Alone
  carries the same opacity as KISH ERA.
- **Pass-41 reinforcement:** 2 more live instances confirmed. (a)
  pass-56 (`plan/CRITIQUE.md:2008`) — `/shows/below-deck` "LEE ERA" and
  "TITHERADGE ERA" chips carry no parenthetical season range, same
  no-range-context defect as KISH/COLBY. (b) `/shows/alone` "no-host era"
  reference (`plan/CRITIQUE.md:2195`) names an era without stating which
  seasons it covers, despite 12 seasons aired and only 5 currently in
  canon. Both nest exactly in this candidate's existing scope (auto-derive
  a parenthetical range from `era_bands[i].range`); no new candidate.
- Signal multiplicity: two distinct fix types (empty-state rendering,
  label context) on the same component, now across 5+ shows.

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

**Score:** 9.4 (impact: 9, ease: 9 → 8.1 base + 1.3 signal multiplicity — content
batch now fully drained, narrowing remaining scope to the gate alone; cheaper
and lower-risk than at any prior filing)
**Source pass:** 33 (filed) → reinforced passes 35/36/38/39/40/41 (this pass)
**Filed:** 2026-06-15 · **Reinforced:** 2026-07-04 (pass 41)
**Pass-41 update:** the 20-file `tier_s_blurb` content batch this candidate
scoped is now **fully drained** — direct verification this pass
(`rg --files-without-match tier_s_blurb content/shows/*/canon.md`) returns
zero files; all 43 shows in the current catalog carry the field. The batch
landed via ordinary `/iterate` audit ticks (commits 51dd0fd + 2952ae1) ahead
of promotion, not via this candidate. **This changes the remaining scope**:
what's left to promote is the `content-check.ts` invariant alone (no content
batch owed) — smaller, cheaper, and the recurrence risk it exists to close
is now empirically proven (46% of the pass-40 catalog drifted before the
gate existed). The scope sketch below is retained for the historical batch
record but the batch itself no longer needs to ship with the promotion.
**Source signals:**
- Critique pass-52 [MED] /shows/below-deck — original finding: S-tier heading
  and blurb identical, `tier_s_blurb` absent, fallback equals the heading.
  (Resolved individually — see below.)
- Passes 53–66 (16 additional critique rows, still Pending as of pass 40):
  the-apprentice, masked-singer, americas-got-talent, americas-next-top-model,
  american-idol (also missing `tier_a_blurb`), the-voice, rhoa,
  dancing-with-the-stars — each an independent critique-filed instance of the
  identical `tier_s_blurb`-absent visual duplication.
- Pass-61 finding (`plan/CRITIQUE.md:2108`) explicitly names 8 more unfiled
  violators found by direct corpus inspection: alone-australia, alone-frozen,
  alone-the-skills-challenge, below-deck-adventure, below-deck-down-under,
  below-deck-sailing-yacht, hells-kitchen, love-is-blind.
- **Pass-40 direct verification** (this pass, `rg -L tier_s_blurb
  content/shows/*/canon.md`): **20 of 43 shows in the live catalog (46% of
  the entire show catalog) currently lack `tier_s_blurb`** — alone-australia,
  alone-frozen, alone-the-skills-challenge, american-idol,
  americas-got-talent, americas-next-top-model, below-deck-adventure,
  below-deck-down-under, below-deck-sailing-yacht, dancing-with-the-stars,
  hells-kitchen, jersey-shore, love-is-blind, masked-singer, queer-eye, rhoa,
  rhobh, selling-sunset, the-apprentice, the-voice. (rhony, below-deck,
  below-deck-mediterranean — cited in older critique rows — have since been
  drained individually and are no longer violators; confirms the fix pattern
  works but is not keeping pace with new-show velocity.)
- Root cause confirmed in code: `src/components/canon/CanonTierBand.tsx:82`
  — `const blurb = band.blurb ?? DEFAULT_TIER_HEADINGS[band.key]` —
  `DEFAULT_TIER_HEADINGS` (`src/lib/canon/tier-bands.ts:18`) is keyed by all
  three tiers (S/A/B), so the same fallback-duplication bug can occur for
  any tier, not only S — the invariant should check all three.
- Signal multiplicity: now the single most cited recurring defect class in
  `plan/CRITIQUE.md` (17+ Pending rows across 8+ distinct critique passes),
  and independently reproducible via a one-line corpus grep. No candidate in
  this file has anywhere near this volume of reinforcement.

**Why:** This was already correctly diagnosed at filing (pass 33) as an
architecturally-guaranteed recurrence — `CanonTierBand`'s fallback string
equals its own headline string, so any show shipped without an explicit
`tier_s_blurb` (or `tier_a_blurb`/`tier_b_blurb`) duplicates a sentence on
its own page. What's changed by pass 40 is scale: the standing "always be
adding new shows" mandate (`bearings.md` Rule 1) has driven the catalog from
13 shows (pass 33) to 43 shows (pass 40), and this content-check gate was
never promoted — so **every** new show authored since pass 33 without an
explicit tier blurb has silently reproduced the bug. Nearly half the live
catalog exhibits a reader-visible duplicated sentence today. This is no
longer "one fix" scope, it's "backfill 20 files + ship the gate that stops
the 21st." The fix mechanic is unchanged and proven (2 of the original
violators — below-deck, rhony — were already drained by hand, confirming
the remediation is mechanical and low-risk); what's missing is the
verify-time gate that would have prevented the other 20.

**Scope sketch:**
- `scripts/content-check.ts` — add `CANON_COMPLETENESS_STRICT` flag:
  (a) `collectTierBlurbIssues()`: emit issue when any of `tier_s_blurb` /
  `tier_a_blurb` / `tier_b_blurb` is absent AND that tier's `DEFAULT_TIER_HEADINGS`
  fallback would visually duplicate the tier's own headline (i.e. always,
  since the fallback *is* the headline) — lax mode logs warning per missing
  field; strict mode fails.
  (b) `collectEraBandGapIssues()` (unchanged from original filing): emit
  issue when any era band's `[start, end]` range contains no canon entry
  whose `premiere_date` falls within it.
- ~~Batch-author the missing field for all 20 currently-verified violators~~
  — **done as of pass 41**, drained via ordinary iterate ticks ahead of
  promotion (commits 51dd0fd + 2952ae1). No content batch owed at
  promotion time; verify with a fresh `rg --files-without-match` pass at
  ship-time in case new shows landed since.
- Flip `CANON_COMPLETENESS_STRICT = true` in the same commit — the corpus
  is already at 0 violators, so this can ship strict from tick one
  (mirrors the day-one-strict pattern of phases 44/45/46) with no drain
  window required.
- Update `content-curator` brief (and `skills/ship-content.md`'s new-show
  checklist) so every new show is authored with all three tier blurbs from
  the first tick — this is the actual recurrence-stopper; without it the
  next 30 shows reset the clock exactly as the last 30 did.
- Unit tests for `collectTierBlurbIssues` (pass / fail / all-three-tiers
  cases) and a corpus regression-pin test asserting 0 violators — now a
  same-tick assertion rather than a post-drain one.

**Estimated phases:** 1 (now content-check invariant only, day-one-strict;
no schema change, no URL change, no content batch — the batch already
shipped ahead of promotion).
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
**Conflicts:** **Pass-53 correction — real conflict found, was "None."**
The scope sketch's zeroed empty-state framing (`0 VOTES CAST · 0 COMMENTS ·
JOINED`) directly reopens a deliberately-closed editorial decision: CRITIQUE
pass-28 #293 explicitly removed a near-identical zeroed stat-tile row from
`/u/[handle]`'s self-view (the pass-16 #217 original), on the grounds that
stacking zero/absence tiles above the prose read as "an admin screen, not
an editorial product" (bearings voice bar — "knowledgeable peer, confident,
warm, plain-spoken"). The reversal is pinned as a regression test —
`src/components/profile/__tests__/ProfileEmpty.test.tsx:178` ("renders no
stat skeleton on self-view (#293 — pass-16 #217 reverted)") — and documented
inline at `src/components/profile/ProfileEmpty.tsx:28-36`. A still-Pending
CRITIQUE row (pass-37, `[needs-user-call]`, URL `/u/e2e`) re-raised this
exact zeroed-chip idea in a later `/iterate` tick and was correctly flagged
`[needs-user-call]` rather than auto-resolved, precisely because it
contradicts #293 — see `plan/CRITIQUE.md` search `pass-37` under `/u/e2e`.
Phase 38 shipped the page shell; this candidate fills the record zone, but
**only for the non-empty case** (real vote/comment counts on an account
with at least one of each) — `/oversight` should scope the promoted phase
to render `ProfileStatChips` exclusively once a member has ≥1 recorded
action, leaving `ProfileEmpty`'s zero-state prose-only framing untouched,
rather than the original scope sketch's implied always-visible chip row.
No URL change either way.

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

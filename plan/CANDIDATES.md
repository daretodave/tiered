# CANDIDATES

> Posture: **bold** (per `plan/bearings.md`).
> Last pass: 2026-10-27 at commit 212a55dd
> Pass count: 76
> Last field research: 2026-10-27

## Pending

### [x] [score 5.4] `scripts/pulse.mjs` AUDIT pending count always reads 0 — wrong regex for `plan/AUDIT.md`'s row format
- kind: guard
- proposed: 2026-10-31 (digest)
- source signals: digest (2026-10-31): `pulse.mjs`'s `countRows()` matches `^### \[(?!x\])` — a heading-style row, the shape `plan/CRITIQUE.md` actually uses (`### [HIGH] ...`). `plan/AUDIT.md`'s own template is `- [ ] [SEV] <description>` (a dash-bullet, never a `###` heading) — confirmed against its own in-file comment and every real row in its Pending section. So every night's pulse read `audit 0 pending` regardless of the true count; tonight's hand-count under `## Pending` found 5 real open rows (1 standing MED, 1 `[needs-user-call]` HIGH, 3 LOW), none of which any pulse-driven digest line has ever surfaced.
- rationale: the digest's whole job is to compress the loop's state into one trustworthy snapshot; a silently-zero counter for an entire file is the opposite of that, and it already hid a real HIGH `[needs-user-call]` row (the Claude Code usage-cap outage backoff gap, filed 2026-10-19, score 2.7 — see tonight's `plan/DIGEST.md` Needs you) from every digest between 2026-10-19 and tonight.
- proposed scope: widen `countRows()` (or add a second matcher) to also count `^- \[ \] \[` dash-bullet rows, scoped to `plan/AUDIT.md`'s call site only (leave `plan/CRITIQUE.md`'s heading-style count untouched) — single function, one colocated test asserting a dash-bullet Pending row is counted and a `[x]`-checked one is not.
- estimated chunks: 1 (single script function + test)
- conflicts: none known — `pulse.mjs` is read-only tooling, not a gate or content rule.
- generator: digest · filed 2026-10-31
- SHIPPED 2026-11-01 (local session, built directly): `countRows()` moved to `scripts/lib/plan-rows.mjs`, now counts both `### [..]` headings and top-level `- [..]` bullets (skipping `[x]` and rows inside HTML-comment templates) for every call site; CRITIQUE/CANDIDATES counts unchanged (71/22), AUDIT reads 7 instead of 0. Tests: `scripts/__tests__/plan-rows.test.mjs`.

### [ ] [score 6.0] Graduated spoiler-risk labeling instead of a binary spoiler flag
- kind: product
- proposed: 2026-10-27 (research)
- source signals: field (2026-10-27): Some entertainment coverage grades a piece's spoiler risk on a scale tied to how far behind a reader might be, rather than a single binary spoiler/no-spoiler toggle.
- rationale: tiered.tv's whole premise is spoiler-safe coverage, currently enforced as a binary content-check gate (outcome language blocked outright). A graduated framing — e.g. distinguishing 'safe even mid-season' from 'safe only once a season has aired a few episodes' — is a pattern worth weighing against the current all-or-nothing gate, though the editorial voice may already prefer the simpler binary for…
- proposed scope: No code implied yet — a candidate for /oversight to weigh against the existing spoiler-discipline P0 gate (content-check's outcome-language blocklist) before any scope is sketched; the binary gate may already be the deliberately simpler, more trustworthy choice.
- estimated chunks: unknown until specced
- conflicts: none known.
- generator: research · filed 2026-10-27

### [ ] [score 5.0] Show-page ISR + client-hydrated ranking widget — stop forcing the whole page off the CDN edge for one live number
- kind: product
- proposed: 2026-09-26, v1 candidate #41 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 5.0 (impact: 6, ease: 7 → 4.2 base + 0.8 signal multiplicity —
reuses phase-36's auth-island client-hydration pattern; same source file as
resolved candidate #31)
**Source pass:** 73
**Filed:** 2026-09-26
**Why:** `src/app/shows/[show]/page.tsx:37` sets `dynamic = 'force-dynamic'`
— a deliberate phase-35 fix so the live Supabase community-ranking aggregate
never goes stale (closing the earlier "refresh always shows 0" bug), and
that freshness guarantee is correct and must not be reverted. But the fix
takes the entire page dynamic — hero, blurb, canon prose, stat tiles, none
of it live or personalized — just because one small widget needs live data.
Critique pass-96 measured the cost: `/shows/dragrace` serves
`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
with `x-vercel-cache: MISS` on every anonymous request (TTFB 190-557ms),
versus `public, max-age=0, must-revalidate` + `x-vercel-cache: HIT` (~100ms)
on the edge-cached hub pages (`/`, `/shows`, `/themes`). The URL contract
already documents `/api/ranking/[show]` as "cached aggregate, served via
ISR," and phase 36 already proved the exact hybrid pattern works for a
different live widget: a bold-but-tiny `GET /api/auth/me` client island
hydrates auth-state chrome over an otherwise-cacheable page. This is signal
B's shape from `skills/expand.md` §4 (a critique finding real enough to
need an architecture change, not a one-line fix) — and distinct from
resolved candidate #31, which profiled the same file's *query latency*
(fixed via `Promise.all`) but left the *rendering mode* untouched; the
`force-dynamic` export candidate #31 explicitly said not to revert is the
actual remaining cost here, paid via cache headers rather than compute
time. Scoped deliberately to this one route family: pass-96's finding also
names two more routes (`/themes/[theme]`, `/shows/[show]/season/[slug]`)
serving the identical private/no-cache headers with no `dynamic` export, no
`cookies()`/`headers()` call, and no live data fetch anywhere in their
render path — confirmed clean via `pnpm build` (`generateStaticParams`,
1,044+ and 178+ paths, `●` SSG, no revalidate window) — a mystery this loop
cannot root-cause without Vercel dashboard/build-log access. That half
stays a `[needs-user-call]` row in `plan/CRITIQUE.md`, not phase scope;
filing it as part of this candidate's estimate would misrepresent an
unscoped investigation as a scoped fix.
**Scope sketch:**
- Remove `dynamic = 'force-dynamic'` from `src/app/shows/[show]/page.tsx`;
  let the page shell return to ISR (static + revalidate), matching every
  other content page's caching shape.
- Client-hydrate just the live community-ranking numbers (rank order,
  approval %, vote counts, trend) from the already-ISR-cached
  `/api/ranking/[show]` route — same shape as the existing `/api/auth/me`
  client island (phase 36), not a new pattern.
- Confirm the "refresh always shows 0" bug (the original reason for
  `force-dynamic`) cannot recur: the widget's own client-side fetch must
  bypass any page-level cache the shell now carries.
- Colocated test asserting the page component no longer exports
  `dynamic = 'force-dynamic'` AND the ranking widget still reflects a fresh
  vote within one client refresh (no stale-zero regression).
- Explicitly out of scope: the season/theme dynamic-serving mystery
  (pass-96 part b) — recommend a separate Vercel dashboard/build-log
  investigation at the next `/oversight` session before any code is
  written against it.
**Source signals:**
- `plan/CRITIQUE.md` [MED, needs-user-call] pass-96 finding (URL:
  `/shows/dragrace`, `/themes/the-season-structure-never-holds-still`,
  `/themes/the-finals-never-run-the-same-course-twice`) — cache-header +
  TTFB measurements, root-cause confirmed for the show-page third via
  `force-dynamic`, ruled out for the other two via a clean `pnpm build`
  trace.
- Candidate #31 (resolved, pass 53) — same file, established the
  `Promise.all` query-latency fix while explicitly preserving
  `force-dynamic`; this candidate targets the rendering-mode cost that fix
  left untouched.
- Phase 36 (auth-state chrome) — the client-hydration-over-a-cacheable-shell
  pattern this candidate reuses, already shipped and proven on the same
  page family.
**Estimated phases:** 1 (single-route rendering-mode change + client
hydration; the season/theme half is explicitly excluded from this
estimate).
**Conflicts:** none. Independent of #30 (browse-filter chips) and #34
(e2e sharding) — different code paths; may be worth bundling into one
"catalog-scale infrastructure" oversight session alongside those if the
user wants to address the pattern class in one sitting.

### [ ] [score 3.0] `YEAR_TENURE_RE` teen-number blind spot — extend the editorial-tenure-honesty gate to season-level sources
- kind: guard
- proposed: 2026-09-16, v1 candidate #40 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 3.0 (impact: 4, ease: 5 → base 2.0 + 1.0 cheap-and-impactful (single
regex + type extension, closes a real gap in an existing P0-adjacent
invariant))
**Source pass:** 71
**Filed:** 2026-09-16
**Why:** Phase 43's editorial-tenure-honesty invariant
(`collectYearTenureIssues` in `scripts/content-check.ts`) is supposed to catch
every hardcoded year-tenure claim across show/season/canon copy, but
`YEAR_TENURE_RE` only matches spelled-out tens (twenty through ninety) — teen
phrases like "fourteen-year" or "twelve years in" are structurally invisible
to it. This was surfaced as a fix suggestion attached to CRITIQUE pass-80's
The Voice finding (closed via commit 0c917a9 / issue #504) but deliberately
deferred rather than shipped alongside the content fix, because a corpus scan
(`grep` across `content/shows/*.md`, `*/seasons/*.md`, `*/canon.md`) found the
widening isn't a simple regex edit: at least 10 existing teen-number tenure
phrases are historical facts anchored to a specific past season's air date
(e.g. `amazing-race/seasons/11-all-stars.md` "first ten years back on the
starting line", `big-brother/canon.md` "returns after fourteen years"), not
live claims against "today." Naively widening the regex today would fail
every one of those ten on the very next tick, since `TENURE_ANCHOR_ALLOWLIST`
only exempts entries keyed by (show, canon-entry-title) — season-level
eyebrow/lede/pull sources have no `entryTitle` and can't be allowlisted
through that path. This is exactly signal A's shape from `skills/expand.md`
§4 (an audit finding that's real but not a one-line fix) with a twist: it's
LOW severity (2.7) rather than high-impact, so it sits stuck below
`/iterate`'s 3.0 dispatch floor indefinitely with no other path to ship.
**Scope sketch:** Extend the `TenureAnchor`/`isAnchorAllowed` machinery in
`scripts/content-check.ts` to accept season-level sources (not just canon
entries) — likely a new anchor key shape keyed on (show, season number,
field) rather than (show, canon-entry-title). Populate the ~10 already-
identified historical phrases as allowlist rows (cross-verify each against
its season's actual air date at fix time, per the corpus-scan list in the
AUDIT.md row). Widen `YEAR_TENURE_RE` to also match teen numbers
(ten/eleven/twelve/thirteen/.../nineteen) once every existing hit has a home
(either the allowlist or a genuine rewrite to a token/milestone form).
Single-file engineering change, one content-check colocated test extension,
no page code.
**Source signals:**
- `plan/AUDIT.md` [LOW] row (score 2.7): `YEAR_TENURE_RE` only matches
  spelled-out tens, teen-number tenure phrases structurally invisible to the
  editorial-tenure-honesty invariant; ~10 historical teen-number phrases
  already catalogued via corpus scan.
- CRITIQUE pass-80 (closed, commit 0c917a9 / issue #504): the original
  finding whose suggested fix ("widen `YEAR_TENURE_RE` to also match teen
  numbers") was deferred rather than shipped, creating this exact gap.
**Conflicts:** none — extends an existing, already-shipped-strict invariant
(phase 43) rather than introducing a new rule; doesn't touch `spec.md` or the
URL contract.

### [ ] [score 4.4] Heartbeat flatline-alert false-positive hardening — require persistence across reads before paging
- kind: guard
- proposed: 2026-09-16, v1 candidate #39 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 4.4 (impact: 3, ease: 8 → base 2.4 + 2.0 cheap-and-impactful
(single-workflow-file fix, root cause already diagnosed, exact remedy already
sketched inline in the audit row))
**Source pass:** 71
**Filed:** 2026-09-16
**Why:** `.github/workflows/heartbeat.yml`'s "alarm if march has not
completed a tick in 14h" step filed a false-positive issue (#806,
2026-09-10) claiming no completed march tick in 86 hours. The audit row
verified via `gh run list --workflow march --status completed` that march
ticks had actually completed every 2-6h continuously through the claimed gap
window — the check reads only the single most-recent `--status completed`
run via `-L 1`, and at the moment it queried (5 minutes after a new march run
had started but before it finished), the GitHub Actions API's "most recent
completed" read appears to have returned a stale result rather than the true
last-completed run (~2.3h prior), most likely a transient API
read-consistency glitch rather than a real gap. A false "the loop has
flatlined" alarm is exactly the kind of noise that erodes trust in the
heartbeat mechanism and wastes a triage cycle on a non-issue — the opposite
of what the heartbeat exists to do. This is a real, scoped signal (score
2.1) sitting below `/iterate`'s 3.0 dispatch floor with no other consumer;
the audit row itself already sketches the fix, it just needs a phase slot to
land in.
**Scope sketch:** Harden `.github/workflows/heartbeat.yml`'s flatline check
so a single stale API read can't page a false alarm — either (a) require the
gap to persist across two consecutive 6h heartbeat firings before creating
an issue, or (b) check the last 3 completed runs (`-L 3`) via the GitHub API
and alarm only if all three reads agree the gap is real, rather than trusting
one `-L 1` read. Single workflow-file change; no app code touched.
**Source signals:**
- `plan/AUDIT.md` [LOW] row (score 2.1, user-issue #806): full root-cause
  analysis already done, false-positive confirmed via `gh run list`
  cross-check, fix approach already sketched ("next:" note inline).
**Conflicts:** none — CI/ops-only, doesn't touch `spec.md`, the URL
contract, or any content rule.

### [ ] [score 7.5] Spoiler-language heuristic gate — content-check should flag outcome/twist-coded phrasing, not just a proper-noun blocklist
- kind: guard
- proposed: 2026-09-09, v1 candidate #38 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 7.5 (impact: 9, ease: 5 → 4.5 base + 2.0 signal multiplicity (three
independent critique passes, three different shows, three different surface
shapes, all converging on the same mechanical gap) + 1.0 cheap-and-impactful
(single content-check addition, protects the whole-site brand promise going
forward))
**Source pass:** 70
**Filed:** 2026-09-09
**Why:** `agents.md` §7 makes spoiler discipline P0 — "the seasons, ranked. no
spoilers" is the brand promise itself, not an editorial nicety. The only
mechanical defense in `scripts/content-check.ts` today is
`collectThemedEntrySpoilerIssues` — a hand-curated proper-noun blocklist
(`Edge of Extinction`, `Redemption Island`, `fire token`), scoped to Survivor
only and to themed-list `entries[].blurb` only. It has never been extended
since it shipped (critique pass-13, 2026-05-xx). In the last five weeks,
`/critique` has independently caught three live, production-shipped spoiler
leaks this blocklist structurally cannot see, because none of them are a
blocklisted proper noun: pass-152 named an individual Miss Congeniality
winner on `dragrace-uk/season/series-7` (a person's name, not a "twist
mechanic"); pass-155 stated a finale prize-split outcome as settled fact
across five separate fields on `too-hot-to-handle/season/season-6` (`lede`,
`episodes_caption`, markdown body, a `watch_list` entry, and `shape_h2` —
none of them a themed-list entry blurb); pass-156 used spoiler-coded "twist"
language on a themed-list entry (`too-few-to-call-it-all-stars` #03) whose
pre-announced status was never verified before shipping. All three were HIGH
severity, all three reached production before a human-style critique pass
caught them, and all three were fixed as one-off content rewrites with no
change to the mechanical gate — the same shape of gap candidate #25
(verbatim-argument echo) documents for repetition, now showing up for
spoilers. Three independent instances, three different shows, three
different field shapes, in five weeks is a pattern, not noise.
**Scope sketch:** Extend `scripts/content-check.ts` with a second, broader
spoiler-risk pass distinct from the existing proper-noun blocklist:
- A curated list of outcome-signaling *phrase patterns* (not proper nouns) —
  "names the winner", "is crowned", "takes home", "wins the season", "splits
  the prize", "reveals that" combined with a definitive/past-tense frame,
  etc. — scanned across every season-page prose field (`lede`, `pull`,
  `episodes_caption`, `format_caption`, body, `watch_list` entries,
  `shape_h2`) and every `canon.md` rationale/`slot_argument`, not just
  themed-list blurbs.
- Ship as a **warning, not a hard fail** at first (false-positive risk is
  real — "the format changes for the first time" is fine, "the winner is
  crowned for the first time" is not, and a regex can't reliably tell them
  apart) — surface matches in `pnpm content:check` output for
  `content-curator`/reviewer attention, the same posture
  `collectThemedEntrySpoilerIssues` could have started at before going
  strict.
- Fold the check into `ship-content`'s pre-flight checklist (§2.5) and
  `/critique`'s own spoiler-check pass so both the authoring and detection
  sides gain the same net.
- Leave the existing Survivor proper-noun blocklist as-is — it's a
  different, complementary defense (named mechanics vs. generic outcome
  language), not something this replaces.
**Estimated phases:** 1.
**Conflicts:** none. Complements — does not duplicate — the pass-13
themed-entry spoiler blocklist and the general spoiler-discipline language in
`agents.md` §7 / `ship-content.md` §5.2.

     Window since pass 68 (b68021b8, 2026-09-04): 2 days / 20 commits.
     Preceding dispatch context: march Step 1 (triage) found 0 unlabeled
     issues. Step 0.5 finale gate: 17 calendar entries, 0 due. Step 1.5:
     season-sweep ran earlier this same tick's window (ninth full pass, 0
     new gaps, gap held at 41 shows/42 gap-slots, all starred); show-add
     stays LOCKED. Step 2.0's shipping-mode gate stayed lifted (Phase 36
     `[x]`, no `[ ]` phase rows). The critique gate did not fire: last
     pass (153) landed the same window at commit dedb99b7, only 6 commits
     and ~15.5h before this tick — short of both the 12-commit and 24-hour
     thresholds. Step 3a/3b empty (no pending phase rows, no Pending
     category:data AUDIT rows). Step 3b.5 matched its usual candidate,
     the standing Rule 2 season-fill drain row (score 4.5) — but every one
     of the `plan/CADENCE.md` gap table's 42 slots is starred
     (confirmed-but-unaired), the same full-board-stall state passes
     67/68 and this same tick's own sweep documented, so no season was
     actually actionable. Rule 3 (themed lists) stays locked behind the
     non-zero gap table. This left the dispatch to fall through to
     `/expand`'s own gate, which opened independently (posture bold, last
     pass exactly 20 commits ago — meeting the 20-commit threshold — live
     AUDIT.md signal present, no phase/data work pending) and fired,
     reaching this pass.
     Signals reviewed:
     - `plan/AUDIT.md` Pending (non-content-gaps): the same 3 real
       HIGH/MED rows as recent passes — night.yml starvation (HIGH, 6.4),
       e2e-full duration-ceiling (MED/HIGH-equivalent, 5.4), the-voice
       factual corruption (HIGH, 4.8) — mapping onto already-filed
       candidates #35, #34, #36 respectively; no new AUDIT row since
       pass 68.
     - `plan/CRITIQUE.md` Pending: passes 152 and 153 (2026-09-05,
       2026-09-06) both landed since pass 68 and both reproduced the
       exact cross-field-repetition defect class candidates #25 (season-
       body/canon-rationale echo) and #28 (stat-tile value/caption
       duplicate) already track — `below-deck-mediterranean/
       dubrovnik-ii` (HIGH, still Pending), `naked-and-afraid/
       the-active-season` (MED, resolved same-day), `dragrace-uk/
       series-7` and `jersey-shore/the-final-season` (both #28-shape,
       resolved same-day). Reinforced #25 and #28 in place with this
       fresh evidence rather than filing a new candidate — both already
       name these exact shapes in their scope sketches.
     - `spec.md` / `design/`: no diff since pass 68 (`git log -p
       --since=2026-09-04 -- spec.md design/` empty on both paths).
     - GitHub issues: `triage:loop-queued` shows 4 open issues,
       `triage:needs-user` shows 8 — identical counts to pass 68, no new
       issue filed since. No new triage-pattern signal.
     - Workflow health: `gh run list --workflow night.yml` shows 6
       consecutive `success` runs (09-01 through 09-06), extending
       pass-68's 4-run streak — reinforced #35 with the extended data
       while holding score (still a live, unfixed race condition, just
       currently lucky). `gh run list --workflow e2e-full.yml` shows the
       same failure cadence already logged by today's digest — no new
       information beyond what's already in #34's record, left untouched
       this pass to avoid a content-free reinforcement note.
     No genuinely new candidate concept surfaced this pass — every live
     signal traced back to an already-filed, well-scored candidate. #28
     (8.7) and #25 (8.3) remain the file's two highest-scored unpromoted
     candidates, both now past 55 days unpromoted despite continuous
     fresh evidence every 1-2 weeks — the strongest case in the file for
     `/oversight` promotion at the next session.
-->

### [ ] [score 5.4] Cloud workflows need a fallback (or at least faster escalation) for org-level Claude access outages
- kind: guard
- proposed: 2026-08-20, v1 candidate #37 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 5.4 (impact: 9, ease: 6 — every cloud-scheduled workflow shares
one auth path with no fallback and no dedicated alert, but the true root
cause is an org-console setting outside this repo, so any in-repo mitigation
is partial)
**Source pass:** digest, 2026-08-20
**Filed:** 2026-08-20
**Why:** Both of tiered.tv's cloud-scheduled workflows — `march` (roughly
hourly) and `night`/`/digest` (daily) — went dark on the exact same root
cause at the exact same time: `Claude Code returned an error result: Your
organization has disabled Claude subscription access for Claude Code · Use
an Anthropic API key instead, or ask your admin to enable access`. For
`march` that meant 178 consecutive non-success runs across 4+ days
(2026-08-16T07:51 UTC to 2026-08-20T09:15 UTC, only one commit landing the
entire window); for `night` it meant `plan/DIGEST.md` frozen on its 08-15
snapshot through three failed nights and one cancelled one. Neither
workflow has any fallback path — both depend solely on the subscription-
billed `CLAUDE_CODE_OAUTH_TOKEN`, so when the org toggle flips off, both go
fully dark simultaneously with nothing degrading gracefully. Worse, the
signal quality is bad: `march`'s own safety-net auto-filer kept appending
"Recurred" comments to issue #565 (178 of them across this repo's history)
because its 14-day title-match dedup found a same-titled issue, but #565's
only actual triage comment is from 2026-07-12 and diagnoses a completely
different root cause ("prompt is too long" / context growth) — it was never
re-triaged when the failure signature changed to the org-access error, so
anyone reading #565 today gets a stale diagnosis for a live, different
problem. This is the second occurrence of this exact org-access signature
in 5 weeks (issue #586, 2026-07-16; this run, 2026-08-16 through 08-20),
both times self-healing without any human action visible in either issue
thread — suggesting either an intermittent org billing/quota toggle that
resolves on its own, or a human quietly re-enabling it each time with no
comment left behind. Either way, 4+ days of total loop silence twice in 5
weeks is worth a structural look, not just another "Recurred" comment.
**Scope sketch:** (1) re-triage issue #565 with the correct current root
cause rather than letting the stale 07-12 diagnosis keep absorbing
unrelated recurrences; (2) evaluate whether `march.yml` and `night.yml`
should carry an `ANTHROPIC_API_KEY` fallback (pay-per-token, not
subscription-billed) so an org-access toggle degrades to "runs, but costs
money" instead of "doesn't run at all" — a deliberate cost/reliability
tradeoff only a human should make; (3) at minimum, add a distinct alert for
"N consecutive same-workflow failures" (both march and night) so a
multi-day outage surfaces faster than a human noticing a suspiciously quiet
git log, which is how this pass found it.
**Source signals:**
- `plan/AUDIT.md` [HIGH, score 7.2] filed this tick — the march-loop outage,
  with the full 178-run breakdown and root-cause confirmation from both the
  first and last failed run in the window.
- `plan/AUDIT.md` [HIGH, score 6.4, updated this tick] — the sibling
  night-shift row, now carrying a second, distinct-root-cause occurrence of
  the same "silent multi-day digest gap" symptom (issue #777).
- GH issue #565 (178 comments, open since 2026-07-12) and issue #777
  (filed 08-16, triaged today) — both need a human's eyes at the next
  `/oversight` session; neither is loop-fixable.
**Update (digest 2026-09-21):** the tightest same-day clustering of this
failure class since filing — 3 of 4 `march` ticks on 2026-09-20 crashed on
the identical org-access-toggle error within an 8-hour span (14:20, 17:39,
22:20 UTC, run IDs 35516192289/35526552659/35541344191, each appending a
"Recurred" comment to issue #565 rather than a fresh filing). Prior
occurrences of this class were spread across multi-day windows (08-16→08-20,
and isolated single recurrences); a single afternoon losing 3 of 4 ticks is
new evidence of intra-day burstiness, not just multi-day outages. No scope
change to the fix sketch above — data point only, for the next `/oversight`
session.
**Update (expand pass 75, 2026-10-24):** a second, distinct root-cause
signature has now independently produced the identical symptom. `plan/
AUDIT.md` [HIGH, score 2.7, filed 2026-10-19] documents a ~4.25-day total
blackout (2026-10-15T11:15Z → 2026-10-19T05:19Z) — 26 consecutive `march`
failures and 2 consecutive `night` failures — but this time the error
string is `Claude Code returned an error result: You're out of extra usage
· resets 8am (UTC)`, a subscription usage-cap exhaustion, not the org-
access-disabled toggle this candidate was filed against. Same effect
(every cloud-scheduled workflow shares one auth/quota path, zero fallback,
multi-day total silence), different trigger — strengthening the case that
the gap is structural (single point of failure across both failure modes)
rather than a one-off config fluke tied to one specific error string. Also
confirms the fix sketch's item (2) and (3) both land on the same `ACTIONS_
PAT` workflows-OAuth-scope blocker candidate #34 already carries (editing
`march.yml`/`night.yml` to add a pre-flight usage check or failure-count
alert requires exactly the scope this repo's cloud token lacks) — the two
candidates are now confirmed to share their remaining blocker, not just
their symptom. `plan/DIGEST.md`'s 2026-10-19 edition proposed the same
direction independently (check the prior run's failure string for this
exact signature and skip, not fail, until the stated reset time) before
being overwritten by the next night's edition — worth the next `/oversight`
session pulling that proposal back in verbatim rather than re-deriving it.
No score change — still correctly scored on the org-access evidence alone;
this update is breadth-of-cause evidence, not fresh urgency.

### [ ] [score 5.5] content-gaps gate (Step 3b.5) needs a bug-priority carve-out
- kind: guard
- proposed: 2026-07-18, v1 candidate #33 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 5.5 (impact: 7 — the gate is documented to fire "on most
content-eligible ticks indefinitely" now that Rule 3 is the perpetual
objective, so without a carve-out a high-scoring bug can structurally never
reach `/iterate` again, not just wait its turn; ease: 8 — a single
conditional check added to Step 3b.5 in `skills/march.md`, no schema or
data-layer change, self-contained to one file)
**Source pass:** digest 2026-07-15 (first raised, not filed to this file —
only written into that day's `plan/DIGEST.md`, which is overwritten nightly
and so was lost); re-filed digest 2026-07-18 with updated evidence
**Filed:** 2026-07-18
**Why:** `skills/march.md` Step 3b.5 dispatches every content-eligible tick
to `/ship-content` (Rule 2 season-fill, then Rule 3 themed lists) whenever
any `category: content-gaps` AUDIT row is Pending — by design, per the
2026-07-12 oversight pivot, this now includes an explicit note that the
dispatch "still fires on most content-eligible ticks indefinitely" since
Rule 3's own mission is "hundreds of excellent lists over months and
years." That design choice is sound for maximizing content velocity, but it
has an unpriced cost: issue #568 (mobile horizontal overflow on season
pages, AUDIT score 5.4 — the highest-scoring non-standing row in the file)
was filed 2026-07-13 and has now sat unaddressed for **5 straight days**
across **5 consecutive red e2e-full breadth nights**, growing from 1
affected URL to **3**. Critique pass 94 (2026-07-16) independently
rediscovered the same defect on the same URL and filed it as a HIGH
finding — two detection paths converging on one unfixed bug. In that same
window, 4 consecutive digest ticks (07-13 through 07-18) have logged 100%
of commits landing in content/audit/triage and 0% in
iterate/critique/expand/phase/data. The content-gate was designed to be
biased toward content, not to be absolute — but in practice it has behaved
as absolute for a week, because Rule 3 (unlike Rule 2) has no natural
gap-zero state that would ever let it yield control back.
**Scope sketch:**
- In `skills/march.md` Step 3b.5, before dispatching to `/ship-content`,
  add one check: if `plan/AUDIT.md` has a Pending **non-content-gaps** row
  scoring ≥5.0 (chosen to sit above the standing Rule-2 drain row's own 4.5
  bias-adjusted score, so it only fires for genuinely high-priority bugs,
  not routine findings), skip to Step 3d (`/iterate`) for that one tick,
  then resume normal 3b.5 priority on the next tick.
- No change to Rule 1/2/3 content mechanics themselves, no change to
  scoring formulas, no change to the standing Rule-2 drain row's
  "stays Pending until gap table reads zero" contract.
- Consider whether the same carve-out should apply ahead of Step 3c
  (`/expand`) as well, or only ahead of 3d — a scoped bug fix arguably
  matters more than either the next themed list or the next expand pass,
  but expand's own posture-gating already gives it a natural throttle
  Rule 3 lacks.
**Estimated phases:** 1 (small — a few lines in one skill file).
**Conflicts:** none. Complements candidate #29 (archive closed rows) —
both address different symptoms of the same underlying pattern (the loop
running so much content that its own maintenance/bug-fixing steps starve).

**Update (digest 2026-07-19):** issue #568 is now **6 days old** (07-13
through 07-19), the e2e-full breadth crawl is on its **6th consecutive red
night**, and the defect has grown from 3 affected URLs to **4**
(`love-island-us/season/fiji-2026` joined tonight). It has just been
escalated MED→HIGH in `plan/AUDIT.md` on the strength of new evidence: all
four affected URLs fail identically on both `season-page.spec.ts:172` and
`smoke-mobile.spec.ts:25`, confirming this is a shared-component CSS defect
rather than four independent content strings — the fix is now more clearly
scoped than at filing time, which raises ease without changing the
carve-out's own shape. The same night's crawl also missed its 75-minute
ceiling at 95.6% complete; the retries this bug forces (2 retries × 8
failing specs/night, growing with each new affected URL) are a plausible
compounding contributor to that separate timeout erosion, meaning this one
fix may relax two symptoms at once. Content-gate window is now **7
consecutive digest ticks** (07-13 through 07-19) at 100%
content/audit/triage commits, 0% iterate/critique/expand/phase/data. No
change to score or scope sketch — filing this as reinforcing evidence for
`/oversight` to weigh, not a re-score.

**Update (digest 2026-07-20):** issue #568 is now **8 days old**, the
breadth crawl's on its **8th consecutive red night**, but the
affected-URL count held flat at 4 for the first time (no growth since
07-19) — the defect itself has stopped spreading even though nothing has
fixed it yet. New evidence sharpens the fix path further: `plan/CRITIQUE.md`
pass 94 (2026-07-16, independently run, still the latest pass) diagnosed
the exact same URL and already narrowed the culprit to one of three named
candidates (the `location`/`filming_caption` string, the forced `<br/>` in
`display_title`, or `AdjacentSeasons.tsx` rendering), ruling out the mobile
stacking media-query as the cause. Two independent detection paths have
now converged on one URL with a pre-narrowed fix list — this is the
clearest this bug's fix path has ever been, and it's had zero
`/iterate` attention across 8 days. This window (07-19 through 07-20) was
otherwise the cleanest content-gate window yet: 41/41 commits were
content/audit-progress, 0 triage, 0 critique, 0 sweep, 0 expand, 0
iterate — the gate has not yielded a single tick since filing. No change
to score or scope sketch.

**Update (digest 2026-08-06):** the predicted failure mode has now fully
materialized and gone further than the filing itself anticipated. Since
`/expand` pass 59 (2026-07-28T19:24:18Z) — **9 straight days, 348
commits** — the loop has shipped precisely 0 `iterate:`, 0 `critique:`,
0 `expand:`, 0 `fix:`, 0 `phase:`, and 0 `data:` commits; the only
non-content-gate activity in that entire window was 1 scheduled
`sweep:` (weekly season sweep, its own cadence trigger, not a `/iterate`
tick) and 4 `digest:` commits (one of which was skipped outright by the
`night.yml` starvation bug, candidate #35). The consequence is no longer
hypothetical: `plan/CRITIQUE.md` now carries **2** Pending HIGH rows
(pass 101 — `/shows/love-island-us/season/fiji-2026` mobile overflow;
pass 104 — `/shows/love-island-uk/community` mobile table dropping its
APPROVAL % column), and `skills/march.md` Step 2 condition 3 ("no
pending HIGH critique already queued for iterate") means `/critique`
itself cannot run again until `/iterate` clears them. Because Step
3b.5's content-gaps gate never yields control to `/iterate`, the loop
has locked itself out of both its bug-fixing path AND its bug-detection
path simultaneously — a closed loop, not just a slow queue. `/expand`
being 9 days stale (last pass 59) confirms Step 3c is starved
identically. Three other fully-scoped candidates (#34, #35, #36) are
also stuck behind this same gate, since none of them are `/ship-content`
shaped. This makes #33 the single highest-leverage unpromoted candidate
in this file: promoting it doesn't just fix one bug, it reopens the
loop's ability to ever run `/iterate`, `/critique`, or `/expand` again
without a human forcing a tick by hand. No change to score or scope
sketch — the fix shape identified 2026-07-18 was already correct.

**Update (digest 2026-08-09):** the predicted worst case did NOT
hold for the following 3 days — without promotion, the loop cleared
both Pending HIGH `plan/CRITIQUE.md` rows on its own (mobile
`.ep-foot` overflow, community-view `og:image`), which reopened
`/critique`'s Step 2 condition 3, and it ran three more times
(passes 106, 107, 108) alongside 6 `fix:` commits in 113 total —
non-content share rose from 0% to ~9.7%. The mechanism: not every
Rule-3 tick finds a row scoring ≥3.0 (30 of 48 Rule-3 passes this
window were zero-ship), so the content-gate does periodically yield
control even without a carve-out — it's biased-but-not-absolute in
practice, contrary to the 08-06 update's "never yields" framing.
That said, the underlying risk is real, not resolved: pass 108
filed a fresh Pending HIGH (community weekly-question card CTA,
now systemic across 2 shows) that reloads the exact same lockout
precondition, and `/expand` (Step 3c, gated behind the same 3b.5)
is still 12 days stale (pass 59, unchanged since 08-06) — so while
`/critique` proved resilient, `/expand` has shown no equivalent
self-recovery. Downgrading from "single highest-leverage row in
the file" to "real but currently non-blocking" — #35 and #34 are
the more urgent unpromoted candidates this cycle (see their
08-09 updates). No change to score or scope sketch.

**Update (digest 2026-08-10):** second consecutive day of
self-recovery — pass 108's fresh Pending HIGH (community
weekly-question CTA) got fixed same-day (3ed3c5da), so
`plan/CRITIQUE.md` opened this morning with **0 Pending HIGH rows**,
and today's window also shipped 1 critique pass (110) plus 1 `fix:`
commit alongside 12 `content:` commits — non-content activity
landing without promotion for a second day running. `/expand`
remains the one queue that hasn't self-recovered (still pass 59,
now 13 days stale) — the carve-out's real value may be narrower
than originally scoped (protecting Step 3d specifically) rather
than Step 3c, which shows no equivalent resilience. Holding at
"real but currently non-blocking," lowest urgency of the four
unpromoted candidates this cycle. No change to score or scope
sketch.

**Update (digest 2026-08-11):** the one holdout self-recovered too —
`/expand` ran pass 60 the same evening (2026-08-10T18:12Z), 13 days
after pass 59, finding 0 new candidates but escalating candidate #36
on its own. So all three gated verbs (`/iterate` via critique-fallback,
`/critique`, `/expand`) have now self-recovered at least once without
this carve-out shipping, just on longer cadences than a dedicated
carve-out would give them. Today's window sharpens the mechanism
further: Rule 3's idea pool hit a new record **25 same-day zero-ship
passes** (up from 15 two days ago), and on three of those exhausted
ticks cloud `march` fell through to `plan/CRITIQUE.md` instead of a
26th search — landing 3 fixes (masterchef-australia S18 echo,
below-deck-mediterranean S11 stat repetition, the-challenge S41
stat-caption punctuation-only restatement) and driving Pending HIGH
to zero again. This is the exact behavior #33's scope sketch wanted
to force explicitly, now happening organically as Rule 3's search
space thins — the emptier the idea pool gets, the more often the
gate yields on its own. Still worth shipping for determinism (an
explicit ≥5.0 carve-out doesn't depend on Rule 3 running dry first),
but three consecutive days of unforced self-recovery across all
three verbs makes this the least urgent of the four unpromoted
candidates by a wider margin than yesterday. No change to score or
scope sketch.

**Update (2026-08-11, expand pass 61, cloud march):** the
self-recovery pattern hit its first genuine wall today. By this
tick, `plan/CRITIQUE.md`'s Pending section had gone fully to zero
(the last two rows — a theme-description SERP-budget trim and a
love-island-uk stat-caption fix — were resolved in the immediately
preceding commit, 55bf8186) after five consecutive ticks had drawn
down the CRITIQUE queue as an escape valve from the exact starvation
this candidate describes (commits 09a8b94e, b5c1dc51, 368dc8c0,
416bd84a, 0a05a908, each tick's own commit message citing "issue
#758" and "dispatch-starvation pattern" explicitly). With CRITIQUE
empty, this tick checked `plan/AUDIT.md`'s remaining Pending rows for
a further fallback and found none available: the two HIGH bug rows
(#36's the-voice corruption, and the night-shift concurrency bug)
are both explicitly parked for `/oversight`/blocked-from-cloud, the
e2e-full breadth-crawl row (#34) is likewise cloud-blocked, and the
one LOW content-gaps row (theme-description budget) was deliberately
filed at score 1.5 to stay out of auto-dispatch. This is the first
day where the informal self-recovery mechanism (organically falling
through to CRITIQUE/AUDIT fixes when Rule 2/3 stall) ran completely
dry — there was no more real, cheap, scoped work left to substitute
for a same-day-27th zero-ship Rule 3 search. This tick's own
resolution was to divert to `/expand` itself (Step 3c would have
fired next had 3b.5 not mechanically outscored it) rather than either
force a near-certain-zero-value search or produce a bare no-op —
which is itself evidence for the "the carve-out should also cover
Step 3c" question raised in the original scope sketch, now answered
in the affirmative by lived experience rather than speculation.
Net: the multi-day trend of "self-recovery makes this less urgent"
reverses today — the fallback well is not infinite, and this is the
first tick to hit its bottom. Re-raising to the same urgency tier as
#34/#35 (the previously-cited "more urgent" candidates this cycle).
No change to score or scope sketch — the fix shape (an explicit ≥5.0
carve-out ahead of Step 3b.5, extended to gate ahead of Step 3c too)
remains correct and is now the highest-priority unpromoted candidate
in this file, since it is the one candidate whose absence measurably
cost a tick today.

**Update (2026-08-13, expand pass 62, cloud march):** the pattern
intensified further today, though the loop's own resilience held.
Today alone produced **eleven consecutive same-day Rule-3 zero-ship
passes** (commits through `1ad8b034`), each documented with a
distinct dead axis in `plan/LISTS.md`'s Ideas log — Rule 2 stayed
fully stalled the entire day (CADENCE gap table unchanged, nearest
dated finale `american-ninja-warrior` S18 still 4 days out). Critically,
today's ticks also exhausted **both** of the informal fallback wells
that had been absorbing the starvation on prior days: the
`episodes_caption` bare-restatement content drain hit corpus-zero
(commit `51112015`), and all three `plan/CRITIQUE.md` pass-120
findings got fixed (`037fcdeb`, `b56f4195`, `2d6f2606`, `62329f4a`).
By the eighth same-day occurrence (per issue #758's own running
comment thread, run `31740198466`), the tick had to reach for the
next-cheapest mechanical CRITIQUE.md finding (pass-100's list-detail
stat treatment) specifically because the two established redirect
targets were spent — direct confirmation of this candidate's core
claim that the fallback well is finite, not infinite. This cloud
march tick (`/march` pass following the eleventh zero-ship commit)
is itself a second data point: with CRITIQUE.md's Pending queue back
down to 32 rows (all LOW/MED single-page content nits or two
standing `[needs-user-call]` rows, none scoring high enough to
mechanically outrank the standing 4.5 content-gaps row) and no fresh
non-content-gaps AUDIT row above threshold, this tick again diverted
directly to Step 3c (`/expand`) rather than force a twelfth same-day
Rule-3 search — the same well-justified substitution pass 61
pioneered two days ago, now recurring for a second time. Net: the
self-recovery mechanism is still functioning (today shipped 3 real
`fix:` commits plus this expand pass, not pure content churn), but it
increasingly depends on ad hoc tick-level judgment calls to find
*something* non-content to do rather than a deterministic rule — and
today's density (11 zero-ship passes, both wells drained) is the
second-highest on record after pass 61's 25-pass day. No change to
score or scope sketch. Still the highest-priority unpromoted
candidate in the file; ripe for `/oversight` promotion whenever a
human session next reviews this file.

**Update (digest 2026-08-14):** the `episodes_caption` fallback well
— the specific redirect target that absorbed the 08-12/08-13
starvation (248→0 warnings, seven shows drained) — hit true
corpus-zero mid-tick yesterday (commit `51112015`, chopped the final
show). With that well now permanently gone (not just temporarily
drained, since the whole warning class is fixed), today's window
(10 more zero-ship passes, ninth through eighteenth, spanning
08-13 22:12 through 08-14 10:42) shows the loop leaning on the two
remaining wells instead: `/critique` ran three passes in the window
(119 no findings, 120 three findings, 121 five findings) and
`/expand` ran pass 62 — both wells that candidate #33's 08-11 update
already flagged as *not* self-sustaining on their own (critique's
Pending queue only refills on a schedule, expand is posture-gated).
Today is the first day the loop has had to run this leanly-provisioned
on fallback substitutes since the pattern was first diagnosed — one
fewer well than at any prior digest update. `plan/CRITIQUE.md`'s
Pending count is back up to 33 rows (from 32 at the 08-13 update),
so the near-term substitution supply is intact, but the structural
point stands: every well this candidate's absence has been living off
is either finite (episodes_caption, now spent) or intermittent
(critique refill, expand posture). No change to score or scope
sketch. Still the highest-priority unpromoted candidate in the file.

**Update (digest 2026-08-15):** the margin recovered today, on both
wells this candidate flagged as non-self-sustaining. A new finite
well opened and got drained the same day it opened: `take_h2`
(season-page Section 01 H2 verbatim-restates-H1 warning) went from
undrained to two same-day redirect passes covering 16 seasons across
7 shows (`1c1fdad6` 8 seasons/5 shows, `aca233c2` 8 seasons/2 shows),
each logged as its own `audit:` mirror row. Separately, `/critique`
had its strongest single-day drain on record — three passes (122, 2
findings; 123, 2 findings; 124, 3 findings) plus eleven same-day
`critique drain` fix commits pulled the Pending count from 33 down to
**18 rows**, the lowest it has been in weeks. Net: only 3 same-day
Rule-3 zero-ship passes logged today (vs. 10-11 on the two prior
diagnosis days), because `take_h2` and a well-stocked critique queue
absorbed most of the pressure instead. This does not change the
underlying diagnosis — `take_h2` is itself now spent after today
(same finite-well pattern as `episodes_caption`), and critique's
refill remains schedule-dependent, not deterministic — but it is
evidence the candidate's own text should carry: the fallback margin
oscillates well-to-well rather than monotonically thinning. No change
to score or scope sketch. Still the highest-priority unpromoted
candidate in the file.

**Update (expand pass 63, 2026-08-16, cloud march):** the 08-15
update's read on `take_h2` was wrong in scale, not direction. The
well did not go spent — it kept absorbing pressure straight through
this window: since the 08-15 digest, the same-day redirect commits
climbed 8→10→11→13→14→17→19→20→22→24→25→27→30 seasons across a long
run of same-day ticks, all still `take_h2`, all still landing cleanly
as their own `audit:` mirror rows. `pnpm content:check` run fresh this
tick surfaces **305 remaining `take_h2` warnings** (mostly Top Chef's
back catalog, seasons 01 through the low-20s), an order of magnitude
larger than the "16 seasons across 7 shows, now spent" picture the
08-15 update had. The likely explanation: 08-15's redirect passes only
cleared the shows already in flight that day: the warning class itself
spans far more of the catalog than any single day's drain touched.
Practically, this means the fallback well the loop has been living off
is sturdier than any prior update believed — three consecutive digest
updates (08-13, 08-14, 08-15) each treated a well as being at or near
exhaustion shortly before a bigger one turned out to still be there.
Separately, this was also the first tick in the file's recent history
where `plan/AUDIT.md`'s Pending section was found **fully empty** (no
content-gaps row, no bug row) — Step 3b.5 had nothing to dispatch on
its own merits, so this tick reached `/expand` without the
substitution logic pass 61/62 needed. No change to score or scope
sketch — the fix shape stays correct regardless of how deep any given
well runs; a deterministic carve-out doesn't depend on guessing well
depth correctly. Still the highest-priority unpromoted candidate in
the file, now with corrected evidence about how much slack the loop
has been running on.

**Update (expand pass 65, 2026-08-21, cloud march):** the informal
"content-gap redirect" workaround this candidate proposes to formalize
is now a named, self-referential practice in the loop's own commit
history — six of the ~29 commits since pass 64 (2026-08-20) carry the
literal phrase "per issue #758's established workaround" or "content-gap
redirect" in their subject/body (11d9eb6c, f7643199, 9842f0da, 6177bbf9,
492a10c9, 07e6c046), each one picking the oldest actionable
non-`[needs-user-call]` `plan/CRITIQUE.md` row by hand once Rule 2/3 both
confirmed dry for the tick, shipping it under a `content:` subject, then
logging a companion `audit:` commit ticking the row and noting the
redirect on the standing season-fill row. This is exactly candidate #33's
proposed Step 3b.5 carve-out, minus the actual skill-file edit — the loop
has been hand-simulating the fix for weeks rather than having it. Two new
data points this pass: (1) the workaround is demonstrably *working* — five
of the six redirects closed real defect-class instances (see candidate #25's
same-pass update), the sixth (286116bb, Project Runway adjacent-season
disambiguation) shipped a genuine systemic code fix, so the practice isn't
just busywork, it's clearing real backlog that Step 3b.5's literal gate
would otherwise starve indefinitely; (2) `/expand`'s own gate reopened this
pass largely *because of* that commit volume (29 commits since pass 64, just
past the 20-commit threshold) — the redirect pattern is incidentally what
kept the loop's overall commit cadence healthy enough for `/expand` itself
to fire on schedule. Recommend `/oversight` treat this as a low-risk
promotion: the scope sketch has been running as an unwritten process for
over a month with a clean track record and zero incidents, so codifying it
into `skills/march.md` Step 3b.5 formalizes existing behavior rather than
introducing new risk. Score unchanged at 5.5; still unpromoted 34 days
after filing (2026-07-18).

**Update (expand pass 66, 2026-08-23, cloud march):** the candidate's own
open scope question — "consider whether the same carve-out should apply
ahead of Step 3c (`/expand`) as well, or only ahead of 3d" — got a live,
concrete answer this exact tick, and the answer is yes, it's a gap. This
pass's own dispatch chain: Step 1 (triage) found 0 unlabeled issues; Step
1.5 found neither cadence clock due; Step 2.0's shipping-mode gate stayed
lifted (Phase 36 `[x]`, no `[ ]` phase rows); the critique gate wasn't due
(4 commits / same-day since pass 137); Step 3a/3b empty; Step 3b.5 found
exactly one Pending `plan/AUDIT.md` row — a freshly-filed `[HIGH]`
`category: bug` row (commit 5efa84ee, 2026-08-23, score 5.4: a systemic
off-by-one factual error across 6 America's Got Talent season files plus
`canon.md`, discovered mid-tick during an unrelated content backfill) —
but Step 3b.5 only matches `category: content-gaps` rows, so this bug row
doesn't dispatch there. Step 3c (`/expand`) then found its own gate open
on independent merits (102 commits / ~63.5h since pass 65, both well past
threshold, posture bold, live AUDIT.md signal present, no phase/data
pending) and fired — reaching this very update. Net effect: a HIGH-severity,
same-day-filed bug row sat un-dispatched for this entire tick, not because
of the CRITIQUE.md content-gap starvation this candidate was originally
scoped around, but because `/expand`'s own rate-limited gate happened to
open in the same window and out-prioritizes Step 3d in the dispatch order.
This is a materially different mechanism than the content-gap-redirect
workaround documented in the pass-65 update above — that workaround
specifically drains `plan/CRITIQUE.md` rows by hand; it has no path for
`plan/AUDIT.md` `category: bug` rows, which have no informal workaround
covering them at all. The bug row will still get picked up (likely next
tick, once `/expand`'s gate closes again and Step 3d is reached with
nothing higher-priority ahead of it), so this is not a starvation
failure on the scale documented for issue #568 in earlier updates — but
it's a second, independent confirmation that the dispatch chain has more
than one point where a scoped bug fix can wait behind non-bug work, and
the existing scope sketch (a check ahead of Step 3b.5 only) would not
have closed this instance. Recommend widening the scope sketch: place the
carve-out check once, ahead of Step 3b in `skills/march.md`'s Step 3
block (before content-gaps, expand, or iterate are ever evaluated), so a
qualifying high-score `category: bug` (or `category: data`) row always
preempts all three lower-priority branches in one place rather than
needing a duplicated check ahead of each. Score unchanged at 5.5 (the
new evidence sharpens the fix's correct location, not its urgency or
size); still unpromoted 36 days after filing.

**Update (expand pass 67, 2026-08-30, cloud march):** a third,
distinct confirmation this tick, and it exposes a new wrinkle the
scope sketch hasn't priced in. Step 3b.5 matched its usual candidate
— the standing season-fill drain row (`category: content-gaps`,
score 4.5) — while three unrelated `category: bug` rows sat Pending
in `plan/AUDIT.md` scoring well above the proposed 5.0 carve-out
threshold: the night.yml starvation row (6.4), the e2e-full
duration-ceiling row (5.4), and the-voice factual-corruption row
(4.8, just under threshold but still HIGH severity). This time
`/ship-content` itself found nothing actionable — every row in
`plan/CADENCE.md`'s season gap table is currently starred
(confirmed-but-unaired), a known stall state — so the tick fell
through to Step 3c (`/expand`) anyway, and the bug rows still didn't
reach `/iterate`. The new wrinkle: today's fallthrough happened by
*coincidence* (the gap table happened to be fully stalled this exact
tick), not by the mechanism this candidate proposes. On a tick where
even one gap-table row were actionable, Step 3b.5 would have
dispatched `/ship-content` to author it — correctly, by the letter
of the current rules — and the three waiting bug rows (one of them
actively degrading, per candidate #35's own pass-67 update) would
have waited a full tick longer with no carve-out to preempt it. This
sharpens the urgency case without changing scope: the candidate's
proposed fix would have made no difference to this specific tick's
outcome (the stall already produced the right fallthrough), but it
remains the only thing that reliably produces that outcome on the
much more common tick where content work IS actionable. Score
unchanged at 5.5; still unpromoted 43 days after filing.

**Update (expand pass 70, 2026-09-09, cloud march):** the most extreme
version of the stall pattern yet — not one stalled tick but **four
same-day** content-gap ticks (00:56Z, 06:53Z, 17:06Z, 19:49Z) all
independently reconfirming the identical CADENCE gap-table stall (all 42
slots starred, confirmed-but-unaired) and an identical Rule 3 zero-ship
(a fresh concept search finding nothing not already staked in the 183-row
`plan/LISTS.md` ledger). This tick is a fifth, and rather than run a near-
certain-to-be-redundant fifth reconfirmation within the same two-hour
window, it treated the stall as already-established and fell through to
`/expand` directly — which is exactly the "genuinely no actionable content
work" case the pass-67 update first named, except this time the
fallthrough was a **reasoned judgment call**, not the pass-67 "coincidence"
the gap table happened to be fully stalled. That distinction matters: it
means the mechanism this candidate proposes isn't just missing for the
common case (content work IS actionable, bug rows wait indefinitely) — it's
also missing for the stalled case, where every tick has to independently
re-derive "is there really nothing to do" from first principles instead of
reading it off a structural signal. A cheap per-tick staleness check (e.g.
"has the standing Rule-2 row's CADENCE state changed since the last
content-gap tick within N hours? if not, and Rule 3 has no review due,
treat the row as non-actionable this tick without re-running the full
search") would remove the ambiguity this candidate's carve-out doesn't by
itself resolve. Score unchanged at 5.5; still the highest-scored unpromoted
candidate whose fix is purely a `skills/march.md` conditional, now **53
days unpromoted**.

### [ ] [score 5.2] `/shows` B-tier browse filter — network/genre chips
- kind: product
- proposed: 2026-07-11, v1 candidate #30 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 5.2 (impact: 6, ease: 7 → 4.2 base + 1.0 signal multiplicity —
catalog growth reinforces)
**Source pass:** 52 (reinforced pass 56, reinforced again pass 64)
**Filed:** 2026-07-11 (reinforced 2026-07-16, 2026-08-20)
**Pass-64 reinforcement (steady growth continues, still unpromoted):** critique
pass-121 confirms the B tier at 54 shows — 79% of the 68-show catalog in one flat
section (S: 2, A: 12, B: 54) — up from "51+" at the pass-56 reinforcement a month
ago. Catalog total also grew (58→68 shows) over the same window. Growth has slowed
under the locked biweekly show-add clock (candidate #24 retired the old perpetual
refill), but it hasn't stopped — 3+ new tiles since pass-56. Both the original
pass-77 finding and pass-121's independent re-confirmation remain unresolved and
Pending in `plan/CRITIQUE.md`. Score held at 5.2 (growth rate too modest under the
new clock to justify a further bump); flagging for `/oversight` as a low-risk,
data-already-exists candidate worth a look whenever a chrome-focused session comes
up — no new content authoring required per the original scope sketch.
**Pass-56 reinforcement:** critique pass-91 confirms the B tier has kept growing since
filing — "51+ tiles as of this pass," up from the 39 cited at filing five passes ago.
Note a correction to the original growth rationale: the 2026-07-12 oversight pivot
LOCKED new-show creation to a biweekly add-and-drain-fully clock (no longer Rule 1's
perpetual mandate), so the B tier no longer grows every single tick — but it still
grew by 12+ tiles in 5 passes from the existing backlog + clock-filed adds, so the
compounding-gap argument holds, just at a slower cadence than originally stated. The
original pass-77 finding remains unresolved and Pending in `plan/CRITIQUE.md`.
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

### [ ] [score 8.3] Canon-rationale/season-body verbatim-argument echo gate
- kind: guard
- proposed: 2026-07-06, v1 candidate #25 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 8.3 (impact: 8, ease: 8 → 6.4 base + 1.9 signal multiplicity, impact bumped
7→8 at pass 46 — the class now costs a full-show rewrite, not a one-scene edit;
multiplicity bonus raised again at pass 49 — a 10th independent instance closed in
the very next commit window after pass 48's filing, the shortest gap yet between
reinforcements; raised again at pass 57 — 12th and 13th independent instances,
one of them ruling out "thin season" as an excuse)
**Source pass:** 44 (reinforced pass 46, 47, 48, 49, reinforced again pass 56, 57,
reinforced again pass 64, reinforced again pass 69)
**Filed:** 2026-07-06 (reinforced 2026-07-07, 2026-07-08, 2026-07-08, 2026-07-09,
2026-07-16, 2026-07-22, 2026-08-20, 2026-09-06)
**Pass-69 reinforcement (two more fresh instances, one still unresolved, two months
unpromoted):** Critique passes 152/153 (2026-09-05/06, the two most recent passes)
each found a fresh instance of this exact defect class within 24 hours of each
other: `below-deck-mediterranean/season/dubrovnik-ii` (HIGH — "Shape of the Season"
and "Where It Sits in the Canon" restate the identical yacht/chef/crew roster
near-verbatim, still Pending as of this filing) and `naked-and-afraid/season/
the-active-season` (MED — the 21-day paired-survival format fact repeats
near-verbatim across the same two sections, RESOLVED same-day). The critique
finding on naked-and-afraid explicitly flagged the pattern itself: "three
independent instances surfacing in a single critique pass suggests the pattern is
systemic to the season-page 'shape of the season' / 'where it sits in the canon'
template pairing, not isolated per-show content bugs" — the critique tooling is
now naming this exact candidate's thesis unprompted. `traitors/season/ardross-2026`
also closed a third instance of the pair (pass-153, same day) despite the page
having already been individually patched at pass-127 for a *different* field pair
on the same page — continuing the pass-64 finding that field-by-field reactive
edits relocate the defect rather than closing the class. All three September
instances were absorbed by the standing `plan/AUDIT.md` season-fill-drain row's
content-gap side-drain mechanism (Rule 2 fully stalled on every gap-table show
being confirmed-but-unaired, so critique-found repetition fixes are currently the
row's only active output) rather than by any structural gate — zero instances
have ever been caught pre-ship. This candidate is now **62 days unpromoted**
(filed 2026-07-06) and sits second only to #28 (8.7) among unpromoted candidates
by score, ahead of every other row in the file. Repeating the pass-64
recommendation without qualification: this is ripe for `/oversight` promotion,
not a fourth consecutive reinforcement-only pass.
**Pass-64 reinforcement (five weeks unreinforced despite the highest instance rate
yet — eight-plus new occurrences, two genuinely new shows, same-page re-recurrence
on already-"fixed" pages):** No expand pass touched this candidate between pass-57
(2026-07-22) and this one — five weeks and six passes (58-63) running past it while
`plan/CRITIQUE.md`'s pending queue kept accumulating fresh instances of the exact
defect class. In that gap, two genuinely new shows joined the affected list: Top
Chef (`carolinas`, critique pass-124/127 — lede/body echo on filming-location facts,
a *third* repetition instance on the same page after the pass-93 FILMED/FORMAT
tile fix left `filming_caption` itself still self-restating) and Traitors
(`ardross-2026`, critique pass-127 — "on merit" repeated three times across
Take/Shape/Canon, a third distinct repetition instance on a page that already had
its eyebrow/body echo fixed at pass-125). Survivor 50 — the site's flagship,
highest-traffic season page — was hit again (pass-127, cast-size fact restated
verbatim-in-substance across lede and Shape body) despite "several prior
independent fixes on the same page" already closed (FORMAT/CAST tile dupe,
canon.md/body echo, a four-times-repeated fan-vote mechanics list). Perfect Match
restated its two headline facts across five-plus fields (pass-125). The most
recent critique pass (129, same day as this filing) landed three more in one
sweep: The Real World Atlanta (lede/body/canon triple-restatement, explicitly
named "the same defect class already fixed on shark-tank S17, alone S12, the-circle
S7, and survivor-50 — now confirmed on a show outside that fixed set"), Big
Brother's newest season (a three-mechanic list repeated four times across
lede/Take/Shape/Canon), and Southern Charm (a lighter two-field word-recycle
variant, same root symptom in a new module pair). None of these eight-plus fresh
instances were caught pre-ship; each is either a still-open `plan/CRITIQUE.md`
Pending row or was closed reactively as a one-off content edit days to weeks after
shipping — the same "reactive, never structural" pattern this candidate has now
documented across 20+ instances. The new information this window adds beyond raw
instance count: **the defect is re-recurring on pages that were already
individually patched** (Survivor 50, Top Chef Carolinas, and Traitors each got a
prior one-off fix, then grew a *new* echo pair in a *different* field on the same
page) — direct evidence that field-by-field content edits don't close the class,
they just relocate the next occurrence to an unpatched field pair on the same
page. Score held at 8.3 (already near ceiling on impact/ease); flagging urgency
instead of a further score bump — this is the highest-scored candidate in the file
and the longest-unreinforced relative to its own signal rate. Recommend
`/oversight` promote at the next session rather than let a pass-70+ reinforcement
restate the same case a third time.
**Pass-57 reinforcement (two new instances, one raises a scope question):** critique
pass-94 found a 12th instance on `/shows/chopped/season/the-double-first` (Season 62)
— a thin two-fact season repeating both facts near-verbatim across the body/lede, the
canon-rationale-equivalent "03 Where it sits in the canon" section, AND the first two
`watch_list` bullets (triple restatement, not just the documented two-field pair).
Still Pending in `plan/CRITIQUE.md` as of this filing. Critique pass-96 found a 13th
instance on `/shows/dragrace/season/18` that widens the pattern: the `pull` field, the
season body, AND the canon.md rationale all converge on the same five facts near-
verbatim — a **three-way** echo, not the documented two-field (canon-rationale ↔
season-body) shape this candidate's scope sketch targets. Unlike Chopped S62, Drag
Race S18 has plenty of distinct material available, so there's no thin-season excuse
this time — the finding explicitly names it "the same section-level restatement defect
class already open on Chopped S62... a second, unrelated show hitting the same tell."
Open scope question for `/oversight`, same shape as the pass-56 cross-show question
below: widen `collectCanonRationaleSeasonBodyEchoIssues()` to compare `pull` as a third
surface against body + rationale, or scope that as a follow-on candidate once the
two-field gate ships. Both instances still unresolved (Pending) as of this filing.
**Pass-56 reinforcement (new sub-pattern, scope question for `/oversight`):** critique
pass-92 found a related but distinct shape on three freshly-shipped, single-canon-entry
shows (The Real World, Ink Master, So You Think You Can Dance) — each show's lone
canon.md rationale opens on a near-identical templated clause ("The founding season —
the format's first real test of...") and closes on a near-identical variant ("is the
only entry so far, and it's the [only possible/clear] call at #1"). This is **cross-show**
templating (three different shows' canon.md files echoing each other) rather than this
candidate's documented **cross-file, same-show** echo (one show's season body vs. its
own canon.md rationale) — the detection mechanic would differ (compare each new
single-entry canon opener/closer against the N most-recently-authored single-entry
canons, not against a sibling field in the same show). Still Pending in
`plan/CRITIQUE.md`, unresolved as of this filing. Flagging as an open scope question
rather than folding it silently into this candidate's existing sketch: `/oversight`
should decide whether to widen this candidate's detection mechanic to cover both shapes
in one phase, or split the cross-show case into its own smaller candidate — the
root-cause family (content authored without checking a sibling/precedent surface) is
identical either way.
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

**Update (expand pass 65, 2026-08-21, cloud march):** five more independent
instances landed and were fixed reactively in the ~29 commits since pass 64
(2026-08-20), every one via the undocumented "content-gap redirect" workaround
(candidate #33) rather than a structural gate: Top Chef Carolinas (a fourth
distinct repetition on a page that already had one prior fix — the LCK
re-entry-delay fact repeated across `format_caption`/pull/watch_list/body,
commit 11d9eb6c), Survivor 50 (the site's flagship page hit *again* — lede/body
cast-size-and-span echo, commit 9842f0da, on top of the "several prior
independent fixes on the same page" pass-64 already logged), Southern Charm
S11 (`take_h2`/pull "footing" word-echo, commit 6177bbf9), The Real World
Atlanta (lede/body/canon triple-restatement of the same three facts, commit
492a10c9), and Big Brother's newest season (a three-mechanic list repeated
across four fields, commit 07e6c046). Two of five are second-strike pages
(Top Chef Carolinas, Survivor 50) — direct, continued confirmation of pass-64's
core finding that field-level one-off edits relocate the defect rather than
closing it. Net since filing (2026-07-06): 20+ instances documented, now
spanning at least 18 distinct shows, with a same-day recurrence rate that has
never required more than ~24 hours to produce fresh evidence at any check-in
since pass-56. Score held at 8.3 (ceiling); still the highest-scored
unpromoted candidate in the file, six weeks after filing.

**Pass-70 reinforcement (still-Pending instance, first re-occurrence since
the pass-69 pair):** Critique pass-156 (2026-09-09) found a fresh instance —
`/shows/vanderpump-rules/season/season-12` — "Shape of the Season" and
"Where It Sits in the Canon" restate the identical Lisa Vanderpump-only-
holdover / ten-new-regulars / four-prior-appearances fact set in near-
identical sentence structure, still Pending as of this filing (not yet
absorbed by a content-gap side-drain tick). This is the first genuinely new
show hit by this defect class since the pass-69 below-deck-mediterranean/
naked-and-afraid pair — the instance rate has not slowed. Net since filing
(2026-07-06): 21+ instances documented, now spanning at least 19 distinct
shows. Score held at 8.3 (ceiling); now **65 days unpromoted**, still the
second-highest-scored unpromoted candidate in the file behind only #28.

### [ ] [score 6.4] Archive closed CRITIQUE.md / AUDIT.md rows out of the live ledger
- kind: guard
- proposed: 2026-07-09, v1 candidate #29 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

**Score:** 6.4 (impact: 8 — raised at pass 68 from a read-ceiling risk to a
*confirmed silent bookkeeping-accuracy defect*: the same tick's own `/digest`
pass found `plan/CRITIQUE.md`'s Pending section has drifted to 43 unreconciled
rows including at least one already-fixed-but-never-closed finding, directly
traceable to the absence of the archive mechanism this candidate proposes;
ease: 8 — mechanical move of already-`[x]`-closed rows to a new archive file,
git history keeps everything regardless, no schema or gate-logic change)
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
signal: `plan/CANDIDATES.md` (this file) has independently grown to
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

**Reinforced (digest 2026-07-18):** the predicted failure mode has now
recurred to **20 total occurrences** on issue #565 (title: "Cloud march tick
crashed"), 2 more landing overnight 07-17→18 (00:01 and 00:03 UTC), both
immediately after the nightly e2e-full breadth crawl window closes — a
timing correlation worth checking for a causal link (shared runner resource
pressure) rather than treating as coincidence. `plan/CRITIQUE.md` is now
3,513 lines (was 3,096 at the 07-11 reinforcement) and `plan/CANDIDATES.md`
(this file) is 4,691 lines (was 4,106) — both have grown, not shrunk, in the
7 days since the last reinforcement, consistent with the content-gate (see
new candidate #33 below) leaving almost no ticks free for `/critique` or
`/expand` passes that would otherwise prune them. Still unpromoted, now 39
days stale since first filing (2026-07-09).

**Reinforced (expand pass 58, 2026-07-26):** a fresh, first-hand failure mode
this same march tick, not just file-size arithmetic: a plain `Read` of
`plan/CADENCE.md` (a *third* plan file, not one of the two this candidate was
originally filed against) failed outright this tick with "File content (35701
tokens) exceeds maximum allowed tokens (25000)" — the exact ceiling-breach
class this candidate names, now confirmed spreading beyond CRITIQUE.md/
CANDIDATES.md to the cadence/gap-table ledger that every single
`/march` tick's Step 1.5 depends on reading. Growth continues unabated on the
original two files as well: `plan/CRITIQUE.md` is now 3,818 lines (was 3,513
at the 07-18 reinforcement, +305 in 8 days) and `plan/CANDIDATES.md`
(this file) is 4,966 lines (was 4,691, +275 in 8 days) — both still growing,
not shrinking, 17 days after first filing. `plan/AUDIT.md` by contrast sits
at a comparatively modest 620 lines, only because its `[x]`-closed rows
already get folded into terse one-line progress notes rather than kept
verbatim — informal proof the archive pattern this candidate proposes works
in practice, just not yet applied to the two files that need it most. Still
unpromoted, now 3 consecutive expand passes (52, digest 07-18, 58) finding
worsening evidence with zero mitigation shipped.

**Update (expand pass 68, 2026-09-04, cloud march):** both file-growth and
functional-failure evidence escalated sharply since the pass-58
reinforcement, 40 days ago — this candidate itself had become one of the
file's own stalest reinforcement gaps. `plan/CRITIQUE.md` is now 5,919
lines / 2.1MB (was 3,818 lines at pass 58, +55%); `plan/CANDIDATES.md`
(this file) is now 6,327 lines / 401KB (was 4,966, +27%). Fresh first-hand
failure this same tick: a plain `Read` of `plan/CADENCE.md` failed outright
("File content (65604 tokens) exceeds maximum allowed tokens (25000)"), and
listing `plan/AUDIT.md`'s pending rows via `grep` twice returned a truncated
2KB preview instead of full output — the identical ceiling-breach class
first confirmed at pass 58 against CADENCE.md alone is now routine rather
than occasional. Tonight's `/digest` pass independently surfaced the
clearest functional consequence yet: `plan/CRITIQUE.md`'s Pending section
holds 43 rows spanning passes 137-151 (not the "handful" recent digests had
estimated), and a spot-check found at least one row (the pass-139/142
"voters, last 7 days · 0" contradiction) already fixed in code but never
moved to Done — silent ledger drift this candidate's archive mechanism
would directly prevent, since a bounded live file is small enough to audit
in one pass instead of estimated from memory. Score raised 5.6 → 6.4 (see
above) — now tied with #35 for the highest-scored unpromoted candidate in
the file. 57 days unpromoted since original filing (07-09), 40 days since
the last reinforcement — recommend leading the next `/oversight` session
with this one, alongside #35.

**Update (digest 2026-10-04):** the ceiling-breach class has moved from a
token-count problem to a hard tool-level file-size wall. `plan/CRITIQUE.md`
is now 7,195 lines / 2.29MB; `plan/AUDIT.md` is 705 lines / 1.27MB. Both
fail a plain `Read` outright tonight with "File content exceeds maximum
allowed size (256KB)" — not the 25K-token ceiling cited at every prior
reinforcement, a different and stricter limit, meaning every one of this
file's own past growth numbers understated how bad the read-ceiling has
gotten (1.27MB and 2.29MB are 5x and 9x the 256KB wall, not just over a
token budget). New file hitting the identical class for the first time:
`plan/LISTS.md` (the Rule-3 ledger, not named in this candidate's original
scope) is now also 1.27MB / 184 rows and fails the same `Read` call —
confirms this is a structural pattern across every append-only ledger the
loop writes to, not just the two files filed against. Scope-widening note
for whenever this ships: `plan/LISTS.md` needs the same archive-or-prune
treatment (e.g. move fully-reviewed, long-stable rows to a `LISTS_ARCHIVE.md`
or compress old review notes to one line) or it will hit this exact wall
next. 87 days unpromoted since original filing (07-09), 30 days since the
last reinforcement (pass 68, 09-04) — three files now in the same broken
state this candidate was filed to fix.

**Update (digest 2026-10-10):** the original failure mode — not just the
file-size-wall `Read` ceiling, the actual SDK-level crash this candidate was
filed against — recurred directly: the 2026-10-09T23:56:20Z cloud `march`
tick (run 38006815107) burned 62 turns / ~37 minutes / $4.86 before dying
with `error: Claude Code returned an error result: Prompt is too long`,
auto-filed as a comment on issue #565. This is the first occurrence of that
specific crash class since 2026-10-02 (8 days quiet) and only the second
since mid-September — rarer than the 2026-07/08 daily-recurrence peak, but
confirms the underlying mechanism is still live, not just a cold historical
citation. File growth continues unabated in the interim: `plan/CRITIQUE.md`
is now 7,456 lines / 2.32MB (was 7,195/2.29MB at the 10-04 reinforcement),
`plan/AUDIT.md` 705 lines / 1.29MB (unchanged line count, same file), and
`plan/LISTS.md` 12,845 lines / 1.31MB — all three still past the 256KB
single-`Read` wall this candidate names. This file itself (`plan/PHASE_
CANDIDATES.md`) is now 7,398 lines / 470KB, the fourth append-only ledger
approaching the same ceiling it was originally scoped to fix only for the
other three. 93 days unpromoted since original filing (07-09), 6 days since
the last reinforcement (digest 10-04) — still the file's longest-standing
unpromoted item and now carrying a fresh, dated production-crash data
point rather than only file-size arithmetic.

**Update (digest 2026-10-13):** this tick's own pulse-gathering surfaced
the sharpest evidence yet for this candidate — not just that the files are
large, but that the size wall is actively corrupting the digest's own
reporting. Tonight, for the first time, a full line-by-line count of
`plan/CRITIQUE.md`'s Pending section was possible (by reading the file in
line-range slices rather than one `Read` call, since the whole file is
2.3MB and fails outright): **102 open findings**, spanning passes 137
through 188, only 6 of them tagged `[needs-user-call]`. Last night's digest
(2026-10-12) reported "8 unresolved rows... nearly all tagged
needs-user-call" — almost certainly a partial read of a recent slice of
the file mistaken for the whole Pending section, not a real count. This is
worse than this candidate's pass-68 finding (43 unreconciled rows, which
first raised this from a read-ceiling risk to a confirmed bookkeeping
defect): the backlog has grown 43→102 in roughly nine weeks (filed
2026-07-09), and the file's size now makes the backlog itself invisible to
normal tooling, which is a new failure mode beyond "big file is slow to
read" — it means nobody (human or agent) has had an accurate picture of
how much is actually open since at least pass 137. `plan/AUDIT.md`'s own
8-row Pending count was independently re-verified this tick and held
accurate (unchanged), so the miscount is specific to CRITIQUE.md's much
larger size (2.3MB vs AUDIT's 1.3MB) — further evidence this is a sliding
scale, not a binary pass/fail. 96 days unpromoted since original filing
(07-09) — still the file's longest-standing unpromoted item, and the one
whose absence is now measurably degrading the loop's own situational
awareness, not just its token budget.

**Update (digest 2026-10-20):** the fix pattern this candidate proposes
just got proven cheap and effective, as a side effect rather than a
dedicated effort. Today's `/iterate` tick swept `plan/CRITIQUE.md` for
rows that carried an inline `- resolved:` note but had never been moved
from `## Pending` to `## Done` — a bookkeeping gap in the content-gap-
redirect workflow running since 2026-08-24. 39 such rows were found and
condensed into the file's one-line `## Done` format (verbatim resolved
notes preserved, multi-paragraph Pending blocks collapsed). Side effect:
`plan/CRITIQUE.md` dropped from 2.3MB to 890KB in one commit — exactly
the archive-and-condense mechanism this candidate has proposed since
07-09, demonstrated manually on one file without a dedicated archive
file or skill change. Genuinely-open Pending findings also dropped from
a stale 102 (the 10-13 reinforcement's count, now confirmed to have
included 39 phantom rows) to 63 real ones — the bookkeeping drift this
candidate's pass-68 reinforcement first flagged as a "confirmed silent
bookkeeping-accuracy defect" was real and has now been corrected once.
`plan/AUDIT.md` (1.3MB) has not had the equivalent sweep and still fails
a plain `Read` outright this tick (confirmed again: "File content
(1.2MB) exceeds maximum allowed size (256KB)") — same 256KB wall first
hit 2026-10-04, unchanged, on the one major ledger nobody's condensed
yet. 103 days unpromoted since original filing (07-09). Recommend
promoting at the next `/oversight`: the scope sketch's archive-file
mechanism is no longer a theoretical hygiene proposal, it's a proven-
cheap fix with a same-day before/after measurement.

**Update (digest 2026-10-21):** the original SDK-crash failure mode
recurred again, 11 days after the 2026-10-10 occurrence this candidate
last cited. The 2026-10-21T14:40:38Z cloud `march` tick (run
39618924091) died with the identical `error: Claude Code returned an
error result: Prompt is too long`, auto-filed as a comment on issue
#565 at 15:44:52Z (the same tracking issue the 10-09 crash landed on) —
confirming this is a recurring class, not a one-off, and that issue
#565 is quietly accumulating recurrence comments with no dedicated fix
in flight. This is the only march failure in an otherwise clean
5-of-6 window (the other 5 scheduled ticks in the last 26h all shipped
content/critique commits), so the crash rate is low but non-zero and
tracks the same mechanism as before: a long-running tick's context
grows past the SDK's prompt ceiling, most plausibly from reading one
of the oversized ledgers this candidate names. File sizes this tick:
`plan/CRITIQUE.md` 876KB (essentially unchanged since the 10-20
condensing), `plan/AUDIT.md` 1.27MB (still uncondensed, still fails a
plain `Read` outright), `plan/LISTS.md` 1.29MB, `plan/CANDIDATES.md`
(this file) 466KB. 104 days unpromoted since original filing (07-09) —
still the file's longest-standing unpromoted item, now with a second
dated production-crash data point bracketing the 10-20 proof-of-fix
evidence on either side: the fix works when applied, the crash keeps
recurring when it isn't.

**Update (digest 2026-10-25) — sharper root cause, not just a size
reading.** Gathering tonight's pulse, a plain `Read` of
`plan/AUDIT.md` (1,309,875 bytes) failed outright as expected, but a
follow-up attempt to read just its first 250 lines via `offset`/
`limit` *also* failed the 25,000-token ceiling — surprising for 250
lines, until `awk '{print length}'` found why: **one single line is
654,455 bytes**, exactly half the file's total 1,309,875. That line
is the standing `[MED] Season-fill drain (STANDING ROW — oversight
2026-07-12)` row (line 31) — by design it never closes ("THIS ROW
STAYS PENDING until the gap table reads zero") and every Rule 2 drain
tick appends a fresh prose progress note to the same line with no
trimming, summarization, or rotation. This is a narrower, more
tractable failure mode than the "360 of 385 rows are closed dead
weight" case this candidate's scope sketch already targets — it is
one open row growing unboundedly, not many closed rows accumulating.
Same archive mechanism this candidate proposes would fix it if
extended slightly: periodically compact or rotate a single standing
row's own historical log (plausibly into `plan/CADENCE.md`, where the
gap table the row tracks already lives) rather than only moving
`[x]`-closed rows out. Not filing as a separate candidate — this is
an implementation-scope refinement of #29, not a different problem.

### [ ] [score 5.5] meth_who_p misleading-completeness guard + content-check gate
- kind: guard
- proposed: 2026-06-21, v1 candidate #21 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 5.5] Tagline years-vs-seasons clarification gate
- kind: guard
- proposed: 2026-06-21, v1 candidate #22 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 6.4] Prose sentence-capitalization invariant (post-period lowercase-start guard)
- kind: guard
- proposed: 2026-07-03, v1 candidate #23 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 5.5] Chrome revised-date source-of-record: `lastRevised(scope)` helper
- kind: guard
- proposed: 2026-06-17, v1 candidate #19 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 5.8] Era filter tab polish — empty state + contextual label
- kind: product
- proposed: 2026-06-15, v1 candidate #14 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 5.0] /u/[handle] record stat-chip scaffold
- kind: product
- proposed: 2026-06-15, v1 candidate #16 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

### [ ] [score 3.0] Newsletter subscribe (Buttondown embed)
- kind: product
- proposed: 2026-05-14, v1 candidate #03 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)

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

## Considered (awaiting promotion)

<!-- Format:
### <NN>. <Phase title>
**Score:** N.N (impact: N, ease: N)
**Source pass:** <expand pass number>
**Filed:** <ISO date>
**Why:** <one-paragraph rationale>
**Scope sketch:** <2-3 lines of what would ship>
-->

### 36. the-voice factual-corruption remediation — re-verify 8 season files, insert 2 missing real seasons, fix the live false "show has ended" claim ~~(resolved — seasons 22-30 corrected against the NBC run, cad5046b, #762)~~

**Score:** 6.0 (impact: 8, ease: 6 → 4.8 base + 2.0 signal multiplicity/urgency —
a currently-LIVE reader-facing false claim on a shipped show page, and the
source AUDIT row itself explicitly asks for `/expand` treatment given the
blast radius; -0.8 for genuine scope uncertainty — the fix touches file
renumbering, a canon rebase, and cross-catalog reference cleanup, closer to
"3+ phases or unclear scope" than a clean 1-phase ship)
**Source pass:** 59
**Filed:** 2026-07-28
**Why:** `plan/AUDIT.md` (line 621) documents a confirmed, deep factual
corruption across `content/shows/the-voice/seasons/22-*.md` through
`29-*.md` (8 files) plus the show's own frontmatter — not a simple
off-by-one numbering issue, but conflated cast lists, wrong premiere dates,
a duplicated real season, an omitted real season (the actual on-screen
Blake Shelton farewell has no filed season at all), and a fabricated
"series finale" that never happened. The blast radius is live and reader-
facing right now: `content/shows/the-voice.md` reads `status: hiatus` and
its `blurb`/`tagline`/`card_tagline` state the show "signed off" after a
"fourteen-year run" — a false claim on a production page. Root cause: a
phantom "spring 2022" season was inserted for a broadcast year where NBC
actually ran only one cycle (confirmed via Hollywood Reporter + TV Series
Finale), and that single insertion cascades a +1 offset through every
later file, compounding into the outright cast/date conflations. This is
exactly the case `/expand` exists to catch: an audit finding that scores
moderately on the standard impact×ease formula (4.8) but whose true scope
— renumber/insert/verify across 8+ files, rebase canon ranks, cross-check
every themed-list entry citing `show: the-voice` with season ≥22, and
regenerate e2e canonical-URL fixtures after the renames — is structurally
too large and too fabrication-risk-sensitive to hand to a single
autonomous content tick with no review checkpoint. The AUDIT row's own
filing explicitly recommends promoting this to a dedicated phase or a
direct oversight-reviewed tick rather than letting a routine Rule 2 drain
touch it.
**Source signals:**
- `plan/AUDIT.md` [HIGH, score 4.8] filed 2026-07-26 during a cloud
  `/march` tick's Rule 3 research pass (8th pass), escalated same-day (9th
  pass) with a full scout-verified season-by-season accounting against
  Wikipedia + NBC Insider/Today.com sourcing. Still Pending as of this
  filing.
- The row itself blocks further the-voice content authoring ("do not
  author new the-voice content depending on any specific season number
  ≥22's real-world event") until this resolves — an active constraint on
  the standing Rule 2 season-fill drain, not just a cosmetic content bug.
- Confirmed real, still-unaired seasons exist that the catalog has never
  filed: real NBC Season 29 (Feb 2026, first-ever 3-coach "Battle of
  Champions" format) and real Season 30 (confirmed airing Sep 2026) — both
  currently invisible to readers because the catalog's own (wrong)
  `29-the-finale.md` claims the show already ended.
**Scope sketch:**
- A dedicated scout-verification pass re-confirming each of the 8 affected
  files' real-world cast/date/event against primary sourcing (Wikipedia
  per-season articles, NBC Insider, Today.com) — largely already done by
  the AUDIT row's own 9th-pass research; this step is closer to a
  transcription/formalization of existing findings than fresh research.
- Decide file-count treatment: real Season 23 (Shelton's true on-screen
  farewell) has no filed season at all and needs insertion, which shifts
  every later file's number — a rename, not just a content edit, so every
  shifted season's `NN-<slug>.md` filename and `canonical_position` moves.
- Rewrite `content/shows/the-voice.md`: `status: hiatus` → `airing`, strip
  the false "signed off"/"fourteen-year run" framing from
  `blurb`/`tagline`/`card_tagline`.
- Author the two real unfiled seasons (S29 "Battle of Champions," Feb 2026;
  S30, Sep 2026 — casting/coaches only, spoiler-safe, no outcomes since
  S30 hasn't aired at filing time).
- Rebase `canon.md` fully across the renumbered range — ranks and
  `canonical_position` for every season from 22 onward.
- Cross-check every `content/themes/*.md` entry citing `show: the-voice`
  with `season` ≥ 22 for now-wrong `season_label`/title references (the
  19f schema's `related`/entry-title-must-match-frontmatter invariant
  makes stale entries a `content:check` failure risk once the source
  files renumber).
- Regenerate/verify `apps/e2e/src/fixtures/canonical-urls.ts` picks up the
  renamed slugs automatically (it's content-loader-derived, per bearings)
  — confirm no stale hardcoded reference survives elsewhere.
**Estimated phases:** 1, but an unusually dense one — file renumbering +
canon rebase + cross-catalog reference cleanup in a single commit is a
larger, higher-fabrication-risk unit than a normal Rule 2 drain tick;
`/oversight` may prefer to review the scout-verification output before
authorizing the autonomous loop to touch the renumbering, given how much
of the original corruption already came from an unsupervised assumption
(unbroken twice-yearly cadence) compounding silently across 8 files.
**Conflicts:** none with `spec.md` or the URL contract — this is a
content-accuracy fix, not a new surface. Overlaps operationally with the
standing Rule 2 season-fill drain row (both touch `content/shows/the-voice/`),
but the AUDIT row explicitly blocks routine Rule 2 authoring on this show
until the corruption resolves, so this should ship as its own reviewed
unit rather than fall out of an ordinary drain tick.

**Update (expand pass 60, 2026-08-10):** confirmed a second live
instance of the exact same fabricated "series finale" claim, in a
themed list rather than the show page — `content/themes/closing-
statement.md`'s `show: the-voice, season: 29` entry (rank 3)
restates "Fourteen years in, The Voice closes... The season plays
with the focus a real series finale earns" nearly verbatim to the
already-documented false claim. Git-blamed to `92d1be9b`
(2026-07-17), which **predates** the 07-26 discovery entirely — this
was never caught by the addendum that flagged the one other
post-discovery violation (`9ec927d9`). Found via `git log -p
--since=2026-07-28 -- content/themes/` while gathering this pass's
signals; exactly the cross-catalog reference risk this candidate's
own scope sketch already named ("cross-check every
`content/themes/*.md` entry citing `show: the-voice` with season ≥
22"), now with a second concrete confirmed hit. Filed as a scoped,
independent single-entry fix — `plan/AUDIT.md` [HIGH, score 7.2],
not folded into this candidate's own scope, since a deletion (drop
the entry, renumber ranks) carries none of the renumbering/fact-
verification risk the full remediation does and doesn't need to
wait for it. That AUDIT row now outscores every other Pending
content-gaps row, so the next `/march` Step 3b.5 dispatch should
pick it up directly. This candidate's own scope (the full 8-file
remediation) is unchanged and still recommended for a dedicated
oversight-reviewed session — the new finding raises confidence that
the live blast radius is larger than one page, not smaller.

### 34. Shard the e2e-full breadth crawl across parallel Playwright workers ~~(resolved — the nightly crawl is sharded five ways, 47ce5d68)~~

**Score:** 6.6 (impact: 7, ease: 6 → 4.2 base + 2.4 signal multiplicity — raised at
pass 59 from persistence evidence: same breach recurring nightly, unaddressed 6 days
after filing)
**Source pass:** 57 (reinforced pass 59, reinforced pass 72)
**Filed:** 2026-07-22 (reinforced 2026-07-28, reinforced 2026-09-23)
**Pass-72 reinforcement (persistence milestone, still unpromoted):**
`plan/AUDIT.md`'s source row (line 663... see the e2e-full row) logged a fresh
digest update as recently as 2026-09-22 (yesterday) — the alternating
breach/green/breach pattern is unchanged after 63 days with "no clear trend
either direction," and the row now explicitly calls this "the file's longest-
unpromoted candidate." No new scope information this pass (the fix shape and
the cloud `workflows`-OAuth-scope blocker are unchanged since filing) — this
reinforcement is a pure persistence signal: 63 days unpromoted is an order of
magnitude past the 6-10 day figures cited at the last reinforcement (pass 59),
and the underlying single-worker bottleneck this candidate targets has not
been touched by any of the ~20 digest updates logged against the source row
in the interim. Score held at 6.6 (no new scope information to justify a
further bump, per the same reasoning pass-59 applied) — flagging again for
`/oversight` as the standing recommendation, now overdue by a wide margin.
**Pass-59 reinforcement (persistence, still unpromoted):** `plan/AUDIT.md`'s
source row (line 619) confirms the same breach has now recurred **every single
night since filing** — 7 consecutive red `e2e-full` runs (2026-07-21 through
2026-07-27, run IDs tracked in issue #636's comment thread, one "Recurred"
comment per night), each dying on the identical 75-minute wall with all
completed checks passing. Candidate #34 itself has sat unpromoted for 6 days
with the standing recommendation unchanged (shard, don't bump the timeout a
third time). No new scope information this pass — the fix shape and the cloud
`workflows`-OAuth-scope blocker are exactly as documented at filing — this is
a pure urgency signal: every day this stays unpromoted is another guaranteed
red night with zero new information, burning CI minutes for no signal.
**Why:** The nightly `e2e-full` breadth crawl went red again at
2026-07-21T00:41:24Z (run 29787007925) — not a test regression, the same
duration-ceiling breach class as superseded candidate #26: all 9,278 of 9,278
completed checks passed, but the "Exhaustive e2e crawl (E2E_FULL=1)" step hit
`.github/workflows/e2e-full.yml`'s `timeout-minutes: 75` wall with 734 of
10,012 tests still remaining (92.7% complete). Candidate #26 already fixed this
once (2026-07-12, `timeout-minutes` 50→75) after four consecutive red nights,
but explicitly flagged the bump as a stopgap: the workflow file itself still
carries the comment "If 75 stops being enough, the real fix is sharding the
crawl, not another bump" (`.github/workflows/e2e-full.yml:92`). Nine days
later, it stopped being enough — test count grew from 7,138 (at the 50→75
bump) to 10,012 (+40%), tracking the content saga's own perpetual season-drain
mandate exactly as candidate #26 predicted it would. The crawl runs Playwright
with `workers: 1` (`apps/e2e/playwright.config.ts:82`), so wall-clock scales
linearly with total page count and every future content tick makes the next
breach arrive sooner. A third timeout bump would only buy a few more weeks
before recurring a third time — the structural bottleneck (single worker) is
unaddressed either way. **BLOCKED FROM CLOUD**: the fix requires editing
`.github/workflows/e2e-full.yml`, which the cloud loop's `ACTIONS_PAT` cannot
push (lacks the `workflows` OAuth scope — the identical blocker candidate #26
and issue #416/#480 already hit on this same file family). Filed as a fresh
candidate rather than reopening #26 (which is marked resolved/superseded) —
same convention as how a recurrence of #32's dedupe fix would get its own
number.
**Source signals:**
- `plan/AUDIT.md` [MED, score 5.4] "Nightly e2e-full breadth crawl went red
  again 2026-07-21T00:41:24Z" — filed 2026-07-21 via `/triage` of issue #636,
  explicitly cites the workflow file's own "shard, not another bump" comment
  and flags BLOCKED FROM CLOUD.
- GitHub issue #636 (open, `triage:loop-queued`), 1:1 mirror of the AUDIT row,
  no independent new information beyond it.
- Candidate #26 itself (superseded 2026-07-12) — its own scope sketch already
  named sharding as the necessary follow-up "once even 75 minutes stops being
  enough," which is exactly what happened.
**Scope sketch:**
- Convert the single "Exhaustive e2e crawl" step in
  `.github/workflows/e2e-full.yml` into a matrix of N parallel jobs, each
  running `pnpm --dir apps/e2e exec playwright test --shard=<i>/<N>`
  (Playwright's built-in sharding flag — no config-file change needed beyond
  passing the flag). Pick N (likely 4) so each shard's wall-clock comfortably
  fits inside a much shorter per-shard timeout, well under the current
  75-minute wall.
- Keep `workers: 1` per shard (unchanged) if the single-worker constraint
  exists for a reason (e.g. Supabase container contention under `E2E_FULL=1`)
  — verify that assumption at implementation time; if it was only ever a
  historical default, consider raising both shard count and per-shard workers
  together for a bigger win.
- The "Pre-start Supabase containers" and "Production build" steps either
  need to run once and be shared (build artifact reuse across matrix jobs) or
  be duplicated per shard — duplication is simpler to ship first, artifact
  sharing is the natural follow-up if setup cost dominates.
- Same `workflows`-scope cloud blocker as candidate #26/#32/issue #416 —
  ships via `/oversight` in a local session, not through `plan/README.md`.
  Recommend bundling with any other pending workflow-file edits in the same
  session per the established pattern.
**Estimated phases:** 0 (workflow-config change, not a build-plan phase —
ships via `/oversight` directly, same precedent as candidate #26/#32).
**Conflicts:** none. Supersedes-in-spirit candidate #26 (same root cause,
now proven the timeout-bump approach doesn't scale) without literally
reopening it.

**Update (digest 2026-08-06):** two more red nights (08-04 run
30959832574, 08-05 run 31056138181), both dying on the identical
75-minute wall — **16 consecutive red nights now** (07-21 through
08-05). The catalog has held flat at 10,485 tests for both nights (no
growth since 08-03), and completion held flat too (~89.5% both nights,
9,399/10,485 on 08-04 per the prior digest, 9,389/10,485 on 08-05) —
the erosion trend has plateaued rather than reversing, likely
because this window's content ships were Rule-3 themed-list extends
(which don't add new e2e URLs) rather than new season files. Still
unpromoted 16 days after filing.

**Update (digest 2026-08-09):** four more red nights (08-06, 08-07
×2 runs, 08-08), same 75-minute wall each time — **20 consecutive
red nights now** (07-20 through 08-08, or 20 counting back one
further than the 08-06 update's window). Catalog grew slightly to
10,510 tests (from 10,485), a MasterChef Australia season backfill
landing in this window. All completed checks continue to pass; this
remains a pure duration-ceiling breach, not a quality regression.
Still unpromoted 19 days after filing.

**Update (digest 2026-08-10):** the 9-consecutive-red streak (07-31
through 08-08) broke — the 2026-08-09 run posted `success`, the
first green `e2e-full` since 07-30. Catalog size is unchanged
(still 10,500+ tests, single worker), so this reads as inconclusive
rather than resolved: either the run got lucky on timing/contention,
or something else shaved enough wall-clock to clear the 75-minute
wall this one time. Recommend one or two more nights of observation
before either promoting or deprioritizing — a second consecutive
green run would meaningfully weaken the case for sharding; a
reversion to red would confirm the plateau noted at 08-09 was
temporary, not a trend break. Still unpromoted 20 days after filing.

**Update (digest 2026-08-11):** the observation window resolved —
2026-08-10's run (31441429717) posted `failure`, the identical
75-minute-wall duration-ceiling breach (9,462 of 10,544 tests
complete, 89.7%, run 23:16:11→00:30:47 UTC = 74m36s). The 08-09
green run was the outlier, not a trend break: single-night
recoveries on a fixed 75-minute wall against a catalog that only
grows were always going to happen occasionally by timing/contention
luck, but the structural bottleneck (`workers: 1`,
`apps/e2e/playwright.config.ts:82`) is unchanged and the catalog
(10,544 tests, +34 since 08-09) hasn't shrunk. This closes the
observation window opened at 08-10 — recommend promoting at the
next `/oversight` session rather than watching for a third data
point; every additional red night is CI minutes burned for zero new
information, exactly the pass-59 urgency signal restated. Still
unpromoted 21 days after filing (07-22 filing, 07-28 reinforcement).

**Update (expand pass 63, 2026-08-16, cloud march):** the 08-11
close-out held — six more consecutive red nights since (08-10 through
08-15), same 75-minute-wall duration-ceiling breach each time, no
further green outliers. Issue #636 picked up another same-day
recurrence comment this morning (2026-08-16T00:23:45Z, run
31913822337). `night.yml` itself stayed green for 5 straight runs in
the same window (08-11 through 08-15) — the sibling starvation
candidate (#35) shows no new evidence this window, this remains a
pure e2e-full/sharding problem, not a scheduling one. No change to
score or scope sketch — still blocked from cloud (`.github/workflows/
e2e-full.yml` needs the `workflows` OAuth scope the cloud loop's
`ACTIONS_PAT` lacks). 26 days unpromoted since filing (07-22 filing,
07-28 reinforcement). Ripe for `/oversight` promotion at the next
local session — a human pushing the workflow-file edit is the only
path that closes this one.

**Update (expand pass 67, 2026-08-30, cloud march):** the breach is
still live and now visibly teetering right at the 75-minute wall
rather than clearing it with margin. Checked the last several
`e2e-full` runs directly via `gh run view --log`: 08-27 (run
33025850485, 10,557 tests) and 08-28 (run 33133693773, 10,557
tests) both hit the identical `##[error] ... has timed out after 75
minutes` wall; 08-28's late trigger (run 33219380847, 10,565 tests)
timed out too; but 08-29's run (33280261007, same 10,565 tests)
posted `success` at `10565 passed (1.2h)` — 72 minutes, inside the
wall with only ~3 minutes of margin. Catalog growth has slowed
sharply (10,544 at the 08-11 close-out → 10,565 now, +21 over 19
days, versus +40% in the prior stretch) since recent content ticks
have mostly been Rule-3 list extends and take/shape drains on
already-filed seasons rather than new season files — but the
crawl is still failing more nights than not (checked the 10 most
recent `e2e-full` runs: 7 failures, 3 successes, all on the
identical duration-ceiling signature, zero quality regressions).
No new scope information — same fix (Playwright `--shard`), same
`workflows`-OAuth-scope cloud blocker. Restating the pass-63
recommendation unchanged: this is ripe for `/oversight` promotion,
not further reinforcement passes — the signal has been stable and
unambiguous for over a month.

**Update (expand pass 68, 2026-09-04, cloud march):** the pattern
holds exactly at the pass-67 baseline, no drift either direction.
Checked the 10 most recent `e2e-full` runs directly (08-25 through
09-04): 7 failures, 3 successes, the identical split pass 67 found,
all on the same 75-minute duration-ceiling signature. Tonight's own
run (09-04, 33823160574) timed out at 9,218 of 10,565 tests complete
(87.3%) — confirmed via `gh run view --log` (`Running 10565 tests
using 1 worker` at 00:50:22Z, killed at 02:04:59Z right after test
9218, a `smoke-mobile.spec.ts` case). Catalog size is now fully flat
at 10,565 (unchanged since the count pass 67 cited) — the
content-side growth that was previously eroding the wall's margin has
stopped, but the crawl still fails more nights than not against the
existing catalog alone, confirming this is a pure single-worker
throughput problem, not a catalog-growth-outpacing-the-wall problem.
No new scope information; same fix (Playwright `--shard`), same
`workflows`-OAuth-scope cloud blocker. 44 days unpromoted since
filing (07-22) — restating pass-63/67's unchanged recommendation:
ripe for `/oversight` promotion, not further reinforcement passes.

**Update (digest 2026-09-05):** tonight's `e2e-full` run (33933576183,
2026-09-05T00:37:16Z) finished green in 71m19s — under the 75-minute
wall this time, unlike 7 of the last 10 runs pass-68 counted. One
green run doesn't change the diagnosis (single-worker throughput
against a flat 10,565-test catalog is still the bottleneck; this run
just landed on the fast side of its own variance). 45 days unpromoted
since filing (07-22) — unchanged recommendation.

**Update (digest 2026-09-06):** the green run was the variance, not a
trend break — tonight's run (34001648876, 2026-09-06T00:34:40Z) hit
the standard 75-minute wall again, `Running 10573 tests using 1
worker`, 9,033 of 10,573 complete (85.4%) at cutoff, worse than
09-04's 87.3%. All completed checks passing. Catalog basically flat
(10,565→10,573). This is the same single-worker throughput ceiling
pass-67/68 already diagnosed conclusively — no new scope information,
just another data point in a five-week-old, unambiguous signal. 47
days unpromoted since filing (07-22) — restating the standing
recommendation unchanged: this is ripe for `/oversight` promotion,
not further reinforcement passes.

**Update (digest 2026-09-08, covering 09-07 and 09-08):** two more
red nights, no green in between — the streak is now **3 consecutive
red `e2e-full` runs** (09-06, 09-07, 09-08). 09-07's run
(34070594162) hit the wall at 9,192/10,573 (86.9%, the best showing
since 09-04's 87.3%); 09-08's run (34174840735) dropped back to
9,030/10,573 (85.4%, tying 09-06's low). Catalog held exactly flat
at 10,573 tests across all three nights — this is pure single-worker
throughput variance around a fixed ceiling, not a shrinking or
growing catalog. Both runs die on the identical `timeout-minutes: 75`
wall with every completed check passing; issue #636 picked up its
41st and 42nd "Recurred" comments. No new scope information — same
fix (Playwright `--shard`), same `workflows`-OAuth-scope cloud
blocker. **48 days unpromoted since filing (07-22).** Restating the
unchanged standing recommendation: this is ripe for `/oversight`
promotion, not further reinforcement passes — the signal has been
stable and unambiguous for nearly seven weeks.

**Update (digest 2026-09-09):** the streak broke — 09-09's run
(34297549504) finished **green**, completing the full 10,012-test
crawl in 70m22s (01:05:49–02:16:11 UTC), inside the 75-minute wall
with roughly 5 minutes to spare. That margin is thin, not
reassuring: at the throughput this run demonstrated (~142
tests/min single-worker), the catalog has only about 700 tests of
headroom before the wall breaches again on a normal night, let alone
a slower one — the exact linear-growth mechanism that eroded the
original 50-minute ceiling. No scope change to the fix; **49 days
unpromoted since filing (07-22).** One green night doesn't retire
this candidate, it just delays the next breach by a few nights.

**Update (digest 2026-09-10):** the delay was one night. Tonight's run
(34423020508, started 00:54:50Z) hit the standard 75-minute wall with
`Running 10578 tests using 1 worker` (up from 10,012 the night of the
green run), 8,724 of 10,578 completed (82.5%) at cutoff — the worst
completion rate of the last five breaches, confirming last night's
predicted ~700-test headroom was consumed almost immediately by
normal catalog growth rather than marking a durable improvement. No
scope change to the fix; **51 days unpromoted since filing (07-22).**
The margin math from 09-09 held for exactly one night — the strongest
evidence yet that this needs promotion before the next digest, not
another reinforcement pass.

**Update (digest 2026-09-11):** still breaching, but not worsening —
tonight's run (34548135786, started 00:53:24Z) hit the standard
75-minute wall with `Running 10586 tests using 1 worker` (up from
10,578), 9,232 of 10,586 completed (87.2%) at cutoff — better
completion than 09-10's 82.5% low, closer to the 09-07/09-08 range,
but still a full breach with zero test-quality regression. No scope
change to the fix; **52 days unpromoted since filing (07-22).** Six
of the last seven nights (09-06 through 09-11, only 09-09 green) have
now breached the wall — the pattern is stable, not improving; still
the standing `/oversight` recommendation.

**Update (digest 2026-09-12):** third consecutive breach — tonight's
run (34663160050, started 00:54:36Z) hit the standard 75-minute wall
with `Running 10594 tests using 1 worker` (up from 10,586), 9,380 of
10,594 completed (88.5%) at cutoff — a shade better than 09-11's
87.2% but still a full breach, zero test-quality regression. No
scope change to the fix; **53 days unpromoted since filing (07-22).**
Seven of the last eight nights (09-05 through 09-12, only 09-09
green) have now breached the wall, three in an unbroken row (09-10,
09-11, 09-12) — still the standing `/oversight` recommendation.

**Update (digest 2026-09-16, catching up four nights):** the breach
streak extended every night since the last update. 09-13's run
(34728429419) hit the wall with `Running 10594 tests using 1 worker`
(flat vs. 09-12), 9,053 of 10,594 completed (85.4%); 09-14's run
(34793638737) breached with the catalog up to 10,602 tests, 8,920
completed (84.1%); 09-15's run (34916176869) breached again, flat at
10,602, 9,247 completed (87.2%); tonight's 09-16 run (35042761077)
breached a fourth time, still flat at 10,602 tests, 9,006 completed
(84.9%). Notably the catalog stopped growing across all three most
recent nights (10,602 flat 09-14 through 09-16) — the wall is now
purely a single-worker throughput ceiling, not a moving target from
content growth, which makes the sharding fix this candidate proposes
a durable resolution rather than a stopgap against continued growth.
All completed checks passing every night, zero test-quality
regression. Seven of the last seven nights (09-10 through 09-16) have
now breached the wall in an unbroken row — the longest unbroken
streak logged yet. No scope change to the fix; **57 days unpromoted
since filing (07-22).**

**Update (digest 2026-09-17):** eighth consecutive breach — tonight's
run (35169164707, started 01:05:13Z) hit the standard 75-minute wall
with `Running 10602 tests using 1 worker` (flat vs. 09-16), 9,092 of
10,602 completed (85.8%) at cutoff, mid-range for this streak. Catalog
has now held exactly flat at 10,602 tests for four straight nights
(09-14 through 09-17), reinforcing the 09-16 update's read: this is a
pure single-worker throughput ceiling, not a growing target. All
completed checks passing, zero test-quality regression. No scope
change to the fix; **58 days unpromoted since filing (07-22).** Eight
of the last eight nights (09-10 through 09-17) have now breached the
wall in an unbroken row — still the standing `/oversight`
recommendation, now the file's longest-running unpromoted candidate.

**Update (digest 2026-09-18):** the eight-night breach streak broke
— tonight's run (35293694466, started 01:05:44Z) finished in
1h12m30s, `Running 10603 tests using 1 worker`, all 10,603 passed.
Catalog grew by exactly 1 test (masterchef finale-shift landed
overnight) after four flat nights. First green night since 09-09,
but the margin under the 75-minute wall is thin (~2.5 minutes) —
reads as the wall holding tonight, not the single-worker throughput
ceiling this candidate targets resolving itself. No scope change to
the fix; **59 days unpromoted since filing (07-22)** — still the
file's longest-unpromoted candidate, still the standing `/oversight`
recommendation.

**Update (digest 2026-09-19):** second consecutive green night —
tonight's run (35411130727, started 00:58:21Z) again finished under
the wall, all tests passing. Two green nights in a row after the
eight-night breach streak, but nothing about the single-worker
throughput ceiling this candidate targets has actually changed —
still a relief reading, not a fix. No scope change; **60 days
unpromoted since filing (07-22)** — still the file's
longest-unpromoted candidate, still the standing `/oversight`
recommendation.

**Update (digest 2026-09-20):** the two-night green streak broke —
tonight's run (35479351263, started 00:39:44Z) hit the standard
75-minute wall again, `Running 10603 tests using 1 worker` (flat vs.
09-18/09-19), 9,104 of 10,603 completed (85.9%) at cutoff, all
completed checks passing, zero test-quality regression. This is the
expected reversion, not new evidence — two green nights were never
going to retire a fixed single-worker throughput ceiling. No scope
change to the fix; **61 days unpromoted since filing (07-22)** —
still the file's longest-unpromoted candidate, still the standing
`/oversight` recommendation.

**Update (digest 2026-10-11):** the longest green streak this
candidate has recorded — seven consecutive nights, 10-04 through
10-10, latest clocked 74m38s against the 75-minute wall — broke
exactly as the 10-10 digest flagged it would ("margin is thinning,
not widening"): tonight's run (38102237540, started 01:33:33Z) hit
the wall at 9,278/10,012 (92.7%), all completed checks passing. See
`plan/AUDIT.md`'s e2e-full row for the full update. No scope change
to the fix — sharding across parallel Playwright workers remains the
only thing that retires this ceiling rather than just riding it.
**82 days unpromoted since filing (07-21)** — still the file's
longest-unpromoted candidate, still the standing `/oversight`
recommendation.

**Update (digest 2026-10-12):** breached again the very next night —
the first back-to-back red pair since the 08-15→08-21 mixed week.
Tonight's run (38194318853, started 02:03:49Z) hit the same wall at
8,889/10,719 (82.9%), zero actual test failures. See `plan/AUDIT.md`'s
e2e-full row for the full update. No scope change to the fix.
**83 days unpromoted since filing (07-21)** — still the file's
longest-unpromoted candidate, still the standing `/oversight`
recommendation.

**Update (digest 2026-10-13):** breached a third consecutive night —
a new record for this row. Tonight's run (38341294843, started
03:21:07Z) hit the same wall at 8,860/10,735 (82.5%), zero actual test
failures. Three-in-a-row surpasses both the 08-15→08-21 mixed week and
the 10-11→10-12 pair logged two nights ago. See `plan/AUDIT.md`'s
e2e-full row for the full update. No scope change to the fix — sharding
remains the only thing that retires this ceiling. **84 days unpromoted
since filing (07-21)** — still the file's longest-unpromoted candidate,
still the standing `/oversight` recommendation.

**Update (digest 2026-10-21):** the alternating pattern holds, no
trend either direction. Since the 10-14 AUDIT.md log entry: 10-15 and
10-16 came back green, 10-17 through 10-19 breached three nights
straight, 10-20 came back green, and tonight's run (39526452277,
started 01:17:32Z) breached again at 8,643/10,743 (80.5%), zero actual
test failures among completed checks — the same 75-minute single-
worker wall every time. Total test count (10,743) is flat-to-slightly-up
vs. the 10-14 count (10,735), tracking the content saga's steady
catalog growth. Auto-filed as a recurrence comment on issue #636
rather than a fresh issue (14-day staleness-bound dedupe working as
designed). No scope change to the fix. **92 days unpromoted since
filing (07-21)** — still the file's longest-unpromoted candidate,
still the standing `/oversight` recommendation.

### 35. Decouple `night.yml`'s concurrency group from `march` so the digest can't be starved out ~~(resolved — night.yml runs in its own concurrency group, ab328564)~~

**Score:** 6.4 (impact: 8, ease: 8 — a full week of silently missing the
loop's only human-facing instrument, with a mechanical, well-understood fix)
**Source pass:** digest, 2026-07-27
**Filed:** 2026-07-27
**Why:** `plan/DIGEST.md` sat frozen on its 2026-07-20 snapshot for a full
week — the six daily night runs after it (07-21 through 07-26) all show
`conclusion: cancelled` in `gh run list --workflow night`, and the run before
that (07-20) burned its full 30-minute job timeout. Root cause confirmed via
`gh run view --log` on every run: `night.yml` intentionally shares the
`march` concurrency group (`cancel-in-progress: false`) so its commit never
races a concurrent march push — but march fires roughly hourly while night
fires once a day, and GitHub Actions concurrency groups only keep the
*most-recently-queued* run per group. Every night trigger that landed while a
march run was in progress got queued, and the next march trigger (almost
always <1h later) silently evicted it before it started — no error, no log,
nothing. Worse, cancelled runs don't hit the workflow's `if: failure()`
issue-filing step, so this produced zero signal anywhere: no GitHub issue,
no AUDIT row, no comment — only visible by reading raw run history by hand,
which is exactly how tonight's tick found it. The cost isn't just a missing
status page: for that week, the breadth-verdict escalation, the saga
progress report, and the meta-loop's tuning-proposal cadence all went dark
at once, since digest is the only thing that does any of the three.
**Source signals:**
- `plan/AUDIT.md` [HIGH, score 6.4] filed this tick with the full run-by-run
  evidence (six cancelled runs' database IDs, the one timeout, the
  `if: failure()` blind spot).
- `.github/workflows/night.yml`'s own header comment, which states the
  shared-group rationale plainly ("Shares the march concurrency group so
  cloud writers never race") — the intent was sound, the failure mode
  (starvation, not racing) wasn't anticipated.
**Scope sketch:**
- Give `night.yml` its own concurrency group (e.g. `group: night`) instead
  of sharing `march`'s, so its daily trigger can never be evicted by an
  hourly march run queuing behind it.
- The original race this guarded against (night's commit landing mid-march-
  push) needs a lighter substitute: since the digest commit only ever touches
  `plan/DIGEST.md` (+ occasional `plan/AUDIT.md` / `plan/CANDIDATES.md`
  rows, never code), a `git pull --ff-only` immediately before the commit
  step (already implied by skills/digest.md §3 step 1, but re-run it right
  before the final commit too) plus a retry-once-on-push-rejection loop
  would cover the actual risk (a lost push) without needing a shared queue.
- Alternative if a shared queue is still preferred: bump `night.yml`'s
  `timeout-minutes` well past march's typical run length (some march ticks
  run 50+ minutes) so a queued night run has enough runway to actually start
  and finish once it's next in line, rather than dying to the job timeout
  the way the 07-20 run did.
- Likely the identical `workflows` OAuth-scope cloud-permission blocker as
  candidates #26/#34 (this is a `.github/workflows/night.yml` edit) — verify
  at implementation time; if blocked, bundle with #26/#34's other pending
  workflow-file edits in the same local/`/oversight` session.
**Estimated phases:** 0 (workflow-config change, not a build-plan phase —
ships via `/oversight` directly, same precedent as candidate #26/#34).
**Conflicts:** none.

**Update (digest 2026-08-06):** the starvation race fired again —
2026-08-05's night run (31000808252, created 11:16:35Z) shows
`conclusion: cancelled`, confirmed via bracketing `march` runs
(10:34:07Z→12:07:02Z and 11:27:38Z→13:26:17Z) matching the exact
diagnosed mechanism: the daily trigger queued mid-march-run and the
next hourly march trigger evicted it before it started. This is the
third confirmed loss since the 2026-07-27 diagnosis (07-28, 07-30, now
08-05) — a loss roughly every 3-5 nights, not self-resolving. This
particular loss cost a full day of `plan/DIGEST.md` staleness (frozen
on its 08-04 snapshot until this tick caught up), the same failure
mode as the original week-long blackout, just shorter because the next
day's run happened to get a clear runway. Still unpromoted 10 days
after filing.

**Update (digest 2026-08-09):** worst recurrence yet — **two
consecutive nights lost**, not one. `gh run list --workflow night`
shows 08-07 (created 10:46:40Z) and 08-08 (created 10:43:05Z) both
`conclusion: cancelled`, back to back, the first time this has
happened since the 07-27 diagnosis (prior losses were isolated:
07-28, 07-30, 08-01, 08-02, 08-05 — never two in a row). The result
was a 3-day digest blackout (frozen on the 08-06 snapshot through
08-09), the longest since the original week-long outage that
prompted this candidate's filing. The loss cadence itself is also
accelerating: 5 losses in the 12 nights since diagnosis (07-28,
07-30, 08-01, 08-02, 08-05, 08-07, 08-08 — 7 losses in 13 nights,
not the "every 3-5 nights" rate noted at the 08-06 update). Now the
single most urgent of the four unpromoted candidates in this file —
recommend promoting ahead of #34/#33/#36 given it is actively
degrading rather than holding steady. Still unpromoted 13 days
after filing.

**Update (digest 2026-08-10):** 08-09's night run posted `success`
— the first clean run since the 08-07/08-08 back-to-back loss, and
tonight's tick (08-10, this one) is running now with no contention
signs. One clean night doesn't retire the finding — the root cause
(the shared concurrency group's most-recently-queued-wins eviction)
is completely unchanged, and the 08-06 update already showed a
single clean night (08-06 itself) sitting between two loss clusters.
Softening from "single most urgent of the four" to "still urgent,
currently dormant" — #36 (the-voice) is the one candidate whose cost
is actively growing rather than intermittent, and should lead the
next `/oversight` session ahead of this one. Still unpromoted 14
days after filing.

**Update (expand pass 67, 2026-08-30, cloud march):** the starvation
pattern is not dormant — `gh run list --workflow night.yml` shows 7
more cancellations in the 12 nights since the 08-10 update (08-19,
08-21, 08-23, 08-24, 08-26, 08-29, and today 08-30), a higher rate
than the "every 3-5 nights" baseline noted at filing. Caught a clean,
fresh repro of the exact diagnosed mechanism live during this tick:
today's night run (33306737061, queued 10:32:43Z) sits bracketed by
march run 33306027579 (started 10:15:20Z, still in-progress) and the
next march trigger 33307197099 (queued 10:44:15Z) — and that second
march run was itself cancelled too, not night. Reading the fuller
day's `march.yml` run history shows this isn't only a night-specific
problem: march-vs-march queue collisions are common in the same
window (33304767824 also cancelled at 09:44:02Z), because march's own
polling cadence is tight enough (successive triggers ~25-30 minutes
apart against runs that themselves take 30-60+ minutes) that the
shared concurrency group's "most-recently-queued-wins" rule evicts
queued runs of *either* workflow, not just night's. This slightly
broadens the candidate's value case beyond "protect night's daily
slot" — a queued-but-never-started run burns no runner minutes
itself, but each eviction silently delays that tick's dispatch by
~25-60 minutes with no log or signal, the same silent-gap failure
mode the original finding named for night, just lower-stakes when
it happens between two march ticks instead of skipping a whole day
of digest. No change to score or scope sketch; still unpromoted 34
days after filing.

**Update (digest 2026-09-01):** worst run since the original 07-21
week-long gap — **three consecutive nights lost**: `gh run list
--workflow night` shows 08-29 (33248067249), 08-30 (33306737061,
already counted in the 08-30 update above), and 08-31 (33383044473)
all `conclusion: cancelled`, zero jobs started on any of the three.
`plan/DIGEST.md` sat frozen on its 2026-08-28 snapshot for the
entire 3-night span until tonight's tick (this commit) got through.
Same unfixed mechanism each time — no new evidence, just the longest
unbroken loss streak since filing 42 days ago. Still unpromoted.

**Update (expand pass 68, 2026-09-04, cloud march):** the most
encouraging window since filing — `gh run list --workflow night.yml`
shows **4 consecutive clean runs** (09-01 through 09-04, all
`conclusion: success`), the longest unbroken clean streak on record,
immediately following the worst-yet 3-night loss streak (08-29
through 08-31) the 09-01 digest update reported. The underlying
mechanism is entirely unchanged — no code or workflow-file edit has
shipped — so this reads as favorable scheduling luck (fewer
march-trigger collisions landing in night's ~10:3x UTC queue window
this week), not a fix; the same eviction race documented since
07-27 will resume whenever timing lines up again, exactly as the
08-06/08-10/08-27 "one clean night" false dawns already logged here
did. Softening urgency slightly relative to #34 (which shows no such
respite) but not the score or scope sketch — still the standing
`/oversight` recommendation, now 39 days unpromoted since filing
(07-27).

**Update (digest 2026-09-05):** first clean-queue (not clean-window)
data point — tonight's `night` trigger landed at 13:29:26Z mid-`march`
run (33966499034, cleared 13:37:53Z), queued instead of getting
evicted, and started at 13:37:54Z. Confirms the group's queueing
behaves as documented at least some of the time; doesn't retire the
finding since eviction still depends on whether a *second* march
trigger lands before the first clears. 40 days unpromoted since
filing (07-27) — unchanged recommendation.

**Update (expand pass 69, 2026-09-06, cloud march):** the clean streak
pass-68 flagged now extends to **6 consecutive successful runs**
(09-01 through 09-06, `gh run list --workflow night.yml` confirms all
`conclusion: success`) — the longest unbroken run on record, more than
double pass-68's 4-run count. Still reads as favorable scheduling luck
rather than a fix: no code or workflow-file edit has shipped, the
shared-concurrency-group mechanism is byte-for-byte the one diagnosed
07-27, and the 08-29→08-31 three-night loss streak proves the race is
still fully live whenever collision timing turns unfavorable again.
Softening urgency further relative to #34/#25/#28 (all of which show
continued live recurrence this same window) given the sustained
respite, but holding score and scope — a race condition that hasn't
fired in 6 days is not a race condition that's been fixed. 41 days
unpromoted since filing (07-27).

**Update (digest 2026-09-17):** the clean streak kept extending and
never broke — `gh run list --workflow night` shows **11 consecutive
successful runs** (09-06 through 09-16, tonight's 09-17 run in
flight at digest time), nearly double pass-69's 6-run count and the
longest unbroken streak on record by a wide margin. Still reads as
favorable scheduling luck, not a fix — no `night.yml` or `march.yml`
edit has shipped since the 07-27 diagnosis, and the underlying
most-recently-queued-wins eviction mechanism is unchanged. Given 11
days with zero occurrences, further softening urgency relative to
#34 (which just posted its 58th unpromoted day with an unbroken
8-night breach streak, the opposite trend) — recommend #34 lead the
next `/oversight` session, with #35 following once a genuine
eviction recurs to re-confirm the race is still live. 52 days
unpromoted since filing (07-27).

**Update (digest 2026-09-18):** streak extends to 12 — 09-17's
run (createdAt 15:08:24Z) posted `success`, and tonight's 09-18 run
(this tick) is in flight with no contention signature observed. The
two candidates' trends have now diverged further: #34 just posted
its *first* green night in nine (see its 09-18 update), still a
fragile ~2.5-minute margin under the wall, while #35's mechanism has
gone unobserved for 12 straight nights. No `night.yml` edit has
shipped; the underlying eviction race is unchanged. Recommendation
holds: #34 leads the next `/oversight` session. 53 days unpromoted
since filing (07-27).

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
`plan/README.md`).
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

### 09. Editorial-copy honesty sweep + derived-count invariant — PROMOTED as Phase 43 (oversight 2026-05-23)
**Promoted in:** oversight 2026-05-23 (build plan re-exhausted; second-strongest pending candidate; promoted alongside #10 so the coverage gate lands before this sweep adds copy/test surface).
**Build-plan row:** Phase 43 — Editorial-copy honesty sweep + derived-count invariant (`plan/README.md`).

### 10. Colocated-test coverage gate (shift §5a left into verify) — PROMOTED as Phase 42 (oversight 2026-05-23)
**Promoted in:** oversight 2026-05-23 (build plan re-exhausted; strongest pending candidate; closes the §5a reactive-drain pattern — 25 test commits in 3 days, each one-violator-per-tick).
**Build-plan row:** Phase 42 — Colocated-test coverage gate (`plan/README.md`).

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
     and **Build-plan row:** <link to row in plan/README.md> -->

### [promoted 2026-11-02 → spec 48] [score 8.7] Stat-tile value/caption literal-duplicate invariant
- promoted: 2026-11-02, auto (expand pass depth-promotion), veto #832

**Build-plan row:** Spec 48 — Stat-tile value/caption literal-duplicate guard (`plan/README.md`)

### 12. Brand-spelling discipline (lax→strict invariant for `tiered.tv` wordmark)
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 44 - Brand-spelling discipline (lax-to-strict BRAND_SPELLING_STRICT invariant) (`plan/README.md`)

### 13. Editorial-cliché repetition guard (cross-corpus phrase-frequency invariant)
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 45 - Editorial-cliche repetition guard (CLICHE_REPETITION_STRICT invariant) (`plan/README.md`)

### 11. Extend the colocated-test coverage gate to `src/app/**`
**Promoted in:** oversight 2026-06-11 (build plan re-exhausted; all three pending candidates promoted at once, user-approved).
**Build-plan row:** Phase 46 - Colocated-test coverage gate extended to src/app/** (`plan/README.md`)

### 08. Cross-canon themed-list drain (deliver the "cross-canon" promise)
**Promoted in:** oversight 2026-05-21 (build plan re-exhausted
**Build-plan row:** Phase 41 — Cross-canon themed-list drain

### 07. Cloud-runnable `/critique` via a Playwright reader path
**Promoted in:** oversight 2026-05-19 — user ruled it **ahead of Phase 39** (priority inversion; row placed above Phase 39 in the Status block).
**Build-plan row:** Phase 40 — Cloud-runnable `/critique` via a Playwright reader path (`plan/README.md`, ships before Phase 39).

### 06. `content/calendar.yml` + finale-event detection hook (mechanical + autonomous editorial half of spec.md:294)
**Promoted in:** oversight 2026-05-19 (build plan re-exhausted; only candidate above threshold; editorial `[needs-user-call]` resolved to full autonomy by user at promotion).
**Build-plan row:** Phase 39 — `content/calendar.yml` + finale-event detection hook (`plan/README.md`)

### 04. `/u/[handle]` real public profile (drain the phase-10 shell)
**Promoted in:** oversight 2026-05-17 (build plan exhausted; strongest pending candidate, user-approved).
**Build-plan row:** Phase 38 — `/u/[handle]` real public profile (`plan/README.md`)

### 01. RSS feeds (`/feed.xml` + `/feed/<show>.xml`)
**Promoted in:** oversight 2026-05-14 (queued behind phase 26 per user direction)
**Build-plan row:** Phase 32 — RSS feeds (`plan/README.md`)

### 02. Inline search takeover (replace `/search` route page)
**Promoted in:** oversight 2026-05-14 (retroactive — phase 29 already shipped the scope)
**Build-plan row:** Phase 29 — Inline search overlay; retire `/search` (`plan/README.md` line 101)

### S7. Inline / takeover search (seed) — superseded by candidate #02
**Promoted in:** oversight 2026-05-14 (retroactive)
**Build-plan row:** Phase 29 — Inline search overlay; retire `/search` (`plan/README.md` line 101)

### [promoted 2026-10-30 → spec 47] [score 6.0] Show canon completeness lax→strict gate
- proposed: 2026-06-15, v1 candidate #15 (moved into Pending by the v2 upgrade follow-up, 2026-10-27)
- promoted: 2026-10-30, auto (expand pass 77), veto #829
- shipped: 2026-11-01, built on the owner's request ahead of the cloud loop. Pass 77 opened #829 and
  re-scored the row 9.4 → 6.0 (only S's fallback equals its headline; A/B/C diverged since filing;
  the era-band half shipped in phase 34), but its plan commit never reached main: no
  `plan/47-*.md`, roadmap row, Held line or Promoted entry existed at build time, so this row was
  still under `## Pending`. Shipped scope: `collectCanonTierBlurbIssues` in `scripts/content-check.ts`
  (CANON_TIER_BLURB_STRICT = true; a rendered band whose fallback equals its headline, derived from
  `TIER_HEADLINES` now exported by `src/lib/canon/tier-bands.ts`, plus a rendered A band with no
  `tier_a_blurb`) and `tier_a_blurb` backfills on americas-got-talent, americas-next-top-model,
  dancing-with-the-stars, hells-kitchen, love-is-blind, the-apprentice. Open follow-up: three
  31+-entry canons render a C band with no `tier_c_blurb` (chopped, dancing-with-the-stars,
  the-real-world); not a duplicate, left ungated.

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

## Rejected

<!-- Same format with **Rejected at:** <oversight commit hash>
     and **Reason:** <why> -->

### 18. Signed-in header handle affordance — profile link + sign-out popover
**Reason:** Reality-checked during the 2026-11-02 march Step 0 depth
promotion before writing it as a spec (`node scripts/plan/promote.mjs
due` picked it at score 6.6). Already shipped: `HeaderView.tsx` renders
the signed-in handle as a `site-header-user-trigger` button
(`aria-haspopup`, `aria-expanded`, `aria-controls`, `data-profile-href`)
that discloses a `role="menu"` panel with "Your record" (`/u/<handle>`)
and "Sign out" (`/auth/logout`) on both desktop and mobile — commits
`5435b96` (mobile chevron menu) and `f2f53dd` (extended to desktop,
closing #384). This candidate was itself a duplicate of the same
critique-pass-48 finding `fcead6e3` already closed `[x]` in
`plan/CRITIQUE.md` as "verified no-defect" on 2026-07-04, re-surfaced
into Pending by the v1→v2 kit migration (2026-10-27) without a
reality-check against the migration's own carry-over. Colocated
(`HeaderView.test.tsx`) and e2e (`authed-example.spec.ts`,
`user-profile.spec.ts`, `comment-read.spec.ts`) coverage already pins
the contract. Nothing to ship; rejecting rather than promoting a spec
for work that is already live.
**Rejected at:** march 2026-11-02 (Step 0 depth promotion).

### 20. Inline partial-canon coverage disclosure — ranking-list coverage note
**Reason:** Reality-checked during the same 2026-11-02 march Step 0 pass
(`promote.mjs due` picked it next, score 6.6, after #18 above was
rejected). Already shipped: `CanonEraToolbar.tsx` renders a
`.cp-coverage-note` (`data-testid="canon-coverage-note"`) — "N more
season(s) aired — ranking in progress." — whenever `airedSeasons` (from
`show.seasons`) exceeds the ranked `total`, generalizing across every
partially-drained show, not just the cited examples. Shipped
2026-07-10 in commit `44a1a9c7` ("surface a coverage note when a
show's aired seasons outpace its ranked canon"), filed via critique
pass-79 and picked by `/iterate` directly (#526) — this candidate
(filed 2026-06-21, pre-dating that fix) was never reconciled against
it and the v1→v2 kit migration (2026-10-27) carried it into Pending
unchanged. Colocated test coverage already pins the conditional
render. Nothing to ship; rejecting rather than promoting a spec for
work that is already live.
**Rejected at:** march 2026-11-02 (Step 0 depth promotion).

### 05. Critique-harness repair (anon clean-profile + authed cookie-injection)
**Reason:** Reviewed live during the 2026-05-17 oversight pass at user request. Neither blocker reproduces: a fresh Chrome MCP tab group is genuinely logged-out (anon pass clean), and on that clean profile `document.cookie`-injecting `CRITIQUE_SESSION_COOKIE` as `__session` is accepted by the server (`/api/auth/me` → `signedIn:true`; chrome shows `@e2e / Sign out`). No code or environment change was needed — the 2026-05-16 `httpOnly` reasoning was wrong for a clean profile. Working harness contract recorded in `plan/bearings.md` → "Critique cadence" and the two `CRITIQUE.md` rows moved to Done. Nothing to ship; closing rather than promoting.
**Rejected at:** oversight 2026-05-17.

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

# 50 — Canon-rationale / season-body verbatim-argument echo gate

> A content-check gate catches a canon.md rationale and its
> season's body text restating the same argument near-verbatim,
> before ship — instead of waiting for a critique pass to find it
> reactively, one show at a time, weeks after the content is live.

## Why

`plan/CANDIDATES.md`'s highest-scored unpromoted row (8.3, filed
2026-07-06) documents this defect class across **21+ independent
instances spanning 19+ distinct shows** over four months of
critique passes (44, 46-49, 56-57, 64-65, 69-70), including the
site's flagship page (Survivor 50, hit twice), a 26-season show
whose entire canon predated the de-duplication convention (Big
Brother), and shows caught within days of being freshly authored
(Perfect Match, Shark Tank S11) — proof the gate pays for itself
immediately rather than waiting for a critique pass to notice.
Every one of the 21+ instances was caught reactively (a filed
issue or a critique Pending row) and fixed as a one-off content
edit, days to weeks after shipping; **zero have ever been caught
pre-ship**. Worse, three pages (Top Chef Carolinas, Survivor 50,
Traitors' `ardross-2026`) were hit a *second* time in a *different*
field pair after already receiving a prior one-off fix — direct
evidence that field-by-field reactive edits relocate the next
occurrence to an unpatched pair on the same page rather than
closing the class, exactly as this repo's `content:check` gates
exist to prevent (compare: candidate #28's caption-restatement
family, which became spec 48, closed the same reactive loop for
stat-tile value/caption pairs with a structural gate rather than
a fourth consecutive reinforcement-only expand pass).

The technique already exists in this codebase.
`collectThemedEntryVerbatimPhraseEchoIssues()`
(`scripts/content-check.ts:1269`) tokenizes two text fields,
builds 5-gram sets, and flags shared phrases above that length —
today applied to a themed-list entry's title↔blurb pair. The
same technique, applied to a canon.md entry's `rationale` against
its matching season file's `body` ("Shape of the Season" vs.
"Where It Sits in the Canon" on the rendered page), would have
caught the documented instances before they shipped.

## Design

**Detector.** New `collectCanonRationaleSeasonBodyEchoIssues()`
in `scripts/content-check.ts`, mirroring
`collectThemedEntryVerbatimPhraseEchoIssues()` exactly: for each
show, for each `canon.md` entry, resolve the matching season
(`getSeason(show.slug, entry.season)`). Skip the pair when either
side is missing — no `rationale`, no `season.body`, or no
canon-ranked season at all (nothing to compare, same shape as the
existing caption checks skipping absent fields). Otherwise
tokenize both texts (`tokenizeForVerbatimEcho`), build 5-gram sets
(`ngramsOf`, the same `VERBATIM_PHRASE_ECHO_NGRAM` constant — no
new threshold invented for this spec), and flag any shared 5-gram
as an echo.

**Scope — two fields only.** This gate compares exactly one pair:
a show's canon.md `rationale` against that same show's matching
season `body`. It explicitly does **not** cover the two related
shapes the candidate's own reinforcement history flagged as
separate questions:
- The `pull` field joining the echo as a third surface
  (pass-57's Drag Race S18 three-way finding) — deferred, see
  Open questions.
- Cross-show templating between different shows' single-entry
  canon openers/closers (pass-56's Real World / Ink Master / SYTYCD
  finding) — a different detection mechanic (compare each new
  single-entry canon against recent single-entry canons, not a
  sibling field within one show) and a different candidate's
  shape entirely. Not this spec.

**Ships LAX.** The corpus already carries 20+ live, undrained
instances (the candidate's own running count) — shipping this
STRICT immediately would break `pnpm content:check` on content
this spec isn't chartered to fix. Mirrors the established
lax→strict pattern already used for
`EPISODES_CAPTION_BARE_RESTATEMENT_STRICT`,
`CAST_SIZE_CAPTION_BARE_RESTATEMENT_STRICT`, and spec 48's six
`*_CAPTION_BARE_RESTATEMENT_STRICT` flags: a
`CANON_RATIONALE_SEASON_BODY_ECHO_STRICT` constant in `main()`,
starting `false`. While `false`, hits warn
(`console.warn`) instead of failing the gate. A later chunk — or
spec 48's own pattern of `/ship-content` drain ticks rotating one
show at a time — drains the corpus to zero and flips the flag,
exactly as 48.1-48.5 did for the caption pairs. This spec's own
chunks ship the detector, the wiring, and the curator-brief
update; draining the existing 20+ instances is follow-on content
work, not blocking acceptance here (same split spec 48 made
between its structural chunks and the ongoing backfill).

## Contracts

- `scripts/content-check.ts`: new exported function
  `collectCanonRationaleSeasonBodyEchoIssues()`. Wired into
  `main()` behind `CANON_RATIONALE_SEASON_BODY_ECHO_STRICT = false`
  — collected issues route to `console.warn` while false, to
  `failures` once flipped true, matching every existing
  lax→strict call site in this file.
- Colocated unit tests (new or extended existing content-check
  test file): a synthetic canon-rationale/season-body pair
  sharing a real duplicated argument (flags), a pair sharing only
  proper nouns / show-specific vocabulary (does not flag), and a
  pair with no meaningful overlap (does not flag).
- `content-curator`'s brief (wherever spec 48's caption convention
  was documented, per `plan/ARCHIVE.md`'s `48.5` entry): add a
  line instructing future canon-rationale authoring to check the
  matching season's body text first, mirroring the existing
  caption convention note.

## Decisions made upfront (do not ask)

- Ships LAX. Draining the corpus to zero and flipping
  `CANON_RATIONALE_SEASON_BODY_ECHO_STRICT` to `true` is follow-on
  work (a later chunk in this spec, or ordinary `/ship-content`
  drain ticks) — not a blocking acceptance criterion for the first
  chunk.
- Scope is the canon-rationale ↔ season-body pair only. The `pull`
  three-way extension and the cross-show opener/closer templating
  pattern are explicitly out of scope — see Open questions.
- Reuse the existing `VERBATIM_PHRASE_ECHO_NGRAM` (5-word) threshold
  rather than inventing a new one for this field pair. If the
  corpus drain shows it's too noisy (legitimate shared vocabulary —
  host names, format terms, season titles) or too lax, tune it in
  a follow-up chunk with real corpus data, not speculatively here.
- A pair with no `rationale`, no `season.body`, or no canon rank is
  skipped outright — not a finding, not a warning.

## Acceptance

- **A1** `collectCanonRationaleSeasonBodyEchoIssues()` exists in
  `scripts/content-check.ts`, exported, following the existing
  `collectThemedEntryVerbatimPhraseEchoIssues()` shape (tokenize,
  5-gram, shared-phrase flag).
- **A2** A synthetic canon-rationale/season-body pair sharing a
  real duplicated 5-word-or-longer phrase is flagged.
- **A3** A synthetic pair sharing only proper nouns or a short
  (<5-word) overlap is not flagged.
- **A4** A synthetic pair with no shared phrasing is not flagged.
- **A5** The detector is wired into `main()` behind
  `CANON_RATIONALE_SEASON_BODY_ECHO_STRICT = false` — hits warn via
  `console.warn` and `pnpm content:check` stays green on today's
  corpus despite the known 20+ live instances.
- **A6** A show/season pair missing `rationale`, missing
  `season.body`, or with no canon-ranked season produces no
  finding (colocated test).
- **A7** `content-curator`'s brief documents the convention: check
  the season body before writing (or re-writing) a canon rationale.

## Open questions

- Whether to extend the detector to a three-way comparison
  including `pull` (pass-57's Drag Race S18 finding) — deferred to
  a follow-up candidate/chunk once this two-field gate ships and
  its false-positive rate against the real corpus is known.
- The cross-show single-entry canon opener/closer templating
  pattern (pass-56's Real World / Ink Master / SYTYCD finding) is a
  distinct defect shape needing a distinct detection mechanic
  (compare against recent single-entry canons, not a sibling field)
  — `/oversight` should decide whether it becomes its own candidate
  or a later chunk here.
- When to schedule the STRICT flip and the corpus drain — likely
  `/ship-content` drain ticks rotating one show at a time, mirroring
  spec 48's 48.1-48.5 chunks, but the exact cadence is for whoever
  picks up the drain chunk, informed by how many pairs the LAX pass
  actually reports once shipped.

## Chunks

Measure: 7 open · 0 closed · next A8

- [ ] **50.1** `collectCanonRationaleSeasonBodyEchoIssues()` detector, wired into `main()` behind `CANON_RATIONALE_SEASON_BODY_ECHO_STRICT = false`, with colocated unit tests (flagged echo, proper-noun/short overlap, no overlap, missing-field skip) · S · closes A1, A2, A3, A4, A5, A6 · needs —
- [ ] **50.2** `content-curator`'s brief documents the canon-rationale/season-body echo convention · S · closes A7 · needs 50.1

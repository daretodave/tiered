# 48 — Stat-tile value/caption literal-duplicate guard

> A season's stat-tile caption fields (`filming_caption`,
> `premiere_caption`, `format_caption`, `host_caption`) never
> bare-restate their paired value field — closing the same gap
> `episodes_caption`/`cast_size_caption` already closed for their
> own pairs.

## Why

The season hero's stat strip (`design/tiered.tv · Heroes vs.
Villains.html` § STATS STRIP) renders six value/caption pairs:
`ep_count`/`episodes_caption`, `cast_size`/`cast_size_caption`,
`location`/`filming_caption`, `premiere_date`/`premiere_caption`,
`format_summary`/`format_caption`, `host`/`host_caption`. A
caption that opens by literally restating its own tile's value
spends the reader's attention on a fact they already have instead
of adding one.

Two of the six pairs are already gated in
`scripts/content-check.ts`:
`collectEpisodesCaptionBareRestatementIssues` (strict, line 2309)
and `collectCastSizeCaptionBareRestatementIssues` (lax, line
2348). The other four — `location`/`filming_caption`,
`premiere_date`/`premiere_caption`, `format_summary`/
`format_caption`, `host`/`host_caption` — have no equivalent
check (confirmed by direct grep of `scripts/content-check.ts`,
2026-11-02: no `filming_caption`, `premiere_caption`,
`format_caption` or `host_caption` restatement helper exists).
One instance of the gap this spec closes was fixed reactively for
`filming_caption`/`location` (pass-89/#551, pass-91/#563) — a
one-off content fix, not a gate, so the class can recur.

This has recurred repeatedly since: nine independent critique
passes (48, 49, 56, 57, 58, 69, plus the pass-137 instance below)
found fresh live instances of this exact defect class on
freshly-authored or freshly-promoted content, including:
- Three confirmed `cast_size`/`cast_size_caption` paraphrase
  instances (issue #508, closed pass 49) — proving the shape
  recurs beyond the one field the episodes/cast-size checks
  already cover.
- A cross-tile instance (pass-95, `/shows/the-real-world/season/
  go-big-or-go-home`) where `episodes_caption` duplicated a fact
  from the FILMED tile two rows up, not just its own tile — same
  defect family, wider blast radius than a single same-pair check.
- A pass-137 instance (`/shows/rhoa/season/the-clean-slate`) where
  `format_caption` restated the page's single headline fact in
  three places at once (the caption, the body's closing sentence,
  and `canon.md`'s rationale) — `format_caption` has no paired
  value field the way the other five pairs do; the duplication
  there runs against body/canon.md prose, closer to the existing
  themed-entry verbatim-echo check's shape than a same-tile
  value/caption pair.
- Five simultaneous fresh instances in one single critique pass
  (pass-104) across four shows, spanning both the same-pair shape
  and the cross-tile shape.

A catalog-wide scan at filing time (pass 48, 2026-07-08) found
zero current violations across the four ungated pairs, meaning a
gate could ship at floor-0 immediately with no lax/warn period —
but four months and several content ticks have passed since. A
fresh scan is needed at chunk-build time before deciding lax vs.
strict (Decisions, below).

## Design

**New helpers in `scripts/content-check.ts`**, siblings to
`isEpisodesCaptionBareRestatement` / `isCastSizeCaptionBareRestatement`
(lines 2303, 2342) and their `collect*Issues()` wrappers:

- `collectFilmingCaptionBareRestatementIssues()` —
  `location` vs. `filming_caption`.
- `collectPremiereCaptionBareRestatementIssues()` —
  `premiere_date` vs. `premiere_caption`.
- `collectFormatCaptionBareRestatementIssues()` —
  `format_summary` vs. `format_caption`.
- `collectHostCaptionBareRestatementIssues()` —
  `host` vs. `host_caption`.

Each: iterate `getAllShows()` / `getAllSeasons(show.slug)`; skip a
season missing either field of its pair; flag when the caption,
trimmed, opens on a bare restatement of the value (case-insensitive
exact or near-exact match for `location`/`host`/`format_summary`,
which are free text — not a leading-numeral regex like the
`ep_count`/`cast_size` checks, since none of the four remaining
pairs is numeric. `premiere_date` is an ISO date — exact-string
restatement only, since no caption reasonably "paraphrases" a
date the way a headcount gets paraphrased). Each pushes a `Failure`
with a message naming the file, the duplicated fact, and the
precedent (`episodes_caption`/`cast_size_caption`) the reader
should model the fix on, mirroring the two existing messages'
phrasing exactly.

**Decisions made upfront (do not ask):**
- Scope is the four ungated pairs above. `ep_count`/`cast_size`
  are out — already gated.
- `format_caption`'s pass-137 cross-field instance (vs. body /
  canon.md, not a same-tile value) is **out of this spec's scope**.
  It is a different defect shape (prose-echo, not same-tile
  restatement) closer to the existing themed-entry verbatim-echo
  invariant's territory; folding it in here would conflate two
  checks with different inputs. If it recurs, it's a separate
  candidate.
- Lax vs. strict per pair is decided at chunk-build time from a
  fresh catalog scan (mirroring the `cast_size_caption` precedent:
  ship lax when any current violation exists, strict when zero).
  Do not assume the pass-48 zero-violation scan still holds —
  re-run it.
- `location`/`filming_caption` restatement check: exact-equality
  or near-equality (trimmed, case-insensitive), not a leading-token
  regex — `location` is free text (a city/region name), unlike the
  numeral-leading `ep_count`/`cast_size` pairs.

## Contracts

None new. Reuses the existing `Failure` type and `collectFailures()`
wiring pattern (`scripts/content-check.ts`); no schema change (all
six value/caption fields already exist in `src/content/schemas.ts`
129–188).

## Acceptance

- **A2** `collectPremiereCaptionBareRestatementIssues()` flags any
  season where `premiere_caption` bare-restates `premiere_date`.
- **A3** `collectFormatCaptionBareRestatementIssues()` flags any
  season where `format_caption` bare-restates `format_summary`
  (same-tile pair only — not the pass-137 body/canon.md shape).
- **A4** `collectHostCaptionBareRestatementIssues()` flags any
  season where `host_caption` bare-restates `host`.
- **A5** All four checks wired into `collectFailures()` with an
  explicit lax/strict toggle per pair, decided from a fresh catalog
  scan at build time.
- **A6** Colocated tests in `src/content/__tests__/content-check.test.ts`
  cover each pair: a duplicate instance (flags), a legitimately
  distinct pair (doesn't flag), and a live-catalog zero-issues
  assertion for any pair shipped strict.
- **A7** `content-curator`'s brief documents the four-pair
  convention so new season authoring doesn't reintroduce the class.

## Open questions

None — the scope, the pairs, and the decision rule for lax vs.
strict are all resolved above.

## Chunks

Measure: 6 open · 1 closed · next A8

- [ ] **48.2** Premiere-caption restatement guard (`premiere_date`/`premiere_caption`, exact ISO-string match) · S · closes A2 · partial A5, A6 · needs —
- [ ] **48.3** Format-caption restatement guard (`format_summary`/`format_caption`, same-tile pair only) · S · closes A3 · partial A5, A6 · needs —
- [ ] **48.4** Host-caption restatement guard (`host`/`host_caption`); closes the lax/strict wiring and colocated-test coverage once all four pairs are in `collectFailures()` · S · closes A4, A5, A6 · needs 48.2, 48.3
- [ ] **48.5** `content-curator`'s brief documents the four-pair convention · S · closes A7 · needs 48.4

# 52 — Prose sentence-capitalization invariant

> A content-check gate catches a period immediately followed by
> a lowercase word in show-level free-text prose — before it
> ships to a season blurb, a tier tile, or a meta description —
> rather than waiting for a critique pass to catch each instance
> one show at a time.

## Why

`plan/CANDIDATES.md`'s row (score 6.4, filed 2026-07-03) documents
a recurring authoring habit: a `{yearsWord}`-style derived token,
or a hand-written clause fragment, lands at a sentence-initial
position without capitalization. Three independent critique
passes caught four instances of the identical defect shape, each
filed and fixed as a one-off content edit with no change to the
mechanical gate:

- pass-53 `/shows/below-deck-mediterranean` — `blurb`: "...Captain
  Sandy Yawn holding the helm. ten years of superyacht drama..."
- pass-53 `/shows/below-deck-sailing-yacht` — same pass, same
  shape: "...the Mediterranean underfoot. six years of Glenn
  Shephard..."
- pass-58 `/shows` — Dancing with the Stars B-tier tile
  `card_tagline`: "one mirror ball at the end. twenty-one years,
  34 seasons." — root cause is the `{yearsWord}` token expanding
  to a lowercase number-word at a sentence-initial position.
- pass-66 `/shows/masked-singer` — meta description: "...viewers
  guess along. seven years on the air."

Four shows, three distinct critique passes, all in free-text
frontmatter fields (`blurb` / `tagline` / `card_tagline`). These
fields pass through `descriptionFor()` verbatim into meta
descriptions and social-card previews, so the defect is
reader-visible off-site too, not just on-page. This is the same
`lax→strict` content-check mechanic that already shipped six-plus
times (phases 41-46, specs 48/50) — a clean, low-risk extension
of a proven pattern, not a new one.

## Design

**Detector.** New `collectSentenceCapitalizationIssues()` in
`scripts/content-check.ts`: for each show's `blurb`, `tagline`,
and `card_tagline`, scan for a period followed by whitespace and
a lowercase letter (`/\.\s+[a-z]/`), and emit an issue naming the
offending fragment. Scoped specifically to `. ` + lowercase, not
`— ` or `, ` + lowercase, so intentional em-dash/comma
continuation styles are never flagged — the false-positive guard
candidate #23's scope sketch already names.

**Lax, then strict, in the same commit.** A new
`PROSE_CAPITALIZATION_STRICT` flag follows the project's standing
pattern (specs 48/50, phases 41-46): lax mode logs a warning,
strict mode fails the gate. Because the known corpus is small (4
violators, all already identified by critique), this ships
day-one-strict in the same commit that adds the detector — drain
the 4 known violators first, then flip the flag, matching how
candidate #23 itself specs the rollout and how prior small-corpus
gates (e.g. spec 48's narrower captions) shipped strict
immediately rather than sitting lax for a release cycle.

**Fix shape for the 4 known violators.** Per the critique
findings' own suggested fixes: prefer restructuring the clause
to use an em dash or comma instead of a period where a
`{yearsWord}`-style token would otherwise open a new sentence in
lowercase, over simply capitalizing the number-word (capitalizing
"Ten years..." reads worse than "...helm — ten years..."). Either
fix clears the gate; the em-dash/comma restructure is preferred
per-instance where it reads better.

**Author-facing guardrail.** `content-curator`'s brief gains a
line: never let a derived token (`{yearsWord}`, `{years}`, etc.)
or a hand-written clause fragment expand at a sentence-initial
position — prefer an em dash or comma construction when a clause
built from a lowercase-word token needs to follow a completed
sentence.

## Contracts

- `scripts/content-check.ts`: new exported function
  `collectSentenceCapitalizationIssues()`, scanning every show's
  `blurb`, `tagline`, and `card_tagline` for `/\.\s+[a-z]/`.
  `PROSE_CAPITALIZATION_STRICT` constant (boolean), next to the
  file's other `*_STRICT` flags. Wired into `main()`: lax mode →
  `console.warn`; strict mode → `failures`.
- Colocated unit tests (new or extended existing content-check
  test file): a field with a lowercase sentence-initial word
  after a period (flags), a field using an em-dash continuation
  at the same syntactic position (does not flag — the
  false-positive guard), and a clean field with normal sentence
  capitalization throughout (does not flag).
- Drain the 4 known violators named in Design (below-deck-
  mediterranean, below-deck-sailing-yacht, dancing-with-the-stars
  `card_tagline`, masked-singer) via em-dash/comma restructure or
  capitalization, whichever reads better per-instance.
- `PROSE_CAPITALIZATION_STRICT = true` ships in the same commit
  as the detector (corpus drained first, in the same diff).
- `content-curator`'s brief (`.claude/agents/content-curator.md`
  or equivalent brief doc): add the derived-token sentence-
  initial-position guidance from Design.

## Decisions made upfront (do not ask)

- Day-one-strict, not a staged lax rollout. The corpus is 4
  known violators, all already named by critique with suggested
  fixes; drain them in the same commit that adds the detector and
  flip `PROSE_CAPITALIZATION_STRICT = true` immediately. Do not
  ship a lax-only chunk and defer the flip to a follow-up.
- Scope is `blurb` / `tagline` / `card_tagline` on show
  frontmatter only — the three fields every known instance
  occurred in, and the three fields `descriptionFor()` passes to
  meta descriptions / social cards. Season-level or canon-level
  prose fields are explicitly out of scope for this spec; a
  future candidate can extend the regex to those fields if
  critique finds instances there.
- The regex targets `. ` + lowercase specifically, never `— ` or
  `, ` + lowercase. Do not broaden it to catch other punctuation
  marks — that is a different, unproven defect class.

## Acceptance

- **A1** `collectSentenceCapitalizationIssues()` exists in
  `scripts/content-check.ts`, exported, scanning `blurb`,
  `tagline`, and `card_tagline` on every show.
- **A2** `PROSE_CAPITALIZATION_STRICT` exists as a boolean
  constant, set to `true`.
- **A3** A synthetic field containing `". ten years"` (a period
  followed by a lowercase word) is flagged.
- **A4** A synthetic field containing `" — ten years"` (an
  em-dash continuation at the same syntactic position) is not
  flagged.
- **A5** A clean field with normal capitalization throughout is
  not flagged.
- **A6** The detector is wired into `main()`: with
  `PROSE_CAPITALIZATION_STRICT = true`, a hit fails `pnpm
  content:check`.
- **A7** The 4 known violators (below-deck-mediterranean,
  below-deck-sailing-yacht, dancing-with-the-stars, masked-singer)
  are fixed in the same commit; `pnpm content:check` is green.
- **A8** `content-curator`'s brief documents the derived-token
  sentence-initial-position guidance.

## Open questions

- Whether season-level or canon-level prose fields ever need the
  same check — deferred until critique finds an instance there
  (see Decisions made upfront); a future candidate, not this
  spec.

## Chunks

Measure: 8 open · 0 closed · next A9

Not chunked yet.

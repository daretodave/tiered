# 51 — Spoiler-language heuristic gate

> A content-check gate flags outcome/twist-coded phrasing across
> every season-page prose field and canon rationale — not just a
> hand-curated proper-noun blocklist scoped to one show and one
> surface — so a spoiler leak is caught before ship, not days
> later by a reactive critique pass.

## Why

`plan/CANDIDATES.md`'s highest-scored unpromoted row (7.5, filed
2026-09-09) documents a structural gap: `agents.md` §7 makes
spoiler discipline P0 — "the seasons, ranked. no spoilers" is the
brand promise itself. The only mechanical defense in
`scripts/content-check.ts` is
`collectThemedEntrySpoilerIssues()` (line 540) — a hand-curated
proper-noun blocklist (`Edge of Extinction`, `Redemption Island`,
`fire token`) scoped to Survivor only, and to themed-list
`entries[].blurb` only. It has never been extended since it
shipped (critique pass-13).

In five weeks, `/critique` independently caught three live,
production-shipped spoiler leaks this blocklist structurally
cannot see, because none of them are a blocklisted proper noun:

- pass-152 named an individual Miss Congeniality winner on
  `dragrace-uk/season/series-7` (a person's name, not a "twist
  mechanic").
- pass-155 stated a finale prize-split outcome as settled fact
  across five separate fields on `too-hot-to-handle/season/season-6`
  (`lede`, `episodes_caption`, markdown body, a `watch_list`
  entry, and `shape_h2` — none of them a themed-list entry
  blurb).
- pass-156 used spoiler-coded "twist" language on a themed-list
  entry (`too-few-to-call-it-all-stars` #03) whose pre-announced
  status was never verified before shipping.

All three were HIGH severity, all three reached production before
a human-style critique pass caught them, and all three were fixed
as one-off content rewrites with no change to the mechanical gate
— the same shape of gap candidate #25 (verbatim-argument echo,
which became specs 48 and 50) documents for repetition, now
showing up for spoilers. Three independent instances, three
different shows, three different field shapes, in five weeks is a
pattern, not noise.

## Design

**Detector.** New `collectSpoilerLanguageHeuristicIssues()` in
`scripts/content-check.ts`: a curated list of outcome-signaling
*phrase patterns* (not proper nouns) — "names the winner", "is
crowned", "takes home the title", "wins the season", "splits the
prize", "the winner is revealed", combined with a definitive,
settled-fact frame — scanned as regexes (mirroring the existing
`THEMED_ENTRY_SPOILER_NAMES` shape, but phrase-pattern rather than
proper-noun) across every season-page prose field: `lede`, `pull`,
`episodes_caption`, `format_caption`, the markdown `body`,
`watch_list` entries, `shape_h2` — and every `canon.md` entry's
`rationale` / `slot_argument`.

**Ships as a warning, never a hard fail.** False-positive risk is
real: "the format changes for the first time" is fine, "the
winner is crowned for the first time" is not, and a regex can't
reliably tell them apart in every phrasing. Matches surface in
`pnpm content:check` output (`console.warn`, not `failures`) for
`content-curator`/reviewer attention — the same posture
`collectThemedEntrySpoilerIssues()` could have started at before
going strict. Unlike specs 48/50's lax→strict literal-duplicate
gates (which drain to zero and flip to a hard fail), this gate
stays a permanent warning: spoiler-coded phrasing can legitimately
describe a season's *format* ("contestants compete to avoid being
revealed") without leaking an actual outcome, so a human read
stays load-bearing. Phase 48/50's binary "flip when drained"
pattern is explicitly not reused here — see Decisions made
upfront.

**Fold into authoring + detection.** Add the check to
`ship-content.md`'s pre-flight checklist (§2.5) and to
`/critique`'s own spoiler-check pass, so both the authoring side
(before a show/season ships) and the detection side (an external
reader) gain the same net.

**Complements, does not replace,** the existing Survivor
proper-noun blocklist — named mechanics (a different, narrower
defense) vs. generic outcome language (this gate). Both stay.

## Contracts

- `scripts/content-check.ts`: new exported function
  `collectSpoilerLanguageHeuristicIssues()`. A curated
  `ReadonlyArray<{ name: string; re: RegExp }>` of outcome-phrase
  patterns, named `SPOILER_LANGUAGE_PATTERNS`, next to the
  existing `THEMED_ENTRY_SPOILER_NAMES` constant. Wired into
  `main()` — collected issues always route to `console.warn`
  (never `failures`); no `*_STRICT` flag, since this gate is
  permanently a warning (see Design).
- Colocated unit tests (new or extended existing content-check
  test file): a season field containing a settled-fact
  outcome phrase (flags), a season field describing the format
  mechanic without a settled outcome (does not flag — the
  false-positive guard), and a canon `rationale`/`slot_argument`
  containing an outcome phrase (flags).
- `skills/ship-content.md` §2.5: add a pre-flight line — run
  `pnpm content:check` and read any new spoiler-language warning
  before shipping a show/season.
- `skills/critique.md`: add the spoiler-language warning output
  to the reader's own pass, alongside its existing spoiler-check
  step.

## Decisions made upfront (do not ask)

- Permanent warning, never a hard fail. Spec 48's and spec 50's
  lax→strict pattern (drain the corpus, then flip a `_STRICT`
  flag to a hard fail) does not apply here — spoiler-language
  false positives are a human-judgment call (format description
  vs. outcome statement), not a mechanical duplicate to drain to
  zero. Do not add a `_STRICT` flag in a follow-up chunk without
  a fresh candidate justifying it.
- Phrase-pattern list starts small and curated (the patterns
  named in Design), mirroring how `THEMED_ENTRY_SPOILER_NAMES`
  started with exactly three names. Expanding the pattern list is
  ordinary `/iterate` work once real corpus hits show what's
  missing — not a blocking acceptance criterion here.
- Scope is every season-page prose field plus canon
  `rationale`/`slot_argument` — not themed-list entry blurbs,
  which `collectThemedEntrySpoilerIssues()` already covers by a
  different (proper-noun) mechanic. The two checks are
  complementary, not merged.

## Acceptance

- **A1** `collectSpoilerLanguageHeuristicIssues()` exists in
  `scripts/content-check.ts`, exported, scanning `lede`, `pull`,
  `episodes_caption`, `format_caption`, markdown `body`,
  `watch_list` entries, and `shape_h2` on every season, plus
  `rationale`/`slot_argument` on every canon.md entry.
- **A2** `SPOILER_LANGUAGE_PATTERNS` exists as a curated
  `ReadonlyArray<{ name: string; re: RegExp }>` with at least the
  patterns named in Design.
- **A3** A synthetic season field containing a settled-fact
  outcome phrase (e.g. "wins the season") is flagged.
- **A4** A synthetic season field describing a format mechanic
  without a settled outcome (e.g. "contestants compete to avoid
  being revealed") is not flagged.
- **A5** A synthetic canon `rationale` or `slot_argument`
  containing an outcome phrase is flagged.
- **A6** The detector is wired into `main()` routing every hit to
  `console.warn` only — `pnpm content:check` stays green
  (non-failing) regardless of hits.
- **A7** `skills/ship-content.md` §2.5 documents the pre-flight
  check.
- **A8** `skills/critique.md` documents the reader pass picking
  up spoiler-language warnings alongside its existing spoiler
  check.

## Open questions

- Whether the pattern list should eventually grow into a
  show-family-aware set (reality-competition "wins/crowned"
  phrasing vs. docuseries "reveals that" phrasing) — deferred
  until real corpus warnings show whether one list over- or
  under-fires across genres.
- Whether a sustained zero-false-positive run on the live corpus
  ever justifies a `_STRICT` escalation for a narrow subset of
  patterns — explicitly not decided here (see Decisions made
  upfront); a future candidate, not this spec.

## Chunks

Measure: 8 open · 0 closed · next A9

Not chunked yet.

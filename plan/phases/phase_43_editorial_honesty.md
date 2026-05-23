# Phase 43 — Editorial-copy honesty sweep + derived-count invariant

> A multi-tick **auto-draining** sweep, same mechanic as phases
> 26 / 31b / 34 / 41: each tick picks one editorial surface
> (or one class of related surfaces) and either derives the
> count from a content loader or pins the literal with a
> `content-check` invariant / unit test. The final tick flips
> the invariant strict.
>
> Promoted from `PHASE_CANDIDATES.md` #09 (score 5.4) via
> `/oversight` 2026-05-23, alongside phase 42's coverage gate.
> The coverage gate ships first so any new helpers/components
> this sweep lands are born colocated-tested.

## Why this is its own phase

`/critique` passes 2/3/5/6 have filed **four+ distinct findings
of one class** across separate URLs: editorial copy carrying a
hardcoded count/claim that drifts from the data the page
actually renders. `/iterate` has been hand-patching one surface
per tick (`b9944bb`, `82b7b13`, `4acd1ad`, `#128`, `#129`,
`#130`), but the class re-opens the next time hand-authored copy
with a literal count lands — no invariant forces "counts derive
from data."

The strongest live cluster (filed at pass 6, 2026-05-23) is
Survivor's "twenty-five years" copy — currently accurate (S1
premiered 2000-05-31, the franchise is in its 25th year through
2026-05-30) but **silently rots on 2026-05-31** when Survivor's
26th year begins. It appears in 4 distinct files (tagline, two
season pulls/bodies, a canon entry). The same class also
includes a "1 MIN READ" chip pinned to a multi-section canon
entry and "tenth season at the helm" hardcoded on a season
where the host is in his 20th.

The honest fix is the phase-41 move applied catalog-wide: sweep
every count/claim in editorial copy, derive it from a content
loader where one exists, pin the literal where it doesn't, and
add a content-check / unit invariant so a future drift fails the
verify gate.

## What ships

### 1. The token-substitution helper (lands first tick)

New pure module `src/lib/show-tenure.ts`:

- `yearsSinceEst(estYear, asOfDate?)` — integer count of full
  years between the show's `est_year` and the reference date.
  Anchors to year-only math (`asOfDate.getFullYear() - estYear`
  with a `-1` adjustment when the reference date is before the
  show's anniversary day-of-year — `est_year` is a frontmatter
  int, so the anniversary defaults to the year's median date
  unless a show overrides). The first tick's spec: simple year
  diff (Survivor anchors to 2000; today reads 26 from
  `2026 - 2000`, but the editor's voice says "twenty-five years
  in" before May 31). To match the editor's voice, the helper
  treats the show as still being in its `N`-th year until the
  anniversary passes — the first tick locks the anniversary to
  the show's frontmatter `est_year`'s May 31 baseline (matches
  Survivor); subsequent ticks generalize via an optional
  `est_anniversary_md` field if any show needs it.
- `numberToWords(n)` — converts non-negative integers (1-99
  initially, expanded as needed) to their spelled-out form
  ("twenty-five", "twenty-six", "fifty", etc.).
- `renderShowTaglineTokens(template, ctx)` — substitutes
  `{yearsWord}` and `{years}` in a tagline template against
  `ctx = { estYear, asOfDate? }`.

Colocated `__tests__/show-tenure.test.ts` covers the year math
across leap years, the May-31-anniversary edge, and the
word-conversion range used by current shows.

### 2. The loader wiring (lands first tick)

`src/content/loaders.ts`'s `loadShows` runs the rendered tagline
through `renderShowTaglineTokens` **after Zod validation**, so
the schema sees the raw template (with tokens) and every
consumer of `getShow(slug).tagline` — show home, search index,
JSON-LD, OG image, home hero, show tile — receives the rendered
string with no per-call substitution. Token-free taglines pass
through unchanged.

This is the catalog-wide pattern: when a count must change
silently over time, the data is the source — the markdown
template renders.

### 3. The content edit (lands first tick + each future tick)

Each tick takes one surface (or one related class) and either:

- **Derives** — if the surface goes through a loader/render
  path, swap the literal for a `{token}` and let the loader
  substitute (or call the helper directly if it is a component-
  rendered field).
- **Pins** — if the surface is markdown body (no template
  syntax), add a `content-check` invariant that scans for the
  rotting phrase and asserts it matches the derived value
  today; bump the editor when the verify gate goes red.
- **Drops** — if the count is not load-bearing for the
  editorial voice, rewrite the copy to remove the literal
  entirely (e.g. "a quarter-century" instead of "twenty-five
  years").

### 4. The agent guidance (lands first tick)

- `.claude/agents/content-curator.md` — new tagline copy that
  references a show's tenure uses the `{yearsWord}` /
  `{years}` token, not a literal count. Pulls and bodies that
  must use a literal count get a `content-check` invariant
  noted in the same commit.
- `skills/ship-content.md` Rule 1 (show backfill) and Rule 2
  (season drain) — same. The brief gains a Phase-43 callout:
  "every spelled-out year count in show content is either a
  `{token}` or pinned in `content-check`."

### 5. The `content-check` invariant (laxlands first tick → strict at final tick)

New invariant in `scripts/content-check.ts` (lax mode for the
drain, **final tick flips strict**, same pattern as phases 31b,
34, 41):

- For each show with `est_year`, scan the show frontmatter +
  every season file + canon file for spelled-out years patterns
  (`/\b(twenty|thirty|forty|fifty|sixty)-\w+ years\b/`).
- For each match, require either (a) the value matches
  `numberToWords(yearsSinceEst(estYear))` today, or (b) the
  surrounding context allowlists the phrase (e.g. "twenty-fifth
  anniversary" anchored to a milestone season, "twenty-five
  seasons under one voice" anchored to a season count not a
  year count).
- The allowlist starts narrow (just the known editorial
  exceptions); future content ticks extend it as needed.

## Per-tick mechanic (mirrors phase 26 / 31b / 34 / 41)

- One surface or one related class per tick.
- The first tick lays the helper + loader wiring + the agent
  guidance + the `content-check` invariant in **lax mode**.
- Subsequent ticks drain one surface per tick — typically a
  tagline token swap, a markdown body rephrase, or a copy
  derivation in a render component.
- Every tick contributes unit tests for any helper touched and
  keeps the e2e specs green. URL set does not change.
- The **final tick flips the `content-check` invariant strict**
  and asserts every editorial count in the catalog is either
  derived or allowlisted.

## Priority order (the drain)

Highest-impact first:

1. **Survivor "twenty-five years" tagline** — rots 2026-05-31,
   8 days from promotion. Tick 1.
2. **Survivor "twenty-five years" season pulls / bodies / canon
   entry** — same rot, broader-surface (4 files). Tick 2.
3. **`content/shows/bachelor/seasons/26-clayton-echard.md`
   "After twenty-five years"** — already factually loose
   (Bachelor is 20 years old when Clayton aired; "twenty-five
   seasons" is the accurate Harrison-era hosting count). Tick 3
   is a content-curator pass to disambiguate years vs seasons.
4. **`/shows/<show>/season/<slug>` "1 MIN READ" chip** —
   hardcoded on multi-section canon entries; derive from
   rendered markdown word count or drop the chip. Tick 4.
5. **`/shows/survivor/season/heroes-villains` host caption
   "tenth season at the helm"** — derive the ordinal from
   season number, or drop the per-season caption. Tick 5.
6. **The remaining catalog sweep** — once the high-traffic
   surfaces are clean, content-curator walks every show + every
   season + every canon entry for spelled-out year counts and
   either replaces with tokens or allowlists. Tick 6+.
7. **Final tick** — flip `content-check` strict; add the e2e
   smoke assertion that `/shows/survivor` renders the correct
   word for today's `yearsSinceEst(2000)`.

## Exit criteria

- Every spelled-out year count in show frontmatter / season /
  canon content is either substituted via a token, derived in
  the render component, allowlisted with an explicit anchor, or
  rewritten to remove the literal.
- `scripts/content-check.ts` enforces the year-tenure invariant
  **strict**.
- The `/critique` pass-6 "twenty-five years" finding is
  resolved across all 4 reported files (and the Bachelor
  parallel either disambiguated or pinned).
- `bearings.md` Rule 1 (show backfill) and Rule 2 (season
  drain) document the year-token + content-check requirement.
- `content-curator.md` and `ship-content.md` document the
  Phase-43 derive-or-pin pattern.
- `pnpm verify` green; deploy green every tick.

## Out of scope

- No URL change. No page rebuild beyond the rendering wiring.
- No editorial-voice rewrite — the goal is honest counts in the
  existing voice, not a tone shift.
- The `/themes` "By era" filter chip exposing an empty taxon
  (pass-6 LOW) is a sibling-class finding (data-derived chip
  visibility, not a count drift); it ships under `/iterate` or
  a focused `/ship-a-phase` candidate.
- The `/u/<handle>` empty-state voice rewrite (pass-6 MED) is
  out of scope — that is voice work, not honesty work.

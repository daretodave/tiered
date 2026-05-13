# Phase 22 — Show backfill round 3 (Love Island US, Love Island UK, Bake Off, Project Runway, The Challenge)

> **Outcome.** Five more shows enter the corpus — Love Island US,
> Love Island UK, The Great British Bake Off, Project Runway, and
> The Challenge — taking Pantheon from 8 shows live (Survivor,
> Top Chef, Drag Race, Amazing Race, Big Brother, Bachelor,
> Bachelorette, Traitors) to 13. The matching launch-quota
> content-gap rows in `plan/AUDIT.md` flip to `[x]`, the build
> plan's Phase 22 row closes, and `pnpm content:quota` reports
> `ok — 13/13 launch shows covered`. After this phase the loop
> transitions away from Rule 1 quota work and into Rule 2 / Rule
> 3 drains (themed lists, canon iteration, season coverage).
>
> **Why this phase exists.** Phase 20 stood up the
> `pnpm content:quota` script and seeded eight launch-quota
> content-gap rows in `plan/AUDIT.md`. Phase 21 drained three
> (Bachelor, Bachelorette, Traitors). Phase 22 drains the
> remaining five and completes the launch quota. Splitting the
> remaining nine across two phases (21 = 3, 22 = 5) kept each
> commit small enough to read in one screen while letting the
> loop step through the backlog at a steady cadence.
>
> **No facade work.** Per `design/CLAUDE.md` Hard Rule 1, the
> visual identity is color + typography + the shared brand mark.
> The five new shows ship with palette + blurb + tagline only.

## 1. Five shows — frontmatter only

Mirror the pattern from phase 21
(`content/shows/bachelor.md`, `content/shows/bachelorette.md`,
`content/shows/traitors.md`): a single `.md` file per show with
the seven-field frontmatter contract from phase 19a, no canon or
season backfill yet. Canon + seasons drain later through Rule 2
content-gap rows.

Paths:
- `content/shows/love-island-us.md`
- `content/shows/love-island-uk.md`
- `content/shows/bake-off.md`
- `content/shows/project-runway.md`
- `content/shows/the-challenge.md`

Required fields (`src/content/schemas.ts.showFrontmatterSchema`):
`slug`, `name`, `palette: { paper, ink, primary }`, `seasons`,
`status`, `blurb` (≤120 chars), `tagline` (≤280 chars).

Voice: knowledgeable peer. Plain-spoken. No exclamation points.
Spoiler discipline P0 — taglines describe what the show **is**,
never who wins or which couple lasts.

The `palette` is the editorial palette for the show's tinted
chrome. Pick a paper / ink / primary trio that (a) reads as
distinct from any sibling show (existing palettes: Survivor
teal+orange, Top Chef forest+rust, Drag Race violet+pink,
Amazing Race deep-blue+gold, Big Brother deep-purple+cyan,
Bachelor wine+rose, Bachelorette champagne+coral, Traitors
slate+blood-red), (b) hits WCAG AA contrast against the ink
scale, (c) matches the show's visual reality without descending
into pastiche.

Curator's call on the specific hexes; rough thematic anchors:
- **Love Island US:** Las Vegas / Fiji daytime — bright sun-paper
  with a tropical primary. Must read clearly distinct from
  Bachelorette's champagne (different franchise universe).
- **Love Island UK:** Mallorca villa golden-hour — warmer than
  the US edition, more sunset than sunrise. The sibling format
  separation matters; pick a different hue family.
- **Bake Off:** the tent on a sunny English afternoon — cream
  paper, soft pastel primary in the family of pistachio, raspberry,
  or buttercream. Avoid pure white (paper should still tint).
- **Project Runway:** runway-show graphic — high-fashion black or
  graphite paper, a single saturated accent (cyber-pink or
  electric blue). The most graphically-confident palette of the
  five.
- **The Challenge:** combat-arena saturated — military green or
  oxide paper, an alarm-orange or hazard-yellow primary. Read as
  athletic + dangerous, not Survivor-tropical.

## 2. AUDIT — tick the five drained rows

Phase 20 filed eight launch-quota content-gap rows; phase 21
drained three. After this phase ships, the remaining five flip
to `[x]`:

```
- [x] [MED] launch-quota gap — content/shows/love-island-us.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/love-island-uk.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/bake-off.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/project-runway.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/the-challenge.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
```

Move the ticked rows into the `## Done` section of `plan/AUDIT.md`
per the standard AUDIT format. After this phase, the Pending
section's `content-gaps` category is empty until Rule 2 (canon)
or Rule 3 (themed lists) rows get filed.

## 3. Tests

No new tests required. The existing
`scripts/__tests__/content-quota.test.mjs` exercises the
quota check against a fixture; the existing
`src/content/__tests__/loaders.test.ts` exercises show
frontmatter parsing.

The new show URLs `/shows/love-island-us`, `/shows/love-island-uk`,
`/shows/bake-off`, `/shows/project-runway`, `/shows/the-challenge`
get covered by the smoke walker for free because
`apps/e2e/src/fixtures/canonical-urls.ts` is derived from the
content loaders.

## 4. Verify + commit + push

```
pnpm verify
git add content/shows/love-island-us.md \
        content/shows/love-island-uk.md \
        content/shows/bake-off.md \
        content/shows/project-runway.md \
        content/shows/the-challenge.md
git add plan/AUDIT.md
git commit -m "feat: phase 22 — show backfill round 3 (Love Island US/UK, Bake Off, Project Runway, The Challenge)"
git push origin main
pnpm deploy:check
```

Tick `[x]` for Phase 22 in `plan/steps/01_build_plan.md` in a
separate follow-up commit per `skills/ship-a-phase.md` Step 11.

## 5. Decisions

- **Five shows in one phase commit** matches the build plan's
  per-phase show breakdown. Splitting across more ticks would
  add commit overhead without editorial benefit — the five
  frontmatter files are independent units that don't need
  iteration on each other.
- **Frontmatter-only** matches the depth of every phase 5/20/21
  show. Canon + season backfill is a Rule 2 / Rule 3 drain, not
  a Rule 1 unit.
- **`pnpm content:quota` stays out of `pnpm verify`** for the
  same reason as phases 20 and 21 — launch quota is a
  content-velocity signal, not a code-correctness gate. After
  this phase ships, the quota check will newly report `ok`, but
  that's the velocity loop's reward, not a verification gate.
- **Palette anchors are guidance, not decree** — the
  `content-curator` agent makes the final call on each hex
  trio against the WCAG / sibling-distinctness constraints.

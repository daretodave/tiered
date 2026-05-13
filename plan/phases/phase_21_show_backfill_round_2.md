# Phase 21 — Show backfill round 2 (Bachelor, Bachelorette, Traitors)

> **Outcome.** Three more shows enter the corpus — The Bachelor,
> The Bachelorette, The Traitors (US) — taking Pantheon from 5
> shows live (Survivor, Top Chef, Drag Race, Amazing Race, Big
> Brother) to 8. The matching launch-quota content-gap rows in
> `plan/AUDIT.md` flip to `[x]`. After this phase, four shows
> remain on the launch list (Love Island US, Love Island UK,
> Bake Off, Project Runway, The Challenge — the brief calls
> these the "phase 22 cluster") and `pnpm content:quota` reports
> 5 missing.
>
> **Why this phase exists.** Phase 20 stood up the
> `pnpm content:quota` script and seeded eight launch-quota
> content-gap rows in `plan/AUDIT.md`. Phase 21 drains the first
> three. Phase 22 drains the rest. Splitting the remaining nine
> across two phases keeps the per-phase commit small enough to
> read in one screen while letting the loop ship through the
> backlog at a steady cadence.
>
> **No facade work.** Per `design/CLAUDE.md` Hard Rule 1, the
> visual identity is color + typography + the shared brand mark.
> The three new shows ship with palette + blurb + tagline only.

## 1. Three shows — frontmatter only

Mirror the pattern from phase 20 (`content/shows/amazing-race.md`,
`content/shows/big-brother.md`): a single `.md` file per show
with the seven-field frontmatter contract from phase 19a, no
canon or season backfill yet. Canon + seasons drain later
through Rule 2 content-gap rows.

Paths:
- `content/shows/bachelor.md`
- `content/shows/bachelorette.md`
- `content/shows/traitors.md`

Required fields (`src/content/schemas.ts.showFrontmatterSchema`):
`slug`, `name`, `palette: { paper, ink, primary }`, `seasons`,
`status`, `blurb` (≤120 chars), `tagline` (≤280 chars).

Voice: knowledgeable peer. Plain-spoken. No exclamation points.
Spoiler discipline P0 — taglines describe what the show **is**,
never who wins or which couples last.

The `palette` is the editorial palette for the show's tinted
chrome. Pick a paper / ink / primary trio that (a) reads as
distinct from any sibling show (existing palettes: Survivor
teal+orange, Top Chef forest+rust, Drag Race violet+pink,
Amazing Race deep-blue+gold, Big Brother deep-purple+cyan), (b)
hits WCAG AA contrast against the ink scale, (c) matches the
show's visual reality without descending into pastiche.

Curator's call on the specific hexes; rough thematic anchors:
- **Bachelor:** romance-heavy primetime — burgundy / wine paper
  with a warm rose primary feels right. Avoid pink (Drag Race
  owns it).
- **Bachelorette:** sibling format with its own identity — go
  brighter / lighter than Bachelor (the editorial separation
  matters because the two shows alternate seasons in the same
  cinematic universe). Champagne, blush, or sun-warmed coral.
- **Traitors:** Scottish-castle gothic — slate or moss paper
  with the show's signature blood-red cloak as the primary. The
  primary should read as ceremonial-red, not Survivor-orange.

## 2. AUDIT — tick the three drained rows

Phase 20 filed eight launch-quota content-gap rows. After this
phase ships, three flip to `[x]`:

```
- [x] [MED] launch-quota gap — content/shows/bachelor.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/bachelorette.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
- [x] [MED] launch-quota gap — content/shows/traitors.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — <commit>
```

Move the ticked rows into the `## Done` section of `plan/AUDIT.md`
per the standard AUDIT format.

## 3. Tests

No new tests required. The existing
`scripts/__tests__/content-quota.test.mjs` exercises the
quota check against a fixture; the existing
`src/content/__tests__/loaders.test.ts` exercises show
frontmatter parsing.

The new show URLs `/shows/bachelor`, `/shows/bachelorette`,
`/shows/traitors` get covered by the smoke walker for free
because `apps/e2e/src/fixtures/canonical-urls.ts` is derived
from the content loaders.

## 4. Verify + commit + push

```
pnpm verify
git add content/shows/bachelor.md content/shows/bachelorette.md content/shows/traitors.md
git add plan/AUDIT.md
git commit -m "feat: phase 21 — show backfill round 2 (Bachelor, Bachelorette, Traitors)"
git push origin main
pnpm deploy:check
```

Tick `[x]` for Phase 21 in `plan/steps/01_build_plan.md` in a
separate follow-up commit per `skills/ship-a-phase.md` Step 11.

## 5. Decisions

- **Three shows in one phase commit** matches phase 20's two-show
  shape and the build plan's per-phase show breakdown. The
  ship-content skill's "one unit per tick" rule applies to
  autonomous content-gap drains via `/march` Step 3b.5; phase
  commits group the units the build plan groups.
- **Frontmatter-only** matches the depth of every phase 5/20
  show. Canon + season backfill is a Rule 2 / Rule 3 drain, not
  a Rule 1 unit. Mixing them would couple two concerns.
- **`pnpm content:quota` stays out of `pnpm verify`** for the
  same reason as phase 20 — launch quota is a content-velocity
  signal, not a code-correctness gate.
- **Palette anchors are guidance, not decree** — the
  `content-curator` agent makes the final call on each hex
  trio against the WCAG / sibling-distinctness constraints.

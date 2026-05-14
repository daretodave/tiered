# Phase 26 — Season backfill across the show roster

> **Goal.** Bring every currently-tracked show up to at least
> three shipped season files so the show pages have real surfaces
> to walk and `/critique` has prose to react against. Today the
> roster has 13 shows but only Survivor, Top Chef, and Drag Race
> ship multi-season coverage. The other ten shows render the
> show-home page against an empty seasons grid.
>
> **Why now.** The /shows tier-list redesign (added with the
> data-model evolution that landed alongside this brief) reads
> tier + season-count + canon presence. Tier B is currently a
> dumping ground for "shows without canon coverage" rather than
> a curated editorial floor. The faster every show clears the
> three-season floor, the faster B drains and tiers reflect
> real editorial confidence rather than authoring backlog.

## Outcome

After this phase ships, every one of the following shows has
**at least three season files** at
`content/shows/<slug>/seasons/NN-<slug>.md`, each with a 50–80
word spoiler-safe blurb under the same schema phase 22 used:

- amazing-race
- bachelor
- bachelorette
- bake-off
- big-brother
- love-island-uk
- love-island-us
- project-runway
- the-challenge
- traitors

Seasons selected per show should be the **three most defensibly
notable** — the canon-worthy entries the show's eventual
`canon.md` will likely anchor on. Pick conservatively: format-
defining premieres, widely-recognized format pivots, and
generally accepted standouts. Skip any season whose status the
editor would have to qualify or hedge on.

For each season file:

- Frontmatter: `show`, `number`, `title`, `premiere_date`,
  `ep_count`, `location` (or studio), `host` if relevant,
  `format_changes: []` (empty unless genuinely notable),
  plus the 19c editorial fields where applicable
  (`eyebrow`, `lede`, `pull`, `vote_question`, `aired_year`,
  `episodes`, `cast_note`, `tag`).
- Body: 50–80 word blurb. Voice = knowledgeable peer. Spoiler
  discipline P0 — no winners, no eliminations, no finale
  outcomes. Format / casting / location / tonal-shift commentary
  is fair.

## Approach

The cleanest dispatch is one **/ship-content** invocation per
show. The `content-curator` sub-agent already knows the season
shape from the phase-25 canon iteration; the brief here is
purely additive volume against an existing template.

A march tick can chain three shows per pass:

```
/ship-content amazing-race seasons
/ship-content bachelor seasons
/ship-content bachelorette seasons
```

After each pass the verify gate runs `pnpm content:check`,
which counts seasons per show — the check will gain a row when
this phase lands (see "Schema + check" below).

## Schema + check

The schema already accommodates this — `seasonFrontmatterSchema`
is unchanged. The change is just `scripts/content-check.ts`
counting per-show season coverage and surfacing shows below the
floor in the post-build summary. Existing season fixtures
already test the shape; no test churn needed.

`scripts/content-quota.mjs` already enforces "every launch show
has a frontmatter file" (bearings Rule 1). Extend it with an
optional `--min-seasons N` flag that exits non-zero if any
covered show ships fewer than N season files. Plug `--min-seasons 3`
into the post-build summary print so the gap stays visible
between phases, but **not** into `pnpm verify` until this phase
ships — otherwise verify reds out the moment the brief lands.

## Tier promotion

Once a show clears the three-season floor AND ships a canon
file with at least three entries, its tier in
`content/shows/<slug>.md` frontmatter moves from B to A. The
march loop can do this inline as part of the ship-content tick
that ships the third season — just update the tier line and
include the change in the same commit.

The pioneer trio (survivor, dragrace, top-chef) stays at S / A
respectively — their tier reflects "format-defining" /
"deep canon" judgment, not just coverage volume.

## Verify gate

`pnpm verify` stays the gate. The new season files validate
under the existing schema; the season-page e2e
(`apps/e2e/tests/season-page.spec.ts`) already walks every
covered season via the canonical-URL fixture — extending
coverage to ten more shows means the fixture grows
automatically through the loader-derived URL set.

## Acceptance

- 30 new season files (3 × 10 shows) under
  `content/shows/<slug>/seasons/`.
- `pnpm content:check` reports `≥3 seasons` for all 13 shows.
- `pnpm verify` passes green (typecheck + tests + build + e2e).
- For every show that gained ≥3 seasons AND a ≥3-entry canon,
  the `tier` frontmatter field moved from B to A.
- Build plan check-mark: `[x] Phase 26` with commit hash.

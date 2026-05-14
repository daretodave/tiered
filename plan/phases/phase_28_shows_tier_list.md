# Phase 28 — /shows tier-list page to spec

> **Goal.** Rebuild `/shows` against
> `design/tiered.tv · All Shows.html` — the route stops being
> an alphabetical grid and becomes a literal tier list of shows.
>
> **Why now.** The new `tier` frontmatter field (data-model
> evolution that shipped with the rebrand follow-up) is the
> source of truth for the layout. Until this phase ships, that
> field is unused on the surface that should display it.

## Reference

- `design/tiered.tv · All Shows.html` — the binding reference.
- `design/CLAUDE.md` — visual law.

## What changes (deltas from current /shows)

Current `/shows` is a flat `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
of `<li>` cards keyed by show, each a `<Link>` to the show
home. The new design replaces it with three tier sections,
each with its own header, glyph, count, and grid layout.

1. **Hero strip.** Two-column hero with a fluid title
   "All shows. *Tiered.*" + lede + stats (3 metrics: shows
   tracked, seasons ranked, last revision). Replaces the
   current single-h1 header.
2. **Tier section.** Repeated three times (S / A / B), each
   with:
   - A 3-bar `<TierGlyph tier={T} />` indicator (one bar is
     highlighted in `--primary` to mark the tier letter).
   - Big serif italic letter (`S` / `A` / `B`) at 88px.
   - Tag + name (e.g., "Format-defining" / "The shows that
     invented or perfected their genre.").
   - Count of shows in the tier.
3. **Tile variants per tier.**
   - S tier: `.tall` tiles in a 2-column grid (96px name, more
     padding, deeper card). Two slots.
   - A tier: regular tiles in a 2-column grid (56px name).
   - B tier: `.small` tiles in a 3-column grid (44px name), with
     an "in progress · N / total" status pill at the top
     showing canon coverage progress.
4. **How-the-tiers-move footnote.** Bordered card after B tier
   explaining the editorial framing. Drops onto the page only
   when a tier has shows.

## Components to add

- `src/components/shows/ShowsHero.tsx` (new) — hero strip with
  stats. Computes `Seasons ranked = sum(show.seasons)` across
  all shows + `Last revision = latest canon-frontmatter
  revision date OR build month`.
- `src/components/shows/TierHead.tsx` (new) — tier-glyph +
  letter + name + count. Takes `tier: 'S' | 'A' | 'B'` +
  `count: number`.
- `src/components/shows/TierGlyph.tsx` (new) — the 3-bar
  indicator. Bars width 36/24/14, one highlighted by tier.
- `src/components/shows/ShowsTile.tsx` (new) — the show tile,
  variant prop `'tall' | 'regular' | 'small'`. Reads palette
  + meta from `Show`.
- `src/components/shows/ShowsStatusPill.tsx` (new) — the
  "in progress · N / T" pill on B-tier tiles. N = canon entries
  shipped (via `getCanon(show)?.entries.length ?? 0`), T = the
  count target (3, matching the season-floor in phase 26).
- `src/components/shows/HowTiersMove.tsx` (new) — the footnote
  card. Editorial copy is in the file.
- `src/app/(default)/shows/page.tsx` — restructure to group by
  tier and render the sections in S → A → B order.

## CSS port

Copy the `:root` block + the tier / grid / tile / footnote
sections from `design/tiered.tv · All Shows.html` into
`src/styles/screens.css` (or a new `src/styles/shows.css`).
Class names match between design + JSX
(`.tier-head`, `.tier-glyph`, `.tier-letter`, `.shows-grid`,
`.shows-grid.cols-2|cols-3|cols-4`, `.show-tile.tall|small`,
`.show-tile-status`, `.footnote`).

The status-pill keyframes `@keyframes pulse` go into the same
sheet; reduced-motion already strips it via the existing
project-wide `prefers-reduced-motion` shim.

## Data wiring

Group shows by `tier`:

```ts
const grouped = {
  S: shows.filter((s) => s.tier === 'S'),
  A: shows.filter((s) => s.tier === 'A'),
  B: shows.filter((s) => s.tier === 'B'),
}
```

Within each group, sort by `seasons` descending so the heaviest
shows lead.

Hero stats:

```ts
const totalSeasons = shows.reduce((sum, s) => sum + s.seasons, 0)
```

## Tests

- Update `apps/e2e/tests/show-home.spec.ts` (or rename to
  `shows-index.spec.ts` if the show-home spec is on a different
  route — confirm against existing) — assert that:
  - Hero renders with three stats.
  - Three tier sections render in S / A / B order.
  - Each tile carries the show's palette as inline style or
    CSS custom property.
  - B-tier tiles render a status pill.
- Unit tests per new component.

## Acceptance

- `/shows` at desktop + mobile matches the design within
  visual-law tolerance.
- Every show in `content/shows/*.md` appears in exactly one
  tier section.
- `pnpm verify` green.
- Build plan check-mark: `[x] Phase 28` with commit hash.

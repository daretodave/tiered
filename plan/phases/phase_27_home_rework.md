# Phase 27 — Homepage rework to spec

> **Goal.** Rebuild `/` against `design/tiered.tv · Home.html`
> end-to-end. The current home (phase 19e) covers a subset of
> the eventual vision; this phase brings it to spec.
>
> **Why now.** The new shows-list redesign assumes the home
> page is also at-spec — the topnav, footer, search hook, and
> tile vocabulary all carry across pages. Shipping the home
> first stops the visual drift between routes.

## Reference

- `design/tiered.tv · Home.html` — the binding reference. Every
  section below maps to a labeled block in that file.
- `design/CLAUDE.md` — visual law. Color + type only.

## What changes (deltas from current home)

The current home (phase 19e) already ships:

- Split hero — featured-show cover (left) + cold-search promise (right)
- 3-up `<ShowTile>` grid tinted to each show's palette
- 1-column themed-list rail of `<ListTile>` cards

The new design layers four additional sections + an upgrade
to the hero:

1. **Fluid hero title.** The cover-name fluid-sizes from 128px
   desktop → 96px @ 1180px → 64px @ 540px. The hero-title
   right side fluid-sizes 88 → 72 → 56 → 40px. Replaces the
   current fixed-size hero.
2. **Hero stat strip.** Cover footer carries two stats —
   "Seasons ranked" (computed: show.seasons) + "Canon revised"
   (latest canon revision date, computed from canon frontmatter
   or fallback to current month). Replaces the current bullet
   pill.
3. **Sub-row + 6 compact tiles.** Below the 3-up featured grid,
   a `.sub-row` ("+ N more in the index" + "Browse all →" link)
   followed by a 3-column grid of `.show-tile.compact` cards
   for the remaining shows. Compact tile = smaller padding,
   smaller name (36px), no blurb, same head/foot shape.
4. **Dual-rank callout.** Two-column section, paper-1 cells,
   "01 · Curated" / "Editor's Canon" + "02 · Live" /
   "Community Rank" with editorial blurbs explaining the
   format. New component: `<HomeDualCallout>`.
5. **Themed lists as stacked rows.** Replaces the current
   tile grid with `.lists-stack` — a bordered card with rows
   of `.list-row` (sentiment dot + title + blurb + meta + arrow).
   New component: `<HomeListRow>`.

## Components to add / change

- `src/components/home/HomeHero.tsx` — fluid sizing classes on
  cover-name + hero-title; add `<HomeHeroStats>` to the cover
  foot. Tag-line eyebrow stays; "Currently featured" replaces
  the bullet-pill prefix.
- `src/components/home/ShowTile.tsx` — gain a `variant: 'featured' | 'compact'`
  prop. Featured (default) keeps the current shape; compact
  drops the blurb + tightens the spacing.
- `src/components/home/HomeMoreShows.tsx` (new) — renders the
  sub-row + 6-card compact grid.
- `src/components/home/HomeDualCallout.tsx` (new) — the
  Editor's-Canon / Community-Rank explainer pair.
- `src/components/home/HomeListRow.tsx` (new) — single row
  inside the lists-stack. Replaces `<ListTile>` on the home
  page (ListTile stays for any other surface that uses it).
- `src/components/home/HomeListsStack.tsx` (new) — wraps the
  rows in the bordered card.
- `src/app/(default)/page.tsx` — restructure to call the new
  components in the order: HomeHero → 3-up grid → HomeMoreShows
  → HomeDualCallout → HomeListsStack.

## CSS port

Copy the `:root` token block from `design/tiered.tv · Home.html`
into `src/styles/screens.css` (or split into a new
`src/styles/home.css` if the section grows too large to keep
readable). Port the home-section selectors verbatim — class
names match between the design HTML and the JSX (`.home-hero`,
`.shows-grid`, `.sub-row`, `.dual`, `.lists-stack`,
`.list-row`). The CSS is design-doc-correct; do not
reinterpret.

Drop the old `.home-list-grid` block once `<HomeListsStack>`
takes over.

## Featured-show resolution

Already in place — `getFeaturedShow()` reads
`featured: true` from show frontmatter (added with the data-
model evolution). The hero cover, hero stats, and "Go to <X>"
pill all key off that single show object. The list of 3
featured shows for the top tile grid is the same as today
(slug-sorted top 3 from `getAllShows()`); the 6 compact shows
are the next 6 by the same sort.

## Tests

- Update `apps/e2e/tests/home.spec.ts` — the existing
  `home-hero` + `home-show-grid` testids stay; add coverage
  for `home-more-shows`, `home-dual-callout`,
  `home-lists-stack`. Verify the compact tiles do not render
  blurbs. Verify the dual-callout copy doesn't mention any
  show name (it's editorial framing).
- Update `src/components/home/__tests__/HomeHero.test.tsx` —
  assert on the new stat strip rendering.
- Add unit tests for each new component (one assert per
  visible piece + one tier of fixture wiring).

## Acceptance

- `/` rendered at desktop, tablet, mobile matches the design
  reference within visual-law tolerance (palette + type +
  spacing). No per-show illustration. No new SVG beyond the
  shared brand mark.
- `pnpm verify` green.
- Lighthouse perf budget (250 KB gzipped JS for `/`) holds.
- Build plan check-mark: `[x] Phase 27` with commit hash.

# Phase 16 — Home page hero

> **The cold-search landing surface.** `/` is the page someone
> arrives at when they type "ranked X seasons no spoilers" into
> Google. The current home is a substrate placeholder. Phase 16
> replaces it with the design's full HomeScreen layout: facade
> hero, show grid, themed-list teaser, the promise spelled out.
> SpeedInsights is already mounted (phase 1).

## Goal

By the end of this phase:

- `src/app/page.tsx` rewritten to match the layout in
  `design/compositions/screens.jsx` (HomeScreen). Three regions:
  1. **Hero** — `.home-hero` with a facade-art slot on the left
     (filled by the featured show's facade SVG) and copy slot
     on the right: eyebrow ("Currently featured · <Show>"),
     headline ("The seasons, ranked. <em>no spoilers.</em>"),
     blurb (the two-rankings promise), CTA pair ("Browse all
     shows" → `/shows`, "How it works" → `/about`).
  2. **Shows grid** — `.home-shows` section with `<ShowTile>`
     cards for every shipped show (max 5; bearings standing
     decision "Top-N count for 'trending'/'featured': 5").
  3. **Themed lists teaser** — `.home-lists` section with
     `<ListTile>` cards for the existing themed lists (max 5).
- All three sections render server-side (static).
- The page-reads fixture for `/` is updated so the smoke walker
  asserts the new structure (hero + show grid + list grid).
- A dedicated `apps/e2e/tests/home.spec.ts` (already exists, has
  2 cases) is extended to cover the new regions + mobile reflow.
- `<SpeedInsights />` stays mounted in `src/app/layout.tsx`
  (no change — already there).

## Outputs

```
src/app/page.tsx                            # rewrite

src/components/home/HomeHero.tsx
src/components/home/HomeShowGrid.tsx
src/components/home/HomeListGrid.tsx
src/components/home/ShowTile.tsx
src/components/home/ListTile.tsx
src/components/home/__tests__/HomeHero.test.tsx
src/components/home/__tests__/ShowTile.test.tsx
src/components/home/__tests__/ListTile.test.tsx

apps/e2e/tests/home.spec.ts                 # extend
apps/e2e/src/fixtures/page-reads.ts         # tighten the / assertion
```

## Decisions made upfront — DO NOT ASK

- **Featured show = survivor.** It's the only show with season
  content + the bearings-recommended pioneer. The eyebrow text
  reads `Currently featured · Survivor`. The hero art slot
  renders the survivor facade SVG via the existing
  `<ShowFacadeArt>` server component.
- **Show grid renders every shipped show**, sorted by slug
  alphabetical. Today that's 3 shows (dragrace, survivor,
  top-chef); cap at 5 per the bearings featured rule. Beyond 5,
  picking the curated set is a follow-up + needs a `featured`
  flag in show frontmatter.
- **Show tile uses `tagline ?? format`** for the blurb line.
  Shows that ship without taglines fall back gracefully.
  Tile season count comes from `getAllSeasons(slug).length`;
  zero is rendered as `season count loading` so the tile
  doesn't look broken on shows without seasons yet.
- **Themed lists teaser surfaces all themed lists**, alphabetical
  by slug (existing loader order), capped at 5. Today that's 2
  lists.
- **CTA targets locked**: "Browse all shows" → `/shows`,
  "How it works" → `/about`. Both already shipped.
- **Pediment hero treatment**: re-use the existing `.home-hero`
  CSS that's already in `src/styles/screens.css`. We add no new
  CSS this phase.
- **Headline copy**: `The seasons, ranked. <em>No spoilers.</em>`
  — verbatim from design + bearings line 19. The line break in
  the design (`The seasons,<br/>ranked. <em>no spoilers.</em>`)
  is preserved via `<br />`.
- **Blurb copy**: `Two rankings for every show. One written by
  an editor with the whole series in their head, one voted by
  the people who lived through it.` — verbatim from design.
- **`<SpeedInsights />` is already mounted** in `layout.tsx`
  (phase 1). No-op this phase; documented to close out the
  build-plan row's checkbox.
- **No analytics-event tracking on CTA clicks** this phase.
  Vercel Analytics is auto-loaded site-wide; per-click event
  emission is a follow-up.
- **No animation/motion**. Tile hover lifts are already in the
  CSS; we don't add anything new.
- **`/` is `force-static`** — the same posture as the placeholder.
  Content is build-time stable; no need for SSR.
- **`<main>` semantic wrapper stays in `layout.tsx`** (existing).
  The home page is a `<div className="screen home">` per
  design, with sections nested inside the layout main.

## Out of scope

- `featured` boolean in show frontmatter for picking < 5 from
  > 5 shipped shows.
- "Why no spoilers?" explainer surface on `/`.
- Per-CTA analytics event emission.
- Animated hero transitions.
- Cross-show themed list (depends on more season content).
- Mobile-specific hero variant (the existing
  `.screen.mobile .home-hero` CSS handles single-column).

## Mobile reflow / responsive

The existing `.home-hero`, `.home-show-grid`, and
`.home-list-grid` CSS already collapses to single-column at the
mobile breakpoint via `.screen.mobile` modifiers (the same
pattern as show home, phase 6). New e2e at 375px asserts no
horizontal scroll + H1 visible.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `HomeHero` | renders eyebrow + headline + blurb + CTAs | covered by home.spec.ts |
| `ShowTile` | tagline-fallback path; href correctness; season count display | covered by home.spec.ts |
| `ListTile` | href correctness; description rendering | covered by home.spec.ts |
| `/` page | covered by e2e | home.spec.ts: hero + show grid count + list grid count + CTA hrefs + mobile reflow |

## Verify gate

`pnpm verify` — same composition. `/` is in the canonical-urls
fixture, so smoke walker covers it on every run.

## Commit body template

```
feat: home page hero — phase 16

- New HomeHero / HomeShowGrid / HomeListGrid composition.
- Featured show: survivor (pioneer facade).
- Home page rewrite preserves force-static posture.

Decisions:
- <enumerate any further calls made during build>

Closes #<issue>
```

## DoD

- `/` renders the three regions: hero, show grid, list grid.
- CTAs link to `/shows` and `/about`.
- Show grid count <= 5 (currently 3).
- List grid count <= 5 (currently 2).
- `pnpm verify` green.
- Mobile 375px reflow: no horizontal scroll.
- Vercel deploy ready.
- Mirror issue closed.

## Follow-ups (out of scope)

- `featured` flag in show frontmatter (when shipped count > 5).
- Analytics-event emission on CTA clicks.
- A "Why no spoilers?" explainer panel inline on `/`.
- Trending pill from compute_weighted_rank() once vote volume
  warrants it.
- Featured theme rotation logic (today both themes show; we'll
  need rotation when count > 5).

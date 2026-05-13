# Phase 14 — Themed lists

> **Most substrate already exists.** `/themes` + `/themes/[theme]`
> pages are wired (phase 1 / 2 era), `ThemeFrontmatter` schema is
> defined in `src/content/schemas.ts`, the loader stack
> (`getAllThemes` / `getTheme`) is in `src/content/loaders.ts`,
> and `src/lib/routes.ts` auto-feeds the sitemap +
> canonical-urls fixture from `getAllThemes()`. The detail page
> already emits `ItemList` JSON-LD.
>
> Phase 14's actual work: **author starter themed-list content**,
> **retrofit cross-links from show pages**, and **add a dedicated
> e2e spec** for the theme family.

## Goal

By the end of this phase:

- `content/themes/<slug>.md` files exist for **two** starter
  themed lists. Each file uses the existing
  `themeFrontmatterSchema` shape. Entries must reference
  seasons that exist in `content/shows/<show>/seasons/`.
- Show pages that have seasons appearing in a theme get a
  scoped "Featured in themes" section (cross-link retrofit per
  ship-a-phase §8). Edit limited to that section; no broader
  show-page restructuring.
- `apps/e2e/tests/themes.spec.ts` covers:
  - `/themes` index renders the list of themed-list cards
    sorted by slug (alphabetical, matching the loader's
    behavior).
  - Each `/themes/[theme]` detail page renders its entries in
    rank order, links to the corresponding season pages, and
    emits `ItemList` JSON-LD whose `itemListElement` count
    matches the entries.
  - Mobile 375px: H1 within viewport, no horizontal scroll.

## Outputs

```
content/themes/survivor-pillars.md             # 4-entry themed list using survivor:1, 28, 41, 45
content/themes/<second-theme>.md               # second list (content-curator picks the angle)

src/app/shows/[show]/page.tsx                  # +featured-in-themes section (scoped retrofit)
src/components/featured-themes/FeaturedThemes.tsx
src/components/featured-themes/__tests__/FeaturedThemes.test.tsx
src/lib/themes/byShow.ts                       # helper that returns themes-containing-a-show
src/lib/themes/byShow.test.ts

apps/e2e/tests/themes.spec.ts
```

The existing pages stay mostly untouched. The only edit to
`src/app/themes/page.tsx` is a defensive: ensure the empty
state still renders gracefully if all themes are removed.

## Decisions made upfront — DO NOT ASK

- **Only two themed lists this phase.** The bearings standing
  decision "Themed list size: 10 entries default; 15 max"
  applies — but the existing content has only 4 survivor
  seasons + 0 seasons across dragrace + top-chef. The two
  starter themes will run 4 entries each, drawing from the
  available survivor seasons. A 10-entry list ships as a
  follow-up phase once more season content lands.
- **Both themed lists are survivor-only this phase.** Cross-show
  ranking is the intent of the family but blocked by absent
  season content for dragrace + top-chef. Documented; content
  for those shows lands in their own future content phases.
- **Entries reference existing seasons only.** content-curator
  validates against `content/shows/<show>/seasons/` before
  emitting frontmatter. A theme referencing a missing season
  fails `pnpm content:check`.
- **Per-entry blurb cap is 280 chars** (the existing schema
  constraint). content-curator keeps each blurb tight; the
  show + season number live in the entry metadata, the blurb
  is the "why this season earned its spot" sentence.
- **Default sort on /themes index is alphabetical by slug.**
  The loader already returns themes sorted; we don't add a
  curator-controlled featured-first sort this phase.
  Featured-themes-on-/ lands in phase 16 (home page hero).
- **Cross-link retrofit lives in a new component**
  `<FeaturedThemes show="survivor" />` rather than inlined into
  the show page, so the show page diff stays minimal. The
  component reads from a new helper `themesContainingShow()`
  that filters the global theme set.
- **No vote/comment on /themes/[theme] this phase.** Themed
  lists are editorial; user interaction (vote on theme entries
  / comment on the list) is a follow-up. The detail page
  remains a static editorial surface.
- **JSON-LD shape on /themes/[theme] is `ItemList`**
  (already emitted). The `itemListElement` items use
  `{ position, name, url, description }` — keeping it small +
  in line with the schema.org spec.
- **No new sitemap code.** `getSitemapRoutes()` already iterates
  `getAllThemes()` and emits `/themes/[theme]` URLs. New
  content files automatically join the sitemap on the next
  build.

## Out of scope

- Authoring the 10-entry "default" themed list — needs more
  seasons.
- Cross-show themed lists — needs season content for dragrace
  + top-chef.
- Featured-theme-on-/ (home page) — phase 16.
- Vote / comment on theme entries.
- Theme-level "edited by" / "edited at" metadata (the schema
  doesn't model authorship yet; deferred).

## Mobile reflow / responsive

`/themes` index uses the existing `md:grid-cols-2` layout —
already mobile-safe. `/themes/[theme]` is a single-column
narrative layout — mobile-safe by default. The new e2e spec
asserts both at 375px.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `src/lib/themes/byShow.ts` | byShow.test.ts: returns themes that contain a given show, empty array on no match | covered via /shows/[show] in smoke |
| `src/components/featured-themes/FeaturedThemes.tsx` | FeaturedThemes.test.tsx: empty (returns null) vs populated (renders cards) | covered via /shows/[show] in smoke |
| `/themes` index | covered by e2e + getAllThemes test | themes.spec.ts: card count matches getAllThemes |
| `/themes/[theme]` detail | covered by e2e | themes.spec.ts: per-entry rank order, season cross-links, ItemList JSON-LD |

## Verify gate

`pnpm verify` — same composition. `pnpm content:check` will
zod-validate the new themed-list files; emit-blocking on any
schema violation.

## Commit body template

```
feat: themed lists — phase 14

- Authored 2 themed lists (content-curator).
- Cross-link retrofit on show pages via <FeaturedThemes>.
- themes.spec.ts walks the family end-to-end.

Decisions:
- Survivor-only this phase; cross-show requires season content not yet authored.

Closes #<issue>
```

## DoD

- Two content/themes/*.md files validate via pnpm content:check.
- /themes lists both, /themes/[theme] renders each with
  ItemList JSON-LD.
- Each season referenced in a theme links FROM that season
  page (cross-link retrofit). At minimum the show page links
  to themes containing its seasons.
- themes.spec.ts green.
- pnpm verify green; deploy ready.
- Mirror issue closed.

## Follow-ups (out of scope)

- Author the canonical 10-entry themed list once additional
  seasons land across shows.
- Cross-show themed lists (needs dragrace + top-chef season
  content).
- Featured-theme-on-home (phase 16).
- Comment / vote on theme entries (separate engagement phase).
- Authorship metadata on themed lists.

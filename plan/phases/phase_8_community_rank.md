# Phase 8 — Community Rank page

> **The community-vote counterpart to phase 7's editor's canon.**
> Same show sub-surface treatment (PaletteScope + ShowHero with
> sigil + ShieldBadge), but the list is community-driven and
> renders without rationales.
>
> **Vote backend is phase 11.** Until then, the community order
> mirrors canon (when canon exists) or falls back to season
> number ascending. When phase 11 lands, the only swap is the
> order source — page composition stays put.

## Goal

`/shows/[show]/community` ships as:
- A show sub-surface wrapped in `<PaletteScope show={slug}>`.
- Headed with `<ShowHero>` carrying the show's sigil in the art
  slot, the H1 "Community Rank", a vote-driven lede, and a
  `<ShieldBadge>` for the spoiler promise.
- A ranked grid below — `<SeasonGrid>` of `<SeasonCard>`s.
  Order: `computeCommunityRank(show)` returns seasons sorted by
  the community signal. Today that signal is "canon order if
  available, else season number ascending"; phase 11 swaps it
  for the Supabase `compute_weighted_rank()` RPC.
- A small inline empty/seed banner above the grid noting the
  current source ("Mirrors the Editor's Canon until enough
  votes land") so the user knows what they're looking at.
- ItemList + BreadcrumbList JSON-LD identical in shape to
  phase 7, but anchored at `/community`.

## URL pattern

`/shows/[show]/community`

## Outputs

```
src/app/shows/[show]/community/
└── page.tsx                              # rewrite using primitives

src/lib/community/
├── rank.ts                               # computeCommunityRank(show, canon, seasons) → ordered seasons + provenance tag
└── rank.test.ts                          # canon-mirror path, no-canon fallback path, partial-canon path, empty-seasons path

apps/e2e/tests/community-page.spec.ts     # walks each seeded show, asserts hero + ranked cards or empty banner
```

## Decisions made upfront — DO NOT ASK

- **Order source today:** canon-mirror with season-number fallback.
  `computeCommunityRank()` is pure — phase 11 replaces only the
  internal data source, not the call signature. Returns
  `{ entries: { season, rank, tag }[], source: 'canon' | 'seasons' | 'votes' }`.
- **Cards are SeasonCards, not CanonEntries.** Community rank is
  a grid (parallel to the show home's season grid) — fast
  visual scanning, no rationales. The composition primitive
  shipped in phase 4a already matches the design.
- **`source` tag exposed in DOM** via `data-rank-source` on the
  grid wrapper so e2e can assert which path served the page.
- **Tag on each card:** premiere year (4-digit) when frontmatter
  has `premiere_date`, otherwise the show's format. Same rule
  phase 6 uses for the show home grid — consistency over flair.
- **Empty state:** if the show has zero seasons, render the
  same empty-state copy template as phase 6 (a `<p
  data-testid="season-grid" data-empty="true">`). When canon
  AND seasons both exist but canon is missing, the page still
  renders the season-number-fallback grid (no empty state
  reached).
- **Source banner:** rendered as a `<p class="community-source">`
  between the hero and the grid. Copy depends on `source`:
  - `'canon'` → "Mirrors the Editor's Canon until enough community votes land."
  - `'seasons'` → "Showing seasons in air order until enough community votes land."
  - `'votes'` (phase 11+) → "Updated as the votes come in. Last refreshed <relative time>."
- **JSON-LD ItemList:** same shape as phase 7. Single placeholder
  item shim for empty-seasons + no-canon shows.
- **No vote affordance on this page yet.** Voting happens on the
  per-season page (phase 9 / phase 11). The community rank page
  is a read-only summary.

## Out of scope

- Vote affordance / vote pair UI (phase 9 ships the per-season
  vote pair shell; phase 11 wires the backend).
- Real `compute_weighted_rank()` RPC calls (phase 11).
- Rank-shift pill animations (phase 11+ when shifts become
  meaningful).
- Pagination (per bearings, none until N > 50; v1 quotas keep us
  well under).

## Failure modes — when to stop

1. `computeCommunityRank()`'s canon-mirror produces holes (seasons
   in `canon.md` that don't exist in `content/shows/<slug>/seasons/`)
   → emit a `[community-rank-hole]` row in `plan/AUDIT.md` and
   render the season-number fallback for the affected show.
2. `data-rank-source` not visible to the e2e walker → check that
   it's set on a server-rendered element (no client-only
   wrapping).

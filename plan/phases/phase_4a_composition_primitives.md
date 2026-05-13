## Phase 4a — Composition primitives

> **Substrate that phases 6, 7, 8, 9, 14, and 16 consume.** The
> user shipped `design/compositions/screens.jsx` +
> `design/compositions/screens.css` as the layout source of
> truth. This phase ports them into reusable React primitives
> so every show + season + theme + home page is a thin data +
> JSON-LD shim on top — not a re-derivation of the design.
>
> **Companion to phase 4** (facade primitives = SVG; phase 4a =
> page-shell composition). Both ship before the first show family
> in phase 5.

## Goal

By the end of this phase:
- `src/styles/screens.css` mirrors `design/compositions/screens.css`
  (verbatim port; same selector names; uses the design tokens
  already in `tokens.css`).
- `src/components/composition/` holds React primitives that wrap
  the selectors:
  - `<ShowHero>` — `.show-hero` + `.show-hero-art` + `.show-hero-meta` +
    crumb + title + lede + `<ShieldBadge>` slot.
  - `<ShowSplit>` — `.show-split` two-button canon/community panel.
  - `<SeasonGrid>` — `.season-grid` wrapping `<SeasonCard>` children.
  - `<SeasonCard>` — `.season-card` with rank + title + tag + season # + optional rank-shift pill.
  - `<SeasonShell>` — `.season-shell` two-column main + aside layout.
  - `<SeasonHead>` — `.season-head` with crumb + sigil slot + title + rank row.
  - `<RankShiftPill>` — `.shift-pill` delta + sentiment color.
  - `<ShieldBadge>` — `.shield-pill` (the "no spoilers" promise pill).
  - `<TopNavTinted>` — header that picks up `--show-primary` when wrapped in `[data-show=<slug>]`.
- `<PaletteScope show={slug}>` wrapper injects per-show CSS vars
  (`--show-paper`, `--show-ink`, `--show-primary`) from `Show.palette`.
- A demo route at `/internal/composition-demo` renders all primitives
  with Survivor data (gated by `NEXT_PUBLIC_INTERNAL_DEMOS=1`; off in
  prod). The e2e harness toggles it on for snapshot coverage.
- Unit tests for each primitive (renders + a11y role/name assertions).
- Mobile reflow contract preserved at 375px — every primitive passes
  the existing `smoke-mobile.spec.ts` shape if it ships on a canonical URL.

## Outputs

```
src/styles/screens.css                   # verbatim port of design/compositions/screens.css

src/components/composition/
├── ShowHero.tsx
├── ShowSplit.tsx
├── SeasonGrid.tsx
├── SeasonCard.tsx
├── SeasonShell.tsx
├── SeasonHead.tsx
├── RankShiftPill.tsx
├── ShieldBadge.tsx
├── TopNavTinted.tsx
├── PaletteScope.tsx
└── __tests__/                           # one test per primitive

src/app/internal/composition-demo/page.tsx   # gated demo route
apps/e2e/tests/composition-demo.spec.ts      # snapshots desktop + mobile
```

## Decisions made upfront — DO NOT ASK

- **Port screens.css verbatim** (selector names + class structure)
  rather than rewriting in Tailwind utility classes. screens.css
  is the design hand-off; rewriting risks divergence. Tailwind +
  CSS-vars cohabit fine — keep them in separate files.
- **`/internal/*` routes** are gated by
  `NEXT_PUBLIC_INTERNAL_DEMOS=1`. Off in prod (the build doesn't
  emit the demo HTML), on in dev + e2e (`playwright.config.ts`
  sets it). Future internal routes (style guide, color tester,
  ornament gallery) live here too.
- **PaletteScope** injects vars via inline `style={{ '--show-paper': ... }}`
  on a wrapping div, not via a global CSS rule. Keeps it
  composable (multiple shows on one page, like the home grid).
- **No animation primitives in this phase** — the 240ms palette
  transition is a one-liner in screens.css. If a primitive needs
  motion (e.g., RankShiftPill flash), inline it; don't pull in
  framer-motion.

## Out of scope

- The actual show home / season pages (phases 6 / 9).
- The facade SVG primitives (phase 4).
- The home hero (phase 16) — but phase 16 will consume `<ShowHero>`
  in a "currently featured" composition.

## Failure modes — when to stop

1. `screens.css` selectors collide with existing Tailwind utilities
   → namespace under `.pantheon-screens` parent, regenerate from
   the design file with the prefix applied.
2. A primitive can't be cleanly extracted because the design file
   inlines too much state (e.g., the season-card's hover behavior
   couples to its parent grid) → ship the parent + child as one
   compound component (`<SeasonGrid.Card>`) rather than splitting.
3. `pnpm verify` fails on snapshot drift after primitive
   restructuring → update snapshots, but commit the snapshot diff
   in a separate commit so the design lift stays auditable.

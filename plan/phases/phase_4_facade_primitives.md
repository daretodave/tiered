# Phase 4 — Pantheon facade primitives

> **Substrate that phases 5, 6, 7, 8, 9 consume.** The facade
> grammar is Pantheon's visual identity: column / pediment /
> frieze / ornament on a 1200 × 800 frame, with a sigil cropped
> (never redrawn) to 320 × 320 from the pediment + center column.
> This phase ships the SVG layout primitives and the palette
> injector that every later show family reuses. Phase 5 then
> hands each pioneer show's motif slots over to the `brander`
> sub-agent.
>
> **Companion to phase 4a** (facade primitives = SVG grammar;
> phase 4a = page-shell composition). Both ship before the
> first show family in phase 5.

## Goal

By the end of this phase:

- `src/components/facade/` holds React primitives that enforce
  the facade coordinate contract:
  - `<Facade>` — outer `<svg viewBox="0 0 1200 800">` wrapper.
    Sets palette via `<PaletteScope>`. Accepts the four slot
    primitives as children.
  - `<Pediment>` — `<g>` positioned at the pediment slot
    (y ≈ 0..280). Accepts `motif` children. Renders a
    default classical pediment outline when children empty.
  - `<Column>` — `<g>` positioned at one of three column
    slots (`position="left|center|right"`). Accepts `motif`
    children. Default: a single rectangular column with capital
    and base.
  - `<Frieze>` — `<g>` positioned at the frieze slot
    (y ≈ 280..360). Accepts `motif` children. Default: two
    horizontal lines (the band the design lays down between
    pediment and columns).
  - `<Ornament>` — small reusable decoration (`size` +
    coordinate props). Default: simple six-ray sunburst. Reused
    on season pages and as theme-list bullets.
  - `<Sigil>` — outer `<svg>` with the derived 320 × 320
    viewBox. Accepts the same `<Pediment>` + center `<Column>`
    children the parent facade uses. By construction, a sigil
    is the facade cropped — never separately drawn.
- `src/lib/facade/` holds pure helpers:
  - `deriveSigilViewBox(facadeViewBox)` — given the facade's
    `[x, y, w, h]`, returns the sigil's `[x, y, 320, 320]`
    cropped from horizontal center, top-aligned.
  - `paletteCssVars(palette)` — given `{primary, ink, paper}`,
    returns the CSS-var object `{ '--show-paper', '--show-ink',
    '--show-primary' }`.
  - `slotCoords` — exported constants for the four slot
    bounding boxes, so the brander agent in phase 5 fills
    motifs against a known coordinate budget.
- `<PaletteScope show? palette?>` is the consumer-facing
  wrapper:
  - Given `show=<slug>`, loads the show frontmatter and applies
    its palette.
  - Given an explicit `palette` object, applies it directly.
  - With neither, falls back to Pantheon's ceremonial gold tokens.
  - Wraps children in a `<div data-show={slug}>` with inline
    `style={ ... }` carrying the three CSS vars.
- A demo route at `/internal/facade-demo` renders each primitive
  in isolation **and** the assembled facade + derived sigil
  side-by-side, all using a hardcoded synthetic palette so it
  doesn't depend on a specific show being seeded.
- Demo gate: server-side `process.env.INTERNAL_DEMOS === '1'`
  check at the page entrypoint. Renders `notFound()` otherwise.
  Variable is set by `apps/e2e/playwright.config.ts` webServer
  env block for the e2e build; unset on Vercel → 404 in prod.
- Unit tests colocated at `__tests__/`:
  - `deriveSigilViewBox` — facade `[0,0,1200,800]` → sigil
    `[440,0,320,320]`; preserves a non-zero facade origin;
    handles a non-default crop size argument.
  - `paletteCssVars` — emits the three CSS custom property
    keys; missing palette returns the empty object.
  - `<PaletteScope>` — renders inline style with the three vars
    when `palette` prop set; emits no vars when `palette` is
    `null`.
  - Each primitive — renders a `<g data-testid="...">` (or
    `<svg>` at the outer level), accepts and passes through
    children, defaults to its placeholder rendering when
    `children` empty.
- E2E spec at `apps/e2e/tests/facade-demo.spec.ts`:
  - Desktop project — walks `/internal/facade-demo`, asserts
    H1 present, asserts each `data-testid` for the four slots
    plus the assembled facade plus the cropped sigil is
    visible, asserts the SVG `viewBox` attributes match the
    contract (`0 0 1200 800` for the facade, `440 0 320 320`
    for the sigil).
  - Mobile project — same walk at 375px viewport; reflow
    contract preserved (`scrollWidth ≤ 375 + 1`).

## Outputs

```
src/components/facade/
├── Facade.tsx
├── Pediment.tsx
├── Column.tsx
├── Frieze.tsx
├── Ornament.tsx
├── Sigil.tsx
├── PaletteScope.tsx
└── __tests__/
    ├── Facade.test.tsx
    ├── Pediment.test.tsx
    ├── Column.test.tsx
    ├── Frieze.test.tsx
    ├── Ornament.test.tsx
    ├── Sigil.test.tsx
    └── PaletteScope.test.tsx

src/lib/facade/
├── crop.ts
├── crop.test.ts
├── palette.ts
├── palette.test.ts
├── slots.ts
└── index.ts

src/app/internal/facade-demo/
├── page.tsx
└── FacadeDemo.tsx        # client/server split if needed

apps/e2e/tests/
└── facade-demo.spec.ts   # desktop + mobile project both walk it
```

## Decisions made upfront — DO NOT ASK

- **Slot primitives are layout wrappers, not motif drawings.**
  Each primitive ships a *default* outline (so the demo is
  visually testable) but production rendering happens when
  phase 5 hands motif paths in as children. Brander writes
  per-show motifs against the `slotCoords` budget; primitives
  never need updating per show.
- **Sigil is derived, not drawn.** `<Sigil>` accepts the same
  children as `<Facade>` and reuses them under a cropped
  viewBox. There's no separate "sigil artwork" code path.
  Phase 5's brander will pass the same `<Pediment>` and
  center `<Column>` JSX into both wrappers.
- **`<PaletteScope>` is a server component** that calls
  `getShow(slug)` directly when `show` prop is given. Reading
  from `@/content/loaders` keeps this in step with the rest
  of the codebase; no separate per-show palette map.
- **Demo gate is `INTERNAL_DEMOS`, not `NEXT_PUBLIC_INTERNAL_DEMOS`.**
  Server-only env so the gate value isn't shipped to the client
  bundle. Required `export const dynamic = 'force-dynamic'`
  on the page so the env reads at request time (e2e webServer
  sets the var; Vercel prod doesn't). This deviates from the
  phase 4a brief — phase 4a's brief was drafted before this one
  and will be aligned the same way when 4a ships.
- **The demo route is NOT added to `canonical-urls.ts` or
  `page-reads.ts`.** Internal `/internal/*` routes get their
  own dedicated spec (matches the convention phase 4a uses).
  The smoke walker covers the public surface only.
- **Default placeholder shapes** are deliberately plain
  geometry — a triangle for the pediment, a rectangle with
  cap+base for a column, two lines for the frieze, a six-ray
  sunburst for the ornament. They're abstract architectural
  forms, not show-specific motifs, so the demo never reads
  as "Survivor" by accident.
- **Coordinate contract:** slot coords are constants exported
  from `slots.ts`. Pediment occupies `(0, 0, 1200, 280)`,
  columns at `x = { left: 80, center: 590, right: 1100 }` with
  default width 20 (column body) extending from `y = 100` to
  `y = 720`, frieze at `(0, 280, 1200, 80)`, ornament default
  size 80. Brander phase 5 references `slotCoords` directly.
- **Palette fallback chain:** `PaletteScope` resolves palette
  in this order: explicit `palette` prop > `getShow(slug)` if
  `show` prop set and show exists > Pantheon ceremonial tokens.
  If `show` is set but no show frontmatter exists, log a
  development-only warning and use ceremonial fallback (do
  not throw — phase 5 hasn't seeded the show yet on the first
  pass).
- **`data-show` attribute** on the wrapping `<div>` is the
  selector hook phases 6+ use to scope per-show CSS later.
  Set whenever `show` prop is given, regardless of whether
  palette resolved from frontmatter or fell back.

## Routes / API endpoints / CLI surface

- **GET `/internal/facade-demo`** — server-rendered, gated on
  `process.env.INTERNAL_DEMOS === '1'`. Returns 404 otherwise.
  Not in sitemap. Not in robots index.

## Content / data reads

| Helper | Call | Use |
|---|---|---|
| `getShow(slug)` | `<PaletteScope show={slug}>` | resolve palette per-show |

No new loaders needed; phase 2's `loaders.ts` already exports
`getShow`.

## Components / handlers

**New (phase 4):**
- `<Facade>`, `<Pediment>`, `<Column>`, `<Frieze>`,
  `<Ornament>`, `<Sigil>`, `<PaletteScope>`.

**Reused:**
- `getShow` from `@/content/loaders`.

## Cross-links

- **In (verify):** `/internal/facade-demo` exists; renders
  primitives; SVG viewBox contract holds.
- **Out (ship):** none — primitives are consumed by phase 5,
  not linked from public chrome.
- **Retro-fit:** none. Phase 4 introduces a new abstraction
  that no shipped page uses yet.

## SEO / metadata / output schema

The demo route emits `robots: { index: false, follow: false }`
via `generateMetadata` and is excluded from `app/sitemap.ts`
(which derives from `canonical-urls.ts` indirectly via
`src/lib/routes.ts`; since the demo isn't there, it's auto-
excluded). H1: "Facade primitives — demo".

## Hero / body / sub-section composition

The demo page has six sections:

1. `<h1>` + intro paragraph explaining what this page is.
2. **Pediment** in isolation — `<svg viewBox="0 0 1200 280">`
   with the default pediment shape. Sub-heading + caption.
3. **Column** in isolation — three columns laid out at their
   left/center/right slot x coords inside a `<svg viewBox="0
   0 1200 800">`. Caption notes the `slotCoords` values.
4. **Frieze** in isolation — `<svg viewBox="0 0 1200 100">`
   with the default frieze pattern.
5. **Ornament** in isolation — a grid of three ornaments at
   different sizes (40, 80, 120) showing scale.
6. **Assembled facade + derived sigil** — `<Facade>` with all
   four slots used (default motifs), shown beside `<Sigil>` with
   the same `<Pediment>` and center `<Column>` children, to make
   the crop relationship visual. Palette: a synthetic warm
   ochre `{primary: "#C9551A", ink: "#1A1410", paper: "#F5EFE6"}`
   so the demo doesn't depend on a particular show being seeded.

## Empty / loading / error states

- **Empty palette:** `<PaletteScope>` with neither `show` nor
  `palette` set falls back to Pantheon ceremonial tokens. No
  user-visible error.
- **Unknown show:** `<PaletteScope show="not-real">` logs a
  development-only warning, falls back to ceremonial tokens,
  still sets `data-show="not-real"`.
- **Demo gate off:** `/internal/facade-demo` calls `notFound()`
  → Next.js default 404 page.

## Mobile reflow / responsive / paginate / output limits

- Demo page uses a single column flow on mobile (≤ 768px). Each
  SVG section sets `width="100%" height="auto"` so they scale
  fluidly.
- The smoke-mobile contract (`scrollWidth - innerWidth ≤ 1`)
  is enforced by the new `facade-demo.spec.ts` mobile branch.
- No pagination — the page is short and fixed-length.

## Pages × tests matrix

| Surface | Unit (vitest) | E2E (playwright) |
|---|---|---|
| `deriveSigilViewBox` | `crop.test.ts` — fixture, origin, custom size | — |
| `paletteCssVars` | `palette.test.ts` — keys, empty-input | — |
| `<PaletteScope>` | `PaletteScope.test.tsx` — vars set, vars empty, data-show attr | — |
| `<Facade>` | `Facade.test.tsx` — outer viewBox, passes children | — |
| `<Pediment>` | `Pediment.test.tsx` — default shape, children passthrough, testid | — |
| `<Column>` | `Column.test.tsx` — each of 3 positions, testid, motif passthrough | — |
| `<Frieze>` | `Frieze.test.tsx` — default lines, testid | — |
| `<Ornament>` | `Ornament.test.tsx` — size prop, default sunburst, testid | — |
| `<Sigil>` | `Sigil.test.tsx` — cropped viewBox, children passthrough, testid | — |
| `/internal/facade-demo` | — | `facade-demo.spec.ts` — desktop + mobile, four primitive testids visible, SVG viewBox attrs match contract |

## Verify gate

Unit phase ships first, then build, then e2e. Standard chain:

```bash
pnpm verify
```

Same hard gate as phase 3.

## Commit body template

```
feat: facade primitives — phase 4

- Add <Facade>, <Pediment>, <Column>, <Frieze>, <Ornament>, <Sigil> SVG primitives in src/components/facade.
- Add deriveSigilViewBox + paletteCssVars + slotCoords pure helpers in src/lib/facade.
- Add <PaletteScope> server component that resolves per-show palette from content loaders, with ceremonial fallback.
- Add /internal/facade-demo gated route + facade-demo.spec.ts (desktop + mobile).
- Unit tests cover crop math, palette injection, every primitive renders + passes through motif children.

Decisions:
- Slot primitives are layout wrappers — default placeholder shapes for the demo; phase 5 fills motifs per show.
- Sigil is derived (not redrawn) — accepts same children as Facade under cropped viewBox.
- Demo gate uses server-only INTERNAL_DEMOS (no NEXT_PUBLIC_) + force-dynamic so e2e webServer env wins; aligned phase 4a brief in a follow-up.
- /internal/* routes stay out of canonical-urls.ts; dedicated specs cover them.

Closes #<phase-issue>
```

## DoD

- [ ] `pnpm verify` green.
- [ ] `pnpm deploy:check` green at the shipping commit.
- [ ] Phase row in `plan/steps/01_build_plan.md` flipped `[x]`
      with commit hash.
- [ ] Phase mirror issue closed.
- [ ] All seven primitives + three helpers exist with colocated
      tests.
- [ ] `/internal/facade-demo` route renders 200 under the e2e
      env block and 404 otherwise.

## Follow-ups (out of scope)

- Phase 5: brander generates per-show facade motifs for
  Survivor, Top Chef, Drag Race. Same `<Facade>` + slot
  primitives; phase 5 just writes the motif path JSX that
  fills each `<Pediment>` / `<Column>` / `<Frieze>` /
  `<Ornament>` children prop.
- Phase 4a alignment: re-state the gate to `INTERNAL_DEMOS`
  when 4a ships, for parity with this phase.
- Phase 6 wires the facade into `<ShowHero>` (phase 4a
  composition primitive).
- Phase 17 OG image route renders the facade SVG to PNG.

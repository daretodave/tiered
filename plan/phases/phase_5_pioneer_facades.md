# Phase 5 — Three pioneer show facades

> **The first three facades the brander ever ships for pantheon.**
> Survivor, Top Chef, RuPaul's Drag Race — chosen because they
> span the visual range of the launch quota (outdoor / kitchen /
> stage) and force the facade grammar to prove it can carry
> distinct identities through one shared vocabulary.
>
> This phase is **inline brander invocation** from
> `/ship-a-phase`. The `brander` agent (see
> `.claude/agents/brander.md`) is the canonical delegate. THREE
> parallel `Agent({ subagent_type: "brander", ... })` calls,
> one per show, each handed a pre-filled brief — same shape
> `/ship-content` uses for Rule 1 / Rule 4, but the calling
> skill is `/ship-a-phase` instead of `/ship-content`.
>
> **Phase 5 is a special case** because the user shipped sigil
> designs for these three shows in `design/compositions/sigils.jsx`.
> The brander **expands** the user's sigils into full facades +
> ornaments. **Every show after these three generates from
> scratch** via `/ship-content` Rule 1 (phases 20–22). In the
> from-scratch flow, brander reads the show's hero_motifs from
> the curator's brief, invents the visual vocabulary, picks the
> palette per `.claude/agents/brander.md` §3-color palette, and
> writes everything fresh. No design hand-off, no `sigils.jsx`
> entry, just the agent's facade grammar applied to a new show.

## Goal

By the end of this phase, the repo contains:

```
public/shows/survivor/
├── facade.svg          # 1200x800, palm-trunk columns + torch-flame pediment + woven-rope frieze
├── sigil.svg           # 320x320, derived crop (pediment + center column)
├── ornament-1.svg      # ~80x80
├── ornament-2.svg
├── ornament-3.svg
└── .brander.json       # provenance + chosen palette

public/shows/top-chef/
├── facade.svg          # knife-rack columns + chef-hat pediment + tiled-tile frieze (TBD by brander)
├── sigil.svg
├── ornament-{1,2,3}.svg
└── .brander.json

public/shows/dragrace/
├── facade.svg          # spotlight columns + crown pediment + jewel-strand frieze (TBD by brander)
├── sigil.svg
├── ornament-{1,2,3}.svg
└── .brander.json

content/shows/top-chef.md       # frontmatter only; full content lands in phase 20-22
content/shows/dragrace.md
```

`content/shows/survivor.md` already exists; this phase's content-side change is just **back-writing the brander's chosen palette into the existing frontmatter** if it diverged from the seeded value.

For Top Chef and Drag Race, ship **minimal frontmatter only** (slug, name, network, format, hero_motifs, palette, status). Tagline + canon + season blurbs are out of scope — those drain through `/ship-content` in phase 20-22 per bearings Rule 1.

## Source of truth — `design/compositions/sigils.jsx`

The user already shipped sigil designs for all three shows in
`design/compositions/sigils.jsx`. **That file is authoritative.**

What's there:
- `SHOWS.survivor`   — paper `#0E2A2A`, ink `#EFE2BD`, primary `#D55E36`
- `SHOWS.topchef`    — paper `#1B2418`, ink `#ECDFC6`, primary `#B86A2E`
- `SHOWS.dragrace`   — paper `#2D0B2A`, ink `#F2E1D2`, primary `#E64B86`
- Three `<XSigil>` React components at 80×80 (cropped pediment + center column)
- Per-show tagline strings (the brander reads these for vibe)

**Brander's job is NOT to invent.** It's to:
1. Take each sigil's path data as the **pediment + center column** at 80×80 → scale up the same paths to 320×320 for `public/shows/<slug>/sigil.svg`.
2. Expand the same vocabulary into the **full 1200×800 facade.svg** — add the remaining 4 columns, frieze, ornament dispersal — using the same stroke weights, palette, and visual grammar as the sigil. The center column at facade scale should be a 5× zoom of the sigil's center column.
3. Derive 3 ornaments at ~80×80 from the facade's frieze + ornament-dispersal area.

The palettes in `sigils.jsx` are **the user's hand-off** — they win over the seeded values in `content/shows/survivor.md`. After phase 5 ships, Survivor's frontmatter palette gets rewritten to `{ primary: #D55E36, ink: #EFE2BD, paper: #0E2A2A }`.

## Hero motifs

Derived from the sigil designs in `sigils.jsx` (re-read the file when reasoning about each):

| Show       | motif[0] column        | motif[1] pediment         | motif[2] frieze + ornament |
|------------|------------------------|---------------------------|----------------------------|
| Survivor   | palm-trunk             | torch-flame               | woven-rope                 |
| Top Chef   | knife-rack             | chef-hat / toque silhouette | tiled-mosaic             |
| Drag Race  | spotlight-pole         | five-point crown          | jewel-strand               |

If a brander reads the sigil and proposes different motifs (because the sigil's vocabulary suggests them more clearly), accept the brander's read — the sigil is more authoritative than this table.

## Step-by-step

### Step 1 — Spawn three brander agents in parallel

One `Agent` tool call message, three independent invocations:

```ts
Agent({
  subagent_type: "brander",
  description: "Survivor facade + sigil + 3 ornaments",
  prompt: `Expand SurvivorSigil → full facade + assets.

  Authoritative source: design/compositions/sigils.jsx → SurvivorSigil
  + SHOWS.survivor. Use that file's path data, palette, and
  motifs verbatim — do not re-invent the visual identity.

  Brief:
  {
    "kind": "facade",
    "show_slug": "survivor",
    "show_name": "Survivor",
    "format": "outwit-outplay-outlast",
    "hero_motifs": ["palm-trunk", "torch-flame", "woven-rope"],
    "palette": {
      "primary": "#D55E36",
      "ink":     "#EFE2BD",
      "paper":   "#0E2A2A"
    },
    "design_source": "design/compositions/sigils.jsx → SurvivorSigil"
  }

  Procedure:
  1. Read design/compositions/sigils.jsx in full.
  2. Generate public/shows/survivor/sigil.svg at 320×320 by
     scaling the SurvivorSigil 80×80 paths 4× and preserving
     stroke proportions.
  3. Generate public/shows/survivor/facade.svg at 1200×800 by
     placing the sigil's vocabulary into the four-slot grammar:
     pediment (the triangle + torch-flame from SurvivorSigil),
     center column (the column-3 paths from SurvivorSigil at
     facade scale), four additional columns echoing the same
     palm-trunk treatment, frieze with woven-rope motif,
     ornament dispersal at the base.
  4. Generate 3 ornament-{1,2,3}.svg at ~80×80 each from the
     frieze + ornament motif (e.g. rope-knot, palm-frond,
     wooden-stake).
  5. Write public/shows/survivor/.brander.json provenance.

  Palette wins over the seeded content/shows/survivor.md value;
  the calling skill (phase 5) will back-write the frontmatter.`
})

Agent({
  subagent_type: "brander",
  description: "Top Chef facade + sigil + 3 ornaments",
  prompt: `Expand TopChefSigil → full facade + assets.

  Authoritative source: design/compositions/sigils.jsx → TopChefSigil
  + SHOWS.topchef. Use that file's path data, palette, and
  motifs verbatim — do not re-invent the visual identity.

  Brief:
  {
    "kind": "facade",
    "show_slug": "top-chef",
    "show_name": "Top Chef",
    "format": "competitive-cooking-elimination",
    "hero_motifs": ["knife-rack", "chef-hat", "tiled-mosaic"],
    "palette": {
      "primary": "#B86A2E",
      "ink":     "#ECDFC6",
      "paper":   "#1B2418"
    },
    "design_source": "design/compositions/sigils.jsx → TopChefSigil"
  }

  Same procedure as the Survivor brief — scale the sigil paths
  4× for the 320×320 sigil.svg, expand the vocabulary into a
  1200×800 facade.svg, derive 3 ornament SVGs (e.g. knife,
  herb-sprig, peppercorn). Provenance JSON required.`
})

Agent({
  subagent_type: "brander",
  description: "Drag Race facade + sigil + 3 ornaments",
  prompt: `Expand DragRaceSigil → full facade + assets.

  Authoritative source: design/compositions/sigils.jsx → DragRaceSigil
  + SHOWS.dragrace. Use that file's path data, palette, and
  motifs verbatim — do not re-invent the visual identity.

  Brief:
  {
    "kind": "facade",
    "show_slug": "dragrace",
    "show_name": "RuPaul's Drag Race",
    "format": "drag-performance-competition",
    "hero_motifs": ["spotlight-pole", "five-point-crown", "jewel-strand"],
    "palette": {
      "primary": "#E64B86",
      "ink":     "#F2E1D2",
      "paper":   "#2D0B2A"
    },
    "design_source": "design/compositions/sigils.jsx → DragRaceSigil"
  }

  Same procedure — scale the sigil 4× for 320×320, expand into
  1200×800 facade (the crown + spotlight + jewel-strand
  vocabulary), derive 3 ornament SVGs (e.g. crown-point,
  jewel-droplet, lash). Provenance JSON required.`
})
```

**Parallel** because the three branders are independent. Don't serialize.

The Drag Race prompt instructs the brander to read the Top Chef provenance — this is a race condition (Drag Race may start before Top Chef finishes). Accept it: the Drag Race brander reads what exists when it gets to that step. Worst case it picks a primary too close to Top Chef's; surfaced in the post-validate step below.

### Step 2 — Collect and write content frontmatter

After all three brander agents return:

- Read `public/shows/<slug>/.brander.json` for each show.
- For **survivor**: compare brander palette to existing frontmatter palette. If different, the brander wins — rewrite `content/shows/survivor.md` palette block.
- For **top-chef** and **dragrace**: write `content/shows/<slug>.md` minimal frontmatter:

```yaml
---
slug: top-chef
name: Top Chef
network: Bravo
format: competitive-cooking-elimination
hero_motifs: [knife-rack, chef-hat, tiled-mosaic]
palette:
  primary: "#<from .brander.json>"
  ink:     "#<from .brander.json>"
  paper:   "#<from .brander.json>"
status: airing
---
```

(Drag Race analogous: `slug: dragrace`, `network: VH1/MTV`, `format: drag-performance-competition`, motifs from the table above.)

### Step 3 — Post-brander palette sanity check

Compute pairwise color distance between the three shows' `primary` colors. If two are within ΔE < 25 (perceptually close), file a row in `plan/AUDIT.md` tagged `[palette-clash]` and proceed anyway — content velocity beats palette perfectionism at this stage. `/iterate` can re-brand later.

### Step 4 — Wire e2e snapshot coverage

For each new show, add to `apps/e2e/tests/`:

- A snapshot that renders `<PaletteScope show="<slug>">` wrapping the show's facade SVG (consumed via `<img src="/shows/<slug>/facade.svg">` until the SVG-component primitive ships in phase 4).
- Asserts the per-show CSS vars (`--show-paper`, `--show-ink`, `--show-primary`) match the frontmatter palette.
- Mobile pass at 375px confirms the facade scales without overflow.

The smoke walker already covers `/shows/<slug>` for any new show that has a frontmatter row — Top Chef and Drag Race will auto-appear in the canonical-urls fixture and the smoke pass picks them up at their stubbed `/shows/[show]` pages.

### Step 5 — Verify + commit + push

```bash
pnpm verify
```

Expected: every new show's `/shows/<slug>` returns 200, palette CSS vars are visible in the DOM, e2e snapshot passes at desktop + mobile.

Commit message follows ship-a-phase §10:

```
feat(facades): Survivor + Top Chef + Drag Race — phase 5

- 3 facade.svg files generated by brander (1200x800, four-slot grammar)
- 3 derived sigil.svg files (320x320, cropped pediment + center column)
- 9 ornament SVGs (3 per show)
- Top Chef + Drag Race content/shows/<slug>.md frontmatter (palette from brander)
- Survivor palette adjusted (or preserved) per brander verification
- e2e snapshot coverage for all three palette swaps

Decisions:
- ...
```

## Decisions made upfront — DO NOT ASK

- **Three parallel brander invocations**, not serial. The race condition on Drag Race reading Top Chef's provenance is acceptable (worst case: ΔE clash flagged in audit).
- **Top Chef + Drag Race ship frontmatter ONLY.** Canon + season blurbs land in phases 20-22 via `/ship-content`. This phase is the **visual** opening shot, not the editorial one.
- **Survivor palette: brander wins.** If the brander proposes a different palette than the seeded one in `content/shows/survivor.md`, rewrite the frontmatter to match. The brander is the authority on facade-palette pairing.
- **No facade React component yet.** Phase 4 ships `<Column>` / `<Pediment>` / `<Frieze>` / `<Ornament>` SVG primitives; this phase ships the raw `.svg` files. Phase 6 (show home) wires them together. The two are independent.
- **Ornament reuse strategy:** ornaments live at `public/shows/<slug>/ornament-{1,2,3}.svg`. The season page (phase 9) picks one per season based on hash(season number) → ornament index. Brander doesn't need to know the assignment.

## Out of scope

- Show home page composition (phase 6).
- Per-show canon writing (phase 20+).
- Per-show season blurbs (phase 20+).
- The `<Column>` / `<Pediment>` / `<Frieze>` / `<Ornament>` React primitives (phase 4).
- The composition page-shell primitives — `<ShowHero>`, `<SeasonCard>`, etc. (phase 4a).

## Failure modes — when to stop

1. **A brander returns malformed SVG** (parse fail) → respawn that one brander with a "fix the SVG; previous attempt at <path> failed at <position>" prompt. Up to 2 retries per show.
2. **WCAG AA verification fails for a chosen palette** → the brander should self-correct; if it returns a palette that still fails, accept it, file `[palette-fail-<slug>]` in `plan/AUDIT.md` severity HIGH, and ship anyway. `/iterate` can fix on the next tick.
3. **All three branders return identical / near-identical palettes** → unlikely given the brander reads existing siblings, but if it happens, file `[palette-clash]` and ship. Re-brand via `/iterate`.
4. **pnpm verify fails on snapshot drift** after the facades land → expected. Update snapshots in a separate commit (`chore: snapshot drift from phase 5 facades`) so the design lift stays auditable.

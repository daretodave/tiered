# Pantheon — autonomy directives

This file is read on every session in this project. Honor it before improvising.

Pantheon is an editorial reality-TV ranking site. Promise: **"the seasons, ranked. no spoilers."** Audience is the knowledgeable, spoiler-averse fan.

---

## The visual system, in one paragraph

Pantheon's identity rests on two pillars: **color** and **typography**. Each show has a three-color palette (paper / ink / primary) and a name set in Source Serif 4. That is the whole identity. There is no illustration, no per-show iconography, no sigil, no facade, no mascot, no thematic ornamentation. The color does the visual work. The serif does the editorial work. Everything else is text.

---

## Hard rules — do not break

1. **NEVER generate SVG illustration for individual shows.**
   No facades, sigils, mascots, torches, sequins, spoons, herbs, columns, pediments, friezes, or any other per-show artwork. This direction was prototyped (May 2026 facade grammar) and rejected — the output reads as AI-generated and does not meet the bar. Do not retry it. Do not "improve" it. Do not add "just one small icon."

2. **Where a show needs a marker in a list** — anywhere you would be tempted to place a tiny illustration, badge, sigil, or icon — **use a 12–16px filled circle** in `var(--show-primary)`. Class name: `.bullet`. This is the only show-specific graphic permitted in the entire system.

3. **The only SVG in the product is the Pantheon brand mark** — a simple pediment + three columns, monochromatic, shared across every show, located in the topbar. Do not invent per-show variants of this mark.

4. **Color identity flows through chrome tinting.** When a reader is on a show page, the chrome tokens (`--show-paper`, `--show-ink`, `--show-primary`) override the neutral defaults. Big colored blocks holding huge serif type ARE the hero treatment. Resist the urge to "add visual interest" with art — the color and the type are the visual interest.

5. **Type does the heavy lifting.** Source Serif 4 for editorial (40–96px on heroes). Inter for chrome. JetBrains Mono for ranks. When in doubt, make the type bigger before reaching for ornament.

---

## Show identity, formalized

Each show ships exactly five fields. No more.

| field      | type    | example                                                       |
|------------|---------|---------------------------------------------------------------|
| `name`     | string  | "Survivor"                                                    |
| `paper`    | hex     | "#0E2A2A"                                                     |
| `ink`      | hex     | "#EFE2BD"                                                     |
| `primary`  | hex     | "#D55E36"                                                     |
| `seasons`  | int     | 47                                                            |
| `blurb`    | string  | "47 seasons. One torch at a time."                            |
| `tagline`  | string  | "47 seasons of strangers on a beach. We've ranked every one." |

No SVG path. No icon name. No mascot reference. If a future contributor proposes a sixth field that is graphical in nature, reject it.

---

## File map

| file                                  | purpose                                                |
|---------------------------------------|--------------------------------------------------------|
| `tokens.json`                         | Design tokens — single source of truth.                |
| `Pantheon · Tokens.html`              | Token gallery.                                         |
| `Pantheon · Show Identity.html`       | The color+type rules + canonical three-show set.       |
| `Pantheon · Compositions.html`        | Home / Show / Season + interactions + micro-copy.      |
| `Pantheon · Brand.html`               | Brand mark + header + footer lockups + scale.          |
| `Pantheon · Survivor.html`            | Production show page (full-bleed, all 47 seasons).     |
| `compositions/screens.jsx`            | React components for the three pages.                  |
| `compositions/interactions.jsx`       | VotePair, CommentInput, RankShiftPill.                 |
| `compositions/screens.css`            | Page styles.                                           |
| `CLAUDE.md`                           | This file.                                             |

**Deleted in the May 2026 pivot** — do not recreate:
- `Pantheon · Facades.html` (the SVG facade grammar doc)
- `compositions/sigils.jsx` (per-show sigil components)

---

## The brand mark

The Pantheon brand mark (pediment + three columns + stylobate) is the **only** SVG illustration in the entire product. It is shared across every page, in every show context. **Never invent per-show variants.** Source of truth: the inline `<svg viewBox="0 0 28 28">` block in every page header. See `Pantheon · Brand.html` for the complete spec (scale, modes, lockups, do/don't).

---

## Voice

Knowledgeable peer. Confident, warm, plain-spoken. The reader is a friend who watches everything and wants the truth without spoilers. No exclamation points unless quoted. The brand promise is the only place the word "ranked" needs to be loud; everywhere else it can be quiet.

## Layout & motion

- 8px spacing scale (4px half-step). Radii: 4 / 8 / 16. Shadow: single 1px y-offset, three opacities.
- Three durations (120 / 240 / 480ms) and four named easings (rise / settle / linear / dwell).
- `prefers-reduced-motion`: collapse every transform to a plain opacity fade.

## Accessibility floor

- AA contrast on every text/background pair (token sets are pre-tested).
- Every interactive control has an `aria-label` or visible text label.
- Hit targets ≥ 44px on touch.
- Reduced-motion path on every animated component.

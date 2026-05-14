# tiered.tv — autonomy directives

This file is read on every session in this project. Honor it before improvising.

tiered.tv is an editorial reality-TV ranking site. Promise: **"the seasons, ranked. no spoilers."** Audience is the knowledgeable, spoiler-averse fan.

The brand was renamed from **Pantheon** to **tiered.tv** in May 2026. The temple metaphor (pediment + columns) belonged to the old name; it has been retired. The color + type system is unchanged — it remains the strongest part of the work. The new wordmark is lowercase **tiered.tv** in Source Serif 4 weight 600. The new brand mark is **three horizontal bars, stacked, descending in width** — a literal tier-list. See `tiered.tv · Brand.html` for the full spec.

---

## The visual system, in one paragraph

tiered.tv's identity rests on two pillars: **color** and **typography**. Each show has a three-color palette (paper / ink / primary) and a name set in Source Serif 4. That is the whole identity. There is no illustration, no per-show iconography, no sigil, no facade, no mascot, no thematic ornamentation. The color does the visual work. The serif does the editorial work. Everything else is text.

---

## Hard rules — do not break

1. **NEVER generate SVG illustration for individual shows.**
   No facades, sigils, mascots, torches, sequins, spoons, herbs, columns, pediments, friezes, custom tier-mark variants, or any other per-show artwork. The per-show-illustration direction was prototyped (May 2026 facade grammar) and rejected — the output reads as AI-generated and does not meet the bar. Do not retry it. Do not "improve" it. Do not add "just one small icon." Do not invent a Survivor-flavored tier mark.

2. **Where a show needs a marker in a list** — anywhere you would be tempted to place a tiny illustration, badge, sigil, or icon — **use a 12–16px filled circle** in `var(--show-primary)`. Class name: `.bullet`. This is the only show-specific graphic permitted in the entire system.

3. **The only SVG in the product is the tiered.tv brand mark** — three horizontal bars, stacked, descending in width (20 / 14 / 8 units on a 28-unit viewBox), monochromatic, shared across every show, located in the topbar. Do not invent per-show variants of this mark. Do not equalize the bars, reverse them, tighten the gaps, or render them in anything but `currentColor`.

4. **Color identity flows through chrome tinting.** When a reader is on a show page, the chrome tokens (`--show-paper`, `--show-ink`, `--show-primary`) override the neutral defaults. Big colored blocks holding huge serif type ARE the hero treatment. Resist the urge to "add visual interest" with art — the color and the type are the visual interest.

5. **Type does the heavy lifting.** Source Serif 4 for editorial (40–96px on heroes). Inter for chrome. JetBrains Mono for ranks. When in doubt, make the type bigger before reaching for ornament.

6. **The wordmark is lowercase.** "tiered.tv" — set in Source Serif 4 weight 600, all lowercase, including the `.tv`. The dot is part of the wordmark; do not stylize it, color it, or kern it apart. Do not capitalize the T.

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
| `tiered.tv · Home.html`               | Production home page.                                  |
| `tiered.tv · All Shows.html`          | All shows index, sorted by tier (S/A/B).               |
| `tiered.tv · Tokens.html`             | Token gallery.                                         |
| `tiered.tv · Show Identity.html`      | The color+type rules + canonical three-show set.       |
| `tiered.tv · Compositions.html`       | Home / Show / Season + interactions + micro-copy.      |
| `tiered.tv · Brand.html`              | Brand mark + header + footer lockups + scale.          |
| `tiered.tv · Survivor.html`           | Production show page (full-bleed, all 47 seasons).     |
| `tiered.tv · Lists.html`              | Themed cross-show lists index.                         |
| `tiered.tv · Best Premieres.html`     | One representative themed list.                        |
| `tiered.tv · Heroes vs. Villains.html`| One representative season page.                        |
| `compositions/screens.jsx`            | React components for the three pages.                  |
| `compositions/interactions.jsx`       | VotePair, CommentInput, RankShiftPill.                 |
| `compositions/screens.css`            | Page styles.                                           |
| `CLAUDE.md`                           | This file.                                             |

**Deleted in earlier pivots** — do not recreate:
- `Pantheon · *.html` files (May 2026 rename — superseded by `tiered.tv · *.html`)
- `Pantheon · Facades.html` (the SVG facade grammar doc — rejected)
- `compositions/sigils.jsx` (per-show sigil components — rejected)

---

## The brand mark

The tiered.tv brand mark — three horizontal bars stacked vertically, widths 20 / 14 / 8 on a 28-unit viewBox, filled `currentColor`, no stroke — is the **only** SVG illustration in the entire product. It is shared across every page, in every show context. **Never invent per-show variants.** Source of truth: the inline `<svg viewBox="0 0 28 28">` block in every page header (24×24 sibling used at small sizes). See `tiered.tv · Brand.html` for the complete spec (scale, modes, lockups, do/don't).

---

## Voice

Knowledgeable peer. Confident, warm, plain-spoken. The reader is a friend who watches everything and wants the truth without spoilers. No exclamation points unless quoted. The brand promise is the only place the word "ranked" needs to be loud; everywhere else it can be quiet. The lowercase brand name signals internet-native, not informal — match that register: precise, current, unfussy.

## Layout & motion

- 8px spacing scale (4px half-step). Radii: 4 / 8 / 16. Shadow: single 1px y-offset, three opacities.
- Three durations (120 / 240 / 480ms) and four named easings (rise / settle / linear / dwell).
- `prefers-reduced-motion`: collapse every transform to a plain opacity fade.

## Accessibility floor

- AA contrast on every text/background pair (token sets are pre-tested).
- Every interactive control has an `aria-label` or visible text label.
- Hit targets ≥ 44px on touch.
- Reduced-motion path on every animated component.

# Phase 19g — Lists overview to spec

> **Context.** Rebuild `/themes` against
> `design/Pantheon · Lists.html`. The new overview is a
> bounded (max-width 1240px) cross-canon index with a stats
> hero, category-chip filter, "Featured this month" 3-card
> row, and an "All lists" section grouped by category. Depends
> on **phase 19f** (theme schema refresh) for `category`,
> `featured`, `last_revised`, `sentiment`, `curator`, and the
> entry-level `title` field.

## 1. Route + layout

- Path stays `/themes` (URL contract in `bearings.md` is locked
  — see 19f Decisions §10 for why we don't rename to `/lists`).
- Bounded route (uses `<Wrap>` from 19b), neutral Pantheon
  chrome. NOT tinted — `/themes` is the cross-show index and
  uses the global ceremonial gold for emphasis.

## 2. Sections, in order

1. **Hero** (`<ListsHero>`) — eyebrow + h1 + lede + stats
2. **Filter bar** (`<ListsFilterBar>`) — chips + filter-mode
   label
3. **Featured row** (`<ListsFeaturedRow>`) — 3 cards, first
   `big`
4. **All lists** (`<ListsAllSection>`) — category groups, each
   a vertical row stack
5. Footer (already in the route-group layout from 19b)

## 3. `<ListsHero>` — `src/components/lists/ListsHero.tsx`

Reference: `design/Pantheon · Lists.html` lines 168-178.

```
┌────────────────────────────────────────────┐
│ — Pantheon / Lists                         │   eyebrow (mono 12px, 0.16em, ink-3)
│                                            │
│   Themed lists.                            │   serif 500 96px line-height 0.96
│   Cross-canon.                             │   <em class="primary">
│                                            │
│   Twenty-three pieces of editorial         │   serif 22px ink-1, max-w 680px
│   opinion, organized by the part of the    │
│   craft they admire…                       │
│                                            │
│   23  ·  3  ·  2026                        │   stat row: 48px gap
│   LISTS  SHOWS  INDEX REV                  │   serif 32px / mono 11px keys
└────────────────────────────────────────────┘
```

Tokens:
- Padding: `96px 40px 72px` desktop, `64px 20px 48px` mobile
- Bottom border: 1px `var(--line-soft)`
- Eyebrow uses the `::before` rule (24px x 1px loud line)
- Title em: `color: var(--primary)`, italic, weight 500
- Stats row: flex gap 48px, wraps on mobile
- Each stat: `.stat-val` (serif 500 32px) over `.stat-key`
  (mono 500 11px uppercase, 0.1em, ink-3)

Lede copy is **derived from current stats**, not hardcoded.
Compose with `getThemeStats()` from 19f:
```tsx
const stats = getThemeStats()
const lede = `${plural(stats.total, 'piece', 'pieces')} of editorial opinion, organized by the part of the craft they admire. Some span every show. Some live inside one. None of them spoil what they rank.`
```

Stat values pull from the same source:
- `stats.total` → "Lists"
- `stats.showsCovered` → "Shows covered"
- `formatRevisedYear(stats.lastIndexRevision)` → "Index last revised"

Unit tests:
- Renders all three stats from a fixture
- Em accent on "Cross-canon"
- Eyebrow renders "Pantheon / Lists"

## 4. `<ListsFilterBar>` — `src/components/lists/ListsFilterBar.tsx`

Reference: design lines 180-190.

Chips:
- `All` (default on)
- `By tone` (filter to `category === 'tone'`)
- `By craft` (`craft`)
- `By era` (`era`)
- `Single-show` (`single`)

Right-side label: "view · {N} {category-label-lowercase}" where
N is the current filter's count.

The bar is a client component (`'use client'`) because the chips
toggle state. State stays local — no URL sync in 19g (a URL
param could be a follow-up; the design doesn't deep-link
filters).

Implementation:
```tsx
'use client'
type Filter = 'all' | ThemeCategory
type ListsFilterBarProps = {
  counts: Record<Filter, number>
  value: Filter
  onChange: (next: Filter) => void
}
```

The parent (`/themes/page.tsx`) is a server component; it
passes the counts (precomputed) and the page wraps a small
`'use client'` shell that holds the `useState<Filter>` and
re-renders the featured row + the all-lists section.

Or — simpler — make the entire page client-side (rare for
content pages, but the design's interactivity is bound to the
chip click). For Pantheon's SEO discipline, **prefer the
server-static + client-island approach**: pre-render every
group fully and use a small `'use client'` controller that
toggles `display: none` on the off-filter groups via a
`data-filter` attribute and CSS.

Server-static + CSS toggle approach:
- Page renders ALL groups in the DOM (good for SEO + smoke
  walk)
- A small `<FilterController>` client component toggles
  `data-active-filter="<filter>"` on a parent div
- CSS:
  ```css
  [data-active-filter="tone"] .list-group:not([data-category="tone"]) { display: none; }
  ```
- Falls back to "show all" without JS

Unit tests:
- Renders 5 chips with the right `data-filter` attrs
- Counts populated from props
- Clicking a chip flips the data attr (mount inside a div with
  the attr, assert change)

## 5. `<ListsFeaturedRow>` — `src/components/lists/ListsFeaturedRow.tsx`

Reference: design lines 192-234.

Three cards in a `1.4fr 1fr 1fr` grid, gap 1px (border-pixel
look). First is `.big`. Mobile collapses to single column.

Each `<FeaturedCard>`:
- `.feat-tag` — bullet stack (one bullet per show in the list,
  10px) + "Cross-canon · {N} entries" or "{Show} · {N} entries"
  (one-show case)
- `<h3>` — serif 500 30px (or 42px for `.big`)
- `.feat-blurb` — serif italic 16px, color ink-2
- `.feat-foot` — flex row: "{theme.status, formatted}" on left,
  primary-gold "read the list →" or "read →" on right
- Border-top on foot strip
- Hover: `translateY(-2px)` + bg `var(--paper-2)`

Crumb logic for `.feat-tag`:
- If `getShowsForTheme(theme).length === 1`: "{ShowName} · {N} entries"
- Else: "Cross-canon · {N} entries"

Status formatting:
- `growing` → "growing"
- `stable` → "stable list"
- `updated` → "updated {ago-label}" (e.g. "updated this week"
  from `last_revised` if within 7 days, else "this month",
  else "this year")
- `started` → "started {YYYY}" (year from `last_revised`)

Data source: `getFeaturedThemes(3)` from 19f. First result
gets `big`. Fewer than 3 featured → render what we have; the
section gracefully shrinks.

Unit tests:
- Cards render in order
- First card has `.big` class
- Bullet stack has one bullet per unique show
- Single-show vs cross-canon crumb branch
- Status formatting matches above

## 6. `<ListsAllSection>` — `src/components/lists/ListsAllSection.tsx`

Reference: design lines 236-243 + lines 313-343 (the render).

For each category (tone → craft → era → single, in that order
— this is the editorial order, not alphabetical):

```
By tone · 4                                ───────────────────
─────────────────────────────────────────────────────────────
│ [●●●]  Best premieres ever               24 entries          → │
│        The cold opens that promised…     updated this week      │
─────────────────────────────────────────────────────────────
│ [●●]   Quietly perfect bottle seasons    9 entries          → │
│        Single locations, fixed casts…    started 2023           │
─────────────────────────────────────────────────────────────
```

Each `<ListRow>` (`src/components/lists/ListRow.tsx`):
- Grid: `auto 1fr auto auto`, gap 24px (mobile: 14px, hide
  the meta column)
- `.list-row-bullets` — `<Bullet size={10}>` per show in the
  theme
- `.list-row-body` — serif 19px title over serif italic 14px
  blurb (use `theme.description`, not tagline)
- `.list-row-meta` — mono 11px, two-line: "{N} entries" /
  "{status-formatted}"
- `.list-row-arrow` — primary-gold `→`

Group head:
- `.list-group-head` — mono 500 11px 0.16em uppercase ink-3,
  with a `::after` 1px line filling remaining width
- Content: "By tone · {N}" / "By craft · {N}" / "By era · {N}"
  / "Single-show pantheons · {N}"

Hover: bg `var(--paper-2)`, cursor pointer.

Filter wiring: each `.list-group` carries `data-category` so
the CSS rule in §4 toggles visibility. Inside the group, the
list-stack has its own border + radius even when filtered (no
visual jump when a category collapses).

Data: `getThemesByCategory()` from 19f. Each category's themes
sorted by `last_revised` desc.

Unit tests:
- Renders one group per non-empty category
- Group order is editorial (tone, craft, era, single)
- Each row has `data-testid="lists-row"` + `data-slug`
- Bullets render per unique show in the entries
- "Single-show pantheons" group head copy is literal (not "By
  single")

## 7. CSS — `src/styles/lists.css`

New file imported into `src/app/globals.css`. Tokenize against
`--color-*` so dark/light flip work (per the lesson from
`4b2e9c4`). Don't redeclare hex locally.

Sections to port from design's inline CSS:
- `.lists-hero` (or reuse `.home-hero-eyebrow` etc.)
- `.lists-filter-bar`, `.chip`, `.filter-mode`
- `.lists-featured-row`, `.feat-card`, `.feat-tag`, `.feat-blurb`, `.feat-foot`
- `.lists-all-section`, `.list-group`, `.list-group-head`, `.list-stack`, `.list-row` (+ children)
- `data-active-filter="…"` cascade rules

The existing `.list-tile` (used by the home `<ListTile>`) lives
in `screens.css`. **Do not rename it** — that breaks home
testids. The lists overview row is a different visual
composition; use `.list-row` (matches the design).

## 8. Page composition

`src/app/(default)/themes/page.tsx`:

```tsx
import { Wrap } from '@/components/chrome/Wrap'
import { getAllThemes } from '@/content'
import { ListsHero } from '@/components/lists/ListsHero'
import { ListsFilterController } from '@/components/lists/ListsFilterController'
import { ListsFeaturedRow } from '@/components/lists/ListsFeaturedRow'
import { ListsAllSection } from '@/components/lists/ListsAllSection'
// JSON-LD unchanged shape

export const dynamic = 'force-static'

export default function ThemesIndexPage() {
  const themes = getAllThemes()
  return (
    <Wrap>
      <ListsHero />
      <ListsFilterController>
        <ListsFeaturedRow />
        <ListsAllSection />
      </ListsFilterController>
    </Wrap>
  )
}
```

`<ListsFilterController>` is the client-island that owns the
`data-active-filter` attribute on a wrapper div and passes the
filter value down via context (or just CSS, which is simpler
and what the design uses).

The empty-state path (no themes at all) renders the hero + a
single line: "Themed lists haven't shipped yet — this page
populates as the loop drains the queue." No featured row, no
all-lists section. Honest, no phase references.

## 9. JSON-LD

CollectionPage stays. Add `numberOfItems` (= total themes) and
`hasPart` array with one entry per theme (or first 10 for size
discipline; doc the cap).

## 10. e2e

Update `apps/e2e/tests/themes.spec.ts`:
- Page is bounded (`<Wrap>` parent)
- Hero renders the three stats with non-zero counts (using
  fixtures)
- Filter bar has 5 chips
- Featured row renders 0-3 cards (assert <=3, none if no
  featured)
- All-lists section renders ≥1 group when themes exist
- Each list-row has `data-slug` matching a known theme
- Filter chip click flips `data-active-filter` and hides
  off-filter groups (Playwright can read the attribute +
  computed display)

Update `apps/e2e/src/fixtures/page-reads.ts` for `/themes` —
new expected H1, hero stats data-testid, chip count.

## 11. Verify + commit + push

```
pnpm verify
git add -A
git commit -m "feat: phase 19g — lists overview to spec"
git push origin main
pnpm deploy:check
```

Tick `[x]` for 19g.

## 12. Decisions log

- **Server-static + CSS-toggle filter** instead of URL params or
  full client-side rendering — preserves SEO, ships zero JS for
  the no-filter view, and the chip islands stay tiny.
- **`<ListRow>` over reusing `<ListTile>`** — they're different
  compositions (row is denser, has the bullet stack + meta
  column); reusing would force responsive contortions.
- **Editorial group order, not alphabetical** — tone first,
  craft, era, single-show pantheons last. Per the design.
- **Featured row gracefully shrinks** when fewer than 3
  featured exist — don't pad with non-featured to fill three
  slots.

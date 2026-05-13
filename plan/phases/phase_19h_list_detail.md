# Phase 19h — List detail page to spec

> **Context.** Rebuild `/themes/[theme]` against
> `design/Pantheon · Best Premieres.html`. The new detail
> page is a bounded (max-width 1100px) editorial reading
> surface with a tall hero (crumb + h1 + tagline + meta strip
> + tools), a ranked entry stack with per-entry show-bullet +
> title + blurb, and an adjacent-lists section for
> cross-navigation. Depends on **phase 19f** (theme schema
> refresh) for `tagline`, `curator`, `last_revised`,
> entry-level `title` + `season_label`, and `related`.

## 1. Route + layout

- Path stays `/themes/[theme]`.
- Bounded route (uses `<Wrap>` with the design's tighter
  `max-width: 1100px` for prose pages — see §3 below for the
  override pattern).
- Neutral Pantheon chrome — not tinted. A themed list is
  cross-canon by default; tinting would imply a single-show
  identity. The per-show bullets carry the show-palette
  pinpricks instead.

## 2. Sections, in order

1. **Hero** (`<ListDetailHero>`) — crumb, title, tagline, meta
   strip, tools
2. **Entries** (`<ListEntryStack>`) — section head + ranked
   stack
3. **Adjacent** (`<AdjacentLists>`) — related lists pair
4. Footer (from route-group layout)

## 3. Width override — `<ListShell>`

The bounded routes use `<Wrap>` at 1240px (see 19b). The list
detail page uses 1100px. Two clean options:

A. **Prop on `<Wrap>`** — extend `<Wrap>` to accept
   `width?: 'default' | 'narrow'`, where `narrow` caps at
   1100px. Adds one prop to one component.
B. **Override locally** — use `style={{ maxWidth: 1100 }}` on a
   wrapper inside `<Wrap>`. Loses the consistency.

Pick A. Add to `<Wrap>`:
```tsx
type WrapProps = {
  width?: 'default' | 'narrow'   // 1240 | 1100
  children: React.ReactNode
}
```
CSS:
```css
.wrap { max-width: 1240px; }
.wrap.narrow { max-width: 1100px; }
```
Tests: render with both widths, assert max-width via class.

## 4. `<ListDetailHero>` — `src/components/lists/ListDetailHero.tsx`

Reference: design lines 172-214.

Structure:

```
┌────────────────────────────────────────────┐
│ [●●●]  LISTS / Best premieres ever         │   crumb: bullets + mono uppercase
│                                            │
│   Best premieres ever.                     │   serif 500 88px
│                                            │
│   The cold opens, the casting reveals,     │   serif italic 22px
│   the first hours…                         │   ink-1 with <b> emphasis
│                                            │
│   ┌────────┬────────┬────────┬────────┐    │
│   │Entries │Spans   │Curator │Revised │    │   4-col meta strip
│   │24 eps  │3 shows │M.Reyes │this wk │    │
│   └────────┴────────┴────────┴────────┘    │
│                                            │
│ [Save] [Share] [Suggest]  [● No spoilers] │   tools row
└────────────────────────────────────────────┘
```

### Crumb (`.crumb`)
- bullet-stack: one `<Bullet size={9}>` per show in the theme
  (use `getShowsForTheme(theme)`)
- `<Link href="/themes">Lists</Link>` (mono 11px uppercase,
  ink-3, hover ink-1)
- separator " / " (ink-3 @ 40% opacity)
- `<span class="current">{theme.title}</span>` (ink-1)

### Title (`<h1 class="list-title">`)
- serif 500 88px desktop / 56px tablet / 40px mobile
- ink-0
- text-wrap balance
- Content: `{theme.title}`

### Tagline (`.list-blurb`)
- serif italic 22px / 17px mobile
- ink-1
- max-width 680px
- Allow one `<b>` emphasis span (curator-written, rendered as
  `font-style: normal; font-weight: 500; color: var(--ink-0)`)
- Content: `{theme.tagline}` — render as HTML safely (we trust
  the curator). Use `dangerouslySetInnerHTML` ONLY for the
  inner span, with the Zod schema enforcing the field as a
  string. Curator-written content runs through validation; no
  remote input.

Actually safer path: define a tiny parser that accepts
`/^([^<]*)<b>([^<]*)<\/b>([^<]*)$/` and emits 3 React spans.
Anything richer is rejected at lint time.

### Meta strip (`.list-meta`)
- 4-column grid, 1px borders, radius 8px
- `<MetaCell>` × 4:
  - Entries: "{theme.entries.length} {plural('entry','entries')}"
  - Spans: "{getShowsForTheme(theme).length} {plural('show','shows')}"
  - Curated by: `{theme.curator}`
  - Last revised: `{formatRelativeRevised(theme.last_revised)}`
    — "this week" if within 7 days, "this month" within 30,
    else "{YYYY-MM}". Helper: `src/lib/dates/relativeRevised.ts`.
- Mobile collapses to 2×2 (CSS already in design)

### Tools row (`.list-tools`)
- Left: three `<button class="tool-btn">`: "Save list", "Share",
  "Suggest an entry"
- Right: shield badge — `<span class="tool-btn shield">●No spoilers · reviewed</span>`
- For 19h all three buttons are presentational stubs (no auth
  wiring yet). Each has a `data-testid` and an `aria-label`.
  Clicking "Save list" without auth toggles a local "saved"
  state in `localStorage.pantheon_saved_lists`. "Share" copies
  the page URL to clipboard. "Suggest an entry" links to
  `mailto:editors@pantheon.app?subject=Suggest entry: {title}`
  for now — the real form is a separate phase candidate.

Unit tests:
- Crumb renders bullets + Lists link + theme title
- Title renders the theme title
- Tagline parses `<b>` emphasis correctly
- Meta strip renders all 4 cells with computed values
- Save button toggles localStorage on click
- Share button calls navigator.clipboard.writeText with the
  URL (mock clipboard)
- Shield is decorative (no click handler)

## 5. `<ListEntryStack>` — `src/components/lists/ListEntryStack.tsx`

Reference: design lines 217-223 + lines 313-324 (the render).

Section head:
- h2 "The {N}, in order." (or "The {N} entries, in order." if N
  feels grammatically odd) — serif 500 28px ink-0
- right meta: "Ranked · Editor's Canon" (mono 11px uppercase ink-3)

Stack container:
- flex column, border 1px line, radius 8px, overflow hidden,
  bg paper-1
- Each entry is an `<a>` (anchors to the season page).

Each `<ListEntryRow>`:
- Grid: `72px auto 1fr auto`, gap 24px, padding 24px 28px
- Border-bottom: 1px line-soft, last-child no border
- Hover: bg paper-2, cursor pointer, arrow color shifts to
  primary

Cells:
1. **Rank** (`.entry-rank`) — mono 500 26px primary-gold,
   content `#{NN}` zero-padded
2. **Show bullet** (`.entry-bullet`) — `<Bullet size={14}>` in
   the show's primary color (lookup the show's palette via the
   content loader)
3. **Body** (`.entry-body`):
   - `.entry-meta-line` — mono 500 11px uppercase 0.06em:
     `<span class="show">{ShowName}</span> · <span>{season_label}</span>`
   - `.entry-title` — serif 500 22px ink-0
   - `.entry-blurb` — serif italic 15px ink-2
4. **Arrow** (`.entry-arrow`) — `→` ink-3 (mobile hides)

The link target: `/shows/{entry.show}/season/{entry.season}`.

Show name lookup: `getShow(entry.show)?.name ?? entry.show`.
Show palette lookup: `getShow(entry.show)?.palette.primary`.
Both already exported by `src/content/loaders.ts`.

Unit tests:
- Renders one row per entry, ordered by `rank` ascending
- Rank zero-padded to 2 digits
- Show bullet color matches the show's palette primary
- Show name comes from the loader (fallback to slug if
  unknown)
- season_label override is honored when present, else falls
  back to "S{NN}" or "S{NN} · {season_title}" if season exists
- Arrow hidden on mobile (assert via CSS class or computed
  display at 375px — Playwright covers this in e2e)

## 6. `<AdjacentLists>` — `src/components/lists/AdjacentLists.tsx`

Reference: design lines 226-240.

- `.adj-head` — mono uppercase ink-3 "More lists in this vein"
- `.adj-grid` — 2-column 1px gap, border + radius
- Each `<AdjLink>`:
  - `.adj-tag` — primary-gold mono uppercase "↩ similar craft list"
    on left, "cross-canon list ↪" on right (or category-derived
    label)
  - `.adj-title` — serif 500 22px ink-0
  - `.adj-blurb` — serif italic 14px ink-2 (uses `theme.description`)

Data: `getRelatedThemes(theme, 2)` from 19f. If <2 related,
fall back to "any other theme in the same category" sorted by
`last_revised` desc. If still empty (only one theme in the
category), hide the section.

Tag label rules:
- Both themes same category → "↩ similar {category} list" /
  "{category} list ↪"
- Cross-category → "↩ cross-canon list" / "cross-canon list ↪"

Unit tests:
- Renders 2 links when 2 related themes exist
- Renders 0 links and the whole section hides when no related
- Fallback to same-category list when `theme.related` is empty
- Tag labels match the category-pair logic

## 7. Page composition

`src/app/(default)/themes/[theme]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllThemes, getTheme } from '@/content'
import { Wrap } from '@/components/chrome/Wrap'
import { ListDetailHero } from '@/components/lists/ListDetailHero'
import { ListEntryStack } from '@/components/lists/ListEntryStack'
import { AdjacentLists } from '@/components/lists/AdjacentLists'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

type Params = { theme: string }

export function generateStaticParams(): Params[] {
  return getAllThemes().map((t) => ({ theme: t.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const theme = getTheme(params.theme)
  if (!theme) return buildMetadata({ title: 'List', description: '', path: `/themes/${params.theme}`, noIndex: true })
  return buildMetadata({
    title: theme.title,
    description: theme.description,
    path: `/themes/${theme.slug}`,
  })
}

export default function ThemePage({ params }: { params: Params }) {
  const theme = getTheme(params.theme)
  if (!theme) notFound()

  const ld = buildJsonLd({
    type: 'ItemList',
    name: theme.title,
    description: theme.description,
    path: `/themes/${theme.slug}`,
    author: theme.curator,
    dateModified: theme.last_revised,
    items: theme.entries.map((entry) => ({
      position: entry.rank,
      name: `${entry.show} S${entry.season}: ${entry.title}`,
      path: `/shows/${entry.show}/season/${entry.season}`,
      description: entry.blurb,
    })),
  })

  return (
    <Wrap width="narrow">
      <script {...jsonLdScriptProps({ id: 'ld-theme', data: ld })} />
      <ListDetailHero theme={theme} />
      <ListEntryStack theme={theme} />
      <AdjacentLists theme={theme} />
    </Wrap>
  )
}
```

## 8. `<ListsCard>` adjacent-card content reuse

The `<AdjLink>` component is identical in structure to a list
overview row's body, just without the bullets + meta column.
**Don't share the component** — different visual composition
(adj-tag is unique). Two small components beat one over-shaped
one (per `agents.md` §5a "5 small files with clear names over
1 dense file").

## 9. CSS — extend `src/styles/lists.css`

Add the detail-page rules from the design:
- `.list-title`, `.list-blurb` (+ `b` emphasis style)
- `.list-meta` (grid + cells), `.meta-key`, `.meta-val`
- `.list-tools`, `.tool-btn` (+ `.shield` variant)
- `.entries-head`, `.entry-stack`, `.entry-row`, `.entry-rank`,
  `.entry-bullet`, `.entry-meta-line`, `.entry-title`,
  `.entry-blurb`, `.entry-arrow`
- `.adj-grid`, `.adj-link`, `.adj-next`, `.adj-tag`,
  `.adj-title`, `.adj-blurb`

All references against `var(--color-*)` for theme-swap fidelity
(per the 4b2e9c4 lesson).

## 10. JSON-LD additions

`ItemList` already supports `author` (set from `curator`) and
`dateModified` (set from `last_revised`). Add a per-entry
`url` (already present) and `position` (already present). No
schema.org additions; the richer fields enable better
search-result rendering.

## 11. e2e

New tests in `apps/e2e/tests/themes.spec.ts` (or split into
`themes-detail.spec.ts` if the file is getting large):

- Each themed list page renders the new hero (crumb / title /
  tagline / meta strip / tools)
- The bullet stack in the crumb has one bullet per show in the
  theme's entries
- The meta strip shows 4 cells with non-empty values
- "Save list" button toggles `data-saved` after click
- Every entry row links to `/shows/{show}/season/{n}`
- Entry rows are sorted by rank ascending
- "More lists in this vein" renders 0-2 links; if 0, the
  section is absent

Update `apps/e2e/src/fixtures/page-reads.ts` accordingly.

## 12. Accessibility floor

- The crumb is a `<nav aria-label="Breadcrumb">` with an `<ol>`
  inside (the visual " / " is decorative; screen readers use
  the list structure).
- The shield badge has `aria-label="No spoilers — every entry
  is reviewed"`.
- The "Save list" button uses `aria-pressed` to reflect saved
  state.
- Entries are an `<ol>` with `<li>` per row, anchored to
  season pages.
- Hit targets: every clickable row is ≥ 44px tall (entries are
  ~80px; passes).

## 13. Verify + commit + push

```
pnpm verify
git add -A
git commit -m "feat: phase 19h — list detail page to spec"
git push origin main
pnpm deploy:check
```

Tick `[x]` for 19h.

## 14. Decisions log

- **Save/Share/Suggest are local-only stubs** — full auth +
  persistence is out of scope. Save uses localStorage; Share
  uses the Web Share API with a clipboard fallback; Suggest is
  a mailto link. Real implementations are individual phase
  candidates.
- **Narrow wrap (1100px) is an opt-in `<Wrap width>` prop**,
  not a new component, to preserve the chrome wrapper as the
  single source of truth.
- **Adjacent section gracefully hides** when no related
  themes exist — better empty state than 2 placeholder cards.
- **Entry-row links go straight to the season page**, not back
  through the show home. The list is a curatorial path; the
  season page is the editorial destination.
- **`<b>` emphasis parsing** in the tagline is regex-bounded
  (one `<b>…</b>` span max). Anything richer is rejected at
  curator-time by the schema's regex match (codify in 19f if
  not already).

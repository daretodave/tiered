# Phase 19f — Themed-list schema refresh + curator updates

> **Context.** The new design — `design/Pantheon · Lists.html`
> (overview) and `design/Pantheon · Best Premieres.html`
> (detail) — turns the themed-list system from a flat
> two-field model (`title + description + flat entries[]`)
> into a richer editorial product with categories, featured
> tags, curator bylines, revision dates, entry-level titles,
> and adjacent-list cross-links. **19f lands the schema and
> the curator guidance**; 19g and 19h then rebuild the pages
> against the new shape.
>
> This phase touches **content/, schema, loaders, and the
> `content-curator` agent** — not pages. The verify gate stays
> green because page rebuilds in 19g/h consume the new fields
> through the loader API.
>
> Order: 19f → 19g → 19h. 19g and 19h can ship in either
> order after 19f, but the schema is the blocker for both.

## 1. Theme frontmatter — the new shape

Replace `src/content/schemas.ts` `themeFrontmatterSchema` with:

```ts
export const themeCategorySchema = z.enum([
  'tone',     // mood / editorial slant lists
  'craft',    // production / casting / direction lists
  'era',      // bounded time-range lists
  'single',   // single-show pantheons (Borneo lineage, Snatch Game, …)
])

export type ThemeCategory = z.infer<typeof themeCategorySchema>

export const themeStatusSchema = z.enum([
  'growing',     // active list, expects new entries
  'stable',      // editor considers it complete; minor edits only
  'updated',     // recently revised
  'started',     // launched but few entries yet
])

export const themeEntrySchema = z.object({
  show:        slug,
  season:      z.number().int().positive(),
  rank:        z.number().int().positive(),
  /**
   * Short editorial phrase, serif-headline-sized in the detail
   * page. Distinct from the season's canonical title — this is the
   * curator's framing of WHY this entry is on this list. Spoiler-
   * safe. Required for every entry.
   * Examples: "Sixteen Americans, no rulebook.", "The runway-as-
   * thesis episode.", "Vets vs. rookies, no preamble."
   */
  title:       z.string().min(1).max(140),
  /**
   * The longer italic paragraph below the title. Past tense or
   * present tense, never future. Never names a winner / finalist /
   * eliminated player. 1-3 sentences, ≤280 chars (renders in serif
   * italic 15px on desktop).
   */
  blurb:       z.string().min(1).max(280),
  /**
   * Optional override for the displayed season label. If absent,
   * the detail page renders "S{NN} · {season.title}" derived from
   * content. Use when the curator wants a non-standard format like
   * "S06 premiere" or "London anniversary".
   */
  season_label: z.string().min(1).max(60).optional(),
})

export const themeFrontmatterSchema = z.object({
  slug,
  title:        z.string().min(1).max(80),
  /**
   * One-line description for the overview list-row. The detail
   * page's bigger pull-quote (b-emphasized) is `tagline` below.
   * 60-160 chars renders well.
   */
  description:  z.string().min(1).max(280),
  /**
   * Detail-page pull. Serif italic 22px with one optional `<b>`
   * emphasis span. 1-2 sentences. Same spoiler discipline as
   * description.
   */
  tagline:      z.string().min(1).max(360),
  /**
   * Filter-chip bucket on the overview. Required.
   */
  category:     themeCategorySchema,
  /**
   * Editorial sentiment for the list as a whole. Tints the small
   * dot beside the list on the home-page Themed-lists rail
   * (`<ListTile>`). Defaults to `hold` (steady editorial — the
   * most common state).
   */
  sentiment:    z.enum([
                  'warm-up', 'warm-down', 'neutral',
                  'hold', 'verdict', 'consensus',
                ]).default('hold'),
  /**
   * Posture of the list — drives the "updated this week" /
   * "started 2024" / "stable list" sub-line in the overview row.
   */
  status:       themeStatusSchema.default('stable'),
  /**
   * Editor byline. Free string for now (no editor registry yet).
   * Example: "M. Reyes", "Pantheon Editors".
   */
  curator:      z.string().min(1).max(80).default('Pantheon Editors'),
  /**
   * Last revised date, ISO YYYY-MM-DD. The detail page renders a
   * human label ("this week" / "this month" / "2026-04") via a
   * helper at read time — the source of truth is the ISO date.
   */
  last_revised: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /**
   * `true` if the list belongs in the overview's "Featured this
   * month" row. The page surfaces the first 3 featured lists,
   * `big` card first. Default false.
   */
  featured:     z.boolean().default(false),
  /**
   * Slugs of other themes for the detail page's "More lists in
   * this vein" pair. 0-4 entries; the page renders up to 2.
   */
  related:      z.array(slug).max(4).default([]),
  /**
   * Optional era range for `category: era` lists. Two ISO years,
   * inclusive. Required when category=era and used in the overview
   * label ("The 2000s peak: 2003–2010").
   */
  era_range:    z.tuple([
                  z.number().int().min(1900).max(2100),
                  z.number().int().min(1900).max(2100),
                ]).optional(),
  /**
   * Entries — capacity bumped from 15 to 30 (design shows 24+).
   */
  entries:      z.array(themeEntrySchema).min(1).max(30),
})
  .superRefine((data, ctx) => {
    if (data.category === 'era' && !data.era_range) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['era_range'],
        message: 'era_range is required when category=era',
      })
    }
  })
```

Drop nothing. `description` stays — used by the overview row and
JSON-LD; new `tagline` is the detail-page pull (longer and bolder).

## 2. Loader API — new helpers

Add to `src/content/loaders.ts` (or a sibling `src/lib/themes/`):

```ts
// Already exists in some form; ensure these signatures hold.
export function getAllThemes(): Theme[]
export function getTheme(slug: string): Theme | null

// NEW
/**
 * The themes shown in the overview's "Featured this month" row.
 * First 3 themes where `featured === true`, sorted alphabetically
 * by slug (deterministic — a future curated_order field can
 * replace this).
 */
export function getFeaturedThemes(limit = 3): Theme[]

/**
 * Group themes by category for the overview "All lists" section.
 * Returns a record keyed by category with each value being themes
 * sorted by last_revised desc.
 */
export function getThemesByCategory(): Record<ThemeCategory, Theme[]>

/**
 * The list of shows that appear in this theme's entries, ordered
 * by first appearance. Used for the per-list bullet stack in the
 * overview row and detail crumb.
 */
export function getShowsForTheme(theme: Theme): string[]

/**
 * Resolve `theme.related` slugs to Theme objects, dropping any
 * unknown slugs silently. Returns up to `limit` themes (default 2).
 */
export function getRelatedThemes(theme: Theme, limit = 2): Theme[]

/**
 * Aggregate stats for the overview hero. Counts come from the
 * resolved theme set — no caching beyond Next's build cache.
 */
export type ThemeStats = {
  total: number              // # of themes
  totalEntries: number       // sum of theme.entries.length
  showsCovered: number       // # of unique shows referenced
  lastIndexRevision: string  // ISO date of newest theme.last_revised
}
export function getThemeStats(): ThemeStats
```

Each helper ships a colocated `__tests__` (per `agents.md §5a`):
- `getFeaturedThemes` — capped at limit, only `featured=true`.
- `getThemesByCategory` — every category key present (empty array OK).
- `getShowsForTheme` — order-of-first-appearance, no duplicates.
- `getRelatedThemes` — silently drops unknown slugs.
- `getThemeStats` — correct totals on a fixture.

## 3. Migrate existing themes — fill the new fields

The two existing themes (`content/themes/firsts.md` and
`content/themes/survivor-pillars.md`) need backfill. Use
`content-curator` to write the new fields. Approximate target:

`content/themes/firsts.md`:
```yaml
---
slug: firsts
title: "Firsts that hold up"
description: "Reality competitions get rebooted constantly. These are the season-zeros and resets that earned their reputation."
tagline: "The first hours that taught us what a season would be — and the resets that taught us again. <b>Spoiler-safe by definition</b> — there's nothing to spoil in episode one."
category: tone
sentiment: hold
status: stable
curator: "Pantheon Editors"
last_revised: 2026-05-01
featured: false
related: [survivor-pillars]
entries:
  - show: survivor
    season: 1
    rank: 1
    title: "Sixteen Americans, no rulebook."
    blurb: "The reality competition that taught every reality competition…"
    season_label: "S01 · Borneo"
  - show: survivor
    season: 41
    rank: 2
    title: "Season zero for the new era."
    blurb: "Functionally a season one for the post-pandemic show…"
    season_label: "S41 · Reboot"
---
```

`content/themes/survivor-pillars.md`:
```yaml
---
slug: survivor-pillars
title: "Survivor: the load-bearing seasons"
description: "Four seasons that define the show's eras — the original experiment, the tactical era's apex, the post-pandemic reset, and the steady-state new normal."
tagline: "Four seasons doing the work the rest stand on. <b>One per era, ranked by the weight they carry</b>."
category: single
sentiment: hold
status: stable
curator: "Pantheon Editors"
last_revised: 2026-04-15
featured: false
related: [firsts]
entries:
  - show: survivor
    season: 1
    rank: 1
    title: "The format inventing itself on camera."
    blurb: "Sixteen strangers on a Malaysian beach, a host still finding his cadence, and a structure rough enough that you can watch the show being built in real time."
    season_label: "S01 · Borneo"
  # … the existing 3 more, with `title` lifted from the blurb's
  #   first phrase (curator's call)
---
```

The migration is content-curator's job — the brief calls out
that `title` per entry is a new required field and `tagline`
is a new required field at the theme level.

## 4. `content-curator` agent — update the canonical theme spec

Edit `.claude/agents/content-curator.md`. The current "Frontmatter
for a theme" example reflects the old schema; replace with the new
one (full field list, including category, sentiment, status,
curator, last_revised, featured, related, tagline, and the new
entry-level title + season_label).

Also add a **voice + spoiler discipline** section specific to lists:
- The list's `tagline` is the editorial pull — one `<b>` emphasis
  span allowed, no exclamation points.
- Per-entry `title` is a single phrase or short sentence (max ~10
  words). Past or present tense, never future. Never names a
  winner, eliminated player, or finalist.
- Per-entry `blurb` is 1-3 sentences, max 280 chars. Same spoiler
  discipline as season blurbs (`agents.md` §7).

## 5. `ship-content` skill — Rule 3 update

In `skills/ship-content.md`, the Rule 3 themed-list dispatch
currently produces "10-entry ordered list with cross-show
entries." Tighten to "**a themed list at the new schema** —
title, description, tagline, category (one of tone / craft /
era / single), sentiment, status, curator byline, last_revised
ISO, featured boolean (default false), related (0-2 slugs), and
10-24 entries each with title + blurb + season_label."

Add a "Tagging discipline" subsection: every theme MUST carry
`category` and `last_revised`. Without them the overview filter
chips and the index-last-revised stat break. The validate script
should fail closed if these are missing — which the Zod schema
above guarantees.

## 6. `getAllThemes` callsites — non-breaking adapters

The new optional fields (era_range) and new required fields
(category, last_revised, tagline, sentiment-with-default) are all
either defaulted or backfilled in §3. The existing callers
(`<FeaturedThemes>`, `/themes` page, `/themes/[theme]` page,
`HomeListGrid`, search index in `src/lib/search.ts`) need no
code changes — they read existing fields. 19g and 19h consume
the new fields.

Exception: `src/components/home/ListTile.tsx` currently uses
`var(--s-hold)` hardcoded as the sentiment dot color. After this
phase, it should read `theme.sentiment` and pick the matching
sentiment token. Wire that change in 19f if trivial (1-line
prop pass-through); otherwise defer to 19g's polish pass.

## 7. JSON-LD updates

`/themes/[theme]` JSON-LD currently emits ItemList. Keep the
shape, but also surface `author` (from `curator`) and
`dateModified` (from `last_revised`) on the ItemList node.
Phase 19h re-uses this when rebuilding the page, but the loader
already exposes the fields after 19f.

## 8. Tests

Unit tests (colocated `__tests__`):
- `schemas.test.ts` — parsing the new shape, rejecting invalid
  category, rejecting missing era_range when category=era,
  rejecting missing entry title, default behavior for sentiment +
  status + featured + related.
- New loader helpers in `src/content/__tests__/loaders.test.ts`
  (or new files) — see §2.

Content validate script (`pnpm content:check` →
`scripts/content-check.ts`) — should auto-pass once both existing
themes are migrated, because the Zod schema is the single source
of truth. Run as part of `pnpm verify`.

No e2e contributions in 19f — no URL changes, no UI changes.
19g and 19h add the page-reads + smoke contributions.

## 9. Verify + commit + push

```
pnpm verify
git add -A
git commit -m "feat: phase 19f — themed-list schema refresh + curator updates"
git push origin main
pnpm deploy:check
```

Tick `[x]` for 19f.

## 10. Decisions log

Document in commit body:
- Why we kept the `/themes` URL instead of renaming to `/lists`
  (URL contract in `bearings.md` is locked; a rename is a v2
  decision and would invalidate sitemap entries + external
  backlinks).
- Why entry capacity moves from 15 → 30 (design shows 24+;
  giving headroom).
- Why `tagline` is a separate field from `description`
  (overview row needs the short version; detail-page hero needs
  the pull-quote version; conflating them costs typography).
- Why `category` is an enum, not free-form (filter chips need a
  closed set; new categories require a schema bump + curator
  review).

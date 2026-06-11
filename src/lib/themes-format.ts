import type { Show, Theme, ThemeStatus } from '@/content'
import { canonRevisedLabelFromIso } from '@/lib/canon/last-revised'

export function formatRevisedYear(iso: string): string {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})/)
  return m?.[1] ?? iso
}

function dayDiff(fromIso: string, today: Date): number {
  const t = new Date(`${fromIso}T00:00:00Z`).getTime()
  const n = today.getTime()
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY
  return Math.floor((n - t) / 86_400_000)
}

export function formatRevisedAgo(iso: string, today: Date = new Date()): string {
  const diff = dayDiff(iso, today)
  if (diff <= 7) return 'this week'
  if (diff <= 31) return 'this month'
  return 'this year'
}

// List-detail meta strip: calendar "Month YYYY" matching the home
// `CANON REVISED` block, the show-page `CANON REVISED` stat, and the
// /shows hero `SHOWS REVISED` stat (sibling on /themes: `LISTS REVISED`).
// Relative
// stamps ("this week") rot silently on a static site — /critique pass 12
// flagged the chrome-consistency drift; the canon helper already renders
// the editorial form for every other revised-stamp surface.
export function formatRevisedRelative(iso: string): string {
  return canonRevisedLabelFromIso(iso) ?? ''
}

export function formatThemeStatus(
  status: ThemeStatus,
  lastRevised: string,
  today: Date = new Date(),
): string {
  switch (status) {
    case 'growing':
      return 'growing'
    case 'stable':
      return 'stable list'
    case 'updated':
      return `updated ${formatRevisedAgo(lastRevised, today)}`
    case 'started':
      return `started ${formatRevisedYear(lastRevised)}`
  }
}

// `structure` chip was split out of `tone` at critique pass-31 — see
// the same-named rationale on `themeCategorySchema` in
// `src/content/schemas.ts`. Editorial group order: sentiment readings
// (tone) → format/structural cuts (structure) → craft excellence
// (craft) → chronological span (era) → single-show carve-out.
export type FilterKey =
  | 'all'
  | 'tone'
  | 'structure'
  | 'craft'
  | 'era'
  | 'single'

export const FILTER_KEYS: readonly FilterKey[] = [
  'all',
  'tone',
  'structure',
  'craft',
  'era',
  'single',
] as const

export const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'All',
  tone: 'By tone',
  structure: 'By structure',
  craft: 'By craft',
  era: 'By era',
  single: 'Single-show',
}

export const GROUP_HEAD_LABELS: Record<Exclude<FilterKey, 'all'>, string> = {
  tone: 'By tone',
  structure: 'By structure',
  craft: 'By craft',
  era: 'By era',
  single: 'Single-show tiers',
}

export const FILTER_MODE_LABELS: Record<FilterKey, string> = {
  all: 'lists',
  tone: 'tone lists',
  structure: 'structure lists',
  craft: 'craft lists',
  era: 'era lists',
  single: 'single-show lists',
}

export function filterModeText(
  filter: FilterKey,
  counts: Record<FilterKey, number>,
): string {
  if (filter === 'all') {
    // The hero lede reads `${stats.total} lists…` (catalog total); the
    // chip's `counts.all` matches it now — post pass-40 #353 the grid
    // covers the whole catalog (featured tiles appear in the rail AND
    // the grid). The `in the index` qualifier names the chip-filterable
    // grid as the navigable surface; pass-25's original concern (chip
    // shadowing the lede when it was a strict subset) is moot here, but
    // the qualifier still earns its keep by distinguishing the chip's
    // grid scope from the rail's spotlight subset.
    return `showing · all ${counts.all} in the index`
  }
  return `showing · ${counts[filter]} ${FILTER_MODE_LABELS[filter]}`
}

export function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? singular : pluralForm
}

export function countShows(theme: Theme): number {
  const seen = new Set<string>()
  for (const e of theme.entries) seen.add(e.show)
  return seen.size
}

// Single source of truth for the catalogue list-meta accounting voice
// (critique pass-40 #355). Home `<HomeListRow>`, /themes featured-rail
// `<FeaturedCard>`, /themes index `<ListRow>`, and /themes/[theme]
// `<ListDetailHero>` all surfaced the same two facts — distinct shows
// covered + entry count — in four different shapes (`CROSS-CANON · 7
// ENTRIES`, `7 ENTRIES / STABLE LIST`, `SPANS / 6 shows`, etc.). A
// reader hopping home → /themes → list-detail read four list-meta
// voices for one fact. Same defect class as the resolved pass-38 #340
// / #342 catalogue-eyebrow drifts. The `shows` parameter is optional —
// when present (the /themes surfaces resolve `Show[]` via
// `getShowsForTheme`), `shows.length` is authoritative; when absent
// (home), the count falls back to `countShows(theme)`. By
// `getShowsForTheme` invariant both yield the same integer.
export type ListMeta = {
  showCount: number
  entryCount: number
}

export function formatListMeta(theme: Theme, shows?: Show[]): ListMeta {
  return {
    showCount: shows ? shows.length : countShows(theme),
    entryCount: theme.entries.length,
  }
}

// First-sentence pull from a theme `description`. Used by
// `<FeaturedCard>` to fall back when `theme.featured_pull` is absent
// (critique pass-46 #397). The featured-rail tile and the
// all-lists index `<ListRow>` previously rendered the same ~35-word
// `description` paragraph; the index keeps the long form, the rail
// renders a short pull. Sentence boundary is the first `. ` (period
// + whitespace) — descriptions whose first sentence ends without
// trailing whitespace (single-sentence forms) fall through and the
// whole string is returned. Trailing punctuation is preserved.
export function firstSentence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^([^.!?]*[.!?])(?:\s|$)/)
  return match?.[1] ? match[1].trim() : trimmed
}

// Featured-rail pull for a theme: prefers the curator-authored
// `featured_pull` field, falls back to the first sentence of
// `description`. Single source of truth so the featured-vs-index
// no-paragraph-echo discipline is enforced everywhere a featured
// tile renders (critique pass-46 #397).
export function featuredPullText(theme: Theme): string {
  return theme.featured_pull ?? firstSentence(theme.description)
}

// Canonical list-meta line — `{N} shows · {M} entries` — the home
// `<HomeListRow>` shape adopted as the catalogue baseline. Renders the
// singular noun at 1 (`1 show · 1 entry`). Use this on every chrome
// surface that announces a list's accounting facts so the four
// catalogue surfaces speak with one voice.
export function formatListMetaLine(theme: Theme, shows?: Show[]): string {
  const { showCount, entryCount } = formatListMeta(theme, shows)
  return `${showCount} ${plural(showCount, 'show', 'shows')} · ${entryCount} ${plural(entryCount, 'entry', 'entries')}`
}

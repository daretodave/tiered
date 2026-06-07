import type { Theme, ThemeStatus } from '@/content'
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
// /shows hero `INDEX REVISED` stat. Relative
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
    // The hero lede reads `${stats.total} lists…` (catalog total — 12 today);
    // the chip's `counts.all` is the index-grid scope (NON-featured rows, 9
    // today). Qualifying with `in the index` keeps `ALL` from silently
    // shadowing the lede's catalog total — critique pass-25.
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

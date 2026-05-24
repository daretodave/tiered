// Shared formatter for the "Canon revised" stat. Same editorial
// "Month YYYY" shape across every surface that prints the recency —
// home hero stat, /shows hero stat, show-page hero stat, and any
// future surfaces. Previously the home and show pages rendered MM /
// YY which a first-time visitor reads as ambiguous machine output
// (May 2026? 5-of-26 revisions? week 5?) — /critique pass 7 caught
// it, bearings voice rule (plain-spoken) prefers the editorial form.
//
// Uses UTC accessors so the formatter is TZ-independent — the home
// passes `new Date()` (build-time `now`) and the show page passes
// the canon's `last_revised` ISO date; both must produce the same
// month/year regardless of the runner's local TZ.

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function formatCanonRevisedLabel(date: Date): string {
  const month = MONTH_NAMES[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${month} ${year}`
}

// ISO `YYYY-MM-DD` → "Month YYYY", or `null` when the input is
// missing or unparseable. Show-page entry point — `canon.last_revised`
// is optional in the canon schema and a malformed value should drop
// the stat rather than render garbage.
export function canonRevisedLabelFromIso(iso: string | undefined): string | null {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return null
  return formatCanonRevisedLabel(d)
}

// Home entry point — the home is `force-static`, so `now` is pinned
// at build. No canon source on the home today; this is intentionally
// a "freshness signal" derived from build time.
export function getCanonRevisedLabel(now: Date = new Date()): string {
  return formatCanonRevisedLabel(now)
}

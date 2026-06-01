// Shared formatter for the "Canon revised" stat. Same editorial
// "Month YYYY" shape across every surface that prints the recency —
// home hero stat, /shows hero stat, show-page hero stat, and any
// future surfaces. Previously the home and show pages rendered MM /
// YY which a first-time visitor reads as ambiguous machine output
// (May 2026? 5-of-26 revisions? week 5?) — /critique pass 7 caught
// it, bearings voice rule (plain-spoken) prefers the editorial form.
//
// Uses UTC accessors so the formatter is TZ-independent — every
// surface passes the canon's `last_revised` ISO date and must
// produce the same month/year regardless of the runner's local TZ.
// (Critique pass-24 #269 retired the previous `getCanonRevisedLabel(now)`
// home entry point that derived its label from build-time `new Date()` —
// the home and show pages disagreed on the 1st of every month.)

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
// missing or unparseable. `canon.last_revised` is optional in the
// canon schema and a malformed value should drop the stat rather
// than render garbage. This is the only entry point — home,
// /shows, show-page, and themed-list surfaces all read the same
// canon-frontmatter source of truth (critique pass-24 #269 closed
// the home/show disagreement that surfaced when the home derived
// its label from build-time `now`).
export function canonRevisedLabelFromIso(iso: string | undefined): string | null {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return null
  return formatCanonRevisedLabel(d)
}

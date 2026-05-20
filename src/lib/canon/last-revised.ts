// Shared formatter for the "Canon revised" stat. Same MM / YY shape
// across every surface that prints the recency — home hero stat,
// show-page hero stat, and any future surfaces (brand footer, etc.).
// Previously the home rendered MM / YY while the show page rendered
// just the year (and the keys disagreed: "Canon revised" vs "Canon
// last revised"); /critique pass 1 caught the divergence on the
// common home → show navigation path.
//
// Uses UTC accessors so the formatter is TZ-independent — the home
// passes `new Date()` (build-time `now`) and the show page passes
// the canon's `last_revised` ISO date; both must produce the same
// month/year regardless of the runner's local TZ.

export function formatCanonRevisedLabel(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear()).slice(-2).padStart(2, '0')
  return `${month} / ${year}`
}

// ISO `YYYY-MM-DD` → MM / YY, or `null` when the input is missing
// or unparseable. Show-page entry point — `canon.last_revised` is
// optional in the canon schema and a malformed value should drop
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

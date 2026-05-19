// Pure logic for the phase-39 finale-detection gate
// (spec.md:294). No filesystem, no process — every function here
// is a deterministic transform so scripts/__tests__ can exercise
// it without temp dirs. The thin CLI wrapper that does the I/O is
// scripts/finale-gate.mjs.

import matter from 'gray-matter'
import { LAUNCH_SHOWS } from './launch-shows.mjs'

const NAME_BY_SLUG = new Map(LAUNCH_SHOWS.map((s) => [s.slug, s.name]))

// The display name for a show slug. Falls back to the slug
// itself for a calendared show that is not (yet) a launch show —
// the gate must never crash on an unknown slug; content-check
// owns rejecting genuinely-unknown slugs.
export function showName(slug) {
  return NAME_BY_SLUG.get(slug) ?? slug
}

// Stable idempotency token. The gate greps the WHOLE AUDIT.md
// (Pending + Done) for this marker; present anywhere → the
// finale has already been filed (or filed-and-shipped) and is
// skipped. It travels with the row from Pending to Done so a
// shipped shift note is never re-filed.
export function auditMarker(show, season) {
  return `finale-shift:${show}:${season}`
}

function isoToday(date = new Date()) {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export { isoToday }

// gray-matter has no standalone YAML parse; wrap the raw file in
// frontmatter fences and read `.data`. Identical engine to the
// TS content layer (src/content/calendar.ts) — no new dep. This
// is intentionally a *lenient* read: the gate trusts content:check
// (a hard verify-gate leg) to have already rejected a malformed
// calendar, so here we only need the rows, not re-validation.
export function parseCalendarYaml(raw) {
  const parsed = matter(`---\n${raw}\n---\n`)
  const data = parsed.data ?? {}
  const finales = Array.isArray(data.finales) ? data.finales : []
  return finales.map((f) => ({
    show: String(f.show),
    season: Number(f.season),
    // js-yaml turns an unquoted YYYY-MM-DD into a Date.
    finale_date:
      f.finale_date instanceof Date
        ? f.finale_date.toISOString().slice(0, 10)
        : String(f.finale_date),
    status: String(f.status),
  }))
}

// A finale is "due" when its air date is strictly before today
// AND no row carrying its marker exists anywhere in AUDIT.md.
// finale_date === today is NOT due (the gate must not fire on
// finale day). String compare is sound for ISO YYYY-MM-DD.
export function dueFinales(entries, today, auditText) {
  return entries.filter((e) => {
    if (!(e.finale_date < today)) return false
    return !auditText.includes(auditMarker(e.show, e.season))
  })
}

// The locked AUDIT row (phase 39 brief — "Empty / loading /
// error states"). The trailing HTML comment is the idempotency
// marker.
export function renderAuditRow(entry) {
  const marker = auditMarker(entry.show, entry.season)
  return (
    `- [ ] [MED] post-finale ranking-shift note owed for ${showName(entry.show)} ` +
    `season ${entry.season} (finale aired ${entry.finale_date}) — write the ` +
    `spoiler-safe shift note and adjust canonical_position if the editorial ` +
    `rationale warrants it (category: content-gaps, source: self, score: 4.5) ` +
    `<!-- ${marker} -->`
  )
}

const PENDING_PLACEHOLDER = '_(empty — all findings addressed)_'

// Insert rows into the `## Pending` block of an AUDIT.md string.
// If the block holds the empty placeholder, the rows replace it;
// otherwise they are appended after the existing pending rows
// (before `## Done`). Pure string transform — returns the new
// document. Idempotency is the caller's job (dueFinales already
// filtered already-filed finales) but a placeholder-vs-append
// decision must never duplicate the placeholder.
export function appendRowsToAudit(auditText, rows) {
  if (rows.length === 0) return auditText
  const block = rows.join('\n')
  const pendingIdx = auditText.indexOf('## Pending')
  if (pendingIdx === -1) {
    throw new Error('AUDIT.md has no "## Pending" section')
  }
  const doneIdx = auditText.indexOf('## Done', pendingIdx)
  const sliceEnd = doneIdx === -1 ? auditText.length : doneIdx
  const head = auditText.slice(0, pendingIdx)
  const pending = auditText.slice(pendingIdx, sliceEnd)
  const tail = auditText.slice(sliceEnd)

  if (pending.includes(PENDING_PLACEHOLDER)) {
    const replaced = pending.replace(
      PENDING_PLACEHOLDER,
      `${block}`,
    )
    return head + replaced + tail
  }

  // Append after existing pending rows: trim the block's
  // trailing whitespace, add the new rows, restore one blank
  // line before `## Done`.
  const trimmed = pending.replace(/\s+$/, '')
  return `${head}${trimmed}\n${block}\n\n${tail}`
}

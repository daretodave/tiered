#!/usr/bin/env node
// scripts/plan/ledger-archive.mjs
//
// spec 53 — moves already-closed (`[x]`) rows out of plan/CRITIQUE.md
// and plan/AUDIT.md into plan/CRITIQUE_ARCHIVE.md / plan/AUDIT_ARCHIVE.md
// once their RESOLVED closing date is ARCHIVE_AFTER_DAYS old or more,
// so the live ledgers stay small enough for a plain Read and for the
// loop's own prompt budget, while git history and the archive files
// both keep the full trail. See plan/53-critique-audit-ledger-archive.md.
//
// Dry-run by default: prints `archived <label>` per row that WOULD
// move, then `archived N` or `clean`. --write performs the move for
// both files in the same pass: each matching row's verbatim text is
// appended to its archive file and removed from the live file.
// Idempotent — a row already moved is gone from the live file, so a
// re-run with no newly-aged rows reports `clean`.
//
//   node scripts/plan/ledger-archive.mjs [--write] [--today YYYY-MM-DD]
//
// Exit 0 on a normal run (dry or written); 64 on a bad --today value.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { sliceRows } from '../lib/plan-rows.mjs'

export const ARCHIVE_AFTER_DAYS = 30

// How far past a row's LAST "RESOLVED" occurrence the closing date
// is allowed to sit. A row can mention the word "RESOLVED" more than
// once — e.g. a later finding referencing "the RESOLVED row above"
// in its own prose, or (per the live plan/AUDIT.md "post-finale
// ranking-shift" row) a closing note reading "RESOLVED this commit
// (66c10e74): ... see CADENCE.md's 2026-10-02 note" where the only
// date in the row is an unrelated cross-reference, not the
// resolution itself. Every genuine closing date already in this
// repo's two live files sits within ~60 characters of its RESOLVED
// marker (`RESOLVED (2026-09-26, ...)`, `RESOLVED 2026-11-01 (local
// session): ...`, `RESOLVED 00160588 (cloud march tick,
// 2026-08-08): ...`). 150 gives headroom without reaching into
// unrelated later prose.
const RESOLVED_WINDOW = 150

const DAY = 86400000
const today = () => new Date().toISOString().slice(0, 10)
const daysBetween = (from, to) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY)

const FILES = [
  { live: 'CRITIQUE.md', archive: 'CRITIQUE_ARCHIVE.md' },
  { live: 'AUDIT.md', archive: 'AUDIT_ARCHIVE.md' },
]

/**
 * The closing date for a closed row's text, or null when none can
 * be found. Looks at the row's LAST "RESOLVED" occurrence (the real
 * closing note is always the final one — an earlier mention in the
 * same row's prose refers to something else) and the first
 * `YYYY-MM-DD` date within RESOLVED_WINDOW characters after it.
 *
 * Returning null (no date found, for any reason — no RESOLVED
 * marker at all, or one with no date nearby, e.g. a bare commit SHA
 * closing note like `RESOLVED 4557353: neither of the flagged
 * candidates...`) is the deliberate safe default: such a row never
 * moves. A false "never archives" self-heals next tick once a human
 * or a future tick adds a date; a false "archived the wrong row"
 * does not.
 */
export function findClosingDate(rowText) {
  const idx = rowText.lastIndexOf('RESOLVED')
  if (idx === -1) return null
  const window = rowText.slice(idx, idx + RESOLVED_WINDOW)
  const m = /\d{4}-\d{2}-\d{2}/.exec(window)
  return m ? m[0] : null
}

/** A short single-line label for a row, for the dry-run/write output. */
export function rowLabel(rowText) {
  const firstLine = rowText.split('\n')[0].trim()
  return firstLine.length > 90 ? `${firstLine.slice(0, 87)}...` : firstLine
}

/**
 * Which of a live file's rows (as returned by sliceRows) are
 * eligible to archive as of `date`: closed (`[x]`), a closing date
 * was found, and that date is `archiveAfterDays` old or more. An
 * open row is never eligible, regardless of any date in its text.
 */
export function eligibleRows(rows, date, archiveAfterDays = ARCHIVE_AFTER_DAYS) {
  return rows.filter((r) => {
    if (!r.closed) return false
    const closing = findClosingDate(r.text)
    if (!closing) return false
    return daysBetween(closing, date) >= archiveAfterDays
  })
}

/**
 * Remove `rows` (sliceRows output, matched by line range) out of
 * `liveText`. A row's `[startLine, endLine)` range already includes
 * any trailing blank separator line sliceRows trimmed out of its
 * `text`, so removal never leaves a gap behind. Idempotent in the
 * sense that it only ever removes the exact ranges given.
 */
export function removeRows(liveText, rows) {
  if (rows.length === 0) return liveText
  const lines = liveText.split('\n')
  const removed = new Array(lines.length).fill(false)
  for (const r of rows) {
    for (let i = r.startLine; i < r.endLine; i++) removed[i] = true
  }
  return lines.filter((_, i) => !removed[i]).join('\n')
}

/**
 * Append `rows`' verbatim text to an archive file's existing
 * content, one blank line between entries, exact original text
 * otherwise untouched (no rewriting).
 */
export function appendToArchive(archiveText, rows) {
  if (rows.length === 0) return archiveText
  const head = archiveText.replace(/\s+$/, '')
  const blocks = rows.map((r) => r.text).join('\n\n')
  return `${head}\n\n${blocks}\n`
}

export function main(argv, { root = process.cwd(), log = console.log, err = console.error } = {}) {
  const at = (flag) => {
    const i = argv.indexOf(flag)
    return i < 0 ? undefined : argv[i + 1]
  }
  const date = at('--today') ?? today()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    err('usage: ledger-archive.mjs [--write] [--today YYYY-MM-DD]')
    return 64
  }
  const write = argv.includes('--write')

  let total = 0
  for (const { live, archive } of FILES) {
    const livePath = path.join(root, 'plan', live)
    if (!fs.existsSync(livePath)) continue
    const liveText = fs.readFileSync(livePath, 'utf8')
    const rows = sliceRows(liveText)
    const eligible = eligibleRows(rows, date)

    for (const r of eligible) log(`archived ${rowLabel(r.text)}`)
    total += eligible.length

    if (write && eligible.length) {
      const archivePath = path.join(root, 'plan', archive)
      const archiveText = fs.existsSync(archivePath) ? fs.readFileSync(archivePath, 'utf8') : ''
      fs.writeFileSync(archivePath, appendToArchive(archiveText, eligible))
      fs.writeFileSync(livePath, removeRows(liveText, eligible))
    }
  }

  log(total > 0 ? `archived ${total}` : 'clean')
  return 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
}

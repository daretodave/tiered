#!/usr/bin/env node
// scripts/finale-gate.mjs
//
// Phase 39 — the finale-detection gate (spec.md:294). Run by the
// autonomous loop in /march and /iterate Step 0 (see
// skills/march.md + skills/iterate.md). Reads content/calendar.yml,
// finds finales whose air date is in the past with no shift note
// filed yet, and appends one `category: content-gaps,
// source: self` row per finale into plan/AUDIT.md's `## Pending`
// block. The next content drain picks the row up.
//
// Idempotent: a finale already represented by its marker anywhere
// in AUDIT.md (Pending OR Done) is skipped, so re-running the gate
// — or running it after a shift note has shipped — never
// double-files. A clean no-op when nothing is due (and when the
// calendar file is absent).
//
// Usage:
//   node scripts/finale-gate.mjs            # apply (write AUDIT.md)
//   node scripts/finale-gate.mjs --dry-run  # report only, no write
//
// Exit 0 always on success (gate is advisory infrastructure, not
// a verify leg); non-zero only on an unexpected I/O error.

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  appendRowsToAudit,
  dueFinales,
  isoToday,
  parseCalendarYaml,
  renderAuditRow,
} from './lib/finale-gate.mjs'

function main(argv = process.argv.slice(2)) {
  const dryRun = argv.includes('--dry-run')
  const root = process.cwd()
  const calendarPath = path.join(root, 'content', 'calendar.yml')
  const auditPath = path.join(root, 'plan', 'AUDIT.md')

  if (!fs.existsSync(calendarPath)) {
    process.stdout.write('finale-gate: ok — no calendar (content/calendar.yml absent)\n')
    return 0
  }

  const entries = parseCalendarYaml(fs.readFileSync(calendarPath, 'utf8'))
  const today = isoToday()

  if (!fs.existsSync(auditPath)) {
    process.stderr.write('finale-gate: plan/AUDIT.md missing — cannot file rows\n')
    return 1
  }
  const auditText = fs.readFileSync(auditPath, 'utf8')
  const due = dueFinales(entries, today, auditText)

  if (due.length === 0) {
    process.stdout.write(
      `finale-gate: ok — ${entries.length} calendar entr${
        entries.length === 1 ? 'y' : 'ies'
      }, 0 due\n`,
    )
    return 0
  }

  const rows = due.map(renderAuditRow)
  if (dryRun) {
    process.stdout.write(
      `finale-gate: ${rows.length} finale(s) due (dry-run, AUDIT.md untouched):\n`,
    )
    for (const r of rows) process.stdout.write(`  ${r}\n`)
    return 0
  }

  const next = appendRowsToAudit(auditText, rows)
  fs.writeFileSync(auditPath, next)
  process.stdout.write(
    `finale-gate: filed ${rows.length} content-gap row(s) into plan/AUDIT.md:\n`,
  )
  for (const d of due) {
    process.stdout.write(`  - ${d.show} season ${d.season} (finale ${d.finale_date})\n`)
  }
  return 0
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main())
}

export { main }

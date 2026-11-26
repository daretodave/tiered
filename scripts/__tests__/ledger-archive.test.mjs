// scripts/plan/ledger-archive.mjs — spec 53 (plan/53-critique-audit-ledger-archive.md).
//
// Fixtures below are short synthetic stand-ins shaped like real rows
// from plan/CRITIQUE.md (`### [...]` heading rows, closed under its
// own `## Done`) and plan/AUDIT.md (top-level `- [...]` bullet rows,
// all under one `## Pending`) — not excerpts of the real files.
//
// The real files' RESOLVED closing notes come in at least four
// shapes (confirmed via `grep -n "RESOLVED" plan/CRITIQUE.md
// plan/AUDIT.md` before writing findClosingDate): `RESOLVED
// (<date>, ...)`, `RESOLVED <date> (...): ...`, `RESOLVED: <date>,
// ...`, and a bare-commit lead-in (`RESOLVED <sha>: ...` or
// `RESOLVED this commit (<sha>): ...`) where the closing date sits
// inside a trailing parenthetical instead of immediately after the
// marker — or, in at least one live row, is entirely absent (no
// date anywhere near RESOLVED at all). The no-date case is a
// deliberate safe default (see findClosingDate's doc comment in
// ../plan/ledger-archive.mjs): such a row never moves.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { sliceRows } from '../lib/plan-rows.mjs'
import {
  ARCHIVE_AFTER_DAYS,
  appendToArchive,
  eligibleRows,
  findClosingDate,
  main,
  removeRows,
  rowLabel,
} from '../plan/ledger-archive.mjs'

const TODAY = '2026-12-01'

// --- findClosingDate ---------------------------------------------------

test('findClosingDate reads a parenthetical-leading date', () => {
  assert.equal(
    findClosingDate(
      '- [x] [HIGH] a — RESOLVED (2026-09-26, cloud march tick, commit abc123): fixed it.',
    ),
    '2026-09-26',
  )
})

test('findClosingDate reads a date immediately after the marker, before a parenthetical', () => {
  assert.equal(
    findClosingDate('- [x] [HIGH] a — RESOLVED 2026-11-01 (local session): fixed it.'),
    '2026-11-01',
  )
})

test('findClosingDate reads a colon-then-date form', () => {
  assert.equal(
    findClosingDate(
      '- [x] [MED] a — RESOLVED: 2026-10-10, cloud march tick, content-gap redirect.',
    ),
    '2026-10-10',
  )
})

test('findClosingDate reads a commit-SHA lead-in with the date inside the trailing parenthetical', () => {
  assert.equal(
    findClosingDate(
      '- [x] [LOW] a — RESOLVED 00160588 (cloud march tick, 2026-08-08): added a flag.',
    ),
    '2026-08-08',
  )
})

test('findClosingDate returns null for a bare-commit close with no date anywhere near RESOLVED', () => {
  const row =
    '- [x] [HIGH] a — RESOLVED 4557353: neither of the flagged candidates was the actual cause, ' +
    'long explanation follows with no date mentioned anywhere in this closing note at all, filed originally 2020-01-01 ' +
    'back when the bug was first reported, far past the window this function is willing to search.'
  assert.equal(findClosingDate(row), null)
})

test('findClosingDate returns null when the row has no RESOLVED marker at all', () => {
  assert.equal(
    findClosingDate(
      '- [x] [LOW] a closed row with a terse close, no closing-note marker used at all, filed 2026-01-01.',
    ),
    null,
  )
})

test('findClosingDate uses the LAST RESOLVED occurrence, ignoring an earlier back-reference', () => {
  const row =
    '- [x] [MED] a — same failure pattern as the RESOLVED row above (line 12): no immediate date here either, ' +
    'but — RESOLVED 2026-10-27: the real fix landed and this is the actual closing date.'
  assert.equal(findClosingDate(row), '2026-10-27')
})

// --- eligibleRows --------------------------------------------------------

test('a closed row older than the cutoff is eligible; a closed row younger stays (A3, A4)', () => {
  const rows = [
    { closed: true, text: 'old — RESOLVED (2026-10-01, cloud march tick): done.' }, // 61 days before TODAY
    { closed: true, text: 'young — RESOLVED (2026-11-15, cloud march tick): done.' }, // 16 days before TODAY
  ]
  const eligible = eligibleRows(rows, TODAY)
  assert.deepEqual(
    eligible.map((r) => r.text),
    [rows[0].text],
  )
})

test('the cutoff is inclusive at exactly ARCHIVE_AFTER_DAYS, exclusive one day short', () => {
  assert.equal(ARCHIVE_AFTER_DAYS, 30)
  const exact = [{ closed: true, text: 'RESOLVED (2026-11-01, tick): done.' }] // exactly 30 days before TODAY
  const short = [{ closed: true, text: 'RESOLVED (2026-11-02, tick): done.' }] // 29 days before TODAY
  assert.equal(eligibleRows(exact, TODAY).length, 1)
  assert.equal(eligibleRows(short, TODAY).length, 0)
})

test('an open row never moves regardless of how old its date looks (A5)', () => {
  const rows = [
    {
      closed: false,
      text: '- [ ] [MED] open — RESOLVED (2020-01-01, tick): looks ancient but is not closed.',
    },
  ]
  assert.deepEqual(eligibleRows(rows, TODAY), [])
})

test('a closed row with no findable date never moves, even if clearly stale otherwise', () => {
  const rows = [
    {
      closed: true,
      text: '- [x] [HIGH] a — RESOLVED 4557353: no date in this closing note at all.',
    },
  ]
  assert.deepEqual(eligibleRows(rows, TODAY), [])
})

// --- sliceRows + eligibleRows together, on shaped fixtures ---------------

const CRITIQUE_FIXTURE = [
  '## Pending',
  '',
  '### [HIGH] [anon] /shows/demo/season/one — a still-open finding',
  '',
  '- pass: 12 (commit abc123)',
  '- evidence: something observed',
  '- source: walk',
  '',
  '## Done',
  '',
  '- [x] [HIGH] an old closed finding — RESOLVED (2026-09-01, cloud march tick, commit aaa111): fixed cleanly, long explanation of the fix with specifics about which file changed and why, confirming the gate stayed green afterward.',
  '- [x] [MED] a freshly closed finding — RESOLVED 2026-11-20 (local session): fixed just now, also with its own explanation of what changed and the verification that followed.',
].join('\n')

const AUDIT_FIXTURE = [
  '## Pending',
  '',
  '<!-- Format:',
  '- [ ] [SEV] <one-line description>',
  '-->',
  '',
  '- [ ] [MED] an open finding that looks old by its own dates but must never move — filed 2020-01-01, still unresolved.',
  '- [x] [LOW] a closed finding with no closing-note marker at all, must never move despite being old — filed 2020-01-01.',
  '- [x] [HIGH] an old closed finding — RESOLVED (2026-09-01, cloud march tick): fixed, with a long trailing explanation of the root cause and the verify gate result that followed this same tick.',
  '- [x] [MED] a freshly closed finding — RESOLVED (2026-11-20, cloud march tick): fixed just now, with its own trailing explanation of the change and the gate result.',
].join('\n')

test('CRITIQUE-shaped fixture: only the old closed row is eligible, open row untouched', () => {
  const rows = sliceRows(CRITIQUE_FIXTURE)
  assert.equal(rows.length, 3)
  const eligible = eligibleRows(rows, TODAY)
  assert.equal(eligible.length, 1)
  assert.match(eligible[0].text, /an old closed finding/)
})

test('AUDIT-shaped fixture: only the old closed row is eligible; open and no-date rows are not', () => {
  const rows = sliceRows(AUDIT_FIXTURE)
  assert.equal(rows.length, 4)
  const eligible = eligibleRows(rows, TODAY)
  assert.equal(eligible.length, 1)
  assert.match(eligible[0].text, /an old closed finding — RESOLVED \(2026-09-01/)
})

test("a moved row's sliced text is byte-identical to its original line range (A3)", () => {
  const rows = sliceRows(CRITIQUE_FIXTURE)
  const closed = rows.filter((r) => r.closed)
  for (const r of closed) {
    const original = CRITIQUE_FIXTURE.split('\n')
      .slice(r.startLine, r.endLine)
      .join('\n')
      .replace(/\n*$/, '')
    assert.equal(r.text, original)
  }
})

// --- removeRows / appendToArchive ----------------------------------------

test('removeRows deletes exactly the given rows and nothing else', () => {
  const rows = sliceRows(CRITIQUE_FIXTURE)
  const toRemove = eligibleRows(rows, TODAY)
  const next = removeRows(CRITIQUE_FIXTURE, toRemove)
  assert.ok(!next.includes('an old closed finding'))
  assert.ok(next.includes('a freshly closed finding'))
  assert.ok(next.includes('a still-open finding'))
})

test('removeRows is a no-op given an empty row list', () => {
  assert.equal(removeRows(CRITIQUE_FIXTURE, []), CRITIQUE_FIXTURE)
})

test('appendToArchive appends verbatim text with one blank line between entries', () => {
  const header = '# Archive\n\n> Append-only: ... Never edited or reordered.\n'
  const rows = [{ text: 'row one text' }, { text: 'row two text' }]
  const out = appendToArchive(header, rows)
  assert.equal(
    out,
    '# Archive\n\n> Append-only: ... Never edited or reordered.\n\nrow one text\n\nrow two text\n',
  )
})

// --- rowLabel --------------------------------------------------------------

test('rowLabel takes the first line, truncated if long', () => {
  assert.equal(rowLabel('- [x] [LOW] a short row\n- body'), '- [x] [LOW] a short row')
  const long = `- [x] [HIGH] ${'x'.repeat(200)}`
  assert.ok(rowLabel(long).endsWith('...'))
  assert.ok(rowLabel(long).length <= 90)
})

// --- main() CLI: dry-run vs --write, both files, idempotency -------------

function makeRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-archive-'))
  fs.mkdirSync(path.join(dir, 'plan'))
  fs.writeFileSync(path.join(dir, 'plan', 'CRITIQUE.md'), CRITIQUE_FIXTURE)
  fs.writeFileSync(path.join(dir, 'plan', 'AUDIT.md'), AUDIT_FIXTURE)
  fs.writeFileSync(
    path.join(dir, 'plan', 'CRITIQUE_ARCHIVE.md'),
    '# Critique archive\n\n> Append-only: ... Never edited or reordered.\n',
  )
  fs.writeFileSync(
    path.join(dir, 'plan', 'AUDIT_ARCHIVE.md'),
    '# Audit archive\n\n> Append-only: ... Never edited or reordered.\n',
  )
  return dir
}

test('dry-run mode prints what would move and leaves both files untouched', () => {
  const root = makeRoot()
  const before = {
    critique: fs.readFileSync(path.join(root, 'plan', 'CRITIQUE.md'), 'utf8'),
    audit: fs.readFileSync(path.join(root, 'plan', 'AUDIT.md'), 'utf8'),
    critiqueArchive: fs.readFileSync(path.join(root, 'plan', 'CRITIQUE_ARCHIVE.md'), 'utf8'),
    auditArchive: fs.readFileSync(path.join(root, 'plan', 'AUDIT_ARCHIVE.md'), 'utf8'),
  }
  const lines = []
  const code = main(['--today', TODAY], { root, log: (l) => lines.push(l) })
  assert.equal(code, 0)
  assert.ok(lines.some((l) => l.startsWith('archived ') && l.includes('old closed finding')))
  assert.equal(lines.at(-1), 'archived 2')
  assert.equal(fs.readFileSync(path.join(root, 'plan', 'CRITIQUE.md'), 'utf8'), before.critique)
  assert.equal(fs.readFileSync(path.join(root, 'plan', 'AUDIT.md'), 'utf8'), before.audit)
  assert.equal(
    fs.readFileSync(path.join(root, 'plan', 'CRITIQUE_ARCHIVE.md'), 'utf8'),
    before.critiqueArchive,
  )
  assert.equal(
    fs.readFileSync(path.join(root, 'plan', 'AUDIT_ARCHIVE.md'), 'utf8'),
    before.auditArchive,
  )
})

test('--write moves the aged rows out of both live files and into their archives', () => {
  const root = makeRoot()
  const lines = []
  const code = main(['--write', '--today', TODAY], { root, log: (l) => lines.push(l) })
  assert.equal(code, 0)
  assert.equal(lines.at(-1), 'archived 2')

  const critique = fs.readFileSync(path.join(root, 'plan', 'CRITIQUE.md'), 'utf8')
  const audit = fs.readFileSync(path.join(root, 'plan', 'AUDIT.md'), 'utf8')
  const critiqueArchive = fs.readFileSync(path.join(root, 'plan', 'CRITIQUE_ARCHIVE.md'), 'utf8')
  const auditArchive = fs.readFileSync(path.join(root, 'plan', 'AUDIT_ARCHIVE.md'), 'utf8')

  assert.ok(!critique.includes('an old closed finding'))
  assert.ok(critique.includes('a freshly closed finding'))
  assert.ok(critique.includes('a still-open finding'))
  assert.ok(critiqueArchive.includes('an old closed finding'))

  assert.ok(!audit.includes('- [x] [HIGH] an old closed finding'))
  assert.ok(audit.includes('a freshly closed finding'))
  assert.ok(audit.includes('an open finding that looks old'))
  assert.ok(audit.includes('a closed finding with no closing-note marker'))
  assert.ok(auditArchive.includes('an old closed finding'))
})

test('--write is idempotent: a second run against the already-written files reports clean', () => {
  const root = makeRoot()
  main(['--write', '--today', TODAY], { root, log: () => {} })
  const afterFirst = {
    critique: fs.readFileSync(path.join(root, 'plan', 'CRITIQUE.md'), 'utf8'),
    audit: fs.readFileSync(path.join(root, 'plan', 'AUDIT.md'), 'utf8'),
    critiqueArchive: fs.readFileSync(path.join(root, 'plan', 'CRITIQUE_ARCHIVE.md'), 'utf8'),
    auditArchive: fs.readFileSync(path.join(root, 'plan', 'AUDIT_ARCHIVE.md'), 'utf8'),
  }
  const lines = []
  const code = main(['--write', '--today', TODAY], { root, log: (l) => lines.push(l) })
  assert.equal(code, 0)
  assert.equal(lines.at(-1), 'clean')
  assert.equal(fs.readFileSync(path.join(root, 'plan', 'CRITIQUE.md'), 'utf8'), afterFirst.critique)
  assert.equal(fs.readFileSync(path.join(root, 'plan', 'AUDIT.md'), 'utf8'), afterFirst.audit)
  assert.equal(
    fs.readFileSync(path.join(root, 'plan', 'CRITIQUE_ARCHIVE.md'), 'utf8'),
    afterFirst.critiqueArchive,
  )
  assert.equal(
    fs.readFileSync(path.join(root, 'plan', 'AUDIT_ARCHIVE.md'), 'utf8'),
    afterFirst.auditArchive,
  )
})

test('a bad --today value is rejected with exit 64', () => {
  const root = makeRoot()
  const errs = []
  const code = main(['--today', 'not-a-date'], { root, log: () => {}, err: (l) => errs.push(l) })
  assert.equal(code, 64)
  assert.ok(errs.length > 0)
})

test('main defaults --today to the real clock when omitted (smoke only, no date assertion)', () => {
  const root = makeRoot()
  const code = main([], { root, log: () => {} })
  assert.equal(code, 0)
})

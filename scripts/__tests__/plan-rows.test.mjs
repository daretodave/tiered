// scripts/lib/plan-rows.mjs — the pulse's queue counter. plan/AUDIT.md
// keeps `- [ ] [SEV]` bullets while plan/CRITIQUE.md keeps `### [...]`
// headings; before both shapes were read, every digest's AUDIT line
// said 0 pending (DIGEST 2026-10-31).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countRows, pendingSection } from '../lib/plan-rows.mjs'

test('counts open AUDIT-style bullets, skipping addressed and template rows', () => {
  const text = [
    '# AUDIT',
    '## Pending',
    '<!-- Format:',
    '- [ ] [SEV] <one-line description>',
    '-->',
    '- [x] [HIGH] done already',
    '- [ ] [MED] open one',
    '  - issue: #1 (sub-bullet, not a row)',
    '- [needs-user-call] [LOW] open, awaiting a call',
    '- [X] [LOW] done, capital X',
    '## Done',
    '- [ ] [LOW] not pending section',
  ].join('\n')
  assert.equal(countRows(pendingSection(text)), 2)
})

test('still counts CRITIQUE-style headings', () => {
  const text = ['## Pending', '### [HIGH] a', '### [x] [MED] b', '### Pass 12 summary', '### [LOW] c'].join('\n')
  assert.equal(countRows(pendingSection(text)), 2)
})

test('a single-line HTML comment hides its row', () => {
  assert.equal(countRows(['<!-- - [ ] [LOW] hidden -->', '- [ ] [LOW] shown']), 1)
})

test('no Pending heading reads the whole file', () => {
  assert.equal(countRows(pendingSection('- [ ] [LOW] a\n- [ ] [LOW] b')), 2)
})

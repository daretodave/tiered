import assert from 'node:assert/strict'
import test from 'node:test'
import {
  appendRowsToAudit,
  auditMarker,
  dueFinales,
  parseCalendarYaml,
  renderAuditRow,
  showName,
} from '../lib/finale-gate.mjs'

const CAL = `finales:
  - show: survivor
    season: 50
    finale_date: 2026-05-20
    status: scheduled
  - show: survivor
    season: 48
    finale_date: 2025-05-21
    status: aired
  - show: top-chef
    season: 22
    finale_date: 2025-06-12
    status: aired`

test('auditMarker is a stable show:season token', () => {
  assert.equal(auditMarker('survivor', 48), 'finale-shift:survivor:48')
  assert.equal(auditMarker('top-chef', 22), 'finale-shift:top-chef:22')
})

test('showName maps a launch slug to its display name, falls back to slug', () => {
  assert.equal(showName('survivor'), 'Survivor')
  assert.equal(showName('dragrace'), "RuPaul's Drag Race")
  assert.equal(showName('not-a-real-show'), 'not-a-real-show')
})

test('parseCalendarYaml reads rows and coerces the date scalar to ISO', () => {
  const entries = parseCalendarYaml(CAL)
  assert.equal(entries.length, 3)
  assert.deepEqual(entries[1], {
    show: 'survivor',
    season: 48,
    finale_date: '2025-05-21',
    status: 'aired',
  })
})

test('parseCalendarYaml returns [] when finales key is absent', () => {
  assert.deepEqual(parseCalendarYaml('# nothing here\n'), [])
})

test('dueFinales: past + marker absent → due; future → skipped', () => {
  const entries = parseCalendarYaml(CAL)
  const due = dueFinales(entries, '2026-05-19', '## Pending\n_(empty)_\n')
  const seasons = due.map((e) => e.season).sort((a, b) => a - b)
  assert.deepEqual(seasons, [22, 48]) // 50 is future (2026-05-20)
})

test('dueFinales: marker present anywhere (Pending OR Done) → skipped', () => {
  const entries = parseCalendarYaml(CAL)
  const audit = `## Pending\n_(empty)_\n## Done\n- [x] old ${auditMarker(
    'survivor',
    48,
  )} shipped\n`
  const due = dueFinales(entries, '2026-05-19', audit)
  assert.deepEqual(
    due.map((e) => e.season),
    [22],
  )
})

test('dueFinales: finale_date === today is NOT due', () => {
  const entries = [
    { show: 'survivor', season: 48, finale_date: '2026-05-19', status: 'aired' },
  ]
  assert.equal(dueFinales(entries, '2026-05-19', '').length, 0)
})

test('renderAuditRow carries category/source/score and the marker', () => {
  const row = renderAuditRow({
    show: 'top-chef',
    season: 22,
    finale_date: '2025-06-12',
    status: 'aired',
  })
  assert.match(row, /^- \[ \] \[MED\] post-finale ranking-shift note owed for Top Chef season 22/)
  assert.match(row, /finale aired 2025-06-12/)
  assert.match(row, /category: content-gaps, source: self, score: 4\.5/)
  assert.match(row, /<!-- finale-shift:top-chef:22 -->/)
})

test('appendRowsToAudit replaces the empty placeholder', () => {
  const audit = `# AUDIT

## Pending

_(empty — all findings addressed)_

## Done

- [x] something
`
  const rows = [renderAuditRow({ show: 'top-chef', season: 22, finale_date: '2025-06-12', status: 'aired' })]
  const next = appendRowsToAudit(audit, rows)
  assert.ok(!next.includes('_(empty — all findings addressed)_'))
  assert.ok(next.includes('finale-shift:top-chef:22'))
  assert.ok(next.includes('## Done'))
  assert.ok(next.includes('- [x] something'))
})

test('appendRowsToAudit appends after existing pending rows', () => {
  const audit = `# AUDIT

## Pending

- [ ] [HIGH] existing pending thing (category: bug)

## Done

- [x] done thing
`
  const rows = [renderAuditRow({ show: 'survivor', season: 48, finale_date: '2025-05-21', status: 'aired' })]
  const next = appendRowsToAudit(audit, rows)
  assert.ok(next.includes('existing pending thing'))
  assert.ok(next.includes('finale-shift:survivor:48'))
  assert.ok(next.indexOf('existing pending thing') < next.indexOf('finale-shift:survivor:48'))
  assert.ok(next.indexOf('finale-shift:survivor:48') < next.indexOf('## Done'))
})

test('appendRowsToAudit is a no-op for zero rows', () => {
  const audit = '## Pending\n_(empty)_\n## Done\n'
  assert.equal(appendRowsToAudit(audit, []), audit)
})

test('full idempotency: second run files nothing new', () => {
  const entries = parseCalendarYaml(CAL)
  let audit = `# AUDIT

## Pending

_(empty — all findings addressed)_

## Done
`
  let due = dueFinales(entries, '2026-05-19', audit)
  audit = appendRowsToAudit(audit, due.map(renderAuditRow))
  // Second pass against the now-updated AUDIT.
  due = dueFinales(entries, '2026-05-19', audit)
  assert.equal(due.length, 0)
})

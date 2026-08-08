// scripts/__tests__/loop-issue.test.mjs
//
// Unit tests for scripts/loop-issue.mjs. Uses Node's built-in
// node:test runner — no devDeps required.
//
// We don't shell out to a real `gh` binary here; we test the
// pure-functional pieces (argv parsing, body builders, URL → number
// extraction, phase title prefix matching) and label palette
// invariants. The full open/close + phase find-or-reopen flow is
// verified live on the first /iterate / /ship-a-phase tick after
// merge.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { __test } from '../loop-issue.mjs'

const {
  parseArgs,
  parseIssueNumber,
  buildCloseCommentBody,
  buildPhaseResumeCommentBody,
  buildPhaseShippedCommentBody,
  buildContentResumeCommentBody,
  extractClosesNumber,
  phaseTitlePrefix,
  isPhaseMatch,
  contentTitleSuffix,
  isContentMatch,
  LABEL_PALETTE,
  VALID_SEVERITY,
  VALID_CATEGORY,
  VALID_SOURCE,
} = __test

test('parseArgs parses standard flag/value pairs', () => {
  const out = parseArgs(['--severity', 'high', '--category', 'a11y', '--title', 'a quick fix'])
  assert.equal(out.severity, 'high')
  assert.equal(out.category, 'a11y')
  assert.equal(out.title, 'a quick fix')
})

test('parseArgs handles a flag without a value (e.g. --help)', () => {
  const out = parseArgs(['--help'])
  assert.equal(out.help, 'true')
})

test('parseArgs preserves dashed flag names like --body-file', () => {
  const out = parseArgs(['--body-file', '/tmp/issue-body.md', '--deploy-url', 'https://example.com'])
  assert.equal(out['body-file'], '/tmp/issue-body.md')
  assert.equal(out['deploy-url'], 'https://example.com')
})

test('parseArgs treats consecutive flags as boolean (no value)', () => {
  const out = parseArgs(['--dry-run', '--verbose'])
  assert.equal(out['dry-run'], 'true')
  assert.equal(out['verbose'], 'true')
})

test('parseIssueNumber extracts the trailing number from gh issue URL', () => {
  const stdout = 'https://github.com/owner/repo/issues/42\n'
  assert.equal(parseIssueNumber(stdout), 42)
})

test('parseIssueNumber handles multi-line stdout (URL is last line)', () => {
  const stdout = 'Creating issue in owner/repo\n\nhttps://github.com/owner/repo/issues/137\n'
  assert.equal(parseIssueNumber(stdout), 137)
})

test('parseIssueNumber returns null when no URL is present', () => {
  assert.equal(parseIssueNumber('something went wrong'), null)
  assert.equal(parseIssueNumber(''), null)
})

test('parseIssueNumber finds the URL even if not strictly the very last line', () => {
  const stdout = 'creating...\nhttps://github.com/owner/repo/issues/9\n'
  assert.equal(parseIssueNumber(stdout), 9)
})

test('buildCloseCommentBody includes commit + deploy URL + closure note', () => {
  const body = buildCloseCommentBody({ commit: 'a3f1e2c', deployUrl: 'https://example.com' })
  assert.match(body, /a3f1e2c/)
  assert.match(body, /https:\/\/example\.com/)
  assert.match(body, /Closes #N/)
})

test('phaseTitlePrefix uses an em-dash + trailing space so prefix matches are exact', () => {
  assert.equal(phaseTitlePrefix('16a'), 'Phase 16a — ')
  assert.equal(phaseTitlePrefix(17), 'Phase 17 — ')
})

test('isPhaseMatch is anchored — "Phase 16" does not collide with "Phase 16a"', () => {
  assert.equal(isPhaseMatch('Phase 16 — Stripe', '16'), true)
  assert.equal(isPhaseMatch('Phase 16 — Stripe', '16a'), false)
  assert.equal(isPhaseMatch('Phase 16a — E2E backfill', '16a'), true)
  assert.equal(isPhaseMatch('Phase 16a — E2E backfill', '16'), false)
  assert.equal(isPhaseMatch('Phase 1 — bootstrap', '1'), true)
  assert.equal(isPhaseMatch('Phase 1 — bootstrap', '11'), false)
})

test('buildPhaseResumeCommentBody mentions the phase id + ISO timestamp', () => {
  const body = buildPhaseResumeCommentBody({ phaseId: '16a' })
  assert.match(body, /Phase 16a/)
  assert.match(body, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) // rough ISO check
  assert.match(body, /resumed/i)
})

test('buildPhaseShippedCommentBody includes phase id, commit, deploy URL, and Closes-trailer note', () => {
  const body = buildPhaseShippedCommentBody({
    phaseId: '16a',
    commit: 'deadbee',
    deployUrl: 'https://example.com',
  })
  assert.match(body, /Phase 16a/)
  assert.match(body, /deadbee/)
  assert.match(body, /https:\/\/example\.com/)
  assert.match(body, /Closes #N/)
})

test('LABEL_PALETTE has every label the open + phase-open paths apply', () => {
  // Every label that cmdOpen / cmdPhaseOpen creates must have a
  // palette entry so ensureLabel can create it on first encounter.
  const required = [
    'loop:opened',
    'loop:phase',
    'severity:high',
    'severity:med',
    'severity:low',
    'source:user',
    'source:reader',
    'source:audit',
    'source:external',
    'bug',
    'enhancement',
    'content',
    'data',
    'docs',
    'seo',
    'a11y',
    'perf',
  ]
  for (const name of required) {
    assert.ok(LABEL_PALETTE[name], `missing palette entry: ${name}`)
    assert.match(LABEL_PALETTE[name].color, /^[0-9a-f]{6}$/, `invalid color for ${name}`)
  }
})

test('extractClosesNumber reads a trailer on its own line', () => {
  const message = 'feat: phase 12 — thing\n\n- did stuff\n\nCloses #405\n'
  assert.equal(extractClosesNumber(message), 405)
})

test('extractClosesNumber returns null when no trailer is present (Phase 44 regression)', () => {
  const message = 'feat: BRAND_SPELLING_STRICT invariant — phase 44\n\n- did stuff\n'
  assert.equal(extractClosesNumber(message), null)
})

test('extractClosesNumber does not match "Closes #N" mentioned mid-sentence, only its own line', () => {
  const message = 'docs: explain that pushing Closes #405 style trailers auto-closes issues\n'
  assert.equal(extractClosesNumber(message), null)
})

test('extractClosesNumber picks the phase mirror number even when the trailer looks like a phase ordinal (Phase 46 regression shape)', () => {
  // The Phase 46 bug wasn't a parsing bug — the wrong number was written
  // into the trailer in the first place. This test just documents that
  // extraction is number-agnostic; verify-close-trailer's title-prefix
  // check (not this function) is what catches the wrong-number case.
  const message = 'feat: colocated-test gate — phase 46\n\nCloses #46\n'
  assert.equal(extractClosesNumber(message), 46)
})

test('contentTitleSuffix builds a " — <name>" suffix', () => {
  assert.equal(contentTitleSuffix('90 Day Fiancé'), ' — 90 Day Fiancé')
  assert.equal(contentTitleSuffix('Married at First Sight Australia'), ' — Married at First Sight Australia')
})

test('isContentMatch matches by title suffix, unit-type prefix agnostic', () => {
  assert.equal(isContentMatch('content: season-batch — 90 Day Fiancé', '90 Day Fiancé'), true)
  assert.equal(isContentMatch('content: new-show — 90 Day Fiancé', '90 Day Fiancé'), true)
  assert.equal(isContentMatch('content: season-batch — Selling Sunset', '90 Day Fiancé'), false)
})

test('isContentMatch does not false-positive on a name that is a substring of another', () => {
  // "Love Island" must not match a title actually about "Love Island UK".
  assert.equal(isContentMatch('content: season-batch — Love Island UK', 'Love Island'), false)
  assert.equal(isContentMatch('content: season-batch — Love Island', 'Love Island'), true)
})

test('buildContentResumeCommentBody mentions the unit name + ISO timestamp', () => {
  const body = buildContentResumeCommentBody({ unit: 'Married at First Sight Australia' })
  assert.match(body, /Married at First Sight Australia/)
  assert.match(body, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  assert.match(body, /resumed/i)
})

test('LABEL_PALETTE has the loop:content label for the content-open path', () => {
  assert.ok(LABEL_PALETTE['loop:content'])
  assert.match(LABEL_PALETTE['loop:content'].color, /^[0-9a-f]{6}$/)
})

test('VALID_* enums match the documented brief', () => {
  assert.deepEqual([...VALID_SEVERITY].sort(), ['high', 'low', 'med'])
  assert.deepEqual(
    [...VALID_CATEGORY].sort(),
    ['a11y', 'bug', 'content', 'data', 'docs', 'enhancement', 'perf', 'seo'],
  )
  assert.deepEqual([...VALID_SOURCE].sort(), ['audit', 'external', 'reader', 'user'])
})

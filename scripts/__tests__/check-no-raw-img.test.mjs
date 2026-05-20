import assert from 'node:assert/strict'
import test from 'node:test'
import {
  IMG_RE,
  collectViolationsForFiles,
  findImgTagsInSource,
  formatViolations,
  isAllowed,
} from '../lib/check-no-raw-img.mjs'

// Helper: reset the global regex's lastIndex between assertions, since
// IMG_RE is /g-flagged and `.test()` mutates state. The library code
// only ever calls `.matchAll()` (stateless), so this is a test-side
// concern.
function resetRe() {
  IMG_RE.lastIndex = 0
}

test('IMG_RE matches the three legal JSX/HTML <img> opening forms', () => {
  for (const positive of [
    '<img src="x.png" />',
    '<img>',
    '<img/>',
    '<img\nsrc="x.png" />',
    '<img\tsrc="x.png" />',
    '  <img alt="" src="/x.png" />',
    'before<img>after',
  ]) {
    resetRe()
    assert.equal(IMG_RE.test(positive), true, `should match: ${positive}`)
  }
})

test('IMG_RE does NOT match identifier-prefixed or unrelated tags', () => {
  for (const negative of [
    '<image href="x.svg" />', // SVG <image>
    '<imgur>',
    '<imageio>',
    '<svg viewBox="0 0 28 28">',
    '<Image src="/x.png" />', // next/image (capitalized)
    '<input type="text" />',
    '<i>img</i>',
    'const img = 1',
    "alt='img is fine in strings'",
  ]) {
    resetRe()
    assert.equal(IMG_RE.test(negative), false, `should NOT match: ${negative}`)
  }
})

test('findImgTagsInSource returns 1-indexed line numbers across multi-line input', () => {
  const src = [
    "import React from 'react'",
    '',
    'export function A() {',
    '  return <img src="/a.png" alt="" />',
    '}',
    '',
    'export function B() {',
    '  return (',
    '    <img',
    '      src="/b.png"',
    '    />',
    '  )',
    '}',
  ].join('\n')

  const hits = findImgTagsInSource(src)
  assert.equal(hits.length, 2)
  assert.equal(hits[0].lineNumber, 4)
  assert.equal(hits[1].lineNumber, 9)
})

test('findImgTagsInSource snippet captures the matching line, trimmed', () => {
  const src = '  <img src="/a.png" />\nrest of file\n'
  const hits = findImgTagsInSource(src)
  assert.equal(hits.length, 1)
  assert.equal(hits[0].snippet, '<img src="/a.png" />')
})

test('findImgTagsInSource snippet falls back to 80-char window when match is on an unterminated final line', () => {
  // No trailing newline after the match — the CLI used to slice
  // `[idx, idx+80]`. Lock that behaviour so future cleanups do not
  // silently rewrite the error UX.
  const src = '<img src="/a.png" />'
  const hits = findImgTagsInSource(src)
  assert.equal(hits.length, 1)
  assert.equal(hits[0].snippet, '<img src="/a.png" />')
})

test('findImgTagsInSource returns [] when the source has no <img tokens', () => {
  const src = "import React from 'react'\nexport const x = 1\n"
  assert.deepEqual(findImgTagsInSource(src), [])
})

test('findImgTagsInSource finds multiple hits on the same line', () => {
  const src = '<img><img/>'
  const hits = findImgTagsInSource(src)
  assert.equal(hits.length, 2)
  assert.equal(hits[0].lineNumber, 1)
  assert.equal(hits[1].lineNumber, 1)
})

test('isAllowed performs strict set membership against the relative POSIX path', () => {
  const allow = new Set(['src/legacy/raw-img-tool.tsx'])
  assert.equal(isAllowed('src/legacy/raw-img-tool.tsx', allow), true)
  assert.equal(isAllowed('src/legacy/raw-img-tool.ts', allow), false)
  assert.equal(isAllowed('src/components/X.tsx', allow), false)
  // Empty allowlist (today's reality) — nothing is allowed.
  assert.equal(isAllowed('any/path.tsx', new Set()), false)
})

test('formatViolations renders the canonical CLI error shape', () => {
  const out = formatViolations([
    { file: 'src/components/A.tsx', line: 4, snippet: '<img src="/a.png" />' },
    { file: 'src/components/B.tsx', line: 9, snippet: '<img' },
  ])
  // Header.
  assert.match(out, /^check-no-raw-img: found 2 raw <img> usage\(s\):/)
  // Per-row format `  <file>:<line> — <snippet>` (em dash, two leading spaces).
  assert.ok(out.includes('  src/components/A.tsx:4 — <img src="/a.png" />'))
  assert.ok(out.includes('  src/components/B.tsx:9 — <img'))
  // Footer with the next/image guidance + ALLOWLIST hint.
  assert.ok(
    out.endsWith(
      'Use next/image instead. If the case is intentional, add the file to the ALLOWLIST in scripts/check-no-raw-img.mjs.',
    ),
  )
})

test('formatViolations handles a single violation cleanly', () => {
  const out = formatViolations([
    { file: 'src/x.tsx', line: 1, snippet: '<img>' },
  ])
  assert.match(out, /^check-no-raw-img: found 1 raw <img> usage\(s\):/)
  assert.ok(out.includes('  src/x.tsx:1 — <img>'))
})

test('collectViolationsForFiles wires findImgTagsInSource with the relative-path key', () => {
  const FS = {
    '/abs/src/A.tsx': 'export const a = <img src="/a.png" />',
    '/abs/src/B.tsx': "export const b = 'no img here'",
    '/abs/src/C.tsx': '<img\nsrc="/c.png"\n/>',
  }
  const result = collectViolationsForFiles({
    files: Object.keys(FS),
    readFile: (p) => FS[p],
    toRelative: (p) => p.replace('/abs/', ''),
    allowlist: new Set(),
  })
  assert.equal(result.length, 2)
  assert.deepEqual(
    result.map((r) => r.file).sort(),
    ['src/A.tsx', 'src/C.tsx'],
  )
  const a = result.find((r) => r.file === 'src/A.tsx')
  assert.equal(a.line, 1)
  assert.ok(a.snippet.startsWith('<img'))
})

test('collectViolationsForFiles honors the allowlist', () => {
  const FS = {
    '/abs/src/keep.tsx': '<img src="/k.png" />',
    '/abs/src/allow.tsx': '<img src="/a.png" />',
  }
  const result = collectViolationsForFiles({
    files: Object.keys(FS),
    readFile: (p) => FS[p],
    toRelative: (p) => p.replace('/abs/', ''),
    allowlist: new Set(['src/allow.tsx']),
  })
  assert.equal(result.length, 1)
  assert.equal(result[0].file, 'src/keep.tsx')
})

test('collectViolationsForFiles returns [] for a clean file set', () => {
  const FS = {
    '/abs/src/A.tsx': 'import React from "react"\nexport const x = 1\n',
    '/abs/src/B.tsx': '<Image src="/x.png" alt="" />',
  }
  const result = collectViolationsForFiles({
    files: Object.keys(FS),
    readFile: (p) => FS[p],
    toRelative: (p) => p.replace('/abs/', ''),
    allowlist: new Set(),
  })
  assert.deepEqual(result, [])
})

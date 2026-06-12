import assert from 'node:assert/strict'
import test from 'node:test'
import {
  IMPORT_RE,
  checkSourceCoverage,
  collectViolations,
  expectedTestPaths,
  extractImportSpecs,
  formatViolations,
  isAllowed,
  resolveCandidates,
  toPosix,
} from '../lib/check-test-colocation.mjs'
import { ALLOWLIST, ROOTS } from '../check-test-colocation.mjs'

function resetRe() {
  IMPORT_RE.lastIndex = 0
}

test('IMPORT_RE captures static `from` import specifiers', () => {
  resetRe()
  const src = "import { x } from '../foo'\nimport y from '../bar.ts'"
  assert.deepEqual(extractImportSpecs(src), ['../foo', '../bar.ts'])
})

test('IMPORT_RE captures dynamic import() specifiers', () => {
  resetRe()
  const src = "const m = await import('../preFilter')\nconst n = await import('./local')"
  assert.deepEqual(extractImportSpecs(src), ['../preFilter', './local'])
})

test('IMPORT_RE captures side-effect import specifiers', () => {
  resetRe()
  const src = "import '../setup'\nimport './styles.css'"
  assert.deepEqual(extractImportSpecs(src), ['../setup', './styles.css'])
})

test('IMPORT_RE captures type-only `import type ... from` specifiers', () => {
  resetRe()
  const src = "import type { Foo } from '../index'"
  assert.deepEqual(extractImportSpecs(src), ['../index'])
})

test('extractImportSpecs returns [] when there are no imports', () => {
  resetRe()
  assert.deepEqual(extractImportSpecs('const x = 1\nexport default x'), [])
})

test('extractImportSpecs handles mixed quote styles + whitespace', () => {
  resetRe()
  const src = [
    'import { a } from "../A"',
    "import { b } from '../B'",
    'const m = await import( "../C" )',
  ].join('\n')
  assert.deepEqual(extractImportSpecs(src), ['../A', '../B', '../C'])
})

test('resolveCandidates yields the bare path + .ts/.tsx + index.{ts,tsx} variants', () => {
  const got = resolveCandidates('../foo', '/abs/src/components/x/__tests__')
  // Order is implementation-defined; treat as set for the contract.
  const expected = new Set([
    '/abs/src/components/x/foo',
    '/abs/src/components/x/foo.ts',
    '/abs/src/components/x/foo.tsx',
    '/abs/src/components/x/foo/index.ts',
    '/abs/src/components/x/foo/index.tsx',
  ])
  assert.deepEqual(new Set(got), expected)
})

test('resolveCandidates handles `./local` specs', () => {
  const got = resolveCandidates('./local', '/abs/src/lib/__tests__')
  assert.ok(got.includes('/abs/src/lib/__tests__/local.ts'))
  assert.ok(got.includes('/abs/src/lib/__tests__/local.tsx'))
})

test('resolveCandidates handles deep specs like ../../scripts/x', () => {
  const got = resolveCandidates(
    '../../../scripts/mint-e2e-cookie.mjs',
    '/abs/src/lib/__tests__',
  )
  assert.ok(got.includes('/abs/scripts/mint-e2e-cookie.mjs'))
})

test('resolveCandidates skips non-relative specs (bare + alias)', () => {
  assert.deepEqual(resolveCandidates('vitest', '/abs/x'), [])
  assert.deepEqual(resolveCandidates('@/lib/foo', '/abs/x'), [])
  assert.deepEqual(resolveCandidates('node:fs', '/abs/x'), [])
})

test('expectedTestPaths derives both .ts and .tsx test candidates', () => {
  assert.deepEqual(expectedTestPaths('/abs/src/components/X.tsx'), [
    '/abs/src/components/__tests__/X.test.ts',
    '/abs/src/components/__tests__/X.test.tsx',
  ])
  assert.deepEqual(expectedTestPaths('/abs/src/lib/Y.ts'), [
    '/abs/src/lib/__tests__/Y.test.ts',
    '/abs/src/lib/__tests__/Y.test.tsx',
  ])
})

test('isAllowed performs strict set membership', () => {
  const allow = new Set(['src/components/profile/types.ts'])
  assert.equal(isAllowed('src/components/profile/types.ts', allow), true)
  assert.equal(isAllowed('src/components/profile/types.tsx', allow), false)
  assert.equal(isAllowed('any/path.ts', new Set()), false)
})

test('checkSourceCoverage — covered: filename match + test imports target', () => {
  const FS = {
    '/abs/src/components/X.tsx': 'export const x = 1',
    '/abs/src/components/__tests__/X.test.tsx': "import { x } from '../X'",
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/components/X.tsx',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, { ok: true })
})

test('checkSourceCoverage — no-test: no colocated test file exists at all', () => {
  const FS = {
    '/abs/src/components/X.tsx': 'export const x = 1',
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/components/X.tsx',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, { ok: false, reason: 'no-test' })
})

test('checkSourceCoverage — wrong-target: test file present but imports a sibling, not the target (Header.tsx / HeaderView.tsx class)', () => {
  // The exact regression class from audit row #120: a Header.test.tsx
  // that imports HeaderView (not Header) and thus describes HeaderView.
  // Filename-only scans wrongly mark Header.tsx as covered.
  const FS = {
    '/abs/src/components/chrome/Header.tsx': 'export async function Header() { return null }',
    '/abs/src/components/chrome/HeaderView.tsx': 'export function HeaderView() { return null }',
    '/abs/src/components/chrome/__tests__/Header.test.tsx':
      "import { HeaderView } from '../HeaderView'\ndescribe('<HeaderView>', () => {})",
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/components/chrome/Header.tsx',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, {
    ok: false,
    reason: 'wrong-target',
    testPath: '/abs/src/components/chrome/__tests__/Header.test.tsx',
  })
})

test('checkSourceCoverage — dynamic `await import("../X")` counts as coverage', () => {
  const FS = {
    '/abs/src/lib/searchIndex.ts': 'export function getSearchIndex() {}',
    '/abs/src/lib/__tests__/searchIndex.test.ts':
      "const { getSearchIndex } = await import('../searchIndex')",
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/lib/searchIndex.ts',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, { ok: true })
})

test('checkSourceCoverage — barrel covered when its test imports `../index`', () => {
  const FS = {
    '/abs/src/components/profile/index.ts': "export * from './ProfileEmpty'",
    '/abs/src/components/profile/__tests__/index.test.ts':
      "import * as barrel from '../index'",
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/components/profile/index.ts',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, { ok: true })
})

test('checkSourceCoverage — extension-bearing import (`from "../X.ts"`) counts as coverage', () => {
  const FS = {
    '/abs/src/lib/X.ts': 'export const x = 1',
    '/abs/src/lib/__tests__/X.test.ts': "import { x } from '../X.ts'",
  }
  const result = checkSourceCoverage({
    sourcePath: '/abs/src/lib/X.ts',
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
  })
  assert.deepEqual(result, { ok: true })
})

test('collectViolations — happy path: every source covered', () => {
  const FS = {
    '/abs/src/lib/A.ts': '',
    '/abs/src/lib/__tests__/A.test.ts': "import '../A'",
    '/abs/src/lib/B.ts': '',
    '/abs/src/lib/__tests__/B.test.ts': "import { b } from '../B'",
  }
  const result = collectViolations({
    sourceFiles: ['/abs/src/lib/A.ts', '/abs/src/lib/B.ts'],
    toRelative: (p) => p.replace('/abs/', ''),
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
    allowlist: new Set(),
  })
  assert.deepEqual(result, [])
})

test('collectViolations — flags both no-test and wrong-target classes; allowlist filters out genuine no-logic files', () => {
  const FS = {
    '/abs/src/lib/A.ts': '', // covered
    '/abs/src/lib/__tests__/A.test.ts': "import { a } from '../A'",
    '/abs/src/lib/B.ts': '', // no test — violation
    '/abs/src/lib/C.ts': '', // test exists but imports sibling — violation
    '/abs/src/lib/D.ts': '',
    '/abs/src/lib/__tests__/C.test.ts': "import { d } from '../D'",
    '/abs/src/lib/__tests__/D.test.ts': "import { d } from '../D'",
    '/abs/src/types.ts': '', // allowlisted (no test)
  }
  const result = collectViolations({
    sourceFiles: [
      '/abs/src/lib/A.ts',
      '/abs/src/lib/B.ts',
      '/abs/src/lib/C.ts',
      '/abs/src/lib/D.ts',
      '/abs/src/types.ts',
    ],
    toRelative: (p) => p.replace('/abs/', ''),
    fileExists: (p) => p in FS,
    readFile: (p) => FS[p],
    allowlist: new Set(['src/types.ts']),
  })
  // Stable ordering by source iteration order.
  assert.equal(result.length, 2)
  assert.deepEqual(result[0], { file: 'src/lib/B.ts', reason: 'no-test' })
  assert.deepEqual(result[1], {
    file: 'src/lib/C.ts',
    reason: 'wrong-target',
    testPath: 'src/lib/__tests__/C.test.ts',
  })
})

test('formatViolations renders the canonical CLI error shape (both reason classes)', () => {
  const out = formatViolations([
    { file: 'src/lib/B.ts', reason: 'no-test' },
    {
      file: 'src/lib/C.ts',
      reason: 'wrong-target',
      testPath: 'src/lib/__tests__/C.test.ts',
    },
  ])
  assert.match(
    out,
    /^check-test-colocation: found 2 testless source module\(s\):/,
  )
  assert.ok(
    out.includes(
      '  src/lib/B.ts — no colocated __tests__/<name>.test.{ts,tsx}',
    ),
  )
  assert.ok(
    out.includes(
      '  src/lib/C.ts — src/lib/__tests__/C.test.ts exists but does not import this module (filename match only)',
    ),
  )
  assert.ok(
    out.endsWith(
      'Add a colocated test next to each module, or add the path to the ALLOWLIST in scripts/check-test-colocation.mjs (genuine no-logic files only).',
    ),
  )
})

test('formatViolations handles a single violation cleanly', () => {
  const out = formatViolations([
    { file: 'src/x.ts', reason: 'no-test' },
  ])
  assert.match(
    out,
    /^check-test-colocation: found 1 testless source module\(s\):/,
  )
})

// --------------------------------------------------------------------
// CLI configuration — phase 46
// --------------------------------------------------------------------
//
// Phase 42 shipped the gate with three roots; phase 46 finished the
// move by adding `src/app`. A regression dropping any of these would
// silently re-open the §5a hole (an untested route handler / page /
// component slipping through verify), so the configured root set is a
// load-bearing contract — pin it from outside the CLI.

test('ROOTS covers every source tree the §5a verify gate must guard', () => {
  // Order doesn't matter — the walker iterates and aggregates.
  assert.deepEqual(new Set(ROOTS), new Set([
    'src/components',
    'src/lib',
    'src/content',
    'src/app',
  ]))
})

test('ROOTS includes src/app — pins phase 46', () => {
  assert.ok(
    ROOTS.includes('src/app'),
    'src/app must remain in ROOTS — dropping it re-opens the §5a hole phase 46 closed',
  )
})

// --------------------------------------------------------------------
// Windows-checkout path normalization (audit row "Windows verify gate
// broken" — issue #407)
// --------------------------------------------------------------------
//
// node:path's `join` returns backslash-separated paths on win32, but
// the lib reasons in POSIX form throughout: the CLI's source-file
// filter looks for the literal '/__tests__/', and the lib path math
// (expectedTestPaths, resolveCandidates) joins/splits on '/'. Without
// normalization at the CLI boundary the gate reports every source
// file as a violation on Windows. `toPosix` is the boundary helper.

test('toPosix converts backslash separators to forward slashes', () => {
  assert.equal(
    toPosix('C:\\foo\\bar\\src\\components\\X.tsx'),
    'C:/foo/bar/src/components/X.tsx',
  )
})

test('toPosix is a no-op on already-POSIX paths', () => {
  assert.equal(toPosix('/abs/src/components/X.tsx'), '/abs/src/components/X.tsx')
  assert.equal(toPosix('relative/path.ts'), 'relative/path.ts')
})

test('toPosix normalizes mixed-separator paths (rare but defended)', () => {
  assert.equal(
    toPosix('C:\\foo/bar\\baz/qux.ts'),
    'C:/foo/bar/baz/qux.ts',
  )
})

test('after toPosix, the CLI source-file filter `/__tests__/` matches Windows test paths', () => {
  // Regression pin: pre-fix the filter ran against backslash-form
  // paths from `path.join` on win32, so `path.includes('/__tests__/')`
  // was always false — every test file was treated as a source file
  // and reported as a violation.
  const winTestPath = 'C:\\foo\\src\\components\\__tests__\\X.test.tsx'
  const winSourcePath = 'C:\\foo\\src\\components\\X.tsx'
  assert.equal(toPosix(winTestPath).includes('/__tests__/'), true)
  assert.equal(toPosix(winSourcePath).includes('/__tests__/'), false)
})

test('ALLOWLIST is the documented profile/types.ts exception only', () => {
  // The allowlist is intentionally tiny — every other source module
  // ships a colocated test. Growing it silently is a smell; pin the
  // exact shape so any addition is reviewable here.
  assert.deepEqual(
    [...ALLOWLIST].sort(),
    ['src/components/profile/types.ts'],
  )
})

// Pure logic for the phase-42 colocated-test coverage gate. Mirrors
// the shape of scripts/lib/check-no-raw-img.mjs — no filesystem, no
// process; the thin CLI wrapper at scripts/check-test-colocation.mjs
// walks src/ and exits. Every function here is a deterministic
// transform exercised from scripts/__tests__/check-test-colocation.test.mjs.

// Normalize a path to POSIX form (forward slashes). The lib's path
// math (expectedTestPaths, resolveCandidates) joins/splits on '/'
// and the source-file filter looks for the literal '/__tests__/' —
// both are broken on Windows where node:path's `join` returns
// backslash separators. The CLI wrapper calls this at every FS
// boundary (cwd, walked paths, joined roots) so paths reach the
// lib already in POSIX form.
export function toPosix(p) {
  return p.replaceAll('\\', '/')
}

// Captures every quoted module specifier referenced from a test file:
// static `from '<spec>'`, dynamic `import('<spec>')`, type-only
// `import type ... from '<spec>'`, and side-effect `import '<spec>'`.
// The capture group is the same in all branches so a single iteration
// over `.matchAll(IMPORT_RE)` yields one spec per match.
export const IMPORT_RE =
  /(?:from\s*['"]([^'"]+)['"])|(?:import\s*\(\s*['"]([^'"]+)['"]\s*\))|(?:import\s+['"]([^'"]+)['"])/g

export function extractImportSpecs(src) {
  const out = []
  for (const m of src.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3]
    if (spec) out.push(spec)
  }
  return out
}

// Resolve a POSIX-style relative module spec against the test file's
// directory, returning the candidate target paths (with extensions
// tried in TS-conventional order + index re-export targets). Skips
// non-relative specs (bare `vitest`, aliased `@/lib/foo`) — the
// §5a convention is that a colocated test imports its target with
// `../<name>`, so only relative specs are considered as evidence of
// coverage.
export function resolveCandidates(spec, testDir) {
  if (!spec.startsWith('.')) return []
  const segments = testDir.split('/').filter((s) => s !== '')
  for (const part of spec.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') segments.pop()
    else segments.push(part)
  }
  const base = `/${segments.join('/')}`
  // The order matters only insofar as duplicates are harmless — the
  // caller does set membership. Both extension-bearing and
  // extension-omitting forms are valid TS module references.
  return [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ]
}

export function expectedTestPaths(sourcePath) {
  const lastSlash = sourcePath.lastIndexOf('/')
  const dir = sourcePath.slice(0, lastSlash)
  const file = sourcePath.slice(lastSlash + 1)
  const base = file.replace(/\.(tsx|ts)$/, '')
  return [
    `${dir}/__tests__/${base}.test.ts`,
    `${dir}/__tests__/${base}.test.tsx`,
  ]
}

export function isAllowed(relPath, allowlist) {
  return allowlist.has(relPath)
}

// Per-file decision. Returns one of:
//   { ok: true }                                         — covered
//   { ok: false, reason: 'no-test' }                     — no colocated test file
//   { ok: false, reason: 'wrong-target', testPath }      — colocated test exists but does not import the target
export function checkSourceCoverage({
  sourcePath,
  fileExists,
  readFile,
}) {
  const candidates = expectedTestPaths(sourcePath)
  const found = candidates.find((p) => fileExists(p))
  if (!found) return { ok: false, reason: 'no-test' }
  const testDir = found.slice(0, found.lastIndexOf('/'))
  const src = readFile(found)
  const specs = extractImportSpecs(src)
  for (const spec of specs) {
    const resolved = resolveCandidates(spec, testDir)
    if (resolved.includes(sourcePath)) return { ok: true }
  }
  return { ok: false, reason: 'wrong-target', testPath: found }
}

export function collectViolations({
  sourceFiles,
  toRelative,
  fileExists,
  readFile,
  allowlist,
}) {
  const out = []
  for (const source of sourceFiles) {
    const rel = toRelative(source)
    if (isAllowed(rel, allowlist)) continue
    const result = checkSourceCoverage({
      sourcePath: source,
      fileExists,
      readFile,
    })
    if (result.ok) continue
    const violation = { file: rel, reason: result.reason }
    if (result.reason === 'wrong-target')
      violation.testPath = toRelative(result.testPath)
    out.push(violation)
  }
  return out
}

export function formatViolations(violations) {
  const header = `check-test-colocation: found ${violations.length} testless source module(s):\n`
  const rows = violations
    .map((v) => {
      if (v.reason === 'no-test')
        return `  ${v.file} — no colocated __tests__/<name>.test.{ts,tsx}`
      return `  ${v.file} — ${v.testPath} exists but does not import this module (filename match only)`
    })
    .join('\n')
  const footer =
    '\nAdd a colocated test next to each module, or add the path to the ALLOWLIST in scripts/check-test-colocation.mjs (genuine no-logic files only).'
  return `${header}\n${rows}${footer}`
}

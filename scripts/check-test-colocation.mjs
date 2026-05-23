#!/usr/bin/env node
// scripts/check-test-colocation.mjs
//
// Phase 42 — colocated-test coverage gate. Walks the three source
// roots for .ts / .tsx modules; for each, confirms a sibling
// __tests__/<name>.test.{ts,tsx} exists AND imports the target
// module (defends against the Header.tsx / HeaderView.tsx
// filename-match-but-wrong-target false negative class — see
// audit row #120). Fails the build on any violation.
//
// Allowlist: genuine no-logic files only — pure type-only modules
// that have no runtime exports, or barrels intentionally covered
// by a separate convention. Everything else needs a colocated test.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import {
  collectViolations,
  formatViolations,
} from './lib/check-test-colocation.mjs'

const ROOT = process.cwd()
const ROOTS = ['src/components', 'src/lib', 'src/content']

const ALLOWLIST = new Set([
  // Pure type-only module; no runtime exports. View-model contract
  // shared by /u/[handle] profile page and the profile components.
  'src/components/profile/types.ts',
])

const FILE_EXTS = new Set(['.tsx', '.ts'])

function walk(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, acc)
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'))
      if (FILE_EXTS.has(ext)) acc.push(full)
    }
  }
}

function relative(p) {
  return p.replace(`${ROOT}\\`, '').replace(`${ROOT}/`, '').replaceAll('\\', '/')
}

const allFiles = []
for (const root of ROOTS) {
  const abs = join(ROOT, root)
  if (existsSync(abs)) walk(abs, allFiles)
}

const sourceFiles = allFiles.filter((f) => !f.includes('/__tests__/'))

const violations = collectViolations({
  sourceFiles,
  toRelative: relative,
  fileExists: (p) => existsSync(p),
  readFile: (p) => readFileSync(p, 'utf8'),
  allowlist: ALLOWLIST,
})

if (violations.length === 0) {
  process.exit(0)
}

console.error(formatViolations(violations))
process.exit(1)

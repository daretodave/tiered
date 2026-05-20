#!/usr/bin/env node
// scripts/check-no-raw-img.mjs
//
// Phase 18 — raw <img> discipline gate. Walks src/ for any
// <img tokens in .tsx / .ts files and fails the build. The
// project's convention is next/image for all raster sources;
// inline SVG (which uses <svg> not <img>) is fine.
//
// Approved exceptions: none today. Add a filename to the
// ALLOWLIST below if a legitimate raw-img case lands (e.g.,
// a content-author tool that intentionally bypasses
// optimization).

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  collectViolationsForFiles,
  formatViolations,
} from './lib/check-no-raw-img.mjs'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')

const ALLOWLIST = new Set([])

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

const files = []
walk(SRC, files)

const violations = collectViolationsForFiles({
  files,
  readFile: (p) => readFileSync(p, 'utf8'),
  toRelative: relative,
  allowlist: ALLOWLIST,
})

if (violations.length === 0) {
  // Be terse on success; the verify chain has more important output.
  process.exit(0)
}

console.error(formatViolations(violations))
process.exit(1)

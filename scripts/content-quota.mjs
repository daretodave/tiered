#!/usr/bin/env node
// pnpm content:quota — Rule 1 launch coverage check.
//
// Reads content/shows/*.md, compares each top-level slug to
// LAUNCH_SHOWS in scripts/lib/launch-shows.mjs, prints either
// `ok` + the count, or `missing N show(s):` + a list and exits 1.
//
// NOT part of `pnpm verify`. The launch quota is a content
// velocity signal, not a correctness gate — see the phase 20
// brief Decisions section.

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { LAUNCH_SHOWS, missingShows } from './lib/launch-shows.mjs'

function coveredSlugsFrom(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.replace(/\.md$/, ''))
}

function main(argv = process.argv.slice(2)) {
  const dir = argv[0] ?? path.join(process.cwd(), 'content', 'shows')
  const covered = coveredSlugsFrom(dir)
  const missing = missingShows(covered)

  if (missing.length === 0) {
    process.stdout.write(
      `content-quota: ok — ${LAUNCH_SHOWS.length}/${LAUNCH_SHOWS.length} launch shows covered\n`,
    )
    return 0
  }

  process.stderr.write(
    `content-quota: missing ${missing.length} show(s) of ${LAUNCH_SHOWS.length}:\n`,
  )
  for (const s of missing) {
    process.stderr.write(`  - ${s.slug} (${s.name})\n`)
  }
  return 1
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main())
}

export { main }

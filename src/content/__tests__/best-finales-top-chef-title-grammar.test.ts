import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-43 LOW #370 closure: /themes/best-finales entry #03
// (Top Chef S06 · Las Vegas) opened on a stumbled compound modifier —
// `The deepest knife-skill cast carries the kitchen all the way home.`
// The singular `knife-skill` was being asked to act as a compound
// modifier on `cast`, but it didn't parse cleanly on first read; the
// eye stumbled between `knife-skill cast` and `knife, skill cast`
// before resolving. A peer who calls a cast `deep` names the skill in
// its natural plural. Title pluralized to `knife-skills cast`.
//
// Pin shape mirrors the pass-36 #325 closure pattern (bidirectional
// drift guard): the positive case asserts the title quotes the new
// plural form; the negative case pins that the prior
// singular-noun-as-adjective phrasing does not return.

const FILE = path.resolve(process.cwd(), 'content/themes/best-finales.md')

function topChefEntryTitle(): string {
  const raw = readFileSync(FILE, 'utf-8')
  // Find the entry whose `show:` is `top-chef` and return its `title:`.
  // Entries are separated by `  - show:` lines; the title sits within
  // the same block.
  const blocks = raw.split(/^\s{2}-\s+show:\s*/m).slice(1)
  for (const block of blocks) {
    const firstLine = block.split(/\r?\n/, 1)[0] ?? ''
    if (firstLine.trim() !== 'top-chef') continue
    const titleMatch = block.match(/^\s*title:\s*"([^"]+)"/m)
    return (titleMatch?.[1] ?? '').toLowerCase()
  }
  return ''
}

describe('content/themes/best-finales — Top Chef entry title grammar (pass-43 #370)', () => {
  const title = topChefEntryTitle()

  it('extracts the Top Chef entry title from the live content file', () => {
    expect(title.length).toBeGreaterThan(0)
  })

  it('title quotes the plural "knife-skills cast" form', () => {
    expect(title).toMatch(/knife-skills cast/)
  })

  it('title does not regress to the singular "knife-skill cast" compound-modifier form', () => {
    expect(title).not.toMatch(/knife-skill cast/)
  })
})

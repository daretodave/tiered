import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-41 LOW #371 closure: /themes/best-finales entry #02
// (Survivor S20 · Heroes vs. Villains) title cross-surface echoed the
// /shows/survivor canon-entry #02 body opener on a six-word phrase
// frame `all-star format ... at its ceiling`. A reader hopping
// /themes/best-finales -> /shows/survivor read the same editorial
// verdict twice. The canon-rationale is the more anchored surface
// (114-word entry on the canon ladder vs the 80-word themed-list
// entry), so the themed-list title rotated off the shared frame; the
// canon body owns the `at its ceiling` editorial verdict alone.
//
// Pin shape mirrors the pass-43 #370 closure (bidirectional drift
// guard): the positive case asserts the title quotes the new
// `all-star return season` framing; the negative case pins that the
// prior six-word frame does not return.

const FILE = path.resolve(process.cwd(), 'content/themes/best-finales.md')

function hvvEntryTitle(): string {
  const raw = readFileSync(FILE, 'utf-8')
  const blocks = raw.split(/^\s{2}-\s+show:\s*/m).slice(1)
  for (const block of blocks) {
    const firstLine = block.split(/\r?\n/, 1)[0] ?? ''
    if (firstLine.trim() !== 'survivor') continue
    const seasonMatch = block.match(/^\s*season:\s*(\d+)/m)
    if (seasonMatch?.[1] !== '20') continue
    const titleMatch = block.match(/^\s*title:\s*"([^"]+)"/m)
    return (titleMatch?.[1] ?? '').toLowerCase()
  }
  return ''
}

describe('content/themes/best-finales — HvV entry title vs canon #02 (pass-41 #371)', () => {
  const title = hvvEntryTitle()

  it('extracts the Survivor S20 entry title from the live content file', () => {
    expect(title.length).toBeGreaterThan(0)
  })

  it('title carries the new "all-star return season" framing', () => {
    expect(title).toMatch(/all-star return season/)
  })

  it('title does not regress to the canon-echoing "all-star format at its ceiling" frame', () => {
    expect(title).not.toMatch(/all-star format at its ceiling/)
  })

  it('title does not regress to the verbatim canon opener "format running at its ceiling"', () => {
    expect(title).not.toMatch(/format running at its ceiling/)
  })
})

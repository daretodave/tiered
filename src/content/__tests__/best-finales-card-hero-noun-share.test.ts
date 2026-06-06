import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-36 #325 closure: a reader on /themes / the home featured-
// themes strip reads the card's `description`; a click through to
// /themes/best-finales lands on the detail hero quoting the `tagline`.
// The two surfaces previously rewrote the same idea with two different
// metaphors at the only shared noun-phrase ("sits at the right altitude"
// vs "built at the size it needed"), so the click path produced two
// editorial promises for one list. The fix recast the tagline to open on
// the same nouns as the description and extend the editorial point rather
// than restate it.
//
// Pin shape mirrors the #242 closure pattern (bidirectional drift guard):
// the positive cases assert both fields quote the load-bearing nouns
// (`closing run`, `last hour`); the negative case pins that the rejected
// parallel-rewrite phrasing does not return to the tagline. Together they
// trip at unit time on a future authoring drift, not the next reader pass.

const FILE = path.resolve(process.cwd(), 'content/themes/best-finales.md')

function extractField(field: string): string {
  const raw = readFileSync(FILE, 'utf-8')
  const m = raw.match(new RegExp(`^${field}:\\s*"([\\s\\S]+?)"\\s*$`, 'm'))
  return (m?.[1] ?? '').toLowerCase()
}

describe('content/themes/best-finales — cross-surface noun-share (pass-36 #325)', () => {
  const description = extractField('description')
  const tagline = extractField('tagline')

  it('extracts both editorial fields from the live content file', () => {
    expect(description.length).toBeGreaterThan(0)
    expect(tagline.length).toBeGreaterThan(0)
  })

  it('description and tagline both quote the "closing run" premise noun', () => {
    expect(description).toMatch(/closing run/)
    expect(tagline).toMatch(/closing run/)
  })

  it('description and tagline both quote the "last hour" structural noun', () => {
    expect(description).toMatch(/last hour/)
    expect(tagline).toMatch(/last hour/)
  })

  it('tagline does not regress to the rejected parallel-rewrite phrasing', () => {
    expect(tagline).not.toMatch(/land the season they were always making/)
    expect(tagline).not.toMatch(/built at the size it needed/)
  })
})

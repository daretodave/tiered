import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Critique pass-52 MED closure (issue #418) — /shows/below-deck S-tier
// band heading and blurb rendered the same string ("The seasons that
// defend the show.") because `tier_s_blurb` was absent from the canon
// frontmatter and the blurb fell back to `DEFAULT_TIER_HEADINGS.S`,
// which equals `TIER_HEADLINES.S`. All five ranked seasons are in S tier.
//
// Fix: add `tier_s_blurb` to content/shows/below-deck/canon.md so the
// blurb is distinct from the heading. This pin guards against a future
// authoring pass removing the field and silently restoring the duplicate.

const CANON_FILE = path.resolve(
  process.cwd(),
  'content/shows/below-deck/canon.md',
)

const HEADING_FALLBACK = 'The seasons that defend the show.'

function readFrontmatter(): string {
  const raw = readFileSync(CANON_FILE, 'utf-8').replaceAll('\r\n', '\n')
  const m = raw.match(/^---\n([\s\S]+?)\n---/)
  return m?.[1] ?? ''
}

describe('content/shows/below-deck/canon.md — tier_s_blurb distinct from heading (pass-52 #418)', () => {
  const fm = readFrontmatter()

  it('defines tier_s_blurb in the canon frontmatter', () => {
    expect(fm).toMatch(/^tier_s_blurb:/m)
  })

  it('tier_s_blurb is non-empty', () => {
    const m = fm.match(/^tier_s_blurb:\s*"([^"]+)"/m)
    expect(m).not.toBeNull()
    expect((m?.[1] ?? '').trim().length).toBeGreaterThan(0)
  })

  it('tier_s_blurb is distinct from the default tier heading fallback', () => {
    // Guards against the duplicate: if tier_s_blurb is absent, the component
    // falls back to DEFAULT_TIER_HEADINGS.S === TIER_HEADLINES.S — same string.
    expect(fm).not.toMatch(
      new RegExp(`tier_s_blurb:\\s*"${HEADING_FALLBACK.replace(/\./g, '\\.')}"`, 'm'),
    )
  })
})

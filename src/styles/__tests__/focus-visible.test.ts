import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('keyboard focus-visible coverage', () => {
  it('search input suppresses the default outline but supplies a focus-visible ring', () => {
    const css = readFileSync(join(__dirname, '..', 'search.css'), 'utf-8')
    expect(css).toMatch(/\.search-input\s*{[^}]*outline:\s*none/)
    expect(css).toMatch(/\.search-input:focus-visible\s*{[^}]*outline:/)
  })

  it('comment textarea suppresses the default outline but supplies a focus-visible ring', () => {
    const css = readFileSync(join(__dirname, '..', 'screens.css'), 'utf-8')
    expect(css).toMatch(/\.comment-ta\s*{[^}]*outline:\s*0/)
    expect(css).toMatch(/\.comment-ta:focus-visible\s*{[^}]*outline:/)
  })
})

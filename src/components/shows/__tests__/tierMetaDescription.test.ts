import { describe, expect, it } from 'vitest'
import { buildShowsMetaDescription } from '../tierMetaDescription'

describe('buildShowsMetaDescription', () => {
  it('returns the opener alone when no tier is populated', () => {
    expect(buildShowsMetaDescription([])).toBe(
      'Reality-TV canons, sorted by how settled the ranking feels.',
    )
  })

  it('names only S when only S is populated', () => {
    const out = buildShowsMetaDescription(['S'])
    expect(out).toContain('S tier is format-defining')
    expect(out).not.toContain('A tier')
    expect(out).not.toContain('B tier')
  })

  it('names S and A when B is empty (the catalog as of 2026-05-25)', () => {
    const out = buildShowsMetaDescription(['S', 'A'])
    expect(out).toBe(
      'Reality-TV canons, sorted by how settled the ranking feels. S tier is format-defining, A tier has the deep canon.',
    )
    expect(out).not.toContain('B tier')
  })

  it('names all three tiers when every tier is populated', () => {
    const out = buildShowsMetaDescription(['S', 'A', 'B'])
    expect(out).toBe(
      'Reality-TV canons, sorted by how settled the ranking feels. S tier is format-defining, A tier has the deep canon, B tier is in review.',
    )
  })

  it('orders fragments S → A → B regardless of input order', () => {
    expect(buildShowsMetaDescription(['B', 'A', 'S'])).toBe(
      'Reality-TV canons, sorted by how settled the ranking feels. S tier is format-defining, A tier has the deep canon, B tier is in review.',
    )
  })

  it('dedupes a repeated tier so a fragment is never doubled', () => {
    const out = buildShowsMetaDescription(['S', 'S', 'A'])
    expect(out.match(/S tier/g)).toHaveLength(1)
    expect(out.match(/A tier/g)).toHaveLength(1)
  })

  it('drops S cleanly when only A and B are populated', () => {
    const out = buildShowsMetaDescription(['A', 'B'])
    expect(out).toBe(
      'Reality-TV canons, sorted by how settled the ranking feels. A tier has the deep canon, B tier is in review.',
    )
    expect(out).not.toContain('S tier')
  })

  it('always ends in a single period — no trailing comma, no double dot', () => {
    expect(buildShowsMetaDescription(['S'])).toMatch(/[^.,]\.$/)
    expect(buildShowsMetaDescription(['S', 'A'])).toMatch(/[^.,]\.$/)
    expect(buildShowsMetaDescription([])).toMatch(/[^.,]\.$/)
  })

  // Critique pass-50 #LOW (#428): the opener must use the editorial-hedge
  // verb `feels` (matching the on-page hero lede) — not `is` (settled-fact
  // stance). Bidirectional pin: positive asserts `ranking feels`, negative
  // guards against regression to the old `ranking is` form.
  it('opener uses editorial-hedge verb "feels" — regression guard against pass-50 #428 drift', () => {
    expect(buildShowsMetaDescription([])).toContain('ranking feels')
    expect(buildShowsMetaDescription([])).not.toContain('ranking is')
  })
})

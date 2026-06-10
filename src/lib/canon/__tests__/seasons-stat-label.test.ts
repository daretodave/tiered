import { describe, expect, it } from 'vitest'
import { seasonsStatLabel } from '../seasons-stat-label'

describe('seasonsStatLabel', () => {
  it('says "seasons in canon" when every aired season has a canon slot', () => {
    // Survivor today: 50 aired, 50 canon entries — the fully-drained
    // case /critique pass 15 flagged + pass-45 #380 rotated. The
    // per-show editorial scope this surface owns; aligns with the
    // home featured tile's `Seasons in canon` (pass-44 #379) so the
    // home → /shows/[show] click path carries one label, not two.
    expect(seasonsStatLabel(50, 50)).toBe('seasons in canon')
  })

  it('says "seasons in canon" when canon coverage exceeds aired count', () => {
    // canon > aired shouldn't happen in practice, but >= keeps the
    // label honest rather than flipping back to "aired" on the edge.
    expect(seasonsStatLabel(12, 13)).toBe('seasons in canon')
  })

  it('never produces the legacy "seasons ranked" label on a fully-drained show', () => {
    // Pass-45 #380 drift guard. The catalog-aggregate `Seasons ranked`
    // slot lives on /shows hero (catalog-scope); this helper feeds
    // per-show surfaces and must not regress to it.
    expect(seasonsStatLabel(50, 50)).not.toBe('seasons ranked')
    expect(seasonsStatLabel(12, 13)).not.toBe('seasons ranked')
  })

  it('says "seasons aired" while the canon is mid-drain', () => {
    expect(seasonsStatLabel(47, 20)).toBe('seasons aired')
  })

  it('says "seasons aired" when no canon has been authored yet', () => {
    // A show with aired seasons but zero canon entries must never
    // claim coverage — the always-working rule allows canon-less shows.
    expect(seasonsStatLabel(8, 0)).toBe('seasons aired')
  })

  it('says "seasons aired" one slot short of full coverage', () => {
    expect(seasonsStatLabel(13, 12)).toBe('seasons aired')
  })

  it('never claims canon coverage on a degenerate zero-aired show', () => {
    // The canonEntryCount > 0 guard means 0/0 reads "aired", not the
    // nonsensical "0 seasons in canon".
    expect(seasonsStatLabel(0, 0)).toBe('seasons aired')
  })
})

import { describe, expect, it } from 'vitest'
import { seasonsStatLabel } from '../seasons-stat-label'

describe('seasonsStatLabel', () => {
  it('says "seasons ranked" when every aired season has a canon slot', () => {
    // Survivor today: 50 aired, 50 canon entries — the fully-drained
    // case /critique pass 15 flagged. Matches the home + /shows index
    // brag instead of under-claiming "seasons aired".
    expect(seasonsStatLabel(50, 50)).toBe('seasons ranked')
  })

  it('says "seasons ranked" when canon coverage exceeds aired count', () => {
    // canon > aired shouldn't happen in practice, but >= keeps the
    // label honest rather than flipping back to "aired" on the edge.
    expect(seasonsStatLabel(12, 13)).toBe('seasons ranked')
  })

  it('says "seasons aired" while the canon is mid-drain', () => {
    expect(seasonsStatLabel(47, 20)).toBe('seasons aired')
  })

  it('says "seasons aired" when no canon has been authored yet', () => {
    // A show with aired seasons but zero canon entries must never
    // claim "ranked" — the always-working rule allows canon-less shows.
    expect(seasonsStatLabel(8, 0)).toBe('seasons aired')
  })

  it('says "seasons aired" one slot short of full coverage', () => {
    expect(seasonsStatLabel(13, 12)).toBe('seasons aired')
  })

  it('never claims "ranked" on a degenerate zero-aired show', () => {
    // The canonEntryCount > 0 guard means 0/0 reads "aired", not the
    // nonsensical "0 seasons ranked".
    expect(seasonsStatLabel(0, 0)).toBe('seasons aired')
  })
})

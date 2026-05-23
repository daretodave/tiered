import { describe, expect, it } from 'vitest'
import {
  SHOW_ANNIVERSARIES,
  numberToWords,
  renderShowTaglineTokens,
  yearsSinceEst,
} from '../show-tenure'

describe('yearsSinceEst', () => {
  it('defaults to a Jan 1 anniversary — Survivor 2000 reads 26 on Jan 1, 2026', () => {
    expect(yearsSinceEst(2000, new Date('2026-01-01T00:00:00Z'))).toBe(26)
  })

  it('reads 0 in the same year as est_year before the anniversary', () => {
    expect(
      yearsSinceEst(2026, new Date('2026-04-01T00:00:00Z'), {
        month: 5,
        day: 31,
      }),
    ).toBe(0)
  })

  it('reads N+1 the instant the anniversary day rolls over', () => {
    expect(
      yearsSinceEst(2000, new Date('2026-05-30T23:59:59Z'), {
        month: 5,
        day: 31,
      }),
    ).toBe(25)
    expect(
      yearsSinceEst(2000, new Date('2026-05-31T00:00:00Z'), {
        month: 5,
        day: 31,
      }),
    ).toBe(26)
  })

  it('Survivor anchor reads 25 on 2026-05-23 (today) and 26 from 2026-05-31', () => {
    const today = new Date('2026-05-23T00:00:00Z')
    const anniversary = new Date('2026-05-31T00:00:00Z')
    const anchor = SHOW_ANNIVERSARIES.survivor as { month: number; day: number }
    expect(yearsSinceEst(2000, today, anchor)).toBe(25)
    expect(yearsSinceEst(2000, anniversary, anchor)).toBe(26)
  })

  it('floors at zero for asOfDate before est_year', () => {
    expect(yearsSinceEst(2030, new Date('2026-01-01T00:00:00Z'))).toBe(0)
  })

  it('uses UTC so a runner TZ does not shift the boundary', () => {
    // Same instant expressed two ways — both must read the same.
    expect(
      yearsSinceEst(2000, new Date('2026-05-31T00:00:00Z'), {
        month: 5,
        day: 31,
      }),
    ).toBe(26)
    expect(
      yearsSinceEst(2000, new Date(Date.UTC(2026, 4, 31, 0, 0, 0)), {
        month: 5,
        day: 31,
      }),
    ).toBe(26)
  })
})

describe('numberToWords', () => {
  it.each([
    [0, 'zero'],
    [1, 'one'],
    [10, 'ten'],
    [13, 'thirteen'],
    [19, 'nineteen'],
    [20, 'twenty'],
    [25, 'twenty-five'],
    [26, 'twenty-six'],
    [30, 'thirty'],
    [42, 'forty-two'],
    [50, 'fifty'],
    [99, 'ninety-nine'],
  ])('renders %i as %s', (n, word) => {
    expect(numberToWords(n)).toBe(word)
  })

  it('rejects non-integers', () => {
    expect(() => numberToWords(1.5)).toThrow(/integer/)
  })

  it('rejects negatives', () => {
    expect(() => numberToWords(-1)).toThrow(/0-99/)
  })

  it('rejects >= 100', () => {
    expect(() => numberToWords(100)).toThrow(/0-99/)
  })
})

describe('renderShowTaglineTokens', () => {
  const today = new Date('2026-05-23T00:00:00Z')

  it('passes a token-free template through unchanged', () => {
    expect(
      renderShowTaglineTokens('The mother format.', {
        estYear: 2000,
        slug: 'survivor',
        asOfDate: today,
      }),
    ).toBe('The mother format.')
  })

  it('substitutes {yearsWord} against the show anniversary', () => {
    expect(
      renderShowTaglineTokens(
        'spent {yearsWord} years rediscovering what it is',
        { estYear: 2000, slug: 'survivor', asOfDate: today },
      ),
    ).toBe('spent twenty-five years rediscovering what it is')
  })

  it('substitutes {yearsWord} on the day the anniversary rolls', () => {
    expect(
      renderShowTaglineTokens(
        'spent {yearsWord} years rediscovering what it is',
        {
          estYear: 2000,
          slug: 'survivor',
          asOfDate: new Date('2026-05-31T00:00:00Z'),
        },
      ),
    ).toBe('spent twenty-six years rediscovering what it is')
  })

  it('substitutes {years} numerically', () => {
    expect(
      renderShowTaglineTokens('{years} years in', {
        estYear: 2000,
        slug: 'survivor',
        asOfDate: today,
      }),
    ).toBe('25 years in')
  })

  it('substitutes both tokens in one pass', () => {
    expect(
      renderShowTaglineTokens('{yearsWord} ({years})', {
        estYear: 2000,
        slug: 'survivor',
        asOfDate: today,
      }),
    ).toBe('twenty-five (25)')
  })

  it('falls back to the Jan 1 default for unknown shows', () => {
    // est_year 2010, Jan 1 anchor — reads 16 on the test date.
    expect(
      renderShowTaglineTokens('{years}', {
        estYear: 2010,
        slug: 'unknown-show',
        asOfDate: today,
      }),
    ).toBe('16')
  })

  it('asOfDate defaults to new Date()', () => {
    // Just assert it does not throw and produces a substituted
    // string — the exact value depends on the wall clock.
    const out = renderShowTaglineTokens('{yearsWord}', {
      estYear: 2000,
      slug: 'survivor',
    })
    expect(out).not.toContain('{')
  })
})

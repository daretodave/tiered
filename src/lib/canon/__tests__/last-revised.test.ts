import { describe, expect, it } from 'vitest'
import {
  canonRevisedLabelFromIso,
  formatCanonRevisedLabel,
  getCanonRevisedLabel,
} from '../last-revised'

describe('formatCanonRevisedLabel', () => {
  it('formats April 2026 as "04 / 26"', () => {
    expect(formatCanonRevisedLabel(new Date('2026-04-12T00:00:00Z'))).toBe(
      '04 / 26',
    )
  })

  it('zero-pads single-digit months', () => {
    expect(formatCanonRevisedLabel(new Date('2026-01-01T12:00:00Z'))).toBe(
      '01 / 26',
    )
  })

  it('shows two-digit year for years beyond the century', () => {
    expect(formatCanonRevisedLabel(new Date('2030-12-31T12:00:00Z'))).toBe(
      '12 / 30',
    )
  })

  it('uses UTC accessors — UTC midnight Jan 1 is January, not December', () => {
    // A local-TZ formatter west of UTC would print "12 / 25" for this
    // input. The formatter pins UTC to keep the home (`new Date()` at
    // build) and show page (ISO frontmatter) in sync regardless of
    // where the build runs.
    expect(formatCanonRevisedLabel(new Date('2026-01-01T00:00:00Z'))).toBe(
      '01 / 26',
    )
  })
})

describe('canonRevisedLabelFromIso', () => {
  it('formats a real canon last_revised ISO date', () => {
    expect(canonRevisedLabelFromIso('2026-05-19')).toBe('05 / 26')
  })

  it('returns null for undefined input (canon without last_revised)', () => {
    expect(canonRevisedLabelFromIso(undefined)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(canonRevisedLabelFromIso('')).toBeNull()
  })

  it('returns null for unparseable input rather than rendering NaN garbage', () => {
    expect(canonRevisedLabelFromIso('not-a-date')).toBeNull()
  })

  it('parses dates at the UTC day boundary consistently', () => {
    // 2026-01-01 must read as January 2026, not December 2025, no
    // matter what TZ the runner sits in.
    expect(canonRevisedLabelFromIso('2026-01-01')).toBe('01 / 26')
  })
})

describe('getCanonRevisedLabel', () => {
  it('delegates to formatCanonRevisedLabel for the supplied date', () => {
    expect(getCanonRevisedLabel(new Date('2026-05-20T00:00:00Z'))).toBe(
      '05 / 26',
    )
  })

  it('defaults the argument to a fresh `new Date()`', () => {
    const out = getCanonRevisedLabel()
    expect(out).toMatch(/^\d{2}\s\/\s\d{2}$/)
  })
})

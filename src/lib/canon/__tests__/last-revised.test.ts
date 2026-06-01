import { describe, expect, it } from 'vitest'
import {
  canonRevisedLabelFromIso,
  formatCanonRevisedLabel,
} from '../last-revised'

describe('formatCanonRevisedLabel', () => {
  it('formats April 2026 as "April 2026"', () => {
    expect(formatCanonRevisedLabel(new Date('2026-04-12T00:00:00Z'))).toBe(
      'April 2026',
    )
  })

  it('renders single-digit months without zero padding', () => {
    expect(formatCanonRevisedLabel(new Date('2026-01-01T12:00:00Z'))).toBe(
      'January 2026',
    )
  })

  it('renders the full four-digit year for years beyond the century', () => {
    expect(formatCanonRevisedLabel(new Date('2030-12-31T12:00:00Z'))).toBe(
      'December 2030',
    )
  })

  it('uses UTC accessors — UTC midnight Jan 1 is January, not December', () => {
    // A local-TZ formatter west of UTC would print "December 2025" for
    // this input. The formatter pins UTC to keep the home (`new Date()`
    // at build) and show page (ISO frontmatter) in sync regardless of
    // where the build runs.
    expect(formatCanonRevisedLabel(new Date('2026-01-01T00:00:00Z'))).toBe(
      'January 2026',
    )
  })
})

describe('canonRevisedLabelFromIso', () => {
  it('formats a real canon last_revised ISO date', () => {
    expect(canonRevisedLabelFromIso('2026-05-19')).toBe('May 2026')
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
    expect(canonRevisedLabelFromIso('2026-01-01')).toBe('January 2026')
  })
})


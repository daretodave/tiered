import { describe, expect, it } from 'vitest'
import { detectSpoiler } from '../local'

describe('detectSpoiler', () => {
  it('returns null for clean text', () => {
    expect(detectSpoiler('I loved the location, the cast had real chemistry.')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(detectSpoiler('')).toBeNull()
  })

  it('catches "wins"', () => {
    const hit = detectSpoiler('I think she wins this one easily')
    expect(hit).not.toBeNull()
    expect(hit?.phrase.toLowerCase()).toBe('wins')
  })

  it('catches multi-word phrases like "gets eliminated"', () => {
    const hit = detectSpoiler('He gets eliminated before the merge.')
    expect(hit?.phrase.toLowerCase()).toBe('gets eliminated')
  })

  it('is case-insensitive', () => {
    expect(detectSpoiler('SHE WINS the season')).not.toBeNull()
    expect(detectSpoiler('Final Tribal was wild')).not.toBeNull()
  })

  it('returns the original-cased substring at the match position', () => {
    const hit = detectSpoiler('Whatever, Final Tribal locked it.')
    expect(hit?.phrase).toBe('Final Tribal')
    expect(hit?.at).toBe(10)
  })

  it('matches the first phrase it finds in list order', () => {
    // "wins" appears at position 6, "winner" wouldn't match here.
    const hit = detectSpoiler('She wins. Anyway.')
    expect(hit?.phrase.toLowerCase()).toBe('wins')
  })

  it('catches "season finale"', () => {
    expect(detectSpoiler('the season finale was perfect')).not.toBeNull()
  })

  it('catches "votes out"', () => {
    expect(detectSpoiler('then the tribe votes out the alpha')).not.toBeNull()
  })
})

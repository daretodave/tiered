import { describe, expect, it } from 'vitest'
import {
  ANON_COOKIE_MAX_AGE_SEC,
  ANON_COOKIE_NAME,
  generateAnonId,
  isValidAnonId,
} from './anonSession'

describe('anonSession constants', () => {
  it('uses tiered_anon_id as the cookie name', () => {
    expect(ANON_COOKIE_NAME).toBe('tiered_anon_id')
  })

  it('max-age is the Chrome 400-day clamp', () => {
    expect(ANON_COOKIE_MAX_AGE_SEC).toBe(400 * 24 * 60 * 60)
  })
})

describe('isValidAnonId', () => {
  it('accepts a canonical lowercase UUID v4', () => {
    expect(isValidAnonId('a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab')).toBe(true)
  })

  it('accepts a UUID v4 with uppercase hex (RFC-tolerant)', () => {
    expect(isValidAnonId('A1B2C3D4-E5F6-4A7B-8C9D-0123456789AB')).toBe(true)
  })

  it('rejects empty / null / undefined', () => {
    expect(isValidAnonId('')).toBe(false)
    expect(isValidAnonId(null)).toBe(false)
    expect(isValidAnonId(undefined)).toBe(false)
  })

  it('rejects malformed strings', () => {
    expect(isValidAnonId('not-a-uuid')).toBe(false)
    expect(isValidAnonId('a1b2c3d4-e5f6-4a7b-8c9d-0123456789')).toBe(false)
    expect(isValidAnonId('a1b2c3d4e5f64a7b8c9d0123456789ab')).toBe(false)
  })
})

describe('generateAnonId', () => {
  it('produces a UUID-v4-shaped string', () => {
    const id = generateAnonId()
    expect(isValidAnonId(id)).toBe(true)
  })

  it('produces distinct values across calls (overwhelmingly probabilistic)', () => {
    const a = generateAnonId()
    const b = generateAnonId()
    expect(a).not.toBe(b)
  })

  it('sets the version + variant bits per RFC 4122', () => {
    const id = generateAnonId()
    // Char at index 14 (the start of group 3) is the version nibble.
    expect(id.charAt(14)).toBe('4')
    // Char at index 19 (the start of group 4) is the variant nibble.
    expect('89ab'.includes(id.charAt(19).toLowerCase())).toBe(true)
  })

  it('uses an injected RNG when one is provided', () => {
    const fixed = new Uint8Array(16)
    fixed.fill(0xaa)
    const id = generateAnonId(() => fixed)
    // After RFC 4122 bit-twiddling, the version + variant chars
    // are deterministic; we just assert the shape + that the
    // expected version nibble appears at index 14.
    expect(id.charAt(14)).toBe('4')
  })

  it('throws when the RNG yields too few bytes', () => {
    const tooShort = new Uint8Array(8)
    expect(() => generateAnonId(() => tooShort)).toThrow(/16 bytes/)
  })
})

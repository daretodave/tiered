import { describe, expect, it } from 'vitest'
import {
  ANON_COOKIE_MAX_AGE_SEC,
  ANON_COOKIE_NAME,
  generateAnonId,
  isValidAnonId,
} from '../anonSession'

describe('anonSession constants', () => {
  it('uses tiered_anon_id as the cookie name', () => {
    expect(ANON_COOKIE_NAME).toBe('tiered_anon_id')
  })

  it('max-age is the Chrome 400-day clamp', () => {
    expect(ANON_COOKIE_MAX_AGE_SEC).toBe(400 * 24 * 60 * 60)
  })

  it('max-age in days is exactly 400 (no off-by-one in the constant)', () => {
    expect(ANON_COOKIE_MAX_AGE_SEC / (24 * 60 * 60)).toBe(400)
  })
})

describe('isValidAnonId', () => {
  it('accepts a canonical lowercase UUID v4', () => {
    expect(isValidAnonId('a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab')).toBe(true)
  })

  it('accepts a UUID v4 with uppercase hex (RFC-tolerant)', () => {
    expect(isValidAnonId('A1B2C3D4-E5F6-4A7B-8C9D-0123456789AB')).toBe(true)
  })

  it('accepts mixed-case hex (case-insensitive regex)', () => {
    expect(isValidAnonId('A1b2C3d4-E5f6-4A7b-8C9d-0123456789Ab')).toBe(true)
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

  it('rejects a value with leading/trailing whitespace (anchored regex)', () => {
    expect(isValidAnonId(' a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab')).toBe(false)
    expect(isValidAnonId('a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab ')).toBe(false)
    expect(isValidAnonId('a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab\n')).toBe(false)
  })

  it('rejects non-hex characters in an otherwise well-shaped UUID', () => {
    expect(isValidAnonId('g1b2c3d4-e5f6-4a7b-8c9d-0123456789ab')).toBe(false)
  })

  it('rejects an over-long string that contains a valid UUID (no substring match)', () => {
    expect(
      isValidAnonId('xa1b2c3d4-e5f6-4a7b-8c9d-0123456789abx'),
    ).toBe(false)
  })

  it('does not constrain the version/variant nibbles (shape-only check)', () => {
    // isValidAnonId is a shape gate, not an RFC-4122 validator: a
    // syntactically well-formed but v1-looking id still passes. This
    // is intentional — the cookie only needs a stable opaque token.
    expect(isValidAnonId('a1b2c3d4-e5f6-1a7b-0c9d-0123456789ab')).toBe(true)
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

  it('forces the RFC-4122 version nibble to 4 even when the RNG byte says otherwise', () => {
    // byte[6] all-ones → without masking the version char would be
    // 'f'; the (& 0x0f) | 0x40 twiddle must pin it to '4'.
    const buf = new Uint8Array(16)
    buf.fill(0xff)
    const id = generateAnonId(() => buf)
    expect(id.charAt(14)).toBe('4')
    // byte[8] all-ones → variant char must land in 8..b after
    // (& 0x3f) | 0x80; 0xff → 0xbf → 'b'.
    expect(id.charAt(19)).toBe('b')
    expect(isValidAnonId(id)).toBe(true)
  })

  it('forces the variant nibble high bit even when the RNG byte is zero', () => {
    // byte[8] all-zero → (& 0x3f) | 0x80 = 0x80 → variant char '8'.
    const buf = new Uint8Array(16)
    buf.fill(0x00)
    const id = generateAnonId(() => buf)
    expect(id.charAt(19)).toBe('8')
    expect(isValidAnonId(id)).toBe(true)
  })

  it('renders an all-zero RNG as the canonical nil-ish v4 layout', () => {
    const buf = new Uint8Array(16)
    const id = generateAnonId(() => buf)
    expect(id).toBe('00000000-0000-4000-8000-000000000000')
  })

  it('zero-pads single-digit hex bytes (no dropped nibbles)', () => {
    const buf = new Uint8Array(16)
    buf.fill(0x01)
    const id = generateAnonId(() => buf)
    // Each 0x01 byte must render as "01", not "1"; the fixed 36-char
    // shape is the proof.
    expect(id).toHaveLength(36)
    expect(isValidAnonId(id)).toBe(true)
    expect(id.startsWith('01010101-0101-')).toBe(true)
  })

  it('ignores RNG bytes past the first 16 (slice guard)', () => {
    const long = new Uint8Array(32)
    long.fill(0x00)
    long.fill(0xff, 16) // trailing bytes must not leak into the id
    const id = generateAnonId(() => long)
    expect(id).toBe('00000000-0000-4000-8000-000000000000')
  })

  it('accepts exactly 16 bytes (lower boundary is inclusive)', () => {
    const exact = new Uint8Array(16)
    expect(() => generateAnonId(() => exact)).not.toThrow()
  })

  it('throws when the RNG yields too few bytes', () => {
    const tooShort = new Uint8Array(8)
    expect(() => generateAnonId(() => tooShort)).toThrow(/16 bytes/)
  })

  it('throws on 15 bytes (one below the boundary)', () => {
    const justUnder = new Uint8Array(15)
    expect(() => generateAnonId(() => justUnder)).toThrow(/16 bytes/)
  })

  it('throws on a zero-length RNG result', () => {
    expect(() => generateAnonId(() => new Uint8Array(0))).toThrow(/16 bytes/)
  })

  it('the default RNG round-trips through isValidAnonId across many draws', () => {
    for (let n = 0; n < 50; n++) {
      expect(isValidAnonId(generateAnonId())).toBe(true)
    }
  })
})

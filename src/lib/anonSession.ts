// Pure helpers for the anon-guest cookie.
//
// The cookie's only job: carry a stable UUID-v4 the user retains
// across page loads so guest-vote brigading can be rate-limited
// per session even before the user signs in. The Supabase
// `sessions` row is created lazily (first vote / first comment)
// — this cookie is the durable identifier.

export const ANON_COOKIE_NAME = 'tiered_anon_id'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidAnonId(value: string | undefined | null): boolean {
  if (!value) return false
  return UUID_RE.test(value)
}

export function generateAnonId(rng: () => Uint8Array = secureRandomBytes): string {
  const buf = rng()
  if (buf.length < 16) {
    throw new Error('anon-id rng must yield at least 16 bytes')
  }
  // RFC 4122 v4 layout
  buf[6] = (buf[6]! & 0x0f) | 0x40
  buf[8] = (buf[8]! & 0x3f) | 0x80
  const hex = Array.from(buf.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

function secureRandomBytes(): Uint8Array {
  const buf = new Uint8Array(16)
  crypto.getRandomValues(buf)
  return buf
}

// 400 days — matches Chrome's max session-cookie clamp; the
// cookie is HttpOnly so JS can't read it. Effectively durable
// per-browser identity until the user clears cookies.
export const ANON_COOKIE_MAX_AGE_SEC = 400 * 24 * 60 * 60

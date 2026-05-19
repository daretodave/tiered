import { describe, expect, it } from 'vitest'
import {
  type Permission,
  PERMISSIONS_CLAIM,
  hasPermission,
  isMod,
  readPermissions,
} from '../permissions'

// Colocated per agents.md §5a. permissions.ts is the RBAC gate
// for the entire /mod surface — `isMod`/`hasPermission` decide
// who can read the moderation queue, which holds pending/hidden
// comments that may contain spoilers (standing rule §7, P0). A
// fail-open regression here exposes that surface to non-mods, so
// the gate's coverage must sit where §5a discovery scans.

describe('PERMISSIONS_CLAIM', () => {
  // Pinned because the Auth0 Action emits the claim under this
  // exact namespace (bearings line 116). Drift here silently
  // empties every permission read → locks every mod out, or, if
  // paired with a default-allow elsewhere, fails open.
  it('is the contracted namespace', () => {
    expect(PERMISSIONS_CLAIM).toBe('https://tiered.app/permissions')
  })
})

describe('readPermissions', () => {
  it('returns [] for null / undefined / empty', () => {
    expect(readPermissions(null)).toEqual([])
    expect(readPermissions(undefined)).toEqual([])
    expect(readPermissions({})).toEqual([])
  })

  it('returns [] for non-object user shapes', () => {
    expect(readPermissions('mod:read')).toEqual([])
    expect(readPermissions(42)).toEqual([])
    expect(readPermissions(true)).toEqual([])
    expect(readPermissions(() => ['mod:read'])).toEqual([])
  })

  it('returns the array claim verbatim', () => {
    const user = {
      [PERMISSIONS_CLAIM]: ['mod:read', 'mod:hide'],
    }
    expect(readPermissions(user)).toEqual(['mod:read', 'mod:hide'])
  })

  it('drops non-string entries from the array claim', () => {
    const user = {
      [PERMISSIONS_CLAIM]: ['mod:read', 42, null, 'mod:hide'],
    }
    expect(readPermissions(user)).toEqual(['mod:read', 'mod:hide'])
  })

  it('returns [] when the array claim holds only non-strings', () => {
    const user = { [PERMISSIONS_CLAIM]: [1, null, {}, undefined] }
    expect(readPermissions(user)).toEqual([])
  })

  it('keeps empty strings in the array path (asymmetry vs string path)', () => {
    // The array branch filters only by `typeof === 'string'`, so
    // '' survives — unlike the comma-split branch which drops
    // zero-length segments. Pinned so a future "tidy" of one
    // branch does not silently change the other's contract.
    const user = { [PERMISSIONS_CLAIM]: ['', 'mod:read'] }
    expect(readPermissions(user)).toEqual(['', 'mod:read'])
  })

  it('splits comma-separated string claims', () => {
    const user = {
      [PERMISSIONS_CLAIM]: 'mod:read, mod:hide ,mod:remove',
    }
    expect(readPermissions(user)).toEqual(['mod:read', 'mod:hide', 'mod:remove'])
  })

  it('trims and drops empty segments in the string path', () => {
    const user = { [PERMISSIONS_CLAIM]: 'mod:read,,  ,  mod:hide  ,' }
    expect(readPermissions(user)).toEqual(['mod:read', 'mod:hide'])
  })

  it('returns [] for a non-string non-array claim value', () => {
    expect(readPermissions({ [PERMISSIONS_CLAIM]: 42 })).toEqual([])
    expect(readPermissions({ [PERMISSIONS_CLAIM]: { 'mod:read': true } })).toEqual(
      [],
    )
    expect(readPermissions({ [PERMISSIONS_CLAIM]: true })).toEqual([])
  })

  it('ignores unrelated claim keys', () => {
    const user = {
      'https://other.example.com/permissions': ['mod:read'],
    }
    expect(readPermissions(user)).toEqual([])
  })
})

describe('hasPermission', () => {
  it('true when the claim contains the permission', () => {
    const user = { [PERMISSIONS_CLAIM]: ['mod:read', 'mod:hide'] }
    expect(hasPermission(user, 'mod:read')).toBe(true)
    expect(hasPermission(user, 'mod:hide')).toBe(true)
  })

  it('false when the claim lacks the permission', () => {
    const user = { [PERMISSIONS_CLAIM]: ['mod:read'] }
    expect(hasPermission(user, 'mod:remove')).toBe(false)
  })

  it('false on missing user / claim', () => {
    expect(hasPermission(null, 'mod:read')).toBe(false)
    expect(hasPermission({}, 'mod:read')).toBe(false)
  })

  it('authorizes every Permission member off a comma-string claim', () => {
    // Round-trips the full Permission union through the
    // string-shaped claim path. Pins the set so adding/removing
    // a mod capability without updating callers is caught here.
    const all: Permission[] = [
      'mod:read',
      'mod:approve',
      'mod:hide',
      'mod:remove',
      'mod:unhide',
      'mod:dismiss_flag',
    ]
    const user = { [PERMISSIONS_CLAIM]: all.join(', ') }
    for (const p of all) {
      expect(hasPermission(user, p)).toBe(true)
    }
    const onlyRead = { [PERMISSIONS_CLAIM]: ['mod:read'] }
    for (const p of all.filter((p) => p !== 'mod:read')) {
      expect(hasPermission(onlyRead, p)).toBe(false)
    }
  })
})

describe('isMod', () => {
  it('reads the mod:read permission specifically', () => {
    expect(isMod({ [PERMISSIONS_CLAIM]: ['mod:read'] })).toBe(true)
    expect(isMod({ [PERMISSIONS_CLAIM]: ['mod:approve'] })).toBe(false)
    expect(isMod({ [PERMISSIONS_CLAIM]: [] })).toBe(false)
  })

  it('false on null / undefined / empty user (gate fails closed)', () => {
    expect(isMod(null)).toBe(false)
    expect(isMod(undefined)).toBe(false)
    expect(isMod({})).toBe(false)
  })

  it('true off a comma-string claim that includes mod:read', () => {
    expect(isMod({ [PERMISSIONS_CLAIM]: 'mod:approve, mod:read' })).toBe(true)
    expect(isMod({ [PERMISSIONS_CLAIM]: 'mod:approve, mod:hide' })).toBe(false)
  })
})

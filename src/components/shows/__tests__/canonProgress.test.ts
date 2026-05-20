import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the content loader boundary so canonProgress() is driven
// off hand-built canon files rather than the on-disk content tree
// (cf. the vi.mock pattern in src/lib/__tests__/search.test.ts).
vi.mock('@/content', () => ({
  getCanon: vi.fn(),
}))

import type { CanonFile } from '@/content'
import { getCanon } from '@/content'
import { CANON_TARGET, canonProgress } from '../canonProgress'

const mockedGetCanon = getCanon as ReturnType<typeof vi.fn>

function canon(entryCount: number): CanonFile {
  const entries = Array.from({ length: entryCount }, (_, i) => ({
    rank: i + 1,
    season: i + 1,
    title: `Entry ${i + 1}`,
    rationale: 'x'.repeat(100),
  }))
  return { show: 'fixture', entries } as unknown as CanonFile
}

beforeEach(() => {
  mockedGetCanon.mockReset()
})

describe('CANON_TARGET', () => {
  // The B-tier "in progress · N / T" pill renders T as the target.
  // T is read by `ShowsTile`'s status pill on every /shows visit
  // for every B-tier show. A silent drift (3 → 4) ships the wrong
  // promotion floor to every B-tier reader without any visible
  // failure, so lock the exact value.
  it('is exactly 3 — the season-floor for canon-mode promotion (phase 26 brief)', () => {
    expect(CANON_TARGET).toBe(3)
  })

  it('is a number primitive (not a getter / accessor returning string)', () => {
    expect(typeof CANON_TARGET).toBe('number')
  })
})

describe('canonProgress(slug)', () => {
  it('returns { shipped: 0, target: 3 } when the show has no canon file (getCanon → null)', () => {
    mockedGetCanon.mockReturnValue(null)
    expect(canonProgress('no-canon-show')).toEqual({ shipped: 0, target: 3 })
  })

  it('forwards the slug verbatim to getCanon', () => {
    mockedGetCanon.mockReturnValue(null)
    canonProgress('amazing-race')
    expect(mockedGetCanon).toHaveBeenCalledWith('amazing-race')
    expect(mockedGetCanon).toHaveBeenCalledTimes(1)
  })

  it('returns shipped = canon.entries.length when the show has a populated canon', () => {
    mockedGetCanon.mockReturnValue(canon(5))
    expect(canonProgress('survivor')).toEqual({ shipped: 5, target: 3 })
  })

  it('treats an empty entries array as shipped: 0', () => {
    mockedGetCanon.mockReturnValue(canon(0))
    expect(canonProgress('drag-race')).toEqual({ shipped: 0, target: 3 })
  })

  it('reports shipped above the target (canon-mode shows past the floor) without clamping', () => {
    // Once a show clears the floor it stays in canon-mode and
    // continues to grow. The pill should keep reporting the true
    // count — not clamp to the target — so the editorial state is
    // legible to readers and to any later UI that consumes shipped.
    mockedGetCanon.mockReturnValue(canon(49))
    expect(canonProgress('survivor')).toEqual({ shipped: 49, target: 3 })
  })

  it('returns a fresh object on each call (no shared mutable state)', () => {
    mockedGetCanon.mockReturnValue(canon(1))
    const a = canonProgress('survivor')
    const b = canonProgress('survivor')
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })

  it('returns exactly the { shipped, target } shape — no extra keys', () => {
    mockedGetCanon.mockReturnValue(canon(2))
    const result = canonProgress('survivor')
    expect(Object.keys(result).sort()).toEqual(['shipped', 'target'])
  })

  it('shipped + target are number primitives', () => {
    mockedGetCanon.mockReturnValue(canon(2))
    const result = canonProgress('survivor')
    expect(typeof result.shipped).toBe('number')
    expect(typeof result.target).toBe('number')
  })
})

describe('canonProgress(slug, target)', () => {
  it('accepts an override target and threads it through', () => {
    mockedGetCanon.mockReturnValue(canon(2))
    expect(canonProgress('survivor', 7)).toEqual({ shipped: 2, target: 7 })
  })

  it("defaults the target arg to CANON_TARGET when omitted", () => {
    mockedGetCanon.mockReturnValue(canon(2))
    const omitted = canonProgress('survivor')
    const explicit = canonProgress('survivor', CANON_TARGET)
    expect(omitted.target).toBe(explicit.target)
    expect(omitted.target).toBe(CANON_TARGET)
  })

  it('treats target=0 as a legitimate override (no falsy fallback to CANON_TARGET)', () => {
    // A future B-only experiment might pass target=0 to force the
    // pill into a "0 / 0" no-floor state. The implementation uses
    // a default-parameter (= CANON_TARGET), not `|| CANON_TARGET`,
    // so 0 must survive. Locking this against a regression to the
    // `||` form.
    mockedGetCanon.mockReturnValue(canon(2))
    expect(canonProgress('survivor', 0).target).toBe(0)
  })
})

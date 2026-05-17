import { describe, expect, it } from 'vitest'
import {
  AUTO_COLLAPSE_THRESHOLD,
  buildThread,
  formatWhen,
  isCollapsed,
  isOwnHeldVisible,
  isVisibleToPublic,
  shapeComment,
  sortThread,
  type RawComment,
} from '../thread'

function raw(over: Partial<RawComment> = {}): RawComment {
  return {
    id: over.id ?? 'c1',
    body: over.body ?? 'A real thought about the season.',
    author: over.author ?? 'asha',
    created_at: over.created_at ?? '2026-05-10T00:00:00.000Z',
    status: over.status ?? 'published',
    score: over.score ?? 0,
    ...('author' in over ? { author: over.author ?? null } : {}),
  }
}

describe('visibility split (spoiler/mod P0)', () => {
  it('public sees only published', () => {
    expect(isVisibleToPublic('published')).toBe(true)
    expect(isVisibleToPublic('pending')).toBe(false)
    expect(isVisibleToPublic('hidden')).toBe(false)
    expect(isVisibleToPublic('removed')).toBe(false)
  })

  it('own held is pending only — never hidden/removed', () => {
    expect(isOwnHeldVisible('pending')).toBe(true)
    expect(isOwnHeldVisible('hidden')).toBe(false)
    expect(isOwnHeldVisible('removed')).toBe(false)
    expect(isOwnHeldVisible('published')).toBe(false)
  })

  it('buildThread drops hidden/removed from both public and own lists', () => {
    const { comments, publishedCount } = buildThread({
      published: [
        raw({ id: 'p1', status: 'published' }),
        raw({ id: 'h1', status: 'hidden' }),
        raw({ id: 'r1', status: 'removed' }),
      ],
      ownPending: [
        raw({ id: 'mine-pending', status: 'pending' }),
        raw({ id: 'mine-hidden', status: 'hidden' }),
      ],
    })
    const ids = comments.map((c) => c.id)
    expect(ids).toContain('p1')
    expect(ids).toContain('mine-pending')
    expect(ids).not.toContain('h1')
    expect(ids).not.toContain('r1')
    expect(ids).not.toContain('mine-hidden')
    expect(publishedCount).toBe(1)
  })
})

describe('sortThread', () => {
  it('pins own held rows above published', () => {
    const out = buildThread({
      published: [raw({ id: 'pub', status: 'published' })],
      ownPending: [raw({ id: 'held', status: 'pending' })],
    }).comments
    expect(out[0]?.id).toBe('held')
    expect(out[0]?.held).toBe(true)
    expect(out[1]?.id).toBe('pub')
  })

  it('orders by score desc then newest', () => {
    const a = shapeComment(
      raw({ id: 'a', score: 1, created_at: '2026-05-01T00:00:00Z' }),
      false,
    )
    const b = shapeComment(
      raw({ id: 'b', score: 5, created_at: '2026-05-02T00:00:00Z' }),
      false,
    )
    const c = shapeComment(
      raw({ id: 'c', score: 1, created_at: '2026-05-09T00:00:00Z' }),
      false,
    )
    expect(sortThread([a, b, c]).map((x) => x.id)).toEqual(['b', 'c', 'a'])
  })
})

describe('collapse threshold', () => {
  it('collapses at or below the threshold', () => {
    expect(isCollapsed(AUTO_COLLAPSE_THRESHOLD)).toBe(true)
    expect(isCollapsed(AUTO_COLLAPSE_THRESHOLD - 1)).toBe(true)
    expect(isCollapsed(AUTO_COLLAPSE_THRESHOLD + 1)).toBe(false)
    expect(isCollapsed(0)).toBe(false)
  })

  it('held rows are never collapsed (author always sees their own)', () => {
    const held = shapeComment(raw({ score: -9, status: 'pending' }), true)
    expect(held.collapsed).toBe(false)
  })
})

describe('shapeComment author fallback', () => {
  it('falls back to "reader" when author is blank/null', () => {
    expect(shapeComment(raw({ author: null }), false).author).toBe('reader')
    expect(shapeComment(raw({ author: '   ' }), false).author).toBe('reader')
    expect(shapeComment(raw({ author: 'rui' }), false).author).toBe('rui')
  })
})

describe('formatWhen', () => {
  const now = Date.parse('2026-05-17T12:00:00.000Z')
  it('labels recent + aging timestamps', () => {
    expect(formatWhen('2026-05-17T11:59:30.000Z', now)).toBe('just now')
    expect(formatWhen('2026-05-17T11:50:00.000Z', now)).toBe('10m ago')
    expect(formatWhen('2026-05-17T09:00:00.000Z', now)).toBe('3h ago')
    expect(formatWhen('2026-05-15T12:00:00.000Z', now)).toBe('2d ago')
    expect(formatWhen('2026-05-01T12:00:00.000Z', now)).toBe('2w ago')
  })
  it('is safe on a garbage timestamp', () => {
    expect(formatWhen('not-a-date', now)).toBe('just now')
  })
})

import { describe, expect, it } from 'vitest'
import {
  excerpt,
  formatMemberSince,
  isPopulatedProfile,
  parseSeasonTarget,
  publicDisplayName,
  shapeProfileComment,
} from '../context'

describe('parseSeasonTarget', () => {
  it('parses a well-formed season target', () => {
    expect(parseSeasonTarget('season', 'survivor:20')).toEqual({
      showSlug: 'survivor',
      seasonNumber: 20,
    })
  })

  it('keeps a colon-bearing show slug intact (splits on the last colon)', () => {
    expect(parseSeasonTarget('season', 'big-brother:over:9')).toEqual({
      showSlug: 'big-brother:over',
      seasonNumber: 9,
    })
  })

  it('returns null for comment targets (replies carry no season)', () => {
    expect(
      parseSeasonTarget('comment', '5f3c1a2b-0000-4000-8000-000000000000'),
    ).toBeNull()
  })

  it('returns null for malformed season targets', () => {
    expect(parseSeasonTarget('season', 'survivor')).toBeNull()
    expect(parseSeasonTarget('season', 'survivor:')).toBeNull()
    expect(parseSeasonTarget('season', ':20')).toBeNull()
    expect(parseSeasonTarget('season', 'survivor:0')).toBeNull()
    expect(parseSeasonTarget('season', 'survivor:nope')).toBeNull()
  })
})

describe('excerpt', () => {
  it('returns short bodies unchanged (whitespace-collapsed)', () => {
    expect(excerpt('A   tight\nline.')).toBe('A tight line.')
  })

  it('truncates on a word boundary with an ellipsis', () => {
    const body = `${'word '.repeat(80)}tail`
    const out = excerpt(body, 50)
    expect(out.endsWith('…')).toBe(true)
    expect(out.length).toBeLessThanOrEqual(51)
    expect(out).not.toContain('  ')
  })

  it('does not append an ellipsis when nothing was trimmed', () => {
    expect(excerpt('exactly enough', 240)).toBe('exactly enough')
  })
})

describe('shapeProfileComment', () => {
  it('shapes a season comment with resolved season context', () => {
    const out = shapeProfileComment({
      id: 'c1',
      body: '  The location work is a quiet argument for the format.  ',
      created_at: '2026-05-01T00:00:00Z',
      target_type: 'season',
      target_id: 'survivor:20',
    })
    expect(out).toEqual({
      id: 'c1',
      excerpt: 'The location work is a quiet argument for the format.',
      createdAt: '2026-05-01T00:00:00Z',
      season: { showSlug: 'survivor', seasonNumber: 20 },
    })
  })

  it('shapes a reply comment with no season context', () => {
    const out = shapeProfileComment({
      id: 'c2',
      body: 'Agreed.',
      created_at: '2026-05-02T00:00:00Z',
      target_type: 'comment',
      target_id: 'abc',
    })
    expect(out.season).toBeNull()
  })
})

describe('formatMemberSince', () => {
  it('formats month + year in UTC', () => {
    expect(formatMemberSince('2026-05-17T23:30:00Z')).toBe('May 2026')
  })

  it('is robust to an unparseable date', () => {
    expect(formatMemberSince('not-a-date')).toBe('a while ago')
  })
})

describe('isPopulatedProfile', () => {
  it('is populated with a published comment', () => {
    expect(
      isPopulatedProfile({ publishedCommentCount: 1, votedSeasonCount: 0 }),
    ).toBe(true)
  })

  it('is populated with a live season vote', () => {
    expect(
      isPopulatedProfile({ publishedCommentCount: 0, votedSeasonCount: 3 }),
    ).toBe(true)
  })

  it('is empty with no published comments and no votes', () => {
    expect(
      isPopulatedProfile({ publishedCommentCount: 0, votedSeasonCount: 0 }),
    ).toBe(false)
  })
})

describe('publicDisplayName', () => {
  it('keeps a genuine human display name', () => {
    expect(publicDisplayName('Dave Pemberton')).toBe('Dave Pemberton')
  })

  it('drops an email address (Auth0 magic-link sets name = email)', () => {
    expect(publicDisplayName('dave@example.com')).toBeNull()
  })

  it('drops any value containing an @ — email-shaped PII never renders', () => {
    expect(publicDisplayName('dave@localhost')).toBeNull()
    expect(publicDisplayName('@dave')).toBeNull()
  })

  it('returns null for a null value', () => {
    expect(publicDisplayName(null)).toBeNull()
  })

  it('returns null for an empty or whitespace-only value', () => {
    expect(publicDisplayName('')).toBeNull()
    expect(publicDisplayName('   ')).toBeNull()
  })

  it('trims surrounding whitespace on a kept name', () => {
    expect(publicDisplayName('  Dave  ')).toBe('Dave')
  })
})

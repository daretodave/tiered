import { describe, expect, it, vi } from 'vitest'
import type { CanonFile, Season } from '@/content/schemas'
import {
  excerpt,
  formatMemberSince,
  isPopulatedProfile,
  parseSeasonTarget,
  pickFeaturedSeason,
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

// `pickFeaturedSeason` derives the empty-state self-view CTA's
// destination. The CTA promises "vote on a season pair," so it must
// land on a season page (VotePair above the fold), not the show's
// canon ladder. The helper picks the canon's #1 entry's season; the
// fallback to a bare show page lives at the call site, defended via
// the contract that an unresolved season returns null.

function canonOf(entries: Array<{ rank: number; season: number }>): CanonFile {
  return {
    show: 'survivor',
    entries: entries.map((e) => ({
      ...e,
      title: `S${e.season}`,
      rationale:
        'Rationale text that comfortably clears the canonical rationale word floor so the helper test exercises only the picking logic, not schema validation downstream of it.',
    })),
  } as unknown as CanonFile
}

function seasonOf(n: number, slug = `s${n}`): Season {
  return { number: n, slug, title: `Season ${n}` } as unknown as Season
}

describe('pickFeaturedSeason', () => {
  it('returns null when canon is null', () => {
    expect(pickFeaturedSeason(null, () => seasonOf(1))).toBeNull()
  })

  it('picks the canon entry with the lowest rank — not the first-listed', () => {
    const canon = canonOf([
      { rank: 5, season: 12 },
      { rank: 1, season: 28 },
      { rank: 3, season: 7 },
    ])
    const resolve = vi.fn((n: number) => seasonOf(n, `season-${n}`))
    const out = pickFeaturedSeason(canon, resolve)
    expect(out?.slug).toBe('season-28')
    expect(resolve).toHaveBeenCalledWith(28)
    // It must look up the rank-1 entry exactly once — no fan-out
    // across every entry searching for the right one.
    expect(resolve).toHaveBeenCalledTimes(1)
  })

  it('returns null when the resolver cannot find the picked entry season', () => {
    const canon = canonOf([{ rank: 1, season: 99 }])
    expect(pickFeaturedSeason(canon, () => null)).toBeNull()
  })

  it('keys on canon-entry rank, not season number — a low-numbered season at rank 5 is NOT picked', () => {
    const canon = canonOf([
      { rank: 1, season: 47 },
      { rank: 5, season: 1 },
    ])
    const out = pickFeaturedSeason(canon, (n) => seasonOf(n))
    // A regression matching on `season` (the season number) instead
    // of `rank` would pick season 1; the right pick is the rank-1
    // entry which is season 47.
    expect(out?.number).toBe(47)
  })

  it('handles a single-entry canon', () => {
    const canon = canonOf([{ rank: 1, season: 28 }])
    const out = pickFeaturedSeason(canon, (n) => seasonOf(n, 'cagayan'))
    expect(out?.slug).toBe('cagayan')
  })
})

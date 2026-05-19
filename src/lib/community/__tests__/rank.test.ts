import { describe, expect, it } from 'vitest'
import type { CanonFile, Season, Show } from '@/content'
import {
  computeCommunityRank,
  type CommunityRankSource,
  sourceBannerCopy,
} from '../rank'

function fakeShow(slug: string): Show {
  return {
    slug,
    name: slug,
    palette: { primary: '#000000', ink: '#ffffff', paper: '#111111' },
    seasons: 0,
    status: 'airing',
    blurb: 'blurb',
    tagline: 'tagline',
    tier: 'B',
    network: 'N/A',
    est_year: 2000,
    genre_tag: 'Reality',
    featured: false,
  }
}

function fakeSeason(number: number, opts: Partial<Season> = {}): Season {
  return {
    show: 'survivor',
    number,
    title: `Season ${number}`,
    premiere_date: opts.premiere_date,
    format_changes: [],
    blurb_md: 'a'.repeat(60) + ' word '.repeat(55),
    ...opts,
  } as Season
}

// ---------------------------------------------------------------------------
// Prior coverage — retained verbatim from the pre-§5a sibling
// src/lib/community/rank.test.ts (same assertions, same fixtures). The
// colocated path is where the loop's §5a discovery looks; rank.ts is the
// community-rank engine behind the community pane on every show page,
// /shows/[show]/community, the live strip, and /api/ranking/[show].
// ---------------------------------------------------------------------------

describe('computeCommunityRank', () => {
  it('returns empty entries + seasons source when no seasons', () => {
    const result = computeCommunityRank(fakeShow('x'), [], null)
    expect(result.entries).toEqual([])
    expect(result.source).toBe('seasons')
  })

  it('mirrors canon order when canon exists, appending uncanoned seasons by number', () => {
    const seasons = [fakeSeason(1), fakeSeason(20), fakeSeason(28), fakeSeason(45)]
    const canon: CanonFile = {
      show: 'survivor',
      entries: [
        { rank: 1, season: 28, title: 'Cagayan', rationale: 'r'.repeat(500) },
        { rank: 2, season: 1, title: 'Borneo', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('survivor'), seasons, canon)
    expect(result.source).toBe('canon')
    expect(result.entries.map((e) => e.season.number)).toEqual([28, 1, 20, 45])
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2, 3, 4])
  })

  it('falls back to season-number order when canon is null', () => {
    const seasons = [fakeSeason(7), fakeSeason(1), fakeSeason(3)]
    const result = computeCommunityRank(fakeShow('x'), seasons, null)
    expect(result.source).toBe('seasons')
    expect(result.entries.map((e) => e.season.number)).toEqual([1, 3, 7])
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2, 3])
  })

  it('falls back to season-number order when canon entries are empty', () => {
    const seasons = [fakeSeason(2), fakeSeason(1)]
    const result = computeCommunityRank(fakeShow('x'), seasons, {
      show: 'x',
      entries: [],
    } as CanonFile)
    expect(result.source).toBe('seasons')
    expect(result.entries.map((e) => e.season.number)).toEqual([1, 2])
  })

  it("skips canon entries whose season isn't in the seasons list (the hole case)", () => {
    const seasons = [fakeSeason(1), fakeSeason(2)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 1, season: 99, title: 'Ghost', rationale: 'r'.repeat(500) },
        { rank: 2, season: 1, title: 'One', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries.map((e) => e.season.number)).toEqual([1, 2])
    expect(result.source).toBe('canon')
  })

  it('uses premiere_date year as the tag when available', () => {
    const result = computeCommunityRank(
      fakeShow('x'),
      [fakeSeason(1, { premiere_date: '2009-02-02' })],
      null,
    )
    expect(result.entries[0]?.tag).toBe('2009')
  })

  it('falls back to a season-and-show label when premiere_date is missing', () => {
    const result = computeCommunityRank(fakeShow('x'), [fakeSeason(1)], null)
    expect(result.entries[0]?.tag).toBe('Season 1 · x')
  })
})

describe('sourceBannerCopy', () => {
  it('returns canon-mirror copy for the canon source', () => {
    expect(sourceBannerCopy('canon')).toMatch(/mirrors the editor's canon/i)
  })
  it('returns air-order copy for the seasons source', () => {
    expect(sourceBannerCopy('seasons')).toMatch(/air order/i)
  })
  it('returns votes-flowing copy for the votes source', () => {
    expect(sourceBannerCopy('votes')).toMatch(/as the votes come in/i)
  })
})

// ---------------------------------------------------------------------------
// New edge coverage — branches the prior suite never exercised.
// ---------------------------------------------------------------------------

describe('computeCommunityRank — canon ordering edges', () => {
  it('re-sorts canon by ascending rank before mapping (canon order need not be pre-sorted)', () => {
    const seasons = [fakeSeason(1), fakeSeason(2), fakeSeason(3)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 10, season: 2, title: 'B', rationale: 'r'.repeat(500) },
        { rank: 4, season: 3, title: 'C', rationale: 'r'.repeat(500) },
        { rank: 7, season: 1, title: 'A', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    // sorted by canon rank asc → 3 (rank 4), 1 (rank 7), 2 (rank 10)
    expect(result.entries.map((e) => e.season.number)).toEqual([3, 1, 2])
    // output rank is positional 1..n, not the canon rank value
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2, 3])
    expect(result.source).toBe('canon')
  })

  it('dedupes a season that appears twice in canon (seen-set branch), keeping the first occurrence', () => {
    const seasons = [fakeSeason(1), fakeSeason(2)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 1, season: 1, title: 'first', rationale: 'r'.repeat(500) },
        { rank: 2, season: 1, title: 'dupe', rationale: 'r'.repeat(500) },
        { rank: 3, season: 2, title: 'two', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries.map((e) => e.season.number)).toEqual([1, 2])
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2])
    expect(result.source).toBe('canon')
  })

  it('appends trailing (uncanoned) seasons in ascending number order even when the input list is unsorted', () => {
    const seasons = [fakeSeason(40), fakeSeason(2), fakeSeason(15), fakeSeason(8)]
    const canon: CanonFile = {
      show: 's',
      entries: [{ rank: 1, season: 15, title: 'mid', rationale: 'r'.repeat(500) }],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries.map((e) => e.season.number)).toEqual([15, 2, 8, 40])
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2, 3, 4])
    expect(result.source).toBe('canon')
  })

  it('returns canon source with all seasons by number when every canon entry is a hole', () => {
    const seasons = [fakeSeason(2), fakeSeason(1)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 1, season: 98, title: 'ghost', rationale: 'r'.repeat(500) },
        { rank: 2, season: 99, title: 'ghost2', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries.map((e) => e.season.number)).toEqual([1, 2])
    expect(result.source).toBe('canon')
  })

  it('emits no trailing entries when canon covers every season', () => {
    const seasons = [fakeSeason(1), fakeSeason(2)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 1, season: 2, title: 'two', rationale: 'r'.repeat(500) },
        { rank: 2, season: 1, title: 'one', rationale: 'r'.repeat(500) },
      ],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries.map((e) => e.season.number)).toEqual([2, 1])
    expect(result.entries).toHaveLength(2)
  })
})

describe('computeCommunityRank — tag + identity', () => {
  it('derives the tag from premiere_date even on the canon path', () => {
    const seasons = [fakeSeason(1, { premiere_date: '2011-09-14' })]
    const canon: CanonFile = {
      show: 's',
      entries: [{ rank: 1, season: 1, title: 'one', rationale: 'r'.repeat(500) }],
    }
    const result = computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(result.entries[0]?.tag).toBe('2011')
  })

  it('uses the UTC year for the tag (full ISO timestamp, year boundary)', () => {
    const result = computeCommunityRank(
      fakeShow('x'),
      [fakeSeason(1, { premiere_date: '2010-12-31T23:30:00Z' })],
      null,
    )
    expect(result.entries[0]?.tag).toBe('2010')
  })

  it('uses the show name (not slug) in the fallback label', () => {
    const show = { ...fakeShow('rpdr'), name: "RuPaul's Drag Race" }
    const result = computeCommunityRank(show, [fakeSeason(5)], null)
    expect(result.entries[0]?.tag).toBe("Season 5 · RuPaul's Drag Race")
  })

  it('returns the same Season object reference from the input list', () => {
    const s = fakeSeason(1)
    const result = computeCommunityRank(fakeShow('x'), [s], null)
    expect(result.entries[0]?.season).toBe(s)
  })

  it('does not mutate the caller-supplied seasons array', () => {
    const seasons = [fakeSeason(7), fakeSeason(1), fakeSeason(3)]
    computeCommunityRank(fakeShow('x'), seasons, null)
    expect(seasons.map((s) => s.number)).toEqual([7, 1, 3])
  })

  it('does not mutate the caller-supplied canon entries array', () => {
    const seasons = [fakeSeason(1), fakeSeason(2)]
    const canon: CanonFile = {
      show: 's',
      entries: [
        { rank: 2, season: 1, title: 'a', rationale: 'r'.repeat(500) },
        { rank: 1, season: 2, title: 'b', rationale: 'r'.repeat(500) },
      ],
    }
    computeCommunityRank(fakeShow('s'), seasons, canon)
    expect(canon.entries.map((e) => e.rank)).toEqual([2, 1])
  })
})

describe('sourceBannerCopy — exhaustive exact strings', () => {
  it('returns the exact canon string', () => {
    expect(sourceBannerCopy('canon')).toBe(
      "Mirrors the Editor's Canon until enough community votes land.",
    )
  })

  it('returns the exact votes string', () => {
    expect(sourceBannerCopy('votes')).toBe('Updated as the votes come in.')
  })

  it('returns the exact seasons string', () => {
    expect(sourceBannerCopy('seasons')).toBe(
      'Showing seasons in air order until enough community votes land.',
    )
  })

  it('returns a non-empty string for every CommunityRankSource', () => {
    const sources: CommunityRankSource[] = ['canon', 'seasons', 'votes']
    for (const s of sources) {
      expect(sourceBannerCopy(s).length).toBeGreaterThan(0)
    }
  })
})

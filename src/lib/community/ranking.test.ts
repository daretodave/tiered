import { describe, expect, it } from 'vitest'
import type { CanonFile, Season, Show } from '@/content'
import {
  type VoteAggregateRow,
  buildLiveRanking,
} from './ranking'

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

const canon: CanonFile = {
  show: 'survivor',
  entries: [
    { rank: 1, season: 28, title: 'Cagayan', rationale: 'r'.repeat(500) },
    { rank: 2, season: 1, title: 'Borneo', rationale: 'r'.repeat(500) },
    { rank: 3, season: 20, title: 'HvV', rationale: 'r'.repeat(500) },
  ],
}

const seasons = [fakeSeason(1), fakeSeason(20), fakeSeason(28), fakeSeason(45)]

function row(
  seasonNumber: number,
  score: number,
  rank: number,
  opts: Partial<VoteAggregateRow> = {},
): VoteAggregateRow {
  return {
    seasonNumber,
    score,
    approval: 'approval' in opts ? (opts.approval ?? null) : 0.5,
    voteCount: opts.voteCount ?? 3,
    rank,
  }
}

describe('buildLiveRanking', () => {
  it('keeps the canon-mirror order below the vote threshold', () => {
    const result = buildLiveRanking({
      show: fakeShow('survivor'),
      seasons,
      canon,
      rows: [row(45, 99, 1)],
      votersThisWeek: 2, // below VOTE_THRESHOLD (5)
      baseline: [],
      lastRecomputeAt: null,
      version: null,
    })
    expect(result.source).toBe('canon')
    // canon order: 28, 1, 20, then uncanoned 45 appended
    expect(result.entries.map((e) => e.season.number)).toEqual([28, 1, 20, 45])
    // counters still surface for the season that has votes
    const s45 = result.entries.find((e) => e.season.number === 45)
    expect(s45?.score).toBe(99)
    expect(s45?.voteCount).toBe(3)
  })

  it('orders by live vote rank at/above the threshold, appending unvoted in canon order', () => {
    const result = buildLiveRanking({
      show: fakeShow('survivor'),
      seasons,
      canon,
      // votes only on 1 and 20; 28 and 45 unvoted
      rows: [row(20, 50, 1), row(1, 10, 2)],
      votersThisWeek: 8,
      baseline: [],
      lastRecomputeAt: '2026-05-10T00:00:00.000Z',
      version: 7,
    })
    expect(result.source).toBe('votes')
    // live: 20, 1 — then canon-order remainder: 28, 45
    expect(result.entries.map((e) => e.season.number)).toEqual([20, 1, 28, 45])
    expect(result.entries.map((e) => e.rank)).toEqual([1, 2, 3, 4])
    expect(result.version).toBe(7)
    expect(result.lastRecomputeAt).toBe('2026-05-10T00:00:00.000Z')
  })

  it('computes trend as baseline rank minus current rank (positive = climbed)', () => {
    const result = buildLiveRanking({
      show: fakeShow('survivor'),
      seasons,
      canon,
      rows: [row(20, 50, 1), row(1, 10, 2)],
      votersThisWeek: 8,
      baseline: [
        { seasonNumber: 20, rank: 3 }, // was 3rd, now 1st → +2
        { seasonNumber: 1, rank: 1 }, // was 1st, now 2nd → -1
      ],
      lastRecomputeAt: null,
      version: 1,
    })
    const s20 = result.entries.find((e) => e.season.number === 20)
    const s1 = result.entries.find((e) => e.season.number === 1)
    expect(s20?.trend).toBe(2)
    expect(s1?.trend).toBe(-1)
    // no baseline row for 28 → null trend
    const s28 = result.entries.find((e) => e.season.number === 28)
    expect(s28?.trend).toBeNull()
  })

  it('passes approval through (null when undecided)', () => {
    const result = buildLiveRanking({
      show: fakeShow('survivor'),
      seasons,
      canon,
      rows: [
        row(20, 50, 1, { approval: 0.82 }),
        row(1, 0, 2, { approval: null }),
      ],
      votersThisWeek: 8,
      baseline: [],
      lastRecomputeAt: null,
      version: null,
    })
    expect(result.entries.find((e) => e.season.number === 20)?.approval).toBe(
      0.82,
    )
    expect(
      result.entries.find((e) => e.season.number === 1)?.approval,
    ).toBeNull()
  })

  it('falls back to the mirror when there are no vote rows even over threshold', () => {
    const result = buildLiveRanking({
      show: fakeShow('survivor'),
      seasons,
      canon,
      rows: [],
      votersThisWeek: 50,
      baseline: [],
      lastRecomputeAt: null,
      version: null,
    })
    expect(result.source).toBe('canon')
    expect(result.entries.map((e) => e.season.number)).toEqual([28, 1, 20, 45])
    expect(result.entries.every((e) => e.score === 0)).toBe(true)
  })
})

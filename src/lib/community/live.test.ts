import { describe, expect, it } from 'vitest'
import type { Season } from '@/content'
import type { CommunityRankRow } from './ranking'
import {
  communitySignalForSeason,
  formatLastRecompute,
  formatVersion,
  moverNote,
  NEXT_RECOMPUTE_LABEL,
  pickMovers,
  RECOMPUTE_DAY,
  SHIFT_TIME_LABEL,
  trendSentiment,
  weeklyQuestionMeta,
} from './live'
import type { CommunityMover } from './live'

function season(number: number): Season {
  return {
    show: 'survivor',
    number,
    slug: `season-${number}`,
    title: `Season ${number}`,
    body_md: 'b',
  } as unknown as Season
}

function row(
  rank: number,
  n: number,
  trend: number | null,
): CommunityRankRow {
  return {
    rank,
    season: season(n),
    tag: '2010',
    score: 1,
    approval: 0.9,
    voteCount: 10,
    trend,
  }
}

describe('trendSentiment', () => {
  it('maps climb/fall/hold', () => {
    expect(trendSentiment(3)).toBe('warm-up')
    expect(trendSentiment(-2)).toBe('warm-down')
    expect(trendSentiment(0)).toBe('hold')
    expect(trendSentiment(null)).toBe('hold')
  })
})

describe('pickMovers', () => {
  it('keeps only seasons that moved, strongest first, prevRank reconstructed', () => {
    const movers = pickMovers([
      row(1, 20, 0), // held — excluded
      row(2, 1, null), // no baseline — excluded
      row(3, 5, 2), // +2  (was #5, now #3)
      row(8, 8, -5), // -5  (was #3, now #8) — biggest absolute
      row(5, 9, 5), // +5  (was #10, now #5) — ties magnitude, better rank first
    ])
    expect(movers.map((m) => m.season.number)).toEqual([9, 8, 5])
    const first = movers[0]!
    expect(first.delta).toBe(5)
    expect(first.rank).toBe(5)
    expect(first.prevRank).toBe(10)
  })

  it('reconstructs prevRank = rank + delta and respects limit', () => {
    const movers = pickMovers([row(10, 37, 5)], 2)
    expect(movers).toHaveLength(1)
    expect(movers[0]!.prevRank).toBe(15)
    expect(movers[0]!.sentiment).toBe('warm-up')
  })

  it('honors the limit', () => {
    const movers = pickMovers(
      [row(1, 1, 9), row(2, 2, 8), row(3, 3, 7), row(4, 4, 6), row(5, 5, 5)],
      3,
    )
    expect(movers).toHaveLength(3)
    expect(movers.map((m) => m.delta)).toEqual([9, 8, 7])
  })
})

describe('formatLastRecompute', () => {
  const now = new Date('2026-05-17T12:00:00Z')
  it('handles null + future + buckets', () => {
    expect(formatLastRecompute(null, now)).toBe('votes pending')
    expect(formatLastRecompute('2026-05-17T13:00:00Z', now)).toBe('just now')
    expect(formatLastRecompute('2026-05-17T11:59:30Z', now)).toBe('just now')
    expect(formatLastRecompute('2026-05-17T11:45:00Z', now)).toBe('15m ago')
    expect(formatLastRecompute('2026-05-17T09:46:00Z', now)).toBe('2h 14m ago')
    expect(formatLastRecompute('2026-05-17T09:00:00Z', now)).toBe('3h ago')
    expect(formatLastRecompute('2026-05-15T12:00:00Z', now)).toBe('2d ago')
    expect(formatLastRecompute('2026-05-16T12:00:00Z', now)).toBe('1d ago')
  })
})

describe('formatVersion', () => {
  it('formats or marks pending', () => {
    expect(formatVersion(null)).toBe('pending')
    expect(formatVersion(42)).toBe('v42')
  })
})

describe('NEXT_RECOMPUTE_LABEL', () => {
  it('is the v1 cadence', () => {
    expect(NEXT_RECOMPUTE_LABEL).toBe('Thursday 9pm ET')
  })
})

describe('SHIFT_TIME_LABEL', () => {
  it('is the weekly-cadence framing', () => {
    expect(SHIFT_TIME_LABEL).toBe('this week')
  })
})

describe('RECOMPUTE_DAY', () => {
  it('is the single source for the cadence label', () => {
    expect(RECOMPUTE_DAY).toBe('Thursday')
    expect(NEXT_RECOMPUTE_LABEL.startsWith(RECOMPUTE_DAY)).toBe(true)
  })
})

describe('weeklyQuestionMeta', () => {
  it('shows the trailing-7d tally + close day when voters are in', () => {
    expect(weeklyQuestionMeta(3214)).toBe('3,214 voted · closes Thursday')
    expect(weeklyQuestionMeta(1)).toBe('1 voted · closes Thursday')
  })

  it('stays honest below the threshold — no fabricated count', () => {
    expect(weeklyQuestionMeta(0)).toBe('votes pending · closes Thursday')
    expect(weeklyQuestionMeta(-1)).toBe('votes pending · closes Thursday')
  })
})

describe('communitySignalForSeason', () => {
  const live = [row(5, 9, -3), row(1, 20, 2)]
  const hint = { rank: 2, delta: 1, sentiment: 'up' as const }

  it('reflects the live ranking + snapshot trend when votes are in', () => {
    expect(communitySignalForSeason(20, live, 'votes', hint)).toEqual({
      rank: 1,
      delta: 2,
      sentiment: 'up',
    })
    expect(communitySignalForSeason(9, live, 'votes', hint)).toEqual({
      rank: 5,
      delta: -3,
      sentiment: 'down',
    })
  })

  it('treats a null/zero trend as hold', () => {
    expect(communitySignalForSeason(7, [row(3, 7, null)], 'votes', null)).toEqual({
      rank: 3,
      delta: 0,
      sentiment: 'hold',
    })
  })

  it('falls back to the static hint below the vote threshold', () => {
    expect(communitySignalForSeason(20, live, 'canon', hint)).toEqual(hint)
    expect(communitySignalForSeason(20, live, 'seasons', hint)).toEqual(hint)
  })

  it('falls back to the hint when the season is absent from the live ranking', () => {
    expect(communitySignalForSeason(99, live, 'votes', hint)).toEqual(hint)
  })

  it('returns null when neither live data nor a hint exists', () => {
    expect(communitySignalForSeason(99, live, 'votes', null)).toBeNull()
    expect(communitySignalForSeason(99, live, 'canon', undefined)).toBeNull()
  })
})

describe('moverNote', () => {
  function mover(delta: number): CommunityMover {
    return {
      season: season(7),
      tag: '2010',
      rank: 7,
      prevRank: 7 + delta,
      delta,
      sentiment: trendSentiment(delta),
    }
  }

  it('describes a climb, pluralizing spots', () => {
    expect(moverNote(mover(3))).toBe(
      'Climbed 3 spots since the last weekly recompute.',
    )
  })

  it('describes a slide', () => {
    expect(moverNote(mover(-2))).toBe(
      'Slid 2 spots since the last weekly recompute.',
    )
  })

  it('uses singular phrasing for a one-spot move', () => {
    expect(moverNote(mover(1))).toBe(
      'Climbed one spot since the last weekly recompute.',
    )
    expect(moverNote(mover(-1))).toBe(
      'Slid one spot since the last weekly recompute.',
    )
  })

  it('never invents editorial copy — output is fully derived from the delta', () => {
    for (const d of [1, 2, 5, 12, -1, -3, -9]) {
      const note = moverNote(mover(d))
      expect(note).toMatch(
        /^(Climbed|Slid) (one spot|\d+ spots) since the last weekly recompute\.$/,
      )
    }
  })
})

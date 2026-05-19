import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ContentValidationError } from '../errors'
import {
  calendarEntrySchema,
  getCalendar,
  parseCalendar,
  partitionFinales,
} from '../calendar'
import { setContentRoot } from '../paths'

describe('calendarEntrySchema', () => {
  const valid = {
    show: 'survivor',
    season: 48,
    finale_date: '2025-05-21',
    status: 'aired' as const,
  }

  it('accepts a well-formed row', () => {
    expect(calendarEntrySchema.parse(valid)).toEqual(valid)
  })

  it('rejects a non-ISO finale_date', () => {
    expect(
      calendarEntrySchema.safeParse({ ...valid, finale_date: '05/21/2025' })
        .success,
    ).toBe(false)
  })

  it('rejects an unknown status', () => {
    expect(
      calendarEntrySchema.safeParse({ ...valid, status: 'cancelled' }).success,
    ).toBe(false)
  })

  it('rejects a non-positive season', () => {
    expect(
      calendarEntrySchema.safeParse({ ...valid, season: 0 }).success,
    ).toBe(false)
    expect(
      calendarEntrySchema.safeParse({ ...valid, season: -3 }).success,
    ).toBe(false)
  })

  it('rejects a missing field', () => {
    const { status, ...rest } = valid
    expect(calendarEntrySchema.safeParse(rest).success).toBe(false)
  })

  it('rejects an unknown extra key (strict)', () => {
    expect(
      calendarEntrySchema.safeParse({ ...valid, winner: 'someone' }).success,
    ).toBe(false)
  })

  it('rejects a non-kebab-case show slug', () => {
    expect(
      calendarEntrySchema.safeParse({ ...valid, show: 'Survivor' }).success,
    ).toBe(false)
  })
})

describe('parseCalendar', () => {
  it('parses YAML with an unquoted date scalar into an ISO string', () => {
    const cal = parseCalendar(
      `finales:
  - show: survivor
    season: 50
    finale_date: 2026-05-20
    status: scheduled`,
      'calendar.yml',
    )
    expect(cal.finales).toHaveLength(1)
    expect(cal.finales[0]).toEqual({
      show: 'survivor',
      season: 50,
      finale_date: '2026-05-20',
      status: 'scheduled',
    })
  })

  it('defaults to an empty finales array when the key is absent', () => {
    expect(parseCalendar('# just a comment\n', 'calendar.yml')).toEqual({
      finales: [],
    })
  })

  it('throws ContentValidationError on a malformed row', () => {
    expect(() =>
      parseCalendar(
        `finales:
  - show: survivor
    season: not-a-number
    finale_date: 2025-05-21
    status: aired`,
        'calendar.yml',
      ),
    ).toThrow(ContentValidationError)
  })

  it('throws ContentValidationError on unparseable YAML', () => {
    expect(() =>
      parseCalendar('finales:\n  - show: [unclosed\n', 'calendar.yml'),
    ).toThrow(ContentValidationError)
  })
})

describe('getCalendar', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'cal-'))
    setContentRoot(dir)
  })

  afterEach(() => {
    setContentRoot(null)
    rmSync(dir, { recursive: true, force: true })
  })

  it('returns an empty calendar when the file is absent', () => {
    expect(getCalendar()).toEqual({ finales: [] })
  })

  it('reads and validates content/calendar.yml when present', () => {
    writeFileSync(
      path.join(dir, 'calendar.yml'),
      `finales:
  - show: top-chef
    season: 22
    finale_date: 2025-06-12
    status: aired`,
    )
    const cal = getCalendar()
    expect(cal.finales).toEqual([
      {
        show: 'top-chef',
        season: 22,
        finale_date: '2025-06-12',
        status: 'aired',
      },
    ])
  })
})

describe('partitionFinales', () => {
  const entry = (
    show: string,
    season: number,
    finale_date: string,
  ): ReturnType<typeof calendarEntrySchema.parse> =>
    calendarEntrySchema.parse({
      show,
      season,
      finale_date,
      status: 'aired',
    })

  it('splits strictly-past from today-or-future', () => {
    const entries = [
      entry('survivor', 48, '2025-05-21'),
      entry('survivor', 50, '2026-05-20'),
      entry('amazing-race', 38, '2025-12-10'),
    ]
    const { past, future } = partitionFinales(entries, '2026-05-19')
    expect(past.map((e) => e.season).sort()).toEqual([38, 48])
    expect(future.map((e) => e.season)).toEqual([50])
  })

  it('treats finale_date === today as not-yet (future)', () => {
    const { past, future } = partitionFinales(
      [entry('survivor', 48, '2026-05-19')],
      '2026-05-19',
    )
    expect(past).toHaveLength(0)
    expect(future).toHaveLength(1)
  })

  it('returns two empty buckets for no entries', () => {
    expect(partitionFinales([], '2026-05-19')).toEqual({
      past: [],
      future: [],
    })
  })
})

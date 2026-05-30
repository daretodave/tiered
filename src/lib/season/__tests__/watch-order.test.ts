import { describe, it, expect } from 'vitest'
import {
  WATCH_ORDER_MID_RUN,
  WATCH_ORDER_PREMIERE,
  WATCH_ORDER_RETURNEE,
  isReturneeFlavored,
  seasonWatchOrderLine,
} from '../watch-order'

describe('seasonWatchOrderLine', () => {
  it('returns the returnee chip when format_changes carries an all-returnee-cast token', () => {
    expect(
      seasonWatchOrderLine({
        number: 20,
        format_changes: ['all-returnee-cast', 'hero-villain-tribes'],
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the returnee chip when format_changes carries a returnee-injection token', () => {
    expect(
      seasonWatchOrderLine({
        number: 26,
        format_changes: ['fans-vs-favorites', 'returnee-injection'],
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the returnee chip when format_changes carries first-all-stars', () => {
    expect(
      seasonWatchOrderLine({
        number: 11,
        format_changes: ['first-all-stars'],
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the returnee chip when only format_summary names returnees (Big Brother S07 All-Stars)', () => {
    expect(
      seasonWatchOrderLine({
        number: 7,
        format_changes: [],
        format_summary: '14 returnees · cast by public vote',
        format_caption: "the format's first all-star swing",
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the returnee chip when format_caption names veterans (Big Brother S14 Coaches Twist)', () => {
    expect(
      seasonWatchOrderLine({
        number: 14,
        format_changes: [],
        format_summary: '16 houseguests · 4 coaches, 12 newbies',
        format_caption: 'veterans mentor the new cast, then enter the game',
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the returnee chip on Project Runway S20 All-Stars via format_summary', () => {
    expect(
      seasonWatchOrderLine({
        number: 20,
        format_changes: [],
        format_summary: 'All-stars · returning veterans',
        format_caption: "designers from across the show's run",
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('returns the premiere chip for Borneo (Survivor S1)', () => {
    expect(
      seasonWatchOrderLine({
        number: 1,
        format_changes: [],
        format_summary: 'Originals · 2 tribes',
        format_caption: 'the season that invented the format',
      }),
    ).toBe(WATCH_ORDER_PREMIERE)
  })

  it('returns the mid-run chip for an original-cast non-premiere (Survivor S5 Thailand-shaped season)', () => {
    expect(
      seasonWatchOrderLine({
        number: 5,
        format_changes: [],
        format_summary: 'Originals · 2 tribes',
        format_caption: 'a standard early season',
      }),
    ).toBe(WATCH_ORDER_MID_RUN)
  })

  it('returns the mid-run chip when an original-cast season has a structural-only format_changes entry', () => {
    expect(
      seasonWatchOrderLine({
        number: 11,
        format_changes: ['gender-divided-tribes'],
      }),
    ).toBe(WATCH_ORDER_MID_RUN)
  })

  it('returnee chip text never names the outcome (spoiler P0)', () => {
    // The chip frames watch-order context, not winner / elimination.
    expect(WATCH_ORDER_RETURNEE).toMatch(/Watch order/)
    expect(WATCH_ORDER_RETURNEE).not.toMatch(/wins?|winner|won|eliminated/i)
  })

  it('returnee chip explicitly does not say "no prerequisites"', () => {
    // The critique-pass-19 HIGH: returnee seasons must not surface
    // the standalone copy.
    expect(WATCH_ORDER_RETURNEE).not.toMatch(/no prerequisites/i)
    expect(WATCH_ORDER_RETURNEE).not.toMatch(/start here/i)
  })

  it('catches the singular-abbreviated "Vet-" signal (The Challenge S12 Fresh Meat)', () => {
    expect(
      seasonWatchOrderLine({
        number: 12,
        format_changes: [],
        format_summary: 'Vet-rookie pairs',
        format_caption: 'first paired format',
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('catches a returnee signal that lives only in eyebrow (The Challenge S29 Invasion of the Champions)', () => {
    expect(
      seasonWatchOrderLine({
        number: 29,
        format_changes: [],
        format_summary: 'Two-phase · Newcomers, then champions',
        format_caption: 'mid-season cast arrival twist',
        eyebrow: 'Aired winter 2017 · Staged returnee arrival',
        lede: 'A newer cast runs the standard team-versus-team format for the first stretch.',
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('catches a returnee signal that lives only in lede', () => {
    expect(
      seasonWatchOrderLine({
        number: 12,
        format_changes: [],
        format_summary: 'Pairs format',
        format_caption: 'first paired season',
        eyebrow: 'Aired 2006 · Pairings',
        lede: "The franchise's first vet-and-rookie experiment. Each Challenge veteran drafted a fresh athletic stranger from outside the cast pool.",
      }),
    ).toBe(WATCH_ORDER_RETURNEE)
  })

  it('premiere chip preserves the original "start here, no prerequisites" copy', () => {
    expect(WATCH_ORDER_PREMIERE).toBe(
      'Watch order — start here, no prerequisites',
    )
  })
})

describe('isReturneeFlavored', () => {
  it('detects the all-returnee-cast token', () => {
    expect(
      isReturneeFlavored({
        number: 20,
        format_changes: ['all-returnee-cast'],
      }),
    ).toBe(true)
  })

  it('does not flag mid-run originals with structural-only tokens', () => {
    expect(
      isReturneeFlavored({
        number: 12,
        format_changes: ['three-tribes', 'gender-divided-tribes'],
        format_summary: 'Originals · 3 tribes',
        format_caption: 'the season that triple-split',
      }),
    ).toBe(false)
  })
})

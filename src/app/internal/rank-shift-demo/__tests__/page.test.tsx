import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The build-flag-gated internal demo for <RankShiftPill> — one row per
// sentiment, not rendered in production until the 72-hour shift signal
// lands. The load-bearing contract a unit test guards is the PROD-LEAK
// GATE: `process.env.INTERNAL_DEMOS !== '1'` → notFound(). In prod the
// var is unset, so the route 404s; a regression dropping or inverting
// the gate would ship an internal demo page to every visitor of
// /internal/rank-shift-demo. The hermetic e2e walk only visits URLs
// that exist with the prod env (INTERNAL_DEMOS unset), so it only ever
// sees the 404 — the gated-open render path and the gate's exactness
// (only '1' opens it) are both dark to it. noIndex discipline (an
// internal demo must never be indexed) is likewise an object the walk
// never reads.
//
// `next/navigation`'s notFound is mocked as a thrower matching runtime
// so the gated-closed branch short-circuits exactly as in production;
// `RankShiftPill` is stubbed to surface its delta + sentiment props so
// the per-row prop threading is observable without rendering the real
// pill.

const { notFoundMock, RankShiftPillMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  RankShiftPillMock: vi.fn((props: { delta: number; sentiment: string }) => (
    <span
      data-testid="rank-shift-pill"
      data-delta={String(props.delta)}
      data-sentiment={props.sentiment}
    />
  )),
}))

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}))
vi.mock('@/components/composition', () => ({
  RankShiftPill: RankShiftPillMock,
}))

import RankShiftDemoPage, { dynamic, metadata } from '../page'

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

// Mirrors the ROWS table in the source — the test owns the expectation
// so a silent edit to a delta/sentiment pairing is caught here.
const EXPECTED_ROWS: Array<{ sentiment: string; delta: number }> = [
  { sentiment: 'warm-up', delta: 3 },
  { sentiment: 'warm-down', delta: -2 },
  { sentiment: 'neutral', delta: 0 },
  { sentiment: 'hold', delta: 1 },
  { sentiment: 'verdict', delta: -1 },
  { sentiment: 'consensus', delta: 4 },
]

const ORIGINAL_FLAG = process.env['INTERNAL_DEMOS']

beforeEach(() => {
  notFoundMock.mockClear()
  RankShiftPillMock.mockClear()
})

afterEach(() => {
  if (ORIGINAL_FLAG === undefined) delete process.env['INTERNAL_DEMOS']
  else process.env['INTERNAL_DEMOS'] = ORIGINAL_FLAG
})

// --------------------------------------------------------------------
// Segment config
// --------------------------------------------------------------------

describe('rank-shift-demo segment config', () => {
  it("exports dynamic = 'force-dynamic' — the demo reads the per-request env flag, so it must not be baked static", () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

// --------------------------------------------------------------------
// Metadata — noIndex discipline
// --------------------------------------------------------------------

describe('rank-shift-demo metadata', () => {
  it('declares a demo-scoped title', () => {
    expect(metadata.title).toBe('RankShiftPill — demo')
  })

  it('is noIndex — an internal demo must never be indexed', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})

// --------------------------------------------------------------------
// The prod-leak gate (the load-bearing contract)
// --------------------------------------------------------------------

describe('rank-shift-demo production gate', () => {
  it('calls notFound() when INTERNAL_DEMOS is unset (the prod default) — the demo never reaches production', () => {
    delete process.env['INTERNAL_DEMOS']
    expect(() => render(<RankShiftDemoPage />)).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalled()
    expect(RankShiftPillMock).not.toHaveBeenCalled()
  })

  it("only the exact value '1' opens the gate — '0' still 404s", () => {
    process.env['INTERNAL_DEMOS'] = '0'
    expect(() => render(<RankShiftDemoPage />)).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalled()
  })

  it("a truthy-but-wrong value ('true') still 404s — the gate is value-exact, not truthiness", () => {
    process.env['INTERNAL_DEMOS'] = 'true'
    expect(() => render(<RankShiftDemoPage />)).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalled()
  })

  it("renders (never calls notFound) when INTERNAL_DEMOS === '1'", () => {
    process.env['INTERNAL_DEMOS'] = '1'
    render(<RankShiftDemoPage />)
    expect(notFoundMock).not.toHaveBeenCalled()
    expect(screen.getByTestId('rank-shift-demo')).toBeTruthy()
  })
})

// --------------------------------------------------------------------
// Render contract (gated open)
// --------------------------------------------------------------------

describe('rank-shift-demo render (gated open)', () => {
  beforeEach(() => {
    process.env['INTERNAL_DEMOS'] = '1'
  })

  it('renders the demo h1', () => {
    render(<RankShiftDemoPage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(norm(h1.textContent)).toBe('RankShiftPill — demo')
  })

  it('renders exactly one row per sentiment', () => {
    render(<RankShiftDemoPage />)
    for (const { sentiment } of EXPECTED_ROWS) {
      expect(screen.getByTestId(`rank-shift-row-${sentiment}`)).toBeTruthy()
    }
    expect(screen.getAllByTestId('rank-shift-pill')).toHaveLength(EXPECTED_ROWS.length)
  })

  it('threads the correct delta + sentiment into each row pill', () => {
    render(<RankShiftDemoPage />)
    for (const { sentiment, delta } of EXPECTED_ROWS) {
      const row = screen.getByTestId(`rank-shift-row-${sentiment}`)
      const pill = row.querySelector('[data-testid="rank-shift-pill"]')
      expect(pill?.getAttribute('data-sentiment')).toBe(sentiment)
      expect(pill?.getAttribute('data-delta')).toBe(String(delta))
    }
  })
})

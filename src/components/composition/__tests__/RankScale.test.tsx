import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RankScale, rankFillPercent } from '../RankScale'

describe('rankFillPercent', () => {
  it('matches the design source for rank=7/47 (≈14.9%)', () => {
    expect(rankFillPercent(7, 47)).toBeCloseTo(14.893, 2)
  })

  it('returns 100 at rank=total', () => {
    expect(rankFillPercent(47, 47)).toBe(100)
  })

  it('clamps rank below 1 up to 1', () => {
    expect(rankFillPercent(0, 47)).toBeCloseTo(2.127, 2)
  })

  it('clamps rank above total down to total', () => {
    expect(rankFillPercent(99, 47)).toBe(100)
  })

  it('returns 0 for invalid totals', () => {
    expect(rankFillPercent(5, 0)).toBe(0)
  })

  it('returns 0 (the peak end) for a sole #1-of-1 entry, not 100 (the tail)', () => {
    expect(rankFillPercent(1, 1)).toBe(0)
  })
})

describe('<RankScale>', () => {
  it('renders the rank pad-2 and the two descriptive endpoint marks', () => {
    render(<RankScale rank={7} total={47} />)
    expect(screen.getByTestId('rank-scale-rank')).toHaveTextContent('#07')
    expect(screen.getByText('of 47')).toBeInTheDocument()
    expect(screen.getByText('#01 · canon peak')).toBeInTheDocument()
    expect(screen.getByText('#47 · the tail')).toBeInTheDocument()
  })

  it('places the dot marker + label at the rank percentage', () => {
    render(<RankScale rank={7} total={47} />)
    const label = screen.getByTestId('rank-scale-here')
    expect(label).toHaveTextContent('here')
    const dot = label.closest('.scale-here') as HTMLElement
    expect(dot).not.toBeNull()
    expect(dot.style.left).toMatch(/^14\.\d+%$/)
  })

  it('never repeats the rank number in the dot marker label (critique pass-43/74)', () => {
    render(<RankScale rank={2} total={50} />)
    expect(screen.getByTestId('rank-scale-rank')).toHaveTextContent('#02')
    // The slot indicator states the rank once; the dot marker below
    // states position ("here"), never the digit again — the mobile
    // stacked layout was reading the duplicate #02 as a render glitch.
    expect(screen.getByTestId('rank-scale-here')).not.toHaveTextContent('#02')
  })

  it('puts the dot at 100% when rank=total', () => {
    render(<RankScale rank={47} total={47} />)
    const dot = screen
      .getByTestId('rank-scale-here')
      .closest('.scale-here') as HTMLElement
    expect(dot.style.left).toMatch(/^100(\.00)?%$/)
  })

  it('writes the fill percentage as inline style', () => {
    render(<RankScale rank={7} total={47} />)
    const fill = screen.getByTestId('rank-scale-fill') as HTMLElement
    expect(fill.style.width).toMatch(/^14\.\d+%$/)
  })

  it('renders 100% fill at rank=total', () => {
    render(<RankScale rank={47} total={47} />)
    const fill = screen.getByTestId('rank-scale-fill') as HTMLElement
    // jsdom normalizes `100.00%` to `100%`. The format string is set
    // to two decimals; both `100%` and `100.00%` are acceptable in
    // the DOM and resolve to the same width.
    expect(fill.style.width).toMatch(/^100(\.00)?%$/)
  })

  it('renders meta string when provided', () => {
    render(<RankScale rank={1} total={1} meta="1 season" />)
    expect(screen.getByText('1 season')).toBeInTheDocument()
  })

  it('suppresses the peak/tail endpoint marks when total is 1', () => {
    render(<RankScale rank={1} total={1} />)
    expect(screen.queryByText('#01 · canon peak')).not.toBeInTheDocument()
    expect(screen.queryByText('#01 · the tail')).not.toBeInTheDocument()
  })

  it('still renders the endpoint marks for multi-season totals', () => {
    render(<RankScale rank={7} total={47} />)
    expect(screen.getByText('#01 · canon peak')).toBeInTheDocument()
    expect(screen.getByText('#47 · the tail')).toBeInTheDocument()
  })

  it('renders a sole #1-of-1 entry at the peak (0%), not the tail (100%)', () => {
    render(<RankScale rank={1} total={1} />)
    const fill = screen.getByTestId('rank-scale-fill') as HTMLElement
    expect(fill.style.width).toMatch(/^0(\.00)?%$/)
    const dot = screen
      .getByTestId('rank-scale-here')
      .closest('.scale-here') as HTMLElement
    expect(dot.style.left).toMatch(/^0(\.00)?%$/)
  })
})

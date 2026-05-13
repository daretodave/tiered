import { describe, expect, it } from 'vitest'
import { deriveSigilViewBox, viewBoxToString } from './crop'

describe('deriveSigilViewBox', () => {
  it('crops the canonical facade [0,0,1200,800] to [440,0,320,320]', () => {
    expect(deriveSigilViewBox([0, 0, 1200, 800])).toEqual([440, 0, 320, 320])
  })

  it('honors a non-zero facade origin', () => {
    expect(deriveSigilViewBox([100, 50, 1200, 800])).toEqual([540, 50, 320, 320])
  })

  it('respects a custom crop size argument', () => {
    expect(deriveSigilViewBox([0, 0, 1200, 800], 200)).toEqual([500, 0, 200, 200])
  })

  it('centers horizontally for arbitrary widths', () => {
    expect(deriveSigilViewBox([0, 0, 800, 600], 100)).toEqual([350, 0, 100, 100])
  })
})

describe('viewBoxToString', () => {
  it('joins the four numbers with single spaces', () => {
    expect(viewBoxToString([0, 0, 1200, 800])).toBe('0 0 1200 800')
    expect(viewBoxToString([440, 0, 320, 320])).toBe('440 0 320 320')
  })
})

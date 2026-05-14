import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TierGlyph } from '../TierGlyph'

describe('<TierGlyph>', () => {
  it('renders the bar trio with the tier modifier class', () => {
    render(<TierGlyph tier="S" />)
    const glyph = screen.getByTestId('tier-glyph')
    expect(glyph.className).toContain('tier-glyph')
    expect(glyph.className).toContain(' s')
    expect(glyph.querySelectorAll('.bar').length).toBe(3)
  })

  it('exposes the tier as data-tier for snapshot debugging', () => {
    render(<TierGlyph tier="A" />)
    const glyph = screen.getByTestId('tier-glyph')
    expect(glyph.dataset['tier']).toBe('A')
    expect(glyph.className).toContain(' a')
  })

  it('B tier highlights the b3 bar via the .b modifier', () => {
    render(<TierGlyph tier="B" />)
    const glyph = screen.getByTestId('tier-glyph')
    expect(glyph.className).toContain(' b')
  })

  it('is aria-hidden — decorative', () => {
    render(<TierGlyph tier="S" />)
    expect(screen.getByTestId('tier-glyph').getAttribute('aria-hidden')).toBe(
      'true',
    )
  })
})

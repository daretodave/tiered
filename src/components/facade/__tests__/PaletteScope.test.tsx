import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PaletteScope } from '../PaletteScope'

const SYNTHETIC = {
  primary: '#C9551A',
  ink: '#1A1410',
  paper: '#F5EFE6',
}

describe('<PaletteScope>', () => {
  it('emits the three --show-* CSS vars when given an explicit palette', () => {
    render(<PaletteScope palette={SYNTHETIC}>x</PaletteScope>)
    const div = screen.getByTestId('palette-scope')
    expect(div.style.getPropertyValue('--show-paper')).toBe('#F5EFE6')
    expect(div.style.getPropertyValue('--show-ink')).toBe('#1A1410')
    expect(div.style.getPropertyValue('--show-primary')).toBe('#C9551A')
  })

  it('falls back to no vars when neither show nor palette set', () => {
    render(<PaletteScope>x</PaletteScope>)
    const div = screen.getByTestId('palette-scope')
    expect(div.style.getPropertyValue('--show-paper')).toBe('')
    expect(div.style.getPropertyValue('--show-ink')).toBe('')
    expect(div.style.getPropertyValue('--show-primary')).toBe('')
  })

  it('reads palette from content/ when a known show slug is given', () => {
    render(<PaletteScope show="survivor">x</PaletteScope>)
    const div = screen.getByTestId('palette-scope')
    expect(div.getAttribute('data-show')).toBe('survivor')
    expect(div.style.getPropertyValue('--show-primary').toLowerCase()).toBe('#c9551a')
  })

  it('falls back to ceremonial tokens for an unknown show but still sets data-show', () => {
    render(<PaletteScope show="not-a-real-show">x</PaletteScope>)
    const div = screen.getByTestId('palette-scope')
    expect(div.getAttribute('data-show')).toBe('not-a-real-show')
    expect(div.style.getPropertyValue('--show-primary')).toBe('')
  })

  it('renders children', () => {
    render(
      <PaletteScope palette={SYNTHETIC}>
        <span data-testid="child">inside</span>
      </PaletteScope>,
    )
    expect(screen.getByTestId('child')).toHaveTextContent('inside')
  })
})

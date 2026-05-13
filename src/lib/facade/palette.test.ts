import { describe, expect, it } from 'vitest'
import { paletteCssVars } from './palette'

describe('paletteCssVars', () => {
  it('emits the three CSS custom properties keyed by show palette', () => {
    const vars = paletteCssVars({
      primary: '#C9551A',
      ink: '#1A1410',
      paper: '#F5EFE6',
    }) as Record<string, string>
    expect(vars['--show-paper']).toBe('#F5EFE6')
    expect(vars['--show-ink']).toBe('#1A1410')
    expect(vars['--show-primary']).toBe('#C9551A')
  })

  it('returns an empty object when palette is null', () => {
    expect(paletteCssVars(null)).toEqual({})
  })

  it('returns an empty object when palette is undefined', () => {
    expect(paletteCssVars(undefined)).toEqual({})
  })
})

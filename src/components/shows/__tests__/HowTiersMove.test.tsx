import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HowTiersMove } from '../HowTiersMove'

describe('<HowTiersMove>', () => {
  it('renders the heading + both editorial paragraphs', () => {
    render(<HowTiersMove />)
    const node = screen.getByTestId('how-tiers-move')
    expect(node.textContent).toContain('How the tiers move')
    expect(node.textContent).toContain('defend the canon')
    expect(node.textContent).toContain('not about quality')
  })

  it('links to /about for the "How we rank" call', () => {
    render(<HowTiersMove />)
    const link = screen
      .getByTestId('how-tiers-move')
      .querySelector('a.footnote-link') as HTMLAnchorElement
    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/about')
  })
})

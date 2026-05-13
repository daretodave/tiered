import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('renders the brand promise verbatim (lowercase per body-prose rule)', () => {
    render(<Footer />)
    expect(screen.getByText('The seasons, ranked. No spoilers.')).toBeInTheDocument()
  })

  it('renders both navigation sections with the expected links', () => {
    render(<Footer />)

    const browseNav = screen.getByRole('navigation', { name: /browse/i })
    const browseLinks = Array.from(browseNav.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(browseLinks).toEqual(['/shows', '/themes', '/about'])

    const printNav = screen.getByRole('navigation', { name: /fine print/i })
    const printLinks = Array.from(printNav.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(printLinks).toEqual(['/terms', '/privacy'])
  })

  it('renders the current year and lowercase pantheon in the copyright', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${year} — pantheon\\. an experiment\\.`))).toBeInTheDocument()
  })

  it('mounts the theme toggle', () => {
    render(<Footer />)
    expect(screen.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeInTheDocument()
  })
})

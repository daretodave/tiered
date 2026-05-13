import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeHero } from '../HomeHero'

describe('<HomeHero>', () => {
  it('renders the eyebrow with the featured show name', () => {
    render(<HomeHero featuredShowName="Survivor" art={<div data-testid="art" />} />)
    expect(screen.getByTestId('home-hero-eyebrow').textContent).toContain('Survivor')
    expect(screen.getByTestId('art')).toBeTruthy()
  })

  it('renders the locked headline + blurb', () => {
    render(<HomeHero featuredShowName="Survivor" art={null} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toMatch(/The seasons,.*ranked\..*No spoilers\./)
  })

  it('CTAs link to /shows and /about', () => {
    render(<HomeHero featuredShowName="Survivor" art={null} />)
    expect(screen.getByTestId('home-cta-shows').getAttribute('href')).toBe('/shows')
    expect(screen.getByTestId('home-cta-about').getAttribute('href')).toBe('/about')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from '../Footer'

describe('<Footer>', () => {
  it('renders the BrandMark + tiered.tv wordmark', () => {
    render(<Footer />)
    expect(screen.getAllByTestId('brand-mark').length).toBeGreaterThan(0)
    const brand = screen.getByTestId('site-footer-brand')
    expect(brand).toHaveTextContent('tiered.tv')
  })

  it('renders the italic promise with "no spoilers"', () => {
    render(<Footer />)
    const promise = screen.getByTestId('site-footer-promise')
    expect(promise).toHaveTextContent('the seasons, ranked.')
    const em = promise.querySelector('em')
    expect(em).not.toBeNull()
    expect(em?.textContent).toBe('no spoilers.')
  })

  it('renders three columns: brand + Shows + tiered.tv (about)', () => {
    render(<Footer />)
    expect(screen.getByTestId('site-footer-brand')).toBeInTheDocument()
    expect(screen.getByTestId('site-footer-tiers-col')).toBeInTheDocument()
    expect(screen.getByTestId('site-footer-about-col')).toBeInTheDocument()
  })

  it('surfaces Privacy + Terms inside the tiered.tv column on every page', () => {
    // The /about closing paragraph names Privacy and Terms; the global
    // footer carries those destinations so a reader doesn't have to
    // deep-read /about prose to reach them.
    render(<Footer />)
    const col = screen.getByTestId('site-footer-about-col')
    const hrefs = Array.from(col.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toContain('/privacy')
    expect(hrefs).toContain('/terms')
  })

  it('does NOT contain the phrase "an experiment"', () => {
    render(<Footer />)
    const footer = screen.getByTestId('site-footer')
    expect(footer.textContent).not.toMatch(/an experiment/i)
  })

  it('mounts the theme toggle in the meta strip', () => {
    render(<Footer />)
    expect(
      screen.getByRole('button', { name: /switch to (light|dark) mode/i }),
    ).toBeInTheDocument()
  })

  it('renders a bullet next to each show in the Shows column', () => {
    render(<Footer />)
    const col = screen.getByTestId('site-footer-tiers-col')
    const bullets = col.querySelectorAll('[data-testid=bullet]')
    expect(bullets.length).toBeGreaterThan(0)
  })

  it('renders the rebellion copy in the meta strip', () => {
    render(<Footer />)
    const meta = screen.getByTestId('site-footer-meta')
    expect(meta).toHaveTextContent(
      /est\. as a quiet rebellion against ranked lists that ruin the show/i,
    )
  })

  it('does not surface a package version in the meta strip', () => {
    // Critique pass 7: `v0.0.0` undercut every page's editorial-confidence
    // claims. The footer carries no public version string.
    render(<Footer />)
    expect(
      screen.queryByTestId('site-footer-meta-version'),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('site-footer').textContent ?? '').not.toMatch(
      /\bv\d+\.\d+\.\d+/,
    )
  })

  it('applies tinted class when tinted={true}', () => {
    render(<Footer tinted />)
    const footer = screen.getByTestId('site-footer')
    expect(footer.className).toContain('tinted')
    expect(footer.getAttribute('data-tinted')).toBe('true')
  })
})

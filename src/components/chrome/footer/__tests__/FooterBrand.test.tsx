import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FooterBrand } from '../FooterBrand'

// FooterBrand is the lockup + spoilers promise inside the footer.
// `Footer.test.tsx` exercises it transitively (renders the
// composed footer + asserts the wordmark / promise text), but
// none of those tests imported FooterBrand directly — the §5a
// colocation gate flagged it as testless. This file pins the
// component's contract at its own boundary: the lockup container,
// the BrandMark size, the wordmark, and the promise span +
// emphasised "no spoilers." span.

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

describe('<FooterBrand> container', () => {
  it('renders a <div> carrying the brand testid and class', () => {
    render(<FooterBrand />)
    const root = screen.getByTestId('site-footer-brand')
    expect(root.tagName).toBe('DIV')
    expect(root.classList.contains('site-footer-brand')).toBe(true)
  })

  it('renders exactly two direct children (lockup span + promise paragraph)', () => {
    render(<FooterBrand />)
    const children = Array.from(
      screen.getByTestId('site-footer-brand').children,
    )
    expect(children).toHaveLength(2)
    expect(children[0]?.tagName).toBe('SPAN')
    expect(children[0]?.classList.contains('site-footer-brand-lockup')).toBe(
      true,
    )
    expect(children[1]?.tagName).toBe('P')
  })
})

describe('<FooterBrand> lockup', () => {
  it('places a BrandMark inside the lockup span', () => {
    render(<FooterBrand />)
    const lockup = screen
      .getByTestId('site-footer-brand')
      .querySelector('.site-footer-brand-lockup')
    expect(lockup).not.toBeNull()
    expect(lockup?.querySelector('[data-testid="brand-mark"]')).not.toBeNull()
  })

  it('sizes the BrandMark at 22 (the footer-scale brand size)', () => {
    render(<FooterBrand />)
    const mark = screen
      .getByTestId('site-footer-brand')
      .querySelector('[data-testid="brand-mark"]')
    expect(mark?.getAttribute('width')).toBe('22')
    expect(mark?.getAttribute('height')).toBe('22')
  })

  it('renders the lowercase tiered.tv wordmark next to the brand mark', () => {
    render(<FooterBrand />)
    const lockup = screen
      .getByTestId('site-footer-brand')
      .querySelector('.site-footer-brand-lockup')
    // The wordmark is the second direct-child span inside the lockup.
    const wordmark = lockup?.querySelector(':scope > span')
    expect(wordmark?.textContent).toBe('tiered.tv')
  })
})

describe('<FooterBrand> spoilers promise', () => {
  it('renders the promise paragraph with its testid', () => {
    render(<FooterBrand />)
    const promise = screen.getByTestId('site-footer-promise')
    expect(promise.tagName).toBe('P')
    expect(promise.classList.contains('site-footer-promise')).toBe(true)
  })

  it('renders the full promise copy verbatim (whitespace-normalised)', () => {
    render(<FooterBrand />)
    expect(norm(screen.getByTestId('site-footer-promise').textContent)).toBe(
      'the seasons, ranked. no spoilers.',
    )
  })

  it('renders the "no spoilers." clause inside an <em> so the brand promise reads as emphasised', () => {
    render(<FooterBrand />)
    const em = screen
      .getByTestId('site-footer-promise')
      .querySelector('em')
    expect(em).not.toBeNull()
    expect(em?.textContent).toBe('no spoilers.')
  })
})

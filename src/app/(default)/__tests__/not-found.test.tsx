import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from '../not-found'

// The global 404 for the default route group — rendered on every
// unmatched URL under (default) and whenever a page in the group
// calls notFound(). The hermetic e2e walk only visits URLs that
// exist, so this dead-end-recovery boundary is dark to it. The
// load-bearing contract a unit test guards: a 404 must announce
// itself AND offer a single way back home — a 404 with no
// recovery link strands every reader who hits a stale/typo'd URL.

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

describe('<NotFound> heading', () => {
  it('renders an h1 that announces the page is not found', () => {
    render(<NotFound />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(norm(h1.textContent)).toBe('Not found.')
  })

  it('sets the heading in the editorial serif register (design law)', () => {
    render(<NotFound />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.classList.contains('font-serif')).toBe(true)
  })
})

describe('<NotFound> explanatory copy', () => {
  it('explains the page was not built or never existed', () => {
    render(<NotFound />)
    const copy = norm(document.querySelector('p')?.textContent ?? null)
    expect(copy).toMatch(/built yet/)
    expect(copy).toMatch(/never existed/)
  })
})

describe('<NotFound> recovery link', () => {
  it('renders exactly one link, pointing home', () => {
    render(<NotFound />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]?.getAttribute('href')).toBe('/')
  })

  it('labels the home link so the recovery path is discoverable', () => {
    render(<NotFound />)
    const link = screen.getByRole('link')
    expect(norm(link.textContent)).toBe('Back to tiered.tv')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListsFeaturedRow } from '../ListsFeaturedRow'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

describe('<ListsFeaturedRow>', () => {
  it('renders nothing when no themes featured', () => {
    const { container } = render(
      <ListsFeaturedRow featured={[]} showsByTheme={{}} today={today} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('subhead names the latest last_revised month + year (critique pass-28: #294 — stamp the strip with its cadence)', () => {
    render(
      <ListsFeaturedRow
        featured={[
          theme({ slug: 'a', featured: true, last_revised: '2026-04-15' }),
          theme({ slug: 'b', featured: true, last_revised: '2026-06-01' }),
          theme({ slug: 'c', featured: true, last_revised: '2026-05-20' }),
        ]}
        showsByTheme={{ a: [show()], b: [show()], c: [show()] }}
        today={today}
      />,
    )
    const meta = document.querySelector('.lists-section-meta')
    expect(meta?.textContent).toBe('Editor-selected · Featured for June 2026')
    // No build-time `new Date()` drift — pass-24 #269 pattern.
    expect(meta?.textContent).not.toMatch(/every 1st/i)
  })

  it('subhead falls back to the literal cadence claim when no derivable date is available', () => {
    // Both featured themes carry malformed `last_revised` so the date
    // helper returns null. The strip must not render a broken stamp.
    render(
      <ListsFeaturedRow
        featured={[
          theme({ slug: 'a', featured: true, last_revised: 'not-a-date' }),
        ]}
        showsByTheme={{ a: [show()] }}
        today={today}
      />,
    )
    const meta = document.querySelector('.lists-section-meta')
    expect(meta?.textContent).toBe('Editor-selected · refreshed monthly')
  })

  it('marks the first card as big', () => {
    render(
      <ListsFeaturedRow
        featured={[
          theme({ slug: 'a', featured: true }),
          theme({ slug: 'b', featured: true }),
        ]}
        showsByTheme={{ a: [show()], b: [show()] }}
        today={today}
      />,
    )
    const cards = screen.getAllByTestId('lists-featured-card')
    expect(cards).toHaveLength(2)
    expect(cards[0]?.getAttribute('data-big')).toBe('true')
    expect(cards[1]?.getAttribute('data-big')).toBe('false')
  })

  it('gracefully renders <3 featured (does not pad)', () => {
    render(
      <ListsFeaturedRow
        featured={[theme({ slug: 'a', featured: true })]}
        showsByTheme={{ a: [show()] }}
        today={today}
      />,
    )
    expect(screen.getAllByTestId('lists-featured-card')).toHaveLength(1)
  })
})

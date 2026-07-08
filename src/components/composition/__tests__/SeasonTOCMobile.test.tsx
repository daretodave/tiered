import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeasonTOCMobile } from '../SeasonTOCMobile'
import type { TOCSection } from '../SeasonTOC'

const sections: TOCSection[] = [
  { id: 's-take', num: '01', label: 'The take' },
  { id: 's-shape', num: '02', label: 'The shape of the season' },
  { id: 's-where', num: '03', label: 'Where it sits in the canon' },
  { id: 's-watch', num: '04', label: 'What to watch for' },
  { id: 's-adjacent', num: '05', label: 'Adjacent' },
  { id: 's-appears', num: '06', label: 'Also appears in' },
]

describe('<SeasonTOCMobile>', () => {
  it('returns null when no sections are provided', () => {
    const { container } = render(<SeasonTOCMobile sections={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a details element collapsed by default (no open attribute)', () => {
    const { container } = render(<SeasonTOCMobile sections={sections} />)
    const details = container.querySelector('details.toc-mobile') as HTMLDetailsElement | null
    if (!details) throw new Error('expected details element')
    expect(details.hasAttribute('open')).toBe(false)
    expect(details.open).toBe(false)
  })

  it('renders a summary with the "On this page" head label', () => {
    render(<SeasonTOCMobile sections={sections} />)
    expect(screen.getByText('On this page')).toBeInTheDocument()
  })

  it('summary advertises the section count for sighted readers', () => {
    render(<SeasonTOCMobile sections={sections} />)
    expect(screen.getByText(/6\s+sections/)).toBeInTheDocument()
  })

  it('exposes the section count to the summary accessible name, not just sighted readers', () => {
    render(<SeasonTOCMobile sections={sections} />)
    const summary = screen.getByText('On this page').closest('summary')
    if (!summary) throw new Error('expected summary element')
    expect(summary.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(summary.textContent).toMatch(/On this page.*6\s+sections/)
  })

  it('renders one anchor link per section', () => {
    render(<SeasonTOCMobile sections={sections} />)
    expect(screen.getAllByTestId('toc-mobile-link')).toHaveLength(6)
  })

  it('uses the section id as the href anchor', () => {
    render(<SeasonTOCMobile sections={sections} />)
    const links = screen.getAllByTestId('toc-mobile-link') as HTMLElement[]
    expect(links[0]?.getAttribute('href')).toBe('#s-take')
    expect(links[5]?.getAttribute('href')).toBe('#s-appears')
  })

  it('renders the num and label for each section', () => {
    render(<SeasonTOCMobile sections={sections} />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('The take')).toBeInTheDocument()
    expect(screen.getByText('Also appears in')).toBeInTheDocument()
  })

  it('preserves the source-order of sections in the list', () => {
    render(<SeasonTOCMobile sections={sections} />)
    const links = screen.getAllByTestId('toc-mobile-link') as HTMLElement[]
    const ids = links.map((a) => a.getAttribute('data-toc-id'))
    expect(ids).toEqual([
      's-take',
      's-shape',
      's-where',
      's-watch',
      's-adjacent',
      's-appears',
    ])
  })

  it('carries the testid hook the e2e mobile spec asserts on', () => {
    render(<SeasonTOCMobile sections={sections} />)
    expect(screen.getByTestId('season-toc-mobile')).toBeInTheDocument()
  })

  it('renders a single-section TOC without crashing', () => {
    const single: TOCSection[] = [{ id: 's-take', num: '01', label: 'The take' }]
    render(<SeasonTOCMobile sections={single} />)
    expect(screen.getAllByTestId('toc-mobile-link')).toHaveLength(1)
    expect(screen.getByText(/1\s+section\b/)).toBeInTheDocument()
  })
})

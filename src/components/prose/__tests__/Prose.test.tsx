import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Prose } from '../Prose'

describe('Prose', () => {
  it('renders an H1 from a leading heading', () => {
    render(<Prose source={'# About\n\nSome body.'} />)
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })

  it('renders a paragraph with inline bold', () => {
    render(<Prose source={'**Hello** there.'} />)
    expect(screen.getByText('Hello').tagName).toBe('STRONG')
  })

  it('renders a list', () => {
    render(<Prose source={'- one\n- two'} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })

  it('renders an internal link as a Next.js Link', () => {
    render(<Prose source={'See [About](/about) here.'} />)
    const link = screen.getByRole('link', { name: 'About' })
    expect(link.getAttribute('href')).toBe('/about')
  })

  it('emits id attr on a heading carrying {#anchor} syntax', () => {
    render(<Prose source={'## How voting works {#voting}'} />)
    const heading = screen.getByRole('heading', { level: 2, name: 'How voting works' })
    expect(heading.id).toBe('voting')
  })

  it('omits id attr on a plain heading without anchor syntax', () => {
    render(<Prose source={'## Plain heading'} />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Plain heading' })
    expect(heading.id).toBe('')
  })
})

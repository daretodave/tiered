import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wordmark } from '../Wordmark'

describe('Wordmark', () => {
  it('renders the Pantheon brand text linked to /', () => {
    render(<Wordmark />)
    const link = screen.getByRole('link', { name: /pantheon home/i })
    expect(link).toHaveTextContent('Pantheon')
    expect(link).toHaveAttribute('href', '/')
  })

  it('honors a custom href', () => {
    render(<Wordmark href="/shows" />)
    expect(screen.getByRole('link', { name: /pantheon home/i })).toHaveAttribute(
      'href',
      '/shows',
    )
  })

  it('appends a custom className', () => {
    render(<Wordmark className="custom-thing" />)
    expect(screen.getByRole('link', { name: /pantheon home/i })).toHaveClass(
      'custom-thing',
    )
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeListsStack } from '../HomeListsStack'

describe('<HomeListsStack>', () => {
  it('renders section head + bordered stack wrapping its children', () => {
    render(
      <HomeListsStack showsCovered={5}>
        <span data-testid="kid">x</span>
        <span data-testid="kid">y</span>
      </HomeListsStack>,
    )
    expect(screen.getByTestId('home-list-section')).toBeTruthy()
    const stack = screen.getByTestId('home-lists-stack')
    expect(stack).toBeTruthy()
    expect(stack.querySelectorAll('[data-testid="kid"]').length).toBe(2)
  })

  it('renders the all-lists link', () => {
    render(<HomeListsStack showsCovered={5}>row</HomeListsStack>)
    const link = screen.getByRole('link', { name: /all lists/i })
    expect(link.getAttribute('href')).toBe('/themes')
  })

  it('puts the "cross-canon" accent on the heading when more than one show is covered', () => {
    const { container } = render(
      <HomeListsStack showsCovered={2}>row</HomeListsStack>,
    )
    const em = container.querySelector('.section-head h2 em')
    expect(em?.textContent).toBe('cross-canon.')
    expect(screen.getByTestId('home-list-section')).toHaveAttribute(
      'data-coverage',
      'cross-canon',
    )
  })

  it('swaps the heading accent to single-canon-honest copy when only one show is covered', () => {
    const { container } = render(
      <HomeListsStack showsCovered={1}>row</HomeListsStack>,
    )
    const em = container.querySelector('.section-head h2 em')
    expect(em?.textContent).toBe('inside one canon.')
    expect(em?.textContent).not.toMatch(/cross-canon/i)
    expect(screen.getByTestId('home-list-section')).toHaveAttribute(
      'data-coverage',
      'single-canon',
    )
  })
})

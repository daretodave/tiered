import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdjacentLists } from '../AdjacentLists'
import { theme } from './fixtures'

describe('<AdjacentLists>', () => {
  it('renders nothing when there are no related themes', () => {
    const { container } = render(
      <AdjacentLists theme={theme()} related={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders 2 links when 2 related themes exist', () => {
    render(
      <AdjacentLists
        theme={theme({ slug: 'firsts', category: 'tone' })}
        related={[
          theme({ slug: 'tense-finales', title: 'Tense finales', category: 'tone' }),
          theme({
            slug: 'survivor-pillars',
            title: 'Survivor pillars',
            category: 'single',
          }),
        ]}
      />,
    )
    const links = screen.getAllByTestId('list-adjacent-link')
    expect(links).toHaveLength(2)
    expect(links[0]?.getAttribute('href')).toBe('/themes/tense-finales')
    expect(links[1]?.getAttribute('href')).toBe('/themes/survivor-pillars')
  })

  it('caps at 2 links even when more are passed', () => {
    render(
      <AdjacentLists
        theme={theme({ category: 'tone' })}
        related={[
          theme({ slug: 'a', category: 'tone' }),
          theme({ slug: 'b', category: 'tone' }),
          theme({ slug: 'c', category: 'tone' }),
        ]}
      />,
    )
    expect(screen.getAllByTestId('list-adjacent-link')).toHaveLength(2)
  })

  it('labels same-category pairs with the category name', () => {
    render(
      <AdjacentLists
        theme={theme({ category: 'craft' })}
        related={[
          theme({ slug: 'a', category: 'craft' }),
          theme({ slug: 'b', category: 'craft' }),
        ]}
      />,
    )
    const tags = screen
      .getAllByTestId('list-adjacent-link')
      .map((el) => el.querySelector('.adj-tag')?.textContent)
    expect(tags[0]).toMatch(/similar craft list/i)
    expect(tags[1]).toMatch(/craft list/i)
  })

  it('labels cross-category pairs as "cross-canon list"', () => {
    render(
      <AdjacentLists
        theme={theme({ category: 'tone' })}
        related={[theme({ slug: 'a', category: 'single' })]}
      />,
    )
    const tag = screen
      .getByTestId('list-adjacent-link')
      .querySelector('.adj-tag')?.textContent
    expect(tag).toMatch(/cross-canon/i)
  })
})

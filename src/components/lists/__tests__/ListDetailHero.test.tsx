import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListDetailHero } from '../ListDetailHero'
import { show, theme } from './fixtures'

describe('<ListDetailHero>', () => {
  it('renders the crumb with bullets, Lists link, and theme title', () => {
    render(
      <ListDetailHero
        theme={theme({ slug: 'firsts', title: 'Firsts that hold up' })}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
      />,
    )
    const hero = screen.getByTestId('list-hero')
    expect(hero.querySelector('a[href="/themes"]')?.textContent).toBe('Lists')
    expect(hero.querySelector('.current')?.textContent).toBe('Firsts that hold up')
    expect(hero.querySelectorAll('.bullet-stack .bullet')).toHaveLength(2)
  })

  it('renders the title and parses a single <b> emphasis span in the tagline', () => {
    render(
      <ListDetailHero
        theme={theme({
          title: 'Best premieres ever',
          tagline: 'cold opens <b>that earned the rest</b> of the season',
        })}
        shows={[show()]}
      />,
    )
    expect(screen.getByTestId('list-title').textContent).toBe('Best premieres ever')
    const tagline = screen.getByTestId('list-tagline')
    expect(tagline.textContent).toContain('cold opens')
    expect(tagline.textContent).toContain('that earned the rest')
    expect(tagline.querySelector('b')?.textContent).toBe('that earned the rest')
  })

  it('renders all four meta cells with computed values', () => {
    render(
      <ListDetailHero
        theme={theme({
          curator: 'M. Reyes',
          last_revised: '2026-05-10',
        })}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
      />,
    )
    expect(screen.getByTestId('list-meta-entries').textContent).toContain('2')
    expect(screen.getByTestId('list-meta-spans').textContent).toContain(
      '2 shows',
    )
    expect(screen.getByTestId('list-meta-curator').textContent).toContain(
      'M. Reyes',
    )
    expect(screen.getByTestId('list-meta-revised').textContent).toContain(
      'May 2026',
    )
  })

  it('entries meta value is a bare integer (no noun-doubling against the ENTRIES label)', () => {
    render(
      <ListDetailHero
        theme={theme({
          entries: Array.from({ length: 7 }, (_, ix) => ({
            show: 'survivor',
            season: ix + 1,
            rank: ix + 1,
            title: `Entry ${ix + 1}`,
            blurb: 'blurb.',
          })),
        })}
        shows={[show()]}
      />,
    )
    const valueText =
      screen
        .getByTestId('list-meta-entries')
        .querySelector('.meta-val')?.textContent?.trim() ?? ''
    expect(valueText).toMatch(/^\d+$/)
    expect(valueText).not.toMatch(/entr(y|ies)/i)
  })

  it('renders LAST REVISED as calendar "Month YYYY" (no relative-time tokens that rot)', () => {
    render(
      <ListDetailHero
        theme={theme({ last_revised: '2026-01-05' })}
        shows={[show()]}
      />,
    )
    const revised = screen.getByTestId('list-meta-revised').textContent ?? ''
    expect(revised).toContain('January 2026')
    expect(revised).not.toMatch(/this week|this month|this year|today|yesterday/i)
  })

  it('shows tools row with save/share/suggest + shield', () => {
    render(
      <ListDetailHero theme={theme()} shows={[show()]} />,
    )
    expect(screen.getByTestId('list-save')).toBeTruthy()
    expect(screen.getByTestId('list-share')).toBeTruthy()
    const suggestHref = screen.getByTestId('list-suggest').getAttribute('href') ?? ''
    expect(suggestHref).toMatch(/^mailto:editors@tiered\.tv/)
    expect(suggestHref).not.toMatch(/tiered\.app/)
    const shield = screen.getByTestId('list-shield')
    expect(shield.getAttribute('aria-label')).toContain('No spoilers')
  })

  it('singular meta for a single-entry single-show theme', () => {
    render(
      <ListDetailHero
        theme={theme({
          entries: [
            {
              show: 'survivor',
              season: 1,
              rank: 1,
              title: 'Only entry.',
              blurb: 'Solo blurb.',
            },
          ],
        })}
        shows={[show()]}
      />,
    )
    expect(screen.getByTestId('list-meta-entries').textContent).toContain('1')
    expect(screen.getByTestId('list-meta-spans').textContent).toContain('1 show')
  })
})

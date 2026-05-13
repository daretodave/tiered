import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListDetailHero } from '../ListDetailHero'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

describe('<ListDetailHero>', () => {
  it('renders the crumb with bullets, Lists link, and theme title', () => {
    render(
      <ListDetailHero
        theme={theme({ slug: 'firsts', title: 'Firsts that hold up' })}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
        today={today}
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
        today={today}
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
        today={today}
      />,
    )
    expect(screen.getByTestId('list-meta-entries').textContent).toContain(
      '2 entries',
    )
    expect(screen.getByTestId('list-meta-spans').textContent).toContain(
      '2 shows',
    )
    expect(screen.getByTestId('list-meta-curator').textContent).toContain(
      'M. Reyes',
    )
    expect(screen.getByTestId('list-meta-revised').textContent).toContain(
      'this week',
    )
  })

  it('shows tools row with save/share/suggest + shield', () => {
    render(
      <ListDetailHero theme={theme()} shows={[show()]} today={today} />,
    )
    expect(screen.getByTestId('list-save')).toBeTruthy()
    expect(screen.getByTestId('list-share')).toBeTruthy()
    expect(screen.getByTestId('list-suggest').getAttribute('href')).toMatch(
      /^mailto:editors@pantheon\.app/,
    )
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
        today={today}
      />,
    )
    expect(screen.getByTestId('list-meta-entries').textContent).toContain(
      '1 entry',
    )
    expect(screen.getByTestId('list-meta-spans').textContent).toContain('1 show')
  })
})

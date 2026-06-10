import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SuggestEntryCTA } from '../SuggestEntryCTA'

describe('<SuggestEntryCTA>', () => {
  it('renders the participation CTA with a mailto link and verb-arrow glyph', () => {
    render(<SuggestEntryCTA themeTitle="Firsts that hold up" />)
    const cta = screen.getByTestId('list-suggest-cta')
    const link = screen.getByTestId('list-suggest')
    expect(cta.contains(link)).toBe(true)
    expect(link.textContent ?? '').toMatch(/Suggest an entry/)
    expect(link.textContent ?? '').toMatch(/→/)
    expect(link.getAttribute('aria-label')).toBe(
      'Suggest an entry for Firsts that hold up',
    )
  })

  it('mailto href targets editors@tiered.tv with an encoded theme-title subject', () => {
    render(<SuggestEntryCTA themeTitle="Firsts that hold up" />)
    const href = screen.getByTestId('list-suggest').getAttribute('href') ?? ''
    expect(href).toMatch(/^mailto:editors@tiered\.tv/)
    expect(href).not.toMatch(/tiered\.app/)
    expect(href).toContain(
      encodeURIComponent('Suggest entry: Firsts that hold up'),
    )
  })

  // Critique pass-45 #384 bidirectional drift guard half (b): the
  // Suggest action exists on the page (this component renders it) but
  // is rendered OUTSIDE the primary action row (`list-tools`). The
  // assertion here is rendering-shape: this component carries the
  // `list-suggest-cta` slot wrapper, not the `list-tools` wrapper, so
  // a future refactor that drops the CTA back into the tools row
  // cannot satisfy both this pin and the `list-tools` half in
  // ListDetailTools.test.tsx.
  it('renders inside the editorial-footer slot (list-suggest-cta), never the action row (list-tools) (pass-45 #384)', () => {
    const { container } = render(
      <SuggestEntryCTA themeTitle="Firsts that hold up" />,
    )
    const link = screen.getByTestId('list-suggest')
    expect(link.closest('[data-testid="list-suggest-cta"]')).not.toBeNull()
    expect(link.closest('[data-testid="list-tools"]')).toBeNull()
    expect(container.querySelector('[data-testid="list-tools"]')).toBeNull()
  })
})

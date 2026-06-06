import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { CanonFile } from '@/content'
import { CanonMethodology } from '../CanonMethodology'

function canon(overrides: Partial<CanonFile>): CanonFile {
  return {
    show: 'survivor',
    entries: [{ rank: 1, season: 1, title: 'Season 1', rationale: 'r' }],
    ...overrides,
  } as CanonFile
}

describe('<CanonMethodology>', () => {
  it('renders the three fixed cell numbers in order', () => {
    render(<CanonMethodology canon={null} />)
    const nums = screen
      .getAllByTestId('canon-meth-cell')
      .map((cell) => cell.querySelector('.cp-meth-num')?.textContent)
    expect(nums).toEqual(['01 · WHO', '02 · HOW', '03 · WHEN'])
  })

  it('falls back to the default copy when canon is null', () => {
    render(<CanonMethodology canon={null} />)
    expect(screen.getByText('One editor, named.')).toBeInTheDocument()
    expect(screen.getByText('Position, not score.')).toBeInTheDocument()
    expect(screen.getByText('Revised quarterly.')).toBeInTheDocument()
    expect(
      screen.getByText(/Each show gets a single canon editor/),
    ).toBeInTheDocument()
  })

  it('uses canon-supplied headings + bodies when present', () => {
    render(
      <CanonMethodology
        canon={canon({
          meth_who_h: 'Asha runs this canon.',
          meth_who_p: 'One named editor, on the record.',
          meth_how_h: 'Slots, argued.',
          meth_how_p: 'Each placement is defended in prose.',
          meth_when_h: 'Moves on a schedule.',
          meth_when_p: 'Quarterly, with diff notes.',
        })}
      />,
    )
    expect(screen.getByText('Asha runs this canon.')).toBeInTheDocument()
    expect(screen.getByText('Slots, argued.')).toBeInTheDocument()
    expect(screen.getByText('Moves on a schedule.')).toBeInTheDocument()
    expect(screen.queryByText('One editor, named.')).toBeNull()
    expect(screen.queryByText('Position, not score.')).toBeNull()
    expect(screen.queryByText('Revised quarterly.')).toBeNull()
  })

  it('mixes overrides and defaults per field independently', () => {
    render(
      <CanonMethodology
        canon={canon({ meth_how_h: 'Only HOW is custom.' })}
      />,
    )
    // Overridden field uses the canon value.
    expect(screen.getByText('Only HOW is custom.')).toBeInTheDocument()
    expect(screen.queryByText('Position, not score.')).toBeNull()
    // Untouched fields keep their defaults.
    expect(screen.getByText('One editor, named.')).toBeInTheDocument()
    expect(screen.getByText('Revised quarterly.')).toBeInTheDocument()
  })

  it('exposes the labelled methodology landmark', () => {
    render(<CanonMethodology canon={null} />)
    const section = screen.getByTestId('canon-methodology')
    expect(section.tagName).toBe('SECTION')
    expect(section).toHaveAttribute('aria-label', 'How the canon works')
    expect(screen.getAllByTestId('canon-meth-cell')).toHaveLength(3)
  })

  // Critique pass-35 MED / issue #329: the `01 · WHO` cell's DEFAULT
  // body explicitly promises a singular editor and disavows plural
  // pronouns ("One editor, named. ... we will not hide behind plural
  // pronouns."). Per-show `meth_who_p` overrides that ship plural-
  // collective voice contradict that promise — caught at content-
  // check author-time by `collectCanonMethWhoPluralEditorIssues`.
  // This sibling pin keeps the default itself from drifting off the
  // singular shape during a future authoring pass, bidirectional
  // (positive on the singular shape, negative against plural drift).
  describe('default 01 · WHO body holds the singular-editor promise (#329)', () => {
    it('lands the singular-editor lead and the plural-pronoun disavowal', () => {
      render(<CanonMethodology canon={null} />)
      expect(screen.getByText(/One editor, named\./)).toBeInTheDocument()
      expect(
        screen.getByText(/we will not hide behind plural pronouns/),
      ).toBeInTheDocument()
    })

    it('default body never drifts to the plural possessive form', () => {
      render(<CanonMethodology canon={null} />)
      const body = screen.getByText(/Each show gets a single canon editor/)
      expect(body.textContent ?? '').not.toMatch(/tiered\.tv's editors\b/i)
    })
  })
})

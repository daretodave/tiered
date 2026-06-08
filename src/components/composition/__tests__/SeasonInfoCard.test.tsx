import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeasonInfoCard } from '../SeasonInfoCard'

describe('<SeasonInfoCard>', () => {
  const voteSlot = <div data-testid="vote-slot">vote</div>

  it('renders all four rows with canon scale, vote, and shield', () => {
    render(
      <SeasonInfoCard
        canonRank={7}
        canonTotal={47}
        voteQuestion="Top 10?"
        voteSlot={voteSlot}
      />,
    )
    expect(screen.getByTestId('info-card')).toBeInTheDocument()
    expect(screen.getByTestId('info-row-canon')).toBeInTheDocument()
    expect(screen.getByTestId('info-row-vote')).toBeInTheDocument()
    expect(screen.getByTestId('info-row-shield')).toBeInTheDocument()
    expect(screen.getByTestId('vote-slot')).toBeInTheDocument()
    // Phase 37 nit 5: the canon scale renders a dot marker + #NN label
    // on the track and two descriptive endpoint marks.
    expect(screen.getByTestId('rank-scale-here')).toHaveTextContent('#07')
    expect(screen.getByText('#01 · canon peak')).toBeInTheDocument()
    expect(screen.getByText('#47 · the tail')).toBeInTheDocument()
  })

  it('hides the community row by default', () => {
    render(
      <SeasonInfoCard
        canonRank={7}
        canonTotal={47}
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    expect(screen.queryByTestId('info-row-community')).toBeNull()
  })

  it('renders the community row when communityRank is supplied', () => {
    render(
      <SeasonInfoCard
        canonRank={7}
        canonTotal={47}
        communityRank={4}
        communityCount={17402}
        communityShift="↑ 3 this month"
        communityCaption="readers rank it higher than the editors do."
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    expect(screen.getByTestId('info-row-community')).toBeInTheDocument()
    expect(screen.getByText('#04')).toBeInTheDocument()
    expect(screen.getByTestId('community-shift')).toHaveTextContent('↑ 3 this month')
    expect(screen.getByText('17,402 votes')).toBeInTheDocument()
  })

  it('falls back to a "not yet ranked" placeholder when canonRank is null', () => {
    render(
      <SeasonInfoCard
        canonRank={null}
        canonTotal={47}
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    expect(screen.getByTestId('info-row-canon')).toBeInTheDocument()
    expect(screen.getByText('not yet ranked')).toBeInTheDocument()
  })

  it('renders the static "Your vote / change within 72h" head when voteRowHead is absent (back-compat)', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    const row = screen.getByTestId('info-row-vote')
    expect(row).toHaveTextContent('Your vote')
    expect(row).toHaveTextContent('change within 72h')
  })

  it('renders the voteRowHead slot in place of the default head when provided (#177)', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
        voteRowHead={<div data-testid="vote-row-head-slot">Cast a vote · sign in to weigh in</div>}
      />,
    )
    const row = screen.getByTestId('info-row-vote')
    expect(screen.getByTestId('vote-row-head-slot')).toBeInTheDocument()
    expect(row).not.toHaveTextContent('change within 72h')
    expect(row).toHaveTextContent('Cast a vote · sign in to weigh in')
  })

  it('renders two shield lines by default', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    expect(screen.getAllByTestId('shield-line')).toHaveLength(2)
  })

  // Critique pass-19 HIGH: the watch-order chip used to default to
  // "start here, no prerequisites" on every season, including
  // returnees seasons where the body argument is the opposite. The
  // season page now passes a derived shieldLines prop per-season; the
  // component must honor the override verbatim.
  it('honors a custom shieldLines prop over the default returnee/start-here pair', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
        shieldLines={[
          'No spoilers — reviewed by an editor',
          'Watch order — relies on prior-season recognition',
        ]}
      />,
    )
    const row = screen.getByTestId('info-row-shield')
    expect(row).toHaveTextContent(
      'Watch order — relies on prior-season recognition',
    )
    expect(row).not.toHaveTextContent('no prerequisites')
    expect(row).not.toHaveTextContent('start here')
  })

  // The vote row sits under the community-vote heading; the default
  // help copy must promise weekly cadence for the community track, not
  // for the editorial canon. Pins the two-rankings frame (#192). The
  // verb is "updates", not "recomputes" — critique-pass-19 MED swap
  // from engineering vocab to editorial voice.
  it('defaults voteHelp to community-rank weekly-update copy, never canon', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
      />,
    )
    const row = screen.getByTestId('info-row-vote')
    expect(row).toHaveTextContent('community rank updates weekly')
    expect(row).not.toHaveTextContent('canon position updates')
    // critique-pass-19 MED pin: engineering vocab must not slip back in.
    expect(row).not.toHaveTextContent(/recompute/i)
  })

  it('honors a custom voteHelp prop over the default', () => {
    render(
      <SeasonInfoCard
        canonRank={1}
        canonTotal={1}
        voteQuestion="Q?"
        voteSlot={voteSlot}
        voteHelp="custom help line."
      />,
    )
    const row = screen.getByTestId('info-row-vote')
    expect(row).toHaveTextContent('custom help line.')
    expect(row).not.toHaveTextContent('community rank updates weekly')
  })

  // Critique pass-40 MED: the vote-block previously stacked
  // eyebrow (`YOUR VOTE / CAST VOTE`) above the question being
  // voted on (`Does this belong in the community top 10?`), so the
  // signed-in reader was told to "CAST VOTE" before the prompt
  // scoped the action. The fix reorders the row to prompt → CTA
  // eyebrow → buttons → status, matching the comment-input
  // pattern on the same page. Pinned here as a bidirectional drift
  // guard against a future refactor reverting the reorder.
  describe('vote-block reading order (critique pass-40)', () => {
    it('renders the vote-q prompt before the VoteRowHead slot in DOM order', () => {
      render(
        <SeasonInfoCard
          canonRank={1}
          canonTotal={1}
          voteQuestion="Does this belong in the community top 10?"
          voteSlot={voteSlot}
          voteRowHead={
            <div data-testid="vote-row-head-slot">YOUR VOTE · CAST VOTE</div>
          }
        />,
      )
      const row = screen.getByTestId('info-row-vote')
      const prompt = row.querySelector('p.vote-q')
      const head = screen.getByTestId('vote-row-head-slot')
      expect(prompt).not.toBeNull()
      const relation = prompt!.compareDocumentPosition(head)
      expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('renders the vote-q prompt before the default head when voteRowHead is absent', () => {
      render(
        <SeasonInfoCard
          canonRank={1}
          canonTotal={1}
          voteQuestion="Q?"
          voteSlot={voteSlot}
        />,
      )
      const row = screen.getByTestId('info-row-vote')
      const prompt = row.querySelector('p.vote-q')
      const head = row.querySelector('.info-row-head')
      expect(prompt).not.toBeNull()
      expect(head).not.toBeNull()
      const relation = prompt!.compareDocumentPosition(head!)
      expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('places the vote-q prompt as the first child of the vote row', () => {
      render(
        <SeasonInfoCard
          canonRank={1}
          canonTotal={1}
          voteQuestion="Q?"
          voteSlot={voteSlot}
          voteRowHead={
            <div data-testid="vote-row-head-slot">eyebrow</div>
          }
        />,
      )
      const row = screen.getByTestId('info-row-vote')
      expect(row.firstElementChild?.tagName.toLowerCase()).toBe('p')
      expect(row.firstElementChild?.classList.contains('vote-q')).toBe(true)
    })

    it('places the vote buttons after the eyebrow (CTA scopes the buttons)', () => {
      render(
        <SeasonInfoCard
          canonRank={1}
          canonTotal={1}
          voteQuestion="Q?"
          voteSlot={voteSlot}
          voteRowHead={
            <div data-testid="vote-row-head-slot">eyebrow</div>
          }
        />,
      )
      const row = screen.getByTestId('info-row-vote')
      const head = screen.getByTestId('vote-row-head-slot')
      const buttons = screen.getByTestId('vote-slot')
      expect(row.contains(head)).toBe(true)
      expect(row.contains(buttons)).toBe(true)
      const relation = head.compareDocumentPosition(buttons)
      expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })
})

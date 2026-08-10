import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityWeeklyQuestionCard } from '../CommunityWeeklyQuestionCard'

describe('<CommunityWeeklyQuestionCard>', () => {
  it('renders the canon question and marks it non-default', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="Does Heroes vs. Villains belong in the community top 5?"
        votersThisWeek={3214}
        hasRankedSeasons
      />,
    )
    const card = screen.getByTestId('community-weekly-question')
    expect(card).toHaveAttribute('data-default', 'false')
    expect(
      screen.getByText('Does Heroes vs. Villains belong in the community top 5?'),
    ).toBeInTheDocument()
  })

  it('falls back to the default question and flags it', () => {
    render(
      <CommunityWeeklyQuestionCard
        question={null}
        votersThisWeek={0}
        hasRankedSeasons
      />,
    )
    expect(screen.getByTestId('community-weekly-question')).toHaveAttribute(
      'data-default',
      'true',
    )
  })

  it('shows the Supabase-derived tally + close day once voters are in', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="q"
        votersThisWeek={3214}
        hasRankedSeasons
      />,
    )
    expect(
      screen.getByText('3,214 voted · closes Thursday'),
    ).toBeInTheDocument()
  })

  it('stays honest below the threshold — no fabricated count', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="q"
        votersThisWeek={0}
        hasRankedSeasons
      />,
    )
    expect(
      screen.getByText('votes pending · closes Thursday'),
    ).toBeInTheDocument()
  })

  it('help copy names the next update in editorial voice, not engineering (regression guard for #256)', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="q"
        votersThisWeek={42}
        hasRankedSeasons
      />,
    )
    const card = screen.getByTestId('community-weekly-question')
    expect(card).toHaveTextContent(/feeds the next update/)
    expect(card).not.toHaveTextContent(/recompute/i)
  })

  it('links to the ranked season list below when one renders (critique pass-106/108)', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="q"
        votersThisWeek={42}
        hasRankedSeasons
      />,
    )
    const link = screen.getByRole('link', { name: 'Cast it on a season below.' })
    expect(link).toHaveAttribute('href', '#community-rank-list')
  })

  it('omits the link when there is no ranked season list to jump to', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="q"
        votersThisWeek={0}
        hasRankedSeasons={false}
      />,
    )
    expect(
      screen.queryByRole('link', { name: 'Cast it on a season below.' }),
    ).not.toBeInTheDocument()
  })
})

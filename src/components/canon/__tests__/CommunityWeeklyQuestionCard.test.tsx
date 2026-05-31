import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityWeeklyQuestionCard } from '../CommunityWeeklyQuestionCard'

describe('<CommunityWeeklyQuestionCard>', () => {
  it('renders the canon question and marks it non-default', () => {
    render(
      <CommunityWeeklyQuestionCard
        question="Does Heroes vs. Villains belong in the community top 5?"
        votersThisWeek={3214}
      />,
    )
    const card = screen.getByTestId('community-weekly-question')
    expect(card).toHaveAttribute('data-default', 'false')
    expect(
      screen.getByText('Does Heroes vs. Villains belong in the community top 5?'),
    ).toBeInTheDocument()
  })

  it('falls back to the default question and flags it', () => {
    render(<CommunityWeeklyQuestionCard question={null} votersThisWeek={0} />)
    expect(screen.getByTestId('community-weekly-question')).toHaveAttribute(
      'data-default',
      'true',
    )
  })

  it('shows the Supabase-derived tally + close day once voters are in', () => {
    render(
      <CommunityWeeklyQuestionCard question="q" votersThisWeek={3214} />,
    )
    expect(
      screen.getByText('3,214 voted · closes Thursday'),
    ).toBeInTheDocument()
  })

  it('stays honest below the threshold — no fabricated count', () => {
    render(<CommunityWeeklyQuestionCard question="q" votersThisWeek={0} />)
    expect(
      screen.getByText('votes pending · closes Thursday'),
    ).toBeInTheDocument()
  })

  it('help copy names the next update in editorial voice, not engineering (regression guard for #256)', () => {
    render(<CommunityWeeklyQuestionCard question="q" votersThisWeek={42} />)
    const card = screen.getByTestId('community-weekly-question')
    expect(card).toHaveTextContent(/feeds the next update/)
    expect(card).not.toHaveTextContent(/recompute/i)
  })
})

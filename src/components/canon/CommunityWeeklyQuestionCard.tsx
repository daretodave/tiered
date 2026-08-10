import { Bullet } from '@/components/atoms/Bullet'
import { weeklyQuestionMeta } from '@/lib/community/live'

type CommunityWeeklyQuestionCardProps = {
  question: string | null | undefined
  // Trailing-7d distinct voter count — the Supabase-derived tally
  // that feeds the next recompute (phase 35 stage 3). Below the
  // threshold this is 0 and the meta stays honest ("votes pending").
  votersThisWeek: number
  // Whether the ranked season list actually renders below this card
  // (false when the show has no community entries yet, in which case
  // the empty state renders instead — see ShowRanking.tsx). The card's
  // "cast it below" link only appears when there's a target to jump to
  // (critique pass-106/108: the card invited a vote but had nothing
  // clickable, and every season row lives one section down).
  hasRankedSeasons: boolean
}

const DEFAULT_QUESTION = 'Which season are you defending tonight?'

export function CommunityWeeklyQuestionCard({
  question,
  votersThisWeek,
  hasRankedSeasons,
}: CommunityWeeklyQuestionCardProps) {
  const q = question ?? DEFAULT_QUESTION
  return (
    <div
      className="cp-cq-card"
      data-testid="community-weekly-question"
      data-default={question ? 'false' : 'true'}
    >
      <div>
        <div className="cp-cq-key">
          <Bullet color="var(--show-primary)" size={8} />
          this week&rsquo;s question
        </div>
        <div className="cp-cq-q">{q}</div>
        <div className="cp-cq-help">
          Your vote feeds the next update. One vote per reader; change your mind within
          72h.
          {hasRankedSeasons ? (
            <>
              {' '}
              <a className="cp-cq-link" href="#community-rank-list">
                Cast it on a season below.
              </a>
            </>
          ) : null}
        </div>
      </div>
      <div className="cp-cq-cta">
        <span className="cp-cq-meta">{weeklyQuestionMeta(votersThisWeek)}</span>
      </div>
    </div>
  )
}

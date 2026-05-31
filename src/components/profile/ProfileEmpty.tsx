import Link from 'next/link'
import { ProfileStats } from './ProfileStats'

type ProfileEmptyProps = {
  // When the viewer is looking at their own empty profile, the
  // rhetorical "Vote on a season" prompt becomes a concrete
  // one — the CTA points at a real season-card grid so the
  // next-action is one click, not a memory test.
  selfView?: {
    showName: string
    showHref: string
  }
}

// Shown when a real member has no published comments and no live
// votes. The profile still renders (handle resolved, not a 404) —
// it just has nothing to show yet. The page keeps this state
// noIndex so a thin profile never enters the index.
//
// CRITIQUE pass 22 MED (#262): /u/[handle] is publicly addressable
// — a stranger landing here used to read the same second-person
// prose the owner gets ("Vote on a season and it will land here"),
// which addressed the wrong viewer. The empty-state copy now
// splits on `selfView`: the owner branch keeps the second-person
// prompt + CTA so the next-action is one click; the stranger branch
// reads a sparse third-person status with no CTA (no door to open
// on someone else's record).
export function ProfileEmpty({ selfView }: ProfileEmptyProps = {}) {
  return (
    <div className="flex flex-col gap-6" data-testid="profile-empty-block">
      {/* On the owner's own empty profile, a zeroed stat row shows the
          shape of what will populate — a scannable skeleton in the same
          treatment the populated profile uses, so the page reads as an
          empty record, not an unbuilt page. A stranger viewing an empty
          profile gets the sparse copy only (no owner scaffold). */}
      {selfView ? (
        <ProfileStats
          publishedCommentCount={0}
          votedSeasonCount={0}
          votedShowCount={0}
        />
      ) : null}
      <div className="flex flex-col gap-3">
        <p className="text-ink-2" data-testid="profile-empty">
          {selfView
            ? 'Nothing on your record yet. Vote on a season and it will land here.'
            : 'No votes on the public record yet.'}
        </p>
        {selfView ? (
          <Link
            className="text-sm font-medium text-ink-0 underline-offset-2 hover:underline"
            data-testid="profile-empty-cta"
            href={selfView.showHref}
          >
            Start with {selfView.showName} →
          </Link>
        ) : null}
      </div>
    </div>
  )
}

import Link from 'next/link'

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
//
// CRITIQUE pass 28 MED (#293): the self-view used to stack a
// zeroed stat-tile row (0 / 0 / 0) above the prose, surfacing six
// pieces of zero/absence before the two CTA arrows — the surface
// read as an admin screen, not an editorial product. The stat tile
// row is now reserved for accounts with at least one vote so the
// structure earns its space; the self branch leads with a single
// warm editorial lede, the only surface that previously let
// the bearings voice ("knowledgeable peer — confident, warm,
// plain-spoken") down. Reverts the pass-16 #217 zeroed skeleton.
//
// CRITIQUE pass 39 MED (#346): the prior self-view lede opened with
// `New here.` — a recency claim that fires unconditionally whenever
// the viewer has no votes, with no gate on `joinedAt`. On the /u/e2e
// walk the page rendered `Member since May 2026` directly above
// `New here.`; a returning member two months in was greeted as new.
// The new literal drops the recency claim (`No votes yet. Cast one
// and your record starts writing itself.`) — reads honestly at every
// recency including 0-day signups, preserves the CTA mechanic the
// pass-28 #293 closure landed for, doesn't lean on a join-date input
// the component doesn't have.
export function ProfileEmpty({ selfView }: ProfileEmptyProps = {}) {
  return (
    <div className="flex flex-col gap-6" data-testid="profile-empty-block">
      <div className="flex flex-col gap-3">
        <p className="text-ink-2" data-testid="profile-empty">
          {selfView
            ? 'No votes yet. Cast one and your record starts writing itself.'
            : 'No votes on the public record yet.'}
        </p>
        {selfView ? (
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              className="text-sm font-medium text-ink-0 underline-offset-2 hover:underline"
              data-testid="profile-empty-cta"
              href={selfView.showHref}
            >
              Start with {selfView.showName} →
            </Link>
            {/* CRITIQUE pass 26 LOW (#285): the featured-show CTA is the
                right first move for a brand-new reader, but a signed-in
                reader with zero activity who signed up for a non-Survivor
                reason needs a path to the full catalog from the empty
                state — without it, the page reads as a stub. Two CTAs,
                not five — the secondary link opens the catalog without
                turning the empty state into a menu. Self-view only:
                the stranger branch above renders neither CTA (no door
                to open on someone else's record). */}
            <Link
              className="text-sm font-medium text-ink-2 underline-offset-2 hover:underline hover:text-ink-0"
              data-testid="profile-empty-cta-catalog"
              href="/shows"
            >
              Browse all shows →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

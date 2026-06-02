import type { CanonEntry, CanonFile, Season, Show } from '@/content'
import type { LiveCommunityRanking } from '@/lib/community/ranking'
import { pickMovers, communitySignalForSeason } from '@/lib/community/live'
import { buildTierBands } from '@/lib/canon/tier-bands'
import { makeEraOf } from '@/lib/canon/era-bands'
import { CanonTabSwitch } from './CanonTabSwitch'
import { CanonEraToolbar } from './CanonEraToolbar'
import { CanonMethodology } from './CanonMethodology'
import { CanonTierBand } from './CanonTierBand'
import { CommunityLiveStrip } from './CommunityLiveStrip'
import { CommunityMovers } from './CommunityMovers'
import { CommunityWeeklyQuestionCard } from './CommunityWeeklyQuestionCard'
import { CommunityRankList } from './CommunityRankList'

type View = 'canon' | 'community'

type ShowRankingProps = {
  show: Show
  seasons: Season[]
  canon: CanonFile | null
  initialView: View
  // The live, Supabase-derived community ranking (phase 35). Below
  // the vote threshold this is the canon-mirror with empty counters
  // (always-working rule) — `source` is what the copy keys off.
  community: LiveCommunityRanking
}

function seasonHrefFor(
  showSlug: string,
  seasonByNumber: Map<number, Season>,
  entry: CanonEntry,
): string {
  const season = seasonByNumber.get(entry.season)
  if (season) return `/shows/${showSlug}/season/${season.slug}`
  return `/shows/${showSlug}`
}

// Phase 33: the canon/community internals (shipped phase 31c as
// CanonPageShell, route-coupled to /canon + /community) are lifted
// onto the consolidated show page. CanonHead/CanonStats are gone —
// the show hero owns the title/stats now. The `.ranking-intro` block
// (dual canon/community copy, CSS-toggled by the root `data-view`)
// replaces them. Both panes are SSR'd; visibility is a CSS toggle, so
// both rankings are always in the static HTML (SEO-safe). The
// `.canon-page` class stays on the root because all the ported
// `[data-view]` / `[data-view-pane]` CSS keys off it (the body
// element is owned by the App Router root layout — the phase-31c
// adaptation note in canon.css).
export function ShowRanking({
  show,
  seasons,
  canon,
  initialView,
  community,
}: ShowRankingProps) {
  const entries = canon?.entries ?? []
  const seasonByNumber = new Map<number, Season>()
  for (const s of seasons) seasonByNumber.set(s.number, s)

  const tierBands = buildTierBands(entries, {
    s: canon?.tier_s_blurb ?? null,
    a: canon?.tier_a_blurb ?? null,
    b: canon?.tier_b_blurb ?? null,
    c: canon?.tier_c_blurb ?? null,
  })

  const hasLiveVotes = community.source === 'votes'
  const movers = pickMovers(community.entries)

  const seasonHref = (entry: CanonEntry) =>
    seasonHrefFor(show.slug, seasonByNumber, entry)
  const seasonOf = (entry: CanonEntry) => seasonByNumber.get(entry.season)
  const communitySignal = (entry: CanonEntry) =>
    communitySignalForSeason(
      entry.season,
      community.entries,
      community.source,
      entry.community_rank_hint,
    )
  const eraBands = canon?.era_bands ?? []
  const eraOf = makeEraOf(seasonOf, eraBands)

  return (
    <section
      className="ranking canon-page"
      data-canon-page-root
      data-view={initialView}
      data-testid="show-ranking"
      aria-label="The ranking"
    >
      <div className="ranking-intro" data-testid="ranking-intro">
        <h2>
          <span className="cp-canon-only">The canon, top to bottom.</span>
          <span className="cp-community-only">What readers are voting on.</span>
        </h2>
        <p className="meta">
          <span className="cp-canon-only">
            One ranking, written by editors who have rewatched every season at
            least twice. We argue with the community out loud — but we ship one
            number.
          </span>
          <span className="cp-community-only">
            Each season carries a yes/no vote — does it belong in the community
            top 10? — and the share of &ldquo;in&rdquo; votes orders every
            season 1..N below.{' '}
            {hasLiveVotes
              ? 'Updated every Thursday at 9pm ET.'
              : 'Updated every Thursday at 9pm ET. Until enough votes land, this mirrors the canon — be the first to move it.'}
          </span>
        </p>
      </div>

      <CanonTabSwitch initialView={initialView} />

      <div data-view-pane="canon" data-testid="canon-view-pane">
        {entries.length === 0 ? (
          <div
            className="cp-canon-empty"
            data-testid="canon-empty"
            data-empty="true"
          >
            The canon hasn&rsquo;t been ranked yet — this page populates as the
            loop ships it.
          </div>
        ) : (
          <>
            <CanonMethodology canon={canon} />
            <CanonEraToolbar bands={eraBands} total={entries.length} />
            {tierBands.map((band) => (
              <CanonTierBand
                key={band.key}
                band={band}
                seasonHref={seasonHref}
                seasonOf={seasonOf}
                eraOf={eraOf}
                communitySignal={communitySignal}
              />
            ))}
          </>
        )}
      </div>

      <div data-view-pane="community" data-testid="community-view-pane">
        <CommunityLiveStrip
          source={community.source}
          lastRecomputeAt={community.lastRecomputeAt}
          votersThisWeek={community.votersThisWeek}
          version={community.version}
        />
        <CommunityMovers movers={movers} />
        <div className="cp-community-list" data-testid="community-weekly-wrapper">
          <CommunityWeeklyQuestionCard
            question={canon?.weekly_question ?? null}
            votersThisWeek={community.votersThisWeek}
          />
        </div>
        {community.entries.length > 0 ? (
          <CommunityRankList
            entries={community.entries}
            showSlug={show.slug}
            source={community.source}
          />
        ) : (
          <div
            className="cp-canon-empty"
            data-testid="community-empty"
            data-empty="true"
          >
            Seasons haven&rsquo;t been added yet — this page populates as the
            loop ships them.
          </div>
        )}
      </div>
    </section>
  )
}

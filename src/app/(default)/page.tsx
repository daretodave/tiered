import type { Metadata } from 'next'
import {
  getAllShows,
  getAllThemes,
  getFeaturedShow,
  getThemeStats,
} from '@/content'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeShowGrid } from '@/components/home/HomeShowGrid'
import { HomeMoreShows } from '@/components/home/HomeMoreShows'
import { HomeDualCallout } from '@/components/home/HomeDualCallout'
import { HomeListsStack } from '@/components/home/HomeListsStack'
import { HomeListRow } from '@/components/home/HomeListRow'
import { ShowTile } from '@/components/home/ShowTile'
import { getCanonRevisedLabel } from '@/lib/canon/last-revised'
import { partitionHomeShows } from '@/lib/home/show-partition'
import { buildMetadata } from '@/lib/seo'

// Phase 27 — homepage rebuilt against `design/tiered.tv · Home.html`.
// Fluid hero + stat strip; 3-up featured tiles + a sub-row + 6 compact
// tiles below; dual-rank callout; themed-list stack. Color + type only.

export const dynamic = 'force-static'

const HOME_TITLE = 'tiered.tv — the seasons, ranked. no spoilers.'
const HOME_DESCRIPTION =
  'A spoiler-free home for ranked TV seasons. Editor’s Canon and Community Rank side by side.'

// The home page defined no metadata at all — it inherited the root
// layout's title/description but emitted no <link rel="canonical">,
// the one route on the site without one. buildMetadata supplies the
// self-referential canonical (plus OG/Twitter and the RSS discovery
// link); the title is pinned absolute so the root `%s — tiered.tv`
// template doesn't double-suffix the brand line.
export function generateMetadata(): Metadata {
  return {
    ...buildMetadata({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: '/',
    }),
    title: { absolute: HOME_TITLE },
  }
}

const LIST_ROWS = 4

export default function HomePage() {
  const featured = getFeaturedShow()
  const allShows = getAllShows()
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
  // The compact grid takes every non-featured show — no fixed cap —
  // so the "N shows tracked" headline always equals what renders.
  const { featured: featuredShows, compact: compactShows } =
    partitionHomeShows(allShows)
  const themes = getAllThemes().slice(0, LIST_ROWS)
  const themesShowsCovered = getThemeStats().showsCovered
  const canonRevisedLabel = getCanonRevisedLabel()

  return (
    <div className="screen home" data-testid="hero">
      {featured ? (
        <HomeHero
          featured={featured}
          canonRevisedLabel={canonRevisedLabel}
        />
      ) : null}

      <HomeShowGrid totalShows={allShows.length}>
        {featuredShows.map((show) => (
          <ShowTile key={show.slug} show={show} variant="featured" />
        ))}
      </HomeShowGrid>

      {compactShows.length > 0 ? (
        <HomeMoreShows count={compactShows.length}>
          {compactShows.map((show) => (
            <ShowTile key={show.slug} show={show} variant="compact" />
          ))}
        </HomeMoreShows>
      ) : null}

      <HomeDualCallout />

      <HomeListsStack showsCovered={themesShowsCovered}>
        {themes.map((theme) => (
          <HomeListRow key={theme.slug} theme={theme} />
        ))}
      </HomeListsStack>
    </div>
  )
}

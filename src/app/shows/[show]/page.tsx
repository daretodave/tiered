import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeasons, getAllShows, getShow } from '@/content'
import { PaletteScope, ShowFacadeArt } from '@/components/facade'
import {
  SeasonCard,
  SeasonGrid,
  ShieldBadge,
  ShowHero,
  ShowSplit,
} from '@/components/composition'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'
import { FeaturedThemes } from '@/components/featured-themes/FeaturedThemes'

type Params = { show: string }

export function generateStaticParams(): Params[] {
  return getAllShows().map((show) => ({ show: show.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const show = getShow(params.show)
  if (!show) {
    return buildMetadata({
      title: 'Show not found',
      description: '',
      path: `/shows/${params.show}`,
      noIndex: true,
    })
  }
  return buildMetadata({
    title: `${show.name} — ranked seasons, no spoilers`,
    description:
      show.tagline ??
      `Editor's Canon and Community Rank for every ${show.name} season. Spoiler-free.`,
    path: `/shows/${show.slug}`,
  })
}

function seasonTag(
  season: ReturnType<typeof getAllSeasons>[number],
  show: NonNullable<ReturnType<typeof getShow>>,
): string {
  if (season.premiere_date) {
    return new Date(season.premiere_date).getUTCFullYear().toString()
  }
  return show.format
}

export default function ShowHomePage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  const seasons = getAllSeasons(show.slug)

  const collectionLd = buildJsonLd({
    type: 'CollectionPage',
    name: `${show.name} — pantheon`,
    description:
      show.tagline ?? `Editor's Canon and Community Rank for every ${show.name} season.`,
    path: `/shows/${show.slug}`,
  })
  const crumbsLd = buildJsonLd({
    type: 'BreadcrumbList',
    trail: [
      { name: 'Pantheons', path: '/shows' },
      { name: show.name, path: `/shows/${show.slug}` },
    ],
  })

  const seasonsSorted = [...seasons].sort((a, b) => a.number - b.number)

  return (
    <PaletteScope show={show.slug}>
      <script {...jsonLdScriptProps({ id: 'ld-show-home', data: collectionLd })} />
      <script {...jsonLdScriptProps({ id: 'ld-show-breadcrumb', data: crumbsLd })} />
      <div className="screen show-home" data-testid="show-home-screen">
        <ShowHero
          crumb={
            <>
              <a href="/shows">Pantheons</a> / {show.name}
            </>
          }
          title={show.name}
          lede={show.tagline ?? `${show.network} · ${show.format}`}
          art={<ShowFacadeArt slug={show.slug} name={show.name} />}
          shield={<ShieldBadge />}
        />
        <ShowSplit
          canon={{
            href: `/shows/${show.slug}/canon`,
            tag: '01 · CURATED',
            title: "Editor's Canon",
            blurb: `One ranking, written by someone who has watched every ${show.name} season twice.`,
            go: 'Read the canon →',
          }}
          community={{
            href: `/shows/${show.slug}/community`,
            tag: '02 · LIVE',
            title: 'Community Rank',
            blurb: 'Voted by readers. Updated as the votes come in.',
            go: 'See the vote →',
          }}
        />
        <section className="show-seasons" aria-labelledby="seasons-heading">
          <div className="section-head">
            <h2 id="seasons-heading">All seasons, ranked</h2>
          </div>
          {seasonsSorted.length === 0 ? (
            <p
              data-testid="season-grid"
              data-empty="true"
              style={{ margin: '0 32px 56px', color: 'var(--show-ink)', opacity: 0.7 }}
            >
              Seasons haven&rsquo;t been added yet — this page populates as the loop ships them.
            </p>
          ) : (
            <SeasonGrid>
              {seasonsSorted.map((season) => (
                <SeasonCard
                  key={season.number}
                  rank={season.canonical_position ?? season.number}
                  title={season.title}
                  tag={seasonTag(season, show)}
                  seasonNumber={season.number}
                  href={`/shows/${show.slug}/season/${season.number}`}
                />
              ))}
            </SeasonGrid>
          )}
        </section>
        <div style={{ margin: '0 32px 56px' }}>
          <FeaturedThemes show={show.slug} />
        </div>
      </div>
    </PaletteScope>
  )
}

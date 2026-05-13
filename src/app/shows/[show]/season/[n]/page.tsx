import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getAllSeasons,
  getAllShows,
  getSeason,
  getShow,
} from '@/content'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

type Params = { show: string; n: string }

export function generateStaticParams(): Params[] {
  const out: Params[] = []
  for (const show of getAllShows()) {
    for (const season of getAllSeasons(show.slug)) {
      out.push({ show: show.slug, n: String(season.number) })
    }
  }
  return out
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const show = getShow(params.show)
  if (!show)
    return buildMetadata({
      title: 'Season',
      description: '',
      path: `/shows/${params.show}/season/${params.n}`,
      noIndex: true,
    })
  const num = Number.parseInt(params.n, 10)
  const season = getSeason(show.slug, num)
  if (!season)
    return buildMetadata({
      title: `${show.name} S${params.n}`,
      description: '',
      path: `/shows/${show.slug}/season/${params.n}`,
      noIndex: true,
    })
  return buildMetadata({
    title: `${show.name} S${season.number} — ${season.title}`,
    description: `Vote and discuss ${show.name} season ${season.number}: ${season.title}.`,
    path: `/shows/${show.slug}/season/${season.number}`,
  })
}

export default function SeasonPage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  const num = Number.parseInt(params.n, 10)
  if (!Number.isFinite(num)) notFound()
  const season = getSeason(show.slug, num)
  if (!season) notFound()

  const ld = buildJsonLd({
    type: 'Article',
    headline: `${show.name} S${season.number} — ${season.title}`,
    description: season.blurb_md.slice(0, 200),
    path: `/shows/${show.slug}/season/${season.number}`,
    author: 'Pantheon Editors',
    ...(season.premiere_date ? { datePublished: season.premiere_date } : {}),
  })

  return (
    <section
      data-show={show.slug}
      className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16 md:py-24"
    >
      <script {...jsonLdScriptProps({ id: 'ld-season', data: ld })} />
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs text-ink-3">
          {show.name} · Season {season.number}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">
          {season.title}
        </h1>
      </header>

      <p className="font-serif text-base leading-relaxed text-ink-1">
        {season.blurb_md}
      </p>

      <section
        data-testid="vote-pair"
        aria-label="Vote on this season"
        className="flex items-center gap-3"
      >
        <button
          type="button"
          disabled
          className="rounded border border-line-base bg-paper-1 px-4 py-2 text-sm text-ink-2"
        >
          + worth watching
        </button>
        <button
          type="button"
          disabled
          className="rounded border border-line-base bg-paper-1 px-4 py-2 text-sm text-ink-2"
        >
          − skip this one
        </button>
        <span className="text-xs text-ink-3">votes land in phase 11.</span>
      </section>

      <section aria-label="Comments" className="flex flex-col gap-2">
        <h2 className="font-serif text-xl text-ink-0">Comments</h2>
        <p className="text-sm text-ink-2">
          Sign in to comment. The thread lands in phase 12.
        </p>
      </section>
    </section>
  )
}

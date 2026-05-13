import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllSeasons, getAllShows, getShow } from '@/content'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

type Params = { show: string }

export function generateStaticParams(): Params[] {
  return getAllShows().map((show) => ({ show: show.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const show = getShow(params.show)
  if (!show) return buildMetadata({ title: 'Show not found', description: '', path: `/shows/${params.show}`, noIndex: true })
  return buildMetadata({
    title: show.name,
    description: show.tagline ?? `${show.name} — seasons ranked two ways.`,
    path: `/shows/${show.slug}`,
  })
}

export default function ShowHomePage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  const seasons = getAllSeasons(show.slug)
  const ld = buildJsonLd({
    type: 'CollectionPage',
    name: `${show.name} — pantheon`,
    description: show.tagline ?? `${show.name} on pantheon.`,
    path: `/shows/${show.slug}`,
  })

  return (
    <section
      data-show={show.slug}
      className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 md:py-24"
    >
      <script {...jsonLdScriptProps({ id: 'ld-show-home', data: ld })} />
      <header data-testid="facade" className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-ink-3">{show.network}</p>
        <h1 className="font-serif text-5xl leading-tight text-ink-0 md:text-6xl">
          {show.name}
        </h1>
        {show.tagline ? (
          <p className="max-w-prose font-serif text-lg leading-relaxed text-ink-1">
            {show.tagline}
          </p>
        ) : null}
        <nav className="mt-2 flex gap-4 text-sm">
          <Link
            href={`/shows/${show.slug}/canon`}
            prefetch={false}
            className="text-primary-base underline hover:opacity-80"
          >
            Editor&rsquo;s Canon
          </Link>
          <Link
            href={`/shows/${show.slug}/community`}
            prefetch={false}
            className="text-primary-base underline hover:opacity-80"
          >
            Community Rank
          </Link>
        </nav>
      </header>

      <section data-testid="season-grid" className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-ink-0">Seasons</h2>
        {seasons.length === 0 ? (
          <p className="text-ink-2">
            Seasons haven&rsquo;t been added yet — this page populates as the loop ships them.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season) => (
              <li
                key={season.number}
                className="rounded border border-line-soft bg-paper-1 p-4"
              >
                <Link
                  href={`/shows/${show.slug}/season/${season.number}`}
                  prefetch={false}
                  className="flex flex-col gap-1"
                >
                  <span className="font-mono text-xs text-ink-3">S{season.number}</span>
                  <span className="font-serif text-lg text-ink-0">{season.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

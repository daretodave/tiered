import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllShows, getCanon, getShow } from '@/content'
import { buildJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/seo'

type Params = { show: string }

export function generateStaticParams(): Params[] {
  return getAllShows().map((show) => ({ show: show.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const show = getShow(params.show)
  if (!show) return buildMetadata({ title: 'Canon', description: '', path: `/shows/${params.show}/canon`, noIndex: true })
  return buildMetadata({
    title: `${show.name} — Editor’s Canon`,
    description: `Editor’s Canon for ${show.name}, ranked with spoiler-free rationales.`,
    path: `/shows/${show.slug}/canon`,
  })
}

export default function CanonPage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  const canon = getCanon(show.slug)
  const ld = buildJsonLd({
    type: 'ItemList',
    name: `${show.name} — Editor’s Canon`,
    description: `Editor’s Canon for ${show.name}.`,
    path: `/shows/${show.slug}/canon`,
    items: canon?.entries.map((entry) => ({
      position: entry.rank,
      name: entry.title,
      path: `/shows/${show.slug}/season/${entry.season}`,
      description: entry.rationale.slice(0, 200),
    })) ?? [
      { position: 1, name: `${show.name} — pending`, path: `/shows/${show.slug}` },
    ],
  })

  return (
    <section
      data-show={show.slug}
      className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16 md:py-24"
    >
      <script {...jsonLdScriptProps({ id: 'ld-canon', data: ld })} />
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-ink-3">{show.name}</p>
        <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">
          Editor&rsquo;s Canon
        </h1>
        <p className="text-ink-2">
          Our editorial ranking. Confident, but spoiler-safe.
        </p>
      </header>

      {canon && canon.entries.length > 0 ? (
        <ol className="flex flex-col gap-6">
          {canon.entries.map((entry) => (
            <li key={entry.rank} className="flex flex-col gap-2">
              <Link
                href={`/shows/${show.slug}/season/${entry.season}`}
                prefetch={false}
                className="flex items-baseline gap-3"
              >
                <span className="font-mono text-2xl text-primary-base">
                  {entry.rank}
                </span>
                <span className="font-serif text-xl text-ink-0">{entry.title}</span>
                <span className="font-mono text-xs text-ink-3">S{entry.season}</span>
              </Link>
              <p className="font-serif text-base leading-relaxed text-ink-1">
                {entry.rationale}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-ink-2">
          The canon hasn&rsquo;t been ranked yet — this page populates as the loop ships it.
        </p>
      )}
    </section>
  )
}

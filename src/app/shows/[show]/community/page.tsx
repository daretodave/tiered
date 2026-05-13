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
  if (!show) return buildMetadata({ title: 'Community Rank', description: '', path: `/shows/${params.show}/community`, noIndex: true })
  return buildMetadata({
    title: `${show.name} — Community Rank`,
    description: `Vote-driven community ranking for ${show.name}.`,
    path: `/shows/${show.slug}/community`,
  })
}

export default function CommunityPage({ params }: { params: Params }) {
  const show = getShow(params.show)
  if (!show) notFound()
  // Until vote tallies exist, mirror canon order as the seed.
  const canon = getCanon(show.slug)
  const ld = buildJsonLd({
    type: 'ItemList',
    name: `${show.name} — Community Rank`,
    description: `Community-voted ranking for ${show.name}.`,
    path: `/shows/${show.slug}/community`,
    items: canon?.entries.map((entry) => ({
      position: entry.rank,
      name: entry.title,
      path: `/shows/${show.slug}/season/${entry.season}`,
    })) ?? [
      { position: 1, name: `${show.name} — pending`, path: `/shows/${show.slug}` },
    ],
  })

  return (
    <section
      data-show={show.slug}
      className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16 md:py-24"
    >
      <script {...jsonLdScriptProps({ id: 'ld-community', data: ld })} />
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-ink-3">{show.name}</p>
        <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">
          Community Rank
        </h1>
        <p className="text-ink-2">
          Vote-driven. Be the first to vote — until then, this mirrors the canon.
        </p>
      </header>

      <p className="text-ink-2">
        The community rank populates once votes land in phase 11.
      </p>
    </section>
  )
}

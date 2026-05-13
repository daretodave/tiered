import { notFound } from 'next/navigation'
import { getSeason, getShow } from '@/content'
import { buildOgImage } from '@/lib/og/template'

export const runtime = 'nodejs'
export const alt = 'Pantheon — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { show: string; n: string }

export default async function OpenGraphImage({ params }: { params: Promise<Params> }) {
  const { show: slug, n } = await params
  const num = Number.parseInt(n, 10)
  const show = getShow(slug)
  if (!show || !Number.isFinite(num)) notFound()
  const season = getSeason(slug, num)
  if (!season) notFound()
  const meta = season.location
    ? `${season.location}${season.host ? ` · ${season.host}` : ''}`
    : (season.host ?? `${show.name} · Season ${season.number}`)
  return buildOgImage({
    eyebrow: `Pantheon · ${show.name} · Season ${season.number}`,
    title: season.title,
    blurb: meta,
    palette: {
      paper: show.palette.paper,
      ink: show.palette.ink,
      primary: show.palette.primary,
    },
  })
}

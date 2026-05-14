import { notFound } from 'next/navigation'
import { getShow } from '@/content'
import { buildOgImage } from '@/lib/og/template'

export const runtime = 'nodejs'
export const alt = 'tiered.tv — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { show: string }

export default async function OpenGraphImage({ params }: { params: Promise<Params> }) {
  const { show: slug } = await params
  const show = getShow(slug)
  if (!show) notFound()
  return buildOgImage({
    eyebrow: `tiered.tv · ${show.name} · Editor's Canon`,
    title: `${show.name}, ranked`,
    blurb: 'One ranking. Written by an editor with the whole series in their head. No spoilers.',
    palette: {
      paper: show.palette.paper,
      ink: show.palette.ink,
      primary: show.palette.primary,
    },
  })
}

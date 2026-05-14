import { notFound } from 'next/navigation'
import { getTheme } from '@/content'
import { buildOgImage } from '@/lib/og/template'

export const runtime = 'nodejs'
export const alt = 'tiered.tv — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { theme: string }

export default async function OpenGraphImage({ params }: { params: Promise<Params> }) {
  const { theme: slug } = await params
  const theme = getTheme(slug)
  if (!theme) notFound()
  return buildOgImage({
    eyebrow: 'tiered.tv · Themed list',
    title: theme.title,
    blurb: theme.description,
  })
}

import { notFound } from 'next/navigation'
import { buildOgImage } from '@/lib/og/template'
import { isPopulatedProfile, publicDisplayName } from '@/lib/profile/context'
import { getProfileActivity } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const alt = 'tiered.tv — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { handle: string }

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many
}

export default async function OpenGraphImage({ params }: { params: Promise<Params> }) {
  const { handle } = await params
  const activity = await getProfileActivity({ handle })
  if (!activity) notFound()

  const populated = isPopulatedProfile({
    publishedCommentCount: activity.publishedCommentCount,
    votedSeasonCount: activity.votedSeasonCount,
  })
  const displayName = publicDisplayName(activity.displayName)

  return buildOgImage({
    eyebrow: 'tiered.tv · Member',
    title: displayName ?? `@${activity.handle}`,
    blurb: populated
      ? `${activity.votedSeasonCount} ${plural(activity.votedSeasonCount, 'season', 'seasons')} voted · ${activity.publishedCommentCount} ${plural(activity.publishedCommentCount, 'comment', 'comments')} · ${activity.votedShowCount} ${plural(activity.votedShowCount, 'show', 'shows')}`
      : 'A reader on tiered.tv. Nothing on the public record yet.',
  })
}

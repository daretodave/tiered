import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSeason, getShow } from '@/content'
import {
  ProfileComments,
  ProfileEmpty,
  ProfileHeader,
  ProfileStats,
} from '@/components/profile'
import type { ProfileCommentView, ProfileView } from '@/components/profile'
import { formatWhen } from '@/lib/comments/thread'
import {
  formatMemberSince,
  isPopulatedProfile,
  publicDisplayName,
  shapeProfileComment,
} from '@/lib/profile/context'
import { buildMetadata, canonicalUrl, jsonLdScriptProps } from '@/lib/seo'
import { getProfileActivity } from '@/lib/supabase/server'

type Params = { handle: string }

export const dynamic = 'force-dynamic'

// Shared by generateMetadata + the page so the profile_activity
// RPC + recent-comments read run once per request, not twice.
const loadProfile = cache(async (handle: string): Promise<ProfileView | null> => {
  const activity = await getProfileActivity({ handle })
  if (!activity) return null

  const comments: ProfileCommentView[] = activity.recentComments.map((raw) => {
    const shaped = shapeProfileComment(raw)
    let context: ProfileCommentView['context'] = null
    if (shaped.season) {
      const show = getShow(shaped.season.showSlug)
      const season = getSeason(shaped.season.showSlug, shaped.season.seasonNumber)
      if (show && season) {
        context = {
          label: `${show.name} · Season ${shaped.season.seasonNumber}`,
          href: `/shows/${show.slug}/season/${season.slug}`,
        }
      }
    }
    return {
      id: shaped.id,
      excerpt: shaped.excerpt,
      when: formatWhen(shaped.createdAt),
      context,
    }
  })

  const populated = isPopulatedProfile({
    publishedCommentCount: activity.publishedCommentCount,
    votedSeasonCount: activity.votedSeasonCount,
  })

  return {
    handle: activity.handle,
    displayName: publicDisplayName(activity.displayName),
    memberSince: formatMemberSince(activity.createdAt),
    publishedCommentCount: activity.publishedCommentCount,
    votedSeasonCount: activity.votedSeasonCount,
    votedShowCount: activity.votedShowCount,
    comments,
    populated,
  }
})

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const handle = params.handle
  const profile = await loadProfile(handle)
  if (!profile) {
    return buildMetadata({
      title: `@${handle}`,
      description: 'Profile not found on tiered.tv.',
      path: `/u/${handle}`,
      noIndex: true,
    })
  }
  // Empty profiles stay out of the index (no thin-content pages);
  // populated profiles are indexable.
  return buildMetadata({
    title: `@${profile.handle}`,
    description: profile.populated
      ? `${profile.handle} on tiered.tv — published comments and the seasons they've voted on. No spoilers.`
      : `${profile.handle} on tiered.tv.`,
    path: `/u/${profile.handle}`,
    noIndex: !profile.populated,
  })
}

export default async function UserProfilePage({
  params,
}: {
  params: Params
}) {
  const profile = await loadProfile(params.handle)
  // 404 ONLY on a genuinely-unknown handle. A real member who
  // isn't the signed-in viewer must render for any visitor.
  if (!profile) notFound()

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: canonicalUrl(`/u/${profile.handle}`),
    mainEntity: {
      '@type': 'Person',
      name: profile.displayName ?? `@${profile.handle}`,
      identifier: profile.handle,
      url: canonicalUrl(`/u/${profile.handle}`),
    },
  }

  return (
    <section
      className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 md:py-24"
      data-testid="user-profile"
      data-handle={profile.handle}
      data-populated={profile.populated ? 'true' : 'false'}
    >
      {profile.populated ? (
        <script {...jsonLdScriptProps({ id: 'ld-profile', data: ld })} />
      ) : null}

      <ProfileHeader
        handle={profile.handle}
        displayName={profile.displayName}
        memberSince={profile.memberSince}
      />

      {profile.populated ? (
        <>
          <ProfileStats
            publishedCommentCount={profile.publishedCommentCount}
            votedSeasonCount={profile.votedSeasonCount}
            votedShowCount={profile.votedShowCount}
          />
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-xl text-ink-0">Recent comments</h2>
            <ProfileComments comments={profile.comments} />
          </div>
        </>
      ) : (
        <ProfileEmpty />
      )}
    </section>
  )
}

// View-model passed from the /u/[handle] page into the profile
// components. The page does the impure work (Supabase read +
// content-loader season-slug resolution); the components are pure
// presentational so they unit-test without mocks.

export type ProfileCommentView = {
  id: string
  excerpt: string
  when: string
  // Resolved season context, or null for a reply / unresolvable
  // target. `href` is always a clean slug-canonical season URL
  // when present (never the digit form that 308-redirects).
  context: { label: string; href: string } | null
}

export type ProfileView = {
  handle: string
  displayName: string | null
  memberSince: string
  publishedCommentCount: number
  votedSeasonCount: number
  votedShowCount: number
  comments: ProfileCommentView[]
  populated: boolean
}

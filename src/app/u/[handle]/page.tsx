import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

type Params = { handle: string }

export const dynamic = 'force-static'

export function generateStaticParams(): Params[] {
  // Until the users table lands (phase 10), pre-render only the e2e
  // user's handle if it's been declared via env. Everything else
  // 404s — which is what we want pre-auth.
  const handle = process.env['E2E_USER_HANDLE']
  return handle ? [{ handle }] : []
}

export const dynamicParams = true

export function generateMetadata({ params }: { params: Params }): Metadata {
  return buildMetadata({
    title: `@${params.handle}`,
    description: `Profile of @${params.handle} on pantheon.`,
    path: `/u/${params.handle}`,
    noIndex: true,
  })
}

export default function UserProfilePage({ params }: { params: Params }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 md:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">
          @{params.handle}
        </h1>
        <p className="text-ink-2">
          Public profile. Activity lands in phase 10.
        </p>
      </header>

      <p className="text-ink-2">
        Recent votes, comments, and the canon picks this member agrees with
        will populate here.
      </p>
    </section>
  )
}

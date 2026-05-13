import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Moderation',
    description: 'Moderation queue for pantheon (mod role only).',
    path: '/mod',
    noIndex: true,
  })
}

export default function ModPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 md:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl">
          Moderation
        </h1>
        <p className="text-ink-2">Mod role required.</p>
      </header>

      <p className="text-ink-1">
        The queue lands in phase 13. Comments and flags will drain through
        this page; every action writes an immutable row to{' '}
        <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-sm text-ink-0">
          mod_actions
        </code>
        .
      </p>

      <Link
        href="/sign-in"
        prefetch={false}
        className="text-primary-base underline hover:opacity-80"
      >
        Sign in
      </Link>
    </section>
  )
}

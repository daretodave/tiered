import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Sign in',
    description: 'Sign in to pantheon via magic link.',
    path: '/sign-in',
    noIndex: true,
  })
}

export default function SignInPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16 md:py-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl leading-tight text-ink-0 md:text-4xl">
          Sign in
        </h1>
        <p className="text-ink-2">
          Magic link via email. No password. Lands in phase 10.
        </p>
      </header>

      <form
        action="/api/auth/login"
        method="get"
        className="flex flex-col gap-3"
        aria-label="Sign in with email"
      >
        <label htmlFor="email" className="text-sm text-ink-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled
          className="rounded border border-line-base bg-paper-1 px-3 py-2 text-ink-1"
        />
        <button
          type="submit"
          disabled
          className="rounded border border-line-base bg-paper-1 px-4 py-2 text-ink-2"
        >
          Send magic link
        </button>
      </form>
    </section>
  )
}

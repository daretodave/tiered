import Link from 'next/link'
import { Footer } from '@/components/chrome/Footer'
import { Header } from '@/components/chrome/Header'
import { SkipToMain } from '@/components/chrome/SkipToMain'
import { Wrap } from '@/components/chrome/Wrap'

// Root-level 404 boundary. Route groups (e.g. `(default)`) only
// catch notFound() calls or matched-but-missing children within
// their own subtree — a URL with no matching segment anywhere
// (e.g. /account) falls through here instead, past every group's
// own not-found.tsx. Without this file, that fell through to
// Next's bare unstyled built-in 404 (CRITIQUE pass-120). Mirrors
// (default)/not-found.tsx's copy/link, wrapped in the same shared
// header + footer chrome so an unmatched URL still reads as
// tiered.tv with a way back.
export default function RootNotFound() {
  return (
    <>
      <SkipToMain />
      <Header />
      <Wrap>
        <main id="main" className="flex-1">
          <section className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-6 py-24">
            <h1 className="font-serif text-3xl text-ink-0">Not found.</h1>
            <p className="text-ink-2">
              The page you&rsquo;re looking for hasn&rsquo;t been built yet, or never existed.
            </p>
            <Link
              href="/"
              className="text-primary-base underline-offset-4 hover:underline"
            >
              Back to tiered.tv
            </Link>
          </section>
        </main>
      </Wrap>
      <Footer />
    </>
  )
}

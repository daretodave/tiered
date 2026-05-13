import Link from 'next/link'
import { Wordmark } from './Wordmark'
import { ThemeToggle } from './ThemeToggle'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-line-soft bg-paper-1 shadow-elev-1">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:py-16">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="text-sm text-ink-2">The seasons, ranked. No spoilers.</p>
        </div>

        <nav aria-label="Browse" className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-widest text-ink-3">Browse</h2>
          <Link
            href="/shows"
            prefetch={false}
            className="text-sm text-ink-1 hover:text-primary-base"
          >
            Shows
          </Link>
          <Link
            href="/themes"
            prefetch={false}
            className="text-sm text-ink-1 hover:text-primary-base"
          >
            Themes
          </Link>
          <Link
            href="/about"
            prefetch={false}
            className="text-sm text-ink-1 hover:text-primary-base"
          >
            About
          </Link>
        </nav>

        <nav aria-label="The fine print" className="flex flex-col gap-2">
          <h2 className="text-xs uppercase tracking-widest text-ink-3">The fine print</h2>
          <Link
            href="/terms"
            prefetch={false}
            className="text-sm text-ink-1 hover:text-primary-base"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            prefetch={false}
            className="text-sm text-ink-1 hover:text-primary-base"
          >
            Privacy
          </Link>
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 pb-10 pt-2">
        <p className="text-xs text-ink-3">© {year} — pantheon. an experiment.</p>
        <ThemeToggle />
      </div>
    </footer>
  )
}

import { Wordmark } from './Wordmark'

export function Header() {
  return (
    <header className="border-b border-line-soft bg-paper-1">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Wordmark />
        {/* Search + sign-in slots land in later phases. */}
        <nav aria-label="Primary" className="text-sm text-ink-2">
          {/* intentionally empty in phase 1 */}
        </nav>
      </div>
    </header>
  )
}

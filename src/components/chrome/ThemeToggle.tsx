'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function readDocTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark'
}

export function ThemeToggle() {
  // We do NOT seed from localStorage on mount; the inline head script in
  // layout.tsx already set the data-theme attribute pre-paint. We just
  // mirror it.
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(readDocTheme())
    setMounted(true)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset['theme'] = next
    try {
      window.localStorage.setItem('pantheon_theme', next)
    } catch {
      /* private mode or quota — ignore. */
    }
  }

  const oppositeLabel = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${oppositeLabel} mode`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-soft bg-paper-2 text-ink-1 hover:text-primary-base"
      // Suppress hydration mismatch on the icon swap — pre-mount the
      // button always renders the dark glyph.
      suppressHydrationWarning
    >
      <span aria-hidden="true" className="text-base">
        {mounted && theme === 'light' ? '☼' : '☾'}
      </span>
    </button>
  )
}

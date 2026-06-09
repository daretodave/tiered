'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tiered_saved_lists'

function readSaved(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

function writeSaved(list: string[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage may throw in private mode — silently ignore.
  }
}

type ListDetailToolsProps = {
  themeSlug: string
  themeTitle: string
}

export function ListDetailTools({ themeSlug, themeTitle }: ListDetailToolsProps) {
  const [saved, setSaved] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  useEffect(() => {
    setSaved(readSaved().includes(themeSlug))
  }, [themeSlug])

  function onSave() {
    const list = readSaved()
    const ix = list.indexOf(themeSlug)
    let next: string[]
    if (ix === -1) {
      next = [...list, themeSlug]
    } else {
      next = [...list.slice(0, ix), ...list.slice(ix + 1)]
    }
    writeSaved(next)
    setSaved(next.includes(themeSlug))
  }

  function onShare() {
    if (typeof window === 'undefined') return
    const url = window.location.href
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => {
          setCopyState('copied')
          window.setTimeout(() => setCopyState('idle'), 1200)
        },
        () => {
          // clipboard rejected — leave idle.
        },
      )
    }
  }

  const mailto = `mailto:editors@tiered.tv?subject=${encodeURIComponent(
    `Suggest entry: ${themeTitle}`,
  )}`

  return (
    <div className="list-tools" data-testid="list-tools">
      <div className="tools-left">
        <button
          type="button"
          className={`tool-btn${saved ? ' on' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${themeTitle}` : `Save ${themeTitle}`}
          data-testid="list-save"
          data-saved={saved ? 'true' : 'false'}
          onClick={onSave}
        >
          {saved ? 'Saved' : 'Save (this device)'}
        </button>
        {saved ? (
          <span className="tool-caption" data-testid="list-save-caption">
            saved on this device
          </span>
        ) : null}
        <button
          type="button"
          className="tool-btn"
          aria-label={`Share ${themeTitle}`}
          data-testid="list-share"
          data-copy-state={copyState}
          onClick={onShare}
        >
          {copyState === 'copied' ? 'Link copied' : 'Share'}
        </button>
        <a
          className="tool-btn"
          href={mailto}
          aria-label={`Suggest an entry for ${themeTitle}`}
          data-testid="list-suggest"
        >
          Suggest an entry
        </a>
      </div>
      <span
        className="tool-btn shield"
        role="status"
        aria-label="No spoilers — every entry is reviewed"
        data-testid="list-shield"
      >
        <span className="dot" aria-hidden="true">
          ●
        </span>
        No spoilers · reviewed
      </span>
    </div>
  )
}

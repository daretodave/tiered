import type { WatchListItem } from '@/content'

// Phase 30: "What to watch for" grid. Ported from
// design/tiered.tv · Heroes vs. Villains.html § .watch-list. Returns
// null when the array is empty so the parent section can collapse
// alongside its TOC entry.

type WatchListProps = {
  items: readonly WatchListItem[] | undefined
}

export function WatchList({ items }: WatchListProps) {
  if (!items || items.length === 0) return null
  return (
    <ul className="watch-list" data-testid="watch-list">
      {items.map((item, i) => (
        <li
          key={`${item.episode_label}-${i}`}
          data-testid="watch-list-item"
        >
          <div className="watch-key">{item.episode_label}</div>
          <p className="watch-body">{item.body}</p>
        </li>
      ))}
    </ul>
  )
}

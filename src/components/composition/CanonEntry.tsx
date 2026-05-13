import Link from 'next/link'

type CanonEntryProps = {
  rank: number
  title: string
  seasonNumber: number
  rationale: string
  href: string
}

function formatRank(rank: number): string {
  return `#${String(rank).padStart(2, '0')}`
}

function formatSeason(n: number): string {
  return `Season ${String(n).padStart(2, '0')}`
}

export function CanonEntry({ rank, title, seasonNumber, rationale, href }: CanonEntryProps) {
  return (
    <li className="canon-entry" data-testid="canon-entry" data-rank={rank}>
      <Link href={href} className="canon-entry-head">
        <span className="canon-rank" aria-label={`rank ${rank}`}>
          {formatRank(rank)}
        </span>
        <span className="canon-entry-title">{title}</span>
        <span className="canon-entry-season">{formatSeason(seasonNumber)}</span>
      </Link>
      <p className="canon-rationale">{rationale}</p>
    </li>
  )
}

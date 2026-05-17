type ProfileStatsProps = {
  publishedCommentCount: number
  votedSeasonCount: number
  votedShowCount: number
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many
}

// Participation aggregates only — never per-ballot detail. These
// counts can't reveal an unpublished canon position or a season
// outcome (phase 38 spoiler posture, agents.md §7).
export function ProfileStats({
  publishedCommentCount,
  votedSeasonCount,
  votedShowCount,
}: ProfileStatsProps) {
  const cells: { key: string; value: number; label: string }[] = [
    {
      key: 'comments',
      value: publishedCommentCount,
      label: plural(publishedCommentCount, 'comment', 'comments'),
    },
    {
      key: 'seasons',
      value: votedSeasonCount,
      label: `${plural(votedSeasonCount, 'season', 'seasons')} voted`,
    },
    {
      key: 'shows',
      value: votedShowCount,
      label: `${plural(votedShowCount, 'show', 'shows')} followed`,
    },
  ]

  return (
    <dl
      className="grid grid-cols-3 gap-3 border-y border-line-soft py-5"
      data-testid="profile-stats"
    >
      {cells.map((c) => (
        <div
          key={c.key}
          className="flex flex-col gap-1"
          data-testid={`profile-stat-${c.key}`}
        >
          <dt className="font-mono text-2xl text-ink-0">{c.value}</dt>
          <dd className="text-xs uppercase tracking-wide text-ink-3">
            {c.label}
          </dd>
        </div>
      ))}
    </dl>
  )
}

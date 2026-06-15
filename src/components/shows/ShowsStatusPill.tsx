type ShowsStatusPillProps = {
  shipped: number
  target: number
}

export function ShowsStatusPill({ shipped, target }: ShowsStatusPillProps) {
  const label =
    shipped >= target
      ? 'review in progress'
      : `in progress · ${shipped} / ${target}`
  return (
    <span className="show-tile-status" data-testid="show-tile-status">
      {label}
    </span>
  )
}

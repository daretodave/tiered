type ShowsStatusPillProps = {
  shipped: number
  target: number
}

export function ShowsStatusPill({ shipped, target }: ShowsStatusPillProps) {
  return (
    <span
      className="show-tile-status"
      data-testid="show-tile-status"
    >
      in progress · {shipped} / {target}
    </span>
  )
}

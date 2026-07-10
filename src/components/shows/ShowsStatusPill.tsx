type ShowsStatusPillProps = {
  shipped: number
  target: number
}

export function ShowsStatusPill({ shipped, target }: ShowsStatusPillProps) {
  const inReview = shipped >= target
  const label = inReview ? 'review in progress' : `in progress · ${shipped} / ${target}`
  const title = inReview
    ? 'Canon entries published, under editorial review'
    : `${shipped} of ${target} canon entries published toward the review floor`
  return (
    <span className="show-tile-status" data-testid="show-tile-status" title={title}>
      {label}
    </span>
  )
}

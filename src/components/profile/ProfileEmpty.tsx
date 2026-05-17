// Shown when a real member has no published comments and no live
// votes. The profile still renders (handle resolved, not a 404) —
// it just has nothing to show yet. The page keeps this state
// noIndex so a thin profile never enters the index.
export function ProfileEmpty() {
  return (
    <p className="text-ink-2" data-testid="profile-empty">
      No public activity yet. Votes and published comments will show up
      here.
    </p>
  )
}

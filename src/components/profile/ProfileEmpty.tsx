// Shown when a real member has no published comments and no live
// votes. The profile still renders (handle resolved, not a 404) —
// it just has nothing to show yet. The page keeps this state
// noIndex so a thin profile never enters the index.
export function ProfileEmpty() {
  return (
    <p className="text-ink-2" data-testid="profile-empty">
      Nothing on the public record yet. Vote on a season pair, weigh in
      on a thread, and it will land here.
    </p>
  )
}

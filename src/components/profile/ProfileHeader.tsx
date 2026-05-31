type ProfileHeaderProps = {
  handle: string
  displayName: string | null
  memberSince: string
  isSelfView?: boolean
}

export function ProfileHeader({
  handle,
  displayName,
  memberSince,
  isSelfView = false,
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-2" data-testid="profile-header">
      {isSelfView ? (
        <p
          className="text-sm text-ink-3"
          data-testid="profile-self-eyebrow"
        >
          Your record
        </p>
      ) : (
        // CRITIQUE pass 22 MED (#262): the stranger view used to ship
        // no ownership cue, leaving the page bare while the empty
        // state below addressed the wrong viewer. Naming whose record
        // this is — `@{handle}'s record` — frames the page for a
        // visitor arriving from a thread or another reader's link,
        // and balances the owner branch's `Your record` cue.
        <p
          className="text-sm text-ink-3"
          data-testid="profile-stranger-eyebrow"
        >
          @{handle}&rsquo;s record
        </p>
      )}
      <h1
        className="font-serif text-4xl leading-tight text-ink-0 md:text-5xl"
        data-testid="profile-handle"
      >
        @{handle}
      </h1>
      {displayName ? (
        <p className="text-ink-1" data-testid="profile-display-name">
          {displayName}
        </p>
      ) : null}
      <p className="text-sm text-ink-3" data-testid="profile-member-since">
        Member since {memberSince}
      </p>
    </header>
  )
}

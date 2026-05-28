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
      ) : null}
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

type ProfileHeaderProps = {
  handle: string
  displayName: string | null
  memberSince: string
}

export function ProfileHeader({
  handle,
  displayName,
  memberSince,
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-2" data-testid="profile-header">
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

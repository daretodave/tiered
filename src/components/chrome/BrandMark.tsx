type BrandMarkProps = {
  size?: 16 | 22 | 28 | 48 | 96 | 240
  className?: string
}

const ALLOWED_SIZES = [16, 22, 28, 48, 96, 240] as const

export function BrandMark({ size = 22, className }: BrandMarkProps) {
  if (
    process.env.NODE_ENV !== 'production' &&
    !ALLOWED_SIZES.includes(size as (typeof ALLOWED_SIZES)[number])
  ) {
    // biome-ignore lint/suspicious/noConsole: dev-time guard
    console.warn(
      `<BrandMark> size must be one of ${ALLOWED_SIZES.join(', ')}; got ${String(size)}`,
    )
  }
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      data-testid="brand-mark"
    >
      <rect x="4" y="5" width="20" height="4" fill="currentColor" />
      <rect x="4" y="12" width="14" height="4" fill="currentColor" />
      <rect x="4" y="19" width="8" height="4" fill="currentColor" />
    </svg>
  )
}

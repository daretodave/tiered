import Link from 'next/link'

type WordmarkProps = {
  href?: string
  className?: string
}

export function Wordmark({ href = '/', className = '' }: WordmarkProps) {
  const styles =
    'font-serif text-xl font-semibold tracking-tight text-primary-base hover:opacity-90'
  const compiled = className ? `${styles} ${className}` : styles

  return (
    <Link href={href} className={compiled} aria-label="Pantheon home">
      Pantheon
    </Link>
  )
}

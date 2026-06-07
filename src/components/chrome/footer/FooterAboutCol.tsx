import Link from 'next/link'

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/about', label: 'About the canon' },
  { href: '/about#voting', label: 'How voting works' },
  { href: '/about#spoilers', label: 'Spoilers policy' },
  { href: '/about#editors', label: 'Become an editor' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export function FooterAboutCol() {
  return (
    <nav
      className="site-footer-col"
      aria-label="tiered.tv"
      data-testid="site-footer-about-col"
    >
      <h2 className="site-footer-col-head">tiered.tv</h2>
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { ThemeToggle } from '../ThemeToggle'

export function FooterMeta() {
  const year = new Date().getFullYear()
  return (
    <div className="site-footer-meta" data-testid="site-footer-meta">
      <span className="site-footer-meta-rebellion">
        © {year} tiered.tv · est. as a quiet rebellion against ranked lists that
        ruin the show
      </span>
      <span className="site-footer-meta-toggle">
        <ThemeToggle />
      </span>
    </div>
  )
}

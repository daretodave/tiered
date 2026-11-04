import { HeaderView } from './HeaderView'

type HeaderProps = {
  tinted?: boolean
}

// The header renders into static/ISR pages. Reading the Auth0 session
// here (cookies) forced every page that mounts the header to render
// per request, which dominated the team's Vercel CPU usage. The auth
// island inside HeaderView resolves the viewer via GET /api/auth/me
// on mount instead.
export function Header({ tinted = false }: HeaderProps) {
  return <HeaderView tinted={tinted} user={null} />
}

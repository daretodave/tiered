import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Singleton Auth0 client. The SDK auto-reads AUTH0_DOMAIN /
// AUTH0_CLIENT_ID / AUTH0_CLIENT_SECRET / AUTH0_SECRET /
// AUTH0_BASE_URL from process.env on construction — see
// setup/04_auth0.md Section K for the env contract.
//
// Mount via Next.js middleware (`auth0.middleware(request)`) so
// the /auth/login, /auth/logout, /auth/callback, /auth/profile,
// /auth/access-token routes are handled automatically. Server
// components + route handlers call `auth0.getSession()` to read
// the current session.

export const auth0 = new Auth0Client({
  authorizationParameters: {
    // Passwordless / magic-link is enabled in Universal Login;
    // the SDK forwards the user to Auth0's hosted page which
    // collects the email + emits the link.
    scope: 'openid profile email',
    ...(process.env['AUTH0_AUDIENCE']
      ? { audience: process.env['AUTH0_AUDIENCE'] }
      : {}),
  },
})

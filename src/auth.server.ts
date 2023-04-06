import { Auth0RemixServer } from 'auth0-remix-server';
import { CSRF_TOKEN_KEY, getCsrfCookieStorage } from '~/csrfToken.server';
import { getSessionStorage } from '~/sessionStorage.server';

export const authenticator = new Auth0RemixServer({
  clientDetails: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
  },
  callbackURL: `${process.env.APP_DOMAIN}/auth/callback`,
  refreshTokenRotationEnabled: true,
  failedLoginRedirect: '/',
  session: {
    store: getSessionStorage()
  },
  csrfSession: {
    key: CSRF_TOKEN_KEY,
    store: getCsrfCookieStorage()
  }
});


import { Auth0RemixServer } from '~/lib/auth0-remix/Auth0Remix.server';
import { getSessionStorage } from '~/sessionStorage.server';
const DOMAIN = 'http://localhost:3000';

export const authenticator = new Auth0RemixServer({
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  callbackURL: `${DOMAIN}/auth/callback`,
  refreshTokenRotationEnabled: true,
  failedLoginRedirect: '/',
  session: {
    sessionStorage: getSessionStorage()
  }
});


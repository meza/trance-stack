import { isSession, redirect } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { destroySession, getSessionFromRequest } from '~/session.server';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';
import type { Auth0Profile } from 'remix-auth-auth0';
const DOMAIN = 'http://localhost:3000';
// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<Auth0Profile>(getSessionStorage());

/** IDEAL WOULD BE TO USE THIS
const authenticator = new Auth0Auth({
  tokenType: 'access' || 'id',
  callbackURL: `${DOMAIN}/auth/callback`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  onLogin: async ({ accessToken, refreshToken, extraParams, profile }) -> {}
});

authenticator.authenticate(request); // this would redirect to the auth0 login page
authenticator.handleCallback({
  successRedirect: '/',
  failureRedirect: '/login'
}); // this would handle the callback from auth0
authenticator.isAuthenticated(request); // this would return the user if they are logged in (checks token, refresh, etc)
authenticator.logout(request, {redirectTo: DOMAIN}); // this would log the user out (clears session, etc)

 **/

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: `${DOMAIN}/auth/callback`,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return profile;
  }
);

authenticator.use(auth0Strategy);
authenticator.logout = async (
  request: Request | Session,
  options: { redirectTo: string }
): Promise<never> => {
  const session = isSession(request) ? request : await getSessionFromRequest(request);

  const logoutURL = new URL('https://' + process.env.AUTH0_DOMAIN + '/v2/logout');

  logoutURL.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
  logoutURL.searchParams.set('returnTo', options.redirectTo);

  throw redirect(logoutURL.toString(), {
    headers: {
      'Set-Cookie': await destroySession(session)
    }
  });
};

import { redirect } from '@remix-run/node';
import { Auth0RemixServer } from '~/lib/auth0-remix/Auth0Remix.server';
import { getSessionFromRequest } from '~/session.server';
import { getSessionStorage } from '~/sessionStorage.server';
import type { UserCredentials } from '~/lib/auth0-remix/Auth0RemixTypes';
const DOMAIN = 'http://localhost:3000';

/** IDEAL WOULD BE TO USE THIS
const authenticator = new Auth0Auth({
  tokenType: 'access' || 'id',
  callbackURL: `${DOMAIN}/auth/callback`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN
});

authenticator.authenticate(request); // this would redirect to the auth0 login page
authenticator.handleCallback({
  successRedirect: '/',
  failureRedirect: '/login'
}); // this would handle the callback from auth0
authenticator.isAuthenticated(request); // this would return the user if they are logged in (checks token, refresh, etc)
authenticator.logout(request, {redirectTo: DOMAIN}); // this would log the user out (clears session, etc)

 **/

export const authenticator = new Auth0RemixServer({
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  callbackURL: `${DOMAIN}/auth/callback`,
  failedLoginRedirect: '/',
  session: {
    sessionStorage: getSessionStorage()
  }
});

export interface GetUserProps {
  failureRedirect?: string;
  successRedirect?: string;
}

export const getUser = async (request: Request, props?: GetUserProps) => {
  const session = await getSessionFromRequest(request);
  console.log({ session: session.get('user') });
  if (!session || !session.has('user')) {
    if (props?.failureRedirect) {
      throw redirect(props.failureRedirect);
    }
    return null;
  }

  const userData: UserCredentials = session.get('user');
  return await authenticator.getUser(userData);
};

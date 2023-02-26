import { redirect } from '@remix-run/node';
import * as jose from 'jose';
import { jwtVerify } from 'jose';
import { ensureDomain } from './lib/ensureDomainFormat';
import { getCredentials, saveUserToSession } from './lib/session';
import { transformUserData } from './lib/transformUserData';
import type { Auth0RemixOptions, ClientCredentials, HandleCallbackOptions, SessionStore, UserCredentials, UserProfile } from './Auth0RemixTypes';
import type { AppLoadContext } from '@remix-run/node';
import type { JOSEError } from 'jose/dist/types/util/errors';

/**
 * Use cases:
 * - no internal session handling
 * - allowing the user to deal with the id token on their own
 * - deal with the refresh token outside the session IF rotation isn't enabled
 * - mfa
 */

interface Auth0Urls {
  authorizationURL: string;
  openIDConfigurationURL: string;
  jwksURL: string;
  userProfileUrl: string;
  tokenURL: string;
}

export class Auth0RemixServer {
  private readonly domain: string;
  private readonly refreshTokenRotationEnabled: boolean;
  private readonly callbackURL: string;
  private readonly failedLoginRedirect: string;
  private readonly jwks: ReturnType<typeof jose.createRemoteJWKSet>;
  private readonly clientCredentials: ClientCredentials;
  private readonly session: SessionStore;
  private readonly auth0Urls: Auth0Urls;

  constructor(auth0RemixOptions: Auth0RemixOptions) {
    this.domain = ensureDomain(auth0RemixOptions.clientDetails.domain);

    /**
     * Refresh token rotation allows us to store the refresh tokens in the user's session.
     * It is off by default because it requires an explicit setup in Auth0.
     *
     * @see https://auth0.com/docs/tokens/refresh-tokens/refresh-token-rotation
     * @see https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#Refresh-Token-Rotation
     */
    this.refreshTokenRotationEnabled = auth0RemixOptions.refreshTokenRotationEnabled || false;

    this.failedLoginRedirect = auth0RemixOptions.failedLoginRedirect;
    this.callbackURL = auth0RemixOptions.callbackURL;

    this.clientCredentials = {
      clientID: auth0RemixOptions.clientDetails.clientID,
      clientSecret: auth0RemixOptions.clientDetails.clientSecret,
      audience: auth0RemixOptions.clientDetails.audience || `${this.domain}/api/v2/`,
      organization: auth0RemixOptions.clientDetails.organization
    };
    this.session = {
      store: auth0RemixOptions.session.store,
      key: auth0RemixOptions.session.key || 'user'
    };
    this.auth0Urls = {
      tokenURL: `${this.domain}/oauth/token`,
      userProfileUrl: `${this.domain}/userinfo`,
      authorizationURL: `${this.domain}/authorize`,
      jwksURL: `${this.domain}/.well-known/jwks.json`,
      openIDConfigurationURL: `${this.domain}/.well-known/openid-configuration`
    };

    this.jwks = jose.createRemoteJWKSet(new URL(this.auth0Urls.jwksURL));
  }

  public authorize = async (forceLogin = false) => {
    const scope = [
      'offline_access', // required for refresh token
      'openid', // required for id_token and the /userinfo api endpoint
      'profile',
      'email'];
    const authorizationURL = new URL(this.auth0Urls.authorizationURL);
    authorizationURL.searchParams.set('response_type', 'code');
    authorizationURL.searchParams.set('response_mode', 'form_post');
    authorizationURL.searchParams.set('client_id', this.clientCredentials.clientID);
    authorizationURL.searchParams.set('redirect_uri', this.callbackURL);
    authorizationURL.searchParams.set('scope', scope.join(' '));
    authorizationURL.searchParams.set('audience', this.clientCredentials.audience);
    if (forceLogin) {
      authorizationURL.searchParams.set('prompt', 'login');
    }
    if (this.clientCredentials.organization) {
      authorizationURL.searchParams.set('organization', this.clientCredentials.organization);
    }

    throw redirect(authorizationURL.toString());
  };

  public handleCallback = async (request: Request, options: HandleCallbackOptions): Promise<never | UserCredentials> => {
    const formData = await request.formData();
    const code = formData.get('code') as string;

    if (!code) {
      console.error('No code found in callback');
      throw redirect(this.failedLoginRedirect);
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', this.clientCredentials.clientID);
    body.set('client_secret', this.clientCredentials.clientSecret);
    body.set('code', code);
    body.set('redirect_uri', this.callbackURL);

    const response = await fetch(this.auth0Urls.tokenURL, {
      headers: { 'content-type' : 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: body.toString()
    });

    if (!response.ok) {
      console.error('Failed to get token from Auth0');
      throw redirect(this.failedLoginRedirect);
    }

    const data = await response.json();
    const userData = {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      lastRefreshed: Date.now(),
      expiresAt: Date.now() + data.expires_in * 1000
    } as UserCredentials;

    if (this.refreshTokenRotationEnabled) {
      userData.refreshToken = data.refresh_token;
    } else {
      // callUserRefreshTokenCallback(userData.refreshToken)
    }

    // callUserIdTokenCallback(data.id_token)

    if (options.onSuccessRedirect) {
      const headers = await saveUserToSession(request, userData, this.session);
      throw redirect(options.onSuccessRedirect, {
        headers: headers
      });
    }

    return userData;
  };

  public logout = async (redirectTo: string, headers?: HeadersInit) => {
    const logoutURL = new URL(`${this.domain}/v2/logout`);
    logoutURL.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
    logoutURL.searchParams.set('returnTo', redirectTo);
    throw redirect(logoutURL.toString(), {
      headers: headers
    });
  };

  public getUser = async (request: Request, context: AppLoadContext): Promise<UserProfile> => {
    const credentials = await getCredentials(request, this.session);
    try {

      await jwtVerify(credentials.accessToken, this.jwks, {
        issuer: new URL(this.domain).hostname,
        audience: this.clientCredentials.audience
      });

      return await this.getUserProfile(credentials);

    } catch (error) {
      if ((error as JOSEError).code === 'ERR_JWT_EXPIRED') {
        if (!context.refresh) {
          context.refresh = this.refreshCredentials(credentials);
          const result = (await context.refresh) as UserCredentials;
          const headers = await saveUserToSession(request, result, this.session);
          throw redirect(request.url, {
            headers: headers
          });
        }

        await context.refresh;
        return await this.getUser(request, context);

      }

      console.error('Failed to verify JWT', error);
      throw redirect(this.failedLoginRedirect);
    }
  };

  private refreshCredentials = async (credentials: UserCredentials): Promise<UserCredentials> => {
    if (!credentials.refreshToken) {
      throw new Error('No refresh token found within the credentials.');
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', this.clientCredentials.clientID);
    body.set('client_secret', this.clientCredentials.clientSecret);
    body.set('refresh_token', credentials.refreshToken);

    const response = await fetch(this.auth0Urls.tokenURL, {
      headers: { 'content-type' : 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: body.toString()
    });

    if (!response.ok) {
      console.error('Failed to refresh token from Auth0');
      throw redirect(this.failedLoginRedirect);
    }
    const data = await response.json();
    const userData = {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      lastRefreshed: Date.now(),
      expiresAt: Date.now() + data.expires_in * 1000
    } as UserCredentials;

    if (this.refreshTokenRotationEnabled) {
      userData.refreshToken = data.refresh_token || credentials.refreshToken;
    } else {
      // callUserRefreshTokenCallback(userData.refreshToken)
    }

    // callUserIdTokenCallback(data.id_token)

    return userData;
  };

  private getUserProfile = async (credentials: UserCredentials): Promise<UserProfile> => {
    const response = await fetch(this.auth0Urls.userProfileUrl, {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`
      }
    });

    if (!response.ok) {
      console.error('Failed to get user profile from Auth0');
      throw redirect(this.failedLoginRedirect);
    }

    const data = await response.json();
    return transformUserData(data);
  };
}

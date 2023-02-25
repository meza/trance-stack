import { isSession, redirect } from '@remix-run/node';
import * as jose from 'jose';
import { jwtVerify } from 'jose';
import type { SessionStorage } from '@remix-run/node';
import type { Auth0RemixOptions, UserCredentials, UserProfile } from '~/lib/auth0-remix/Auth0RemixTypes';

interface Auth0UserProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  preferred_username: string;
  profile: string;
  picture: string;
  website: string;
  email: string;
  email_verified: boolean;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  locale: string;
  phone_number: string;
  phone_number_verified: boolean;
  address: {
    country: string;
  },
  updated_at: string;
  [key: string]: string | boolean | number | object;
}

export class Auth0RemixServer {
  private readonly domain: string;
  private readonly clientID: string;
  private readonly clientSecret: string;
  private readonly callbackURL: string;
  private readonly scope: string[];
  private readonly audience: string;
  private readonly organization?: string;
  private readonly authorizationURL: string;
  private readonly tokenURL: string;
  private readonly failedLoginRedirect: string;
  private readonly openIDConfigurationURL: string;
  private readonly jwksURL: string;
  private readonly sessionStorage: SessionStorage;
  private readonly userDataKey: string;
  private forceLogin: boolean;
  private jwks: ReturnType<typeof jose.createRemoteJWKSet>;

  constructor(auth0RemixOptions: Auth0RemixOptions, forceLogin = false) {
    this.forceLogin = forceLogin;
    this.domain = auth0RemixOptions.domain;
    this.clientID = auth0RemixOptions.clientID;
    this.clientSecret = auth0RemixOptions.clientSecret;
    this.callbackURL = auth0RemixOptions.callbackURL;
    this.scope = auth0RemixOptions.scope || ['openid', 'profile', 'email'];
    this.organization = auth0RemixOptions.organization;
    this.failedLoginRedirect = auth0RemixOptions.failedLoginRedirect;
    this.sessionStorage = auth0RemixOptions.session.sessionStorage;
    this.userDataKey = auth0RemixOptions.session.userDataKey || 'user';
    this.tokenURL = `https://${this.domain}/oauth/token`;
    this.authorizationURL = `https://${this.domain}/authorize`;
    this.jwksURL = `https://${this.domain}/.well-known/jwks.json`;
    this.audience = auth0RemixOptions.audience || `https://${this.domain}/api/v2/`;
    this.openIDConfigurationURL = `https://${this.domain}/.well-known/openid-configuration`;
    this.jwks = jose.createRemoteJWKSet(new URL(this.jwksURL));
  }

  public authorize = async () => {
    const authorizationURL = new URL(this.authorizationURL);
    authorizationURL.searchParams.set('response_type', 'code');
    authorizationURL.searchParams.set('response_mode', 'form_post');
    authorizationURL.searchParams.set('client_id', this.clientID);
    authorizationURL.searchParams.set('redirect_uri', this.callbackURL);
    authorizationURL.searchParams.set('scope', this.scope.join(' '));
    authorizationURL.searchParams.set('audience', this.audience);
    if (this.forceLogin) {
      authorizationURL.searchParams.set('prompt', 'login');
    }
    if (this.organization) {
      authorizationURL.searchParams.set('organization', this.organization);
    }

    throw redirect(authorizationURL.toString());
  };

  private transformUserData = (data: Auth0UserProfile): UserProfile => {
    const renameKeys = (obj: {[key: string]: string | boolean | number | object}) => {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        const newKey = key.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
        if (newKey !== key) {
          obj[newKey] = obj[key];
          delete obj[key];
        }
        if (typeof obj[newKey] === 'object') {
          renameKeys(obj[newKey] as {[key: string]: string | boolean | number | object});
        }
      });
    };
    renameKeys(data);

    return structuredClone(data) as unknown as UserProfile;
  };

  private saveUserCredentials = async (request: Request, user: UserCredentials) => {
    const headers: HeadersInit = {};
    if (this.sessionStorage) {
      const cookie = request.headers.get('Cookie');
      const session = await this.sessionStorage.getSession(cookie);
      if (isSession(session)) {
        session.set(this.userDataKey, user);
        headers['Set-Cookie'] = await this.sessionStorage.commitSession(session);
      }
    } else {
      console.warn('No session storage configured. User credentials will not be persisted.');
    }

    return headers;
  };

  public handleCallback = async (request: Request, options: {
    onSuccessRedirect?: string;
  }): Promise<never | UserCredentials> => {
    const formData = await request.formData();
    const code = formData.get('code') as string;

    if (!code) {
      console.error('No code found in callback');
      throw redirect(this.failedLoginRedirect);
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', this.clientID);
    body.set('client_secret', this.clientSecret);
    body.set('code', code);
    body.set('redirect_uri', this.callbackURL);

    const response = await fetch(this.tokenURL, {
      headers: { 'content-type' : 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: body.toString()
    });

    console.log('response', response);
    console.log('requestBody', body.toString());

    if (!response.ok) {
      console.error('Failed to get token from Auth0');
      throw redirect(this.failedLoginRedirect);
    }

    const data = await response.json();
    const userData = {
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      lastRefreshed: Date.now(),
      expiresAt: Date.now() + data.expires_in * 1000
    };

    if (options.onSuccessRedirect) {
      const headers = await this.saveUserCredentials(request, userData);
      console.log('Would redirect to', options.onSuccessRedirect, 'with headers', headers);
      throw redirect(options.onSuccessRedirect, {
        headers: headers
      });
    }

    return userData;
  };

  public logout = async (redirectTo: string, headers?: HeadersInit) => {
    const logoutURL = new URL(`https://${this.domain}/v2/logout`);
    logoutURL.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
    logoutURL.searchParams.set('returnTo', redirectTo);

    throw redirect(logoutURL.toString(), {
      headers: headers
    });
  };

  private getCredentials = async (request: Request): Promise<UserCredentials> => {
    const cookie = request.headers.get('Cookie');
    const session = await this.sessionStorage.getSession(cookie);
    const credentials = session.get(this.userDataKey);
    return credentials;
  };

  public getUser = async (request: Request): Promise<UserProfile> => {
    const credentials = await this.getCredentials(request);
    try {

      // const { payload: accessTokenData } = await jwtVerify(credentials.accessToken, this.jwks, {
      //   issuer: `https://${this.domain}/`,
      //   audience: this.audience
      // });
      const { payload: data } = await jwtVerify(credentials.idToken, this.jwks, {
        issuer: `https://${this.domain}/`,
        audience: this.clientID
      });
      return this.transformUserData(data as Auth0UserProfile);
    } catch (error) {
      console.error('Failed to verify JWT', error);
      throw redirect(this.failedLoginRedirect);
    }
  };
}

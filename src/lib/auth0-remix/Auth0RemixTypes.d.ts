import type { SessionStorage } from '@remix-run/node';

export interface Auth0UserProfile {
  [key: string]: string | boolean | number | object;
}

export interface UserCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  expiresAt: number;
  lastRefreshed: number;
}

/**
 * @see https://auth0.com/docs/api/authentication#user-profile
 * @see https://auth0.com/docs/manage-users/user-accounts/user-profiles/normalized-user-profile-schema
 */
export interface UserProfile {
  sub: string;
  name: string;
  picture: string;
  nickname: string;
  givenName?: string;
  familyName?: string;
  middleName?: string;
  preferredUsername?: string;
  profile?: string;
  website?: string;
  email?: string;
  emailVerified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  address?: {
    country: string;
  },
  updatedAt: string;
  [key: string]: string | boolean | number | object | undefined
}

export interface ClientCredentials {
  clientID: string;
  clientSecret: string;
  audience: string;
  organization?: string;
}

export interface SessionStore {
  key: string;
  store: SessionStorage;
}

export interface Auth0RemixOptions {
  callbackURL: string;
  failedLoginRedirect: string;
  refreshTokenRotationEnabled?: boolean;
  clientDetails: Omit<ClientCredentials, 'audience'> & { audience?: string; domain: string; };
  session: Omit<SessionStore, 'key'> & { key?: string; };
}

export interface HandleCallbackOptions {
  onSuccessRedirect?: string;
}

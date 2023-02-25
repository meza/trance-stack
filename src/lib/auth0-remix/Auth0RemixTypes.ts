import type { SessionStorage } from '@remix-run/node';

export interface Auth0RemixOptions {
  domain: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  failedLoginRedirect: string;
  scope?: string[];
  audience?: string;
  organization?: string;
  session: {
    sessionStorage: SessionStorage;
    userDataKey?: string;
  }
}

export interface UserCredentials {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
  lastRefreshed: number;
}

export interface UserProfile {
  sub: string;
  name: string;
  givenName: string;
  familyName: string;
  middleName: string;
  nickname: string;
  preferredUsername: string;
  profile: string;
  picture: string;
  website: string;
  email: string;
  emailVerified: boolean;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  locale: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  address: {
    country: string;
  },
  updatedAt: string;
  [key: string]: string | boolean | number | object;
}

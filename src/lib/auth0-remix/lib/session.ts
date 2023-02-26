import { isSession } from '@remix-run/node';
import type { SessionStore, UserCredentials } from '~/lib/auth0-remix/Auth0RemixTypes';

export const saveUserToSession = async (request: Request, userCredentials: UserCredentials, sessionStorage?: SessionStore) => {
  const headers: HeadersInit = {};
  if (sessionStorage) {
    const cookie = request.headers.get('Cookie');
    const session = await sessionStorage.store.getSession(cookie);
    if (isSession(session)) {
      session.set(sessionStorage.key, userCredentials);
      headers['Set-Cookie'] = await sessionStorage.store.commitSession(session);
    }
  } else {
    console.warn('No session storage configured. User credentials will not be persisted.');
  }

  return headers;
};

export const getCredentials = async (request: Request, sessionStore: SessionStore): Promise<UserCredentials> => {
  const cookie = request.headers.get('Cookie');
  const session = await sessionStore.store.getSession(cookie);
  const credentials = session.get(sessionStore.key);
  return credentials;
};

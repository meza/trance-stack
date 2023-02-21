import { v4 as uuid } from 'uuid';
import { authenticator } from '~/auth.server';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';

let id: string;

export const getVisitorId = (session: Session, hostname = '') => {
  if (id) {
    return id;
  }
  const existingId = session.get('visitorId');
  if (existingId) {
    id = existingId;
    return existingId;
  }
  const newId = hostname === 'localhost' ? 'localdev' : uuid();
  console.log('new visitorId', newId);
  session.set('visitorId', newId);
  id = newId;
  return newId;
};

export const getSessionFromRequest = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return getSessionStorage().getSession(cookie);
};

export const getVisitorIdFromRequest = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  const session = await getSessionFromRequest(request);
  if (user) {
    session.set('visitorId', user.id);
    return user.id;
  }
  const hostname = new URL(request.url).hostname;
  return getVisitorId(session, hostname);
};

export const createUserSession = async (request: Request) => {

  const session = await getSessionFromRequest(request);
  getVisitorId(session);

  return await getSessionStorage().commitSession(session, {
    maxAge: 2147483647 // 31 Dec 2037
  });
};

export const destroySession = async (session: Session) => {
  return getSessionStorage().destroySession(session);
};

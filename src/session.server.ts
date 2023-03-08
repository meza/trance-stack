import { v4 as uuid } from 'uuid';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';

export const getVisitorId = (session: Session, hostname: string) => {
  const existingId = session.get('visitorId');

  if (existingId) {
    return existingId;
  }
  const newId = hostname === 'localhost' ? 'localdev' : uuid();
  session.set('visitorId', newId);
  return newId;
};

export const getSessionFromRequest = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return getSessionStorage().getSession(cookie);
};

export const getVisitorIdFromRequest = async (request: Request) => {
  // const user = await authenticatorX.isAuthenticated(request);
  const session = await getSessionFromRequest(request);
  // if (user) {
  //   session.set('visitorId', user.id);
  //   return user.id;
  // }
  const hostname = new URL(request.url).hostname;
  return getVisitorId(session, hostname);
};

export const createUserSession = async (request: Request) => {
  const session = await getSessionFromRequest(request);
  const id = getVisitorId(session, new URL(request.url).hostname);
  const cookie = await getSessionStorage().commitSession(session);
  return { cookie: cookie, visitorId: id, session: session };
};

export const destroySession = async (session: Session) => {
  return getSessionStorage().destroySession(session);
};

export const commitSession = async (session: Session) => {
  return getSessionStorage().commitSession(session);
};

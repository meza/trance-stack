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
  const session = await getSessionFromRequest(request);
  return getVisitorId(session, new URL(request.url).hostname);
};

export const createUserSession = async (request: Request) => {
  const session = await getSessionFromRequest(request);
  const id = getVisitorId(session, new URL(request.url).hostname);
  const cookie = await getSessionStorage().commitSession(session);
  return { cookie: cookie, visitorId: id };
};

export const destroySession = async (session: Session) => {
  return getSessionStorage().destroySession(session);
};

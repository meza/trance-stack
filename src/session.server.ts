import { createCookieSessionStorage, Session } from '@remix-run/node'; // or cloudflare/deno

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',

    httpOnly: true,
    maxAge: 60,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: process.env.NODE_ENV === 'production'
  }
});

export const getVisitorId = async (session: Session) => {
  if (!session.get('visitorId')) {
    session.set('visitorId', crypto.randomUUID());
  }

  return session.get('visitorId');
};

const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
};

const createUserSession = async (request: Request) => {

  const session = await getSession(request);
  await getVisitorId(session);

  return await sessionStorage.commitSession(session, {
    maxAge: 2147483647 // 31 Dec 2037
  });
};

export { createUserSession, getSession };

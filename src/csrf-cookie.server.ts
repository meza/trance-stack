import { createCookieSessionStorage } from '@remix-run/node';

const bytesToHex = (bytes: Uint8Array) =>
  bytes.reduce((hexstring, byte) => `${hexstring}${byte.toString(16).padStart(2, '0')}`, '');

const generateCsrfToken = () => bytesToHex(crypto.getRandomValues(new Uint8Array(32)));

const csrfCookie = createCookieSessionStorage({
  cookie: {
    name: '__csrf-token',
    httpOnly: true,
    path: '/',
    sameSite: false,
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: true
  }
});

export const createCrsfCookie = async (request: Request): Promise<string> => {
  const session = await csrfCookie.getSession(request.headers.get('Cookie'));
  if (!session.get('token')) {
    session.set('token', generateCsrfToken());
  }
  return csrfCookie.commitSession(session);
};

export const destroyCrsfCookie = async (request: Request): Promise<string> => {
  const session = await csrfCookie.getSession(request.headers.get('Cookie'));
  return csrfCookie.destroySession(session);
};
export const getCsrfToken = async (request: Request): Promise<undefined | string> => {
  const cookieStr = request.headers.get('Cookie');
  const session = await csrfCookie.getSession(cookieStr);
  return session.get<string>('token');
};

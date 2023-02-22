import { createCookieSessionStorage } from '@remix-run/node';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60,
    path: '/',
    sameSite: 'strict',
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: true
  }
});

export const getSessionStorage = () => {
  return sessionStorage;
};

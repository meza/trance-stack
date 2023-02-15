import { createCookieSessionStorage } from '@remix-run/node';

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

export const getSessionStorage = () => {
  return sessionStorage;
};

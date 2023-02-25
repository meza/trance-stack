import { createCookieSessionStorage } from '@remix-run/node';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 31536000,
    path: '/',
    sameSite: 'lax', // important for authentication to work properly
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: true
  }
});

export const getSessionStorage = () => {
  return sessionStorage;
};

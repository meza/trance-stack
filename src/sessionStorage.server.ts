import { createCookieSessionStorage } from '@remix-run/node';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 31536000,
    path: '/',
    sameSite: false, // important for the cookie to persist through authentication
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: true
  }
});

export const getSessionStorage = () => {
  return sessionStorage;
};

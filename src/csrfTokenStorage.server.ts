import { createCookieSessionStorage } from '@remix-run/node';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { CsrfSessionStorage } from 'auth0-remix-server';

export const CSRF_TOKEN_KEY = 'csrf-token';
export const CSRF_HASH_KEY = 'hash';

export const schema = z.object({
  [CSRF_TOKEN_KEY]: z.string(),
  [CSRF_HASH_KEY]: z.string()
}).strict();

const csrfCookieStorage = {
  ...createCookieSessionStorage({
    cookie: {
      name: '__csrf-token',
      httpOnly: true,
      maxAge: 31536000,
      path: '/',
      sameSite: false,
      // todo: use a different secret
      secrets: [process.env.SESSION_SECRET || 'secret'],
      secure: true
    }
  }),
  // just an example to show how custom token verification could work (token stays in the session and only hash is exposed)...
  // we can probably just have plain text tokens for now
  getToken: (session) => btoa(session.get(CSRF_HASH_KEY)),
  verifyToken: (tokenToCheck, session) => {
    console.log('** verifying token', { tokenFromParam: tokenToCheck, token: session.get(CSRF_TOKEN_KEY) });
    try {
      const token = session.get(CSRF_TOKEN_KEY);
      // eslint-disable-next-line no-sync
      return bcrypt.compareSync(token, atob(tokenToCheck));
    } catch (e) {
      return false;
    }
  }
} satisfies CsrfSessionStorage;

export const getCsrfCookieStorage = () => csrfCookieStorage;

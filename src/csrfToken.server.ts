import { createCookieSessionStorage } from '@remix-run/node';
import { generateCsrfToken } from 'auth0-remix-server';
import bcrypt from 'bcrypt';
import { z, ZodError } from 'zod';
import type { Session } from '@remix-run/node';
import type { CsrfSessionStorage } from 'auth0-remix-server';

const csrfCookie = createCookieSessionStorage({
  cookie: {
    name: '__csrf-token',
    httpOnly: true,
    maxAge: 31536000,
    path: '/',
    sameSite: false,
    secrets: [process.env.SESSION_SECRET || 'secret'],
    secure: true
  }
});

const csrfCookieStorage = {
  ...csrfCookie,
  getToken: (session) => {
    console.log('** getToken', session.get(CSRF_HASH_KEY));
    return btoa(session.get(CSRF_HASH_KEY));
  },
  verifyToken: (tokenToCheck, session) => {
    console.log('** verifying token', { tokenFromParam: tokenToCheck, token: session.get(CSRF_TOKEN_KEY) });
    console.log('** SESH', session.data);
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

export const CSRF_TOKEN_KEY = 'csrf-token';
const CSRF_HASH_KEY = 'hash';

const schema = z.object({
  [CSRF_TOKEN_KEY]: z.string(),
  [CSRF_HASH_KEY]: z.string()
}).strict();

export const destroyCsrfTokenSession = async (request: Request): Promise<string> => {
  const session = await csrfCookieStorage.getSession(request.headers.get('Cookie'));
  return csrfCookieStorage.destroySession(session);
};

export interface CsrfValidatorOpts {
  redirectPath?: string;

  tokenFactory?(): string;
}

class CsrfValidator {

  private readonly tokenFactory: () => string;

  constructor(private readonly opts?: CsrfValidatorOpts) {
    this.tokenFactory = opts?.tokenFactory || generateCsrfToken;
  }

  async getCsrfTokenSession(request: Request): Promise<{ cookie: string; session: Session; token: string }> {
    const session = await this.validateSession(request);

    return {
      cookie: await csrfCookieStorage.commitSession(session),
      session: session,
      token: csrfCookieStorage.getToken(session)
    };
  }

  async validate(request: Request): Promise<void> {
    console.log('[CsrfValidator] validate');
    let sessionData, tokenFromRequest;

    try {
      [sessionData, tokenFromRequest] = await Promise.all([
        this.getCsrfTokenSession(request),
        this.getTokenFromRequest(request)
      ]);
    } catch (e) {
      console.error('[CsrfValidator]', e);
      throw new Error('CSRF token mismatch');
    }

    if (!sessionData) {
      console.error('Missing session data');
      throw new Error('CSRF token mismatch');
    }

    console.log('[CsrfValidator] tokenFromRequest', tokenFromRequest);

    if (!(tokenFromRequest && csrfCookieStorage.verifyToken(tokenFromRequest, sessionData.session))) {
      throw new Error('[CsrfValidator] CSRF token mismatch');
    }
  }

  private async validateSession(request: Request) {
    const session = await csrfCookieStorage.getSession(request.headers.get('Cookie'));
    console.error('[validateSession] session data b4', { ...session.data, hashedToken: btoa(session.get('hash') || '') });

    let parsedData;

    try {
      parsedData = schema.parse(session.data);
      Object.keys(session.data).forEach(k => session.unset(k));
      Object.entries(parsedData).forEach(([k, v]) => session.set(k, v));
    } catch (e) {
      if (e instanceof ZodError) {
        console.error(e.message, e.errors, e.flatten());
        this.refreshTokenForSession(session);
      } else {
        console.error('[validateSession] Invalid csrf token cookie');
        await csrfCookieStorage.destroySession(session);
        throw new Error('Invalid CSRF token cookie (unexpected error)');
      }
    }

    console.error('[getCsrfTokenSession] session data updated', { ...session.data, hashedToken: btoa(session.get('hash') || '') });

    return session;
  }

  private refreshTokenForSession(session: Session) {
    const token = this.tokenFactory();

    // eslint-disable-next-line no-sync
    const hash = bcrypt.hashSync(token, 10);
    session.set(CSRF_TOKEN_KEY, token);
    session.set(CSRF_HASH_KEY, hash);

    console.log('generated new token', token);
    console.log('generated new hash', hash, btoa(hash));

    return session;
  }

  async refreshCsrfTokenSession(request: Request) {
    const session = await this.validateSession(request);
    console.error('[refreshCsrfTokenSession] session data prev', { ...session.data, hashedToken: btoa(session.get('hash') || '') });
    this.refreshTokenForSession(session);
    console.error('[refreshCsrfTokenSession] session data new', { ...session.data, hashedToken: btoa(session.get('hash') || '') });

    return {
      cookie: await csrfCookieStorage.commitSession(session),
      session: session
    };
  }

  private async getTokenFromRequest(request: Request): Promise<string | undefined> {
    const method = request.method.toLowerCase();

    if (method === 'post') {
      return (await request.formData()).get(CSRF_TOKEN_KEY)?.toString() ?? undefined;
    }

    if (method === 'get') {
      console.warn('Prefer using POST requests for CSRF prevention');
    }

    const url = new URL(request.url);
    return url.searchParams.get(CSRF_TOKEN_KEY) ?? undefined;
  }
}

export const requestValidator = new CsrfValidator();

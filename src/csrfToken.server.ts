import { generateCsrfToken } from 'auth0-remix-server';
import bcrypt from 'bcrypt';
import { ZodError } from 'zod';
import { schema, CSRF_HASH_KEY, CSRF_TOKEN_KEY, getCsrfCookieStorage } from './csrfTokenStorage.server';
import type { Session } from '@remix-run/node';

const store = getCsrfCookieStorage();

export interface CsrfValidatorOpts {
  redirectPath?: string;

  generateToken?(): string;
}

class CsrfValidator {

  private readonly generateToken: () => string;

  constructor(private readonly opts?: CsrfValidatorOpts) {
    this.generateToken = opts?.generateToken || generateCsrfToken;
  }

  async getCsrfTokenSession(request: Request): Promise<{ cookie: string; session: Session; token: string }> {
    const session = await this.validateSession(request);

    return {
      cookie: await store.commitSession(session),
      session: session,
      token: store.getToken(session)
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

    if (!(tokenFromRequest && store.verifyToken(tokenFromRequest, sessionData.session))) {
      throw new Error('[CsrfValidator] CSRF token mismatch');
    }
  }

  private async validateSession(request: Request) {
    const session = await store.getSession(request.headers.get('Cookie'));

    let parsedData;

    try {
      parsedData = schema.parse(session.data);
      Object.keys(session.data).forEach(k => session.unset(k));
      Object.entries(parsedData).forEach(([k, v]) => session.set(k, v));
    } catch (e) {
      if (e instanceof ZodError) {
        this.refreshTokenForSession(session);
      } else {
        console.error('[validateSession] Invalid csrf token cookie');
        await store.destroySession(session);
        throw new Error('Invalid CSRF token cookie (unexpected error)');
      }
    }

    return session;
  }

  private refreshTokenForSession(session: Session) {
    const token = this.generateToken();

    // eslint-disable-next-line no-sync
    const hash = bcrypt.hashSync(token, 10);
    session.set(CSRF_TOKEN_KEY, token);
    session.set(CSRF_HASH_KEY, hash);

    return session;
  }

  async refreshCsrfTokenSession(request: Request) {
    const session = await this.validateSession(request);
    this.refreshTokenForSession(session);
    return {
      cookie: await store.commitSession(session),
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

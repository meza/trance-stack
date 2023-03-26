import { createCookieSessionStorage } from '@remix-run/node';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import type { Session } from '@remix-run/node';

const csrfTokenSession = createCookieSessionStorage({
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

const schema = z.object({
  token: z.string().uuid().optional().default(() => uuidv4())
}).strict();

export const getCsrfTokenSession = async (request: Request): Promise<{ cookie: string; session: Session }> => {
  const session = await csrfTokenSession.getSession(request.headers.get('Cookie'));
  let parsedData;

  try {
    parsedData = schema.parse(session.data);
  } catch (e) {
    await csrfTokenSession.destroySession(session);
    throw new Error('Invalid CSRF token cookie');
  }

  Object.entries(parsedData).forEach(([k, v]) => session.set(k, v));

  return {
    cookie: await csrfTokenSession.commitSession(session),
    session: session
  };
};

export const destroyCsrfTokenSession = async (request: Request): Promise<string> => {
  const session = await csrfTokenSession.getSession(request.headers.get('Cookie'));
  return csrfTokenSession.destroySession(session);
};

export interface CsrfValidatorOpts {
  redirectPath?: string;
}

class CsrfValidator {
  constructor(private readonly opts?: CsrfValidatorOpts) {
  }

  async validate(request: Request): Promise<void> {
    let sessionData, tokenFromRequest;

    try {
      [sessionData, tokenFromRequest] = await Promise.all([
        getCsrfTokenSession(request),
        this.getTokenFromRequest(request)
      ]);
    } catch (e) {
      throw new Error('CSRF token mismatch');
    }

    if (!sessionData) {
      console.error('Missing session data');
      throw new Error('CSRF token mismatch');
    }

    const tokenFromSession = sessionData.session.get('token');

    if (!tokenFromSession || !tokenFromRequest || tokenFromSession !== tokenFromRequest) {
      throw new Error('CSRF token mismatch');
    }
  }

  private async getTokenFromRequest(request: Request) {
    const method = request.method.toLowerCase();

    if (method === 'post') {
      return (await request.formData()).get('csrf-token');
    }

    const url = new URL(request.url);
    return url.searchParams.get('csrf-token');
  }
}

export const requestValidator = new CsrfValidator();

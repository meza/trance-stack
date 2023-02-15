import { describe, it, vi, expect, beforeEach } from 'vitest';
import { createUserSession, getSessionFromRequest, getVisitorId, getVisitorIdFromRequest } from '~/session.server';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';

vi.mock('~/sessionStorage.server');

interface LocalTestContext {
  sessionStorage: ReturnType<typeof getSessionStorage>;
}

describe('The session server', () => {
  beforeEach<LocalTestContext>((context) => {
    vi.resetAllMocks();
    context.sessionStorage = {
      getSession: vi.fn(),
      commitSession: vi.fn(),
      destroySession: vi.fn()
    };
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('random-uuid');
    vi.mocked(getSessionStorage).mockReturnValue(context.sessionStorage);
  });

  describe('When retrieving a visitorID', () => {
    it('creates a new one if there isn\'t an existing one', async () => {
      const session = {
        get: vi.fn(),
        set: vi.fn()
      };

      vi.mocked(session.get).mockReturnValueOnce(null);

      const actual = getVisitorId(session as never as Session);

      expect(actual).toEqual('random-uuid'); // comes from the crypto spy above
      expect(session.set).toHaveBeenCalledWith('visitorId', 'random-uuid');
    });

    it('returns the existing one', async () => {
      const session = {
        get: vi.fn(),
        set: vi.fn()
      };

      vi.mocked(session.get).mockReturnValueOnce('random-uuid3');

      const actual = getVisitorId(session as never as Session);

      expect(actual).toEqual('random-uuid3'); // returns the new one
      expect(session.set).not.toHaveBeenCalled();
    });
  });

  it<LocalTestContext>('returns a session from a request', async ({ sessionStorage }) => {
    const request = {
      headers: {
        get: vi.fn()
      }
    };

    vi.mocked(request.headers.get).mockReturnValue('cookievalue');
    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce('session' as never as Session);

    const actual = await getSessionFromRequest(request as never as Request);

    expect(actual).toEqual('session');
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');

  });

  it<LocalTestContext>('can get a visitorId from a request', async ({ sessionStorage }) => {
    const request = {
      headers: {
        get: vi.fn()
      }
    };

    const session = {
      get: vi.fn(),
      set: vi.fn()
    };

    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce(session as never as Session);
    vi.mocked(session.get).mockReturnValue('random-uuid3');
    const actual = await getVisitorIdFromRequest(request as never as Request);

    expect(actual).toEqual('random-uuid3');
  });

  it<LocalTestContext>('can create a user session', async ({ sessionStorage }) => {
    const request = {
      headers: {
        get: vi.fn()
      }
    };

    const session = {
      get: vi.fn(),
      set: vi.fn()
    };

    vi.mocked(request.headers.get).mockReturnValue('cookievalue');
    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce(session as never as Session);
    vi.mocked(sessionStorage.commitSession).mockResolvedValueOnce('newcookievalue' as never as string);
    vi.mocked(session.get).mockReturnValue(null);

    const actual = await createUserSession(request as never as Request);

    expect(actual).toEqual('newcookievalue');
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');
    expect(sessionStorage.commitSession).toHaveBeenCalledWith(session, {
      maxAge: 2147483647
    });
  });
});

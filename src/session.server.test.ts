import { v4 as uuid } from 'uuid';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';

vi.mock('~/sessionStorage.server');
vi.mock('uuid');
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
    vi.mocked(uuid).mockReturnValue('random-uuid');
    vi.mocked(getSessionStorage).mockReturnValue(context.sessionStorage);
    vi.resetModules();
  });

  describe('When retrieving a visitorID', () => {
    it('creates a new one if there isn\'t an existing one', async () => {
      const session = {
        get: vi.fn(),
        set: vi.fn()
      };

      vi.mocked(session.get).mockReturnValueOnce(null);
      const { getVisitorId } = await import('~/session.server');
      const actual = getVisitorId(session as never as Session, 'example.com');

      expect(actual).toEqual('random-uuid'); // comes from the crypto spy above
      expect(session.set).toHaveBeenCalledWith('visitorId', 'random-uuid');
    });

    it('creates a custom one for localhost', async () => {
      const session = {
        get: vi.fn(),
        set: vi.fn()
      };

      vi.mocked(session.get).mockReturnValueOnce(null);
      const { getVisitorId } = await import('~/session.server');
      const actual = getVisitorId(session as never as Session, 'localhost');

      expect(actual).toEqual('localdev'); // comes from the crypto spy above
      expect(session.set).toHaveBeenCalledWith('visitorId', 'localdev');
    });

    it('returns the existing one from the session', async () => {
      const session = {
        get: vi.fn(),
        set: vi.fn()
      };

      vi.mocked(session.get).mockReturnValueOnce('random-uuid3');
      const { getVisitorId } = await import('~/session.server');
      const actual = getVisitorId(session as never as Session, 'example.com');

      expect(actual).toEqual('random-uuid3'); // returns the new one
      expect(session.set).not.toHaveBeenCalled();
    });

    describe('when calling the function rapidly', () => {
      it('returns the same ID', async () => {
        const session = {
          get: vi.fn(),
          set: vi.fn()
        };

        vi.mocked(session.get).mockReturnValueOnce(null);

        /**
         * Reset the uuid controller to return different values if it is hit more than once
         */
        vi.mocked(uuid).mockReset();
        vi.mocked(uuid).mockReturnValueOnce('random-uuid-1');
        vi.mocked(uuid).mockReturnValueOnce('random-uuid-2');

        const { getVisitorId } = await import('~/session.server');
        const [id1, id2] = [getVisitorId(session as never as Session, 'example.com'), getVisitorId(session as never as Session, 'example.com')];

        expect(id1).toEqual(id2);
      });
    });
  });

  it<LocalTestContext>('returns a session from a request', async ({ sessionStorage }) => {
    const request = {
      hostname: 'example.com',
      headers: {
        get: vi.fn()
      }
    };

    vi.mocked(request.headers.get).mockReturnValue('cookievalue');
    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce('session' as never as Session);
    const { getSessionFromRequest } = await import('~/session.server');
    const actual = await getSessionFromRequest(request as never as Request);

    expect(actual).toEqual('session');
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');

  });

  it<LocalTestContext>('can get a visitorId from a request', async ({ sessionStorage }) => {
    const request = {
      url: 'https://example.com/something',
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

    const { getVisitorIdFromRequest } = await import('~/session.server');
    const actual = await getVisitorIdFromRequest(request as never as Request);

    expect(actual).toEqual('random-uuid3');
  });

  it<LocalTestContext>('can create a user session', async ({ sessionStorage }) => {
    const request = {
      url: 'https://example.com/something',
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

    const { createUserSession } = await import('~/session.server');
    const actual = await createUserSession(request as never as Request);

    expect(actual).toEqual('newcookievalue');
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');
    expect(sessionStorage.commitSession).toHaveBeenCalledWith(session, {
      maxAge: 2147483647
    });
  });

  it<LocalTestContext>('can destroy a session', async ({ sessionStorage }) => {
    const session = {
      get: vi.fn(),
      set: vi.fn()
    };
    const { destroySession } = await import('~/session.server');
    destroySession(session as never as Session);
    expect(sessionStorage.destroySession).toHaveBeenCalledWith(session);
  });
});

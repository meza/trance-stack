import { v4 as uuid } from 'uuid';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitSession, createUserSession, destroySession, getSessionFromRequest, getVisitorId, getVisitorIdFromRequest } from '~/session.server';
import { getSessionStorage } from '~/sessionStorage.server';
import type { Session } from '@remix-run/node';

vi.mock('~/sessionStorage.server');
vi.mock('uuid');

interface LocalTestContext {
  sessionStorage: ReturnType<typeof getSessionStorage>;
  session: Session;
}

describe('The session server', () => {
  beforeEach<LocalTestContext>((context) => {
    vi.resetAllMocks();
    context.sessionStorage = {
      getSession: vi.fn(),
      commitSession: vi.fn(),
      destroySession: vi.fn()
    };
    context.session = {
      get: vi.fn(),
      set: vi.fn()
    } as never;
    vi.mocked(uuid).mockReturnValue('random-uuid');
    vi.mocked(getSessionStorage).mockReturnValue(context.sessionStorage);
  });

  describe('When retrieving a visitorID', () => {
    it<LocalTestContext>('creates a new one if there isn\'t an existing one', async ({ session }) => {
      vi.mocked(session.get).mockReturnValueOnce(null);
      const actual = getVisitorId(session as never as Session, 'example.com');

      expect(actual).toEqual('random-uuid'); // comes from the crypto spy above
      expect(session.set).toHaveBeenCalledWith('visitorId', 'random-uuid');
    });

    it<LocalTestContext>('creates a custom one for localhost', async ({ session }) => {
      vi.mocked(session.get).mockReturnValueOnce(null);
      const actual = getVisitorId(session as never as Session, 'localhost');

      expect(actual).toEqual('localdev'); // comes from the crypto spy above
      expect(session.set).toHaveBeenCalledWith('visitorId', 'localdev');
    });

    it<LocalTestContext>('returns the existing one from the session', async ({ session }) => {

      vi.mocked(session.get).mockReturnValueOnce('random-uuid3');
      const actual = getVisitorId(session as never as Session, 'example.com');

      expect(actual).toEqual('random-uuid3'); // returns the new one
      expect(session.set).not.toHaveBeenCalled();
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
    const actual = await getSessionFromRequest(request as never as Request);

    expect(actual).toEqual('session');
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');

  });

  it<LocalTestContext>('can get a visitorId from a request', async ({ sessionStorage, session }) => {
    const request = {
      url: 'https://example.com/something',
      headers: {
        get: vi.fn()
      }
    };

    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce(session as never as Session);
    vi.mocked(session.get).mockReturnValue('random-uuid3');

    const actual = await getVisitorIdFromRequest(request as never as Request);

    expect(actual).toEqual('random-uuid3');
  });

  it<LocalTestContext>('can create a user session', async ({ sessionStorage, session }) => {
    const request = {
      url: 'https://example.com/something',
      headers: {
        get: vi.fn()
      }
    };

    vi.mocked(request.headers.get).mockReturnValue('cookievalue');
    vi.mocked(sessionStorage.getSession).mockResolvedValueOnce(session as never as Session);
    vi.mocked(sessionStorage.commitSession).mockResolvedValueOnce('newcookievalue' as never as string);
    vi.mocked(session.get).mockReturnValue(null);

    const actual = await createUserSession(request as never as Request);

    expect(actual).toEqual({
      cookie: 'newcookievalue',
      visitorId: 'random-uuid',
      session: session
    });
    expect(request.headers.get).toHaveBeenCalledWith('Cookie');
    expect(sessionStorage.getSession).toHaveBeenCalledWith('cookievalue');
    expect(sessionStorage.commitSession).toHaveBeenCalledWith(session);
  });

  it<LocalTestContext>('can destroy a session', async ({ sessionStorage, session }) => {
    destroySession(session as never as Session);
    expect(sessionStorage.destroySession).toHaveBeenCalledWith(session);
  });

  it<LocalTestContext>('can commit a session', async ({ sessionStorage, session }) => {
    vi.mocked(sessionStorage.commitSession).mockResolvedValueOnce('newcookievalue');
    const actual = await commitSession(session as never as Session);
    expect(sessionStorage.commitSession).toHaveBeenCalledWith(session);
    expect(actual).toEqual('newcookievalue');
  });
});

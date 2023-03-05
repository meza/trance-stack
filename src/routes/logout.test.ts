import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticator } from '~/auth.server';
import { action, loader } from '~/routes/logout';
import { destroySession, getSessionFromRequest } from '~/session.server';

vi.mock('~/session.server');
vi.mock('~/auth.server', () => {
  return {
    authenticator: {
      logout: vi.fn()
    }
  };
});

describe('The Logout route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authenticator.logout).mockResolvedValue({} as never);
  });

  it('should expose the same function for the loader and action', () => {
    expect(loader).toBe(action);
  });

  it('should call the logout function and destroy the sessoion', async () => {
    vi.stubEnv('APP_DOMAIN', 'https://example2.com');
    vi.mocked(getSessionFromRequest).mockResolvedValue('session' as never);
    vi.mocked(destroySession).mockResolvedValue('destroyed-session' as never);
    const request = new Request('https://example.com/logout');

    await action({
      request: request
    } as never);

    expect(authenticator.logout).toHaveBeenCalled();
    expect(getSessionFromRequest).toHaveBeenCalledWith(request);
    expect(destroySession).toHaveBeenCalledWith('session');

    const logoutParams = vi.mocked(authenticator.logout).mock.calls[0];
    expect(logoutParams[0]).toEqual('https://example2.com');
    expect(logoutParams[1]).toMatchInlineSnapshot(`
      {
        "Set-Cookie": "destroyed-session",
      }
    `);

  });
});

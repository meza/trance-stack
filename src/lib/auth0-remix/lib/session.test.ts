import { createSession } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCredentials, saveUserToSession } from '~/lib/auth0-remix/lib/session';
import type { SessionStore, UserCredentials } from '~/lib/auth0-remix/Auth0RemixTypes';

describe('The session helper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('when saving the user to a session', () => {
    it('should return the credentials from the session cookie', async () => {
      const request = new Request('https://example.com', {
        headers: {
          'Cookie': 'session-cookie'
        }
      });
      const userCredentials: UserCredentials = {} as never;
      const sessionStore: SessionStore = {
        store: {
          getSession: vi.fn(),
          commitSession: vi.fn()
        } as never,
        key: 'session-key'
      };
      const session = createSession();
      const sessionSpy = vi.spyOn(session, 'set');
      vi.mocked(sessionStore.store.getSession).mockResolvedValue(session);
      vi.mocked(sessionStore.store.commitSession).mockResolvedValue('session-cookie-setcookie-string');

      const actual = await saveUserToSession(request, userCredentials, sessionStore);
      expect(actual).toMatchInlineSnapshot(`
      {
        "Set-Cookie": "session-cookie-setcookie-string",
      }
    `);

      expect(sessionStore.store.getSession).toHaveBeenCalledWith('session-cookie');
      expect(sessionSpy).toHaveBeenCalledWith('session-key', userCredentials);
      expect(sessionStore.store.commitSession).toHaveBeenCalledWith(session);
    });

    it('should return empty headers if there is no session management', async () => {
      const request = new Request('https://example.com', {
        headers: {
          'Cookie': 'session-cookie'
        }
      });
      const userCredentials: UserCredentials = {} as never;
      const sessionStore = undefined;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const actual = await saveUserToSession(request, userCredentials, sessionStore);
      expect(actual).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith('No session storage configured. User credentials will not be persisted.');
    });
  });

  describe('when getting the user credentials from a session', () => {
    it('should return the credentials from the session cookie', async () => {
      const request = new Request('https://example.com', {
        headers: {
          'Cookie': 'session-cookie'
        }
      });
      const sessionStore: SessionStore = {
        store: {
          getSession: vi.fn()
        } as never,
        key: 'session-key'
      };
      const session = createSession();
      const credentialResult:UserCredentials = {
        accessToken: 'access-token',
        expiresAt: 1000,
        expiresIn: 100,
        lastRefreshed: 345
      };
      const sessionSpy = vi.spyOn(session, 'get').mockReturnValue(credentialResult);
      vi.mocked(sessionStore.store.getSession).mockResolvedValue(session);

      const actual = await getCredentials(request, sessionStore);
      expect(actual).toBe(credentialResult);

      expect(sessionStore.store.getSession).toHaveBeenCalledWith('session-cookie');
      expect(sessionSpy).toHaveBeenCalledWith('session-key');
    });
  });
});

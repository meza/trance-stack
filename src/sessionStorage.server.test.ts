import { createCookieSessionStorage } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@remix-run/node');

describe('The session storage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  it('returns the configured one', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    delete process.env.SESSION_SECRET;
    vi.mocked(createCookieSessionStorage).mockReturnValue('mocked cookie' as never);
    const { getSessionStorage } = await import ('~/sessionStorage.server');
    const actual = getSessionStorage();
    expect(actual).toEqual('mocked cookie');

    const cookieSettings = vi.mocked(createCookieSessionStorage).mock.calls[0][0];

    expect(cookieSettings).toMatchInlineSnapshot(`
      {
        "cookie": {
          "httpOnly": true,
          "maxAge": 31536000,
          "name": "__session",
          "path": "/",
          "sameSite": "lax",
          "secrets": [
            "secret",
          ],
          "secure": true,
        },
      }
    `);

    getSessionStorage(); //it only calls the mocked function once
    expect(createCookieSessionStorage).toHaveBeenCalledTimes(1);
  });

  it('configures the cookie correctly', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SESSION_SECRET', 'also-a-secret');
    vi.mocked(createCookieSessionStorage).mockReturnValue('mocked cookie' as never);
    const { getSessionStorage } = await import ('~/sessionStorage.server');

    getSessionStorage();

    const cookieSettings = vi.mocked(createCookieSessionStorage).mock.calls[0][0];

    expect(cookieSettings).toMatchInlineSnapshot(`
      {
        "cookie": {
          "httpOnly": true,
          "maxAge": 31536000,
          "name": "__session",
          "path": "/",
          "sameSite": "lax",
          "secrets": [
            "also-a-secret",
          ],
          "secure": true,
        },
      }
    `);

  });
});

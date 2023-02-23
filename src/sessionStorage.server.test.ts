import { createCookieSessionStorage } from '@remix-run/node';
import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@remix-run/node');

describe('The session storage', () => {
  const originalEnv = structuredClone(process.env);
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  afterEach(() => {
    process.env.SESSION_SECRET = originalEnv.SESSION_SECRET;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  });

  it('returns the configured one', async () => {
    process.env.NODE_ENV = 'development';
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
          "sameSite": "strict",
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
    process.env.SESSION_SECRET = 'also-a-secret';
    process.env.NODE_ENV = 'production';
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
          "sameSite": "strict",
          "secrets": [
            "also-a-secret",
          ],
          "secure": true,
        },
      }
    `);

  });
});

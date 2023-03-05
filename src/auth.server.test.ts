import { Auth0RemixServer } from 'auth0-remix-server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSessionStorage } from '~/sessionStorage.server';

vi.mock('auth0-remix-server');
vi.mock('~/sessionStorage.server', () => {
  return { getSessionStorage: vi.fn() };
});

describe('The auth server', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    vi.mocked(getSessionStorage).mockReturnValue('mocked session storage' as never);
  });

  it('initializes the auth server correctly', async () => {
    vi.stubEnv('APP_DOMAIN', 'https://example.com');
    vi.stubEnv('AUTH0_DOMAIN', 'https://auth0.for.example.com');
    vi.stubEnv('AUTH0_CLIENT_ID', '3242567gfderg');
    vi.stubEnv('AUTH0_CLIENT_SECRET', '9087tuygkhijoo');

    const { authenticator } = await import ('~/auth.server');

    const authServerCall = vi.mocked(Auth0RemixServer).mock.calls[0][0];
    expect(authServerCall).toMatchInlineSnapshot(`
      {
        "callbackURL": "https://example.com/auth/callback",
        "clientDetails": {
          "clientID": "3242567gfderg",
          "clientSecret": "9087tuygkhijoo",
          "domain": "https://auth0.for.example.com",
        },
        "failedLoginRedirect": "/",
        "refreshTokenRotationEnabled": true,
        "session": {
          "store": "mocked session storage",
        },
      }
    `);

    expect(authenticator).toEqual(vi.mocked(Auth0RemixServer).mock.instances[0]);
  });
});

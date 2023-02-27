import { redirect } from '@remix-run/node';
import * as jose from 'jose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth0RemixServer } from '~/lib/auth0-remix/Auth0Remix.server';
import { getCredentials, saveUserToSession } from '~/lib/auth0-remix/lib/session';
import type { AppLoadContext } from '@remix-run/node';
import type { Auth0RemixOptions } from '~/lib/auth0-remix/Auth0RemixTypes';

vi.mock('@remix-run/node');
vi.mock('./lib/session');
vi.mock('jose');

interface LocalTestContext {
  authOptions: Auth0RemixOptions;
  appLoadContext: AppLoadContext;
}
const redirectError = 'redirect was called';

class JWTExpired extends Error {
  name = 'JWTExpired';
  code = 'ERR_JWT_EXPIRED';
}

describe('Auth0Remix.server', () => {
  /* eslint-disable camelcase */
  beforeEach<LocalTestContext>((context) => {
    vi.resetAllMocks();
    vi.setSystemTime(0);
    vi.stubGlobal('fetch', vi.fn());
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error(redirectError as never);
    });
    vi.mocked(jose.createRemoteJWKSet).mockReturnValue('jwkSet' as never);
    context.appLoadContext = {};
    context.authOptions = {
      clientDetails: {
        clientID: 'clientId',
        domain: 'test.domain.com',
        clientSecret: 'clientSecret'
      },
      refreshTokenRotationEnabled: false,
      session: {
        store: {} as never
      },
      callbackURL: 'http://localhost:3000/auth0/callback',
      failedLoginRedirect: '/logout'
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('the authorization process', () => {
    it<LocalTestContext>('redirects to the authorization endpoint', ({ authOptions }) => {
      const authorizer = new Auth0RemixServer(authOptions);

      expect(() => authorizer.authorize()).toThrowError(redirectError); // a redirect happened

      const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
      expect(redirectUrl).toMatchSnapshot();
    });

    it<LocalTestContext>('forces the login if asked', ({ authOptions }) => {
      const authorizer = new Auth0RemixServer(authOptions);

      expect(() => authorizer.authorize(true)).toThrowError(redirectError); // a redirect happened

      const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
      expect(redirectUrl).toMatchSnapshot();
    });

    it<LocalTestContext>('adds the organisation if needed', ({ authOptions }) => {
      authOptions.clientDetails.organization = 'test-org';
      const authorizer = new Auth0RemixServer(authOptions);

      expect(() => authorizer.authorize()).toThrowError(redirectError); // a redirect happened

      const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
      expect(redirectUrl).toMatchSnapshot();
    });
  });

  describe('handling the callback token exchange', () => {
    describe('when there is no code in the exchange', () => {
      it<LocalTestContext>('redirects to the failed login url', async ({ authOptions }) => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const authorizer = new Auth0RemixServer(authOptions);
        const request = new Request('https://it-doesnt-matter.com', {
          method: 'POST',
          body: new FormData()
        });

        await expect(authorizer.handleCallback(request, {})).rejects.toThrowError(redirectError); // a redirect happened

        const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
        expect(redirectUrl).toEqual(authOptions.failedLoginRedirect);

        expect(consoleSpy).toHaveBeenCalledWith('No code found in callback');
      });
    });

    describe('when there is a code in the exchange', () => {
      it<LocalTestContext>('redirects to the failed login url if the token exchange fails', async ({ authOptions }) => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(fetch).mockResolvedValue({
          ok: false // return a non-ok response
        } as never);

        const authorizer = new Auth0RemixServer(authOptions);
        const formData = new FormData();
        formData.append('code', 'test-code');

        const request = new Request('https://it-doesnt-matter.com', {
          method: 'POST',
          body: formData
        });

        await expect(authorizer.handleCallback(request, {})).rejects.toThrowError(redirectError); // a redirect happened

        const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
        expect(redirectUrl).toEqual(authOptions.failedLoginRedirect);

        const fetchArgs = vi.mocked(fetch).mock.calls[0];
        expect(fetchArgs[0]).toMatchInlineSnapshot('"https://test.domain.com/oauth/token"');
        expect(fetchArgs[1]).toMatchSnapshot();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to get token from Auth0');
      });

      describe('and there is no success url', () => {
        it<LocalTestContext>('returns the user profile', async ({ authOptions }) => {
          const auth0Response = {
            access_token: 'test-access-token',
            id_token: 'test-id-token',
            expires_in: 30,
            refresh_token: 'test-refresh-token'
          };
          vi.mocked(fetch).mockResolvedValue({
            ok: true, // return a non-ok response
            json: () => Promise.resolve(auth0Response)
          } as never);

          const formData = new FormData();
          formData.append('code', 'test-code');
          const request = new Request('https://it-doesnt-matter.com', {
            method: 'POST',
            body: formData
          });

          const authorizer = new Auth0RemixServer(authOptions);
          const actual = await authorizer.handleCallback(request, {});

          expect(actual).toMatchInlineSnapshot(`
            {
              "accessToken": "test-access-token",
              "expiresAt": 30000,
              "expiresIn": 30,
              "lastRefreshed": 0,
            }
          `);
        });

        it<LocalTestContext>('includes the refresh token if the rotation is set', async ({ authOptions }) => {
          authOptions.refreshTokenRotationEnabled = true;
          const auth0Response = {
            access_token: 'test-access-token2',
            id_token: 'test-id-token2',
            expires_in: 600,
            refresh_token: 'test-refresh-token2'
          };

          vi.mocked(fetch).mockResolvedValue({
            ok: true, // return a non-ok response
            json: () => Promise.resolve(auth0Response)
          } as never);

          const formData = new FormData();
          formData.append('code', 'test-code');
          const request = new Request('https://it-doesnt-matter.com', {
            method: 'POST',
            body: formData
          });

          const authorizer = new Auth0RemixServer(authOptions);
          const actual = await authorizer.handleCallback(request, {});

          expect(actual).toMatchInlineSnapshot(`
            {
              "accessToken": "test-access-token2",
              "expiresAt": 600000,
              "expiresIn": 600,
              "lastRefreshed": 0,
              "refreshToken": "test-refresh-token2",
            }
          `);
        });
      });

      describe('and there is a success url', () => {
        it<LocalTestContext>('redirects to the success url', async ({ authOptions }) => {
          authOptions.session = {
            store: 'sessionStore',
            key: 'sessionKey'
          } as never;
          const auth0Response = {
            access_token: 'test-access-token3',
            id_token: 'test-id-token3',
            expires_in: 300,
            refresh_token: 'test-refresh-token3'
          };
          vi.mocked(fetch).mockResolvedValue({
            ok: true, // return a non-ok response
            json: () => Promise.resolve(auth0Response)
          } as never);

          const formData = new FormData();
          formData.append('code', 'test-code');
          const request = new Request('https://it-doesnt-matter.com', {
            method: 'POST',
            body: formData
          });

          vi.mocked(saveUserToSession).mockResolvedValue({
            'some-cookie': 'data'
          });

          const authorizer = new Auth0RemixServer(authOptions);
          await expect(authorizer.handleCallback(request, {
            onSuccessRedirect: 'https://success-login-redirect.com'
          })).rejects.toThrowError(redirectError); // a redirect happened

          const saveUserToSessionArgs = vi.mocked(saveUserToSession).mock.calls[0];
          expect(saveUserToSessionArgs[0]).toBe(request);
          expect(saveUserToSessionArgs[2]).toEqual(authOptions.session);
          expect(saveUserToSessionArgs[1]).toMatchInlineSnapshot(`
            {
              "accessToken": "test-access-token3",
              "expiresAt": 300000,
              "expiresIn": 300,
              "lastRefreshed": 0,
            }
          `);

          const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
          expect(redirectUrl).toEqual('https://success-login-redirect.com');

          const redirectInit = vi.mocked(redirect).mock.calls[0][1];
          expect(redirectInit).toMatchInlineSnapshot(`
            {
              "headers": {
                "some-cookie": "data",
              },
            }
          `);

        });
      });
    });
  });

  describe('logging out', () => {
    it<LocalTestContext>('calls the correct url', ({ authOptions }) => {
      const authorizer = new Auth0RemixServer(authOptions);
      const redirectTo = 'http://localhost:3000/logout';

      expect(() => authorizer.logout(redirectTo)).toThrowError(redirectError); // a redirect happened

      const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
      const requestInit = vi.mocked(redirect).mock.calls[0][1];
      expect(redirectUrl).toMatchSnapshot();
      expect(requestInit).toEqual({});
    });

    it<LocalTestContext>('includes the headers supplied', ({ authOptions }) => {
      const authorizer = new Auth0RemixServer(authOptions);
      const redirectTo = 'http://localhost:3000/logout-with-headers';
      const headers = {
        'X-Test-Header': 'test',
        'X-Test-Header-2': 'test2'
      };

      expect(() => authorizer.logout(redirectTo, headers)).toThrowError(redirectError); // a redirect happened

      const redirectUrl = vi.mocked(redirect).mock.calls[0][0];
      const requestInit = vi.mocked(redirect).mock.calls[0][1];
      expect(redirectUrl).toMatchSnapshot();
      expect(requestInit).toEqual({ headers: headers });
    });
  });

  describe('getting the user', () => {
    describe('when there are no credentials returned', () => {
      it<LocalTestContext>('redirects to the failed login url', async ({ authOptions }) => {
        vi.mocked(getCredentials).mockResolvedValueOnce(undefined as never);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const request = new Request('https://it-doesnt-matter.com');
        const context: AppLoadContext = {};

        const authorizer = new Auth0RemixServer(authOptions);
        await expect(authorizer.getUser(request, context)).rejects.toThrowError(redirectError); // a redirect happened
        expect(consoleSpy).toHaveBeenCalledWith('No credentials found');
      });
    });
    describe('when the access token is valid', () => {
      beforeEach(() => {
        vi.mocked(getCredentials).mockResolvedValueOnce({
          accessToken: 'test-access-token'
        } as never);
        vi.mocked(jose.jwtVerify).mockResolvedValue({} as never);
      });

      describe('and the user profile fetch succeeds', () => {
        it<LocalTestContext>('returns the user', async ({ authOptions }) => {
          authOptions.session = {
            store: 'sessionStore',
            key: 'sessionKey'
          } as never;

          const user = {
            name: 'test-user',
            first_name: 'test-first-name'
          };

          vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(user)
          } as never);

          const request = new Request('https://it-doesnt-matter.com');

          const authorizer = new Auth0RemixServer(authOptions);
          const actual = await authorizer.getUser(request, {});

          expect(actual).toMatchInlineSnapshot(`
            {
              "firstName": "test-first-name",
              "name": "test-user",
            }
          `);

          const jwtVerifyParams = vi.mocked(jose.jwtVerify).mock.calls[0];
          expect(jwtVerifyParams[0]).toEqual('test-access-token');
          expect(jwtVerifyParams[1]).toEqual('jwkSet');
          expect(jwtVerifyParams[2]).toMatchInlineSnapshot(`
            {
              "audience": "https://test.domain.com/api/v2/",
              "issuer": "https://test.domain.com/",
            }
          `);

          const fetchParams = vi.mocked(fetch).mock.calls[0];
          expect(fetchParams[0]).toEqual('https://test.domain.com/userinfo');
          expect(fetchParams[1]).toMatchInlineSnapshot(`
            {
              "headers": {
                "Authorization": "Bearer test-access-token",
              },
            }
          `);

          expect(getCredentials).toHaveBeenCalledWith(request, authOptions.session);
        });
      });

      describe('and the user profile fetch fails', () => {
        it<LocalTestContext>('redirects to the failed url', async ({ authOptions }) => {
          authOptions.session = {
            store: 'sessionStore',
            key: 'sessionKey'
          } as never;

          vi.mocked(fetch).mockResolvedValue({
            ok: false
          } as never);

          const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

          const request = new Request('https://it-doesnt-matter.com');

          const authorizer = new Auth0RemixServer(authOptions);
          await expect(authorizer.getUser(request, {})).rejects.toThrowError(redirectError); // a redirect happened
          expect(consoleSpy).toHaveBeenCalledWith('Failed to get user profile from Auth0');
        });
      });
    });

    describe('when the token validation fails', () => {
      it<LocalTestContext>('redirects to the failed login url', async ({ authOptions }) => {
        vi.mocked(getCredentials).mockResolvedValueOnce({} as never);
        vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('test-error'));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const request = new Request('https://it-doesnt-matter.com');
        const context: AppLoadContext = {};

        const authorizer = new Auth0RemixServer(authOptions);
        await expect(authorizer.getUser(request, context)).rejects.toThrowError(redirectError); // a redirect happened
        expect(consoleSpy).toHaveBeenCalledWith('Failed to verify JWT', new Error('test-error'));
      });
    });

    describe('when the token is expired', () => {
      beforeEach(() => {
        vi.mocked(jose.jwtVerify).mockRejectedValueOnce(new JWTExpired('test-error'));
      });

      describe('and there is no other loader refreshing the token', () => {
        beforeEach<LocalTestContext>((context) => {
          delete context.appLoadContext.refresh;
        });
        describe('and there is no refresh token', () => {
          beforeEach(() => {
            vi.mocked(getCredentials).mockResolvedValue({} as never);
          });

          it<LocalTestContext>('redirects to the failed login url', async ({ authOptions, appLoadContext }) => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const request = new Request('https://it-doesnt-matter.com');

            const authorizer = new Auth0RemixServer(authOptions);
            await expect(authorizer.getUser(request, appLoadContext)).rejects.toThrowError(redirectError); // a redirect happened
            expect(consoleSpy).toHaveBeenCalledWith('No refresh token found within the credentials.');
          });
        });

        describe('and there is a refresh token', () => {
          beforeEach(() => {
            vi.mocked(getCredentials).mockResolvedValue({
              refreshToken: 'test-refresh-token'
            } as never);
          });

          it<LocalTestContext>('redirects to the failed login url when the refresh fails', async ({ authOptions, appLoadContext }) => {
            vi.mocked(fetch).mockResolvedValue({
              ok: false
            } as never);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const request = new Request('https://it-doesnt-matter.com');

            const authorizer = new Auth0RemixServer(authOptions);
            await expect(authorizer.getUser(request, appLoadContext)).rejects.toThrowError(redirectError); // a redirect happened
            expect(consoleSpy).toHaveBeenCalledWith('Failed to refresh token from Auth0');
          });

          it<LocalTestContext>('returns the correct credentials with the rotation off', async ({ authOptions, appLoadContext }) => {
            vi.mocked(fetch).mockResolvedValue({
              ok: true,
              json: () => Promise.resolve({
                access_token: 'new-access-token',
                refresh_token: 'new-refresh-token',
                expires_in: 1000
              })
            } as never);

            vi.mocked(saveUserToSession).mockResolvedValueOnce({
              'a-header': 'a-value'
            } as never);

            const request = new Request('https://it-doesnt-matter.com');
            authOptions.refreshTokenRotationEnabled = false;
            authOptions.session = {
              store: 'sessionStore',
              key: 'sessionKey'
            } as never;
            const authorizer = new Auth0RemixServer(authOptions);

            /** Execute the test */
            await expect(authorizer.getUser(request, appLoadContext)).rejects.toThrowError(redirectError); // a redirect happened

            expect(appLoadContext.refresh).toBeDefined(); // it sets the context properly

            /**
             * It calls the refresh endpoint with the correct parameters
             */
            const fetchCall = vi.mocked(fetch).mock.calls[0];
            expect(fetchCall[0]).toEqual('https://test.domain.com/oauth/token');
            expect(fetchCall[1]).toMatchInlineSnapshot(`
              {
                "body": "grant_type=refresh_token&client_id=clientId&client_secret=clientSecret&refresh_token=test-refresh-token",
                "headers": {
                  "content-type": "application/x-www-form-urlencoded",
                },
                "method": "POST",
              }
            `);

            /**
             * It updates the session correctly
             * And does not contain the refresh token
             */
            const saveUserToSessionCall = vi.mocked(saveUserToSession).mock.calls[0];
            expect(saveUserToSessionCall[0]).toEqual(request);
            expect(saveUserToSessionCall[1]).toMatchInlineSnapshot(`
              {
                "accessToken": "new-access-token",
                "expiresAt": 1000000,
                "expiresIn": 1000,
                "lastRefreshed": 0,
              }
            `);
            expect(Object.keys(saveUserToSessionCall[1])).not.toContain('refreshToken');
            expect(saveUserToSessionCall[2]).toEqual(authOptions.session);

            /**
             * It redirects to the correct url with values from the sessionSave
             */
            expect(redirect).toHaveBeenCalledWith('https://it-doesnt-matter.com/', {
              headers: {
                'a-header': 'a-value'
              }
            });

          });

          it<LocalTestContext>('returns the correct credentials with the rotation on', async ({ authOptions, appLoadContext }) => {
            vi.mocked(fetch).mockResolvedValue({
              ok: true,
              json: () => Promise.resolve({
                access_token: 'new-access-token2',
                refresh_token: 'new-refresh-token2',
                expires_in: 3000
              })
            } as never);

            vi.mocked(saveUserToSession).mockResolvedValueOnce({
              'a-header2': 'a-value2'
            } as never);

            const request = new Request('https://it-doesnt-matter.com');
            authOptions.refreshTokenRotationEnabled = true;
            const authorizer = new Auth0RemixServer(authOptions);

            /** Execute the test */
            await expect(authorizer.getUser(request, appLoadContext)).rejects.toThrowError(redirectError); // a redirect happened

            expect(appLoadContext.refresh).toBeDefined(); // it sets the context properly

            /**
             * It updates the session correctly
             * And it contains the refresh token
             */
            const saveUserToSessionCall = vi.mocked(saveUserToSession).mock.calls[0];
            expect(saveUserToSessionCall[1]).toMatchInlineSnapshot(`
              {
                "accessToken": "new-access-token2",
                "expiresAt": 3000000,
                "expiresIn": 3000,
                "lastRefreshed": 0,
                "refreshToken": "new-refresh-token2",
              }
            `);
            expect(Object.keys(saveUserToSessionCall[1])).toContain('refreshToken');

          });

          it<LocalTestContext>('returns the user when there is an ongoing refresh', async ({ authOptions }) => {

            vi.mocked(jose.jwtVerify).mockResolvedValueOnce({} as never); // this will be the second call after the one in the beforeEach

            vi.mocked(fetch).mockResolvedValue({
              ok: true,
              json: () => Promise.resolve({
                name: 'test-user'
              })
            } as never);

            const request = new Request('https://it-doesnt-matter.com');

            const authorizer = new Auth0RemixServer(authOptions);
            const actual = await authorizer.getUser(request, {
              refresh: Promise.resolve()
            });

            expect(actual).toEqual({
              name: 'test-user'
            });
          });
        });
      });
    });
  });
});

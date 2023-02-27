import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticator } from '~/auth.server';
import { action } from '~/routes/auth/callback';

vi.mock('~/auth.server', () => {
  return {
    authenticator: {
      handleCallback: vi.fn()
    }
  };
});

describe('The Auth0 callback route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should pass the request on to the authenticator handler', async () => {
    const request = new Request('https://example.com/auth/callback');

    await action({
      request: request
    } as never);

    const callbackParams = vi.mocked(authenticator.handleCallback).mock.calls[0];
    expect(callbackParams[0]).toBe(request);
    expect(callbackParams[1]).toMatchInlineSnapshot(`
      {
        "onSuccessRedirect": "/dashboard",
      }
    `);

  });
});

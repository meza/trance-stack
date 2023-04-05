import { beforeEach, describe, it, vi } from 'vitest';
import { commitSession, getSessionFromRequest } from '~/session.server';
import { action } from './settings.cookie-consent';
import type { Session } from '@remix-run/node';
import type { TestContext } from 'vitest';

vi.mock('~/session.server');

interface LocalTestContext extends TestContext {
  session: Session;
  request: Request;
}

describe('The cookie consent settings', () => {
  beforeEach<LocalTestContext>((context) => {
    context.session = {
      get: vi.fn(),
      set: vi.fn()
    } as never;

    vi.mocked(getSessionFromRequest).mockResolvedValue(context.session);
  });

  describe('when there is no form in the body', () => {
    beforeEach<LocalTestContext>((context) => {
      context.request = new Request('https://example.com', {
        method: 'POST'
      });
    });

    it<LocalTestContext>('sets all the settings to false', async ({ expect, session, request }) => {
      await action({ request: request } as never);
      expect(session.set).toHaveBeenCalledWith('consentData', {
        analytics: false,
        marketing: false
      });
    });
  });

  describe.each([
    [['analytics', 'marketing'], ['true', 'true']],
    [['analytics', 'marketing'], ['true', 'false']],
    [['analytics', 'marketing'], ['false', 'true']],
    [['analytics', 'marketing'], ['false', 'false']]
  ])('when there are settings coming %s %s', (keys, values) => {
    beforeEach<LocalTestContext>((context) => {
      const data = new FormData();
      keys.forEach((key, index) => data.append(key, values[index]));
      context.request = new Request('https://example.com', {
        method: 'POST',
        body: data
      });
    });

    it<LocalTestContext>(`sets all the settings to ${keys}:${values}`, async ({ expect, session, request }) => {
      await action({ request: request } as never);
      const mappedData = keys.reduce((acc, key, index) => {
        acc[key] = values[index] === 'true';
        return acc;
      }, {} as Record<string, boolean>);
      expect(session.set).toHaveBeenCalledWith('consentData', mappedData);
    });
  });

  it<LocalTestContext>('returns the redirect with the correct cookies', async ({ expect, session }) => {
    const request = new Request('https://example.com', {
      method: 'POST'
    });

    vi.mocked(commitSession).mockResolvedValue('mock-cookie');

    const response = await action({ request: request } as never);

    expect(Object.fromEntries(response.headers.entries())).toMatchInlineSnapshot(`
      {
        "cache-control": "no-cache",
        "location": "/",
        "set-cookie": "mock-cookie",
      }
    `);

  });
});

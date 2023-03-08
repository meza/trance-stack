import crypto from 'node:crypto';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initServerI18n } from '~/i18n';
import { addSecurityHeaders, sanitizeHeaders } from '~/utils/securityHeaders';
import entry from './entry.server';

vi.mock('~/i18n');
vi.mock('~/session.server');
vi.mock('~/utils/securityHeaders');
vi.mock('@remix-run/react');
vi.mock('react-dom/server');
vi.mock('node:crypto');

describe('entry.server', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(initServerI18n).mockResolvedValue('mocked initServerI18n' as never);
    vi.mocked(renderToString).mockReturnValue('mocked renderToString markup');
    vi.mocked(crypto.randomBytes).mockReturnValue('mocked nonce' as never);
  });

  it('should return the markup', async () => {
    const request = new Request('https://example.com');
    const responseCode = 201;
    const responseHeaders = new Headers();
    const context = {
      staticHandlerContext: {
        loaderData: {
          root: {
            locale: 'en'
          }
        }
      }
    } as never;

    const actualResponse = await entry(request, responseCode, responseHeaders, context);

    expect(await actualResponse.text()).toMatchInlineSnapshot('"<!DOCTYPE html>mocked renderToString markup"');
    expect(actualResponse.status).toBe(201);
  });

  it('should initialise things correctly', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const request = new Request('https://example.com');
    const responseCode = 200;
    const responseHeaders = new Headers();
    const context = {
      staticHandlerContext: {
        loaderData: {
          root: {
            locale: 'en'
          }
        }
      }
    } as never;

    await entry(request, responseCode, responseHeaders, context);

    expect(initServerI18n).toHaveBeenCalledWith('en', context);
    expect(addSecurityHeaders).toHaveBeenCalledWith(responseHeaders, 'mocked nonce');
    expect(sanitizeHeaders).toHaveBeenCalledWith(responseHeaders);

  });

  it('should return the correct headers', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new Request('https://example.com');
    const responseCode = 200;
    const responseHeaders = new Headers();
    const context = {
      staticHandlerContext: {
        loaderData: {
          root: {
            locale: 'en'
          }
        }
      }
    } as never;

    const actualResponse = await entry(request, responseCode, responseHeaders, context);
    expect(addSecurityHeaders).toHaveBeenCalledWith(responseHeaders, 'mocked nonce');
    expect(actualResponse.status).toBe(200);
    expect(await actualResponse.headers).toMatchInlineSnapshot(`
      Headers {
        Symbol(query): [
          "cache-control",
          "no-cache, max-age=0, s-maxage=0",
          "content-type",
          "text/html",
        ],
        Symbol(context): null,
      }
    `);

  });
});

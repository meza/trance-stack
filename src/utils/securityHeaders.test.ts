import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addSecurityHeaders, sanitizeHeaders, securityHeaders } from '~/utils/securityHeaders';


describe('securityHeaders', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sets the correct security headers for dev', () => {
    const isDev = true;
    const existingHeaders = new Headers();
    const headers = securityHeaders(isDev);
    const modifiedHeaders = addSecurityHeaders(existingHeaders, isDev);

    expect(headers).toStrictEqual(modifiedHeaders);
    expect(headers).toStrictEqual(existingHeaders);

    expect(headers).toMatchInlineSnapshot(`
      Headers {
        Symbol(query): [
          "content-security-policy",
          "default-src 'self'; worker-src blob:; script-src 'self' 'unsafe-inline' https://api-eu.mixpanel.com https://api.mixpanel.com https://*.hotjar.com https://*.hotjar.io; connect-src 'self' 'unsafe-inline' https://api-eu.mixpanel.com https://api.mixpanel.com wss://*.hotjar.com https://*.hotjar.com https://*.hotjar.io ws://localhost:2222 ws://localhost:8002; img-src https: data: http:; frame-ancestors 'none'; frame-src https://api-eu.mixpanel.com https://api.mixpanel.com https://*.hotjar.com https://*.hotjar.io; style-src 'self' 'unsafe-inline';",
          "cross-origin-embedder-policy",
          "require-corp",
          "cross-origin-opener-policy",
          "same-origin",
          "cross-origin-resource-policy",
          "same-origin",
          "origin-agent-cluster",
          "?1",
          "permissions-policy",
          "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          "referrer-policy",
          "origin-when-cross-origin",
          "strict-transport-security",
          "max-age=15552000; includeSubDomains",
          "x-content-type-options",
          "nosniff",
          "x-dns-prefetch-control",
          "off",
          "x-download-options",
          "noopen",
          "x-frame-options",
          "SAMEORIGIN",
          "x-permitted-cross-domain-policies",
          "none",
          "x-xss-protection",
          "0",
        ],
        Symbol(context): null,
      }
    `);
  });

  it('sets the correct security headers for prod', () => {
    const isDev = false;
    const existingHeaders = new Headers();
    const headers = securityHeaders(isDev);
    const modifiedHeaders = addSecurityHeaders(existingHeaders, isDev);

    expect(headers).toStrictEqual(modifiedHeaders);
    expect(headers).toStrictEqual(existingHeaders);

    expect(headers).toMatchInlineSnapshot(`
      Headers {
        Symbol(query): [
          "content-security-policy",
          "default-src 'self'; worker-src blob:; script-src 'self' 'unsafe-inline' https://api-eu.mixpanel.com https://api.mixpanel.com https://*.hotjar.com https://*.hotjar.io; connect-src 'self' 'unsafe-inline' https://api-eu.mixpanel.com https://api.mixpanel.com wss://*.hotjar.com https://*.hotjar.com https://*.hotjar.io  ; img-src https: data: http:; frame-ancestors 'none'; frame-src https://api-eu.mixpanel.com https://api.mixpanel.com https://*.hotjar.com https://*.hotjar.io; style-src 'self' 'unsafe-inline';",
          "cross-origin-embedder-policy",
          "require-corp",
          "cross-origin-opener-policy",
          "same-origin",
          "cross-origin-resource-policy",
          "same-origin",
          "origin-agent-cluster",
          "?1",
          "permissions-policy",
          "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          "referrer-policy",
          "origin-when-cross-origin",
          "strict-transport-security",
          "max-age=15552000; includeSubDomains",
          "x-content-type-options",
          "nosniff",
          "x-dns-prefetch-control",
          "off",
          "x-download-options",
          "noopen",
          "x-frame-options",
          "SAMEORIGIN",
          "x-permitted-cross-domain-policies",
          "none",
          "x-xss-protection",
          "0",
        ],
        Symbol(context): null,
      }
    `);
  });

  it('removes unwanted headers', () => {
    const existingHeaders = new Headers();
    existingHeaders.set('x-powered-by', 'Vite');
    existingHeaders.set('x-vite', 'true');

    const sanitized = sanitizeHeaders(existingHeaders);

    expect(sanitized).toBe(existingHeaders);
    expect(existingHeaders.has('x-powered-by')).toBeFalsy();
    expect(existingHeaders.has('x-vite')).toBeTruthy();
  });
});

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

    expect(headers).toMatchSnapshot();
  });

  it('sets the correct security headers for prod', () => {
    const isDev = false;
    const existingHeaders = new Headers();
    const headers = securityHeaders(isDev);
    const modifiedHeaders = addSecurityHeaders(existingHeaders, isDev);

    expect(headers).toStrictEqual(modifiedHeaders);
    expect(headers).toStrictEqual(existingHeaders);

    expect(headers).toMatchSnapshot();
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

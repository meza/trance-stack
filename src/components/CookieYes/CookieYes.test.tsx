import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieYes } from '~/components/CookieYes/CookieYes';

describe('CookieYes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Renders with the correct values', () => {
    // eslint-disable-next-line new-cap
    expect(CookieYes({ isProduction: true, token: '123' })).toMatchInlineSnapshot(`
      <script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/123/script.js"
        suppressHydrationWarning={true}
        type="text/javascript"
      />
    `);
    // eslint-disable-next-line new-cap
    expect(CookieYes({ isProduction: true, token: 'abc', nonce: 'a-nonce' })).toMatchInlineSnapshot(`
      <script
        id="cookieyes"
        nonce="a-nonce"
        src="https://cdn-cookieyes.com/client_data/abc/script.js"
        suppressHydrationWarning={true}
        type="text/javascript"
      />
    `);
  });

  it('Renders null when not in production', () => {
    // eslint-disable-next-line new-cap
    expect(CookieYes({ isProduction: false, token: 'anything' })).toBeNull();
  });
});

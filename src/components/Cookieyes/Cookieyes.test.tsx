import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cookieyes } from '~/components/Cookieyes/Cookieyes';

describe('Cookieyes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Renders with the correct values', () => {
    // eslint-disable-next-line new-cap
    expect(Cookieyes({ isProduction: true, token: '123' })).toMatchInlineSnapshot(`
      <script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/123/script.js"
        type="text/javascript"
      />
    `);
    // eslint-disable-next-line new-cap
    expect(Cookieyes({ isProduction: true, token: 'abc' })).toMatchInlineSnapshot(`
      <script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/abc/script.js"
        type="text/javascript"
      />
    `);
  });

  it('Renders null when not in production', () => {
    // eslint-disable-next-line new-cap
    expect(Cookieyes({ isProduction: false, token: 'anything' })).toBeNull();
  });
});

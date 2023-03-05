import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./CookieYes', () => ({
  CookieYes: () => 'CookieYes'
}));

describe('The CookieYes Index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('links the CookieYes component', async () => {
    const { CookieYes } = await import('./index');

    // eslint-disable-next-line new-cap
    expect(CookieYes({} as never)).toBe('CookieYes');
  });
});

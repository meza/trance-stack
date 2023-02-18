import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./Cookieyes', () => ({
  Cookieyes: () => 'Cookieyes'
}));

describe('The Cookieyes Index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('links the Cookieyes component', async () => {
    const { Cookieyes } = await import('./index');

    // eslint-disable-next-line new-cap
    expect(Cookieyes({} as never)).toBe('Cookieyes');
  });
});

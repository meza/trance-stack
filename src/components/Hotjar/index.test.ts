import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./Hotjar', () => ({
  Hotjar: () => 'Hotjar'
}));

describe('The Hotjar Index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('links the Hotjar component', async () => {
    const { Hotjar } = await import('./index');

    // eslint-disable-next-line new-cap
    expect(Hotjar({} as never)).toBe('Hotjar');
  });
});

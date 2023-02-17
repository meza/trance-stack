import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./Mixpanel', () => ({
  Mixpanel: () => 'Mixpanel'
}));

describe('The Mixpanel Index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('links the Mixpanel component', async () => {
    const { Mixpanel } = await import('./index');

    // eslint-disable-next-line new-cap
    expect(Mixpanel()).toBe('Mixpanel');
  });
});

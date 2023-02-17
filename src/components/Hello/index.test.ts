import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./Hello', () => ({
  Hello: () => 'Hello'
}));

describe('The Hello Index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('links the Hello component', async () => {
    const { Hello } = await import('./index');

    // eslint-disable-next-line new-cap
    expect(Hello()).toBe('Hello');
  });
});

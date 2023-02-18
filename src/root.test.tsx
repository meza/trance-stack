import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('root', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});

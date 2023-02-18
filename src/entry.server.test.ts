import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('entry.server', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});

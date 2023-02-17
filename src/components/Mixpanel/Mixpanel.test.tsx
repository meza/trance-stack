import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react');

describe('The Mixpanel integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useEffect).mockReturnValue();
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});

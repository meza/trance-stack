import { cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('entry.client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});

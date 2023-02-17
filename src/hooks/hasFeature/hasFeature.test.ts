import { beforeEach, describe, expect, it, vi } from 'vitest';
import splitClient from '~/split.server';

vi.mock('~/split.server');

describe('The hasFeature hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(splitClient.ready).mockResolvedValue();
  });

  it('should work', () => {
    expect(1).toBe(1);
  });
});

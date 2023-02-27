import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticator } from '~/auth.server';
import { action } from '~/routes/auth/auth0';

vi.mock('~/auth.server', () => {
  return {
    authenticator: {
      authorize: vi.fn()
    }
  };
});

describe('auth0', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call the authorize function', () => {
    vi.mocked(authenticator.authorize).mockResolvedValue({} as never);
    action({} as never);
    expect(vi.mocked(authenticator.authorize)).toHaveBeenCalled();
  });
});

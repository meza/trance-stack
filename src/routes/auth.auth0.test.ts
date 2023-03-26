import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticator } from '~/auth.server';
import { getCsrfToken } from '~/csrf-cookie.server';
import { action } from '~/routes/auth.auth0';

vi.mock('~/auth.server', () => ({
  authenticator: {
    authorize: vi.fn()
  }
}));
vi.mock('~/csrf-cookie.server');

describe('auth0', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call the authorize function', async () => {
    vi.mocked(getCsrfToken).mockResolvedValue('abc');
    vi.mocked(authenticator.authorize).mockResolvedValue({} as never);
    await action({} as never);
    expect(vi.mocked(authenticator.authorize)).toHaveBeenCalled();
  });

  it('should throw 400 response for missing CSRF token', async () => {
    vi.mocked(getCsrfToken).mockResolvedValue(undefined);
    vi.mocked(authenticator.authorize).mockResolvedValue({} as never);
    expect(action({} as never)).rejects.toMatchObject({
      status: 400
    });
    expect(vi.mocked(authenticator.authorize)).not.toHaveBeenCalled();
  });
});

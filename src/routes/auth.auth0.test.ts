import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticator } from '~/auth.server';
import { requestValidator } from '~/csrfToken.server';
import { action } from '~/routes/auth.auth0';

vi.mock('~/auth.server', () => ({
  authenticator: {
    authorize: vi.fn()
  }
}));
vi.mock('~/csrfToken.server');

describe('auth0', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call the authorize function', async () => {
    vi.mocked(requestValidator.validate).mockResolvedValue(undefined);
    vi.mocked(authenticator.authorize).mockResolvedValue({} as never);
    await action({ request: new Request('https://somewhere.com/logout', { method: 'post' }) } as never);
    expect(vi.mocked(authenticator.authorize)).toHaveBeenCalled();
  });

  it('should throw 400 response for invalid CSRF token', async () => {
    vi.unmock('~/csrfToken.server');
    expect(action({ request: new Request('https://somewhere.com/logout', { method: 'post' }) } as never)).rejects.toMatchObject({
      status: 400
    });
    expect(vi.mocked(authenticator.authorize)).not.toHaveBeenCalled();
  });
});

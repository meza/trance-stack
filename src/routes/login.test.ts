import { redirect } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';
import login, { loader } from './login';

vi.mock('~/components/Login');
vi.mock('~/hooks/hasFeature');
vi.mock('@remix-run/node');

const redirectError = 'redirect was called';
describe('The Login Route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error(redirectError as never);
    });
  });

  describe('when the auth feature is not turned on', () => {
    it('should redirect to the home page', async () => {
      vi.mocked(hasFeature).mockResolvedValue(false);
      const request = new Request('https://example.com/login');
      await expect(loader({ request: request } as never)).rejects.toThrow(redirectError);

      expect(hasFeature).toHaveBeenCalledWith(request, Features.AUTH);
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('when the auth feature is on', () => {
    it('should not redirect at all', async () => {
      vi.mocked(hasFeature).mockResolvedValue(true);
      const request = new Request('https://example.com/login');
      await loader({ request: request } as never);

      expect(hasFeature).toHaveBeenCalledWith(request, Features.AUTH);
      expect(redirect).not.toHaveBeenCalledWith();
    });
  });

  it('renders the logout component', () => {
    expect(login()).toMatchInlineSnapshot('<Login />');
  });
});

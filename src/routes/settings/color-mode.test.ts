import { redirect } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitSession, getSessionFromRequest } from '~/session.server';
import { action, loader } from './color-mode';
import type { Session } from '@remix-run/node';

vi.mock('@remix-run/node');
vi.mock('~/session.server');

const redirectError = 'redirect was called';
describe('The color mode switch route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error(redirectError as never);
    });
  });

  it('should redirect any get requests', async () => {
    const request = new Request('https://example.com/settings/color-mode');
    await expect(loader({ request: request } as never)).rejects.toThrow(redirectError);
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it.each(['dark', 'light'])('should set the %s color mode cookie', async (mode) => {
    const mockSession = {
      set: vi.fn(),
      get: vi.fn()
    } as never as Session;

    vi.mocked(getSessionFromRequest).mockResolvedValue(mockSession);
    vi.mocked(commitSession).mockResolvedValue('mocked-cookie-value');

    const request = new Request('https://example.com/settings/color-mode', {
      method: 'POST',
      body: new URLSearchParams({ colorMode: mode })
    });
    await expect(action({ request: request } as never)).rejects.toThrow(redirectError);

    expect(mockSession.set).toHaveBeenCalledWith('colorMode', mode);

    expect(redirect).toHaveBeenCalledWith('/', {
      headers: {
        'Set-Cookie': 'mocked-cookie-value',
        'Cache-Control': 'no-cache'
      }
    });
  });
});

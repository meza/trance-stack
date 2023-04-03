import { PostHog } from 'posthog-node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('posthog-node', () => ({
  PostHog: vi.fn()
}));

describe('The PostHog Server', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should initialise the posthog server', async () => {
    vi.stubEnv('POSTHOG_TOKEN', 'test-token');
    vi.stubEnv('POSTHOG_API', 'test-api');
    const processSpy = vi.spyOn(process, 'on');
    const shutdownStub = vi.fn();
    const expected = {
      shutdownAsync: shutdownStub
    } as never;

    vi.mocked(PostHog).mockImplementation(() => expected);

    const { posthog } = await import('~/posthog.server');
    expect(PostHog).toHaveBeenCalledWith('test-token', { host: 'test-api' });

    const exitCallback = processSpy.mock.calls[0][1];
    await exitCallback();

    expect(shutdownStub).toHaveBeenCalled();

    expect(posthog).toEqual(expected);
  });
});

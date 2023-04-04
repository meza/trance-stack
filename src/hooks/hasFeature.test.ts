import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hasFeature } from '~/hooks/hasFeature';
import { posthog } from '~/posthog.server';
import { getVisitorIdFromRequest } from '~/session.server';

vi.mock('~/posthog.server', () => ({
  posthog: {
    isFeatureEnabled: vi.fn()
  }
}));

vi.mock('~/session.server');
describe('The hasFeature hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return true for an on flag', async () => {
    const request = new Request('https://example.com');
    const feature = 'a-feature';

    vi.mocked(getVisitorIdFromRequest).mockResolvedValueOnce('visitorId');
    vi.mocked(posthog.isFeatureEnabled).mockResolvedValueOnce(true);
    const result = await hasFeature(request, feature as never);

    expect(result).toBeTruthy();

    expect(getVisitorIdFromRequest).toBeCalledTimes(1);
    expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);

  });

  it('should return false for an off flag', async () => {
    const request = new Request('https://example.com');
    const feature = 'another-feature';

    vi.mocked(posthog.isFeatureEnabled).mockResolvedValueOnce(false);
    vi.mocked(getVisitorIdFromRequest).mockResolvedValueOnce('visitorId2');
    const result = await hasFeature(request, feature as never);

    expect(result).toBeFalsy();

    expect(getVisitorIdFromRequest).toBeCalledTimes(1);
    expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);

  });

  it('should return false for an undefined flag', async () => {
    const request = new Request('https://example.com');
    const feature = 'another-feature';

    vi.mocked(posthog.isFeatureEnabled).mockResolvedValueOnce(undefined);
    vi.mocked(getVisitorIdFromRequest).mockResolvedValueOnce('visitorId3');
    const result = await hasFeature(request, feature as never);

    expect(result).toBeFalsy();

    expect(getVisitorIdFromRequest).toBeCalledTimes(1);
    expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);

  });
});

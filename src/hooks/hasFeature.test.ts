import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hasFeature } from '~/hooks/hasFeature';
import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';

vi.mock('~/split.server');
vi.mock('~/session.server');
describe('The hasFeature hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(splitClient.ready).mockResolvedValue();
  });

  it('should return true for an on flag', async () => {
    const request = new Request('https://example.com');
    const feature = 'a-feature';

    vi.mocked(getVisitorIdFromRequest).mockResolvedValueOnce('visitorId');
    vi.mocked(splitClient.getTreatment).mockReturnValue('on');
    const result = await hasFeature(request, feature as never);

    expect(result).toBeTruthy();

    expect(splitClient.ready).toBeCalledTimes(1);
    expect(getVisitorIdFromRequest).toBeCalledTimes(1);
    expect(splitClient.getTreatment).toBeCalledTimes(1);
    expect(splitClient.getTreatment).toHaveBeenCalledWith('visitorId', feature);
    expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);

  });

  it('should return false for an off flag', async () => {
    const request = new Request('https://example.com');
    const feature = 'another-feature';

    vi.mocked(getVisitorIdFromRequest).mockResolvedValueOnce('visitorId2');
    vi.mocked(splitClient.getTreatment).mockReturnValue('off');
    const result = await hasFeature(request, feature as never);

    expect(result).toBeFalsy();

    expect(splitClient.ready).toBeCalledTimes(1);
    expect(getVisitorIdFromRequest).toBeCalledTimes(1);
    expect(splitClient.getTreatment).toBeCalledTimes(1);
    expect(splitClient.getTreatment).toHaveBeenCalledWith('visitorId2', feature);
    expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);

  });
});

import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Mixpanel, { Mixpanel as exportedMixpanel } from '~/components/Mixpanel/index';

vi.mock('react');
vi.mock('mixpanel-browser');

describe('The Mixpanel integration', () => {
  beforeEach(() => {
    vi.mocked(useEffect).mockReturnValue();
  });

  it('Should initialise mixpanel correctly', () => {
    vi.stubGlobal('appConfig', {
      mixpanelToken: '123',
      isProduction: true,
      mixpanelApi: 'https://api.mixpanel.com',
      visitorId: '123'
    });

    expect(Mixpanel).toBe(exportedMixpanel);

    // eslint-disable-next-line new-cap
    const mp = Mixpanel();
    expect(mp).toBe(null);
    expect(vi.mocked(useEffect)).toHaveBeenCalled();

    const useEffectHandler = vi.mocked(useEffect).mock.calls[0][0];
    useEffectHandler();

    expect(mixpanel.init).toHaveBeenCalledWith('123', {
      test: false,
      debug: false,
      // eslint-disable-next-line camelcase
      api_host: 'https://api.mixpanel.com'
    });
    expect(mixpanel.identify).toHaveBeenCalledWith('123');
    expect(mixpanel.track).toHaveBeenCalledWith('Page View');

    const useEffectDeps = vi.mocked(useEffect).mock.calls[0][1];
    expect(useEffectDeps).toMatchInlineSnapshot(`
      [
        "123",
        true,
        "https://api.mixpanel.com",
        "123",
      ]
    `);
  });
});

import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

export const Mixpanel = () => {
  const { mixpanelToken, isProduction, mixpanelApi, visitorId } = window.appConfig;

  useEffect(() => {
    mixpanel.init(mixpanelToken, {
      test: !isProduction,
      debug: !isProduction,
      // eslint-disable-next-line camelcase
      api_host: mixpanelApi
    });
    mixpanel.identify(visitorId);
    mixpanel.track('Page View');
  }, [mixpanelToken, isProduction, mixpanelApi, visitorId]);

  return null;
};

export default Mixpanel;

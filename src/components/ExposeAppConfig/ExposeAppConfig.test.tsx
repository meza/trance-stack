import { expect, it } from 'vitest';
import { ExposeAppConfig } from './ExposeAppConfig';

describe('ExposeAppConfig', () => {
  const appConfig: AppConfig = {
    hotjarId: 'a-hotjar-id',
    googleAnalyticsId: 'ga-id',
    mixpanelToken: 'a-mixpanel-token',
    visitorId: 'a-visitor-id',
    isProduction: true,
    mixpanelApi: 'a-mixpanel-api',
    splitToken: 'a-split-token',
    cookieYesToken: 'a-cookieyes-token',
    version: '0.0.0-dev',
    sentryDsn: 'a-sentry-dsn'
  };

  it('can expose the app config correctly', () => {
    // eslint-disable-next-line new-cap
    const markup = ExposeAppConfig({ appConfig: appConfig });
    expect(markup).toMatchSnapshot();
  });
});


import { expect, it } from 'vitest';
import { ExposeAppConfig } from './ExposeAppConfig';

describe('ExposeAppConfig', () => {
  const appConfig: AppConfig = {
    hotjarId: 'a-hotjar-id',
    googleAnalyticsId: 'ga-id',
    visitorId: 'a-visitor-id',
    isProduction: true,
    cookieYesToken: 'a-cookieyes-token',
    version: '0.0.0-dev',
    sentryDsn: 'a-sentry-dsn',
    posthogApi: 'a-posthog-api',
    posthogToken: 'a-posthog-token'
  };

  it('can expose the app config correctly', () => {
    // eslint-disable-next-line new-cap
    const markup = ExposeAppConfig({ appConfig: appConfig });
    expect(markup).toMatchSnapshot();
  });
});


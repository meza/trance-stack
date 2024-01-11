import React, { useContext } from 'react';
import { useLoaderData } from '@remix-run/react';
import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App, { handle, links, loader, meta } from './root';
import { useChangeLanguage } from '~/hooks/useChangeLanguage';
import { remixI18next } from '~/i18n';
import { createUserSession } from '~/session.server';

vi.mock('~/session.server');
vi.mock('~/i18n');
vi.mock('./styles/app.css', () => ({ default: 'app.css' }));
vi.mock('./styles/dark.css', () => ({ default: 'dark.css' }));
vi.mock('./styles/light.css', () => ({ default: 'light.css' }));
vi.mock('@remix-run/react');
vi.mock('react-i18next');
vi.mock('~/hooks/useChangeLanguage');
vi.mock('~/components/Posthog', () => ({
  Posthog: () => <div id={'mock-posthog'}/>
}));
vi.mock('~/components/CookieConsent', async () => {
  const actual = await vi.importActual('~/components/CookieConsent') as object;
  return {
    ...actual,
    CookieConsentBanner: () => <div id={'mock-cookie-consent-banner'}/>
  };
});
vi.mock('react', async () => ({
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ...await vi.importActual<typeof import('react')>('react'),
  useContext: vi.fn()
}));

vi.mock('@sentry/remix', () => ({
  withSentry: (Component: React.FC) => {
    return () => {
      return (
        <>
          {'mock sentry wrapper'}
          <Component/>
        </>
      );
    };
  }
}));

describe('The root module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should have a consistent meta function', () => {
    expect(meta({} as never)).toMatchInlineSnapshot(`
      {
        "charset": "utf-8",
        "title": "REPL_APP_NAME",
        "viewport": "width=device-width,initial-scale=1",
      }
    `);
  });

  it('should have a consistent links function', () => {
    expect(links()).toMatchInlineSnapshot(`
      [
        {
          "href": "app.css",
          "rel": "stylesheet",
        },
        {
          "href": "/_static/favicon.ico",
          "rel": "icon",
          "type": "image/x-icon",
        },
      ]
    `);
  });

  it('should expose a consistent handle', () => {
    expect(handle).toMatchInlineSnapshot(`
      {
        "i18n": [
          "translation",
        ],
      }
    `);
  });

  describe('when calling the loader', () => {
    beforeEach(() => {
      vi.mocked(createUserSession).mockResolvedValue({
        visitorId: 'a-visitorId',
        cookie: 'a-cookie',
        session: {
          get: vi.fn(),
          set: vi.fn()
        } as never
      });
      vi.mocked(remixI18next.getLocale).mockResolvedValue('en');

      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('GOOGLE_ANALYTICS_ID', 'ga-id');
      vi.stubEnv('HOTJAR_ID', 'a-hotjar-id');
      vi.stubEnv('MIXPANEL_TOKEN', 'a-mixpanel-token');
      vi.stubEnv('MIXPANEL_API', 'a-mixpanel-api');
      vi.stubEnv('COOKIEYES_TOKEN', 'a-cookieyes-token');

    });

    it('should return the app config for dev', async () => {
      const request = new Request('https://example.com');
      const response = await loader({ request: request } as never);
      const data = await response.json();
      expect(data).toMatchInlineSnapshot(`
        {
          "appConfig": {
            "cookieYesToken": "a-cookieyes-token",
            "googleAnalyticsId": "ga-id",
            "hotjarId": "a-hotjar-id",
            "isProduction": false,
            "version": "0.0.0-dev",
            "visitorId": "a-visitorId",
          },
          "locale": "en",
        }
      `);
    });

    it('should set the cookie header', async () => {
      const request = new Request('https://example.com');
      const response = await loader({ request: request } as never);
      expect(response.headers.get('Set-Cookie')).toMatchInlineSnapshot('"a-cookie"');
    });

    it('should return the app config for prod', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const request = new Request('https://example.com');
      const response = await loader({ request: request } as never);
      const data = await response.json();
      expect(data).toMatchInlineSnapshot(`
        {
          "appConfig": {
            "cookieYesToken": "a-cookieyes-token",
            "googleAnalyticsId": "ga-id",
            "hotjarId": "a-hotjar-id",
            "isProduction": true,
            "version": "0.0.0-dev",
            "visitorId": "a-visitorId",
          },
          "locale": "en",
        }
      `);
    });

    it('should prepare the environment', async () => {
      const request = new Request('https://example.com');
      await loader({ request: request } as never);

      expect(createUserSession).toHaveBeenCalledWith(request);
      expect(remixI18next.getLocale).toHaveBeenCalledWith(request);

    });
  });

  describe('when rendering the app', () => {
    const appConfig: AppConfig = {
      hotjarId: 'a-hotjar-id',
      googleAnalyticsId: 'ga-id',
      visitorId: 'a-visitor-id',
      isProduction: true,
      cookieYesToken: 'a-cookieyes-token',
      version: '0.0.0-dev',
      sentryDsn: 'a-sentry-dsn',
      posthogToken: 'a-posthog-token',
      posthogApi: 'a-posthog-api'
    };

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - weird stuff happening with the useTranslataion mocks
      vi.mocked(useTranslation).mockReturnValue({
        i18n: {
          language: 'en',
          dir: () => 'ltr'
        }
      } as never);
      vi.mocked(useChangeLanguage).mockReturnValue();
    });

    describe('when there is no consent for cookies', () => {
      beforeEach(() => {
        vi.mocked(useLoaderData).mockReturnValue({ appConfig: appConfig, locale: 'en' } as never);
      });
      it('renders the app', () => {
        vi.mocked(useContext).mockReturnValue('mocked-nonce');
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
          // There is a DOM Nesting Validation error because we're rendering
          // the entire html in a test environment. We don't care about that error
        });
        const markup = render(<App/>);
        errorSpy.mockReset();
        expect(markup.asFragment()).toMatchSnapshot();
        expect(markup.getByText('mock sentry wrapper')).toBeInTheDocument();
      });
    });

    describe('when there is consent for cookies', () => {
      beforeEach(() => {
        vi.mocked(useLoaderData).mockReturnValue({
          appConfig: appConfig,
          locale: 'en',
          colorMode: 'dark',
          consentData: {
            analytics: true
          }
        } as never);
      });
      it('renders the app with analytics scripts', () => {
        vi.mocked(useContext).mockReturnValue('mocked-nonce');
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
          // There is a DOM Nesting Validation error because we're rendering
          // the entire html in a test environment. We don't care about that error
        });
        const markup = render(<App/>);
        errorSpy.mockReset();
        expect(markup.asFragment()).toMatchSnapshot();
      });
    });
  });
});

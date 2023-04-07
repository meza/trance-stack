import React, { useContext, useState } from 'react';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { useTranslation } from 'react-i18next';
import { ColorModeContext, ColorModeSensor } from '~/components/ColorModeSwitcher';
import { CookieConsentBanner, CookieConsentProvider } from '~/components/CookieConsent';
import { ExposeAppConfig } from '~/components/ExposeAppConfig';
import { GoogleAnalytics } from '~/components/GoogleAnalytics';
import { Hotjar } from '~/components/Hotjar';
import { NonceContext } from '~/components/NonceContext';
import { Posthog } from '~/components/Posthog';
import { requestValidator } from '~/csrfToken.server';
import { CSRF_TOKEN_KEY } from '~/csrfTokenStorage.server';
import { useChangeLanguage } from '~/hooks/useChangeLanguage';
import { remixI18next } from '~/i18n';
import { defaultNS } from '~/i18n/i18n.config';
import { createUserSession } from '~/session.server';
import styles from './styles/app.css';
import type { LinksFunction, MetaFunction, LoaderArgs } from '@remix-run/node';
import type { ColorMode } from '~/components/ColorModeSwitcher';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'REPL_APP_NAME',
  viewport: 'width=device-width,initial-scale=1'
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'icon', href: '/_static/favicon.ico', type: 'image/x-icon' }
  ];
};

export const handle = {
  i18n: defaultNS
};

export const loader = async ({ request }: LoaderArgs) => {
  const [locale, packageJson, sessionCookieData, csrfTokenSessionData] = await Promise.all([
    remixI18next.getLocale(request),
    import('../package.json'),
    createUserSession(request),
    requestValidator.getCsrfTokenSession(request)
  ]);
  return json({
    appConfig: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      hotjarId: process.env.HOTJAR_ID,
      cookieYesToken: process.env.COOKIEYES_TOKEN,
      isProduction: process.env.NODE_ENV === 'production',
      visitorId: sessionCookieData.visitorId,
      version: packageJson.default.version,
      sentryDsn: process.env.SENTRY_DSN,
      posthogToken: process.env.POSTHOG_TOKEN,
      posthogApi: process.env.POSTHOG_API,
      csrfToken: csrfTokenSessionData.token,
      csrfTokenKey: CSRF_TOKEN_KEY // the `name` of the hidden input used in forms to send the CSRF token, naming is hard
    },
    locale: locale,
    colorMode: sessionCookieData.session.get('colorMode'),
    consentData: sessionCookieData.session.get('consentData')
  }, {
    headers: [
      ['set-cookie', sessionCookieData.cookie],
      ['set-cookie', csrfTokenSessionData.cookie]
    ]
  });
};

const App = () => {
  const nonce = useContext(NonceContext);
  const { appConfig, locale, colorMode: colorModeFromSession, consentData } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);
  const [colorMode, setColorMode] = useState<ColorMode>(colorModeFromSession);

  return (
    <html lang={i18n.language} dir={i18n.dir()} data-version={appConfig.version} className={colorMode}>
      <CookieConsentProvider consentData={consentData}>
        <Posthog apiKey={appConfig.posthogToken} apiUrl={appConfig.posthogApi} visitorId={appConfig.visitorId}>
          <head>
            <Meta />
            <Links />
            <ExposeAppConfig appConfig={appConfig} nonce={nonce} />
            <ColorModeSensor nonce={nonce} />
            <GoogleAnalytics googleAnalyticsId={appConfig.googleAnalyticsId} visitorId={appConfig.visitorId} nonce={nonce} />
            <Hotjar hotjarId={appConfig.hotjarId} visitorId={appConfig.visitorId} nonce={nonce} />
          </head>
          <body>
            <ColorModeContext.Provider
              value={{
                colorMode: colorMode,
                setColorMode: setColorMode
              }}>
              <Outlet
                context={{
                  appConfig: appConfig,
                  locale: locale
                }} />
              {consentData ? null : <CookieConsentBanner />}
            </ColorModeContext.Provider>
            <ScrollRestoration nonce={nonce} />
            <Scripts nonce={nonce} />
            <LiveReload nonce={nonce} />
          </body>
        </Posthog>
      </CookieConsentProvider>
    </html>
  );
};

export default withSentry(App);

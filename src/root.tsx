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
import { useChangeLanguage } from '~/hooks/useChangeLanguage';
import { remixI18next } from '~/i18n';
import { defaultNS } from '~/i18n/i18n.config';
import { createUserSession } from '~/session.server';
import splitClient from '~/split.server';
import styles from './styles/app.css';
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
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

export const loader: LoaderFunction = async ({ request }) => {
  const [locale, packageJson, cookieData] = await Promise.all([
    remixI18next.getLocale(request),
    import('../package.json'),
    createUserSession(request),
    splitClient.ready()
  ]);
  splitClient.track(cookieData.visitorId, 'anonymous', 'page_view');
  return json({
    appConfig: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      hotjarId: process.env.HOTJAR_ID,
      mixpanelToken: process.env.MIXPANEL_TOKEN,
      mixpanelApi: process.env.MIXPANEL_API,
      splitToken: process.env.SPLIT_CLIENT_TOKEN,
      cookieYesToken: process.env.COOKIEYES_TOKEN,
      isProduction: process.env.NODE_ENV === 'production',
      visitorId: cookieData.visitorId,
      version: packageJson.default.version,
      sentryDsn: process.env.SENTRY_DSN
    },
    locale: locale,
    colorMode: cookieData.session.get('colorMode'),
    consentData: cookieData.session.get('consentData')
  }, {
    headers: {
      'Set-Cookie': cookieData.cookie
    }
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
        <head>
          <Meta/>
          <Links/>
          <ExposeAppConfig appConfig={appConfig} nonce={nonce}/>
          <ColorModeSensor nonce={nonce}/>
          <GoogleAnalytics googleAnalyticsId={appConfig.googleAnalyticsId} visitorId={appConfig.visitorId} nonce={nonce}/>
          <Hotjar hotjarId={appConfig.hotjarId} visitorId={appConfig.visitorId} nonce={nonce}/>

        </head>
        <body className={colorMode}>
          <ColorModeContext.Provider
            value={{
              colorMode: colorMode,
              setColorMode: setColorMode
            }}>
            <Outlet
              context={{
                appConfig: appConfig,
                locale: locale
              }}/>
            <CookieConsentBanner />
          </ColorModeContext.Provider>
          <ScrollRestoration nonce={nonce}/>
          <Scripts nonce={nonce}/>
          <LiveReload nonce={nonce}/>
        </body>
      </CookieConsentProvider>
    </html>
  );
};

export default withSentry(App);

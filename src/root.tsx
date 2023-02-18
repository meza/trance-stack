import React, { useEffect } from 'react';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Cookieyes } from '~/components/Cookieyes';
import { Hotjar } from '~/components/Hotjar';
import { remixI18next } from '~/i18n';
import { defaultNS } from '~/i18n/i18n.config';
import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';
import styles from './styles/app.css';
import darkStyles from './styles/dark.css';
import lightStyles from './styles/light.css';
import type { AppConfig } from '@remix-run/dev';
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

export const useChangeLanguage = (locale: string) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'REPL_APP_NAME',
  viewport: 'width=device-width,initial-scale=1'
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: lightStyles },
    { rel: 'stylesheet', href: darkStyles, media: '(prefers-color-scheme: dark)' },
    { rel: 'stylesheet', href: styles },
    { rel: 'icon', href: '/_static/favicon.ico', type: 'image/x-icon' }
  ];
};

export const handle = {
  i18n: defaultNS
};

export const loader: LoaderFunction = async ({ request }) => {
  const [visitorId, locale] = await Promise.all([
    getVisitorIdFromRequest(request),
    remixI18next.getLocale(request),
    splitClient.ready()
  ]);

  splitClient.track(visitorId, 'anonymous', 'page_view');

  return json({
    appConfig: {
      hotjarId: process.env.HOTJAR_ID,
      mixpanelToken: process.env.MIXPANEL_TOKEN,
      mixpanelApi: process.env.MIXPANEL_API,
      splitToken: process.env.SPLIT_CLIENT_TOKEN,
      cookieYesToken: process.env.COOKIEYES_TOKEN,
      isProduction: process.env.NODE_ENV === 'production',
      visitorId: visitorId
    },
    locale: locale
  });
};

const ExposeAppConfig = (props: {appConfig: AppConfig}) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.appConfig = ${JSON.stringify(props.appConfig)}`
      }}
    />
  );
};

const App = () => {
  const { appConfig, locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <Meta/>
        <Links/>
        <ExposeAppConfig appConfig={appConfig}/>
        <Cookieyes isProduction={appConfig.isProduction} token={appConfig.cookieYesToken}/>
        <Hotjar hotjarId={appConfig.hotjarId} visitorId={appConfig.visitorId}/>
      </head>
      <body>
        <Outlet context={{ appConfig: appConfig, locale: locale }}/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
};

export default App;

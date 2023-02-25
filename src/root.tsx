import React from 'react';
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
import { useChangeLanguage } from '~/hooks/useChangeLanguage';
import { remixI18next } from '~/i18n';
import { defaultNS } from '~/i18n/i18n.config';
import { createUserSession } from '~/session.server';
import splitClient from '~/split.server';
import styles from './styles/app.css';
import darkStyles from './styles/dark.css';
import lightStyles from './styles/light.css';
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

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

export const loader: LoaderFunction = async ({ request, context }) => {
  const [locale, packageJson, cookieData] = await Promise.all([
    remixI18next.getLocale(request),
    import('../package.json'),
    createUserSession(request),
    splitClient.ready()
  ]);
  splitClient.track(cookieData.visitorId, 'anonymous', 'page_view');

  return json({
    appConfig: {
      hotjarId: process.env.HOTJAR_ID,
      mixpanelToken: process.env.MIXPANEL_TOKEN,
      mixpanelApi: process.env.MIXPANEL_API,
      splitToken: process.env.SPLIT_CLIENT_TOKEN,
      cookieYesToken: process.env.COOKIEYES_TOKEN,
      isProduction: process.env.NODE_ENV === 'production',
      visitorId: cookieData.visitorId,
      version: packageJson.default.version
    },
    locale: locale
  }, {
    headers: {
      'Set-Cookie': cookieData.cookie
    }
  });
};

export const ExposeAppConfig = (props: {appConfig: AppConfig}) => {
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
    <html lang={i18n.language} dir={i18n.dir()} data-version={appConfig.version}>
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

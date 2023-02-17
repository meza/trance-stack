import { useEffect } from 'react';
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
import { remixI18next } from '~/i18n';
import { defaultNS } from '~/i18n/i18n.config';
import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';
import styles from './styles/app.css';
import darkStyles from './styles/dark.css';
import lightStyles from './styles/light.css';
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
  i18n: 'translation'
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

const CookieYes = (props: { isProduction: boolean, token: string }) => {
  if (props.isProduction) {
    return <script id="cookieyes" type="text/javascript" src={`https://cdn-cookieyes.com/client_data/${props.token}/script.js`}></script>;
  }
  return <></>;
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
        <CookieYes isProduction={appConfig.isProduction} token={appConfig.cookieYesToken}/>
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.appConfig = ${JSON.stringify(appConfig)}`
          }}
        />
        <script
          async
          id="hotjar-tracker"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:window.appConfig.hotjarId,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          hj('identify', window.appConfig.visitorId);
          `
          }}
        />
        <Outlet context={{ appConfig: appConfig, locale: locale }}/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
};

export default App;

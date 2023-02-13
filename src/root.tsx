import type { LinksFunction, MetaFunction } from '@remix-run/node';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData
} from '@remix-run/react';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'REPL_APP_NAME',
  viewport: 'width=device-width,initial-scale=1'
});

export const loader = async () => {
  return json({ hotjarId: process.env.HOTJAR_ID || 3365028 });
};

const App = () => {
  const { hotjarId } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta/>
        <Links/>
      </head>
      <body>
        <Outlet/>
        <ScrollRestoration/>
        <script
          async
          id="hotjar-tracker"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `
          }}
        />
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
};

export default App;

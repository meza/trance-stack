import React, { startTransition, StrictMode, useEffect } from 'react';
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { Replay } from '@sentry/react';
import * as Sentry from '@sentry/remix';
import i18next from 'i18next';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Mixpanel } from '~/components/Mixpanel';
import { initClientI18n } from '~/i18n';

Sentry.init({
  dsn: window.appConfig.sentryDsn,
  release: window.appConfig.version,
  tracesSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      )
    }),
    new Replay()
  ]
});

const hydrate = () => {
  initClientI18n().then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <I18nextProvider i18n={i18next}>
          <Mixpanel/>
          <StrictMode>
            <RemixBrowser/>
          </StrictMode>
        </I18nextProvider>
      );
    });
  });
};

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

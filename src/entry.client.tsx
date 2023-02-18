import React, { startTransition, StrictMode } from 'react';
import { RemixBrowser } from '@remix-run/react';
import i18next from 'i18next';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Mixpanel } from '~/components/Mixpanel';
import { initClientI18n } from '~/i18n';

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

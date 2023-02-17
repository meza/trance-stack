import { startTransition, StrictMode, useEffect } from 'react';
import { RemixBrowser } from '@remix-run/react';
import i18next from 'i18next';
import mixpanel from 'mixpanel-browser';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { initClientI18n } from '~/i18n';

const MixPanel = () => {
  const { mixpanelToken, isProduction, mixpanelApi, visitorId } = window.ENV;

  useEffect(() => {
    mixpanel.init(mixpanelToken, {
      test: !isProduction,
      debug: !isProduction,
      // eslint-disable-next-line camelcase
      api_host: mixpanelApi
    });
    mixpanel.identify(visitorId);
    mixpanel.track('Page View');
  }, [mixpanelToken, isProduction, mixpanelApi, visitorId]);

  return <></>;
};

const hydrate = () => {
  initClientI18n().then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <MixPanel/>
          <I18nextProvider i18n={i18next}>
            <RemixBrowser/>
          </I18nextProvider>
        </StrictMode>
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

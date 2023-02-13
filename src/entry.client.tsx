import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import mixpanel from 'mixpanel-browser';

const MixPanel = () => {
  const { mixpanelToken, isProduction } = (window as any).ENV;

  useEffect(() => {
    mixpanel.init(mixpanelToken, {
      test: !isProduction,
      debug: !isProduction,
      // eslint-disable-next-line camelcase
      api_host: 'https://api-eu.mixpanel.com'
    });
    mixpanel.track('Page View');
  }, [mixpanelToken, isProduction]);

  return <></>;
};

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <MixPanel/>
        <RemixBrowser/>
      </StrictMode>
    );
  });
};

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

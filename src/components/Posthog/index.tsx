import { useContext, useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { CookieConsentContext } from '~/components/CookieConsent';
import type { PropsWithChildren } from 'react';

export interface PosthogProps extends PropsWithChildren {
  apiKey: string;
  apiUrl: string;
  visitorId: string;
}

export const Posthog = (props: PosthogProps) => {
  const { analytics } = useContext(CookieConsentContext);

  useEffect(() => {
    posthog.init(props.apiKey, {
      // eslint-disable-next-line camelcase
      api_host: props.apiUrl,
      loaded: (posthog) => {
        posthog.identify(props.visitorId);
      },
      persistence: analytics === true ? 'cookie' : 'memory'
    });
  }, [analytics, props.apiKey, props.apiUrl, props.visitorId]);

  return (
    <PostHogProvider client={posthog}>
      {props.children}
    </PostHogProvider>
  );

};

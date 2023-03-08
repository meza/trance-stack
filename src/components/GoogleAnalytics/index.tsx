import { StaticContent } from '~/components/StaticContent';

interface GoogleAnalyticsProps {
  googleAnalyticsId: string;
  visitorId: string;
  nonce?: string;
}

export const GoogleAnalytics = (props: GoogleAnalyticsProps) => {
  return (
    <>
      <StaticContent
        element={'script'}
        id={'gtm'}
        async
        nonce={props.nonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsId}`}
      />
      <StaticContent
        element={'script'}
        id={'google-analytics'}
        nonce={props.nonce}
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${props.googleAnalyticsId}', { user_id: '${props.visitorId}' });`
        }}/>
    </>
  );
};

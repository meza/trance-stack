interface GoogleAnalyticsProps {
  googleAnalyticsId: string;
  visitorId: string;
}

export const GoogleAnalytics = (props: GoogleAnalyticsProps) => {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsId}`}/>
      <script
        id={'google-analytics'}
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${props.googleAnalyticsId}', {
          'user_id': '${props.visitorId}'
        });`
        }}
      />
    </>
  );
};

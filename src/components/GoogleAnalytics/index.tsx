interface GoogleAnalyticsProps {
  googleAnalyticsId: string;
  visitorId: string;
  nonce?: string;
}

export const GoogleAnalytics = (props: GoogleAnalyticsProps) => {
  const inputProps: {nonce?: string} = {};
  if (props.nonce) {
    inputProps.nonce = props.nonce;
  }
  return (
    <>
      <script async nonce={props.nonce} src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsId}`}></script>
      <script
        {...inputProps}
        id={'google-analytics'}
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${props.googleAnalyticsId}', {
          'user_id': '${props.visitorId}'
        });`
        }}
      ></script>
    </>
  );
};

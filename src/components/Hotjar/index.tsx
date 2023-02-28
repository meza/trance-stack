interface HotjarProps {
  hotjarId: string;
  visitorId: string;
}

export const Hotjar = (props: HotjarProps) => {
  const { hotjarId, visitorId } = props;
  return (
    <script
      async
      id={'hotjar-tracker'}
      dangerouslySetInnerHTML={{
        __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:'${hotjarId}',hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          hj('identify', '${visitorId}');
          `
      }}
    />
  );
};

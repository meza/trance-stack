import { useContext } from 'react';
import { CookieConsentContext } from '~/components/CookieConsent';

interface HotjarProps {
  hotjarId: string;
  visitorId: string;
  nonce?: string;
}

export const Hotjar = (props: HotjarProps) => {
  const { hotjarId, visitorId } = props;
  const { analytics } = useContext(CookieConsentContext);
  const hotjarVersion = 6;
  const debug = process.env.NODE_ENV === 'development';

  return (
    <>
      <script
        suppressHydrationWarning
        nonce={props.nonce}
        async
        id={'hotjar-init'}
        dangerouslySetInnerHTML={{
          __html: `(function(h){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:'${hotjarId}',hjsv:${hotjarVersion},hjdebug:${debug}};
          })(window);
          hj('identify', '${visitorId}');
          `
        }}
      />
      { analytics ? <script
        suppressHydrationWarning
        nonce={props.nonce}
        async
        id={'hotjar-script'}
        src={`https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${hotjarVersion}`}
      /> : null }
    </>
  );
};

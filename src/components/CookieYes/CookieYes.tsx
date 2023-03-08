import { StaticContent } from '~/components/StaticContent';

export const CookieYes = (props: { isProduction: boolean, token: string; nonce?: string; }) => {
  if (props.isProduction) {
    return (
      <StaticContent
        element={'script'}
        nonce={props.nonce}
        id={'cookieyes'}
        type={'text/javascript'}
        src={`https://cdn-cookieyes.com/client_data/${props.token}/script.js`}/>
    );
  }
  return null;
};

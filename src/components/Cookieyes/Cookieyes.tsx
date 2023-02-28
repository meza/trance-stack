export const Cookieyes = (props: { isProduction: boolean, token: string; nonce?: string; }) => {
  if (props.isProduction) {
    return <script nonce={props.nonce} async id={'cookieyes'} type={'text/javascript'} src={`https://cdn-cookieyes.com/client_data/${props.token}/script.js`}/>;
  }
  return null;
};

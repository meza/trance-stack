export const Cookieyes = (props: { isProduction: boolean, token: string }) => {
  if (props.isProduction) {
    return <script id="cookieyes" type="text/javascript" src={`https://cdn-cookieyes.com/client_data/${props.token}/script.js`}></script>;
  }
  return null;
};

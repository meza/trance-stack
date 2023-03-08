import { StaticContent } from '~/components/StaticContent';

export const ExposeAppConfig = (props: { appConfig: AppConfig, nonce?: string }) => {
  return (
    <StaticContent
      element={'script'}
      id={'app-config'}
      nonce={props.nonce}
      dangerouslySetInnerHTML={{
        __html: `window.appConfig = ${JSON.stringify(props.appConfig)}` //typed in the ../types/global.d.ts
      }}/>
  );
};

export const ExposeAppConfig = (props: { appConfig: AppConfig, nonce?: string }) => {
  return (
    <script
      id={'app-config'}
      suppressHydrationWarning
      nonce={props.nonce}
      dangerouslySetInnerHTML={{
        __html: `window.appConfig = ${JSON.stringify(props.appConfig)}` //typed in the ../types/global.d.ts
      }}/>
  );
};

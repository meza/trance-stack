/// <reference types="vite/client" />
declare global {

  interface AppConfig {
    hotjarId: string;
    mixpanelToken: string;
    mixpanelApi: string;
    splitToken: string;
    cookieYesToken: string;
    isProduction: boolean;
    visitorId: string;
    version: string;
  }

  interface Window {
    appConfig: AppConfig;
    locale: strin;
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_DOMAIN: string;
      COOKIEYES_TOKEN: string;
      HOTJAR_ID: string;
      MIXPANEL_API: string;
      MIXPANEL_TOKEN: string;
      NODE_ENV: string;
      SESSION_SECRET: string | undefined
      SPLIT_SERVER_TOKEN: string;
      I18N_DEBUG: string;
    }
  }
}

export {};

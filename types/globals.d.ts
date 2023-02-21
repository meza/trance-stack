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
  }

  interface Window {
    appConfig: AppConfig;
    locale: strin;
  }

  namespace NodeJS {
    interface ProcessEnv {
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

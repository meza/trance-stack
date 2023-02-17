/// <reference types="vite/client" />
declare global {

  interface AppConfig {
    hotjarId: string;
    mixpanelToken: string;
    mixpanelApi: string;
    splitToken: string;
    cookieYesToken: string;
    isProduction: string;
    visitorId: string;
  }

  interface Window {
    appConfig: AppConfig;
    locale: strin;
  }
}

export {};

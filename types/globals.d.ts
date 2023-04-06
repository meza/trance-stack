/// <reference types="vite/client" />
declare global {

  interface AppConfig {
    googleAnalyticsId: string;
    hotjarId: string;
    isProduction: boolean;
    visitorId: string;
    version: string;
    sentryDsn: string;
    posthogToken: string;
    posthogApi: string;
    csrfToken: string;
    csrfTokenKey: string;
  }

  interface Window {
    appConfig: AppConfig;
    locale: string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_DOMAIN: string;
      GOOGLE_ANALYTICS_ID: string;
      HOTJAR_ID: string;
      NODE_ENV: string;
      SESSION_SECRET: string | undefined;
      I18N_DEBUG: string;
      SENTRY_DSN: string;
      POSTHOG_TOKEN: string;
      POSTHOG_API: string;
      CSRF_SESSION_SECRET: string;
    }
  }
}

export {};

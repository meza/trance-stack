declare global {

  interface Env {
    hotjarId: string,
    mixpanelToken: string,
    mixpanelApi: string,
    splitToken: string,
    cookieYesToken: string,
    isProduction: string,
    visitorId: string
  }

  interface Window {
    ENV: Env,
    locale: string
  }
}

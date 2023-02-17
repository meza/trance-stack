declare global {
  interface Window {
    ENV: {
      hotjarId: string,
      mixpanelToken: string,
      mixpanelApi: string,
      splitToken: string,
      cookieYesToken: string,
      isProduction: string,
      visitorId: string
    },
    locale: string
  }
}

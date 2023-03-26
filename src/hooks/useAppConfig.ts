import { useOutletContext } from '@remix-run/react';

export const useAppConfig = <K extends keyof AppConfig>(key: K) =>
  useOutletContext<{ appConfig: AppConfig }>().appConfig[key];

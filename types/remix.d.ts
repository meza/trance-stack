import type { DataFunctionArgs } from '@remix-run/server-runtime';
declare module '@remix-run/node' {

  export interface LoaderArgs extends DataFunctionArgs {
    context: { visitorId: string };
  }

}

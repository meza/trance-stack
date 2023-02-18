import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { remixI18next } from '~/i18n';
import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';
import { handle, links, loader, meta } from './root';

vi.mock('~/session.server');
vi.mock('~/i18n');
vi.mock('~/split.server');
vi.mock('./styles/app.css', () => ({ default: 'app.css' }));
vi.mock('./styles/dark.css', () => ({ default: 'dark.css' }));
vi.mock('./styles/light.css', () => ({ default: 'light.css' }));

describe('The root module', () => {
  const originalEnv = structuredClone(process.env);
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should have a consistent meta function', () => {
    expect(meta({} as never)).toMatchInlineSnapshot(`
      {
        "charset": "utf-8",
        "title": "REPL_APP_NAME",
        "viewport": "width=device-width,initial-scale=1",
      }
    `);
  });

  it('should have a consistent links function', () => {
    expect(links()).toMatchInlineSnapshot(`
      [
        {
          "href": "light.css",
          "rel": "stylesheet",
        },
        {
          "href": "dark.css",
          "media": "(prefers-color-scheme: dark)",
          "rel": "stylesheet",
        },
        {
          "href": "app.css",
          "rel": "stylesheet",
        },
        {
          "href": "/_static/favicon.ico",
          "rel": "icon",
          "type": "image/x-icon",
        },
      ]
    `);
  });

  it('should expose a consistent handle', () => {
    expect(handle).toMatchInlineSnapshot(`
      {
        "i18n": [
          "translation",
        ],
      }
    `);
  });

  describe('when calling the loader', () => {
    beforeEach(() => {
      vi.mocked(getVisitorIdFromRequest).mockResolvedValue('a-visitorId');
      vi.mocked(remixI18next.getLocale).mockResolvedValue('en');
      vi.mocked(splitClient.ready).mockResolvedValue();
      vi.mocked(splitClient.track).mockReturnValue(true);

      process.env.NODE_ENV = 'development';
      process.env.HOTJAR_ID = 'a-hotjar-id';
      process.env.MIXPANEL_TOKEN = 'a-mixpanel-token';
      process.env.MIXPANEL_API = 'a-mixpanel-api';
      process.env.SPLIT_CLIENT_TOKEN = 'a-split-token';
      process.env.COOKIEYES_TOKEN = 'a-cookieyes-token';

    });

    it('should return the app config for dev', async () => {
      const request = new Request('https://example.com');
      const response = await loader({ request: request } as never);
      const data = await response.json();
      expect(data).toMatchInlineSnapshot(`
        {
          "appConfig": {
            "cookieYesToken": "a-cookieyes-token",
            "hotjarId": "a-hotjar-id",
            "isProduction": false,
            "mixpanelApi": "a-mixpanel-api",
            "mixpanelToken": "a-mixpanel-token",
            "splitToken": "a-split-token",
            "visitorId": "a-visitorId",
          },
          "locale": "en",
        }
      `);
    });

    it('should return the app config for prod', async () => {
      process.env.NODE_ENV = 'production';
      const request = new Request('https://example.com');
      const response = await loader({ request: request } as never);
      const data = await response.json();
      expect(data).toMatchInlineSnapshot(`
        {
          "appConfig": {
            "cookieYesToken": "a-cookieyes-token",
            "hotjarId": "a-hotjar-id",
            "isProduction": true,
            "mixpanelApi": "a-mixpanel-api",
            "mixpanelToken": "a-mixpanel-token",
            "splitToken": "a-split-token",
            "visitorId": "a-visitorId",
          },
          "locale": "en",
        }
      `);
    });

    it('should prepare the environment', async () => {
      const request = new Request('https://example.com');
      await loader({ request: request } as never);

      expect(getVisitorIdFromRequest).toHaveBeenCalledWith(request);
      expect(remixI18next.getLocale).toHaveBeenCalledWith(request);
      expect(splitClient.ready).toHaveBeenCalled();
      expect(splitClient.track).toHaveBeenCalledWith('a-visitorId', 'anonymous', 'page_view')

    });
  });
});

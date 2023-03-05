import { beforeEach, describe, expect, vi } from 'vitest';

describe('The i18n config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should not change unintentionally', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const configModule = await import('~/i18n/i18n.config');
    const baseConfig = configModule.default;
    const { getBaseClientConfig, supportedLngs, fallbackLng, defaultNS } = configModule;
    expect(getBaseClientConfig()).toMatchInlineSnapshot(`
      {
        "defaultNS": [
          "translation",
        ],
        "detection": {
          "caches": [],
          "order": [
            "htmlTag",
          ],
        },
        "fallbackLng": "en",
        "interpolation": {
          "escapeValue": false,
        },
        "react": {
          "useSuspense": false,
        },
        "supportedLngs": [
          "en",
        ],
      }
    `);
    expect(supportedLngs).toMatchInlineSnapshot(`
      [
        "en",
      ]
    `);
    expect(defaultNS).toMatchInlineSnapshot(`
      [
        "translation",
      ]
    `);
    expect(fallbackLng).toMatchInlineSnapshot('"en"');
    expect(baseConfig).toMatchInlineSnapshot(`
      {
        "defaultNS": [
          "translation",
        ],
        "fallbackLng": "en",
        "supportedLngs": [
          "en",
        ],
      }
    `);
  });
});

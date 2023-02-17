import { describe } from 'vitest';
import { defaultNS, fallbackLng, getBaseClientConfig, supportedLngs } from '~/i18n/i18n.config';

describe('The i18n config', () => {
  it('should not change unintentionally', () => {
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
  });
});

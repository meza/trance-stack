import { createInstance } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseClientConfig } from './i18n.config';

describe('The i18next server module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    vi.mock('i18next');
    vi.mock('react-i18next', () => ({
      initReactI18next: 'initReactI18next'
    }));
    vi.mock('i18next-fs-backend', () => ({
      default: 'Backend'
    }));
    vi.mock('./i18n.config');
    vi.mock('./remix.server', () => ({
      default: {
        getRouteNamespaces: () => ['en']
      }
    }));
    vi.mock('../../public/locales/en/translation.json', () => ({
      default: 'en-translation-file'
    }));

    vi.mocked(getBaseClientConfig).mockReturnValue({ 'client': 'config' } as never);
  });

  it('didn\'t change unexpectedly', async () => {
    const use = vi.fn();
    const init = vi.fn();
    const ci = {
      use: use,
      init: init
    } as never;

    vi.mocked(createInstance).mockReturnValue(ci);

    use.mockReturnValue(ci);
    init.mockResolvedValue({} as never);
    const initUnderTest = (await import('./i18next.server')).default;
    const actual = await initUnderTest('en', {} as never);

    await initUnderTest('en', {} as never); // calling it again to verify the singleton

    expect(createInstance).toHaveBeenCalledOnce();
    expect(use).toHaveBeenCalledTimes(2);
    expect(use).toHaveBeenCalledWith('initReactI18next');
    expect(use).toHaveBeenCalledWith('Backend');
    expect(init).toHaveBeenCalledTimes(1);
    const initCall = vi.mocked(init).mock.calls[0][0];
    expect(initCall).toMatchInlineSnapshot(`
    {
      "debug": false,
      "defaultNS": [],
      "fallbackLng": "en",
      "lng": "en",
      "ns": [
        "en",
      ],
      "resources": {
        "en": {
          "translation": "en-translation-file",
        },
      },
      "supportedLngs": [],
    }
  `);
    expect(actual).toBe(ci);
  });

  it('responds to the debug mode', async () => {
    const use = vi.fn();
    const init = vi.fn();
    const ci = {
      use: use,
      init: init
    } as never;

    vi.mocked(createInstance).mockReturnValue(ci);

    use.mockReturnValue(ci);
    init.mockResolvedValue({} as never);

    vi.stubEnv('I18N_DEBUG', 'true');
    const initUnderTest = (await import('./i18next.server')).default;
    const actual = await initUnderTest('en', {} as never);

    const initCall = vi.mocked(init).mock.calls[0][0];
    expect(initCall).toMatchInlineSnapshot(`
      {
        "debug": true,
        "defaultNS": [],
        "fallbackLng": "en",
        "lng": "en",
        "ns": [
          "en",
        ],
        "resources": {
          "en": {
            "translation": "en-translation-file",
          },
        },
        "supportedLngs": [],
      }
    `);
    expect(actual).toBe(ci);
  });
});

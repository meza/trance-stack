import { RemixI18Next } from 'remix-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:path', () => ({
  resolve: vi.fn().mockImplementation((...args: string[]) => args.join('/'))
}));

vi.mock('i18next-fs-backend', () => ({
  default: 'Backend'
}));

vi.mock('remix-i18next');

describe('The remix i18n server module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(RemixI18Next).mockReturnValue({ mocked:'remix-i18next' } as never);
    vi.resetModules();
  });

  it('should not change unintentionally', async () => {
    const actual = await import('./remix.server');
    expect(actual.default).toEqual({ mocked:'remix-i18next' });

    expect(RemixI18Next).toHaveBeenCalledOnce();

    const remixI18nextCall = vi.mocked(RemixI18Next).mock.calls[0][0];
    expect(remixI18nextCall).toMatchInlineSnapshot(`
      {
        "backend": "Backend",
        "detection": {
          "fallbackLanguage": "en",
          "supportedLanguages": [
            "en",
          ],
        },
        "i18next": {
          "backend": {
            "loadPath": "../public/locales/{{lng}}/{{ns}}.json",
          },
        },
      }
    `);
  });
});

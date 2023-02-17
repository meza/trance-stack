import path from 'node:path';
import { createInstance } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseClientConfig } from './i18n.config';
import initUnderTest from './i18next.server';

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
    getRouteNamespaces: vi.fn().mockReturnValue(['en'] as never)
  }
}));

describe('The i18next server module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

    const actual = await initUnderTest('en', {} as never);

    await initUnderTest('en', {} as never); // calling it again to verify the singleton

    expect(createInstance).toHaveBeenCalledOnce();
    expect(use).toHaveBeenCalledTimes(2);
    expect(use).toHaveBeenCalledWith('initReactI18next');
    expect(use).toHaveBeenCalledWith('Backend');
    expect(init).toHaveBeenCalledTimes(1);
    const initCall = vi.mocked(init).mock.calls[0][0];
    initCall.backend.loadPath = path.relative(process.cwd(), initCall.backend.loadPath);
    expect(initCall).toMatchInlineSnapshot(`
      {
        "backend": {
          "loadPath": "../public/locales/{{lng}}/{{ns}}.json",
        },
        "debug": false,
        "defaultNS": [],
        "fallbackLng": "en",
        "lng": "en",
        "ns": undefined,
        "supportedLngs": [],
      }
    `);
    expect(actual).toBe(ci);
  });
});

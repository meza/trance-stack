
import i18next from 'i18next';
import { getInitialNamespaces } from 'remix-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseClientConfig } from '~/i18n/i18n.config';
import init from '~/i18n/i18next.client';

vi.mock('remix-i18next');
vi.mock('./i18n.config');
vi.mock('i18next', () => ({
  default: {
    use: vi.fn(),
    init: vi.fn()
  }
}));
vi.mock('react-i18next', () => ({
  initReactI18next: 'initReactI18next',
  default: 'react-i18next'
}));
vi.mock('i18next-browser-languagedetector', () => ({
  default: 'i18next-browser-languagedetector'
}));
vi.mock('i18next-http-backend', () => ({
  default: 'i18next-http-backend'
}));

describe('i18next.client', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(getInitialNamespaces).mockReturnValue(['ns1', 'ns2'] as never);
    vi.mocked(getBaseClientConfig).mockReturnValue({ 'client': 'config' } as never);
  });

  it('is wired up correctly', async () => {
    vi.mocked(i18next.use).mockReturnValue(i18next);
    vi.stubGlobal('appConfig', { version: '1' });
    const actual = await init();
    expect(actual).toBe(i18next);
    expect(i18next.use).toHaveBeenCalledTimes(3);
    expect(i18next.use).toHaveBeenCalledWith('initReactI18next');
    expect(i18next.use).toHaveBeenCalledWith('i18next-browser-languagedetector');
    expect(i18next.use).toHaveBeenCalledWith('i18next-http-backend');
    expect(i18next.init).toHaveBeenCalledTimes(1);

    const initCall = vi.mocked(i18next.init).mock.calls[0][0];
    expect(initCall).toMatchInlineSnapshot(`
      {
        "backend": {
          "loadPath": "/_static/locales/{{lng}}/{{ns}}.json?v=1",
        },
        "client": "config",
        "debug": false,
        "ns": [
          "ns1",
          "ns2",
        ],
      }
    `);
  });
});

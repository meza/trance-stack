import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./i18next.server', () => ({
  default: 'i18next.server'
}));
vi.mock('./i18next.client', () => ({
  default: 'i18next.client'
}));
vi.mock('./remix.server', () => ({
  default: 'remix.server'
}));

describe('index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should not change unexpectedly', async () => {
    const actual = await import('./index');
    expect(actual).toMatchInlineSnapshot(`
      {
        "initClientI18n": "i18next.client",
        "initServerI18n": "i18next.server",
        "remixI18next": "remix.server",
      }
    `);
  });
});

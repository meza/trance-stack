import { startTransition } from 'react';
import * as Sentry from '@sentry/remix';
import { hydrateRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { initClientI18n } from '~/i18n';

vi.mock('react');
vi.mock('react-i18next');
vi.mock('~/i18n');
vi.mock('react-dom/client');
vi.mock('i18next', () => ({
  default: 'i18next'
}));
vi.mock('~/components/Mixpanel', () => ({
  Mixpanel: 'Mixpanel'
}));
vi.mock('@remix-run/react');
vi.mock('@sentry/remix');

describe('The Client Entrypoint', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    vi.useRealTimers();
    vi.useFakeTimers();
    vi.mocked(initClientI18n).mockResolvedValue(undefined as never);
    vi.mocked(startTransition).mockImplementation((callback: CallableFunction) => {
      callback();
    });
    vi.mocked(Sentry.init).mockImplementation(() => undefined as never);
    vi.stubGlobal('window', {
      appConfig: {
        sentryDsn: 'sentryDsn',
        sentryRelease: 'sentryRelease'
      }
    });
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('Should initialise Sentry', async () => {
    await import('./entry.client');
    expect(vi.mocked(Sentry.init)).toHaveBeenCalledOnce();
    expect(vi.mocked(Sentry.init).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "debug": true,
        "dsn": "sentryDsn",
        "integrations": [
          BrowserTracing {},
        ],
        "release": "sentryRelease",
        "tracesSampleRate": 1,
      }
    `);
  });

  it('Should work on Safari', async () => {
    await import('./entry.client');
    await vi.advanceTimersByTimeAsync(1000);

    expect(vi.mocked(hydrateRoot)).toHaveBeenCalledOnce();
  });

  it('Should work on Other Browsers', async () => {
    vi.useRealTimers();
    vi.stubGlobal('requestIdleCallback', (callback: CallableFunction) => {
      callback();
    });
    await import('./entry.client');

    expect(vi.mocked(hydrateRoot)).toHaveBeenCalledOnce();
    const hydrateRootCalls = vi.mocked(hydrateRoot).mock.calls[0];
    expect(hydrateRootCalls[0]).toEqual(document);
    expect(hydrateRootCalls[1]).toMatchInlineSnapshot(`
      <I18nextProvider
        i18n="i18next"
      >
        <Mixpanel />
        <UNDEFINED>
          <RemixBrowser />
        </UNDEFINED>
      </I18nextProvider>
    `);
  });
});

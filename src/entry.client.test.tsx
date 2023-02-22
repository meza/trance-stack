import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { initClientI18n } from '~/i18n';

describe('The Client Entrypoint', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.mocked(initClientI18n).mockResolvedValue(undefined as never);
    vi.mocked(startTransition).mockImplementation((callback: CallableFunction) => {
      callback();
    });
    vi.resetModules();
    vi.mock('react');
    vi.mock('react-i18next');
    vi.mock('~/i18n');
    vi.mock('react-dom/client');
    vi.mock('i18next', () => ({
      default: 'i18next'
    }));
    vi.mock('~/components/Mixpanel');
    vi.mock('@remix-run/react');
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
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

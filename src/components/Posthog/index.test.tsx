import { render } from '@testing-library/react';
import posthog from 'posthog-js';
import { describe, expect, it, vi } from 'vitest';
import { CookieConsentProvider } from '~/components/CookieConsent';
import { Posthog } from './index';

vi.mock('posthog-js');

describe('The posthog wrapper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initialises posthog correctly', () => {

    render(
      <CookieConsentProvider consentData={{ }}>
        <Posthog apiKey={'12345'} apiUrl={'https://example.com'} visitorId={'abc123'} />
      </CookieConsentProvider>
    );

    render(
      <CookieConsentProvider consentData={{ analytics: false }}>
        <Posthog apiKey={'123456'} apiUrl={'https://example.com/a'} visitorId={'abc123'} />
      </CookieConsentProvider>
    );

    render(
      <CookieConsentProvider consentData={{ analytics: true }}>
        <Posthog apiKey={'1234567'} apiUrl={'https://example.com/b'} visitorId={'abc123'} />
      </CookieConsentProvider>
    );

    expect(posthog.init).toHaveBeenNthCalledWith(1, '12345', {
      // eslint-disable-next-line camelcase
      api_host: 'https://example.com',
      loaded: expect.any(Function),
      persistence: 'memory'
    });

    expect(posthog.init).toHaveBeenNthCalledWith(2, '123456', {
      // eslint-disable-next-line camelcase
      api_host: 'https://example.com/a',
      loaded: expect.any(Function),
      persistence: 'memory'
    });

    expect(posthog.init).toHaveBeenNthCalledWith(3, '1234567', {
      // eslint-disable-next-line camelcase
      api_host: 'https://example.com/b',
      loaded: expect.any(Function),
      persistence: 'cookie'
    });

  });

  it('renders the children', () => {
    const { container } = render(<Posthog apiKey={'12345'} apiUrl={'https://example.com'} visitorId={'abc123'}>{'hello'}</Posthog>);
    expect(container).toHaveTextContent('hello');
  });

  it('identifies the visitor', () => {
    render(<CookieConsentProvider consentData={{ analytics: false }}>
      <Posthog apiKey={'123456'} apiUrl={'https://example.com/a'} visitorId={'abc12345'} />
    </CookieConsentProvider>);

    const initCall = vi.mocked(posthog.init).mock.calls[0];
    const loadedCallback = initCall[1]!.loaded!;

    const ph = {
      identify: vi.fn()
    };

    loadedCallback(ph as never);

    expect(ph.identify).toHaveBeenCalledWith('abc12345');

  });
});

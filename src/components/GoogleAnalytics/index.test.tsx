import { useContext } from 'react';
import { vi } from 'vitest';
import { GoogleAnalytics } from './index';

vi.mock('react', async () => {
  const actual = await vi.importActual('react') as object;
  return {
    ...actual,
    useContext: vi.fn(),
    createContext: vi.fn()
  };
});

describe('Google Analytics 4', () => {
  describe('when analytics is enabled', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(useContext).mockReturnValue({ analytics: true });
    });

    it('Should render with the correct arguments', () => {
    // eslint-disable-next-line new-cap
      expect(GoogleAnalytics({
        googleAnalyticsId: '123',
        visitorId: 'abc',
        nonce: 'a-nonce'
      })).toMatchInlineSnapshot(`
      <React.Fragment>
        <script
          async={true}
          id="gtm"
          nonce="a-nonce"
          src="https://www.googletagmanager.com/gtag/js?id=123"
          suppressHydrationWarning={true}
        />
        <script
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '123', { user_id: 'abc' });",
            }
          }
          id="google-analytics"
          nonce="a-nonce"
          suppressHydrationWarning={true}
        />
      </React.Fragment>
    `);

      // eslint-disable-next-line new-cap
      expect(GoogleAnalytics({
        googleAnalyticsId: 'triangulation',
        visitorId: 'abc123',
        nonce: 'a-nonce2'
      })).toMatchInlineSnapshot(`
      <React.Fragment>
        <script
          async={true}
          id="gtm"
          nonce="a-nonce2"
          src="https://www.googletagmanager.com/gtag/js?id=triangulation"
          suppressHydrationWarning={true}
        />
        <script
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'triangulation', { user_id: 'abc123' });",
            }
          }
          id="google-analytics"
          nonce="a-nonce2"
          suppressHydrationWarning={true}
        />
      </React.Fragment>
    `);
    });
  });

  describe('when analytics is disabled', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(useContext).mockReturnValue({ analytics: false });
    });

    it('Should render with the correct arguments', () => {
      // eslint-disable-next-line new-cap
      expect(GoogleAnalytics({
        googleAnalyticsId: '123',
        visitorId: 'abc',
        nonce: 'a-nonce'
      })).toMatchInlineSnapshot(`
        <React.Fragment>
          <script
            dangerouslySetInnerHTML={
              {
                "__html": "window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '123', { user_id: 'abc' });",
              }
            }
            id="google-analytics"
            nonce="a-nonce"
            suppressHydrationWarning={true}
          />
        </React.Fragment>
      `);

      // eslint-disable-next-line new-cap
      expect(GoogleAnalytics({
        googleAnalyticsId: 'triangulation',
        visitorId: 'abc123',
        nonce: 'a-nonce2'
      })).toMatchInlineSnapshot(`
        <React.Fragment>
          <script
            dangerouslySetInnerHTML={
              {
                "__html": "window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'triangulation', { user_id: 'abc123' });",
              }
            }
            id="google-analytics"
            nonce="a-nonce2"
            suppressHydrationWarning={true}
          />
        </React.Fragment>
      `);
    });
  });
});

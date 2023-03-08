import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleAnalytics } from './index';

describe('Google Analytics 4', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render with the correct arguments', () => {
    // eslint-disable-next-line new-cap
    expect(GoogleAnalytics({
      googleAnalyticsId: '123',
      visitorId: 'abc',
      nonce: 'a-nonce'
    })).toMatchInlineSnapshot(`
      <React.Fragment>
        <StaticContent
          async={true}
          element="script"
          id="gtm"
          nonce="a-nonce"
          src="https://www.googletagmanager.com/gtag/js?id=123"
        />
        <StaticContent
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '123', { user_id: 'abc' });",
            }
          }
          element="script"
          id="google-analytics"
          nonce="a-nonce"
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
        <StaticContent
          async={true}
          element="script"
          id="gtm"
          nonce="a-nonce2"
          src="https://www.googletagmanager.com/gtag/js?id=triangulation"
        />
        <StaticContent
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'triangulation', { user_id: 'abc123' });",
            }
          }
          element="script"
          id="google-analytics"
          nonce="a-nonce2"
        />
      </React.Fragment>
    `);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleAnalytics } from './index';

describe('Hotjar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render with the correct arguments', () => {
    // eslint-disable-next-line new-cap
    expect(GoogleAnalytics({
      googleAnalyticsId: '123',
      visitorId: 'abc'
    })).toMatchInlineSnapshot(`
      <React.Fragment>
        <script
          async={true}
          src="https://www.googletagmanager.com/gtag/js?id=123"
        />
        <script
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '123', {
                'user_id': 'abc'
              });",
            }
          }
          id="google-analytics"
        />
      </React.Fragment>
    `);

    // eslint-disable-next-line new-cap
    expect(GoogleAnalytics({
      googleAnalyticsId: 'triangulation',
      visitorId: 'abc123'
    })).toMatchInlineSnapshot(`
      <React.Fragment>
        <script
          async={true}
          src="https://www.googletagmanager.com/gtag/js?id=triangulation"
        />
        <script
          dangerouslySetInnerHTML={
            {
              "__html": "window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'triangulation', {
                'user_id': 'abc123'
              });",
            }
          }
          id="google-analytics"
        />
      </React.Fragment>
    `);
  });
});

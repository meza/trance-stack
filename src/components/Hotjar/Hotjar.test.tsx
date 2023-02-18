import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Hotjar } from '~/components/Hotjar/Hotjar';

describe('Hotjar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render with the correct arguments', () => {
    // eslint-disable-next-line new-cap
    expect(Hotjar({
      hotjarId: '123',
      visitorId: 'abc'
    })).toMatchInlineSnapshot(`
      <script
        async={true}
        dangerouslySetInnerHTML={
          {
            "__html": "(function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:'123',hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                hj('identify', 'abc');
                ",
          }
        }
        id="hotjar-tracker"
      />
    `);

    // eslint-disable-next-line new-cap
    expect(Hotjar({
      hotjarId: '567',
      visitorId: 'xyz'
    })).toMatchInlineSnapshot(`
      <script
        async={true}
        dangerouslySetInnerHTML={
          {
            "__html": "(function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:'567',hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                hj('identify', 'xyz');
                ",
          }
        }
        id="hotjar-tracker"
      />
    `);
  });
});

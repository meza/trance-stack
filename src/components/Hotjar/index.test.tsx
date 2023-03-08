import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Hotjar } from './index';

describe('Hotjar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render with the correct arguments', () => {
    // eslint-disable-next-line new-cap
    expect(Hotjar({
      hotjarId: '123',
      visitorId: 'abc',
      nonce: 'a-nonce'
    })).toMatchInlineSnapshot(`
      <React.Fragment>
        <StaticContent
          async={true}
          dangerouslySetInnerHTML={
            {
              "__html": "(function(h){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:'123',hjsv:6,hjdebug:false};
                })(window);
                hj('identify', 'abc');
                ",
            }
          }
          element="script"
          id="hotjar-init"
          nonce="a-nonce"
        />
        <StaticContent
          async={true}
          element="script"
          id="hotjar-script"
          nonce="a-nonce"
          src="https://static.hotjar.com/c/hotjar-123.js?sv=6"
        />
      </React.Fragment>
    `);

    // eslint-disable-next-line new-cap
    expect(Hotjar({
      hotjarId: '324123',
      visitorId: 'ewfwfec',
      nonce: 'a-nonce2'
    })).toMatchInlineSnapshot(`
      <React.Fragment>
        <StaticContent
          async={true}
          dangerouslySetInnerHTML={
            {
              "__html": "(function(h){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:'324123',hjsv:6,hjdebug:false};
                })(window);
                hj('identify', 'ewfwfec');
                ",
            }
          }
          element="script"
          id="hotjar-init"
          nonce="a-nonce2"
        />
        <StaticContent
          async={true}
          element="script"
          id="hotjar-script"
          nonce="a-nonce2"
          src="https://static.hotjar.com/c/hotjar-324123.js?sv=6"
        />
      </React.Fragment>
    `);
  });
});

import { useContext } from 'react';
import { vi, describe, it } from 'vitest';
import { Hotjar } from './index';

vi.mock('react', async () => {
  const actual = await vi.importActual('react') as object;
  return {
    ...actual,
    useContext: vi.fn(),
    createContext: vi.fn()
  };
});

describe('Hotjar', () => {
  describe('When analytics is enabled', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(useContext).mockReturnValue({ analytics: true });
    });

    it('Should render with the correct arguments', ({ expect }) => {
      // eslint-disable-next-line new-cap
      expect(Hotjar({
        hotjarId: '123',
        visitorId: 'abc',
        nonce: 'a-nonce'
      })).toMatchInlineSnapshot(`
      <React.Fragment>
        <script
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
          id="hotjar-init"
          nonce="a-nonce"
          suppressHydrationWarning={true}
        />
        <script
          async={true}
          id="hotjar-script"
          nonce="a-nonce"
          src="https://static.hotjar.com/c/hotjar-123.js?sv=6"
          suppressHydrationWarning={true}
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
        <script
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
          id="hotjar-init"
          nonce="a-nonce2"
          suppressHydrationWarning={true}
        />
        <script
          async={true}
          id="hotjar-script"
          nonce="a-nonce2"
          src="https://static.hotjar.com/c/hotjar-324123.js?sv=6"
          suppressHydrationWarning={true}
        />
      </React.Fragment>
    `);
    });
  });

  describe('When analytics is disabled', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(useContext).mockReturnValue({ analytics: false });
    });

    it('Should render with the correct arguments', ({ expect }) => {
      // eslint-disable-next-line new-cap
      expect(Hotjar({
        hotjarId: '123',
        visitorId: 'abc',
        nonce: 'a-nonce'
      })).toMatchInlineSnapshot(`
        <React.Fragment>
          <script
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
            id="hotjar-init"
            nonce="a-nonce"
            suppressHydrationWarning={true}
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
          <script
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
            id="hotjar-init"
            nonce="a-nonce2"
            suppressHydrationWarning={true}
          />
        </React.Fragment>
      `);
    });
  });
});

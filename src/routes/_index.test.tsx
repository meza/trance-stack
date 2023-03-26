import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import { authenticator } from '~/auth.server';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';
import Root, { links, loader } from './_index';

vi.mock('~/components/Hello', () => ({
  Hello: () => '<Hello />',
  links: () => ['hello-links']
}));
vi.mock('~/hooks/hasFeature', () => ({
  hasFeature: vi.fn()
}));
vi.mock('@remix-run/react');
vi.mock('@remix-run/node');
vi.mock('~/auth.server', () => ({
  authenticator: {
    getUser: vi.fn()
  }
}));

describe('The index route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(json).mockImplementation((input) => input as never);
  });

  describe('when the hello feature is enabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockImplementation((_: any, feat: Features) =>
        Promise.resolve(feat === Features.HELLO)
      );
      vi.mocked(useLoaderData).mockReturnValue({ isHelloEnabled: true } as never);
    });

    it('should return true from the loader', async () => {
      const request = {} as never;
      const actual = await loader(request);
      expect(actual).toMatchInlineSnapshot(`
        {
          "isAuthEnabled": false,
          "isHelloEnabled": true,
        }
      `);
    });

    it('should render the hello component', async () => {
      const comp = renderWithi18n(<Root />);
      expect(comp.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div>
            &lt;Hello /&gt;
            <div
              style="position: absolute; top: 0px; right: 0px;"
            >
              <div
                class="color-mode-toggle-container"
              />
            </div>
          </div>
        </DocumentFragment>
      `);
    });
  });

  describe('when the auth feature is enabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockResolvedValue(true);
      vi.mocked(useLoaderData).mockReturnValue({
        isAuthEnabled: true,
        isHelloEnabled: true
      } as never);
    });

    describe('when logged in', () => {
      beforeEach(() => {
        vi.mocked(authenticator.getUser).mockResolvedValue({} as never);
      });

      it('should redirect to /dashboard', async () => {
        const request = {} as never;
        await loader(request);
        expect(redirect).toHaveBeenCalledWith('/dashboard');
      });
    });

    describe('when not logged in', () => {
      beforeEach(() => {
        vi.mocked(authenticator.getUser).mockRejectedValue({} as never);
      });

      it('should render the login component', async () => {
        const comp = renderWithi18n(<Root />);
        expect(comp.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div>
            &lt;Hello /&gt;
            <div
              style="position: absolute; top: 0px; right: 0px;"
            >
              <div
                class="color-mode-toggle-container"
              />
            </div>
            <div
              class="centered-button"
            />
          </div>
        </DocumentFragment>
      `);
      });
    });
  });

  describe('when the hello feature is disabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockResolvedValue(false);
      vi.mocked(useLoaderData).mockReturnValue({ isHelloEnabled: false } as never);
    });

    it('should return false from the loader', async () => {
      const request = {} as never;
      const actual = await loader(request);
      expect(actual).toMatchInlineSnapshot(`
        {
          "isAuthEnabled": false,
          "isHelloEnabled": false,
        }
      `);
    });

    it('should render the goodbye component', async () => {
      const comp = renderWithi18n(<Root />);
      expect(comp.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div>
            microcopy.goodBye
          </div>
        </DocumentFragment>
      `);
    });
  });

  it('surfaces the links of the underlying components', () => {
    expect(links()).toMatchInlineSnapshot(`
      [
        "hello-links",
      ]
    `);
  });
});

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import { hasFeature } from '~/hooks/hasFeature';
import Root, { links, loader } from './index';

vi.mock('~/components/Hello', () => ({
  Hello: () => '<Hello />',
  links: () => ['hello-links']
}));
vi.mock('~/hooks/hasFeature');
vi.mock('@remix-run/react');
vi.mock('@remix-run/node');

describe('The index route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(json).mockImplementation((input) => input as never);
  });

  describe('when the hello feature is enabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockResolvedValueOnce(true);
      vi.mocked(useLoaderData).mockReturnValue({ isHelloEnabled: true } as never);
    });

    it('should return true from the loader', async () => {
      const request = {} as never;
      const actual = await loader(request);
      expect(actual).toMatchInlineSnapshot(`
        {
          "isAuthEnabled": true,
          "isHelloEnabled": undefined,
        }
      `);
    });

    it('should render the hello component', async () => {
      const comp = renderWithi18n(<Root />);
      expect(comp.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div>
            <hello />
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
      vi.mocked(useLoaderData).mockReturnValue({
        isAuthEnabled: true,
        isHelloEnabled: true
      } as never);
    });

    it('should render the login component', async () => {
      const comp = renderWithi18n(<Root />);
      expect(comp.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div>
            <hello />
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

  describe('when the hello feature is disabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockResolvedValueOnce(false);
      vi.mocked(hasFeature).mockResolvedValueOnce(false);
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

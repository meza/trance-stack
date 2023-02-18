import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hasFeature } from '~/hooks/hasFeature';
import Root, { links, loader } from './index';

vi.mock('~/components/Hello', () => ({
  Hello: 'Hello',
  links: () => ['hello-links']
}));
vi.mock('~/hooks/hasFeature');
vi.mock('@remix-run/react');
vi.mock('@remix-run/node');

describe('The root route', () => {
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
          "isHelloEnabled": true,
        }
      `);
    });

    it('should render the hello component', async () => {
      // eslint-disable-next-line new-cap
      expect(Root()).toMatchInlineSnapshot('<Hello />');
    });
  });

  describe('when the hello feature is disabled', () => {
    beforeEach(() => {
      vi.mocked(hasFeature).mockResolvedValueOnce(false);
      vi.mocked(useLoaderData).mockReturnValue({ isHelloEnabled: false } as never);
    });

    it('should return false from the loader', async () => {
      const request = {} as never;
      const actual = await loader(request);
      expect(actual).toMatchInlineSnapshot(`
        {
          "isHelloEnabled": false,
        }
      `);
    });

    it('should render the goodbye component', async () => {
      // eslint-disable-next-line new-cap
      expect(Root()).toMatchInlineSnapshot(`
        <div>
          Goodbye World!
        </div>
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

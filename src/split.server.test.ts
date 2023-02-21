import { SplitFactory } from '@splitsoftware/splitio/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@splitsoftware/splitio/server');

describe('The split client', () => {
  const originalEnv = structuredClone(process.env);
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/cwd/sub/directory');
    vi.resetModules();
  });

  afterEach(() => {
    process.env.SPLIT_SERVER_TOKEN = originalEnv.SPLIT_SERVER_TOKEN;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
    vi.resetAllMocks();
  });

  it('set the environments', async () => {
    process.env.SPLIT_SERVER_TOKEN = 'token';
    process.env.NODE_ENV = 'development';

    vi.mocked(SplitFactory).mockReturnValue({
      client: vi.fn().mockReturnValue('client-2')
    } as never);

    const client = (await import('./split.server')).default;

    const calls = vi.mocked(SplitFactory).mock.calls;

    expect(client).toEqual('client-2');
    expect(calls[0][0]).toMatchInlineSnapshot(`
      {
        "core": {
          "authorizationKey": "token",
        },
        "debug": false,
        "features": "/cwd/sub/devFeatures.yml",
      }
    `);
  });
});

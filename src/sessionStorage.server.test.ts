import { createCookieSessionStorage } from '@remix-run/node';
import { describe, vi, it, expect } from 'vitest';
import { getSessionStorage } from '~/sessionStorage.server';

vi.mock('@remix-run/node', () => {
  return {
    createCookieSessionStorage: vi.fn().mockReturnValue('mocked cookie')
  };
});

describe('The session storage', () => {
  it('return the configured one', () => {
    const actual = getSessionStorage();
    expect(actual).toEqual('mocked cookie');

    getSessionStorage(); //it only calls the mocked function once
    expect(createCookieSessionStorage).toHaveBeenCalledTimes(1);
  });
});

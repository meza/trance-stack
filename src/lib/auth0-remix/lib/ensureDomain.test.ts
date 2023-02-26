import { describe, it } from 'vitest';
import { ensureDomain } from './ensureDomainFormat';

describe('The domain format parser', () => {
  it.each([
    'domain.com',
    'https://domain.com',
    'http://domain.com',
    'https://domain.com/',
    'http://domain.com/'
  ])('should return the domain with https', (domain) => {
    expect(ensureDomain(domain)).toEqual('https://domain.com');
  });

  it('should throw an error if the domain is not defined', () => {
    expect(() => ensureDomain('')).toThrowError('Domain is not defined');
  });
});

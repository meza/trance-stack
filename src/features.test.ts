import { describe, it } from 'vitest';
import { Features } from '~/features';

describe('The feature flags', () => {
  it('should be untouched', () => {
    expect(Object.keys(Features)).toMatchInlineSnapshot(`
      [
        "HELLO",
      ]
    `);
    expect(Object.values(Features)).toMatchInlineSnapshot(`
      [
        "hello_split",
      ]
    `);
  });
});

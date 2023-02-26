import { describe, expect, it, vi } from 'vitest';
import { transformUserData } from '~/lib/auth0-remix/lib/transformUserData';
import type { Auth0UserProfile } from '~/lib/auth0-remix/Auth0RemixTypes';

describe('transformUserData', () => {
  it('should work', () => {
    const input = {
      name: 'John Doe',
      email: 'jd@example.com',
      // eslint-disable-next-line camelcase
      first_name: 'John',
      // eslint-disable-next-line camelcase
      last_name: 'Doe',
      // eslint-disable-next-line camelcase
      an_object: {
        // eslint-disable-next-line camelcase
        with_a_nested_object: {
          // eslint-disable-next-line camelcase
          and_a_nested_array: ['with', 'some', 'values']
        }
      }
    } as Auth0UserProfile;

    const expected = {
      name: 'John Doe',
      email: 'jd@example.com',
      firstName: 'John',
      lastName: 'Doe',
      anObject: {
        withANestedObject: {
          andANestedArray: ['with', 'some', 'values']
        }
      }
    };

    const actual = transformUserData(input);

    expect(actual).toEqual(expected);
  });
});

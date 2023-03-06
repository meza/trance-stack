import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '../../../testUtils';
import { Hello, links } from './index';

vi.mock('./hello.css', () => ({ default: 'hello.css' }));

describe('Hello component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render as expected', () => {
    renderWithi18n(<Hello/>);
    const component = screen.getByTestId('greeting');
    expect(component).toMatchInlineSnapshot(`
      <h1
        class="hello"
        data-testid="greeting"
      >
        microcopy.helloWorld
      </h1>
    `);
  });

  it('should link the correct stylesheets', () => {
    const sheets = links();
    expect(sheets).toMatchInlineSnapshot(`
      [
        {
          "href": "hello.css",
          "rel": "stylesheet",
        },
      ]
    `);
  });
});

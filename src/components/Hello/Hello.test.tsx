import { screen, cleanup } from '@testing-library/react';
import { vi, describe, expect, it, afterEach, beforeEach } from 'vitest';
import { renderWithi18n } from '@test';
import { Hello, links } from './Hello';

vi.mock('./hello.css', () => ({ default: 'hello.css' }));

describe('Hello component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render as expected', () => {
    renderWithi18n(<Hello/>);
    const component = screen.getByTestId('greeting');
    expect(component).toBeInTheDocument();
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

import { Form } from '@remix-run/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import ColorModeSwitcher, { ColorModeContext, ColorModeSensor } from './index';
import type { UserEvent } from '@testing-library/user-event/setup/setup';
import type { PropsWithChildren } from 'react';
import type { FormProps } from 'react-router-dom';
import { useContext } from 'react';

interface LocalTestContext {
  user: UserEvent;
}

vi.mock('@remix-run/react', () => ({
  Form: vi.fn()
}));

describe('index', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('The color mode switcher', () => {
    beforeEach<LocalTestContext>((context) => {
      context.user = userEvent.setup();
    });

    it<LocalTestContext>('should change the color mode', async ({ user }) => {
      // eslint-disable-next-line max-nested-callbacks
      vi.mocked(Form).mockImplementation(({ children, ...props }: PropsWithChildren<FormProps>) => {
        const newProps = {
          ...props
        };
        delete newProps.replace; // have to take this out, thanks dom.

        expect(props).toContain({ replace: true });

        return <form {...newProps}>{children}</form>;
      });
      const component = renderWithi18n(<ColorModeSwitcher />);
      expect(component.asFragment()).toMatchSnapshot();

      const button = component.getByRole('button');
      const handler = button.onclick;
    });
  });

  describe('The color mode sensor', () =>{
    it('should render the correct script', () => {
      const nonce = 'example-nonce';
      const component = render(<ColorModeSensor nonce={nonce} />);
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});

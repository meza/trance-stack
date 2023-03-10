import { Form } from '@remix-run/react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import ColorModeSwitcher, { ColorMode, ColorModeContext, ColorModeSensor } from './index';
import type { UserEvent } from '@testing-library/user-event/setup/setup';
import type { FormEvent, PropsWithChildren, ReactElement } from 'react';
import type { FormProps } from 'react-router-dom';

interface LocalTestContext {
  user: UserEvent;
}

vi.mock('@remix-run/react', async () => {
  const actual = (await vi.importActual('@remix-run/react')) as object;
  return {
    ...actual,
    Form: vi.fn()
  };
});

describe('The Color Mode Switch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('The color mode switcher', () => {
    beforeEach<LocalTestContext>((context) => {
      context.user = userEvent.setup();

      vi.mocked(Form).mockImplementation(({ children, ...props }: PropsWithChildren<FormProps>) => {
        const newProps = {
          ...props,
          onSubmit: (e: FormEvent) => {
            e.preventDefault();
          }
        };
        delete newProps.replace; // have to take this out, thanks dom.

        expect(props).toContain({ replace: true });

        return <form {...newProps}>{children}</form>;
      });
    });

    it('should configure the form correctly', () => {
      const component = renderWithi18n(<ColorModeSwitcher/>);
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('should use the correct mode based on the html tag', () => {
      const ColorWrapper = ({ children, color }: PropsWithChildren<{ color: string }>) => {
        document.firstElementChild?.classList.add(color);
        return <>{children}</>;
      };

      const themeRender = (ui: ReactElement, color: 'dark' | 'light') => {
        return renderWithi18n(ui, {
          wrapper: ({ children }) => <ColorWrapper color={color}>{children}</ColorWrapper>
        });
      };

      const lightComponent = themeRender(<ColorModeSwitcher/>, 'light');
      const inputLight = lightComponent.container.querySelector('input[name="colorMode"]') as HTMLInputElement;
      expect(inputLight.value).toEqual(ColorMode.DARK);

      const darkComponent = themeRender(<ColorModeSwitcher/>, 'dark');
      const inputDark = darkComponent.container.querySelector('input[name="colorMode"]') as HTMLInputElement;
      expect(inputDark.value).toEqual(ColorMode.LIGHT);
    });

    it<LocalTestContext>('should change the color mode', async ({ user }) => {
      let colorMode = ColorMode.LIGHT;
      const setColorModeCallback = vi.fn().mockImplementation((newColorMode: ColorMode) => {
        colorMode = newColorMode;
        return newColorMode;
      });
      const component = renderWithi18n(
        <ColorModeContext.Provider value={{ colorMode: colorMode, setColorMode: setColorModeCallback }}>
          <ColorModeSwitcher/>
        </ColorModeContext.Provider>
      );

      const input = component.container.querySelector('input[name="colorMode"]') as HTMLInputElement;
      expect(input.value).toEqual(ColorMode.DARK);
      fireEvent.click(component.getByRole('button'));

      component.rerender(<ColorModeContext.Provider value={{ colorMode: colorMode, setColorMode: setColorModeCallback }}>
        <ColorModeSwitcher/>
      </ColorModeContext.Provider>);

      const input2 = component.container.querySelector('input[name="colorMode"]') as HTMLInputElement;
      expect(input2.value).toEqual(ColorMode.LIGHT);

      fireEvent.click(component.getByRole('button'));

      component.rerender(<ColorModeContext.Provider value={{ colorMode: colorMode, setColorMode: setColorModeCallback }}>
        <ColorModeSwitcher/>
      </ColorModeContext.Provider>);

      const input3 = component.container.querySelector('input[name="colorMode"]') as HTMLInputElement;
      expect(input3.value).toEqual(ColorMode.DARK);

      expect(setColorModeCallback).toHaveBeenCalledTimes(2);
      expect(setColorModeCallback).toHaveBeenNthCalledWith(1, ColorMode.DARK);
      expect(setColorModeCallback).toHaveBeenNthCalledWith(2, ColorMode.LIGHT);

    });
  });

  describe('The color mode sensor', () => {
    it('should render the correct script', () => {
      const nonce = 'example-nonce';
      const component = render(<ColorModeSensor nonce={nonce}/>);
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});

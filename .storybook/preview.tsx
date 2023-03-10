import i18n from '../testUtils/i18nextForStorybook';
import React, { useEffect } from 'react';
import { ColorMode, ColorModeContext } from '~/components/ColorModeSwitcher';
import { StoryContext, StoryFn } from '@storybook/react';
import '../src/styles/app.css';
import './storybook.css';
import { I18nextProvider } from 'react-i18next';
import theme from './theme';
import { useGlobals } from '@storybook/addons';
import { createRemixStub } from '@remix-run/testing/dist/create-remix-stub';

const createRemixStoryDecorator = (Story: StoryFn) => {
  const RemixStub = createRemixStub([
    {
      path: '/*',
      element: <Story/>,
      action: () => ({ redirect: '/' }),
      loader: () => ({ redirect: '/' })
    }
  ]);
  return <RemixStub/>;
};

const withAllTheThings = (Story: StoryFn, context: StoryContext) => {
  const [globals, updateGlobals] = useGlobals();
  const colorMode = globals.colorMode || ColorMode.LIGHT;

  const setStoryColorMode = (mode: ColorMode, force = true) => {
    const cl = document.firstElementChild?.classList;
    document.firstElementChild.classList.remove(ColorMode.LIGHT, ColorMode.DARK);
    if (cl) {
      cl.remove(ColorMode.LIGHT, ColorMode.DARK);
      cl.add(mode);
      if (force) {
        updateGlobals({ colorMode: mode });
      }
    }
  };

  const RemixStub = createRemixStub([
    {
      path: '/*',
      element: <Story/>,
      action: () => ({ redirect: '/' }),
      loader: () => ({ redirect: '/' })
    }
  ]);

  useEffect(() => {
    setStoryColorMode(colorMode, false);
  }, [colorMode]);

  return (
    <I18nextProvider i18n={i18n}>
      <ColorModeContext.Provider
        value={{
          colorMode: colorMode,
          setColorMode: setStoryColorMode
        }}>
        <RemixStub/>
      </ColorModeContext.Provider>
    </I18nextProvider>
  );
};

export const decorators = [
  withAllTheThings
];

/** @type { import('@storybook/react').Preview } */
export const parameters = {
  docs: {
    theme: theme,
    canvas: {
      background: false,
      className: 'storybook-canvas'
    },
    story: {
      inline: true
    }
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  dependencies: {
    // display only dependencies/dependents that have a story in storybook
    // by default this is false
    withStoriesOnly: true,

    // completely hide a dependency/dependents block if it has no elements
    // by default this is false
    hideEmpty: true
  },
  backgrounds: { disable: true },
  locale: 'en',
  locales: {
    en: 'English'
  }
};

export const globalTypes = {
  colorMode: {
    name: 'ColorMode',
    description: 'Color Mode',
    defaultValue: 'dark',
    toolbar: {
      items: [
        { value: 'dark', title: 'Dark', icon: 'moon' },
        { value: 'light', title: 'Light', icon: 'sun' }
      ],
      showName: true,
      dynamicTitle: true
    }
  }
};



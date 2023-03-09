import i18n from '../testUtils/i18nextForStorybook';
import React, { useEffect } from 'react';
import { ColorMode } from '~/components/ColorModeSwitcher';
import { StoryContext, StoryFn } from '@storybook/react';
import '../src/styles/app.css';
import './storybook.css';
import { I18nextProvider } from 'react-i18next';
import theme from './theme';

const withAllTheThings = (Story: StoryFn, context: StoryContext) => {
  const { colorMode } = context.globals;

  const setMode = (mode: ColorMode) => {
    const cl = document.firstElementChild?.classList;
    document.body.classList.remove(ColorMode.LIGHT, ColorMode.DARK);
    if (cl) {
      cl.remove(ColorMode.LIGHT, ColorMode.DARK);
      cl.add(mode);
    }
  };

  useEffect(() => {
    setMode(colorMode);
  }, [colorMode]);

  return (
    <I18nextProvider i18n={i18n}>
      <Story/>
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



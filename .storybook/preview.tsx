import { themes } from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.dark,
  },
  backgrounds: { disable: true },
  //i18n,
  locale: 'en',
  locales: {
    en: 'English',
    fr: 'Français',
    es: 'Español',
  }
};

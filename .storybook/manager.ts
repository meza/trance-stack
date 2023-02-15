import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Storybook',
  brandUrl: 'https://storybook.com',
  brandImage: 'https://placehold.it/350x150',
  brandTarget: '_self',
  colorPrimary: '#ED117D',
});

addons.setConfig({
  theme: theme,
});

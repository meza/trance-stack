import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'dark',
  brandTitle: 'Storybook',
  brandUrl: 'https://storybook.com',
  brandImage: 'https://placekitten.com/350/100',
  brandTarget: '_self',
  colorPrimary: '#ED117D',
});

addons.setConfig({
  theme: theme,
});

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { DefinePlugin } from 'webpack';
import type { StorybookConfig } from '@storybook/react/types';

const storybookConfig: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    'storybook-react-i18next',
    '@storybook/addon-essentials',
    // 'storybook-addon-themes', // ignore until we figure out proper theme switching
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    }
  ],
  core: {
    builder: 'webpack5',
    disableTelemetry: true,
  },
  features: {
    emotionAlias: false,
    buildStoriesJson: true,
  },
  framework: '@storybook/react',
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true,
  },
  webpackFinal: async (config) => {
    config.plugins?.push(
      new DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      }),
    );

    if (config.resolve) {
      config.resolve.plugins = config.resolve.plugins || [];
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    }

    return config;
  }
};

export default storybookConfig;

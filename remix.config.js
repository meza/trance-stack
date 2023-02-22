const { withEsbuildOverride } = require('remix-esbuild-override');
const { environmentPlugin } = require('esbuild-plugin-environment');
const env = require('esbuild-plugin-env');


/**
 * Define callbacks for the arguments of withEsbuildOverride.
 * @param option - Default configuration values defined by the remix compiler
 * @param isServer - True for server compilation, false for browser compilation
 * @param isDev - True during development.
 * @return {EsbuildOption} - You must return the updated option
 */
withEsbuildOverride((option /* { isServer, isDev } */) => {
  option.plugins = [
    env(),
    environmentPlugin(['NODE_ENV',
      'HOTJAR_ID',
      'SPLIT_SERVER_TOKEN',
      'SPLIT_CLIENT_TOKEN',
      'MIXPANEL_API',
      'MIXPANEL_TOKEN',
      'SESSION_SECRET',
      'COOKIEYES_TOKEN',
      'AUTH0_DOMAIN',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'APP_DOMAIN',
      'I18N_DEBUG',
      'SPLIT_DEBUG']),
    ...option.plugins
  ]
  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstable_postcss: true
  },
  serverMinify: true,
  serverBuildTarget: 'arc',
  server: './server.js',
  ignoredRouteFiles: ['**/.*', '*.test.tsx'],
  appDirectory: 'src'
  // assetsBuildDirectory: "dist",
  // serverBuildPath: "server/index.js",
  // publicPath: "/_static/build/",
};

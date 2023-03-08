const { withEsbuildOverride } = require('remix-esbuild-override');
const { environmentPlugin } = require('esbuild-plugin-environment');
const env = require('esbuild-plugin-env');
const fs = require('node:fs');
const copyFilesPlugin = require('esbuild-copy-static-files');


/**
 * Define callbacks for the arguments of withEsbuildOverride.
 * @param option - Default configuration values defined by the remix compiler
 * @param isServer - True for server compilation, false for browser compilation
 * @param isDev - True during development.
 * @return {EsbuildOption} - You must return the updated option
 */
withEsbuildOverride((option /* { isServer, isDev } */) => {

  const doNotBundleEnv = [
    'APP_DOMAIN' // deny list for the environmentPlugin
  ]

  const envFile = fs.readFileSync('./.env.example', 'utf-8');
  const envFileLines = envFile.split('\n');
  const envFileKeys = envFileLines.map(line => line.split('=')[0]);
  const keysToBundle = envFileKeys.filter(key => !doNotBundleEnv.includes(key)).filter(key => key !== '');

  option.plugins = [
    copyFilesPlugin({
      src: './public/locales',
      dest: './public/build/locales',
      errorOnExist: false
    }),
    copyFilesPlugin({
      src: './public/favicon.ico',
      dest: './public/build/favicon.ico',
      errorOnExist: false
    }),
    env(),
    environmentPlugin(keysToBundle),
    ...option.plugins
  ]
  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstable_postcss: true
  },
  server: './server.js',
  serverMinify: true,
  ignoredRouteFiles: ['**/__snapshots__/**', '**/.*', '**/*.test.tsx', '**/*.test.ts'],
  appDirectory: 'src',
  serverBuildDirectory: "server",
  browserBuildDirectory: "public/build",
  serverBuildPath: "server/index.js",
  publicPath: "/_static/build",
};

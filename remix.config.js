const { withEsbuildOverride } = require('remix-esbuild-override');
const copyStaticFiles = require('esbuild-copy-static-files');

/**
 * Define callbacks for the arguments of withEsbuildOverride.
 * @param option - Default configuration values defined by the remix compiler
 * @param isServer - True for server compilation, false for browser compilation
 * @param isDev - True during development.
 * @return {EsbuildOption} - You must return the updated option
 */
withEsbuildOverride((option, { isServer, isDev }) => {
  // update the option
  option.plugins = [copyStaticFiles({
    src: './src/static',
    dest: './dist/static',
    dereference: true,
    errorOnExist: false,
    preserveTimestamps: true,
    recursive: true
  }), ...option.plugins];

  return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // ignoredRouteFiles: ['**/.*'],
  appDirectory: 'src',
  assetsBuildDirectory: 'dist/static/assets',
  serverBuildPath: 'dist/server/index.js',
  publicPath: `${process.env.STATIC_PATH ?? '/_static'}/assets/`,
  server: './server.ts',
  serverBuildTarget: 'arc'
};

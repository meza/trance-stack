/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // ignoredRouteFiles: ['**/.*'],
  appDirectory: 'src',
  assetsBuildDirectory: 'dist/static/assets',
  serverBuildPath: 'dist/server/index.js',
  publicPath: `${process.env.STATIC_PATH ?? ''}/assets/`,
  server: './server.ts'
};

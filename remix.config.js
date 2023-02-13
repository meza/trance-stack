/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "arc",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "src",
  // assetsBuildDirectory: "dist",
  // serverBuildPath: "server/index.js",
  // publicPath: "/_static/build/",
};

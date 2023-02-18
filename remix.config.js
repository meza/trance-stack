/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstable_postcss: true
  },
  serverBuildTarget: "arc",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*", "*.test.tsx"],
  appDirectory: "src"
  // assetsBuildDirectory: "dist",
  // serverBuildPath: "server/index.js",
  // publicPath: "/_static/build/",
};

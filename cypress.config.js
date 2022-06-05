const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents: function (on, config) {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? '3000' : '8811');

      config.baseUrl = `http://localhost:${port}`;
      config.video = !process.env.CI;
      config.screenshotOnRunFailure = !process.env.CI;

      return config;
    }
  }
});

const packageJson = require('./package.json');

module.exports = (cfg) => {
  const dev = cfg.env === 'development';
  return {
    map: dev ? { inline: false }:false,
    plugins: {
      'postcss-advanced-variables': {},
      'postcss-sorting': {},
      'postcss-preset-env': {
        stage: 0
      },
      'colorguard': {},
      'doiuse': {
        browsers: dev ? packageJson.browserslist.development : packageJson.browserslist.production,
        ignoreFiles: [
          '**/node_modules/**/*'
        ]
      },
      'autoprefixer': {
        grid: true
      },
      'cssnano': dev ? false : {},
      'stylelint': {
        configFile: '.stylelintrc.json',
      },
      'postcss-reporter': {},
      'postcss-custom-media': {},
    }
  };
};

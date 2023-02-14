const packageJson = require('./package.json');

module.exports = (cfg) => {
  const dev = cfg.env === 'development';
  return {
    map: dev ? { inline: false }:false,
    plugins: {
      'postcss-advanced-variables': {},
      'postcss-nested': {},
      'postcss-mixins': {},
      'postcss-sorting': {},
      'postcss-preset-env': {},
      'colorguard': {},
      'doiuse': {
        browsers: dev ? packageJson.browserslist.development : packageJson.browserslist.production,
        ignoreFiles: [
          '**/sanitize.css',
          '**/sanitize.css/**'
        ]
      },
      'autoprefixer': {
        grid: true
      },
      'cssnano': dev ? false : {},
      'stylelint': {},
      'postcss-reporter': {}
    }
  };
};

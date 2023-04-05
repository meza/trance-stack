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
      'autoprefixer': {
        grid: true
      },
      'cssnano': dev ? false : {},
      'postcss-reporter': {},
      'postcss-custom-media': {},
    }
  };
};

/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    'tailored-tunes',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node'
  ]
};

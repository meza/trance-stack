/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    commonjs: false,
    es6: true,
    node: true
  },
  extends: [
    'tailored-tunes',
    'plugin:json/recommended',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node'
  ],
  overrides: [
    {
      files: [
        '**/*.test.ts',
        'test/**/*.ts'
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-use-before-define': 'off',
        'max-nested-callbacks': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    project: './tsconfig.json'
  },
  plugins: [
    'json',
    '@typescript-eslint'
  ],
  root: true,
  rules: {
    'no-continue': 'off',
    'dot-notation': 'error',
    '@typescript-eslint/dot-notation': 'error',
    'no-console': 'off',
    'no-warning-comments': 'warn',
    'no-unused-vars': 'off',
    'security/detect-object-injection': 0,
    'security/detect-non-literal-fs-filename': 0,
    'no-underscore-dangle': [
      'error',
      {
        'allow': [
          '__dirname',
          '__filename'
        ]
      }
    ]
  }
};

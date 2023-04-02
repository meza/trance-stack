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
    '@remix-run/eslint-config/node',
    'plugin:i18next/recommended',
    'plugin:sonarjs/recommended'
  ],
  overrides: [
    {
      files: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'test/**/*.ts',
        'test/**/*.tsx'
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-use-before-define': 'off',
        'max-nested-callbacks': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    },
    project: ['./tsconfig.json', './.storybook/tsconfig.json']
  },
  settings: {
    jest: {
      version: 28
    }
  },
  plugins: [
    'i18next',
    'json',
    '@typescript-eslint',
    'sonarjs'
  ],
  root: true,
  rules: {
    'import/order': [
      2,
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc'
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type'
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['type']
      }
    ],
    'jsx-quotes': [ 'error', 'prefer-single' ],
    'sonarjs/no-duplicate-string': 'off',
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

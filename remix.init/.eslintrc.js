module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'tailored-tunes',
    'plugin:json/recommended',
    'plugin:security/recommended'
  ],
  plugins: [
    'json',
    'import'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
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
    'no-continue': 'off',
    'dot-notation': 'error',
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

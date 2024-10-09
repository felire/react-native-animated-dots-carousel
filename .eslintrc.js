module.exports = {
  root: true,
  plugins: ['jest', '@typescript-eslint', 'import'],
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    // TODO: Change to 'error' when we fix the warnings
    '@typescript-eslint/no-magic-numbers': 'off',
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-console': 'error',
    'comma-dangle': 'off',
    'no-shadow': 'off',
    'max-params': ['error', 3],
    'react-native/no-color-literals': 'off',
    'react-native/no-inline-styles': 'off',
    'require-await': 'error',
    'no-bitwise': 'off',
    'import/no-named-as-default': 'error',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        'alphabetize': { order: 'ignore', caseInsensitive: true },
        'groups': [
          ['builtin', 'external', 'type', 'internal'],
          'parent',
          ['sibling', 'index'],
        ],
        'distinctGroup': false,
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: '@babel/eslint-parser',
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['app/**/styles.js', 'app/**/styles.ts'],
      rules: {
        'react-native/sort-styles': [
          'error',
          'asc',
          { ignoreClassNames: true },
        ],
        '@typescript-eslint/no-magic-numbers': 'off',
      },
    },
  ],
  settings: {
    'import/ignore': ['node_modules'],
    'import/resolver': {
      node: {
        paths: ['app'],
        settings: {
          'import/resolver': {
            node: {
              paths: ['app'],
              extensions: [
                '.ios.js',
                '.android.js',
                '.ts',
                '.tsx',
                '.js',
                '.jsx',
                '.json',
              ],
            },
          },
        },
      },
    },
  },
};

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('eslint').Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  },
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'standard-with-typescript'],
  ignorePatterns: [
    '**/*.mjs',
    'next-env.d.ts',
    'src/graphql/',
    'prebuilt/'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'array-bracket-spacing': 'error',
    'no-lonely-if': 'warn',
    'arrow-parens': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'max-len': 'off',
    'quote-props': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/method-signature-style': 'off'
  }
}

module.exports = config

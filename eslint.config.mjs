import { config } from 'eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
})

// SEE: https://github.com/oven-sh/bun/issues/17130
// @ts-expect-error -- No bun types
const next = typeof Bun === 'undefined'
  ? compat.config({
    ignorePatterns: ['src/graphql'],
    extends: ['next/core-web-vitals', 'next/typescript']
  })
  : []

export default [
  ...next,
  ...config()
]

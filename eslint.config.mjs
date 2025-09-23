import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    extends: compat.extends(
      'plugin:prettier/recommended',
    ),

    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          organizeImportsSkipDestructiveCodeActions: true,
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          printWidth: 120,
          bracketSameLine: true,
          arrowParens: 'always',
        },
        {
          usePrettierrc: false,
        },
      ],
    },

  },
  globalIgnores(["node_modules/", "dist/", "generated/"]),
])

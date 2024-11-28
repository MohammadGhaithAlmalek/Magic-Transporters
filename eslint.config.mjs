import { ESLintConfig } from '@typescript-eslint/eslint-plugin';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Apply JS/TS configurations
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        node: true, // Enable Node.js globals
      },
      parser: '@typescript-eslint/parser', // Specify the parser
    },
  },

  // Apply recommended JS rules
  pluginJs.configs.recommended, 

  // Apply recommended TypeScript rules manually (no 'extends')
  {
    plugins: {
      '@typescript-eslint': tseslint, // Add the TypeScript plugin
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
];

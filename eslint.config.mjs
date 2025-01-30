import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flatCompat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default [
  ...flatCompat.extends('eslint:recommended'),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  ...fixupConfigRules(flatCompat.extends(
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  )).map(config => ({
      ...config,
      files: ['**/*.{js,jsx,ts,tsx}']
    })
  ),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/resolver': {
        typescript: {},
      },
    },
  },

  ...fixupConfigRules(flatCompat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  )).map(config => ({
      ...config,
      files: ['**/*.{ts,tsx}']
    })
  ),

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      parser: typescriptParser,
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    files: ['**/.eslintrc.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
];

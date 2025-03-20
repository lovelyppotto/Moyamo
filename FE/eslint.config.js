import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 설정 (ESM에서는 __dirname이 기본으로 제공되지 않음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 호환성 도구 설정
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // 기본 ESLint 권장 규칙
  js.configs.recommended,

  // 레거시 설정
  ...compat.extends(
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),

  // 추가 설정
  {
    settings: {
      react: {
        // eslint-plugin-react 에서 사용하는 react 버전 명시
        version: 'detect',
      },
    },
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        // tsconfig.json 파일 대신 tsconfig.app.json 직접 참조
        project: './tsconfig.app.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-var': 'warn',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      // 'import/prefer-default-export': 'off',
      'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
      // 'react/jsx-props-no-spreading': 'off',
      // 'react/require-default-props': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

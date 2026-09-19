import playwright from 'eslint-plugin-playwright';

export default [
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.js', 'pages/**/*.js', 'utils/**/*.js', 'config/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-skipped-test': 'off',
      'playwright/valid-title': 'off',
      'playwright/consistent-spacing-between-blocks': 'off',
      'playwright/no-wait-for-timeout': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
    },
  },
];

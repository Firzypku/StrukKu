module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'node_modules',
    'playwright-report',
    'test-results',
    'test-supabase.js',
    'scripts/**',
    'tests/**',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: '18.2' },
  },
  plugins: ['react-refresh'],
  rules: {
    'no-unused-vars': 'off',
    'react-refresh/only-export-components': 'off',
    'no-undef': 'error',
    'no-const-assign': 'error',
    'no-dupe-keys': 'error',
  },
};

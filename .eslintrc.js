module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    '@djthoms/eslint-config',
    '@djthoms/eslint-config/react',
    '@djthoms/eslint-config/typescript',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/camelcase': 'off',
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};

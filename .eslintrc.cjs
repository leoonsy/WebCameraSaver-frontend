module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  rules: {
    'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/vite.config.ts', '**/.eslintrc.cjs'],
      optionalDependencies: false,
    }],
    'import/prefer-default-export': 'off',
  },
};

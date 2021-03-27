module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true,
    jest: true,
  },
  extends: ['standard', 'standard-react', 'plugin:jsx-a11y/recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '16',
    },
  },
  plugins: ['jsx-a11y', 'react-hooks'],
  globals: {
    localStorage: true,
    fetch: true,
  },
  rules: {
    'space-before-function-paren': 0,
    'react/prop-types': 0,
    'react/jsx-handler-names': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'import/export': 0,
    'consistent-return': 1,
    strict: [1],
    'max-len': ['warn', 200],
    'no-underscore-dangle': [1],
    'no-console': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'no-unused-vars': 'error',
    'import/no-named-as-default': 0,
    'react-hooks/rules-of-hooks': 'error', // Vérifie les règles des Hooks
    'react-hooks/exhaustive-deps': 'warn', // Vérifie les tableaux de dépendances
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};

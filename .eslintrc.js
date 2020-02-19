module.exports = {
  extends: [
    'standard',
    'prettier',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:security/recommended',
  ],
  plugins: ['jest', 'cypress', 'security'],
  env: {
    'jest/globals': true,
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-require': 'off',
    'security/detect-non-literal-fs-filename': 'off',
  },
  overrides: [
    {
      files: ["routes/*/client.js", "assets/js/*.js"],
      settings: {
        "import/resolver": "webpack",
      },
    },

    {
      files: ["config/cypress.support.js", "routes/*/integration.js"],
      env: { "cypress/globals": true },
    }
  ],
}

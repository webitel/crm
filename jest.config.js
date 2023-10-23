module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: [
    // commented this after jest felt at icons sprite index.js import build from webitel-ui
    // '/node_modules/(?!webitel-sdk).+\\.js$',
    'jest-runner',
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  reporters: ['default', 'bamboo-jest-reporter'],
  collectCoverage: true,
  setupFiles: [
    './tests/config/config.js',
  ],
  testEnvironment: '@happy-dom/jest-environment',
  // setupFilesAfterEnv: ['./tests/config/jest.config.js'],
};

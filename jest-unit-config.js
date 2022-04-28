const config = require('./jest.config')

module.exports = {
  ...config,
  displayName: 'unit-tests',
  testMatch: ["<rootDir>/tests/unit/**/*.spec.ts"]
}

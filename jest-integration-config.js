const config = require("./jest.config");

module.exports = {
  ...config,
  displayName: "integration-tests",
  testMatch: ["<rootDir>/tests/integration/**/*.spec.ts"],
};

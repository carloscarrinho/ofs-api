const config = require("./jest.config");

module.exports = {
  ...config,
  displayName: "system-tests",
  testMatch: ["<rootDir>/tests/system/**/*.spec.ts"],
};

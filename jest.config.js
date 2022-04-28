module.exports = {
  roots: ['<rootDir>/tests'],
  preset: "ts-jest",
  rootDir: "./",
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  testPathIgnorePatterns: ["node_modules", "dist", "scripts"],
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
};

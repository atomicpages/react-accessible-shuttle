module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  modulePathIgnorePatterns: ['pkg/', 'resources/'],
  testPathIgnorePatterns: ['<rootDir>/src/index.ts', '<rootDir>/docs/*'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

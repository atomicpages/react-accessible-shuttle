export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  modulePathIgnorePatterns: ['pkg/', 'resources/'],
  testPathIgnorePatterns: ['<rootDir>/src/index.ts', '<rootDir>/docs/*'],
};

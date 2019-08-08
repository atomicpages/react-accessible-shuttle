module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'html', 'text-summary', 'lcov'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    modulePathIgnorePatterns: ['pkg/', 'resources/'],
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.test.json'
        }
    },
};

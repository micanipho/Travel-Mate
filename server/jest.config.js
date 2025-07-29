module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  // Handle async operations properly
  detectOpenHandles: false, // Disable to reduce noise
  forceExit: true,
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  // Prevent memory leaks
  maxWorkers: 1,
  // Force exit after tests
  verbose: false
};

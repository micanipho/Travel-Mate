// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DB_NAME = 'travel_mate_test';

// TODO: Add test database setup
// TODO: Add global test utilities
// TODO: Add test data cleanup functions

console.log('Test environment initialized');

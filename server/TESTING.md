# Testing with Supabase

This guide explains how to run tests with the Travel Mate application now that it uses Supabase.

## Overview

The test suite has been updated to support both:
- **Supabase** (recommended for development)
- **Local PostgreSQL** (legacy support)

## Quick Start

### Option 1: Testing with Supabase (Recommended)

1. **Create a separate Supabase project for testing** (recommended) or use a test schema
   - Go to https://supabase.com
   - Create a new project named `travel-mate-test`
   - Get the connection string

2. **Set up test environment**:
```bash
cd server

# Add to your .env or create .env.test
echo "TEST_DATABASE_URL=your_supabase_test_connection_string" >> .env
```

3. **Run migrations on test database**:
```bash
# Temporarily set DATABASE_URL to your test database
DATABASE_URL="your_test_connection_string" npm run db:migrate
```

4. **Run tests**:
```bash
npm test
```

### Option 2: Testing with Local PostgreSQL (Legacy)

If you have local PostgreSQL installed:

```bash
cd server

# Set up local test database credentials in .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password

# Run tests (will auto-create test database)
npm test
```

## Test Configuration

### Environment Variables

The test suite uses these environment variables:

```env
# For Supabase testing (recommended)
TEST_DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# For local PostgreSQL testing (legacy)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_mate_test
DB_USER=postgres
DB_PASSWORD=your_password

# JWT secret (auto-set for tests)
JWT_SECRET=test-jwt-secret-for-testing-only
```

### Test Database Setup

The test setup file (`tests/setup.js`) automatically:
- ✅ Detects Supabase vs local PostgreSQL
- ✅ Connects to the appropriate database
- ✅ Runs migrations (for local PostgreSQL)
- ✅ Cleans up test data after tests
- ✅ Handles connection pooling

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e         # End-to-end tests only

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/unit/user.test.js
```

## Test Structure

```
server/tests/
├── setup.js                      # Test configuration and utilities
├── unit/                         # Unit tests (no database)
│   ├── alert.test.js
│   ├── destination.test.js
│   └── user.test.js
├── integration/                  # Integration tests (with database)
│   ├── alert-api.test.js
│   ├── alert-endpoints.test.js
│   └── api.test.js
└── e2e/                         # End-to-end tests
    └── user-flow.test.js
```

## Using Supabase for CI/CD

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: |
          cd server
          npm install
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
        run: |
          cd server
          npm run db:migrate
      
      - name: Run tests
        env:
          TEST_DATABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
        run: |
          cd server
          npm test
```

### Setting up CI Secrets

1. Go to your repository Settings → Secrets
2. Add `SUPABASE_TEST_URL` with your test database connection string
3. Commit your workflow file

## Best Practices

### 1. Use a Separate Test Database

**Don't use your development database for tests!**

Create a dedicated test project in Supabase:
- Prevents accidental data loss
- Allows parallel test runs
- Isolates test data

### 2. Clean Up Test Data

The test suite automatically cleans up:
- Users with test email addresses
- Destinations with "test" in the name
- Alerts with "test" in the title

Manual cleanup (if needed):
```sql
-- Run in Supabase SQL Editor
DELETE FROM alerts WHERE title LIKE '%test%';
DELETE FROM monitored_destinations WHERE location LIKE '%test%';
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example.com';
```

### 3. Use Test Data Factories

The test utilities provide factories for creating test data:

```javascript
// In your tests
const testUser = global.testUtils.createTestUser({
  email: 'unique@test.com',
  firstName: 'Jane'
});

const testDestination = global.testUtils.createTestDestination({
  location: 'Cape Town Station',
  riskLevel: 2
});

const testAlert = global.testUtils.createTestAlert({
  title: 'Test High Priority Alert',
  priority: 'high'
});
```

### 4. Mock External Services

For unit tests, mock external dependencies:

```javascript
jest.mock('../services/EmailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));
```

## Troubleshooting

### Tests Failing to Connect

**Problem**: `Failed to connect to Supabase`

**Solution**:
- Verify `TEST_DATABASE_URL` is set correctly
- Check your Supabase project is active
- Ensure connection string includes password
- Test connection manually: `psql "your_connection_string" -c "SELECT 1;"`

### Migration Errors in Tests

**Problem**: `relation "users" does not exist`

**Solution**:
```bash
# Run migrations on your test database
DATABASE_URL="your_test_connection_string" npm run db:migrate
```

### Timeout Errors

**Problem**: Tests timeout connecting to Supabase

**Solution**:
- Increase timeout in test setup (already set to 30s)
- Check your internet connection
- Try using direct connection instead of pooler

### Connection Pool Exhausted

**Problem**: `too many connections`

**Solution**:
- The test config uses max 5 connections
- Ensure tests properly close connections
- Use the cleanup utilities in `afterAll` blocks

### Tests Pass Locally but Fail in CI

**Checklist**:
- [ ] `SUPABASE_TEST_URL` secret is set in CI
- [ ] Migrations run before tests in CI
- [ ] Node version matches local (v22+)
- [ ] Dependencies are installed
- [ ] Environment variables are properly set

## Test Coverage

Check test coverage:

```bash
npm run test:coverage
```

Current coverage targets:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Writing New Tests

### Unit Test Example

```javascript
// tests/unit/my-feature.test.js
describe('MyFeature', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Integration Test Example

```javascript
// tests/integration/my-api.test.js
const request = require('supertest');
const app = require('../../server');

describe('GET /api/my-endpoint', () => {
  it('should return data', async () => {
    const response = await request(app)
      .get('/api/my-endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

## Performance Tips

### Speed Up Tests

1. **Use connection pooling** (already configured)
2. **Run tests in parallel** (Jest default)
3. **Skip integration tests during development**:
   ```bash
   npm run test:unit  # Fast unit tests only
   ```
4. **Use test database close to your region**

### Reduce API Calls

- Mock external services
- Use test data factories
- Reuse database connections

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Supabase Testing Guide](https://supabase.com/docs/guides/getting-started/local-development)

## Support

If tests are failing:
1. Check this guide's troubleshooting section
2. Review test logs for specific errors
3. Verify your Supabase connection
4. Check [GitHub Issues](https://github.com/your-org/travel-mate/issues)

---

**Happy Testing!** 🧪


/**
 * Profile Management Endpoints Test Suite
 * 
 * Comprehensive tests for all Profile Management endpoints
 * Run with: npm test tests/profile_endpoints.test.js
 */

const request = require('supertest');
const app = require('../server/app'); // Adjust path as needed
const User = require('../server/models/User');

describe('Profile Management Endpoints', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test user and get auth token
    testUser = await User.create({
      email: 'test.profile@example.com',
      password: 'TestPassword123',
      firstName: 'Test',
      lastName: 'User',
      notificationEnabled: true,
      preferredLanguage: 'en'
    });

    // Login to get token (adjust based on your auth implementation)
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test.profile@example.com',
        password: 'TestPassword123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup test user
    if (testUser) {
      await User.delete(testUser.id);
    }
  });

  describe('GET /api/users/profile', () => {
    test('should return user profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile retrieved successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', 'test.profile@example.com');
      expect(response.body.user).toHaveProperty('firstName', 'Test');
      expect(response.body.user).toHaveProperty('lastName', 'User');
      expect(response.body.user).toHaveProperty('notificationEnabled', true);
      expect(response.body.user).toHaveProperty('preferredLanguage', 'en');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('PUT /api/users/profile', () => {
    test('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        notificationEnabled: false,
        preferredLanguage: 'af'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toHaveProperty('firstName', 'Updated');
      expect(response.body.user).toHaveProperty('lastName', 'Name');
      expect(response.body.user).toHaveProperty('notificationEnabled', false);
      expect(response.body.user).toHaveProperty('preferredLanguage', 'af');
    });

    test('should update email successfully', async () => {
      const updateData = {
        email: 'updated.email@example.com'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.user).toHaveProperty('email', 'updated.email@example.com');
    });

    test('should reject invalid email format', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    test('should reject invalid language preference', async () => {
      const updateData = {
        preferredLanguage: 'invalid'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    test('should reject duplicate email', async () => {
      // Create another user first
      const anotherUser = await User.create({
        email: 'another@example.com',
        password: 'Password123',
        firstName: 'Another',
        lastName: 'User'
      });

      const updateData = {
        email: 'another@example.com'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Email already exists');

      // Cleanup
      await User.delete(anotherUser.id);
    });

    test('should handle partial updates', async () => {
      const updateData = {
        firstName: 'PartialUpdate'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.user).toHaveProperty('firstName', 'PartialUpdate');
      // Other fields should remain unchanged
      expect(response.body.user).toHaveProperty('lastName', 'Name');
    });
  });

  describe('PUT /api/users/password', () => {
    test('should update password successfully', async () => {
      const passwordData = {
        currentPassword: 'TestPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Password updated successfully');
    });

    test('should reject incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword789',
        confirmPassword: 'NewPassword789'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid password');
    });

    test('should reject weak new password', async () => {
      const passwordData = {
        currentPassword: 'NewPassword456', // Updated from previous test
        newPassword: 'weak',
        confirmPassword: 'weak'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    test('should reject mismatched password confirmation', async () => {
      const passwordData = {
        currentPassword: 'NewPassword456',
        newPassword: 'AnotherPassword789',
        confirmPassword: 'DifferentPassword789'
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    test('should require all password fields', async () => {
      const passwordData = {
        currentPassword: 'NewPassword456',
        newPassword: 'FinalPassword123'
        // Missing confirmPassword
      };

      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('Authentication and Authorization', () => {
    test('all endpoints should require authentication', async () => {
      // Test all endpoints without token
      await request(app).get('/api/users/profile').expect(401);
      await request(app).put('/api/users/profile').send({}).expect(401);
      await request(app).put('/api/users/password').send({}).expect(401);
    });

    test('all endpoints should reject invalid tokens', async () => {
      const invalidToken = 'Bearer invalid.jwt.token';
      
      await request(app)
        .get('/api/users/profile')
        .set('Authorization', invalidToken)
        .expect(401);
        
      await request(app)
        .put('/api/users/profile')
        .set('Authorization', invalidToken)
        .send({})
        .expect(401);
        
      await request(app)
        .put('/api/users/password')
        .set('Authorization', invalidToken)
        .send({})
        .expect(401);
    });
  });

  describe('User Preferences', () => {
    test('should support all language preferences', async () => {
      const languages = ['en', 'af', 'zu', 'xh'];
      
      for (const lang of languages) {
        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ preferredLanguage: lang })
          .expect(200);
          
        expect(response.body.user).toHaveProperty('preferredLanguage', lang);
      }
    });

    test('should toggle notification preferences', async () => {
      // Enable notifications
      let response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notificationEnabled: true })
        .expect(200);
        
      expect(response.body.user).toHaveProperty('notificationEnabled', true);

      // Disable notifications
      response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notificationEnabled: false })
        .expect(200);
        
      expect(response.body.user).toHaveProperty('notificationEnabled', false);
    });
  });
});

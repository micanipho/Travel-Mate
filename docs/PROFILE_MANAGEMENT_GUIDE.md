# Profile Management Implementation Guide

## Overview

This guide provides comprehensive implementation details for the Profile Management system in the Travel-Mate application. The system consists of 4 main endpoints for user profile operations and preferences management.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Endpoints](#endpoints)
  - [GET /api/users/profile](#get-apiusersprofile)
  - [PUT /api/users/profile](#put-apiusersprofile)
  - [PUT /api/users/password](#put-apiuserspassword)
  - [User Preferences](#user-preferences)
- [Implementation Details](#implementation-details)
- [Security Considerations](#security-considerations)
- [Testing Strategy](#testing-strategy)
- [Error Handling](#error-handling)

## Architecture Overview

The Profile Management system follows the existing MVC pattern:

```
Routes (users.js) → Middleware (auth, validation) → Controllers (UserController.js) → Models (User.js) → Database
```

### Current Status
- ✅ **Routes**: Defined in `/server/routes/users.js`
- ✅ **Models**: Implemented in `/server/models/User.js`
- ✅ **Middleware**: Authentication and validation ready
- ✅ **Database**: Schema and migrations complete
- ❌ **Controllers**: Methods need implementation (stubbed)

## Endpoints

### GET /api/users/profile

**Purpose**: Retrieve current authenticated user's profile information

**Authentication**: Required (JWT token)

**Request**:
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "notificationEnabled": true,
    "preferredLanguage": "en",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `401` - Unauthorized (invalid/missing token)
- `404` - User not found
- `500` - Internal server error

### PUT /api/users/profile

**Purpose**: Update user profile information and preferences

**Authentication**: Required (JWT token)

**Validation**: All fields optional, validated when provided

**Request**:
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "notificationEnabled": false,
  "preferredLanguage": "af"
}
```

**Validation Rules**:
- `firstName`: 2-50 characters, trimmed
- `lastName`: 2-50 characters, trimmed
- `email`: Valid email format, must be unique
- `notificationEnabled`: Boolean value
- `preferredLanguage`: One of ['en', 'af', 'zu', 'xh']

**Response**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "john.smith@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "notificationEnabled": false,
    "preferredLanguage": "af",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

**Error Responses**:
- `400` - Validation errors
- `401` - Unauthorized
- `409` - Email already exists
- `500` - Internal server error

### PUT /api/users/password

**Purpose**: Change user password securely

**Authentication**: Required (JWT token)

**Request**:
```http
PUT /api/users/password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Validation Rules**:
- `currentPassword`: Required, must match existing password
- `newPassword`: Minimum 8 characters, must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
- `confirmPassword`: Must match `newPassword`

**Response**:
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses**:
- `400` - Validation errors or incorrect current password
- `401` - Unauthorized
- `404` - User not found
- `500` - Internal server error

### User Preferences

User preferences are integrated into the profile system:

#### Notification Settings
- **Field**: `notificationEnabled`
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: Controls whether user receives system notifications

#### Language Preferences
- **Field**: `preferredLanguage`
- **Type**: String (enum)
- **Options**:
  - `en` - English (default)
  - `af` - Afrikaans
  - `zu` - Zulu
  - `xh` - Xhosa
- **Purpose**: Sets user interface language and localization

## Implementation Details

### Required Controller Methods

#### 1. UserController.getProfile()

```javascript
static async getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        notificationEnabled: user.notification_enabled,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve profile'
    });
  }
}
```

#### 2. UserController.updateProfile()

```javascript
static async updateProfile(req, res) {
  try {
    const { firstName, lastName, email, notificationEnabled, preferredLanguage } = req.body;
    const userId = req.user.id;

    // Check email uniqueness if being changed
    if (email) {
      const emailExists = await User.emailExists(email, userId);
      if (emailExists) {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'An account with this email already exists'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (email !== undefined) updateData.email = email;
    if (notificationEnabled !== undefined) updateData.notification_enabled = notificationEnabled;
    if (preferredLanguage !== undefined) updateData.preferred_language = preferredLanguage;

    const updatedUser = await User.updateProfile(userId, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        notificationEnabled: updatedUser.notification_enabled,
        preferredLanguage: updatedUser.preferred_language,
        updatedAt: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
}
```

#### 3. UserController.updatePassword()

```javascript
static async updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password hash for verification
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await User.updatePassword(userId, newPassword);

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update password'
    });
  }
}
```

### Required Validation Middleware

Add to `/server/middleware/validation.js`:

```javascript
// Password update validation
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  handleValidationErrors
];
```

Update the password route in `/server/routes/users.js`:

```javascript
// PUT /api/users/password - Update password
router.put('/password', authenticateToken, validatePasswordUpdate, asyncHandler(UserController.updatePassword));
```

## Security Considerations

### Authentication & Authorization
- All endpoints require valid JWT authentication
- User can only access/modify their own profile
- Token verification includes user existence check

### Password Security
- Current password verification required for changes
- Strong password requirements enforced
- Passwords hashed with bcrypt (12 salt rounds)
- No password information returned in responses

### Data Protection
- Input validation on all fields
- Email uniqueness enforced at database level
- SQL injection prevention through parameterized queries
- XSS prevention through input sanitization

### Rate Limiting
Consider implementing rate limiting for password change attempts:
- Maximum 5 password change attempts per hour
- Account lockout after multiple failed current password attempts

## Error Handling

### Standard Error Format

All endpoints return consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human readable error message"
}
```

### Validation Errors

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "firstName",
      "message": "First name must be between 2 and 50 characters"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors, incorrect password)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (user not found)
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Testing Strategy

### Unit Tests

```javascript
// tests/unit/UserController.test.js
describe('UserController', () => {
  describe('getProfile', () => {
    test('should return user profile for authenticated user');
    test('should return 404 if user not found');
    test('should handle database errors gracefully');
  });

  describe('updateProfile', () => {
    test('should update user profile successfully');
    test('should prevent email conflicts');
    test('should validate input data');
    test('should handle partial updates');
  });

  describe('updatePassword', () => {
    test('should update password with valid current password');
    test('should reject invalid current password');
    test('should enforce password strength requirements');
    test('should require password confirmation');
  });
});
```

### Integration Tests

```javascript
// tests/integration/profile.test.js
describe('Profile Management API', () => {
  test('GET /api/users/profile - should return authenticated user profile');
  test('PUT /api/users/profile - should update profile with valid data');
  test('PUT /api/users/profile - should reject invalid email format');
  test('PUT /api/users/password - should change password successfully');
  test('PUT /api/users/password - should reject weak passwords');
});
```

### Test Data

Use existing seed data from `/server/seeds/001_users_seed.sql`:
- Test users with different preferences
- Default password: `password123`

## Implementation Checklist

### Files to Modify

- [ ] `/server/controllers/UserController.js` - Implement 3 controller methods
- [ ] `/server/middleware/validation.js` - Add `validatePasswordUpdate`
- [ ] `/server/routes/users.js` - Add password validation to route
- [ ] `/server/tests/` - Add comprehensive test suites

### Database Verification

- [x] Users table schema complete
- [x] Indexes for performance
- [x] Constraints for data integrity
- [x] Triggers for timestamp updates

### Security Checklist

- [ ] JWT authentication on all endpoints
- [ ] Input validation and sanitization
- [ ] Password strength requirements
- [ ] Email uniqueness validation
- [ ] Error message consistency
- [ ] Rate limiting consideration

### Testing Checklist

- [ ] Unit tests for all controller methods
- [ ] Integration tests for all endpoints
- [ ] Error scenario testing
- [ ] Security testing (invalid tokens, etc.)
- [ ] Performance testing with large datasets

## Usage Examples

### Frontend Integration

```javascript
// Get user profile
const getProfile = async () => {
  const response = await fetch('/api/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Update profile
const updateProfile = async (profileData) => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  return response.json();
};

// Change password
const changePassword = async (passwordData) => {
  const response = await fetch('/api/users/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });
  return response.json();
};
```

This guide provides everything needed to implement a secure, robust Profile Management system that integrates seamlessly with the existing Travel-Mate architecture.

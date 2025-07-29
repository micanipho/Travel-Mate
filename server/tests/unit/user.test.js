const User = require('../../models/User')
const UserController = require('../../controllers/UserController')
const AuthController = require('../../controllers/AuthController')
const bcrypt = require('bcryptjs')
const { query } = require('../../config/database')

// Mock the database query function
jest.mock('../../config/database', () => ({
  query: jest.fn()
}))

// Mock bcrypt
jest.mock('bcryptjs')

// Mock the auth middleware
jest.mock('../../middleware/auth', () => ({
  generateToken: jest.fn()
}))

const { generateToken } = require('../../middleware/auth')

// Unit tests for User model and controller
describe('User Tests', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up default mock for generateToken
    generateToken.mockReturnValue('mock-jwt-token')
  })

  describe('User Model', () => {
    test('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        firstName: 'John',
        lastName: 'Doe',
        notificationEnabled: true,
        preferredLanguage: 'en'
      }

      const hashedPassword = 'hashedPassword123'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        notification_enabled: true,
        preferred_language: 'en',
        created_at: new Date()
      }

      bcrypt.hash.mockResolvedValue(hashedPassword)
      query.mockResolvedValue({ rows: [mockUser] })

      const result = await User.create(userData)

      expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword123', 12)
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['test@example.com', hashedPassword, 'John', 'Doe', true, 'en']
      )
      expect(result).toEqual(mockUser)
    })

    test('should find user by email', async () => {
      const email = 'test@example.com'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe'
      }

      query.mockResolvedValue({ rows: [mockUser] })

      const result = await User.findByEmail(email)

      expect(query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      expect(result).toEqual(mockUser)
    })

    test('should verify password', async () => {
      const plainPassword = 'TestPassword123'
      const hashedPassword = 'hashedPassword123'

      bcrypt.compare.mockResolvedValue(true)

      const result = await User.verifyPassword(plainPassword, hashedPassword)

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword)
      expect(result).toBe(true)
    })

    test('should update user profile', async () => {
      const userId = 1
      const updateData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com'
      }

      const mockUpdatedUser = {
        id: 1,
        email: 'jane@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        notification_enabled: true,
        preferred_language: 'en',
        updated_at: new Date()
      }

      query.mockResolvedValue({ rows: [mockUpdatedUser] })

      const result = await User.updateProfile(userId, updateData)

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining(['Jane', 'Smith', 'jane@example.com', userId])
      )
      expect(result).toEqual(mockUpdatedUser)
    })
  })

  describe('User Controller', () => {
    test('should register new user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'TestPassword123',
          firstName: 'John',
          lastName: 'Doe',
          notificationEnabled: true,
          preferredLanguage: 'en'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        notification_enabled: true,
        preferred_language: 'en'
      }

      // Mock User.findByEmail to return null (user doesn't exist)
      query.mockResolvedValueOnce({ rows: [] })
      // Mock User.create to return new user
      query.mockResolvedValueOnce({ rows: [mockUser] })
      
      await AuthController.register(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          notificationEnabled: true,
          preferredLanguage: 'en'
        },
        token: 'mock-jwt-token'
      })
    })

    test('should login user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'TestPassword123'
        }
      }

      const res = {
        json: jest.fn()
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        notification_enabled: true,
        preferred_language: 'en'
      }

      // Mock User.findByEmail
      query.mockResolvedValue({ rows: [mockUser] })
      // Mock password verification
      bcrypt.compare.mockResolvedValue(true)

      await AuthController.login(req, res)

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          notificationEnabled: true,
          preferredLanguage: 'en'
        },
        token: 'mock-jwt-token'
      })
    })

    test('should get user profile', async () => {
      const req = {
        user: { id: 1 }
      }

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        notification_enabled: true,
        preferred_language: 'en',
        created_at: new Date(),
        updated_at: new Date()
      }

      query.mockResolvedValue({ rows: [mockUser] })

      await UserController.getProfile(req, res)

      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile retrieved successfully',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          notificationEnabled: true,
          preferredLanguage: 'en',
          createdAt: mockUser.created_at,
          updatedAt: mockUser.updated_at
        }
      })
    })

    test('should update user profile', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
        body: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com'
        }
      }

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      }

      const mockUpdatedUser = {
        id: 1,
        email: 'jane@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        notification_enabled: true,
        preferred_language: 'en',
        updated_at: new Date()
      }

      // Mock email uniqueness check
      query.mockResolvedValueOnce({ rows: [] })
      // Mock profile update
      query.mockResolvedValueOnce({ rows: [mockUpdatedUser] })

      await UserController.updateProfile(req, res)

      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: {
          id: 1,
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          notificationEnabled: true,
          preferredLanguage: 'en',
          updatedAt: mockUpdatedUser.updated_at
        }
      })
    })
  })
})

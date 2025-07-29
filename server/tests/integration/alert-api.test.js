const request = require('supertest')
const express = require('express')

// Mock the database
jest.mock('../../config/database', () => ({
  query: jest.fn()
}))

// Mock the auth middleware
jest.mock('../../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 1, email: 'test@example.com' }
    next()
  })
}))

// Mock validation middleware with actual validation logic
jest.mock('../../middleware/validation', () => ({
  validateAlert: jest.fn((req, res, next) => {
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required for validation'
      })
    }
    if (req.body.priority && !['low', 'medium', 'high'].includes(req.body.priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be one of: low, medium, high'
      })
    }
    next()
  }),
  validateId: jest.fn((req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
      return res.status(400).json({
        success: false,
        message: 'ID must be a valid number'
      })
    }
    next()
  }),
  validatePagination: jest.fn((req, res, next) => next())
}))

// Mock error handler middleware
jest.mock('../../middleware/errorHandler', () => ({
  asyncHandler: jest.fn((fn) => fn)
}))

const alertRoutes = require('../../routes/alerts')

const { query: mockQuery } = require('../../config/database')

// Create test app
const app = express()
app.use(express.json())
app.use('/api/alerts', alertRoutes)

describe('Alert API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/alerts - Get user alerts endpoint', () => {
    test('should return user alerts with pagination', async () => {
      const mockAlerts = [
        {
          id: 1,
          user_id: 1,
          title: 'Test Alert 1',
          message: 'First test alert',
          priority: 'high',
          status: 'unread',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 1,
          title: 'Test Alert 2',
          message: 'Second test alert',
          priority: 'medium',
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ]

      const mockCountResult = { rows: [{ count: '2' }] }

      mockQuery
        .mockResolvedValueOnce({ rows: mockAlerts })
        .mockResolvedValueOnce(mockCountResult)

      const response = await request(app)
        .get('/api/alerts')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        alerts: mockAlerts,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      })

      expect(mockQuery).toHaveBeenCalledTimes(2)
    })

    test('should handle pagination parameters', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })

      const response = await request(app)
        .get('/api/alerts?page=2&limit=5')
        .expect(200)

      expect(response.body.pagination.page).toBe(2)
      expect(response.body.pagination.limit).toBe(5)
    })

    test('should handle status filter', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })

      await request(app)
        .get('/api/alerts?status=unread')
        .expect(200)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('status = $'),
        expect.arrayContaining([1, 'unread'])
      )
    })

    test('should handle priority filter', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })

      await request(app)
        .get('/api/alerts?priority=high')
        .expect(200)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('priority = $'),
        expect.arrayContaining([1, 'high'])
      )
    })
  })

  describe('POST /api/alerts - Create alert endpoint', () => {
    test('should create new alert successfully', async () => {
      const alertData = {
        title: 'Test Alert',
        message: 'Test message',
        priority: 'high'
      }

      const mockCreatedAlert = {
        id: 1,
        user_id: 1,
        title: alertData.title,
        message: alertData.message,
        priority: alertData.priority,
        status: 'unread',
        created_at: new Date().toISOString()
      }

      mockQuery.mockResolvedValue({ rows: [mockCreatedAlert] })

      const response = await request(app)
        .post('/api/alerts')
        .send(alertData)
        .expect(201)

      expect(response.body).toEqual({
        success: true,
        alert: mockCreatedAlert,
        message: 'Alert created successfully'
      })

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO alerts'),
        [1, alertData.title, alertData.message, alertData.priority]
      )
    })

    test('should create alert with default priority', async () => {
      const alertData = {
        title: 'Test Alert',
        message: 'Test message'
      }

      const mockCreatedAlert = {
        id: 1,
        user_id: 1,
        title: alertData.title,
        message: alertData.message,
        priority: 'medium',
        status: 'unread',
        created_at: new Date().toISOString()
      }

      mockQuery.mockResolvedValue({ rows: [mockCreatedAlert] })

      const response = await request(app)
        .post('/api/alerts')
        .send(alertData)
        .expect(201)

      expect(response.body.alert.priority).toBe('medium')
    })

    test('should validate required title field', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          message: 'Message without title'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('validation')
    })

    test('should validate priority values', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          title: 'Test Alert',
          priority: 'invalid_priority'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PUT /api/alerts/:id/read - Mark alert as read endpoint', () => {
    test('should mark alert as read successfully', async () => {
      const mockUpdatedAlert = {
        id: 1,
        user_id: 1,
        title: 'Test Alert',
        message: 'Test message',
        priority: 'medium',
        status: 'read',
        read_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      mockQuery.mockResolvedValue({ rows: [mockUpdatedAlert] })

      const response = await request(app)
        .put('/api/alerts/1/read')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        alert: mockUpdatedAlert,
        message: 'Alert marked as read'
      })

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE alerts'),
        ['1', 1]
      )
    })

    test('should return 404 for non-existent alert', async () => {
      mockQuery.mockResolvedValue({ rows: [] })

      const response = await request(app)
        .put('/api/alerts/999/read')
        .expect(404)

      expect(response.body).toEqual({
        success: false,
        message: 'Alert not found'
      })
    })

    test('should validate alert ID parameter', async () => {
      const response = await request(app)
        .put('/api/alerts/invalid-id/read')
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/alerts/unread-count - Get unread count endpoint', () => {
    test('should return unread count', async () => {
      mockQuery.mockResolvedValue({ rows: [{ count: '5' }] })

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 5
      })

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)'),
        [1]
      )
    })

    test('should return zero count when no unread alerts', async () => {
      mockQuery.mockResolvedValue({ rows: [{ count: '0' }] })

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 0
      })
    })

    test('should handle database errors gracefully', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Failed to get unread count')
    })
  })

  describe('Error handling', () => {
    test('should handle database connection errors', async () => {
      mockQuery.mockRejectedValue(new Error('Connection failed'))

      const response = await request(app)
        .get('/api/alerts')
        .expect(500)

      expect(response.body.success).toBe(false)
    })

    test('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({}) // Empty body should trigger validation error
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Title is required')
    })
  })
})

// Mock the database query function first
jest.mock('../../config/database', () => ({
  query: jest.fn()
}))

const AlertController = require('../../controllers/AlertController')
const Alert = require('../../models/Alert')
const { query: mockQuery } = require('../../config/database')

// Unit tests for Alert model and controller
describe('Alert Tests', () => {
  let testUser, testAlert

  beforeEach(() => {
    testUser = global.testUtils.createTestUser({ id: 1 })
    testAlert = global.testUtils.createTestAlert({ userId: testUser.id })
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('Alert Model', () => {
    test('should create a new alert', async () => {
      const alertData = {
        userId: testUser.id,
        title: 'Test Alert',
        message: 'Test message',
        priority: 'high'
      }

      const mockResult = { rows: [{ id: 1, ...alertData, status: 'unread', created_at: new Date() }] }
      mockQuery.mockResolvedValue(mockResult)

      const alert = await Alert.create(alertData)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO alerts'),
        [alertData.userId, alertData.title, alertData.message, alertData.priority]
      )
      expect(alert).toEqual(mockResult.rows[0])
    })

    test('should find alerts by user', async () => {
      const mockAlerts = [
        { id: 1, ...testAlert, created_at: new Date() },
        { id: 2, ...testAlert, title: 'Another Alert', created_at: new Date() }
      ]
      const mockCountResult = { rows: [{ count: '2' }] }

      mockQuery
        .mockResolvedValueOnce({ rows: mockAlerts })
        .mockResolvedValueOnce(mockCountResult)

      const result = await Alert.findByUserId(testUser.id, 1, 10)

      expect(result.alerts).toEqual(mockAlerts)
      expect(result.pagination.total).toBe(2)
      expect(result.pagination.pages).toBe(1)
    })

    test('should mark alert as read', async () => {
      const updatedAlert = { ...testAlert, id: 1, status: 'read', read_at: new Date() }
      const mockResult = { rows: [updatedAlert] }
      mockQuery.mockResolvedValue(mockResult)

      const alert = await Alert.markAsRead(1, testUser.id)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE alerts'),
        [1, testUser.id]
      )
      expect(alert.status).toBe('read')
    })

    test('should get unread count', async () => {
      const mockResult = { rows: [{ count: '5' }] }
      mockQuery.mockResolvedValue(mockResult)

      const count = await Alert.getUnreadCount(testUser.id)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)'),
        [testUser.id]
      )
      expect(count).toBe(5)
    })

    test('should delete alert', async () => {
      const deletedAlert = { ...testAlert, id: 1 }
      const mockResult = { rows: [deletedAlert] }
      mockQuery.mockResolvedValue(mockResult)

      const alert = await Alert.delete(1, testUser.id)

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING *',
        [1, testUser.id]
      )
      expect(alert).toEqual(deletedAlert)
    })
  })

  describe('Alert Controller', () => {
    let mockReq, mockRes

    beforeEach(() => {
      mockReq = global.testUtils.createMockReq({
        user: testUser,
        body: {},
        params: {},
        query: {}
      })
      mockRes = global.testUtils.createMockRes()
    })

    test('should create new alert', async () => {
      mockReq.body = {
        title: 'Test Alert',
        message: 'Test message',
        priority: 'high'
      }

      const mockAlert = { id: 1, ...mockReq.body, userId: testUser.id, status: 'unread' }

      // Mock Alert.create
      Alert.create = jest.fn().mockResolvedValue(mockAlert)

      await AlertController.createAlert(mockReq, mockRes)

      expect(Alert.create).toHaveBeenCalledWith({
        userId: testUser.id,
        title: mockReq.body.title,
        message: mockReq.body.message,
        priority: mockReq.body.priority
      })
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        alert: mockAlert,
        message: 'Alert created successfully'
      })
    })

    test('should get user alerts', async () => {
      mockReq.query = { page: '1', limit: '10', status: 'unread' }

      const mockResult = {
        alerts: [{ id: 1, ...testAlert }],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 }
      }

      Alert.findByUserId = jest.fn().mockResolvedValue(mockResult)

      await AlertController.getUserAlerts(mockReq, mockRes)

      expect(Alert.findByUserId).toHaveBeenCalledWith(
        testUser.id,
        1,
        10,
        { status: 'unread', priority: undefined }
      )
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        alerts: mockResult.alerts,
        pagination: mockResult.pagination
      })
    })

    test('should mark alert as read', async () => {
      mockReq.params.id = '1'
      const updatedAlert = { ...testAlert, id: 1, status: 'read' }

      Alert.markAsRead = jest.fn().mockResolvedValue(updatedAlert)

      await AlertController.markAsRead(mockReq, mockRes)

      expect(Alert.markAsRead).toHaveBeenCalledWith('1', testUser.id)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        alert: updatedAlert,
        message: 'Alert marked as read'
      })
    })

    test('should get unread count', async () => {
      Alert.getUnreadCount = jest.fn().mockResolvedValue(3)

      await AlertController.getUnreadCount(mockReq, mockRes)

      expect(Alert.getUnreadCount).toHaveBeenCalledWith(testUser.id)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 3
      })
    })

    test('should handle alert not found when marking as read', async () => {
      mockReq.params.id = '999'

      Alert.markAsRead = jest.fn().mockResolvedValue(null)

      await AlertController.markAsRead(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Alert not found'
      })
    })

    test('should handle errors gracefully', async () => {
      const error = new Error('Database error')
      Alert.getUnreadCount = jest.fn().mockRejectedValue(error)

      await AlertController.getUnreadCount(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to get unread count',
        error: error.message
      })
    })
  })
})

const request = require('supertest')
const app = require('../../server')

// Dedicated tests for the 4 main Alert endpoints
describe('Alert Endpoints - Core Functionality', () => {
  let authToken, testUser

  beforeAll(async () => {
    // Setup test database and user
    await global.testUtils.setupTestDatabase()
  })

  afterAll(async () => {
    // Cleanup test database
    await global.testUtils.cleanupTestDatabase()
  })

  beforeEach(async () => {
    // Create test user and get auth token
    testUser = await global.testUtils.createTestUser({
      email: 'alerttest@example.com',
      password: 'TestPassword123',
      firstName: 'Alert',
      lastName: 'Tester'
    })

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'TestPassword123'
      })
      .expect(200)
    
    authToken = loginResponse.body.token
  })

  afterEach(async () => {
    // Clean up test data after each test
    await global.testUtils.cleanupTestData()
  })

  describe('GET /api/alerts - Get user alerts endpoint', () => {
    test('should return empty alerts list for new user', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        alerts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      })
    })

    test('should return user alerts with correct structure', async () => {
      // Create test alerts
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Alert 1',
          message: 'First test alert',
          priority: 'high'
        })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Alert 2',
          message: 'Second test alert',
          priority: 'medium'
        })

      const response = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.alerts).toHaveLength(2)
      expect(response.body.pagination.total).toBe(2)
      
      // Check alert structure
      const alert = response.body.alerts[0]
      expect(alert).toHaveProperty('id')
      expect(alert).toHaveProperty('title')
      expect(alert).toHaveProperty('message')
      expect(alert).toHaveProperty('priority')
      expect(alert).toHaveProperty('status')
      expect(alert).toHaveProperty('created_at')
    })

    test('should support pagination parameters', async () => {
      // Create multiple alerts
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post('/api/alerts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: `Alert ${i}`,
            message: `Message ${i}`,
            priority: 'medium'
          })
      }

      // Test first page
      const page1Response = await request(app)
        .get('/api/alerts?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(page1Response.body.alerts).toHaveLength(5)
      expect(page1Response.body.pagination.page).toBe(1)
      expect(page1Response.body.pagination.limit).toBe(5)
      expect(page1Response.body.pagination.total).toBe(15)
      expect(page1Response.body.pagination.pages).toBe(3)

      // Test second page
      const page2Response = await request(app)
        .get('/api/alerts?page=2&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(page2Response.body.alerts).toHaveLength(5)
      expect(page2Response.body.pagination.page).toBe(2)
    })

    test('should filter by status', async () => {
      // Create alerts and mark one as read
      const alert1Response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Unread Alert', message: 'This will stay unread' })

      const alert2Response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Read Alert', message: 'This will be marked as read' })

      // Mark second alert as read
      await request(app)
        .put(`/api/alerts/${alert2Response.body.alert.id}/read`)
        .set('Authorization', `Bearer ${authToken}`)

      // Filter by unread status
      const unreadResponse = await request(app)
        .get('/api/alerts?status=unread')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(unreadResponse.body.alerts).toHaveLength(1)
      expect(unreadResponse.body.alerts[0].status).toBe('unread')
      expect(unreadResponse.body.alerts[0].title).toBe('Unread Alert')

      // Filter by read status
      const readResponse = await request(app)
        .get('/api/alerts?status=read')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(readResponse.body.alerts).toHaveLength(1)
      expect(readResponse.body.alerts[0].status).toBe('read')
      expect(readResponse.body.alerts[0].title).toBe('Read Alert')
    })

    test('should filter by priority', async () => {
      // Create alerts with different priorities
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'High Priority', message: 'Important alert', priority: 'high' })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Low Priority', message: 'Less important', priority: 'low' })

      // Filter by high priority
      const highPriorityResponse = await request(app)
        .get('/api/alerts?priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(highPriorityResponse.body.alerts).toHaveLength(1)
      expect(highPriorityResponse.body.alerts[0].priority).toBe('high')
      expect(highPriorityResponse.body.alerts[0].title).toBe('High Priority')
    })

    test('should require authentication', async () => {
      await request(app)
        .get('/api/alerts')
        .expect(401)
    })

    test('should return alerts in descending order by creation date', async () => {
      // Create alerts with slight delay to ensure different timestamps
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'First Alert', message: 'Created first' })

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 10))

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Second Alert', message: 'Created second' })

      const response = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.alerts).toHaveLength(2)
      // Most recent should be first
      expect(response.body.alerts[0].title).toBe('Second Alert')
      expect(response.body.alerts[1].title).toBe('First Alert')
    })
  })

  describe('POST /api/alerts - Create alert endpoint', () => {
    test('should create alert with all fields', async () => {
      const alertData = {
        title: 'Test Alert',
        message: 'This is a comprehensive test alert',
        priority: 'high'
      }

      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(alertData)
        .expect(201)

      expect(response.body).toMatchObject({
        success: true,
        message: 'Alert created successfully'
      })

      const alert = response.body.alert
      expect(alert.title).toBe(alertData.title)
      expect(alert.message).toBe(alertData.message)
      expect(alert.priority).toBe(alertData.priority)
      expect(alert.status).toBe('unread')
      expect(alert.user_id).toBe(testUser.id)
      expect(alert.id).toBeDefined()
      expect(alert.created_at).toBeDefined()
    })

    test('should create alert with default priority when not specified', async () => {
      const alertData = {
        title: 'Default Priority Alert',
        message: 'No priority specified'
      }

      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(alertData)
        .expect(201)

      expect(response.body.alert.priority).toBe('medium')
    })

    test('should create alert with only title (message optional)', async () => {
      const alertData = {
        title: 'Title Only Alert'
      }

      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(alertData)
        .expect(201)

      expect(response.body.alert.title).toBe(alertData.title)
      expect(response.body.alert.message).toBeNull()
    })

    test('should validate required title field', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Invalid Priority Alert',
          priority: 'invalid_priority'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    test('should require authentication', async () => {
      await request(app)
        .post('/api/alerts')
        .send({
          title: 'Unauthorized Alert',
          message: 'This should fail'
        })
        .expect(401)
    })

    test('should handle different priority levels', async () => {
      const priorities = ['low', 'medium', 'high']

      for (const priority of priorities) {
        const response = await request(app)
          .post('/api/alerts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: `${priority} Priority Alert`,
            message: `Alert with ${priority} priority`,
            priority
          })
          .expect(201)

        expect(response.body.alert.priority).toBe(priority)
      }
    })
  })

  describe('PUT /api/alerts/:id/read - Mark alert as read endpoint', () => {
    let testAlertId

    beforeEach(async () => {
      // Create a test alert for each test
      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Alert for Reading',
          message: 'This alert will be marked as read',
          priority: 'medium'
        })

      testAlertId = response.body.alert.id
    })

    test('should mark alert as read successfully', async () => {
      const response = await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: 'Alert marked as read'
      })

      const alert = response.body.alert
      expect(alert.id).toBe(testAlertId)
      expect(alert.status).toBe('read')
      expect(alert.read_at).toBeDefined()
      expect(new Date(alert.read_at)).toBeInstanceOf(Date)
    })

    test('should return updated alert data', async () => {
      const response = await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      const alert = response.body.alert
      expect(alert.title).toBe('Test Alert for Reading')
      expect(alert.message).toBe('This alert will be marked as read')
      expect(alert.priority).toBe('medium')
      expect(alert.status).toBe('read')
    })

    test('should handle already read alert', async () => {
      // Mark as read first time
      await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      // Mark as read second time
      const response = await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.alert.status).toBe('read')
    })

    test('should return 404 for non-existent alert', async () => {
      const response = await request(app)
        .put('/api/alerts/99999/read')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toEqual({
        success: false,
        message: 'Alert not found'
      })
    })

    test('should not allow marking other users alerts as read', async () => {
      // Create another user
      const otherUser = await global.testUtils.createTestUser({
        email: 'other@example.com',
        password: 'OtherPassword123'
      })

      // Login as other user
      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: otherUser.email,
          password: 'OtherPassword123'
        })

      const otherAuthToken = otherLoginResponse.body.token

      // Create alert as other user
      const otherAlertResponse = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send({
          title: 'Other User Alert',
          message: 'This belongs to another user'
        })

      const otherAlertId = otherAlertResponse.body.alert.id

      // Try to mark other user's alert as read with original user's token
      const response = await request(app)
        .put(`/api/alerts/${otherAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      expect(response.body).toEqual({
        success: false,
        message: 'Alert not found'
      })
    })

    test('should require authentication', async () => {
      await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .expect(401)
    })

    test('should validate alert ID parameter', async () => {
      const response = await request(app)
        .put('/api/alerts/invalid-id/read')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    test('should update read_at timestamp', async () => {
      const beforeTime = new Date()

      const response = await request(app)
        .put(`/api/alerts/${testAlertId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      const afterTime = new Date()
      const readAt = new Date(response.body.alert.read_at)

      expect(readAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(readAt.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('GET /api/alerts/unread-count - Get unread count endpoint', () => {
    test('should return zero for user with no alerts', async () => {
      const response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 0
      })
    })

    test('should return correct count for unread alerts', async () => {
      // Create multiple unread alerts
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Unread Alert 1', message: 'First unread' })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Unread Alert 2', message: 'Second unread' })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Unread Alert 3', message: 'Third unread' })

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 3
      })
    })

    test('should not count read alerts', async () => {
      // Create alerts
      const alert1Response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert 1', message: 'Will be read' })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert 2', message: 'Will stay unread' })

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert 3', message: 'Will stay unread' })

      // Mark one as read
      await request(app)
        .put(`/api/alerts/${alert1Response.body.alert.id}/read`)
        .set('Authorization', `Bearer ${authToken}`)

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 2
      })
    })

    test('should only count current users alerts', async () => {
      // Create alerts for current user
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'User 1 Alert', message: 'For current user' })

      // Create another user and their alerts
      const otherUser = await global.testUtils.createTestUser({
        email: 'other@example.com',
        password: 'OtherPassword123'
      })

      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: otherUser.email,
          password: 'OtherPassword123'
        })

      const otherAuthToken = otherLoginResponse.body.token

      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send({ title: 'Other User Alert', message: 'For other user' })

      // Check count for original user
      const response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        count: 1
      })
    })

    test('should require authentication', async () => {
      await request(app)
        .get('/api/alerts/unread-count')
        .expect(401)
    })

    test('should update count in real-time when alerts are marked as read', async () => {
      // Create alerts
      const alert1Response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert 1', message: 'First alert' })

      const alert2Response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert 2', message: 'Second alert' })

      // Check initial count
      let response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.count).toBe(2)

      // Mark one as read
      await request(app)
        .put(`/api/alerts/${alert1Response.body.alert.id}/read`)
        .set('Authorization', `Bearer ${authToken}`)

      // Check updated count
      response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.count).toBe(1)

      // Mark second as read
      await request(app)
        .put(`/api/alerts/${alert2Response.body.alert.id}/read`)
        .set('Authorization', `Bearer ${authToken}`)

      // Check final count
      response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.count).toBe(0)
    })

    test('should return count as number type', async () => {
      await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Alert', message: 'Test message' })

      const response = await request(app)
        .get('/api/alerts/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(typeof response.body.count).toBe('number')
      expect(response.body.count).toBe(1)
    })
  })
})

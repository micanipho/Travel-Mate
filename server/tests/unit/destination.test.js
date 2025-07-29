const request = require('supertest')
const app = require('../app') // Your Express app
const { sequelize } = require('../models') // Sequelize instance
const MonitoredDestination = require('../models/MonitoredDestination')
const DestinationService = require('../services/DestinationService')

// Set up a mock user ID
const mockUserId = 'test-user-123'

beforeAll(async () => {
    await sequelize.sync({ force: true }) // Reset DB
})

afterAll(async () => {
    await sequelize.close()
})

describe('Destination Tests', () => {
    describe('MonitoredDestination Model', () => {
        test('should create a new destination', async () => {
            const destination = await MonitoredDestination.create({
                name: 'Cape Town',
                location: 'Cape Town',
                userId: mockUserId,
                riskLevel: 'Low',
                latitude: -33.9,
                longitude: 18.4
            })

            expect(destination).toHaveProperty('id')
            expect(destination.name).toBe('Cape Town')
        })

        test('should find destinations by user', async () => {
            const destinations = await MonitoredDestination.findAll({
                where: { userId: mockUserId }
            })

            expect(destinations.length).toBeGreaterThan(0)
            expect(destinations[0].userId).toBe(mockUserId)
        })

        test('should update destination', async () => {
            const destination = await MonitoredDestination.findOne({ where: { userId: mockUserId } })
            destination.name = 'Updated Destination'
            await destination.save()

            const updated = await MonitoredDestination.findByPk(destination.id)
            expect(updated.name).toBe('Updated Destination')
        })

        test('should delete destination', async () => {
            const destination = await MonitoredDestination.findOne({ where: { userId: mockUserId } })
            await destination.destroy()

            const deleted = await MonitoredDestination.findByPk(destination.id)
            expect(deleted).toBeNull()
        })
    })

    describe('Destination Controller', () => {
        let token

        beforeAll(() => {
            // Simulate token generation (or mock auth middleware)
            token = 'test-token' // Replace if you're mocking the middleware
        })

        test('should create new destination', async () => {
            const res = await request(app)
                .post('/api/destinations')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Nairobi',
                    location: 'Nairobi',
                    userId: mockUserId
                })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('name', 'Nairobi')
        })

        test('should get user destinations', async () => {
            const res = await request(app)
                .get('/api/destinations')
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })

        test('should update destination', async () => {
            const all = await MonitoredDestination.findAll({ where: { userId: mockUserId } })
            const dest = all[0]

            const res = await request(app)
                .put(`/api/destinations/${dest.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Updated Nairobi', location: 'Nairobi' })

            expect(res.statusCode).toBe(200)
            expect(res.body.name).toBe('Updated Nairobi')
        })

        test('should delete destination', async () => {
            const all = await MonitoredDestination.findAll({ where: { userId: mockUserId } })
            const dest = all[0]

            const res = await request(app)
                .delete(`/api/destinations/${dest.id}`)
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(204)
        })
    })
})

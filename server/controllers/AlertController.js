const Alert = require('../models/Alert')

// Alert Controller - handles alerts and notifications operations
class AlertController {
  // Get all alerts for current user
  static async getUserAlerts (req, res) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const filters = {
        status: req.query.status,
        priority: req.query.priority
      }

      const result = await Alert.findByUserId(userId, page, limit, filters)

      res.json({
        success: true,
        alerts: result.alerts,
        pagination: result.pagination
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alerts',
        error: error.message
      })
    }
  }

  // Create new alert
  static async createAlert (req, res) {
    try {
      const userId = req.user.id
      const { title, message, priority = 'medium' } = req.body

      const alertData = {
        userId,
        title,
        message,
        priority
      }

      const alert = await Alert.create(alertData)

      res.status(201).json({
        success: true,
        alert,
        message: 'Alert created successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create alert',
        error: error.message
      })
    }
  }

  // Get unread alerts count
  static async getUnreadCount (req, res) {
    try {
      const userId = req.user.id
      const count = await Alert.getUnreadCount(userId)

      res.json({
        success: true,
        count
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count',
        error: error.message
      })
    }
  }

  // Get specific alert
  static async getAlert (req, res) {
    try {
      const userId = req.user.id
      const alertId = req.params.id

      const alert = await Alert.findById(alertId, userId)

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      res.json({
        success: true,
        alert
      })
    } catch (error) {
      console.error('Error getting alert:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get alert',
        error: error.message
      })
    }
  }

  // Mark all alerts as read
  static async markAllAsRead (req, res) {
    try {
      const userId = req.user.id
      const updatedCount = await Alert.markAllAsRead(userId)

      res.json({
        success: true,
        message: `${updatedCount} alerts marked as read`,
        updatedCount
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark alerts as read',
        error: error.message
      })
    }
  }

  // Mark alert as read
  static async markAsRead (req, res) {
    try {
      const userId = req.user.id
      const alertId = req.params.id

      const alert = await Alert.markAsRead(alertId, userId)

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      res.json({
        success: true,
        alert,
        message: 'Alert marked as read'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark alert as read',
        error: error.message
      })
    }
  }

  // Mark alert as unread
  static async markAsUnread (req, res) {
    try {
      const userId = req.user.id
      const alertId = req.params.id

      const alert = await Alert.markAsUnread(alertId, userId)

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      res.json({
        success: true,
        alert,
        message: 'Alert marked as unread'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark alert as unread',
        error: error.message
      })
    }
  }

  // Delete alert
  static async deleteAlert (req, res) {
    try {
      const userId = req.user.id
      const alertId = req.params.id

      const alert = await Alert.delete(alertId, userId)

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      res.json({
        success: true,
        message: 'Alert deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete alert',
        error: error.message
      })
    }
  }

  // Get alerts by priority
  static async getAlertsByPriority (req, res) {
    try {
      const priority = req.params.priority
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const result = await Alert.findByPriority(priority, page, limit)

      res.json({
        success: true,
        alerts: result.alerts,
        pagination: result.pagination
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alerts by priority',
        error: error.message
      })
    }
  }
}

module.exports = AlertController

const { query } = require('../config/database')

class Alert {
  // Create a new alert
  static async create (alertData) {
    const { userId, title, message = null, priority = 'medium' } = alertData

    const result = await query(
      `INSERT INTO alerts (user_id, title, message, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, message, priority]
    )

    return result.rows[0]
  }

  // Find alert by ID
  static async findById (id) {
    const result = await query(
      `SELECT a.*, u.first_name, u.last_name, u.email
       FROM alerts a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,
      [id]
    )
    return result.rows[0]
  }

  // Find all alerts for a user
  static async findByUserId (userId, page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let whereClause = 'WHERE user_id = $1'
    const params = [userId]
    let paramCount = 2

    // Add filters
    if (filters.status) {
      whereClause += ` AND status = $${paramCount}`
      params.push(filters.status)
      paramCount++
    }

    if (filters.priority) {
      whereClause += ` AND priority = $${paramCount}`
      params.push(filters.priority)
      paramCount++
    }

    // Add limit and offset at the end
    const queryParams = [...params, limit, offset]
    const limitParam = paramCount
    const offsetParam = paramCount + 1

    const result = await query(
      `SELECT * FROM alerts
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      queryParams
    )

    // Count query for pagination
    const countResult = await query(
      `SELECT COUNT(*) FROM alerts ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      alerts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Find all alerts (admin view)
  static async findAll (page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let whereClause = ''
    const params = [limit, offset]
    let paramCount = 3

    // Build dynamic where clause
    const conditions = []

    if (filters.status) {
      conditions.push(`a.status = $${paramCount}`)
      params.push(filters.status)
      paramCount++
    }

    if (filters.priority) {
      conditions.push(`a.priority = $${paramCount}`)
      params.push(filters.priority)
      paramCount++
    }

    if (filters.userId) {
      conditions.push(`a.user_id = $${paramCount}`)
      params.push(filters.userId)
      paramCount++
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`
    }

    const result = await query(
      `SELECT a.*, u.first_name, u.last_name, u.email
       FROM alerts a
       JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    )

    // Count query for pagination
    const countParams = params.slice(2) // Remove limit and offset
    const countResult = await query(
      `SELECT COUNT(*) FROM alerts a
       JOIN users u ON a.user_id = u.id
       ${whereClause}`,
      countParams
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      alerts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Find alert by ID for specific user
  static async findById (id, userId) {
    const result = await query(
      `SELECT * FROM alerts
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    )
    return result.rows[0]
  }

  // Mark alert as read
  static async markAsRead (id, userId) {
    const result = await query(
      `UPDATE alerts 
       SET status = 'read', read_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    )
    return result.rows[0]
  }

  // Mark alert as unread
  static async markAsUnread (id, userId) {
    const result = await query(
      `UPDATE alerts 
       SET status = 'unread', read_at = NULL
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    )
    return result.rows[0]
  }

  // Delete alert
  static async delete (id, userId) {
    const result = await query(
      'DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    )
    return result.rows[0]
  }

  // Get unread alerts count for user
  static async getUnreadCount (userId) {
    const result = await query(
      "SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND status = 'unread'",
      [userId]
    )
    return parseInt(result.rows[0].count)
  }

  // Mark all alerts as read for user
  static async markAllAsRead (userId) {
    const result = await query(
      `UPDATE alerts 
       SET status = 'read', read_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND status = 'unread'
       RETURNING COUNT(*)`,
      [userId]
    )
    return result.rowCount
  }

  // Get alerts by priority
  static async findByPriority (priority, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const result = await query(
      `SELECT a.*, u.first_name, u.last_name, u.email
       FROM alerts a
       JOIN users u ON a.user_id = u.id
       WHERE a.priority = $1
       ORDER BY a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [priority, limit, offset]
    )

    const countResult = await query(
      'SELECT COUNT(*) FROM alerts WHERE priority = $1',
      [priority]
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      alerts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Delete old alerts (cleanup function)
  static async deleteOldAlerts (daysOld = 30) {
    const result = await query(
      `DELETE FROM alerts 
       WHERE created_at < NOW() - INTERVAL '${daysOld} days'
       RETURNING COUNT(*)`,
      []
    )
    return result.rowCount
  }
}

module.exports = Alert

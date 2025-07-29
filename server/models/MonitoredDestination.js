const { query } = require('../config/database')

class MonitoredDestination {
  // Create a new monitored destination
  static async create (destinationData) {
    const { location, riskLevel, userId, latitude = null, longitude = null } = destinationData

    const result = await query(
      `INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [location, riskLevel, userId, latitude, longitude]
    )

    return result.rows[0]
  }

  // Find destination by ID
  static async findById (id) {
    const result = await query(
      `SELECT md.*, u.first_name, u.last_name, u.email
       FROM monitored_destinations md
       JOIN users u ON md.user_id = u.id
       WHERE md.id = $1`,
      [id]
    )
    return result.rows[0]
  }

  // Find all destinations for a user
  static async findByUserId (userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const result = await query(
      `SELECT * FROM monitored_destinations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )

    const countResult = await query(
      'SELECT COUNT(*) FROM monitored_destinations WHERE user_id = $1',
      [userId]
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      destinations: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Find all destinations (admin view)
  static async findAll (page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let whereClause = ''
    const params = [limit, offset]
    let paramCount = 3

    // Build dynamic where clause
    const conditions = []

    if (filters.riskLevel) {
      conditions.push(`md.risk_level = $${paramCount}`)
      params.push(filters.riskLevel)
      paramCount++
    }

    if (filters.location) {
      conditions.push(`md.location ILIKE $${paramCount}`)
      params.push(`%${filters.location}%`)
      paramCount++
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`
    }

    const result = await query(
      `SELECT md.*, u.first_name, u.last_name, u.email
       FROM monitored_destinations md
       JOIN users u ON md.user_id = u.id
       ${whereClause}
       ORDER BY md.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    )

    // Count query for pagination
    const countParams = params.slice(2) // Remove limit and offset
    const countResult = await query(
      `SELECT COUNT(*) FROM monitored_destinations md
       JOIN users u ON md.user_id = u.id
       ${whereClause}`,
      countParams
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      destinations: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Update destination
  static async update (id, updateData, userId) {
    const allowedFields = ['location', 'risk_level', 'latitude', 'longitude']
    const updates = []
    const values = []
    let paramCount = 1

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`)
        values.push(updateData[key])
        paramCount++
      }
    })

    if (updates.length === 0) {
      throw new Error('No valid fields to update')
    }

    // Add updated_at and last_checked timestamps
    updates.push('updated_at = CURRENT_TIMESTAMP')
    updates.push('last_checked = CURRENT_TIMESTAMP')

    values.push(id, userId)

    const result = await query(
      `UPDATE monitored_destinations 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      values
    )

    return result.rows[0]
  }

  // Delete destination
  static async delete (id, userId) {
    const result = await query(
      'DELETE FROM monitored_destinations WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    )
    return result.rows[0]
  }

  // Update last checked timestamp
  static async updateLastChecked (id) {
    const result = await query(
      `UPDATE monitored_destinations 
       SET last_checked = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    )
    return result.rows[0]
  }

  // Get destinations by risk level
  static async findByRiskLevel (riskLevel, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const result = await query(
      `SELECT md.*, u.first_name, u.last_name
       FROM monitored_destinations md
       JOIN users u ON md.user_id = u.id
       WHERE md.risk_level = $1
       ORDER BY md.last_checked ASC
       LIMIT $2 OFFSET $3`,
      [riskLevel, limit, offset]
    )

    const countResult = await query(
      'SELECT COUNT(*) FROM monitored_destinations WHERE risk_level = $1',
      [riskLevel]
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      destinations: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Search destinations by location
  static async searchByLocation (searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const result = await query(
      `SELECT md.*, u.first_name, u.last_name
       FROM monitored_destinations md
       JOIN users u ON md.user_id = u.id
       WHERE md.location ILIKE $1
       ORDER BY md.created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    )

    const countResult = await query(
      'SELECT COUNT(*) FROM monitored_destinations WHERE location ILIKE $1',
      [`%${searchTerm}%`]
    )
    const total = parseInt(countResult.rows[0].count)

    return {
      destinations: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}

module.exports = MonitoredDestination

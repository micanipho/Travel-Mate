const { query } = require('../config/database')
const bcrypt = require('bcryptjs')

class User {
  // Create a new user
  static async create (userData) {
    const { email, password, firstName, lastName, notificationEnabled = true, preferredLanguage = 'en' } = userData
    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, notification_enabled, preferred_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, notification_enabled, preferred_language, created_at`,
      [email, passwordHash, firstName, lastName, notificationEnabled, preferredLanguage]
    )

    return result.rows[0]
  }

  // Find user by email
  static async findByEmail (email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  }

  // Find user by ID
  static async findById (id) {
    const result = await query(
      'SELECT id, email, first_name, last_name, notification_enabled, preferred_language, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  // Verify password
  static async verifyPassword (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  // Update user profile
  static async updateProfile (id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'email', 'notification_enabled', 'preferred_language']
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

    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, first_name, last_name, notification_enabled, preferred_language, updated_at`,
      values
    )

    return result.rows[0]
  }

  // Update password
  static async updatePassword (id, newPassword) {
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    const result = await query(
      `UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
       RETURNING id, email, first_name, last_name`,
      [passwordHash, id]
    )

    return result.rows[0]
  }

  // Get all users (admin function)
  static async findAll (page = 1, limit = 10) {
    const offset = (page - 1) * limit
    const result = await query(
      `SELECT id, email, first_name, last_name, notification_enabled, preferred_language, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    const countResult = await query('SELECT COUNT(*) FROM users')
    const total = parseInt(countResult.rows[0].count)

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Delete user (soft delete by updating email)
  static async delete (id) {
    const result = await query(
      `UPDATE users SET 
         email = CONCAT('deleted_', id, '_', email),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id`,
      [id]
    )

    return result.rows[0]
  }

  // Check if email exists
  static async emailExists (email, excludeId = null) {
    let queryText = 'SELECT id FROM users WHERE email = $1'
    const params = [email]

    if (excludeId) {
      queryText += ' AND id != $2'
      params.push(excludeId)
    }

    const result = await query(queryText, params)
    return result.rows.length > 0
  }

  // Save password reset token
  static async saveResetToken (userId, resetToken, resetTokenExpiry) {
    // Hash the reset token for security
    const saltRounds = 12
    const hashedToken = await bcrypt.hash(resetToken, saltRounds)

    const result = await query(
      `UPDATE users SET
       reset_token_hash = $1,
       reset_token_expiry = $2,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, first_name`,
      [hashedToken, resetTokenExpiry, userId]
    )

    return result.rows[0]
  }

  // Find user by reset token
  static async findByResetToken (resetToken) {
    // Get all users with non-expired reset tokens
    const result = await query(
      `SELECT id, email, first_name, last_name, reset_token_hash, reset_token_expiry
       FROM users
       WHERE reset_token_hash IS NOT NULL
       AND reset_token_expiry > CURRENT_TIMESTAMP`,
      []
    )

    // Check each user's hashed token against the provided token
    for (const user of result.rows) {
      const isValidToken = await bcrypt.compare(resetToken, user.reset_token_hash)
      if (isValidToken) {
        return user
      }
    }

    return null
  }



  // Clear reset token after successful password reset
  static async clearResetToken (userId) {
    const result = await query(
      `UPDATE users SET
       reset_token_hash = NULL,
       reset_token_expiry = NULL,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, first_name, last_name`,
      [userId]
    )

    return result.rows[0]
  }
}

module.exports = User

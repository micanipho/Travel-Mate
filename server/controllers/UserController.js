const User = require('../models/User')

class UserController {
  // Get current user profile
  static async getProfile (req, res) {
    try {
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User profile not found'
        })
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
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve profile'
      })
    }
  }

  // Update current user profile
  static async updateProfile (req, res) {
    try {
      const { firstName, lastName, email, notificationEnabled, preferredLanguage } = req.body
      const userId = req.user.id

      // Check email uniqueness if being changed
      if (email) {
        const shouldReturn = await UserController.checkEmailUniqueness(res, email, userId)
        if (shouldReturn) return
      }

      // Prepare update data
      const updateData = UserController.prepareUpdateData({
        firstName,
        lastName,
        email,
        notificationEnabled,
        preferredLanguage
      })

      const updatedUser = await User.updateProfile(userId, updateData)

      UserController.sendSuccessResponse(res, updatedUser)
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update profile'
      })
    }
  }

  static async checkEmailUniqueness (res, email, userId) {
    const emailExists = await User.emailExists(email, userId)
    if (emailExists) {
      res.status(409).json({
        error: 'Email already exists',
        message: 'An account with this email already exists'
      })
      return true
    }
    return false
  }

  static prepareUpdateData ({ firstName, lastName, email, notificationEnabled, preferredLanguage }) {
    const updateData = {}
    if (firstName !== undefined) updateData.first_name = firstName
    if (lastName !== undefined) updateData.last_name = lastName
    if (email !== undefined) updateData.email = email
    if (notificationEnabled !== undefined) updateData.notification_enabled = notificationEnabled
    if (preferredLanguage !== undefined) updateData.preferred_language = preferredLanguage
    return updateData
  }

  static sendSuccessResponse (res, updatedUser) {
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
    })
  }

  // Update password
  static async updatePassword (req, res) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.user.id

      // Get user with password hash for verification
      const user = await User.findByEmail(req.user.email)
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User account not found'
        })
      }

      // Verify current password
      const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password_hash)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'Current password is incorrect'
        })
      }

      // Update password
      await User.updatePassword(userId, newPassword)

      res.json({
        message: 'Password updated successfully'
      })
    } catch (error) {
      console.error('Update password error:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update password'
      })
    }
  }

  // Get all users (admin only)
  static async getAllUsers (req, res) {
    // TODO: Implement get all users functionality
  }

  // Get user by ID (admin only)
  static async getUserById (req, res) {
    // TODO: Implement get user by ID functionality
  }

  // Delete user (admin only)
  static async deleteUser (req, res) {
    // TODO: Implement delete user functionality
  }
}

module.exports = UserController

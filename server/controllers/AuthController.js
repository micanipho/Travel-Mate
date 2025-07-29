const User = require('../models/User')
const { generateToken } = require('../middleware/auth')
const crypto = require('crypto')
const EmailService = require('../services/EmailService')

class AuthController {
  // Register new user
  static async register (req, res) {
    const { email, password, firstName, lastName, notificationEnabled, preferredLanguage } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      })
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      notificationEnabled,
      preferredLanguage
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        notificationEnabled: user.notification_enabled,
        preferredLanguage: user.preferred_language
      },
      token
    })
  }

  // User login
  static async login (req, res) {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        notificationEnabled: user.notification_enabled,
        preferredLanguage: user.preferred_language
      },
      token
    })
  }

  // User logout
  static async logout (req, res) {
    // In a stateless JWT system, logout is handled client-side
    // Here we could implement token blacklisting if needed
    res.json({
      message: 'Logout successful'
    })
  }

  // Verify token
  static async verify (req, res) {
    // If we reach here, the token is valid (middleware already verified it)
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found'
      })
    }

    res.json({
      message: 'Token is valid',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        notificationEnabled: user.notification_enabled,
        preferredLanguage: user.preferred_language
      }
    })
  }

  // Refresh token
  static async refresh (req, res) {
    // For now, we'll just generate a new token
    // In a more sophisticated system, we'd use refresh tokens
    const token = generateToken(req.user.id)

    res.json({
      message: 'Token refreshed successfully',
      token
    })
  }

  // Forgot password
  static async forgotPassword (req, res) {
    try {
      const { email } = req.body

      // Check if user exists
      const user = await User.findByEmail(email)
      if (user) {
        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        // Save token to database
        await User.saveResetToken(user.id, resetToken, resetTokenExpiry)

        // Send password reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        await EmailService.sendPasswordResetEmail(user.email, resetUrl)
      }

      // Always return same message for security (don't reveal if email exists)
      res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    } catch (error) {
      console.error('Error in forgotPassword:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process password reset request'
      })
    }
  }

  // Reset password (placeholder)
  static async resetPassword (req, res) {
    const { token, newPassword } = req.body
    const user = await User.findByResetToken(token)
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid token'
      })
    }
    if (user.reset_token_expiry < new Date()) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token expired'
      })
    }
    const passwordValidation = this.validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Password does not meet requirements'
      })
    }
    // For now, just return success message
    res.json({
      message: 'Password reset functionality not yet implemented'
    })
  }

  static validatePassword (password) {
    if (!password || password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' }
    }
    if (!/(?=.*\d)(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter, and number' }
    }
    return { valid: true }
  }
}

module.exports = AuthController

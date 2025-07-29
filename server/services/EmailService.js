const nodemailer = require('nodemailer')

class EmailService {
  /**
   * Create email transporter
   */
  static createTransporter () {
    // For development - just log emails instead of sending
    if (process.env.NODE_ENV === 'development') {
      return {
        sendMail: async (mailOptions) => {
          console.log('📧 Email would be sent:')
          console.log('📧 To:', mailOptions.to)
          console.log('📧 Subject:', mailOptions.subject)
          console.log('📧 Content:', mailOptions.text || 'HTML content')
          return { messageId: 'dev-' + Date.now() }
        }
      }
    }

    // Production: Use real email service (Gmail example)
    return nodemailer.createTransporter({
      service: 'gmail', // or use host/port
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail (email, resetUrl, firstName = '') {
    try {
      const transporter = this.createTransporter()

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@travelmate.com',
        to: email,
        subject: 'Password Reset - Travel Mate',
        text: `
Hello ${firstName},

You requested a password reset for your Travel Mate account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Travel Mate Team
        `,
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${firstName},</p>
          <p>You requested a password reset for your Travel Mate account.</p>
          <p><a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Travel Mate Team</p>
        `
      }

      const result = await transporter.sendMail(mailOptions)

      console.log('✅ Password reset email sent successfully')
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error.message)

      // In development, still log the reset URL for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Reset URL for testing:', resetUrl)
      }

      throw new Error('Failed to send password reset email')
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail (email, firstName = '') {
    try {
      const transporter = this.createTransporter()

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@travelmate.com',
        to: email,
        subject: 'Welcome to Travel Mate! 🚗',
        text: `
Hello ${firstName},

Welcome to Travel Mate!

You can now:
- Track taxi routes
- Receive alerts
- Connect with the community

Start exploring your account today!

Best regards,
Travel Mate Team
        `,
        html: `
          <h2>Welcome to Travel Mate! 🚗</h2>
          <p>Hello ${firstName},</p>
          <p>Welcome to Travel Mate!</p>
          <p>You can now:</p>
          <ul>
            <li>Track taxi routes</li>
            <li>Receive alerts</li>
            <li>Connect with the community</li>
          </ul>
          <p>Start exploring your account today!</p>
          <p>Best regards,<br>Travel Mate Team</p>
        `
      }

      const result = await transporter.sendMail(mailOptions)

      console.log('✅ Welcome email sent successfully')
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message)
      // Don't throw error for welcome email - it's not critical
      return { success: false, error: error.message }
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration () {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email service ready (development mode - emails will be logged)')
        return { success: true, message: 'Development mode - emails will be logged' }
      }

      const transporter = this.createTransporter()
      await transporter.verify()

      console.log('✅ Email configuration is valid')
      return { success: true, message: 'Email configuration is valid' }
    } catch (error) {
      console.error('❌ Email configuration test failed:', error.message)
      return { success: false, error: error.message }
    }
  }
}

module.exports = EmailService

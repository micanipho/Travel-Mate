const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation')
const { asyncHandler } = require('../middleware/errorHandler')
const AuthController = require('../controllers/AuthController')

// POST /api/auth/register - Register new user
router.post('/register', validateUserRegistration, asyncHandler(AuthController.register))

// POST /api/auth/login - User login
router.post('/login', validateUserLogin, asyncHandler(AuthController.login))

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, asyncHandler(AuthController.logout))

// GET /api/auth/verify - Verify token
router.get('/verify', authenticateToken, asyncHandler(AuthController.verify))

// POST /api/auth/refresh - Refresh token
router.post('/refresh', asyncHandler(AuthController.refresh))

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', asyncHandler(AuthController.forgotPassword))

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', asyncHandler(AuthController.resetPassword))

module.exports = router

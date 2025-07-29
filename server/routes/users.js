const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate, validatePasswordUpdate, validatePagination } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const UserController = require('../controllers/UserController');

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticateToken, asyncHandler(UserController.getProfile));

// PUT /api/users/profile - Update current user profile
router.put('/profile', authenticateToken, validateProfileUpdate, asyncHandler(UserController.updateProfile));

// PUT /api/users/password - Update password
router.put('/password', authenticateToken, validatePasswordUpdate, asyncHandler(UserController.updatePassword));

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, validatePagination, asyncHandler(UserController.getAllUsers));

// GET /api/users/:id - Get user by ID (admin only)
router.get('/:id', authenticateToken, asyncHandler(UserController.getUserById));

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticateToken, asyncHandler(UserController.deleteUser));

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateAlert, validateId, validatePagination } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const AlertController = require('../controllers/AlertController');

// GET /api/alerts - Get all alerts for current user
router.get('/', authenticateToken, validatePagination, asyncHandler(AlertController.getUserAlerts));

// POST /api/alerts - Create new alert
router.post('/', authenticateToken, validateAlert, asyncHandler(AlertController.createAlert));

// GET /api/alerts/unread-count - Get unread alerts count
router.get('/unread-count', authenticateToken, asyncHandler(AlertController.getUnreadCount));

// PUT /api/alerts/mark-all-read - Mark all alerts as read
router.put('/mark-all-read', authenticateToken, asyncHandler(AlertController.markAllAsRead));

// GET /api/alerts/:id - Get specific alert
router.get('/:id', authenticateToken, validateId, asyncHandler(AlertController.getAlert));

// PUT /api/alerts/:id/read - Mark alert as read
router.put('/:id/read', authenticateToken, validateId, asyncHandler(AlertController.markAsRead));

// PUT /api/alerts/:id/unread - Mark alert as unread
router.put('/:id/unread', authenticateToken, validateId, asyncHandler(AlertController.markAsUnread));

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', authenticateToken, validateId, asyncHandler(AlertController.deleteAlert));

// GET /api/alerts/priority/:priority - Get alerts by priority
router.get('/priority/:priority', authenticateToken, validatePagination, asyncHandler(AlertController.getAlertsByPriority));

module.exports = router;

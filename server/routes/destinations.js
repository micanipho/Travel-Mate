const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateDestination, validateId, validatePagination } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const DestinationController = require('../controllers/DestinationController');

// GET /api/destinations - Get all destinations for current user
router.get('/', authenticateToken, validatePagination, asyncHandler(DestinationController.getUserDestinations));

// POST /api/destinations - Create new destination
router.post('/', authenticateToken, validateDestination, asyncHandler(DestinationController.createDestination));

// GET /api/destinations/:id - Get specific destination
router.get('/:id', authenticateToken, validateId, asyncHandler(DestinationController.getDestination));

// PUT /api/destinations/:id - Update destination
router.put('/:id', authenticateToken, validateId, validateDestination, asyncHandler(DestinationController.updateDestination));

// DELETE /api/destinations/:id - Delete destination
router.delete('/:id', authenticateToken, validateId, asyncHandler(DestinationController.deleteDestination));

// PUT /api/destinations/:id/check - Update last checked timestamp
router.put('/:id/check', authenticateToken, validateId, asyncHandler(DestinationController.updateLastChecked));

// GET /api/destinations/search/:term - Search destinations by location
router.get('/search/:term', authenticateToken, validatePagination, asyncHandler(DestinationController.searchDestinations));

// GET /api/destinations/risk/:level - Get destinations by risk level
router.get('/risk/:level', authenticateToken, validatePagination, asyncHandler(DestinationController.getDestinationsByRisk));

module.exports = router;

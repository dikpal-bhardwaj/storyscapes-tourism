const express = require('express');
const router = express.Router();
const { 
    getDestinations, 
    getDestination,
    seedDestinations, 
    createDestination, 
    updateDestination, 
    deleteDestination 
} = require('../controllers/destinationController');

const { protect, admin } = require('../middleware/authMiddleware');

// Base routes
router.get('/', getDestinations); 
router.post('/seed', protect, admin, seedDestinations);
router.post('/', protect, admin, createDestination);

// ID specific routes
router.route('/:id')
    .get(getDestination)
    .put(protect, admin, updateDestination)
    .delete(protect, admin, deleteDestination);

module.exports = router;

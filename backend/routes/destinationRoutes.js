const express = require('express');
const router = express.Router();
const { getDestinations, seedDestinations } = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.post('/seed', protect, admin, seedDestinations);

module.exports = router;
